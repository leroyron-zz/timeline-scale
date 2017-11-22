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
                if (expand.percent+p < 0 || expand.percent+p > phases.countMultipleTen) {
                    return expand.percent/10
                }
                expand.percent += p;
                expand.percent = expand.percent < 0 
                ? expand.percent = 0
                : expand.percent > phases.countMultipleTen 
                ? expand.percent = phases.countMultipleTen : expand.percent

                var percent = expand.percent/phases.countMultipleTen*phases.total
                events.deltaX = mouse.x
                var percentValue = (expand.out - expand.in) * percent
                var widthValue = (expand.freq.max - expand.freq.min) * percent
                //var CLpercent = events.deltaX/CL.clientWidth
                if (expansion.centerFreq) TC.select = TC.children[expansion.centerFreq]
                //var TC.percent = events.deltaX/(TC.clientWidth)
                //console.log(deltaTCSelectLeft)
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
                style.main.freqs.width = expand.value+"%";
                style.main.freqs.minWidth = Math.ceil(expand.freq.min+widthValue)+"px";
                
                // RESIZE -- re/assign offsets
                TC.track._resize()
                if (TC.select) {
                    var TCSelectLeft = TC.select.offsetLeft
                    left = TCSelectLeft > deltaTCSelectLeft ? (TCSelectLeft-deltaTCSelectLeft) : (deltaTCSelectLeft-TCSelectLeft)
                    CL.locator.style.left = left+'px'
                }
                // RESIZE
                //console.log('scale%: '+expand.percent+' TC.spanPercent: '+(TC.spanPercent*100))
                
                //console.log('left: '+this.leftRes+' osf: '+divRightRetract.offsetLeft)
                TC.style.left = (CL.locator.offsetLeft-TC.locator.offsetLeft)+'px'
                //debugger
                mouse.x = CL.locator.offsetLeft - (CL.offsetLeft+TC.offsetLeft) + CL.offsetLeft + container.scrollLeft
                //console.log(CL.locator.offsetLeft-TC.locator.offsetLeft)
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
                expansion.filter()
            }
            
            return zoom
        }

        var ranges = this.ranges = {generate: [phases.current], length: 1}// store ranges
        this.current = []
        this.filter = function () {
            var outputStr = ''
            // filter calendar draws during scale
            this.offsetLeftStack = 0
            for (var r = 0; r < ranges.length; r++) {
                var TCLocatorOffsetLeft = TC.locator.offsetLeft + this.offsetLeftStack
                var frequency = phases.frequencies[ranges.generate[r]] || phases.currentFrequency
                var widthRange = TC.track.width/frequency.bands

                var prevRangeGenerateName = ranges.generate[r-1]
                var prevPhaseElements = phases.elements[prevRangeGenerateName]
                var previous = this.current[r-1]

                var range = this.ranges[frequency.name] ? this.ranges[frequency.name] : 
                this.ranges[frequency.name] = {   // new range finder
                    elements: phases.elements[frequency.name] || (phases.elements[frequency.name] = generate.regen(frequency.name)),
                    list:  previous ? previous[frequency.name].list : phases.elements[frequency.name].list,
                    length: previous ? Object.keys(previous[frequency.name]).length : Object.keys(phases.elements[frequency.name].list).length,
                    tick: -1
                }
                //this.ranges[frequency.name].list = this.current[r] ? this.current[r].list : phases.elements[frequency.name].list
                //this.ranges[frequency.name].length = this.current[r] ? Object.keys(this.current[r].list).length : Object.keys(phases.elements[frequency.name].list).length
                
                if (range.tick == -1) { range.tick = 0; continue;  }

                range.expand = Math.floor(range.length - range.length/(10/expand.percent))
                
                range.expand = range.expand <= 0 ? 0 : range.expand >= range.length ? range.length : range.expand
                
                range.left = Math.floor(TCLocatorOffsetLeft / widthRange) - range.expand
                
                range.right = Math.floor(TCLocatorOffsetLeft  / widthRange) + range.expand
                if (!widthRange || range.left == range.tick) // optimize with tick
                    return;

                range.tick = range.left

                range.left = range.left < 0 ? 0 : range.left > range.length - 1 ? range.length - 1 : range.left

                range.right = range.right < 0 ? 0 : range.right > range.length - 1 ? range.length - 1 : range.right
                
                range.start = range.left - 1
                range.start = range.start < 0 ? 0 : range.start
                range.end = range.right + 1
                range.end = range.end > range.length - 1 ? range.length - 1 : range.end
                //debugger
                
                this.start = range.list[Object.keys(range.list)[range.start]]
                this.current[r] = range.expand == 0 ? range.list[Object.keys(range.list)[range.start+1]] : undefined

                if (this.current[r])  console.log('---------'+this.current[r].span.label.innerHTML);
                this.end = range.list[Object.keys(range.list)[range.end]]

                
                this.offsetLeftStack += this.start.span.offsetLeft

                console.log('filter '+frequency.name)
                generate.degen(frequency.name, range.start, range.end, (ranges.length > 1 && ranges.length != r+1))
                generate.regen(frequency.name, range.start, range.end, (ranges.length > 1 && ranges.length != r+1))
                outputStr += this.start.span.label.innerHTML+' '+ this.end.span.label.innerHTML
            }
            if (outputStr) ctx.output('Filter Draw Range:'+outputStr)
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
            //console.log('left: '+expansion.leftRes+' osf: '+divRightRetract.offsetLeft)
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
            TC.leftTCScroll = TC.offsetLeft
            TC.leftTCLocatorScroll = TC.locator.offsetLeft
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
            //console.clear()
            // TC.spanPercent GOOD FOR TIMESTAMP INSERT RE/POSITIONING, end to end
            //console.log('calendar%:'+CL.percent+' - timecode%:'+TC.percent+' - timespan%:'+TC.spanPercent+' - centerspan%:'+TC.centerPercent)
            //console.log('CL.locator: '+CL.locator.offsetLeft+' TC.locator: '+TC.locator.offsetLeft+' ')
            //// 
            if (!dragScroll.interval)mouse.x = events.deltaX
            //expansion.filter()
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
                dragScroll.rate = scrollRate * 0.25
                
    
                if (!dragScroll.interval) {
                    TC.leftTCScroll = TC.offsetLeft
                    TC.leftTCLocatorScroll = TC.locator.offsetLeft
    
                    clearInterval(dragScroll.interval)
                    dragScroll.interval = setInterval(function () {
                        mouse.x = CL.locator.offsetLeft - (CL.offsetLeft+TC.offsetLeft) + container.scrollLeft
                        TC.leftTCScroll += dragScroll.rate
                        TC.leftTCLocatorScroll -= dragScroll.rate
                        //leftRes = (leftTC)
                        TC.style.left = TC.leftTCScroll+'px'
                        TC.locator.style.left = TC.leftTCLocatorScroll+'px'
                        expansion.filter()
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
            expansion.filter()
        }

        this.leftOffset = 0.0
        this.rightRetract = 1.0
        TC.track._resize = function () {// only scale year frequency the rest will follow
            this.scale = phases.frequencies.year ? (expand.value*phases.frequencies.year.bands) : 100
            this.width = TC.width * (this.scale / 100)
            this.style.width = this.scale + '%'
        }
        window.resizeCalls.push(TC.track)
        this._resize = function () {
            this.filter()
        }
        window.resizeCalls.push(this)
        expand.enter()
        this.handle = this.expansion()
        Wheel(CL.track, this.handle)
        var phaseChange = function (p) {
            var phaseId = p << 0
            for (var sLen = 0; sLen < phases.currentFrequency.subLength; sLen++) {
                phases.currentFrequency.subCheck(p, sLen)
                    console.log(p)
            }
            if (phases.phaseId == phases.total - (ranges.phaseId = phaseId))
                return;

            ranges.generate = []
            for (var pI = 0; pI < phaseId+1; pI++) {
                ranges.generate[pI] = frequencies[Object.keys(frequencies)[pI]].name
            }
            phases.refrequency(ranges.generate[phaseId])
            if (ranges.length != phaseId+1) {
                ranges.length = phaseId+1
                if (ranges[ranges.generate[ranges.length-2]]) ranges[ranges.generate[ranges.length-2]].tick = 'reset'
                var range = ranges[ranges.generate[ranges.length-1]]
                
                if (range) { 
                    range.tick = 'reset'
                    generate.reset(ranges.generate[ranges.length-1], range.start, range.end)
                }
            }
        }
        this.expansionCalls.push(phaseChange)
        this.onExpansion(this.onexpansion(0.0))
    }
})(this.Calendar)
