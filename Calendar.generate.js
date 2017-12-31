/**
 * Building Calendar Class: Generate
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Calendar) {
    // Class Struct prototype
    var _struct = Calendar.prototype
    var that = _struct.generate = {}
    // Class Declarations

    // Private
    var regen_main = function (calendar, deltaFrequency, start, end, empty) {
        this.output = []
        var frequencies = calendar.phases.frequencies
        var mainFrequency = calendar.phases.mainFrequency
        var nextFrequencyName = Object.keys(frequencies)[calendar.phases.total - (deltaFrequency.phase - 1)]
        var nextFrequency = frequencies[nextFrequencyName] || {}
        var previousFrequencyName = Object.keys(frequencies)[calendar.phases.total - (deltaFrequency.phase + 1)]
        var previousFrequency = frequencies[previousFrequencyName] || {}
        var previousStack = calendar.stack[previousFrequencyName]
        var currentIsMain = deltaFrequency.name == mainFrequency.name

        if (currentIsMain) { // fix days when hour is main
            previousFrequency._bands = previousFrequency._bands ? previousFrequency._bands : 1
            previousFrequency.elements = previousFrequency.elements ? previousFrequency.elements : {list: {}}
        }

        var control = calendar.stack[deltaFrequency.name]

        if (empty) return control

        if (!control.init) {
            deltaFrequency.labelNameListIsFunction = typeof deltaFrequency.labelNameList == 'function'
            deltaFrequency.bandWidthsIsFunction = typeof deltaFrequency.bandWidths == 'function'
            deltaFrequency.spanClassName = !previousFrequency.bandWidthsIsFunction ? 'band' : ' band w'
            deltaFrequency.bandClassName = !deltaFrequency.bandWidthsIsFunction ? 'band' : 'band w'
        }

        control.list = control.list || {}

        var s = start + this.pad.left
        var e = end + this.pad.right

        var pbLen = previousFrequency._bands
        var cbLen = deltaFrequency._bands
        var nbLen = nextFrequency.bands
        var _nbLen = nextFrequency._bands
        var fbLen = cbLen
        var first = 0
        var length = pbLen

        var label = !deltaFrequency.labelNameListIsFunction ? calendar.phases[deltaFrequency.labelNameList][0] : deltaFrequency.labelNameList()
        var lableListLength = calendar.phases[deltaFrequency.labelNameList].length

        var deltaPrevLocator = deltaFrequency.range.locator / deltaFrequency._bands
        if (control.init) {
            deltaPrevLocator = deltaPrevLocator < 1 ? 1 : deltaPrevLocator > previousStack.list.length - 1 ? previousStack.list.length - 1 : deltaPrevLocator
            first = Math.floor((deltaPrevLocator - 1) * deltaFrequency._bands)
            length = !currentIsMain ? (deltaPrevLocator + 1) * deltaFrequency._bands : deltaFrequency._bands

            var fbLen = deltaFrequency.bands
            var _fbLen = deltaFrequency._bands
            var fFirst = deltaFrequency.first

            // --month and year assign for first day (nextFrequency.first) of month and amount of days in month (nextFrequency._bands)
            // REVERSAL looping
            var last = deltaFrequency.range.locator
            var _first = deltaFrequency.range.locator
            var iterate = -1
            var condition = true
            var reverse = true
            for (let f = _first; condition; f += iterate) {
                // REVERSE
                if (reverse) {
                    condition = f >= first
                } else {
                    condition = f < last
                }
                if (!condition) {
                    if (reverse) {
                        _first = deltaFrequency.range.locator
                        last = length
                        f = _first
                        iterate = 1
                        reverse = false
                        condition = true
                    }
                    continue
                }

                // REVERSE
                // days and hours problem to solve
                // Todo - For Calendar Days shifting p++ and pbLen required
                // --month and year assign for first day (nextFrequency.first) of month and amount of days in month (nextFrequency._bands)

                // var numMod = (fFirst+f) % lableListLength
                // label = !deltaFrequency.labelNameListIsFunction ? calendar.phases[deltaFrequency.labelNameList][numMod] : deltaFrequency.labelNameList()
                var child = control.list[f]
                var element = child[1]
                var label = child[0]

                var parentSpan = /* element.parent[1].span || */ calendar.ctx.TC // * use main

                if (nextFrequency.name == 'day') {
                    nextFrequency.year = element.parent[0]
                    nextFrequency.month = (f % 12) + 1// calendar.phases[deltaFrequency.labelNameList].indexOf(label)+1
                    nbLen = nextFrequency.bands
                    _nbLen = nextFrequency._bands = 31
                }
                if (deltaFrequency.name == 'day') {
                    deltaFrequency.year = element.parent[1].parent[0]
                    deltaFrequency.month = calendar.phases[previousFrequency.labelNameList].indexOf(element.parent[0]) + 1
                    fbLen = deltaFrequency.bands
                    _fbLen = deltaFrequency._bands = 31
                    fFirst = deltaFrequency.first
                    // label += '-'+(f%_fbLen+1)

                    var spanClassName = previousFrequency.bandWidthsIsFunction ? deltaFrequency.spanClassName + _fbLen : ''
                    element.parent[1].span.setAttribute('class', 'span freq ' + previousFrequency.name + spanClassName /** + ' '+f */)
                }

                if (element.enter || f <= s || f >= e) continue
                this.output.push(label)

                if (!element.list) {
                    element.enter = true
                    element.list = element.list || {}
                    if (f >= fbLen) { element.wait = true }
                    var elemFreqSpan = document.createElement('span')
                    var freqSpanClass = !element.wait ? 'span freq ' + deltaFrequency.name/** + ' '+f */ : 'span freq ' + deltaFrequency.name + ' wait'/** + ' '+f */
                    elemFreqSpan.setAttribute('class', freqSpanClass)
                    element.span = window.appending(elemFreqSpan)

                    // create year frequencies keep current year in center of timecode
                    if (element.wait) {
                        // child[0] = control.list[fbLen-1][0]
                        label = '-'
                    }

                    var elemFreqSpanLabel = document.createElement('label')
                    elemFreqSpanLabel.innerHTML = label
                    elemFreqSpan.appendChild(elemFreqSpanLabel)
                    element.span.label = elemFreqSpanLabel

                    // create bands for the year frequencies
                    // dynamic scale

                    var elemFreqSpanBandDiv = document.createElement('div')
                    var bandClassName = deltaFrequency.bandWidthsIsFunction ? deltaFrequency.bandClassName + _nbLen : deltaFrequency.bandClassName
                    elemFreqSpanBandDiv.setAttribute('class', bandClassName)
                    element.span.band = elemFreqSpanBandDiv
                    //
                    if (reverse) { parentSpan.appendAfter(elemFreqSpan, parentSpan.children[1]) } else { parentSpan.appendBeforeLastChild(elemFreqSpan) }
                } else {
                    element.enter = true
                    var elemFreqSpan = element.span
                    var elemFreqSpanBandDiv = element.span.band

                    if (element.wait) {
                        // child[0] = control.list[fbLen-1][0]
                        label = '-'
                    }

                    if (elemFreqSpan.children.length == 0) {
                        var elemFreqSpanLabel = document.createElement('label')
                        elemFreqSpanLabel.innerHTML = label
                        elemFreqSpan.appendChild(elemFreqSpanLabel)
                        element.span.label = elemFreqSpanLabel
                    }
                    // TO-DO
                    // add and adjust filler and add prepend before and append after it, add algotrithum at the end or before appending !?
                    if (reverse) { parentSpan.appendAfter(elemFreqSpan, parentSpan.children[1]) } else { parentSpan.appendBeforeLastChild(elemFreqSpan) }
                }

                // next frequency bands * calander days function
                if (element.wait) {
                    for (let w = elemFreqSpanBandDiv.children.length; w < 2; w++) {
                        var elemFreqSpanBandDivUnit = document.createElement('div')
                        elemFreqSpanBandDivUnit.setAttribute('class', 'half')
                        elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                    }
                    elemFreqSpan.appendChild(elemFreqSpanBandDiv)
                    continue
                }
                var nfFirst = nextFrequency.first
                for (let b = elemFreqSpanBandDiv.children.length; b < _nbLen; b++) {
                    var elemFreqSpanBandDivUnit = document.createElement('div')
                    if (b == 0) { elemFreqSpanBandDivUnit.setAttribute('class', 'first') }
                    if (b >= nbLen) { elemFreqSpanBandDivUnit.setAttribute('class', 'wait') }
                    elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                }
                elemFreqSpan.appendChild(elemFreqSpanBandDiv)

                var skLen = Object.keys(deltaFrequency.sub).length
                for (let si = 0; si < skLen; si++) {
                    var subFrequencyName = Object.keys(deltaFrequency.sub)[si]
                    var subFrequency = deltaFrequency.sub[subFrequencyName]
                    /* if (!control.enter) */element[subFrequencyName] = undefined
                    this[subFrequencyName](calendar, child, subFrequencyName, subFrequency.first || nfFirst, nbLen, subFrequency.freq, calendar.phases[subFrequency.labelNameList])
                }
            }

            if (this.output.length > 0) console.log('Regen: ' + JSON.stringify(this.output))
            return control
        }

        // fix
        var parentIsMain = previousFrequency.elements.isMain
        if (parentIsMain == false) {
            var previousBetaLocator = previousFrequency.range.locator / previousFrequency._bands// day problem accuracy
            previousBetaLocator = previousBetaLocator < 1 ? 1 : previousBetaLocator > previousStack.list.parent.list.length - 1 ? previousStack.list.parent.list.length - 1 : previousBetaLocator
            first = Math.floor((previousBetaLocator - 1) * deltaFrequency._bands)
            length = (previousBetaLocator + 1) * deltaFrequency._bands
            length = length > control.list.length ? control.list.length : length
            if (!control.init) {
                first = 0
                length = calendar.stack[previousFrequency.name].list.length
            }
        }

        for (let p = first; p < length; p++) { // days and hours problem to solve
            // Todo - For Calendar Days shifting p++ and pbLen required

            var parent = parentIsMain == false ? calendar.stack[previousFrequency.name].list[p] || {} : previousFrequency.elements.list[p] || {}//
            var parentElement = parent[1] || {}
            var parentLabel = parent[0]
            // previousFrequency[previousFrequency.name] = previousLabel

            parent[2] = parentElement.list || {}
            var container = parentElement
            container.list = container.list || {}
            container.enter = container.enter || parent.enter

            // days and hours problem to solve
            // deltaFrequency[previousFrequency.name] = parentLabel
            // deltaFrequency[deltaFrequency.name] = calendar.phases[deltaFrequency.labelNameList].indexOf(label)+1/* (label) this will run into error, no label*/

            // calendar.ctx.TC.innerHTML = ''// if there's no parent element span container timecode must be clear and used
            var parentSpan = /* parentElement.span || */calendar.ctx.TC // used
            var fChildSpan = parentSpan.children.length - 1
            if (currentIsMain) {
                deltaPrevLocator = deltaPrevLocator < 1 ? 1 : deltaPrevLocator > deltaFrequency._bands - 1 ? deltaFrequency._bands - 1 : deltaPrevLocator
                first = Math.floor((deltaPrevLocator - 1) * deltaFrequency._bands)
                length = (deltaPrevLocator + 1) * deltaFrequency._bands

                container = parentElement = mainFrequency.elements
                fChildSpan = 0
            }

            // if (!parentElement.enter && parentIsMain && control.init) // need to check into cases for every phase
                // continue

            if (parentLabel) this.output.push('>> ' + parentLabel)

            var fbLen = deltaFrequency.bands
            var _fbLen = deltaFrequency._bands
            var fFirst = deltaFrequency.first
            var _halfFbLen = _fbLen / 2

            // --month and year assign for first day (nextFrequency.first) of month and amount of days in month (nextFrequency._bands)
            if (nextFrequency.name == 'day') nextFrequency.year = parentLabel
            if (deltaFrequency.name == 'day') {
                deltaFrequency.year = container.parent[0]
                deltaFrequency.month = (p % 12) + 1
                fbLen = deltaFrequency.bands
                _fbLen = deltaFrequency._bands = 31
                fFirst = deltaFrequency.first
                var spanClassName = previousFrequency.bandWidthsIsFunction ? deltaFrequency.spanClassName + _fbLen : ''
                container.span.setAttribute('class', 'span freq ' + previousFrequency.name + spanClassName/** + ' '+p */)
            }
            container.list.length = _fbLen
            for (let f = fChildSpan; f < _fbLen; f++) { // days and hours problem to solve
                var numMod = (fFirst + f) % lableListLength

                if (deltaFrequency.name == 'hour') {
                    numMod = f / _halfFbLen % _halfFbLen >> 0
                    // numMod = numMod > 0 ? numMod >= lableListLength ? lableListLength-1 : numMod : 0
                }

                label = !deltaFrequency.labelNameListIsFunction ? calendar.phases[deltaFrequency.labelNameList][numMod] : deltaFrequency.labelNameList()

                if (deltaFrequency.name == 'day') label += '-' + (f % _fbLen + 1)
                if (deltaFrequency.name == 'hour') {
                    if (deltaFrequency.hour24Format) { label = (f % _fbLen) } else { label = ((f + _halfFbLen - 1) % _halfFbLen + 1) + label }
                }
                // Todo - For Calendar Days shifting p++ and pbLen required
                // --month and year assign for first day (nextFrequency.first) of month and amount of days in month (nextFrequency._bands)
                if (nextFrequency.name == 'day') {
                    nextFrequency.month = f + 1
                    nbLen = nextFrequency.bands
                    _nbLen = nextFrequency._bands = 31
                }
                var child = container.list[f] = container.list[f] || [
                    label,
                    {parent: currentIsMain ? undefined : parent}
                ]
                var element = child[1]

                if (element.enter || f <= s || f >= e) continue
                this.output.push(child[0])

                if (!element.list) {
                    element.enter = currentIsMain
                    element.list = element.list || {}
                    if (f >= fbLen) { element.wait = true }
                    var freqSpanClass = !element.wait ? 'span freq ' + deltaFrequency.name/** + ' '+(fbLen*p+f) */ : 'span freq ' + deltaFrequency.name + ' wait'/** + ' '+(fbLen*p+f) */
                    var elemFreqSpan = document.createElement('span')
                    elemFreqSpan.setAttribute('class', freqSpanClass)
                    element.span = window.appending(elemFreqSpan)

                    if (element.wait) {
                        child[0] = container.list[fbLen - 1][0]
                        label = '-'
                    }

                    var elemFreqSpanLabel = document.createElement('label')
                    elemFreqSpanLabel.innerHTML = label
                    elemFreqSpan.appendChild(elemFreqSpanLabel)
                    element.span.label = elemFreqSpanLabel

                    // create bands for the year frequencies
                    // dynamic scale
                    var elemFreqSpanBandDiv = document.createElement('div')
                    var bandClassName = deltaFrequency.bandWidthsIsFunction ? deltaFrequency.bandClassName + _nbLen : deltaFrequency.bandClassName
                    elemFreqSpanBandDiv.setAttribute('class', bandClassName)
                    element.span.band = elemFreqSpanBandDiv

                    if (!element.enter) { continue }
                    if (calendar.ctx.style[deltaFrequency.name]) { parentSpan.appendBeforeLastChild(elemFreqSpan) } else { parentSpan.appendChild(elemFreqSpan) }
                } else {
                    element.enter = true
                    var elemFreqSpan = element.span
                    var elemFreqSpanBandDiv = element.span.band

                    if (element.wait) {
                        child[0] = container.list[fbLen - 1][0]
                        label = '-'
                    }

                    if (elemFreqSpan.children.length == 0) {
                        var elemFreqSpanLabel = document.createElement('label')
                        elemFreqSpanLabel.innerHTML = label
                        elemFreqSpan.appendChild(elemFreqSpanLabel)
                        element.span.label = elemFreqSpanLabel
                    }
                    if (calendar.ctx.style[deltaFrequency.name]) { parentSpan.appendBeforeLastChild(elemFreqSpan) } else { parentSpan.appendChild(elemFreqSpan) }
                }

                // next frequency bands * calander days function
                if (element.wait) {
                    for (let w = elemFreqSpanBandDiv.children.length; w < 2; w++) {
                        var elemFreqSpanBandDivUnit = document.createElement('div')
                        elemFreqSpanBandDivUnit.setAttribute('class', 'half')
                        elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                    }
                    elemFreqSpan.appendChild(elemFreqSpanBandDiv)
                    continue
                }
                var nfFirst = nextFrequency.first
                for (let b = elemFreqSpanBandDiv.children.length; b < _nbLen; b++) {
                    var elemFreqSpanBandDivUnit = document.createElement('div')
                    if (b == 0) { elemFreqSpanBandDivUnit.setAttribute('class', 'first') }
                    if (b >= nbLen) { elemFreqSpanBandDivUnit.setAttribute('class', 'wait') }
                    elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                }
                elemFreqSpan.appendChild(elemFreqSpanBandDiv)

                var skLen = Object.keys(deltaFrequency.sub).length
                for (let si = 0; si < skLen; si++) {
                    var subFrequencyName = Object.keys(deltaFrequency.sub)[si]
                    var subFrequency = deltaFrequency.sub[subFrequencyName]
                    /* if (!control.enter) */element[subFrequencyName] = undefined
                    this[subFrequencyName](calendar, child, subFrequencyName, subFrequency.first || nfFirst, nbLen, subFrequency.freq, calendar.phases[subFrequency.labelNameList])
                }
            }
            // whole list control list for filtering, optimize
            if (!control.init && !currentIsMain) {
                control.list.length = control.list.length || 0
                container.list.position = control.list.length
                control.list.length += container.list.length
                for (let li = 0; li < container.list.length; li++) {
                    control.list[container.list.position + li] = container.list[li]
                }
            }
        }

        if (this.output.length > 0) console.log('Regen: ' + JSON.stringify(this.output))
        if (!control.init) {
            if (currentIsMain) { control.list = container.list }
            if (currentIsMain) { control.list.parent = ['timeline-code', {span: parentSpan}] } else { control.list.parent = calendar.stack[previousFrequencyName] }

            control.isMain = currentIsMain
            control.init = true
            control.enter = true
            control.empty = false
            control.list.percentile = 100 / control.list.length

            calendar.ctx.execStyle(deltaFrequency, deltaFrequency.bandWidths)
            calendar.ctx.style[deltaFrequency.name]._name = deltaFrequency.name
            calendar.ctx.style.toggle = calendar.ctx.style[deltaFrequency.name]
            calendar.ctx.style.main = currentIsMain ? calendar.ctx.style.toggle : calendar.ctx.style.main
            return control
        }

        return control
    }
    var R = {
        output: '',
        pad: {left: -1, right: 1},
        year: regen_main,
        quarter: function quarter (calendar, parent, name, first, iterate, subFreq, subLabel) {
            var element = parent[1]
            if (element[name] || !element.enter) { return }

            first = first || 0
            iterate = iterate || calendar.phases.quartersInYear
            subFreq = subFreq || calendar.phases.monthsInQuarter
            subLabel = subLabel || calendar.phases.quarterNames
            var label = ''

            // subphase when expansion reaches a certain percent
            var parentElement = element
            var child = parentElement[name] = {enter: true, list: {}}
            var l = 0
            for (let i = first; i < iterate; i += subFreq) {
                label = subLabel[l]
                element = child.list[label] = {enter: true, list: {}}

                var elemFreqSpanBandLabel = document.createElement('label')
                elemFreqSpanBandLabel.innerHTML = i == first ? parent[0] + '-' + label : label
                parentElement.span.band.children[i].setAttribute('class', 'first')
                parentElement.span.band.children[i].appendChild(elemFreqSpanBandLabel)
                element.label = elemFreqSpanBandLabel
                l++
            }
            return parent
        },
        month: regen_main,
        week: function week (calendar, parent, name, first, iterate, subFreq, subLabel) {
            var element = parent[1]
            if (element[name] || !element.enter) { return }

            first = first || 0
            iterate = iterate || calendar.phases.quartersInYear
            subFreq = subFreq || calendar.phases.monthsInQuarter
            subLabel = subLabel || calendar.phases.quarterNames

            // subphase when expansion reaches a certain percent
            var parentElement = element
            var child = parentElement[name] = {enter: true, list: {}}
            var label = subLabel[0]
            element = child.list[label] = {enter: true, list: {}}

            var elemFreqSpanBandLabel = document.createElement('label')
            elemFreqSpanBandLabel.innerHTML = first == 0 ? parent[0] + '-' + label + '1' : parent[0]
            parentElement.span.band.children[0].setAttribute('class', 'first')
            parentElement.span.band.children[0].appendChild(elemFreqSpanBandLabel)
            element.label = elemFreqSpanBandLabel

            first = subFreq - first
            var l = 0
            for (let i = first; i < iterate; i += subFreq) {
                label = subLabel[l]
                element = child.list[label] = {enter: true, list: {}}

                var elemFreqSpanBandLabel = document.createElement('label')
                elemFreqSpanBandLabel.innerHTML = label + (i + 1)
                parentElement.span.band.children[i].setAttribute('class', 'first')
                parentElement.span.band.children[i].appendChild(elemFreqSpanBandLabel)
                element.label = elemFreqSpanBandLabel
                l++
            }
            return parent
        },
        day: regen_main,
        morningNoon: function morningNoon (calendar, parent, name, first, iterate, subFreq, subLabel) {
            var element = parent[1]
            if (element[name] || !element.enter) { return }

            first = first || 0
            iterate = iterate || calendar.phases.quartersInYear
            subFreq = subFreq || calendar.phases.monthsInQuarter
            subLabel = subLabel || calendar.phases.quarterNames
            var label = ''

            // subphase when expansion reaches a certain percent
            var parentElement = element
            var child = parentElement[name] = {enter: true, list: {}}
            var l = 0
            for (let i = first; i < iterate; i += subFreq) {
                label = subLabel[l]
                element = child.list[label] = {enter: true, list: {}}

                var elemFreqSpanBandLabel = document.createElement('label')
                elemFreqSpanBandLabel.innerHTML = i == first ? parent[0] + '-' + label : label
                parentElement.span.band.children[i].setAttribute('class', 'first')
                parentElement.span.band.children[i].appendChild(elemFreqSpanBandLabel)
                element.label = elemFreqSpanBandLabel
                l++
            }
            return parent
        },
        hour: regen_main,
        tenMinutes: function tenMinutes (calendar, parent, name, first, iterate, subFreq, subLabel) {
            var element = parent[1]
            if (element[name] || !element.enter) { return }

            first = first || 0
            iterate = iterate || calendar.phases.quartersInYear
            subFreq = subFreq || calendar.phases.monthsInQuarter
            subLabel = subLabel || calendar.phases.quarterNames

            // subphase when expansion reaches a certain percent
            var parentElement = element
            var child = parentElement[name] = {enter: true, list: {}}
            var label = subLabel[0]
            element = child.list[label] = {enter: true, list: {}}

            var elemFreqSpanBandLabel = document.createElement('label')
            elemFreqSpanBandLabel.innerHTML = parent[0]
            parentElement.span.band.children[0].setAttribute('class', 'first')
            parentElement.span.band.children[0].appendChild(elemFreqSpanBandLabel)
            element.label = elemFreqSpanBandLabel

            for (let i = first; i < iterate; i += subFreq) {
                label = subLabel[0]
                element = child.list[label] = {enter: true, list: {}}

                var elemFreqSpanBandLabel = document.createElement('label')
                elemFreqSpanBandLabel.innerHTML = i + label
                parentElement.span.band.children[i].setAttribute('class', 'first')
                parentElement.span.band.children[i].appendChild(elemFreqSpanBandLabel)
                element.label = elemFreqSpanBandLabel
            }
            return parent
        },
        minute: regen_main,
        tenSeconds: function tenSeconds (calendar, parent, name, first, iterate, subFreq, subLabel) {
            var element = parent[1]
            if (element[name] || !element.enter) { return }

            first = first || 0
            iterate = iterate || calendar.phases.quartersInYear
            subFreq = subFreq || calendar.phases.monthsInQuarter
            subLabel = subLabel || calendar.phases.quarterNames

            // subphase when expansion reaches a certain percent
        },
        second: regen_main,
        millisecond: regen_main
    }
    var degen_main = function (calendar, deltaFrequency, start, end, empty) {
        this.output = []
        var frequencies = calendar.phases.frequencies
        var mainFrequency = calendar.phases.mainFrequency
        var nextFrequencyName = Object.keys(frequencies)[calendar.phases.total - (deltaFrequency.phase - 1)]
        var nextFrequency = frequencies[nextFrequencyName] || {}
        var previousFrequencyName = Object.keys(frequencies)[calendar.phases.total - (deltaFrequency.phase + 1)] || deltaFrequency.name
        var previousStack = calendar.stack[previousFrequencyName]

        var deltaFrequencyStyle = calendar.ctx.style[deltaFrequency.name]

        if (deltaFrequency.name == 'day') {
            deltaFrequency._bands = 31
        }

        var control = deltaFrequency.elements
        if (!control.enter) return

        var s = start + this.pad.left
        var e = end + this.pad.right

        var length = control.list.length

        // phase change empty
        if (control.empty != empty) {
            // empty the elements
            // * make main empty and assign empty style to element
            if (deltaFrequencyStyle.fill.left.enter) { deltaFrequencyStyle.fill.left.span.parentNode.removeChild(deltaFrequencyStyle.fill.left.span) }
            deltaFrequencyStyle.fill.left.enter = false
            if (deltaFrequencyStyle.fill.right.enter) { deltaFrequencyStyle.fill.right.span.parentNode.removeChild(deltaFrequencyStyle.fill.right.span) }
            deltaFrequencyStyle.fill.right.enter = false
            control.empty = empty
            if (empty) {
                for (let f = 0; f < length; f++) {
                    if (!control.list[f]) continue
                    var element = control.list[f][1]
                    var elementLabel = control.list[f][0]
                    element.span.innerHTML = ''
                    element.span.band.innerHTML = ''
                    element.enter = false

                    if (element.span.parentNode) { element.span.parentNode.removeChild(element.span) }

                    /* if (element.list[0])// set all child enter to false
                    for (let nfb = 0; nfb < deltaFrequency._bands; nfb++) {
                        element.list[nfb][1].enter = false
                    } */
                    // element.list = undefined

                    // remove all sub frequencies
                    /* for (let d = deltaFrequency.phase-1; d > 0; d--) {
                        var frequencyName = Object.keys(frequencies)[d]
                        element[frequencyName] = undefined
                    } */
                    // remove all sub
                    this.output.push(elementLabel)
                    var skLen = Object.keys(deltaFrequency.sub).length
                    for (let si = 0; si < skLen; si++) {
                        var deltaSubFrequencyName = Object.keys(deltaFrequency.sub)[si]
                        /* if (!control.enter) */ element[deltaSubFrequencyName] = undefined
                        this[deltaSubFrequencyName](element)
                    }
                }
                // return from emptying the elements
                console.log('Empty: ' + JSON.stringify(this.output))
                return control
            } else {
                var nextFrequencyElements = nextFrequency.elements
                length = nextFrequencyElements.list.length
                for (let f = 0; f < length; f++) {
                    if (!nextFrequencyElements.list[f]) continue
                    var element = nextFrequencyElements.list[f][1]
                    var elementLabel = nextFrequencyElements.list[f][0]
                    element.span.innerHTML = ''
                    element.span.band.innerHTML = ''
                    element.enter = false

                    if (element.span.parentNode) { element.span.parentNode.removeChild(element.span) }

                    this.output.push(elementLabel)
                }
                console.log('Empty: ' + JSON.stringify(this.output))
            }
        }

        // remove elements bit by bit

        if (control.empty) return control
        var deltaPrevLocator = deltaFrequency.range.locator / deltaFrequency._bands
        deltaPrevLocator = deltaPrevLocator < 1 ? 1 : deltaPrevLocator > previousStack.list.length - 1 ? previousStack.list.length - 1 : deltaPrevLocator
        var first = Math.floor((deltaPrevLocator - 1) * deltaFrequency._bands)
        var length = (deltaPrevLocator + 1) * deltaFrequency._bands
        length = length > control.list.length ? control.list.length : length

        var leftFill = start < 1 ? 0 : start
        leftFill = leftFill * deltaFrequency.elements.list.percentile
        // leftFill = leftFill / 100 * toggleFrequencyStyle.empty.percent

        var rightFill = e > control.list.length ? control.list.length : e
        rightFill = (control.list.length - rightFill) * deltaFrequency.elements.list.percentile
        // rightFill = rightFill / 100 * toggleFrequencyStyle.empty.percent

        if (!deltaFrequencyStyle.fill.left.enter && !control.empty) {
            deltaFrequencyStyle.fill.left.enter = true
            mainFrequency.elements.list.parent[1].span.appendAfterFirstChild(deltaFrequencyStyle.fill.left.span)
        }
        deltaFrequencyStyle.fill.left.percentile = leftFill
        if (!deltaFrequencyStyle.fill.right.enter && !control.empty) {
            deltaFrequencyStyle.fill.right.enter = true
            mainFrequency.elements.list.parent[1].span.appendChild(deltaFrequencyStyle.fill.right.span)
        }
        deltaFrequencyStyle.fill.right.percentile = rightFill
        for (let cfb = first; cfb < length; cfb++) {
            var element = control.list[cfb][1]
            if (!element.enter || (cfb > s && cfb < e)) continue
            element.enter = false
            element.span.innerHTML = ''
            element.span.band.innerHTML = ''
            element.span.parentNode.removeChild(element.span)

            /* if (element.list[0])// set all child enter to false
            for (let nfb = 0; nfb < deltaFrequency._bands; nfb++) {
                element.list[nfb][1].enter = false
            }
            //element.list = undefined

            // remove all child frequencies
            for (let d = deltaFrequency.phase-1; d > 0; d--) {
                var frequencyName = Object.keys(frequencies)[d]
                element[frequencyName] = undefined
            } */
            // remove all sub
            this.output.push(control.list[cfb][0])
            let skLen = Object.keys(deltaFrequency.sub).length
            for (let si = 0; si < skLen; si++) {
                var deltaSubFrequencyName = Object.keys(deltaFrequency.sub)[si]
                /* if (!control.enter) */ element[deltaSubFrequencyName] = undefined
                this[deltaSubFrequencyName](element)
            }
        }
        if (this.output.length > 0) console.log('Degen: ' + JSON.stringify(this.output))
        return control
    }
    var D = {
        output: [],
        pad: {left: -1, right: 1},
        year: degen_main,
        quarter: function (element, empty) {
            var name = 'quarter'
            element[name] = undefined
            return element
        },
        month: degen_main,
        week: function (element, empty) {
            var name = 'week'
            element[name] = undefined
            return element
        },
        day: degen_main,
        morningNoon: function (element, empty) {
            var name = 'morningNoon'
            element[name] = undefined
            return element
        },
        hour: degen_main,
        tenMinutes: function (element, empty) {
            var name = 'tenMinutes'
            element[name] = undefined
            return element
        },
        minute: degen_main,
        tenSeconds: function (element, empty) {
            var name = 'tenSeconds'
            element[name] = undefined
            return element
        },
        second: degen_main,
        millisecond: degen_main
    }

    // Public

    // Class Init
    that.Init = function (calendar, bandWidths) {
        // Private
        var ctx = calendar.ctx
        var CL = ctx.CL
        var TL = ctx.TL
        var TC = ctx.TC

        var frequency

        var style = ctx.style = {}

        ctx.execStyle = this.execStyle = function (frequency, bandWidths) {
            style[frequency.name] = {}
            style[frequency.name].empty = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + '.empty',
            [
                ''
            ].join('\n'))
            style[frequency.name].empty.width = '100%'

            style[frequency.name].fill = {}
            style[frequency.name].fill.left = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + '.fill.left',
            [
                '        min-width: 0px;'
            ].join('\n'))
            style[frequency.name].fill.left.width = '0%'
            style[frequency.name].fill.left.span = document.createElement('span')
            style[frequency.name].fill.left.span.setAttribute('class', 'span freq ' + frequency.name + ' fill left')

            style[frequency.name].fill.right = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + '.fill.right',
            [
                '        min-width: 0px;'
            ].join('\n'))
            style[frequency.name].fill.right.width = '0%'
            style[frequency.name].fill.right.span = document.createElement('span')
            style[frequency.name].fill.right.span.setAttribute('class', 'span freq ' + frequency.name + ' fill right')

            style[frequency.name].freqs = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name,
            [
                '        min-width: ' + frequency.span + 'px;'
            ].join('\n'))
            style[frequency.name].freqs.width = frequency.elements.list.percentile + '%'

            style[frequency.name].freqs.label = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + ' label',
            [
                '        visibility: visible;'
            ].join('\n'))
            style[frequency.name].freqs.span = {}
            style[frequency.name].freqs.extra = {}
            style[frequency.name].freqs.band = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + ' .band div',
            [
                ''
            ].join('\n'))
            // if (frequency.name != 'day')
            style[frequency.name].freqs.band.width = (100 / calendar.phases.nextFrequency._bands) + '%'
            style[frequency.name].freqs.div = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + ' div.band',
            [
                ''
            ].join('\n'))
            style[frequency.name].freqs.div.width = 100 + '%'

            if (bandWidths) {
                bandWidths = typeof bandWidths != 'function' ? bandWidths : bandWidths()
                style[frequency.name].freqs.span.widths = []
                style[frequency.name].freqs.extra.widths = []
                style[frequency.name].freqs.band.widths = []
                for (let bw = 0; bw < bandWidths.length; bw++) {
                    var bandWidth = '.w' + bandWidths[bw]
                    style[frequency.name].freqs.band.widths[bw] = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + ' .band' + bandWidth + ' div',
                    [
                        ''
                    ].join('\n'))
                    style[frequency.name].freqs.span.widths[bw] = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + calendar.phases.previousFrequency.name + ' .span.freq.' + frequency.name + '.band' + bandWidth + ' span',
                    [
                        ''
                    ].join('\n'))
                    style[frequency.name].freqs.band.widths[bw].width = style[frequency.name].freqs.span.widths[bw].width = (100 / bandWidths[bw]) + '%'
                    style[frequency.name].freqs.extra.widths[bw] = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + calendar.phases.previousFrequency.name + ' .span.freq.' + frequency.name + '.band' + bandWidth + ' span',
                    [
                        ''
                    ].join('\n'))
                }
            }

            style[frequency.name].freqs.band.label = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + ' .band label',
            [
                '        visibility: hidden;'
            ].join('\n'))
            style[frequency.name].freqs.band.divFirstLabel = window.addStyleRules(ctx.styleSheet, '#' + TL.id + ' .span.freq.' + frequency.name + ' .band div.first label',
            [
                '        position: relative;',
                '        top: -12px;'
            ].join('\n'))
        }
        this.adjust = function () {
            TC.style.minWidth = calendar.expand.min + 'px'
            TC.style.maxWidth = calendar.expand.max + 'px'
        }
        this.regen = function (_current, rangeStart, rangeEnd, empty) {
            _current = _current || calendar.phases.current
            frequency = calendar.phases.frequencies[_current] || frequency
            frequency.elements = frequency.elements || {}
            calendar.stack = calendar.stack || {}
            calendar.stack[_current] = calendar.stack[_current] || frequency.elements
            switch (_current) {
            case 'year': R.year(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'month': R.month(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'day': R.day(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'hour': R.hour(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'minute': R.minute(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'second': R.second(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'millisecond': R.millisecond(calendar, frequency, rangeStart, rangeEnd, empty); break
            default: R.year(calendar, frequency, rangeStart, rangeEnd, empty)
            }
            return calendar.stack[_current]
        }
        this.degen = function (_current, rangeStart, rangeEnd, empty) {
            _current = _current || calendar.phases.current
            frequency = calendar.phases.frequencies[_current] || frequency
            frequency.elements = frequency.elements || {}
            calendar.stack = calendar.stack || {}
            calendar.stack[_current] = calendar.stack[_current] || frequency.elements
            switch (_current) {
            case 'year': D.year(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'month': D.month(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'day': D.day(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'hour': D.hour(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'minute': D.minute(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'second': D.second(calendar, frequency, rangeStart, rangeEnd, empty); break
            case 'millisecond': D.millisecond(calendar, frequency, rangeStart, rangeEnd, empty); break
            default: D.year(calendar, frequency, rangeStart, rangeEnd, empty)
            }
        }
        this.regen()
        this.pad = {left: -1, right: 1}
        this.reset = function (_current, _delta, _next, start, end, subReset) {
            var currentFrequencyStyle = calendar.ctx.style[_current]
            var currentFrequency = calendar.phases.frequencies[_current]
            currentFrequency.elements.enter = true
            // currentFrequency.elements.empty = false

            if (currentFrequencyStyle.fill.left.enter) { currentFrequencyStyle.fill.left.span.parentNode.removeChild(currentFrequencyStyle.fill.left.span) }
            currentFrequencyStyle.fill.left.enter = false
            if (currentFrequencyStyle.fill.right.enter) { currentFrequencyStyle.fill.right.span.parentNode.removeChild(currentFrequencyStyle.fill.right.span) }
            currentFrequencyStyle.fill.right.enter = false

            var deltaFrequencyStyle = calendar.ctx.style[_delta]

            if (deltaFrequencyStyle.fill.left.enter) { deltaFrequencyStyle.fill.left.span.parentNode.removeChild(deltaFrequencyStyle.fill.left.span) }
            deltaFrequencyStyle.fill.left.enter = false
            if (deltaFrequencyStyle.fill.right.enter) { deltaFrequencyStyle.fill.right.span.parentNode.removeChild(deltaFrequencyStyle.fill.right.span) }
            deltaFrequencyStyle.fill.right.enter = false

            calendar.ctx.style.toggle = calendar.ctx.style[currentFrequency.name]
            currentFrequency.subReset(subReset)

            if (!_next) return
            var nextFrequency = calendar.phases.nextFrequency
            var control = nextFrequency.elements
            control.enter = false
        }
    }
})(this.Calendar)
