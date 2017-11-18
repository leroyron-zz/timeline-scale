/**
 * Calendar Class for Timelines
 * @author leroyron / http://leroy.ron@gmail.com
 */
var Calendar = Calendar || function (container, phase, x, y, width, height, current) {
    //Private
    var current = current || {}
    this.current = { 
        year: current.year || 2017, 
        month: current.year || 10, 
        day: current.year || 13, 
        hour: current.year || 12, 
        minute: current.year || 0, 
        second: current.year || 0, 
        millisecond: current.year || 0
    }
    
    //Class Declarations
    this.ctx = new this.ctx.Init(this, container, x, y, width, height)
    this.events = new this.events.Init(this)
    this.phases = new this.phases.Init(this, phase)
    this.generate = new this.generate.Init(this, current)
    this.expansion = new this.expansion.Init(this)   
    
    //Class Init
}