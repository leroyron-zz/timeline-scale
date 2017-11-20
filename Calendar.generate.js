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
            container.list = typeof container.list == 'undefined' ? {} : container.list
            container.enter = typeof container.enter == 'undefined' ? true : container.enter

            var s = start + this.pad.left
            var e = end + this.pad.right

            if (container.empty != empty) {
                container.empty = empty
                if (empty) {
                    for (var f = 0; f < frequency.bands; f++) {
                        container.list[Object.keys(container.list)[f]].span.innerHTML = ''
                        container.list[Object.keys(container.list)[f]].enter = false
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
    that.Init = function (calendar) {
        //Private
        var ctx = calendar.ctx
        var CL = ctx.CL
        var TL = ctx.TL
        var TC = ctx.TC
        
        var frequency = undefined        

        var style = ctx.style = {}
        
        this.exec = function () {
            style.freqs = window.getStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq')
            style.freqs.width =  (100 / frequency.bands)+'%' 
            style.freqs.label = window.getStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq label')

            style.freqs.band = window.getStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq .band div')
style.freqs.band.width =  (100 / calendar.phases.nextFrequency.bands)+'%'
            style.freqs.band.label = window.getStyleRules(ctx.styleSheet, '#'+TL.id+' .span.freq .band label')
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
                default: year(); month(); day(); hour(); minute(); second(); millisecond();
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
                case 'month': month(); week(); day(); break;
                case 'day': day(); hour(); break;
                case 'hour': hour(); minute(); break;
                case 'minute': minute(); second(); break;
                case 'second': second(); millisecond(); break;
                case 'millisecond': millisecond(); break;
                default: year(); month(); day(); hour(); minute(); second(); millisecond();
            }
        }
        this.regen()
        this.exec()
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
                case 'month': month(); week(); day(); break;
                case 'day': day(); hour(); break;
                case 'hour': hour(); minute(); break;
                case 'minute': minute(); second(); break;
                case 'second': second(); millisecond(); break;
                case 'millisecond': millisecond(); break;
                default: year(); month(); day(); hour(); minute(); second(); millisecond();
            }
            frequency.subReset()
        }
    }
})(this.Calendar)