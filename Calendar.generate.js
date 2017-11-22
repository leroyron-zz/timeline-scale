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
    var R = {
        pad: {left: -1, right: 1},
        year: function (calendar, frequency, start, end, empty) {
            var value = calendar.current[frequency.name]
            var container = frequency.element
            if (!container.list) { calendar.ctx.execStyle(frequency); calendar.ctx.style.main = calendar.ctx.style.toggle = calendar.ctx.style[frequency.name] }
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
            for (var f = 0; f < frequency.bands; f++) {
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
                var bLen = calendar.phases.nextFrequency.bands
                for (var b = elemFreqSpanBandDiv.children.length; b < bLen; b++) {
                    var elemFreqSpanBandDivUnit = document.createElement('div')
                    if (b == 0)
                        elemFreqSpanBandDivUnit.setAttribute('class', 'first')
                    elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                }
                elemFreqSpan.appendChild(elemFreqSpanBandDiv)
                this.quarter(calendar, element)
            }
            return container
        },
        quarter: function quarter(calendar, element) {
            var name = 'quarter'
            if (element[name] || !element.enter)
                return
            var iterate = calendar.phases.quartersInYear
            var subFreq = calendar.phases.monthsInQuarter
            var subLabel = calendar.phases.quarterNames
            
            // subphase when expansion reaches a certain percent
            var parent = element
            var child = parent[name] = { enter: true, list: {}}
            for (var i=0; i<iterate; i++) {
                var label = subLabel[i]
                var element = child.list[label] = { enter: true, list: {}}

                var elemFreqSpanBandLabel = document.createElement('label')
                elemFreqSpanBandLabel.innerHTML = i == 0 ? parent.span.label.innerHTML+'-'+label : label
                parent.span.band.children[i * subFreq].setAttribute('class', 'first')
                parent.span.band.children[i * subFreq].appendChild(elemFreqSpanBandLabel)
                element.label = elemFreqSpanBandLabel
            }
            return parent
        },
        month: function (calendar, frequency, start, end, empty) {
            var previousFrequency = calendar.phases.previousFrequency
            var previousElements = previousFrequency.element
            var previousElementList = previousFrequency.element.list
            var nextFrequency = calendar.phases.nextFrequency

            var container = frequency.element
            if (!container.enter) { calendar.ctx.execStyle(frequency, [27, 28, 29, 30, 31, 32]);  calendar.ctx.style.toggle = calendar.ctx.style[frequency.name]  }            
            container.enter = typeof container.enter == 'undefined' ? true : container.enter

            var s = start + this.pad.left
            var e = end + this.pad.right

            // days and hours problem to solve 
            var pbLen = typeof previousFrequency.bands != 'function' ? previousFrequency.bands : previousFrequency.bands(Object.keys(previousElementList)[p]/* [p] this will run into error*/, calendar.phases.monthNames.indexOf(label)+1)
            for (var p = 0; p < pbLen; p++) {// Todo - For Calendar Days shifting p++ and pbLen required
                var previous = previousElementList[Object.keys(previousElementList)[p]]
                var container = previous[frequency.name] = {}
                container.list = typeof container.list == 'undefined' ? {} : container.list
                container.enter = typeof container.enter == 'undefined' ? previous.enter : container.enter
                
                var fbLen = typeof frequency.bands != 'function' ? frequency.bands : frequency.bands(Object.keys(previousElementList)[p], calendar.phases.monthNames.indexOf(label)+1)
                var fFirst = typeof frequency.first != 'function' ? frequency.first : frequency.first(Object.keys(previousElementList)[p], calendar.phases.monthNames.indexOf(label)+1)
                if (container.empty != empty) {
                    container.empty = empty
                    if (empty) {
                        for (var f = 0; f < fbLen; f++) {
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
                
                if (!previous.enter)
                    continue
                
                var previousSpan = previous.span
                for (var f = 0; f < fbLen; f++) {
                    var label = calendar.phases.monthNames[f]
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
                        // dynamic scale
                        var nbLen = typeof nextFrequency.bands != 'function' ? nextFrequency.bands : nextFrequency.bands(Object.keys(previousElementList)[p], calendar.phases.monthNames.indexOf(label)+1)
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
                    var nfFirst = typeof nextFrequency.first != 'function' ? nextFrequency.first : nextFrequency.first(Object.keys(previousElementList)[p], calendar.phases.monthNames.indexOf(label)+1)

                    var firstFunc = undefined
                    if (typeof nextFrequency.first != 'function')
                        firstFunc = function (b) {
                            return b == 0
                        }
                    else 
                        firstFunc = function (b) {
                            return (b-nfFirst) % 7 == 0
                        }
                    var wait = false
                    for (var b = elemFreqSpanBandDiv.children.length; b < nbLen; b++) {
                        var elemFreqSpanBandDivUnit = document.createElement('div')
                        if (!wait) wait = firstFunc(b)
                        if (firstFunc(b) || b == 0)
                            elemFreqSpanBandDivUnit.setAttribute('class', 'first'); else if (!wait) elemFreqSpanBandDivUnit.setAttribute('class', 'wait')
                        elemFreqSpanBandDiv.appendChild(elemFreqSpanBandDivUnit)
                    }
                    elemFreqSpan.appendChild(elemFreqSpanBandDiv)
                    //this.week(calendar, element)
                }
            }
            return container
        },
        week: function (elem) {
            
            elements = elem || elements || {}
            return container
        },
        day: function (calendar, frequency, start, end, empty) {
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
                element.span.band.innerHTML = ''
                console.log('degen: ' + Object.keys(container.list)[f])
                this.quarter(element)
            }
            return container
        },
        quarter: function (elem) {
            var name = 'quarter'
            elem[name] = undefined
            return elem
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
            frequency = calendar.phases.frequencies[_current] ? calendar.phases.frequencies[_current] : frequency
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
        this.reset = function (_current, start, end) {
            var _current = _current || calendar.phases.current  
            frequency = calendar.phases.frequencies[_current] ? calendar.phases.frequencies[_current] : frequency
            var container = frequency.element
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
            }
            calendar.ctx.style.toggle = calendar.ctx.style[frequency.name]
            frequency.subReset()
        }
    }
})(this.Calendar)
