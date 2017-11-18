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
        year: function (calendar, frequency, start, end) {
            var value = calendar.current[frequency.name]
            var container = frequency.element
            container.list = typeof container.list == 'undefined' ? {} : container.list
            container.enter = typeof container.enter == 'undefined' ? true : container.enter

            var s = start + this.pad.left
            var e = end + this.pad.right
            for (var f = 0; f < frequency.bands; f++) {
                var label = value + (f - (frequency.bands / 2))
                var element = container.list[label] = typeof container.list[label] == 'undefined' ? {} : container.list[label]
                if (element.enter || f <= s || f >= e) continue;
                console.log('regen: ' + Object.keys(container.list)[f], element.enter)
                
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
                for (var b = 0; b < bLen; b++) {
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
                elemFreqSpanBandLabel.innerHTML = i == 0 ? parent.span.label.innerText+'-'+label : label
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
        year: function (calendar, frequency, start, end) {
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

        //Public
        var previous = calendar.phases.previous = Object.keys(calendar.phases.frequencies)[calendar.phases.total - calendar.phases.phaseId - 1]
        calendar.phases.previousFrequency = calendar.phases.frequencies[calendar.phases.previous]

        var current = calendar.phases.current = Object.keys(calendar.phases.frequencies)[calendar.phases.total - calendar.phases.phaseId]
        calendar.phases.currentFrequency = calendar.phases.frequencies[calendar.phases.current]

        var next = calendar.phases.next = Object.keys(calendar.phases.frequencies)[calendar.phases.total - calendar.phases.phaseId + 1]
        calendar.phases.nextFrequency = calendar.phases.frequencies[calendar.phases.next]

        
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
        this.phaseChanges = function () {
            var phaseChange = function (p) {
                console.log(p)
            }
            frequency.change = 0.3
            calendar.expansionCalls.push(phaseChange)
        },
        this.regen = function (_current, rangeStart, rangeEnd) {
            var _current = _current = current 
            frequency = calendar.phases.frequencies[_current] ? calendar.phases.frequencies[_current] : frequency
            frequency.element = frequency.element ? frequency.element : {}
            calendar.phases.elements = calendar.phases.elements ? calendar.phases.elements : {}
            calendar.phases.elements[frequency.name] = calendar.phases.elements[frequency.name] ? calendar.phases.elements[frequency.name] : frequency.element 
            switch (frequency.name) {
                case 'year': R.year(calendar, frequency, rangeStart, rangeEnd); break;
                case 'month': month(); week(); day(); break;
                case 'day': day(); hour(); break;
                case 'hour': hour(); minute(); break;
                case 'minute': minute(); second(); break;
                case 'second': second(); millisecond(); break;
                case 'millisecond': millisecond(); break;
                default: year(); month(); day(); hour(); minute(); second(); millisecond();
            }
        },
        this.degen = function (_current, rangeStart, rangeEnd) {
            var _current = _current = current 
            frequency = calendar.phases.frequencies[_current] ? calendar.phases.frequencies[_current] : frequency
            frequency.element = frequency.element ? frequency.element : {}
            calendar.phases.elements = calendar.phases.elements ? calendar.phases.elements : {}
            calendar.phases.elements[frequency.name] = calendar.phases.elements[frequency.name] ? calendar.phases.elements[frequency.name] : frequency.element 
            switch (frequency.name) {
                case 'year': D.year(calendar, frequency, rangeStart, rangeEnd); break;
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
    }
})(this.Calendar)