/**
 * Building Calendar Class: Contexts
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Calendar) {
    //Class Struct prototype
    var _struct = Calendar.prototype
    var that = _struct.ctx = {}
    //Class Declarations
    
    //Private

    //Public
    that.calendars = []
    //Class Init
    that.Init = function (calendar, container, x, y, width, height, current) {
        //Public
        this.container = container
        this.TL = document.createElement('div')//TIMELINE
        this.TL.setAttribute('class', 'TL')
        this.TL.id = 'tl'+that.calendars.length
        this.TL.style.left = x ? x + 'px' : ''
        this.TL.style.top = y ? y + 'px' : ''
        this.TL.style.maxWidth = width ? width + 'px' : ''
        this.TL.style.maxHeight = height ? height + 'px' : ''
    
        this.CL = document.createElement('div')//CALENDAR
        this.CL.setAttribute('class', 'CL dg')
        //this.CL.addEventListener('mouseover', this.events._onmouseover)
        that.calendars.push(this.CL)
        //this.events.init(this.CL, this.element)// initialize resize events
    
        this.TC = document.createElement('div')//TIMECODE
        this.TC.setAttribute('class', 'TC')
    
        // append all children
        this.CL.appendChild(this.TC)
        this.TL.appendChild(this.CL)
        this.container.appendChild(this.TL)
    
    
        this.styleSheet = document.createElement('style')
        this.styleSheet.id = 'style#'+this.TL.id
        this.styleSheet.innerHTML = 
        [
        ''
        ].join('\n')
        this.container.appendChild(this.styleSheet)
    
        this.outputElement = document.createElement('div')//OUTPUT
        this.outputElement.setAttribute('class', 'output')
        this.output = function (str) {
            this.outputElement.innerHTML = str
        }
        this.TL.appendChild(this.outputElement)

        var CLRetractLeft = document.createElement('div')
        CLRetractLeft.setAttribute('class', 'left retract')
        CLRetractLeft.mode = 'left'
        this.CL.appendChild(CLRetractLeft)

        var CLRetractRight = document.createElement('div')
        CLRetractRight.setAttribute('class', 'right retract')
        CLRetractRight.mode = 'right'
        this.CL.appendChild(CLRetractRight)
        this.CL.retract = {
            left: CLRetractLeft,
            right: CLRetractRight,
            mode: undefined
        }

        var CLTrack = document.createElement('div')
        CLTrack.setAttribute('class', 'track')
        CLTrack.mode = 'center'
        var CLLocator = document.createElement('div')
        CLLocator.setAttribute('class', 'locator')
        CLTrack.appendChild(CLLocator)
        this.CL.appendChild(CLTrack)
        this.CL.track = CLTrack
        this.CL.locator = CLLocator

        var TCTrack = document.createElement('div')
        TCTrack.setAttribute('class', 'track')
        var TCLocator = document.createElement('div')
        TCLocator.setAttribute('class', 'locator')
        TCTrack.appendChild(TCLocator)
        this.TC.appendChild(TCTrack)
        this.TC.track = TCTrack
        this.TC.locator = TCLocator
    }
})(this.Calendar)