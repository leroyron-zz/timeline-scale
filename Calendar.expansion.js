/**
 * Building Calendar Class: Expansion
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Calendar) {
    //Class Struct prototype
    var _struct = Calendar.prototype
    var that = _struct.expansion = {}
    //Class Declarations
    
    //Private

    //Public

    //Class Init
    that.Init = function (calendar) {
        //Private
        var ctx = calendar.ctx
        var container = ctx.container
        var CL = ctx.CL
        var TL = ctx.TL
        var TC = ctx.TC
        var style = ctx.style

        var phases = calendar.phases
        var frequencies = phases.frequencies

        var events = calendar.events
        var retract = events.retract
        var dragScroll = events.dragScroll

        var generate = calendar.generate
        
        var expansion = this

        var mouse = this.mouse = {x: 0, y: 0}

        //Public
        var expand = this.expand = {
            percent: 0.0, offset: 0.0, value: 0.0, in: 0.0, out: 0.0, min: 0.0, max: 0.0, freq: {},
            enter: function () {
                // assigning expand parameters
                // assign freq to main expansion
                this.freq.min = phases.currentFrequency.span// 50
                this.freq.max = phases.nextFrequency.bands * phases.nextFrequency.span// 600

                this.freq.units = phases.nextFrequency.bands

                this.min = phases.currentFrequency.bands * phases.currentFrequency.span// 700
                this.max = phases.currentFrequency.bands * this.freq.max// 8400

                this.value = this.in = 100 / phases.currentFrequency.bands
                this.out = (100 / phases.currentFrequency.bands) * (this.max / this.min)
            }
        }
        
        this.expansion = function () {
            _onexpansion = this.onexpansion = function (p) {
                if (expand.percent+p < 0 || expand.percent+p > 10) {
                    return expand.percent/10
                }
                expand.percent += p;
                expand.percent = expand.percent < 0 
                ? expand.percent = 0
                : expand.percent > 10 
                ? expand.percent = 10 : expand.percent

                var percent = expand.percent/10
                events.deltaX = mouse.x
                var percentValue = (expand.out - expand.in) * percent
                var widthValue = (expand.freq.max - expand.freq.min) * percent
                //*var CLpercent = events.deltaX/CL.clientWidth
                if (expansion.centerFreq) TC.select = TC.children[expansion.centerFreq]
                //var TC.percent = events.deltaX/(TC.clientWidth)
                //*console.log(deltaTCSelectLeft)
                TC.percent = events.deltaX/(TC.clientWidth)
                TC.spanPercent = TC.percent*expand.offset
                if (TC.select) {
                    var deltaTCSelectLeft = events.deltaX = TC.select.offsetLeft
                    var left = TC.offsetLeft
                    TC.percent = events.deltaX/(TC.clientWidth)
                    TC.spanPercent = TC.percent*expand.offset
                    TC.select.style.color = '#FFA218'
                }
                TC.locator.style.left = (TC.spanPercent*100)+'%'
            
                expand.value = (expand.in+percentValue)
                expand.offset = expand.in/expand.value
                style.freqs.width = expand.value+"%";
                style.freqs.minWidth = Math.ceil(expand.freq.min+widthValue)+"px";
                
                // RESIZE -- re/assign offsets
                TC.track._resize()
                if (TC.select) {
                    var TCSelectLeft = TC.select.offsetLeft
                    left = TCSelectLeft > deltaTCSelectLeft ? (TCSelectLeft-deltaTCSelectLeft) : (deltaTCSelectLeft-TCSelectLeft)
                    CL.locator.style.left = left+'px'
                }
                // RESIZE
                //*console.log('scale%: '+expand.percent+' TC.spanPercent: '+(TC.spanPercent*100))
                
                //*console.log('left: '+this.leftRes+' osf: '+divRightRetract.offsetLeft)
                TC.style.left = (CL.locator.offsetLeft-TC.locator.offsetLeft)+'px'
                //debugger
                mouse.x = CL.locator.offsetLeft - (CL.offsetLeft+TC.offsetLeft) + CL.offsetLeft + container.scrollLeft
                //*console.log(CL.locator.offsetLeft-TC.locator.offsetLeft)
                //widthValue = (expand.max - expand.min) * expand.percent
                //TC.style.minWidth = Math.ceil(expand.min+widthValue)+'px'
                return percent
            }
            this.expansionCalls = []
            this.expansionCallbacks = function (p) {
                for (let e = 0; e < this.expansionCalls.length; e++) {
                    if (this.expansionCalls[e]._expansion) this.expansionCalls[e]._expansion(p); else this.expansionCalls[e](p)
                }
            }
            this.onExpansion = function (p) {
                this.expansionCallbacks(p)
            }
            var zoom = function (zoom) {
                if (zoom < 0) {
                    expansion.onExpansion(expansion.onexpansion(-1))
                } else {
                    expansion.onExpansion(expansion.onexpansion(1))
                }
                events._resize()
                expansion.update()
            }
            
            return zoom
        }

        this.range = { left: 0, right: 0}// get current date 
        this.update = function () {
            var widthRange = TC.track.width/phases.currentFrequency.bands
            
            if (!this.range.elements) {// new element range finder when 'undefined'
                this.range.elements = phases.elements[phases.currentFrequency.name]
                this.range.list = this.range.elements.list 
                this.range.length = Object.keys(this.range.list).length
                this.range.tick = 0
            }
            this.range.expand = Math.floor(this.range.length - this.range.length/(10/expand.percent))
            
            this.range.left = Math.floor(TC.locator.offsetLeft / widthRange) - this.range.expand
            
            this.range.right = Math.floor(TC.locator.offsetLeft  / widthRange) + this.range.expand
            if (!widthRange || this.range.left == this.range.tick) // optimize with tick
                return;

            this.range.tick = this.range.left

            this.range.left = this.range.left < 0 ? 0 : this.range.left > this.range.length - 1 ? this.range.length - 1 : this.range.left

            console.log('dd', this.range.tick)

            this.range.right = this.range.right < 0 ? 0 : this.range.right > this.range.length - 1 ? this.range.length - 1 : this.range.right
            
            this.range.start = this.range.left - 1
            this.range.start = this.range.start < 0 ? 0 : this.range.start
            this.range.end = this.range.right + 1
            this.range.end = this.range.end > this.range.length - 1 ? this.range.length - 1 : this.range.end
            this.start = this.range.list[Object.keys(this.range.list)[this.range.start]]
            this.end = this.range.list[Object.keys(this.range.list)[this.range.end]]

            generate.degen(phases.currentFrequency, this.range.start, this.range.end)
            generate.regen(phases.currentFrequency, this.range.start, this.range.end)
            
            ctx.output('Optimization Draw Range:'+this.start.span.label.innerText+' '+ this.end.span.label.innerText)
        }

        events._resize = function () {
            // snapping
            expansion.leftOffset < 0.01 ? expansion.leftOffset = 0.0 : expansion.leftOffset > 0.95 ? expansion.leftOffset = 0.95 : expansion.leftOffset
            expansion.rightRetract + expansion.leftOffset > 0.98 ? expansion.rightRetract = 1.0 - expansion.leftOffset : expansion.rightRetract < 0.05 ? expansion.rightRetract = 0.05 : expansion.rightRetract
    
            // retracting
            container.width = container.clientWidth || app.width
            expansion.width = (container.width * expansion.rightRetract)
            TC.width = expansion.width < expand.min ? expand.min : expansion.width > expand.max ? expand.max : expansion.width
            //expansion.TC.width -= 10
            TC.left = TC.offsetLeft
    
            // center locator when timeline retracts
            // RESIZE -- re/assign offsets - delta
            var deltaTCLocatorLeft = TC.locator.offsetLeft
            
            CL.style.left = (expansion.leftOffset * container.width) + 'px'
            CL.style.width = expansion.width + 'px'
            TL.style.width = container.width + 'px'
            
            TC.style.width = TC.width + 'px'
            TC.track.width = TC.width * (TC.track.scale / 100)
            var TCLocatorLeft = TC.locator.offsetLeft
            // RESIZE -- re/assign offsets - delta
            TC.left += (deltaTCLocatorLeft-TCLocatorLeft)
            var leftRes = (TCLocatorLeft+TC.left)
            //*console.log('left: '+expansion.leftRes+' osf: '+divRightRetract.offsetLeft)
            if (expansion.width > 100) {
                TC.left -= CL.retract.right.offsetLeft-50 < leftRes ? (leftRes-CL.retract.right.offsetLeft)+50 : 0
    
                TC.left -= CL.retract.left.offsetLeft+50 > leftRes ? (leftRes-CL.retract.left.offsetLeft)-50 : 0
            }
    
            TC.style.left = TC.left+'px'
    
            // ADJUSTMENTS - TODO Add easing
            if (TC.offsetLeft+TC.track.clientWidth < CL.clientWidth) {
                TC.style.left = '5px'
            }
            if (TC.track.clientWidth == (CL.clientWidth)) {
                TC.style.left = '5px'
            }
        }

        events._onmousemove = function (e) {
            e.preventDefault()
            if (retract.mode) {
                return
            }
            
            events.deltaX = e.pageX - CL.offsetLeft + container.scrollLeft
    
            CL.percent = events.deltaX/CL.clientWidth
            CL.locator.style.left = (CL.percent*100)+'%'
    
            events.deltaX = e.pageX - (CL.offsetLeft+TC.offsetLeft) + container.scrollLeft
            TC.percent = (events.deltaX/(TC.clientWidth))*expand.offset
            //TC.locator.style.left = (TC.percent*100)+'%'
    
            // center
            events.deltaCenterX = ((CL.clientWidth/2) + (CL.offsetLeft + container.scrollLeft)) - (CL.offsetLeft+TC.offsetLeft) + container.scrollLeft
            TC.centerPercent = events.deltaCenterX/(TC.clientWidth)
            //TC.locator.style.left = (TC.centerPercent*100)+'%'
            // 0.07035755478662054 .......
            TC.spanPercent = TC.percent*expand.offset
            //*console.clear()
            // TC.spanPercent GOOD FOR TIMESTAMP INSERT RE/POSITIONING, end to end
            //*console.log('calendar%:'+CL.percent+' - timecode%:'+TC.percent+' - timespan%:'+TC.spanPercent+' - centerspan%:'+TC.centerPercent)
            //*console.log('CL.locator: '+CL.locator.offsetLeft+' TC.locator: '+TC.locator.offsetLeft+' ')
            //// 
            mouse.x = events.deltaX
            //expansion.update()
        }
        CL.addEventListener('mousemove', events._onmousemove)

        events._ondrag = function (e) {
            e.preventDefault()
    
            events.mouseX = e.pageX - TL.offsetLeft + container.scrollLeft
            
            TL.style.cursor = 'pointer'
            if (retract.mode == 'center') {
                dragScroll.endX = events.mouseX
                var scrollRate = (dragScroll.startX-dragScroll.endX)*(expand.value/500)
                var width = (container.width * calendar.rightRetract)
                var leftTC = TC.offsetLeft
                var leftTCLocator = TC.locator.offsetLeft
                
                dragScroll.rate = scrollRate * 0.25
    
                if (!dragScroll.interval) {
                    clearInterval(dragScroll.interval)
                    dragScroll.interval = setInterval(function () {
                        leftTC += dragScroll.rate
                        leftTCLocator -= dragScroll.rate
                        //leftRes = (leftTC)
                        TC.style.left = leftTC+'px'
                        TC.locator.style.left = leftTCLocator+'px'
                        expansion.update()
                    }, 10)
                }
            } else if (retract.mode == 'left') {
                expansion.leftOffset = events.mouseX / container.width
                var constrict = (events.mouseX + expansion.width) / container.width
                if (constrict > 1)
                    expansion.rightRetract -= (events.mouseX + expansion.width) / container.width - 1
                    events._resize()
            } else if (retract.mode == 'right') {
                expansion.rightRetract = (events.mouseX - (expansion.leftOffset * container.width)) / container.width
                events._resize()
            }
            //
            expansion.update()
        }

        this.leftOffset = 0.0
        this.rightRetract = 1.0
        TC.track._resize = function () {
            this.scale = phases.currentFrequency ? (expand.value*phases.currentFrequency.bands) : 100
            this.width = TC.width * (this.scale / 100)
            this.style.width = this.scale + '%'
        }
        window.resizeCalls.push(TC.track)
        this._resize = function () {
            this.update()
        }
        window.resizeCalls.push(this)
        expand.enter()
        this.handle = this.expansion()
        Wheel(CL.track, this.handle)
        this.onexpansion(0.0)
        var phaseChange = function (p) {
            console.log(p)
        }
        this.expansionCalls.push(phaseChange)
    }
})(this.Calendar)