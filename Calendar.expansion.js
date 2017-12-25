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
        var stack = calendar.stack
        
        var expansion = this

        var mouse = this.mouse = {x: 0, y: 0}

        //Public
        var expand = this.expand = {
            percent: 0.0, value: 0.0, /*widthValue: 0.0,*/ in: 0.0, out: 0.0, min: 0.0, max: 0.0, freq: {min: 0.0, max: 0.0}, width: function (percent) {
                this.percentValue = (this.out - this.in) * percent
                this.value = this.deltaInMutiple+this.in+this.percentValue
                this.widthValue = this.value/10*this.freq.min
            }, unitStack: [phases.currentFrequency._bands], unitMultiple: phases.currentFrequency._bands, percentile: 1.0,
            enter: function (reverse) {
                // assigning expand parameters
                // assign freq to main expansion
                // year - month parameter change
                this.units = phases.currentFrequency._bands
                this.nextUnits = phases.nextFrequency._bands 
                // 8 - 12(year - month)
                if (reverse) {
                    this.unitMultiple /= this.unitStack[this.unitStack.length - 1]
                    this.unitStack.pop()
                    this.deltaUnitMultiple /= this.unitStack[this.unitStack.length - 1]
                } else {
                    this.unitStack.push(this.nextUnits)
                    this.deltaUnitMultiple = this.unitMultiple
                    this.unitMultiple *= this.unitStack[this.unitStack.length - 1]
                }
                this.betaUnitMultiple = this.deltaUnitMultiple / this.unitStack[this.unitStack.length - 2]
            
                this.freq.min = phases.currentFrequency.span
                // 50 - 75(year - month)

                this.freq.units = phases.nextFrequency._bands 
                // 12 - 31(month - day)

                this.freq.max = this.freq.units * phases.nextFrequency.span
                // (12x75)900 - + (31x50)1550 = 2450(month - day)

                this.min = this.deltaUnitMultiple * this.freq.min
                // 400 - 7200

                this.max = this.unitMultiple * phases.nextFrequency.span
                // 7200 - + 12×1500 = 23600

                this.value = this.in = (100 / this.deltaUnitMultiple) + (10*phases.currentFrequency.indice)
                this.deltaInMutiple = ((this.out*this.betaUnitMultiple)/this.deltaUnitMultiple) - this.in  
                this.deltaInMutiple = this.deltaInMutiple > 0 ? this.deltaInMutiple : 0
                // 12.5 - 225
                
                this.out = ((100 / this.deltaUnitMultiple) * (this.max / this.min)) + (20*phases.nextFrequency.indice)
                // 225

                this.betaUnitMultiple = this.deltaUnitMultiple// check possible error
                
                console.log(JSON.stringify(this))
            }
        }

        TC.track._resize = function () {// only scale year frequency the rest will follow
            var deltaScale = this.scale
            this.scale = phases.frequencies.year ? (expand.value*expand.deltaUnitMultiple) : 100
            deltaScale = this.scale/deltaScale
            expand.percentile /= deltaScale ? deltaScale : 1
            this.width = TC.width * (this.scale / 100)
            this.style.width = this.scale + '%'
        }
        window.resizeCalls.push(TC.track)
        
        TC.locator.left = 2
        TC.locator.style.left = TC.locator.left+'%'
        this.enter = function () {
            _onexpansion = this.onexpansion = function (percent) {
                if (expansion.centerFreq) TC.select = TC.children[expansion.centerFreq]
                events.deltaX = mouse.x
                TC.locator.mouseX = events.deltaX/(TC.track.clientWidth)

                if (TC.select) {
                    TC.locator.mouseX = TC.select.offsetLeft/(TC.track.clientWidth)
                    TC.select.style.color = '#FFA218'
                }

                TC.track._resize()
                
                TC.locator.style.left = TC.locator.mouseX*100+'%'
                style.toggle.freqs.width = expand.value+"%";
                style.toggle.freqs.minWidth = expand.widthValue+"px";
                style.toggle.empty.percent = TC.track.scale;
                
                TC.style.left = (CL.locator.offsetLeft-TC.locator.offsetLeft)+'px'
                mouse.x = CL.locator.offsetLeft - (CL.offsetLeft+TC.offsetLeft) + CL.offsetLeft + container.scrollLeft
                return percent
            }
            this.expansionCalls = []
            this.expansionCallbacks = function (scroll) {
                var percent = 0.0;
                for (let e = 0; e < this.expansionCalls.length; e++) {
                    if (this.expansionCalls[e]._expansion) percent = this.expansionCalls[e]._expansion(scroll); else percent = this.expansionCalls[e](scroll)
                }
                return percent
            }
            this.onExpansion = function (scroll) {
                return this.expansionCallbacks(scroll)
            }
            var zoom = function (zoom) {
                expansion.onexpansion(expansion.onExpansion(zoom))
                events._resize()
                expansion.filter()
            }
            
            return zoom
        }

        this.prefilter = function () {
            // filter calendar draws during scale
            this.deltaWidthRangeSum = 0
            this.deltaStackLength = 1
            for (var r = 0; r < ranges.length; r++) {
                var frequency = phases.frequencies[ranges.generate[r]] || phases.currentFrequency
                var widthRange = (this.deltaWidthRangeSum || TC.track.width) /frequency._bands// default bands for days to keep consistent
                var deltaWidthRange = this.deltaWidthRangeSum = widthRange

                var range = frequency.range = this.ranges[frequency.name] ? this.ranges[frequency.name] : 
                this.ranges[frequency.name] = {   // new range finder
                    elements: stack[frequency.name] || (stack[frequency.name] = generate.regen(frequency.name)),
                    list: stack[frequency.name].list,
                    length: phases.frequencies[frequency.name].range.length || phases.frequencies[frequency.name]._bands,// day problem
                    stackLength: this.deltaStackLength * phases.frequencies[frequency.name]._bands,// day problem
                    tick: undefined
                }
                this.deltaStackLength = range.stackLength// day problem

                range.locator = Math.floor(TC.locator.offsetLeft / deltaWidthRange) 

                if (ranges.length != r+1) generate.degen(frequency.name, range.start, range.end, ranges.length != r+1)
            }
        }

        var ranges = this.ranges = {generate: [phases.current], length: 1}// store ranges
        this.current = []
        var outputStr = []
        var filterStrStart = []
        var filterStrEnd = []
        this.filter = function () {
            
            // filter calendar draws during scale
            this.expandPercentSum = 0
            this.offsetLeftSum = 0
            this.deltaWidthRangeSum = 0
            this.deltaStackLength = 1
            var frequency = phases.currentFrequency
            for (var r = 0; r < ranges.length; r++) {
                var previous = this.current[r-1]
                var previousLabel = previous ? previous[0] : ''
                var previousRangeName = ranges.generate[r-1]
                var previousPhaseElements = stack[previousRangeName]
                var previousRange = this.ranges[previousRangeName]
                this.offsetLeftSum += previous ? previous[1].span.offsetLeft : 0
                var TCLocatorOffsetLeft = TC.locator.offsetLeft - this.offsetLeftSum
                frequency = phases.frequencies[ranges.generate[r]] || phases.currentFrequency
                var widthRange = (this.deltaWidthRangeSum || TC.track.width) /frequency._bands// default bands for days to keep consistent
                var deltaWidthRange = this.deltaWidthRangeSum = widthRange

                var range = frequency.range = this.ranges[frequency.name] ? this.ranges[frequency.name] : 
                this.ranges[frequency.name] = {   // new range finder
                    elements: stack[frequency.name] || (stack[frequency.name] = generate.regen(frequency.name)),
                    list: stack[frequency.name].list,
                    length: phases.frequencies[frequency.name].range.length || phases.frequencies[frequency.name]._bands,// day problem
                    stackLength: this.deltaStackLength * phases.frequencies[frequency.name]._bands,// day problem
                    tick: undefined
                }
                this.deltaStackLength = range.stackLength// day problem

                if (range.tick == undefined) { range.tick = 0; /*continue;*/  }

                range.expand = Math.floor(range.length - range.length/(phases.multipleScale/(expand.percent - this.expandPercentSum)))
                this.expandPercentSum += phases.multipleScale

                range.expand = range.expand <= -1 ? -1 : range.expand >= range.length ? range.length : range.expand

                range.left = Math.floor(TCLocatorOffsetLeft / deltaWidthRange) - range.expand

                range.locator = Math.floor(TC.locator.offsetLeft / deltaWidthRange)       

                if (!deltaWidthRange || range.left == range.tick) // optimize with tick
                    continue;
                console.log('-------------------'+ranges.generate[r])
                // check if year, month, day, hour, minute, second, millisecond pass hierarchy test
                range.tick = range.left

                this.current[r] = range.list[range.locator]

                if(range.expand == 0) {
                    console.log('Enter '+frequency.name+' '+(this.current[r] ? this.current[r][0] : ''))
                    mouse.x = CL.locator.offsetLeft - (CL.offsetLeft+TC.offsetLeft) + CL.offsetLeft + container.scrollLeft
                }

                
                range.right = Math.floor(TCLocatorOffsetLeft  / deltaWidthRange) + range.expand
                if (this.current[r]) { 
                    console.log('@ '+this.current[r][0]);
                }

                range.left = range.left < 0 ? 0 : range.left > range.length - 1 ? range.length - 1 : range.left
                
                range.right = range.right < 0 ? 0 : range.right > range.length - 1 ? range.length - 1 : range.right
                
                if (frequency.name == 'year') {
                    range.start = range.left - 1
                    range.start = range.start < 0 ? 0 : range.start
                    range.end = range.right + 1
                    range.end = range.end > range.length - 1 ? range.length - 1 : range.end
                    if (range.start == range.end) {
                        range.start-=1 
                        range.end+=1
                    }

                    
                    outputStr[r] = this.current[r] ? ' '+this.current[r][0] : ''

                    this._deltaStart = range.start
                    this._deltaLocator = range.locator
                    this._deltaEnd = range.end
                }

                //var position = Math.floor(TC.locator.offsetLeft / deltaWidthRange)
                //if (frequency.name == 'month') console.log('.....'+position)
                if (frequency.name != 'year') {
                    if (frequency.name == 'day') {
                        console.log(range.expand, range.locator)
                    }
                    //mainIsCurrent = false
                    range.deltaStart = previousRange.list[previousRange.start][2].position
                    range.deltaLocator = previousRange.list[previousRange.locator][2].position
                    range.deltaEnd = previousRange.list[previousRange.end][2].position
                    //console.log(range.expand, range.locator)
                    outputStr[r] = this.current[r] ? ' '+this.current[r][0] : ''

                    range.start = range.locator - (Math.floor(range.expand / 2)) - 1
                    range.start = range.start < 0 ? 0 : range.start
                    range.end = range.locator + (Math.floor(range.expand / 2)) + 1
                    range.end = range.end > range.stackLength - 1 ? range.stackLength - 1 : range.end
                    if (range.start == range.end) {
                        range.start-=1
                        range.end+=1
                    }
                    this._deltaStart = range.start
                    this._deltaLocator = range.locator
                    this._deltaEnd = range.end
                }
                
                this.start = range.list[range.start]
                this.end = range.list[range.end]

                generate.degen(frequency.name, range.start, range.end, ranges.length != r+1)
                generate.regen(frequency.name, range.start, range.end, ranges.length != r+1)
                
                filterStrStart[r] = ' '+this.start[0]
                filterStrEnd[r] = ' '+this.end[0]
            }
            // filler expanding
            style[frequency.name].fill.left.width = (style[frequency.name].fill.left.percentile / 100 * style.toggle.empty.percent) + '%'
            style[frequency.name].fill.right.width = (style[frequency.name].fill.right.percentile / 100 * style.toggle.empty.percent) + '%'

            ctx.output('Current '+outputStr+' - Filter Draw Range:'+filterStrStart+' - '+filterStrEnd)
        }

        retract.leftOffset = 0.0
        retract.rightRetract = 1.0
        events._resize = function () {
            // moving the timeline
            // snapping
            retract.leftOffset < 0.01 ? retract.leftOffset = 0.0 : retract.leftOffset > 0.95 ? retract.leftOffset = 0.95 : retract.leftOffset
            retract.rightRetract + retract.leftOffset > 0.98 ? retract.rightRetract = 1.0 - retract.leftOffset : retract.rightRetract < 0.05 ? retract.rightRetract = 0.05 : retract.rightRetract
    
            // retract
            container.width = container.clientWidth || app.width
            retract.width = Math.ceil(container.width * retract.rightRetract)
            if (expand.min < container.width)
            TC.width = container.width < expand.min ? expand.min : container.width - 10
            else 
            TC.width = container.width - 10
            //expansion.TC.width -= phases.multipleScale
            TC.left = TC.offsetLeft
    
            // center locator when timeline retracts
            // RESIZE -- re/assign offsets - delta
            var deltaTCLocatorLeft = TC.locator.offsetLeft
            
            CL.style.left = (retract.leftOffset * container.width) + 'px'
            CL.style.width = retract.width + 'px'
            TL.style.width = container.width + 'px'
            
            TC.style.width = TC.width + 'px'
            //TC.track.width = TC.width * (TC.track.scale / 100)
            var TCLocatorLeft = TC.locator.offsetLeft
            // RESIZE -- re/assign offsets - delta
            TC.left += (deltaTCLocatorLeft-TCLocatorLeft)
            var leftRes = (TCLocatorLeft+TC.left)
            //console.log('left: '+expansion.leftRes+' osf: '+divRightRetract.offsetLeft)
            
            if (retract.width > 100) {
                TC.left -= CL.retract.right.offsetLeft-50 < leftRes ? (leftRes-CL.retract.right.offsetLeft)+50 : 0
    
                TC.left -= CL.retract.left.offsetLeft+50 > leftRes ? (leftRes-CL.retract.left.offsetLeft)-50 : 0
            }
            if (TC.track.width + TC.left < retract.width - 5) { TC.left = (retract.width - 5) - TC.track.width }
            if (TC.left > 5) TC.left = 5

            TC.style.left = TC.left+'px'
    
            // ADJUSTMENTS - TODO Add easing
            if (TC.left+TC.track.clientWidth < (CL.clientWidth - 10)) {
                TC.style.left = (TC.left = 5)+'px'
            }
            if (TC.track.clientWidth == (CL.clientWidth - 10)) {
                TC.style.left = (TC.left = 5)+'px'
            } 
            TC.leftTCScroll = TC.left
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
            TC.percent = (events.deltaX/(TC.clientWidth))*expand.percentile
            //mouse move filter* TC.locator.style.left = (TC.percent*100)+'%'
    
            // center
            events.deltaCenterX = ((CL.clientWidth/2) + (CL.offsetLeft + container.scrollLeft)) - (CL.offsetLeft+TC.offsetLeft) + container.scrollLeft
            TC.centerPercent = events.deltaCenterX/(TC.clientWidth)
            //TC.locator.style.left = (TC.centerPercent*100)+'%'
            // 0.07035755478662054 .......
            TC.spanPercent = TC.percent*expand.percentile
            //console.clear()
            // TC.spanPercent GOOD FOR TIMESTAMP INSERT RE/POSITIONING, end to end
            //console.log('calendar%:'+CL.percent+' - timecode%:'+TC.percent+' - timespan%:'+TC.spanPercent+' - centerspan%:'+TC.centerPercent)
            //console.log('CL.locator: '+CL.locator.offsetLeft+' TC.locator: '+TC.locator.offsetLeft+' ')
            //// 
            if (!dragScroll.interval)mouse.x = events.deltaX
            //mouse move filter* expansion.filter()
        }
        CL.addEventListener('mousemove', events._onmousemove)

        events._ondrag = function (e) {
            e.preventDefault()
    
            events.mouseX = e.pageX - TL.offsetLeft + container.scrollLeft
            
            TL.style.cursor = 'pointer'
            if (retract.mode == 'center') {
                dragScroll.endX = events.mouseX
                var scrollRate = (dragScroll.startX-dragScroll.endX)*(expand.value/500)
                var width = (container.width * retract.rightRetract)
                dragScroll.rate = scrollRate * 0.25
                var _left = 0
    
                if (!dragScroll.interval) {
                    TC.leftTCScroll = TC.offsetLeft
                    TC.leftTCLocatorScroll = TC.locator.offsetLeft
    
                    clearInterval(dragScroll.interval)
                    dragScroll.interval = setInterval(function () {
                        mouse.x = CL.locator.offsetLeft - (CL.offsetLeft+TC.offsetLeft) + container.scrollLeft
                        _left = TC.leftTCScroll + dragScroll.rate
                        if (TC.track.width + _left < retract.width - 5)
                        return
                        if (_left > 5)
                        return
                        TC.leftTCScroll = _left
                        TC.leftTCLocatorScroll -= dragScroll.rate
                        //leftRes = (leftTC)
                        TC.style.left = (TC.left = TC.leftTCScroll)+'px'
                        TC.locator.style.left = TC.leftTCLocatorScroll+'px'
                        //if (Math.abs(mouse.x - deltaMouseX) > 10) // optimize filter, check every 10px
                        expansion.filter()
                    }, 10)
                }
            } else if (retract.mode == 'left') {
                retract.leftOffset = events.mouseX / container.width
                var constrict = (events.mouseX + retract.width) / container.width
                if (constrict > 1)
                    retract.rightRetract -= (events.mouseX + retract.width) / container.width - 1
                    events._resize()
            } else if (retract.mode == 'right') {
                retract.rightRetract = (events.mouseX - (retract.leftOffset * container.width)) / container.width
                events._resize()
            }
            //
            expansion.filter()
        }

        this._resize = function () {
            this.filter()
        }
        window.resizeCalls.push(this)
        expand.enter(false)
        this.handle = this.enter()
        Wheel(CL.track, this.handle)
        var phaseChange = function (scroll) {
            if (expand.percent+scroll < 0 || expand.percent+scroll > phases.multipleScalePhases) {
                return (expand.percent/phases.multipleScale) % 1
            }
            expand.percent += scroll;
            expand.percent = expand.percent < 0 
            ? expand.percent = 0
            : expand.percent > phases.multipleScalePhases 
            ? expand.percent = phases.multipleScalePhases : expand.percent

            var percent = expand.percent/phases.multipleScalePhases*phases.total
            phases.percent = percent % 1
            //phases.percent = percent != 0 && phases.percent == 0 ? 0.09 : phases.percent
            expand.width(phases.percent)
            
            var phaseId = percent << 0
            for (var sLen = 0; sLen < phases.currentFrequency.subLength; sLen++) {
                phases.currentFrequency.subCheck(percent, sLen)
                    console.log('Expand: '+percent, phases.percent)
            }
            if (phases.phaseId == phases.total - phaseId)
                return phases.percent;
            
            var reset = typeof ranges.phaseId == 'undefined' || ranges.phaseId < phaseId
            ranges.phaseId = phaseId

            var deltaGenerate = ranges.generate[ranges.length-1]
            ranges.generate = []
            for (var pI = 0; pI < phaseId+1; pI++) {
                ranges.generate[pI] = frequencies[Object.keys(frequencies)[pI]].name
            }
            phases.refrequency(ranges.generate[phaseId])
            

            if (ranges.length != phaseId+1) {
                ranges.length = phaseId+1
                for (var rl = 0; rl < ranges.length; rl++) {
                    if (ranges[ranges.generate[rl]]) ranges[ranges.generate[rl]].tick = 'reset'
                }

                var range = ranges[ranges.generate[ranges.length-1]]
                
                if (range) {
                    range.tick = 'reset'
                    generate.reset(ranges.generate[ranges.length-1], deltaGenerate, !reset, range.start, range.end, reset)
                }
            }
            expansion.prefilter()
            expand.enter(!reset)
            expand.width(phases.percent)
            return phases.percent
        }
        expansion.prefilter()
        this.expansionCalls.push(phaseChange)
        this.onexpansion(this.onExpansion(0.0))
    }
})(this.Calendar)
