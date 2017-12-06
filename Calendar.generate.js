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
    var general = function (calendar, frequency, start, end, empty, filter) {
        var previousFrequency = calendar.phases.previousFrequency
        var previousElements = previousFrequency.element
        var previousElementList = previousFrequency.element.list
        var nextFrequency = calendar.phases.nextFrequency

        var control = frequency.element
        if (!control.init) { calendar.ctx.execStyle(frequency, [27, 28, 29, 30, 31, 32]);  calendar.ctx.style.toggle = calendar.ctx.style[frequency.name]  }
        control.init = true     
        control.enter = typeof control.enter == 'undefined' ? true : control.enter

        var s = start + this.pad.left
        var e = end + this.pad.right
        // days and hours problem to solve 
        previousFrequency[previousFrequency.name] = Object.keys(previousElementList)[p]/* [p] this will run into error, must be in loop*/
        previousFrequency[frequency.name] = calendar.phases[frequency.labelNameList].indexOf(label)+1/* (label) this will run into error, no label*/

        var pbLen = previousFrequency.bands
        var fLen = filter ? filter.length : 0
        var result = undefined
        for (var p = 0; p < pbLen; p++) {// days and hours problem to solve 
            // Todo - For Calendar Days shifting p++ and pbLen required
            var previousKey = previousFrequency[previousFrequency.name] = Object.keys(previousElementList)[p]
            var previous = previousElementList[previousKey]
            var result = undefined
            if (filter) // skip if frequency not in filter
                for (var fl = 0; fl < fLen; fl++)
                    result = (result || previousKey == filter[fl])

            if (filter && !result) continue;

            var container = previous[frequency.name] = typeof previous[frequency.name] == 'undefined' ? {} : previous[frequency.name]
            container.list = typeof container.list == 'undefined' ? {} : container.list
            container.enter = typeof container.enter == 'undefined' ? previous.enter : container.enter

            // days and hours problem to solve 
            frequency[previousFrequency.name] = previousKey
            frequency[frequency.name] = calendar.phases[frequency.labelNameList].indexOf(label)+1/* (label) this will run into error, no label*/
            
            var fbLen = frequency.bands
            var fFirst = frequency.first

            if (container.empty != empty) {
                if (empty) {
                    container.empty = empty
                    for (var f = 0; f < fbLen; f++) {
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        //container.list[Object.keys(container.list)[f]].enter = false
                        console.log('Empty: ' + Object.keys(container.list)[f])
                        container.list[Object.keys(container.list)[f]].dead = true
                        D.quarter(container.list[Object.keys(container.list)[f]])
                    }
                } else if (!empty && container.empty) {
                    for (var f = 0; f < fbLen; f++) {
                        var element = container.list[Object.keys(container.list)[f]]
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        element.enter = false
                    }
                }
                container.empty = empty
            }
            if (empty && container.empty == empty) {
                var nextFrequencyKey = Object.keys(calendar.phases.frequencies)[calendar.phases.total - (frequency.phase - 1)]
                var nextFrequency = calendar.phases.frequencies[nextFrequencyKey]
                if (!nextFrequency.element) return
                var filter = []
                for (var f = 0; f < fbLen; f++) {
                    var elementKey = Object.keys(container.list)[f]
                    var element = container.list[elementKey]

                    if (element.enter || f <= s || f >= e) continue;
                    element.enter = true
                    filter.push(elementKey)

                }
                this[nextFrequencyKey](calendar, nextFrequency, nextFrequency.range.start, nextFrequency.range.end, nextFrequency.element.empty, filter)
                return
            }
            if (!previous.enter)
                continue
            
            var previousSpan = previous.span
            for (var f = 0; f < fbLen; f++) {// days and hours problem to solve 
                // Todo - For Calendar Days shifting p++ and pbLen required
                var label = calendar.phases[frequency.labelNameList][f]
                var element = container.list[label] = typeof container.list[label] == 'undefined' ? {dead: false} : container.list[label]

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
                    elemFreqSpanBandDiv.setAttribute('class', 'band')
                    element.span.band = elemFreqSpanBandDiv
                    
                    element.dead = false
                }

                if (control.enter && (element.enter || f <= s || f >= e)) continue;
                console.log('regen: '+previousKey +' '+ Object.keys(container.list)[f], element.enter, 'Empty: '+empty+' Dead: '+element.dead)

                if (!element.list || !control.enter) {
                    element.enter = true
                    element.list = {}
                    var elemFreqSpan = document.createElement('span')
                    elemFreqSpan.setAttribute('class', 'span freq ' + frequency.name)
                    element.span = elemFreqSpan

                    // create year frequencies keep current year in center of timecode
                    var elemFreqSpanLabel = document.createElement('label')
                    elemFreqSpanLabel.innerHTML = label
                    elemFreqSpan.appendChild(elemFreqSpanLabel)
                    element.span.label = elemFreqSpanLabel

                    // create bands for the year frequencies
                    // dynamic scale

                    nextFrequency[previousFrequency.name] = previousKey
                    nextFrequency[frequency.name] = calendar.phases[frequency.labelNameList].indexOf(label)+1

                    var nbLen = nextFrequency.bands
                    var elemFreqSpanBandDiv = document.createElement('div')
                    elemFreqSpanBandDiv.setAttribute('class', 'band w'+nbLen)
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
                
                var skLen = Object.keys(frequency.sub).length
                for (var si = 0; si < skLen; si++) {
                    var subFrequencyName = Object.keys(frequency.sub)[si]
                    var subFrequency = frequency.sub[subFrequencyName]
                    if (!control.enter) element[subFrequencyName] = undefined
                    this[subFrequencyName](calendar, element, subFrequencyName, nfFirst, nbLen, subFrequency.freq, calendar.phases[subFrequency.labelNameList])                
                }
            }
        }
        control.enter = true
        return container
    }
    var R = {
        pad: {left: -1, right: 1},
        year: function (calendar, frequency, start, end, empty, filter) {
            var value = calendar.current[frequency.name]
            var container = frequency.element
            if (!container.list) { calendar.ctx.execStyle(frequency); calendar.ctx.style.main = calendar.ctx.style.toggle = calendar.ctx.style[frequency.name] }
            container.list = typeof container.list == 'undefined' ? {} : container.list
            container.enter = typeof container.enter == 'undefined' ? true : container.enter

            var s = (start || frequency.range.start) + this.pad.left
            var e = (end || frequency.range.end) + this.pad.right

            var fbLen = frequency.bands

            if (container.empty != empty) {
                if (empty) {
                    container.empty = empty
                    for (var f = 0; f < fbLen; f++) {
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        //container.list[Object.keys(container.list)[f]].enter = false
                        console.log('Empty: ' + Object.keys(container.list)[f])
                        container.list[Object.keys(container.list)[f]].dead = true
                        D.quarter(container.list[Object.keys(container.list)[f]])
                    }
                } else if (!empty && container.empty) {
                    for (var f = 0; f < fbLen; f++) {
                        var element = container.list[Object.keys(container.list)[f]]
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        element.enter = false
                    }
                }
                container.empty = empty
            }
            if (empty && container.empty == empty) {
                var nextFrequencyKey = Object.keys(calendar.phases.frequencies)[calendar.phases.total - (frequency.phase - 1)]
                var nextFrequency = calendar.phases.frequencies[nextFrequencyKey]
                if (!nextFrequency.element) return
                var filter = []
                for (var f = 0; f < fbLen; f++) {
                    var elementKey = Object.keys(container.list)[f]
                    var element = container.list[elementKey]
                    
                    if (f <= s || f >= e) continue;
                    element.enter = true
                    filter.push(elementKey)
                        
                }
                this[nextFrequencyKey](calendar, nextFrequency, nextFrequency.range.start, nextFrequency.range.end, nextFrequency.element.empty, filter)
                return
            }
            for (var f = 0; f < fbLen; f++) {
                var label = value + (f - (frequency.bands / 2))
                var element = container.list[label] = typeof container.list[label] == 'undefined' ? {dead: false} : container.list[label]
                
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
                    elemFreqSpanBandDiv.setAttribute('class', 'band')
                    element.span.band = elemFreqSpanBandDiv
                    
                    element.dead = false
                }

                if (element.enter || f <= s || f >= e) continue;
                console.log('regen: ' + Object.keys(container.list)[f], element.enter, 'Empty: '+empty+' Dead: '+element.dead)

                if (!element.list) {
                    element.enter = true
                    element.list = {}
                    var elemFreqSpan = document.createElement('span')
                    elemFreqSpan.setAttribute('class', 'span freq ' + frequency.name)
                    element.span = elemFreqSpan

                    // create year frequencies keep current year in center of timecode
                    var elemFreqSpanLabel = document.createElement('label')
                    elemFreqSpanLabel.innerHTML = label
                    elemFreqSpan.appendChild(elemFreqSpanLabel)
                    element.span.label = elemFreqSpanLabel

                    // create bands for the year frequencies
                    var elemFreqSpanBandDiv = document.createElement('div')
                    elemFreqSpanBandDiv.setAttribute('class', 'band')
                    element.span.band = elemFreqSpanBandDiv
                    //
                    calendar.ctx.TC.appendChild(elemFreqSpan)
                } else {
                    element.enter = true
                    var elemFreqSpan = element.span
                    var elemFreqSpanBandDiv = element.span.band
                }

                // next frequency bands
                var nfFirst = calendar.phases.nextFrequency.first
                var nbLen = calendar.phases.nextFrequency.bands
                for (var b = elemFreqSpanBandDiv.children.length; b < nbLen; b++) {
                    var elemFreqSpanBandDivUnit = document.createElement('div')
                    if (b == 0)
                        elemFreqSpanBandDivUnit.setAttribute('class', 'first')
                    elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                }
                elemFreqSpan.appendChild(elemFreqSpanBandDiv)

                var skLen = Object.keys(frequency.sub).length
                for (var si = 0; si < skLen; si++) {
                    var subFrequencyName = Object.keys(frequency.sub)[si]
                    var subFrequency = frequency.sub[subFrequencyName]
                    if (!container.enter) element[subFrequencyName] = undefined
                    this[subFrequencyName](calendar, element, subFrequencyName, nfFirst, nbLen, subFrequency.freq, calendar.phases[subFrequency.labelNameList])                
                }
            }
            return container
        },
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
            elemFreqSpanBandLabel.innerHTML = first == 0 ? parent.span.label.innerHTML+'-'+label : parent.span.label.innerHTML
            parent.span.band.children[0].setAttribute('class', 'first')
            parent.span.band.children[0].appendChild(elemFreqSpanBandLabel)
            element.label = elemFreqSpanBandLabel
            if (first == 0) {
                l = 1
                first = subFreq
            }
            for (var i=first; i<iterate; i+=subFreq) {
                var label = subLabel[l]
                var element = child.list[label] = { enter: true, list: {}}

                var elemFreqSpanBandLabel = document.createElement('label')
                elemFreqSpanBandLabel.innerHTML = label
                parent.span.band.children[i].setAttribute('class', 'first')
                parent.span.band.children[i].appendChild(elemFreqSpanBandLabel)
                element.label = elemFreqSpanBandLabel
                l++
            }
            return parent
        },
        day: general,
        hour: function (calendar, frequency, start, end, empty) {
            var container = frequency.element
            container.list = typeof container.list == 'undefined' ? {} : container.list
            container.enter = typeof container.enter == 'undefined' ? true : container.enter

            var s = start + this.pad.left
            var e = end + this.pad.right

            if (container.empty != empty) {
                container.empty = empty
                if (empty) {
                    for (var f = 0; f < frequency.bands; f++) {
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        //container.list[Object.keys(container.list)[f]].enter = false
                        console.log('Empty: ' + Object.keys(container.list)[f])
                        container.list[Object.keys(container.list)[f]].dead = true
                        D.quarter(container.list[Object.keys(container.list)[f]])
                    }
                return
                }
            } else if (empty) {
                return
            }

            return container
        },
        minute: function (calendar, frequency, start, end, empty) {
            var container = frequency.element
            container.list = typeof container.list == 'undefined' ? {} : container.list
            container.enter = typeof container.enter == 'undefined' ? true : container.enter

            var s = start + this.pad.left
            var e = end + this.pad.right

            if (container.empty != empty) {
                container.empty = empty
                if (empty) {
                    for (var f = 0; f < frequency.bands; f++) {
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        //container.list[Object.keys(container.list)[f]].enter = false
                        console.log('Empty: ' + Object.keys(container.list)[f])
                        container.list[Object.keys(container.list)[f]].dead = true
                        D.quarter(container.list[Object.keys(container.list)[f]])
                    }
                return
                }
            } else if (empty) {
                return
            }

            return container
        },
        second: function (calendar, frequency, start, end, empty) {
            var container = frequency.element
            container.list = typeof container.list == 'undefined' ? {} : container.list
            container.enter = typeof container.enter == 'undefined' ? true : container.enter

            var s = start + this.pad.left
            var e = end + this.pad.right

            if (container.empty != empty) {
                container.empty = empty
                if (empty) {
                    for (var f = 0; f < frequency.bands; f++) {
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        //container.list[Object.keys(container.list)[f]].enter = false
                        console.log('Empty: ' + Object.keys(container.list)[f])
                        container.list[Object.keys(container.list)[f]].dead = true
                        D.quarter(container.list[Object.keys(container.list)[f]])
                    }
                return
                }
            } else if (empty) {
                return
            }

            return container
        },
        millisecond: function (calendar, frequency, start, end, empty) {
            var container = frequency.element
            container.list = typeof container.list == 'undefined' ? {} : container.list
            container.enter = typeof container.enter == 'undefined' ? true : container.enter

            var s = start + this.pad.left
            var e = end + this.pad.right

            if (container.empty != empty) {
                container.empty = empty
                if (empty) {
                    for (var f = 0; f < frequency.bands; f++) {
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        //container.list[Object.keys(container.list)[f]].enter = false
                        console.log('Empty: ' + Object.keys(container.list)[f])
                        container.list[Object.keys(container.list)[f]].dead = true
                        D.quarter(container.list[Object.keys(container.list)[f]])
                    }
                return
                }
            } else if (empty) {
                return
            }

            return container
        }
    }
    var D = {
        pad: {left: -1, right: 1},
        year: function (calendar, frequency, start, end, empty) {
            var container = frequency.element
            if (!container.enter) return
            var s = start + this.pad.left
            var e = end + this.pad.right
            for (var f = 0; f < frequency.bands; f++) {
                var element = container.list[Object.keys(container.list)[f]]
                if (!element.enter || f > s && f < e) continue;
                element.enter = false
                if (empty)
                    element.span.innerHTML = ''
                else
                    element.span.band.innerHTML = ''
                for (var d = frequency.phase-1; d > 0; d--) {
                    var frequencyName = Object.keys(calendar.phases.frequencies)[d]
                    element[frequencyName] = undefined
                }
                //element.span.band = undefined
                //element.span = undefined
                console.log('degen: ' + Object.keys(container.list)[f])
                this.quarter(element, empty)
            }
            return container
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
            calendar.phases.elements = calendar.phases.elements ? calendar.phases.elements : {}
            calendar.phases.elements[frequency.name] = calendar.phases.elements[frequency.name] ? calendar.phases.elements[frequency.name] : frequency.element 
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
            calendar.phases.elements = calendar.phases.elements ? calendar.phases.elements : {}
            calendar.phases.elements[frequency.name] = calendar.phases.elements[frequency.name] ? calendar.phases.elements[frequency.name] : frequency.element 
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
            /*var container = frequency.element
            container.enter = true
            var s = start + this.pad.left
            var e = end + this.pad.right
            for (var f = 0; f < frequency.bands; f++) {
                var element = container.list[Object.keys(container.list)[f]]
                if (element.enter || f > s && f < e) continue;
                element.enter = true
                //element.dead = true
                console.log('reset: ' + Object.keys(container.list)[f])
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
                var container = nextFrequency.element
                container.enter = false
        }
    }
})(this.Calendar)
