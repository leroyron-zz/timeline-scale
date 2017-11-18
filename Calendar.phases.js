/**
 * Building Calendar Class: Phases
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Calendar) {
    //Class Struct prototype
    var _struct = Calendar.prototype
    var that = _struct.phases = {}
    //Class Declarations
    
    //Private
    
    //Public
    that.params = [
        ['year', 0, 8, 50, ['quarter', 3]], 
        ['month', 10, 12, 50, ['week', 13]], 
        ['day', 20, 'daysInMonth', 50, ['morningNoon', 25], 'firstDayOfMonth'], 
        ['hour', 30, 24, 30, ['tenMinutes', 35]], 
        ['minute', 40, 60, 20, ['tenSeconds', 45]], 
        ['second', 50, 60, 20], 
        ['millisecond', 60, 100, 5]
    ]

    //Class Init
    that.Init = function (calendar, phase) {
        //Private
        
        //Public
        // year <> quarters
        this.quarterNames = ['Q1','Q2','Q3','Q4']
        this.getQuarterName = function (i, b) { return b ? this.quarterNamesShort[i] : this.quarterNames[i] }
        this. quartersInYear = 4
        this.monthsInQuarter = 3
        // year <> months
        this.monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
        this.monthNamesShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        this.getMonthName = function (i, b) { return b ? this.monthNamesShort[i] : this.monthNames[i] }
        this.weeksInMonth = function (y, m) {Math.ceil((firstDayOfMonth(y, m)+daysInMonth(y, m)) / 7)}
        // month <> days
        this.dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        this.dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        this.getDayName = function (i, b) { return b ? this.dayNamesShort[i] : this.dayNames[i] }
        this.firstDayOfMonth = function (y, m) { return new Date(y||this.current.year + "-" + m||this.current.month + "-" + 1).getDay() }
        this.daysInMonth = function (y, m) { return new Date(y||this.current.year, m||this.current.month, 0).getDate() }
        // time in day
        this.hour24Format = false
        this.hoursInDay = 24
        this.minutesInHour = 60
        this.secondsInMinute = 60
        this.millisecondsInSecond = 100
        //timestamps
        this.timestamp = {
            start: undefined,
            end: undefined,
            current: undefined,
            seconds: {
                year: 31557600,
                month: function (y, m) { return this.timestamp.seconds.day * daysInMonth(y, m) },
                day: 86400,
                hour: 3600,
                minute: 60,
            },
            now: function (){ return Date.now() / 1000 | 0 }
        }

        this.enter = function (obj, year, month, day, hour, minute, second, millisecond) {
            obj = obj ? obj : this.last
            for (var f = 0; f<this.active.frequencies.length; f++) {
                obj[this.active.frequencies[f]] = this[this.active.frequencies[f]] ? this[this.active.frequencies[f]]  : this.last[this.active.frequencies[f]] 
                /*obj.month = month ? month : this.last.month
                obj.day = day ? day : this.last.day
                obj.hour = hour ? hour : this.last.hour
                obj.minute = minute ? minute : this.last.minute
                obj.second = second ? second : this.last.second
                obj.millisecond = millisecond ? millisecond : this.last.millisecond*/
            }
            //
            obj.quartersInYear = this.active.quartersInYear
            obj.monthsInQuarter = this.active.monthsInQuarter
            obj.weeksInMonth = this.active.weeksInMonth(obj.year, obj.month)
            obj.firstDayOfMonth = this.active.firstDayOfMonth(obj.year, obj.month)
            obj.daysInMonth = this.active.daysInMonth(obj.year, obj.month)

            this.last = obj
            return obj
        }

        this.getfrequencyId = function (phase) {
            var paramsLen = Object.keys(this.frequencies).length
            var frequencyId = paramsLen
            
            // assign the current frequency bands for render
            if (typeof phase != 'undefined')
                if (isNaN(phase))
                    frequencyId = this.frequencies[phase].phase
                else if (!isNaN(phase))
                    frequencyId = Math.ceil(phase / (100 / paramsLen))
            return frequencyId
        }
        
        this.rephase = function (phase) {
            var phaseArray = that.params
            this.frequencies = {}
            var pLen = this.total = phaseArray.length
            var changePhase = 100 / pLen
            // generate phase parameters
            var subRephase = function (subPhase) {
                if (!subPhase) return;
                var spLen = subPhase.length/2
                var spArray = {}
                for (var sp = 0; sp < spLen; sp+=2) {
                    spArray[subPhase[sp]] = {name: subPhase[sp], indice: subPhase[sp+1]}
                }
                return spArray
            }
            for (var p = 0; p < pLen; p++) {
                this.frequencies[that.params[p][0]] = {
                    name: that.params[p][0],
                    phase: pLen-p,
                    indice: that.params[p][1],
                    bands: isNaN(that.params[p][2]) ? this[that.params[p][2]] : that.params[p][2],
                    span: that.params[p][3],
                    sub: subRephase(that.params[p][4]),
                    first: isNaN(that.params[p][5]) ? this[that.params[p][5]] : that.params[p][5],
                    change: changePhase * (p + 1)
                }
            }
            this.phase = phase
            this.phaseId = this.getfrequencyId(phase)
        }
        
        this.rephase(phase)
        
    }
})(this.Calendar)