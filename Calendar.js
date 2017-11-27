/**
 * Calendar Class for Timelines
 * @author leroyron / http://leroy.ron@gmail.com
 */
var Calendar = Calendar || function (container, phase, x, y, width, height, current) {
    //Private
    var current = current || {}
    this.current = { 
        year: current.year || 2017, 
        month: current.month || 10, 
        day: current.day || 13, 
        hour: current.hour || 12, 
        minute: current.minute || 0, 
        second: current.second || 0, 
        millisecond: current.millisecond || 0
    }
    
    //Class Declarations
    this.ctx = new this.ctx.Init(this, container, x, y, width, height)
    this.events = new this.events.Init(this)
    this.phases = new this.phases.Init(this, phase)
    this.generate = new this.generate.Init(this, current)
    this.expansion = new this.expansion.Init(this)
    //this.streaming = new this.streaming(this, length)
    
    //Class Init
}
