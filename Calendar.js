/**
 * Calendar Class for Timelines
 * @author leroyron / http://leroy.ron@gmail.com
 */
var Calendar = Calendar || function (container, phase, x, y, width, height, current) {
    // Private

    // Object options
    current = current || {}
    var pair = ['year', 'month', 'day', 'hour', 'minute', 'second', 'millisecond', 'hour24Format']
    var paired = false
    for (var a = 0; a < arguments.length; a++) {
        if (typeof arguments[a] == 'object') {
            for (var o = 0; o < pair.length; o++) {
                if (arguments[a][pair[o]]) {
                    paired = true
                    current[pair[o]] = arguments[a][pair[o]]
                }
            }
            if (paired) arguments[a] = undefined; paired = false
        }
    }

    this.current = {
        year: current.year || 2018,
        month: current.month || 1,
        day: current.day || 1,
        hour: current.hour || 12,
        minute: current.minute || 0,
        second: current.second || 0,
        millisecond: current.millisecond || 0,
        hour24Format: false
    }

    // Class Declarations
    this.ctx = new this.ctx.Init(this, container, x, y, width, height)
    this.stack = new this.stack.Init(this)
    this.events = new this.events.Init(this)
    this.phases = new this.phases.Init(this, phase)
    this.generate = new this.generate.Init(this, current)
    this.expansion = new this.expansion.Init(this, phase, x, y, width, height)
    // this.streaming = new this.streaming(this, length)

    // Class Init
}
