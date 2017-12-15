/**
 * Building Calendar Class: Generate
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Calendar) {
    //Class Struct prototype
    var _struct = Calendar.prototype
    var that = _struct.generate = {}
    //Class Declarations
    
    //Private
    var general = function (calendar, deltaFrequency, start, end, empty, filter) {
        this.output = []
        var frequencies = calendar.phases.frequencies
        var mainFrequency = calendar.phases.mainFrequency
        
        var nextFrequencyName = Object.keys(frequencies)[calendar.phases.total - (deltaFrequency.phase - 1)]
        var nextFrequency = frequencies[nextFrequencyName] || {}

        var previousFrequencyName = Object.keys(frequencies)[calendar.phases.total - (deltaFrequency.phase + 1)]
        var previousFrequency = frequencies[previousFrequencyName] || {}
        //debugger
        //var previousElementList = previousElements.list || {}

        var mainIsCurrent = deltaFrequency.name == mainFrequency.name

        if (mainIsCurrent) {
            previousFrequency.bands = 1
            previousFrequency.element = {list: {}}
        }

        var control = calendar.stack[deltaFrequency.name]
        if (!control.init) {
            deltaFrequency.labelNameListIsFunction = typeof deltaFrequency.labelNameList == 'function'
            deltaFrequency.bandWidthsIsFunction = typeof deltaFrequency.bandWidths == 'function'
            deltaFrequency.bandClassName = !deltaFrequency.bandWidthsIsFunction ? 'band' : 'band w'
            calendar.ctx.execStyle(deltaFrequency, deltaFrequency.bandWidths) 
            calendar.ctx.style.toggle = calendar.ctx.style[deltaFrequency.name]
            calendar.ctx.style.main = calendar.ctx.style.main || calendar.ctx.style.toggle  
        }
            
        control.list = control.list || {}
        control.enter = typeof control.enter == 'undefined' ? true : control.enter

        var s = start + this.pad.left
        var e = end + this.pad.right
        // days and hours problem to solve 
        //previousFrequency[previousFrequency.name] = Object.keys(previousElementList)[p]/* [p] this will run into error, must be in loop*/
        //previousFrequency[deltaFrequency.name] = calendar.phases[deltaFrequency.labelNameList].indexOf(label)+1/* (label) this will run into error, no label*/

        var pbLen = previousFrequency.bands
        var cbLen = deltaFrequency.bands
        var nbLen = nextFrequency.bands

        if (control.empty != empty) {
            if (empty) {
                control.empty = empty
                for (var f = 0; f < cbLen; f++) {
                    control.list[f][1].span.innerHTML = ''
                    //control.list[f][1].enter = false
                    console.log('Empty: ' + control.list[f][0])
                    control.list[f][1].dead = true
                    
                    var skLen = Object.keys(deltaFrequency.sub).length
                    for (var si = 0; si < skLen; si++) {
                        var deltaSubFrequencyName = Object.keys(deltaFrequency.sub)[si]
                        //var deltaSubFrequency = deltaFrequency.sub[deltaSubFrequencyName]
                        if (!control.enter) element[deltaSubFrequencyName] = undefined
                        D[deltaSubFrequencyName](control.list[f][1])               
                    }
                }
            } else if (!empty && control.empty) {
                for (var f = 0; f < cbLen; f++) {
                    var element = control.list[f][1]
                    control.list[f][1].span.innerHTML = ''
                    element.enter = false
                }
            }
            control.empty = empty
        }
        if (empty && control.empty == empty) {
            if (!nextFrequency.element) return
            var filter = []
            for (var f = 0; f < cbLen; f++) {
                var element = control.list[f][1]
                var elementLabel = control.list[f][0]

                if (f <= s || f >= e) continue;
                element.enter = true
                filter.push(elementLabel)

            }
            this[nextFrequencyName](calendar, nextFrequency, nextFrequency.range.start, nextFrequency.range.end, nextFrequency.element.empty, filter)
            return
        }
        var fLen = filter ? filter.length : 0
        var result = undefined

        // fix
        
        for (var p = 0; p < pbLen; p++) {// days and hours problem to solve 
            // Todo - For Calendar Days shifting p++ and pbLen required
            var previous = previousFrequency.element.list[p] || {}//
            var previousElement = previous[1] || {}
            var previousLabel = previous[0]
            // previousFrequency[previousFrequency.name] = previousLabel
            
            var result = undefined
            if (filter) // skip if deltaFrequency not in filter
                for (var fl = 0; fl < fLen; fl++)
                    result = (result || previousLabel == filter[fl])

            if (filter && !result) continue;

            
            previous[2] = previousElement.list || {}            
            container = previousElement
            container.list = container.list || {}
            container.enter = container.enter || previous.enter

            // control list is constant changing 
            if (filter) control.list = container.list
            

            // days and hours problem to solve 
            //deltaFrequency[previousFrequency.name] = previousLabel
            //deltaFrequency[deltaFrequency.name] = calendar.phases[deltaFrequency.labelNameList].indexOf(label)+1/* (label) this will run into error, no label*/
            
            var fbLen = deltaFrequency.bands
            var fFirst = deltaFrequency.first

            //calendar.ctx.TC.innerHTML = ''// if there's no previous element span container timecode must be clear and used
            var previousSpan = previousElement.span || calendar.ctx.TC // used
            var ffirst = previousSpan.children.length
            if (!previousElement.span && mainIsCurrent) {
                container = previousElement = mainFrequency.element
                ffirst = 0
            }

            if (!previousElement.enter) // need to check into cases for every phase
                continue

            if (previousLabel) this.output.push('>> '+previousLabel)

            // --month and year assign for first day (nextFrequency.first) of month and amount of days in month (nextFrequency.bands)
            if (nextFrequency.name == 'day') nextFrequency.year = previousLabel
            for (var f = ffirst; f < fbLen; f++) {// days and hours problem to solve 
                // Todo - For Calendar Days shifting p++ and pbLen required
                // --month and year assign for first day (nextFrequency.first) of month and amount of days in month (nextFrequency.bands)
                if (nextFrequency.name == 'day') nextFrequency.month = f+1
                nbLen = nextFrequency.bands

                var label = !deltaFrequency.labelNameListIsFunction ? calendar.phases[deltaFrequency.labelNameList][f] : deltaFrequency.labelNameList() 
                container.list[f] = container.list[f] || [
                    label, 
                    {dead: false}
                ]
                var element = container.list[f][1]

                if (element.dead) {
                    var elemFreqSpan = element.span
                    var elemFreqSpanBandDiv = element.span.band
                    // create year frequencies keep current year in center of timecode
                    var elemFreqSpanLabel = document.createElement('label')
                    elemFreqSpanLabel.innerHTML = label
                    elemFreqSpan.appendChild(elemFreqSpanLabel)
                    element.span.label = elemFreqSpanLabel

                    // create bands for the year frequencies
                    var elemFreqSpanBandDiv = document.createElement('div')
                    var bandClassName = deltaFrequency.bandWidthsIsFunction ? deltaFrequency.bandClassName+nbLen : deltaFrequency.bandClassName
                    elemFreqSpanBandDiv.setAttribute('class', bandClassName)
                    element.span.band = elemFreqSpanBandDiv
                    element.dead = false
                }

                if (control.enter && (element.enter || f <= s || f >= e)) continue;
                
                this.output.push(container.list[f][0])

                if (!element.list || !control.enter || filter) {
                    element.enter = true
                    element.list = element.list || {}
                    var elemFreqSpan = document.createElement('span')
                    elemFreqSpan.setAttribute('class', 'span freq ' + deltaFrequency.name)
                    element.span = elemFreqSpan

                    // create year frequencies keep current year in center of timecode
                    var elemFreqSpanLabel = document.createElement('label')
                    elemFreqSpanLabel.innerHTML = label
                    elemFreqSpan.appendChild(elemFreqSpanLabel)
                    element.span.label = elemFreqSpanLabel

                    // create bands for the year frequencies
                    // dynamic scale

                    var elemFreqSpanBandDiv = document.createElement('div')
                    var bandClassName = deltaFrequency.bandWidthsIsFunction ? deltaFrequency.bandClassName+nbLen : deltaFrequency.bandClassName
                    elemFreqSpanBandDiv.setAttribute('class', bandClassName)
                    element.span.band = elemFreqSpanBandDiv
                    //
                    previousSpan.appendChild(elemFreqSpan)
                } else {
                    element.enter = true
                    var elemFreqSpan = element.span
                    var elemFreqSpanBandDiv = element.span.band
                }

                // next frequency bands * calander days function
                var nfFirst = nextFrequency.first
                var startFunc = nextFrequency.startFunc
                var wait = false
                for (var b = elemFreqSpanBandDiv.children.length; b < nbLen; b++) {
                    var elemFreqSpanBandDivUnit = document.createElement('div')
                    if (b == 0)
                        elemFreqSpanBandDivUnit.setAttribute('class', 'first')
                    elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                    continue
                    var elemFreqSpanBandDivUnit = document.createElement('div')
                    var start = startFunc(b, nfFirst)
                    if (!wait) wait = start
                    if (startFunc(b, nfFirst) && b != 0)
                        elemFreqSpanBandDivUnit.setAttribute('class', 'start'); else if (b == 0) elemFreqSpanBandDivUnit.setAttribute('class', 'first');// else if (!wait) elemFreqSpanBandDivUnit.setAttribute('class', 'wait'); 
                    elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                }
                elemFreqSpan.appendChild(elemFreqSpanBandDiv)
                
                var skLen = Object.keys(deltaFrequency.sub).length
                for (var si = 0; si < skLen; si++) {
                    var subFrequencyName = Object.keys(deltaFrequency.sub)[si]
                    var subFrequency = deltaFrequency.sub[subFrequencyName]
                    if (!control.enter || filter) element[subFrequencyName] = undefined
                    this[subFrequencyName](calendar, element, subFrequencyName, nfFirst, nbLen, subFrequency.freq, calendar.phases[subFrequency.labelNameList])                
                }
            }
        }
        if (this.output.length > 0) console.log('Regen: '+JSON.stringify(this.output))
        if (!control.init) {
            control.list = container.list
            control.init = true
            control.enter = true
            return control
        }
        
        control.enter = true
        return container
    }
    var R = {
        output: '',
        pad: {left: -1, right: 1},
        year: general,
        quarter: function quarter(calendar, element, name, first, iterate, subFreq, subLabel) {
            if (element[name] || !element.enter)
            return
        
            var first = first || 0 
            var iterate = iterate || calendar.phases.quartersInYear
            var subFreq = subFreq || calendar.phases.monthsInQuarter
            var subLabel = subLabel || calendar.phases.quarterNames
            
            // subphase when expansion reaches a certain percent
            var parent = element
            var child = parent[name] = { enter: true, list: {}}
            var l = 0
            for (var i=first; i<iterate; i+=subFreq) {
                var label = subLabel[l]
                var element = child.list[label] = { enter: true, list: {}}

                var elemFreqSpanBandLabel = document.createElement('label')
                elemFreqSpanBandLabel.innerHTML = i == first ? parent.span.label.innerHTML+'-'+label : label
                parent.span.band.children[i].setAttribute('class', 'first')
                parent.span.band.children[i].appendChild(elemFreqSpanBandLabel)
                element.label = elemFreqSpanBandLabel
                l++
            }
            return parent
        },
        month: general,
        week: function week(calendar, element, name, first, iterate, subFreq, subLabel) {
            if (element[name] || !element.enter)
                return
            
            var first = first || 0 
            var iterate = iterate || calendar.phases.quartersInYear
            var subFreq = subFreq || calendar.phases.monthsInQuarter
            var subLabel = subLabel || calendar.phases.quarterNames
            
            // subphase when expansion reaches a certain percent
            var parent = element
            var child = parent[name] = { enter: true, list: {}}
            var l = 0
            var label = subLabel[0]
            var element = child.list[label] = { enter: true, list: {}}

            var elemFreqSpanBandLabel = document.createElement('label')
            elemFreqSpanBandLabel.innerHTML = first == 0 ? parent.span.label.innerHTML+'-'+label+'1' : parent.span.label.innerHTML
            parent.span.band.children[0].setAttribute('class', 'first')
            parent.span.band.children[0].appendChild(elemFreqSpanBandLabel)
            element.label = elemFreqSpanBandLabel

            first = subFreq-first
            
            for (var i=first; i<iterate; i+=subFreq) {
                var label = subLabel[l]
                
                var element = child.list[label] = { enter: true, list: {}}

                var elemFreqSpanBandLabel = document.createElement('label')
                elemFreqSpanBandLabel.innerHTML = label+(i+1)
                parent.span.band.children[i].setAttribute('class', 'first')
                parent.span.band.children[i].appendChild(elemFreqSpanBandLabel)
                element.label = elemFreqSpanBandLabel
                l++
            }
            return parent
        },
        day: general,
        hour: general,
        minute: general,
        second: general,
        millisecond: general
    }
    var D = {
        output: [],
        pad: {left: -1, right: 1},
        year: function (calendar, deltaFrequency, start, end, empty) {
            this.output = []
            var frequencies = calendar.phases.frequencies
            var currentFrequency = calendar.phases.currentFrequency
            
            var control = deltaFrequency.element
            if (!control.enter) return
            var s = start + this.pad.left
            var e = end + this.pad.right
            var cbLen = deltaFrequency.bands
            for (var cfb = 0; cfb < cbLen; cfb++) {
                var element = control.list[cfb][1]
                if (!element.enter || cfb > s && cfb < e) continue;
                element.enter = false
                if (empty)
                    element.span.innerHTML = ''
                else
                    element.span.band.innerHTML = ''
                for (var d = deltaFrequency.phase-1; d > 0; d--) {
                    var frequencyName = Object.keys(frequencies)[d]
                    element[frequencyName] = undefined
                }
                if (element.list[0])
                for (var nfb = 0; nfb < currentFrequency.bands; nfb++) {
                    element.list[nfb][1].enter = false
                }
                
                //element.span.band = undefined
                //element.span = undefined
                this.output.push(control.list[cfb][0])
                this.quarter(element, empty)
            }
            if (this.output.length > 0) console.log('Degen: '+JSON.stringify(this.output))
            return control
        },
        quarter: function (element, empty) {
            var name = 'quarter'
            element[name] = undefined
            return element
        },
        month: function (elem) {
            elements = elem || elements || {}
            return elements
        },
        week: function (elem) {
            
            elements = elem || elements || {}
            return elements
        },
        day: function (elem) {
            
            elements = elem || elements || {}
            return elements
        },
        hour: function (elem) {
            
            elements = elem || elements || {}
            return elements
        },
        minute: function (elem) {
            
            elements = elem || elements || {}
            return elements
        },
        second: function (elem) {
            
            elements = elem || elements || {}
            return elements
        },
        millisecond: function (elem) {
            
            elements = elem || elements || {}
            return elements
        }
    }

    //Public

    //Class Init
    that.Init = function (calendar, bandWidths) {
        //Private
        var ctx = calendar.ctx
        var CL = ctx.CL
        var TL = ctx.TL
        var TC = ctx.TC
        
        var frequency = undefined        

        var style = ctx.style = {}
        
        ctx.execStyle = this.execStyle = function (frequency, bandWidths) {
            style[frequency.name] = {}
            style[frequency.name].freqs = window.addStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq.'+frequency.name, 
            [
                '        min-width: '+frequency.span+'px;'
            ].join('\n'))
            style[frequency.name].freqs.width =  (100 / frequency.bands)+'%'

            style[frequency.name].freqs.label = window.addStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq.'+frequency.name+' label', 
            [
                '        visibility: visible;',
            ].join('\n'))
            style[frequency.name].freqs.band = window.addStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq.'+frequency.name+' .band div', 
            [
                '',
            ].join('\n'))
            style[frequency.name].freqs.band.width =  (100 / calendar.phases.nextFrequency.bands)+'%'

            if (bandWidths) {
                bandWidths = typeof bandWidths != 'function' ? bandWidths : bandWidths()
                style[frequency.name].freqs.band.widths = []
                for (var bw = 0; bw < bandWidths.length; bw++) {
                    let bandWidth = '.w'+bandWidths[bw]
                    style[frequency.name].freqs.band.widths[bw] = window.addStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq.'+frequency.name+' .band'+bandWidth+' div', 
                    [
                        '',
                    ].join('\n'))
                    style[frequency.name].freqs.band.widths[bw].width =  (100 / bandWidths[bw])+'%'
                }
            }

            style[frequency.name].freqs.band.label = window.addStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq.'+frequency.name+' .band label', 
            [
                '        visibility: hidden;',
            ].join('\n'))
            style[frequency.name].freqs.band.divFirstLabel = window.addStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq.'+frequency.name+' .band div.first label', 
            [
                '        position: relative;',
                '        top: -12px;'
            ].join('\n'))
        },
        this.adjust = function () {
            TC.style.minWidth = calendar.expand.min + 'px'
            TC.style.maxWidth = calendar.expand.max + 'px'
        },
        this.regen = function (_current, rangeStart, rangeEnd, empty) {
            var _current = _current || calendar.phases.current 
            frequency = calendar.phases.frequencies[_current] ? calendar.phases.frequencies[_current] : frequency
            frequency.element = frequency.element ? frequency.element : {}
            calendar.stack = calendar.stack ? calendar.stack : {}
            calendar.stack[frequency.name] = calendar.stack[frequency.name] ? calendar.stack[frequency.name] : frequency.element 
            switch (frequency.name) {
                case 'year': R.year(calendar, frequency, rangeStart, rangeEnd, empty); break;
                case 'month': R.month(calendar, frequency, rangeStart, rangeEnd, empty); break;
                case 'day': day(); hour(); break;
                case 'hour': hour(); minute(); break;
                case 'minute': minute(); second(); break;
                case 'second': second(); millisecond(); break;
                case 'millisecond': millisecond(); break;
                default: year(); 
            }
            return frequency.element
        },
        this.degen = function (_current, rangeStart, rangeEnd, empty) {
            var _current = _current || calendar.phases.current  
            var frequency = calendar.phases.frequencies[_current] ? calendar.phases.frequencies[_current] : frequency
            frequency.element = frequency.element ? frequency.element : {}
            calendar.stack = calendar.stack ? calendar.stack : {}
            calendar.stack[frequency.name] = calendar.stack[frequency.name] ? calendar.stack[frequency.name] : frequency.element 
            switch (frequency.name) {
                case 'year': D.year(calendar, frequency, rangeStart, rangeEnd, empty); break;
                case 'month': D.month(calendar, frequency, rangeStart, rangeEnd, empty); break;
                case 'day': day(); hour(); break;
                case 'hour': hour(); minute(); break;
                case 'minute': minute(); second(); break;
                case 'second': second(); millisecond(); break;
                case 'millisecond': millisecond(); break;
                default: year(); 
            }
        }
        this.regen()
        this.pad = {left: -1, right: 1}
        this.reset = function (_current, _next, start, end, subReset) {
            var _current = _current || calendar.phases.current  
            var frequency = calendar.phases.frequencies[_current] ? calendar.phases.frequencies[_current] : frequency
            /*var control = frequency.element
            control.enter = true
            var s = start + this.pad.left
            var e = end + this.pad.right
            for (var f = 0; f < frequency.bands; f++) {
                var element = control.list[f][1]
                if (element.enter || f > s && f < e) continue;
                element.enter = true
                //element.dead = true
                console.log('reset: ' + control.list[f][0]
            }
            switch (frequency.name) {
                case 'year': R.year(calendar, frequency, start, end, false); break;
                case 'month': R.month(calendar, frequency, start, end, false); break;
                case 'day': day(); hour(); break;
                case 'hour': hour(); minute(); break;
                case 'minute': minute(); second(); break;
                case 'second': second(); millisecond(); break;
                case 'millisecond': millisecond(); break;
                default: year(); 
            }*/
            calendar.ctx.style.toggle = calendar.ctx.style[frequency.name]
            frequency.subReset(subReset)

            if (!_next) return
                var nextFrequency = calendar.phases.nextFrequency
                var control = nextFrequency.element
                control.enter = false
        }
    }
})(this.Calendar)
