/**
 * Building Calendar Class: Expansion
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Calendar) {
    // Class Struct prototype
    var _struct = Calendar.prototype
    var that = _struct.expansion = {}
    // Class Declarations

    // Private

    // Public

    // Class Init
    that.Init = function (calendar) {
        // Private
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

        // Public
        var expand = this.expand = {
            reset (reverse, cache) {
                var _cache = {}
                if (reverse) {
                    _cache = cache || this.cache[this.cache.length - 1] // backup
                    // this.percent = this._cache.percent
                    this.decent = _cache.decent || 0.0
                    this.value = _cache.value
                    this.widthValue = _cache.widthValue
                    this.in = _cache.in
                    this.out = _cache.out
                    this.min = _cache.min
                    this.max = _cache.max
                    this.freq = { min: _cache.freq.min, max: _cache.freq.max }
                    this.unitStack = _cache.unitStack
                    this.unitMultiple = _cache.unitMultiple
                    this.percentile = _cache.percentile
                    this.deltaInMutiple = _cache.deltaInMutiple
                    this.deltaUnitMultiple = _cache.deltaUnitMultiple
                    this.betaUnitMultiple = _cache.betaUnitMultiple
                    this.cache.pop() // backup
                    phases.currentFrequency.expand = undefined
                    phases.nextFrequency.rescale = true
                    return true
                } else {
                    if (cache) {
                        _cache = {
                            // percent: this.percent,
                            decent: this.percent,
                            value: this._delta,
                            widthValue: 0.0,
                            in: this.in,
                            out: this.out,
                            min: this.min,
                            max: this.max,
                            freq: { min: this.freq.min, max: this.freq.max },
                            unitStack: this.unitStack,
                            unitMultiple: this.unitMultiple,
                            percentile: this.percentile,
                            deltaInMutiple: this.deltaInMutiple,
                            deltaUnitMultiple: this.deltaUnitMultiple,
                            betaUnitMultiple: this.betaUnitMultiple
                        }
                        this.cache.push(_cache) // backup
                        phases.previousFrequency.expand = _cache
                        phases.currentFrequency.rescale = false
                    }
                    this.percent = this.percent || 0.0
                    this.decent = this.percent || 0.0
                    this.value = 0.0
                    this.widthValue = 0.0
                    this.in = 0.0
                    this.out = 0.0
                    this.min = 0.0
                    this.max = 0.0
                    this.freq = { min: 0.0, max: 0.0 }
                    this.unitStack = [phases.currentFrequency._bands]
                    this.unitMultiple = phases.currentFrequency._bands
                    this.percentile = 1.0
                    this.deltaInMutiple = 0.0
                }
                return this.enter(reverse, cache, true)
            },
            cache: [],
            width: function (percent) {
                this.percentValue = (this.out - this.in) * percent
                this._delta = this.value
                this.value = this.deltaInMutiple + this.in + this.percentValue
                // this.widthValue = expand.freq.min+(expand.freq.max - expand.freq.min) * percent
            },
            enter: function (reverse, cache, reset) {
                // assigning expand parameters
                // assign freq to main expansion
                // auto reset if no stack
                if (!this.unitStack) return this.reset(reverse, cache)
                if (reverse && phases.currentFrequency.expand) return this.reset(reverse, phases.currentFrequency.expand)

                if (phases.currentFrequency.rescale) return this.reset(reverse, cache || true)
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

                this.value = this.in = (100 / this.deltaUnitMultiple) + (10 * phases.currentFrequency.indice)
                this.deltaInMutiple = ((this.out * this.betaUnitMultiple) / this.deltaUnitMultiple) - this.in
                this.deltaInMutiple = this.deltaInMutiple > 0 ? this.deltaInMutiple : 0
                // 12.5 - 225

                this.out = ((100 / this.deltaUnitMultiple) * (this.max / this.min)) + (20 * phases.nextFrequency.indice)
                // 225

                this.betaUnitMultiple = this.deltaUnitMultiple// check possible error

                console.log(JSON.stringify(this))

                return reset
            }
        }

        TC.track._resize = function () { // only scale year frequency the rest will follow
            var deltaScale = this.scale
            this.scale = style.main ? (expand.value * expand.deltaUnitMultiple) : 100
            deltaScale = this.scale / deltaScale
            expand.percentile /= deltaScale || 1
            this.width = TC.width * (this.scale / 100)
            this.style.width = this.scale + '%'
        }
        window.resizeCalls.push(TC.track)

        TC.locator.left = 2
        TC.locator.style.left = TC.locator.left + '%'
        this.enter = function () {
            this.onexpansion = function (percent) {
                if (typeof expansion.centerFreq != 'undefined') {
                    var locator = Math.floor(expansion.centerFreq)
                    var percentile = expansion.centerFreq - locator
                    TC.select = phases.currentFrequency.elements.list[locator][1].span
                }
                events.deltaX = mouse.x
                TC.locator.mouseX = events.deltaX / (TC.track.clientWidth)

                if (TC.select) {
                    TC.locator.mouseX = (TC.select.offsetLeft + (TC.select.clientWidth * percentile)) / (TC.track.clientWidth)
                    // TC.select.className += ' highlight'
                }

                TC.track._resize()

                TC.locator.style.left = TC.locator.mouseX * 100 + '%'
                style.toggle.freqs.width = expand.value + '%'
                // style.toggle.freqs.minWidth = expand.widthValue+"px";
                style.toggle.empty.percent = TC.track.scale

                TC.style.left = (CL.locator.offsetLeft - TC.locator.offsetLeft) + 'px'
                mouse.x = CL.locator.offsetLeft - (CL.offsetLeft + TC.offsetLeft) + CL.offsetLeft + container.scrollLeft
                return percent
            }
            this.expansionCalls = []
            this.expansionCallbacks = function (scroll) {
                var percent = 0.0
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
                if (expansion.centerFreqPre) {
                    expansion.centerFreq = expansion.centerFreqPre
                    expansion.onexpansion()
                    expansion.filter()
                    TC.select = expansion.centerFreq = expansion.centerFreqPre = undefined
                }
            }

            return zoom
        }

        this.prefilter = function (reset) {
            // filter calendar draws during scale
            var _first = 0
            var reverse = false
            if (reset) {
                for (var rl = ranges.length - 1; rl >= 0; rl--) {
                    if (!phases.frequencies[ranges.generate[rl]].elements ||
                        phases.frequencies[ranges.generate[rl]].elements.isMain) {
                        phases.mainFrequency = phases.frequencies[ranges.generate[rl]]
                        _first = rl
                        break
                    }
                }
                reverse = (_first <= ranges.first)
                ranges.first = 0
            }
            this.deltaWidthRangeSum = 0
            for (let r = ranges.first; r < ranges.length; r++) {
                var frequency = phases.frequencies[ranges.generate[r]] || phases.currentFrequency
                var widthRange = (this.deltaWidthRangeSum || TC.track.width) / frequency._bands// default bands for days to keep consistent
                var deltaWidthRange = this.deltaWidthRangeSum = widthRange

                var range = frequency.range = this.ranges[frequency.name] ? this.ranges[frequency.name]
                : this.ranges[frequency.name] = {   // new range finder
                    elements: stack[frequency.name] || (stack[frequency.name] = generate.regen(frequency.name)),
                    list: stack[frequency.name].list,
                    length: phases.frequencies[frequency.name].range.length || phases.frequencies[frequency.name]._bands, // day problem
                    stackLength: stack[frequency.name].list.length, // day problem
                    tick: undefined
                }

                // range.locator = Math.floor(TC.locator.offsetLeft / deltaWidthRange)

                if (ranges.length != r + 1) generate.degen(frequency.name, range.start, range.end, ranges.length != r + 1)
            }
            var previousRange = {}
            var currentRange = {}
            var percentileOffset = 0
            if (reset) {
                // to-do get locator percentile from previous range a position
                ranges.first = _first
                if (reverse) {
                    previousRange = this.ranges[phases.currentFrequency.name]
                    currentRange = this.ranges[phases.nextFrequency.name]
                    percentileOffset = currentRange.percentile / currentRange.stackLength
                    expansion.centerFreqPre = previousRange.locator + percentileOffset
                    TC.locator.style.left = (previousRange.percentile / previousRange.stackLength * 100) + '%'
                    TC.track.scale = (expand.value * expand.deltaUnitMultiple)
                    previousRange.percentile = expansion.centerFreqPre
                } else {
                    previousRange = this.ranges[phases.previousFrequency.name]
                    TC.track.scale = 100
                    percentileOffset = previousRange.percentile - previousRange.locator
                    TC.locator.style.left = percentileOffset * 100 + '%'
                }

                TC.style.left = (CL.locator.offsetLeft - TC.locator.offsetLeft) + 'px'
                mouse.x = CL.locator.offsetLeft - (CL.offsetLeft + TC.offsetLeft) + CL.offsetLeft + container.scrollLeft
            }
        }

        var ranges = this.ranges = {generate: [phases.current], first: 0, length: 1}// store ranges
        this.current = []
        var infoOut = []
        var outputStr = []
        var filterStrStart = []
        var filterStrEnd = []
        this.filter = function () {
            // filter calendar draws during scale
            this.expandPercentSum = 0
            this.offsetLeftSum = 0
            this.deltaWidthRangeSum = 0
            var frequency = phases.currentFrequency
            for (let r = ranges.first; r < ranges.length; r++) {
                var previous = this.current[r - 1]
                // var previousLabel = previous ? previous[0] : ''
                var previousRangeName = ranges.generate[r - 1]
                // var previousPhaseElements = stack[previousRangeName]
                var previousRange = this.ranges[previousRangeName]
                this.offsetLeftSum += previous ? previous[1].span.offsetLeft : 0
                if (TC.locator.offsetLeft == -1) break
                var TCLocatorOffsetLeft = TC.locator.offsetLeft - this.offsetLeftSum
                frequency = phases.frequencies[ranges.generate[r]] || phases.currentFrequency
                var widthRange = (this.deltaWidthRangeSum || TC.track.width) / frequency._bands// default bands for days to keep consistent
                var deltaWidthRange = this.deltaWidthRangeSum = widthRange

                var range = frequency.range = this.ranges[frequency.name] ? this.ranges[frequency.name]
                : this.ranges[frequency.name] = {   // new range finder
                    elements: stack[frequency.name] || (stack[frequency.name] = generate.regen(frequency.name)),
                    list: stack[frequency.name].list,
                    length: phases.frequencies[frequency.name].range.length || phases.frequencies[frequency.name]._bands, // day problem
                    stackLength: stack[frequency.name].list.length, // day problem
                    tick: undefined
                }

                if (range.tick == undefined) { range.tick = 0 }

                range.expand = Math.floor(range.length - range.length / (phases.multipleScale / ((expand.percent - expand.decent) - this.expandPercentSum)))
                this.expandPercentSum += phases.multipleScale

                range.expand = range.expand <= -1 ? -1 : range.expand >= range.length ? range.length : range.expand

                range.left = Math.floor(TCLocatorOffsetLeft / deltaWidthRange) - range.expand

                range.percentile = TC.locator.offsetLeft / deltaWidthRange
                range.locator = Math.floor(range.percentile)
                infoOut = ['locator:' + range.locator, ' percentile:' + (range.percentile - range.locator)]

                if (!deltaWidthRange || range.left == range.tick) { // optimize with tick
                    continue
                }
                console.log('-------------------' + ranges.generate[r])
                // check if year, month, day, hour, minute, second, millisecond pass hierarchy test
                range.tick = range.left

                this.current[r] = range.list[range.locator] ? range.list[range.locator] : this.current[r]

                if (range.expand == 0) {
                    console.log('Enter ' + frequency.name + ' ' + (this.current[r] ? this.current[r][0] : ''))
                    mouse.x = CL.locator.offsetLeft - (CL.offsetLeft + TC.offsetLeft) + CL.offsetLeft + container.scrollLeft
                }

                range.right = Math.floor(TCLocatorOffsetLeft / deltaWidthRange) + range.expand
                if (this.current[r]) {
                    console.log('@ ' + this.current[r][0])
                }

                range.left = range.left < 0 ? 0 : range.left > range.length - 1 ? range.length - 1 : range.left

                range.right = range.right < 0 ? 0 : range.right > range.length - 1 ? range.length - 1 : range.right

                if (frequency.name == phases.mainFrequency.name) {
                    range.start = range.locator - (Math.floor(range.expand / 2)) - 1
                    range.start = range.start < 0 ? 0 : range.start
                    range.end = range.locator + (Math.floor(range.expand / 2)) + 1
                    range.end = range.end > range.stackLength - 1 ? range.stackLength - 1 : range.end
                    if (range.start == range.end) {
                        range.start -= range.start <= 0 ? 0 : 1
                        range.end += range.end >= range.stackLength - 1 ? 0 : 1
                    }

                    outputStr[r] = this.current[r] ? ' ' + this.current[r][0] : ''

                    this._deltaStart = range.start
                    this._deltaLocator = range.locator
                    this._deltaEnd = range.end
                }

                // var position = Math.floor(TC.locator.offsetLeft / deltaWidthRange)
                // if (frequency.name == 'month') console.log('.....'+position)
                if (frequency.name != phases.mainFrequency.name) {
                    // mainIsCurrent = false
                    range.deltaStart = previousRange.list[previousRange.start][2].position
                    range.deltaLocator = previousRange.list[previousRange.locator][2].position
                    range.deltaEnd = previousRange.list[previousRange.end][2].position
                    // console.log(range.expand, range.locator)
                    outputStr[r] = this.current[r] ? ' ' + this.current[r][0] : ''

                    range.start = range.locator - (Math.floor(range.expand / 2)) - 1
                    range.start = range.start < 0 ? 0 : range.start
                    range.end = range.locator + (Math.floor(range.expand / 2)) + 1
                    range.end = range.end > range.stackLength - 1 ? range.stackLength - 1 : range.end
                    if (range.start == range.end) {
                        range.start -= range.start <= 0 ? 0 : 1
                        range.end += range.end >= range.stackLength - 1 ? 0 : 1
                    }
                    this._deltaStart = range.start
                    this._deltaLocator = range.locator
                    this._deltaEnd = range.end
                }

                this.start = range.list[range.start]
                this.end = range.list[range.end]

                generate.degen(frequency.name, range.start, range.end, ranges.length != r + 1)
                generate.regen(frequency.name, range.start, range.end, ranges.length != r + 1)

                filterStrStart[r] = ' ' + this.start[0]
                filterStrEnd[r] = ' ' + this.end[0]
            }
            // filler expanding
            style[frequency.name].fill.left.width = (style[frequency.name].fill.left.percentile / 100 * style.toggle.empty.percent) + '%'
            style[frequency.name].fill.right.width = (style[frequency.name].fill.right.percentile / 100 * style.toggle.empty.percent) + '%'

            ctx.output('Current ' + outputStr + '<br>Filter Range:' + filterStrStart + ' - ' + filterStrEnd + '<br>' + infoOut)
        }

        retract.leftOffset = 0.0
        retract.rightRetract = 1.0
        events._resize = function () {
            // moving the timeline
            // snapping
            retract.leftOffset = retract.leftOffset < 0.01 ? 0.0 : retract.leftOffset > 0.95 ? 0.95 : retract.leftOffset
            retract.rightRetract = retract.rightRetract + retract.leftOffset > 0.98 ? 1.0 - retract.leftOffset : retract.rightRetract < 0.05 ? 0.05 : retract.rightRetract

            // retract
            container.width = container.clientWidth || window.app.width
            retract.width = Math.ceil(container.width * retract.rightRetract)
            if (expand.min < container.width) { TC.width = container.width < expand.min ? expand.min : container.width - 10 } else { TC.width = container.width - 10 }
            // expansion.TC.width -= phases.multipleScale
            TC.left = TC.offsetLeft

            // center locator when timeline retracts
            // RESIZE -- re/assign offsets - delta
            var deltaTCLocatorLeft = TC.locator.offsetLeft

            CL.style.left = (retract.leftOffset * container.width) + 'px'
            CL.style.width = retract.width + 'px'
            TL.style.width = container.width + 'px'

            TC.style.width = TC.width + 'px'
            // TC.track.width = TC.width * (TC.track.scale / 100)
            var TCLocatorLeft = TC.locator.offsetLeft
            // RESIZE -- re/assign offsets - delta
            TC.left += (deltaTCLocatorLeft - TCLocatorLeft)
            var leftRes = (TCLocatorLeft + TC.left)
            // console.log('left: '+expansion.leftRes+' osf: '+divRightRetract.offsetLeft)

            if (retract.width > 100) {
                TC.left -= CL.retract.right.offsetLeft - 50 < leftRes ? (leftRes - CL.retract.right.offsetLeft) + 50 : 0

                TC.left -= CL.retract.left.offsetLeft + 50 > leftRes ? (leftRes - CL.retract.left.offsetLeft) - 50 : 0
            }
            if (TC.track.width + TC.left < retract.width - 5) { TC.left = (retract.width - 5) - TC.track.width }
            if (TC.left > 5) TC.left = 5

            TC.style.left = TC.left + 'px'

            // ADJUSTMENTS - TODO Add easing
            if (TC.left + TC.track.clientWidth < (CL.clientWidth - 10)) {
                TC.style.left = (TC.left = 5) + 'px'
            }
            if (TC.track.clientWidth == (CL.clientWidth - 10)) {
                TC.style.left = (TC.left = 5) + 'px'
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

            CL.percent = events.deltaX / CL.clientWidth
            CL.locator.style.left = (CL.percent * 100) + '%'

            events.deltaX = e.pageX - (CL.offsetLeft + TC.offsetLeft) + container.scrollLeft
            TC.percent = (events.deltaX / (TC.clientWidth)) * expand.percentile
            if (!dragScroll.interval) TC.locator.style.left = (TC.percent * 100) + '%'

            // center
            events.deltaCenterX = ((CL.clientWidth / 2) + (CL.offsetLeft + container.scrollLeft)) - (CL.offsetLeft + TC.offsetLeft) + container.scrollLeft
            TC.centerPercent = events.deltaCenterX / (TC.clientWidth)
            // TC.locator.style.left = (TC.centerPercent*100)+'%'
            // 0.07035755478662054 .......
            TC.spanPercent = TC.percent * expand.percentile
            // console.clear()
            // TC.spanPercent GOOD FOR TIMESTAMP INSERT RE/POSITIONING, end to end
            // console.log('calendar%:'+CL.percent+' - timecode%:'+TC.percent+' - timespan%:'+TC.spanPercent+' - centerspan%:'+TC.centerPercent)
            // console.log('CL.locator: '+CL.locator.offsetLeft+' TC.locator: '+TC.locator.offsetLeft+' ')
            /// /
            if (!dragScroll.interval)mouse.x = events.deltaX
            if (!dragScroll.interval) expansion.filter()
        }
        CL.addEventListener('mousemove', events._onmousemove)

        events._ondrag = function (e) {
            e.preventDefault()

            events.mouseX = e.pageX - TL.offsetLeft + container.scrollLeft

            TL.style.cursor = 'pointer'
            if (retract.mode == 'center') {
                dragScroll.endX = events.mouseX
                var scrollRate = (dragScroll.startX - dragScroll.endX) * (expand.value / 500)
                dragScroll.rate = scrollRate * 0.25
                var _left = 0

                if (!dragScroll.interval) {
                    TC.leftTCScroll = TC.offsetLeft
                    TC.leftTCLocatorScroll = TC.locator.offsetLeft

                    clearInterval(dragScroll.interval)
                    dragScroll.interval = setInterval(function () {
                        mouse.x = CL.locator.offsetLeft - (CL.offsetLeft + TC.offsetLeft) + container.scrollLeft
                        _left = TC.leftTCScroll + dragScroll.rate
                        if (TC.track.width + _left < retract.width - 5) {
                            _left = (retract.width - 5) - TC.track.width
                            TC.leftTCLocatorScroll += dragScroll.rate
                            clearInterval(dragScroll.interval)
                        } else if (_left > 5) {
                            _left = 5
                            TC.leftTCLocatorScroll += dragScroll.rate
                            clearInterval(dragScroll.interval)
                        }
                        TC.leftTCScroll = _left
                        TC.leftTCLocatorScroll -= dragScroll.rate
                        // leftRes = (leftTC)
                        TC.style.left = (TC.left = TC.leftTCScroll) + 'px'
                        TC.locator.style.left = TC.leftTCLocatorScroll + 'px'
                        // if (Math.abs(mouse.x - deltaMouseX) > 10) // optimize filter, check every 10px
                        expansion.filter()
                    }, 10)
                }
            } else if (retract.mode == 'left') {
                retract.leftOffset = events.mouseX / container.width
                var constrict = (events.mouseX + retract.width) / container.width
                if (constrict > 1) { retract.rightRetract -= (events.mouseX + retract.width) / container.width - 1 }
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
        window.Wheel(CL.track, this.handle)
        var phaseChange = function (scroll) {
            if (expand.percent + scroll < 0 || expand.percent + scroll > phases.multipleScalePhases) {
                return (expand.percent / phases.multipleScale) % 1
            }
            expand.percent += scroll
            expand.percent = expand.percent < 0
            ? expand.percent = 0
            : expand.percent > phases.multipleScalePhases
            ? expand.percent = phases.multipleScalePhases : expand.percent

            var percent = expand.percent / phases.multipleScalePhases * phases.total
            phases.percent = percent % 1
            // phases.percent = percent != 0 && phases.percent == 0 ? 0.09 : phases.percent
            expand.width(phases.percent)

            var phaseId = percent << 0
            for (let sLen = 0; sLen < phases.currentFrequency.subLength; sLen++) {
                phases.currentFrequency.subCheck(percent, sLen)
                console.log('Expand: ' + percent, phases.percent)
            }
            if (phases.phaseId == phases.total - phaseId) { return phases.percent }

            var reset = typeof ranges.phaseId == 'undefined' || ranges.phaseId < phaseId
            ranges.phaseId = phaseId

            var deltaGenerate = ranges.generate[ranges.length - 1]
            ranges.generate = []
            for (let pI = 0; pI < phaseId + 1; pI++) {
                ranges.generate[pI] = frequencies[Object.keys(frequencies)[pI]].name
            }
            phases.refrequency(ranges.generate[phaseId])

            if (ranges.length != phaseId + 1) {
                ranges.length = phaseId + 1
                for (let rl = 0; rl < ranges.length; rl++) {
                    if (ranges[ranges.generate[rl]]) ranges[ranges.generate[rl]].tick = 'reset'
                }

                var range = ranges[ranges.generate[ranges.length - 1]]

                if (range) {
                    range.tick = 'reset'
                    generate.reset(ranges.generate[ranges.length - 1], deltaGenerate, !reset, range.start, range.end, reset)
                }
            }
            expansion.prefilter(expand.enter(!reset))
            expand.width(phases.percent)
            if (!reset) {
                outputStr.pop()
                filterStrStart.pop()
                filterStrEnd.pop()
            }
            return phases.percent
        }
        expansion.prefilter()
        this.expansionCalls.push(phaseChange)
        this.onexpansion(this.onExpansion(0.0))
    }
})(this.Calendar)
