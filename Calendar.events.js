/**
 * Building Calendar Class: Events
 * @author leroyron / http://leroy.ron@gmail.com
 */
(function (Calendar) {
    // Class Struct prototype
    var _struct = Calendar.prototype
    var that = _struct.events = {}
    // Class Declarations

    // Private

    // Public

    // Class Init
    that.Init = function (calendar) {
        // Private
        var ctx = calendar.ctx
        var CL = ctx.CL
        var TL = ctx.TL
        var TC = ctx.TC

        var container = ctx.container
        container.width = container.clientWidth || window.app.width

        var retract = this.retract = {mode: undefined}

        // Basic scroll
        // TO-DO change to kinetic scroll http://jsfiddle.net/ARTsinn/XDEJ2/
        var dragScroll = this.dragScroll = {interval: undefined, rate: 0, startX: 0, endX: 0}

        this.mouseX = 0
        this.deltaX = 0
        this.deltaCenterX = 0
        this._onmouseover = function (e) {
            e.preventDefault()
            if (retract.mode) {
                return
            }

            calendar.events.deltaX = e.pageX - CL.offsetLeft + container.scrollLeft
        }

        this._onmousedown = function (e) {
            e.preventDefault()
            if (retract.mode) {
                return
            }
            retract.mode = this.mode

            var _onmousemove = function (e) {
                e.preventDefault()

                calendar.events.mouseX = e.pageX - CL.offsetLeft + container.scrollLeft

                if (Math.abs(calendar.events.mouseX - calendar.events.deltaX) > 4) {
                    dragScroll.startX = calendar.events.mouseX

                    TL.removeEventListener('mouseup', _onmouseup)
                    TL.removeEventListener('mousemove', _onmousemove)

                    TL.addEventListener('mousemove', calendar.events._ondrag)
                    TL.addEventListener('mouseup', calendar.events._ondrop)
                }
            }
            TL.addEventListener('mousemove', _onmousemove)

            var _onmouseup = function (e) {
                e.preventDefault()

                retract.mode = undefined

                TL.removeEventListener('mouseup', _onmouseup)
                TL.removeEventListener('mousemove', _onmousemove)
            }
            TL.addEventListener('mouseup', _onmouseup)
        }

        this._onmousemove = function (e) {

        }

        this._ondrag = function (e) {

        }

        this._ondrop = function (e) {
            e.preventDefault()

            TL.style.cursor = ''
            retract.mode = undefined

            clearInterval(dragScroll.interval)
            dragScroll.interval = undefined

            this.removeEventListener('mousemove', calendar.events._ondrag)
            this.removeEventListener('mouseup', calendar.events._ondrop)
        }

        this._resize = function () {

        }

        // Binding Events
        CL.addEventListener('mouseover', this._onmouseover)
        CL.track.addEventListener('mouseover', this._onmouseover)
        CL.track.addEventListener('mousedown', this._onmousedown)
        CL.retract.left.addEventListener('mouseover', this._onmouseover)
        CL.retract.right.addEventListener('mouseover', this._onmouseover)
        CL.retract.left.addEventListener('mousedown', this._onmousedown)
        CL.retract.right.addEventListener('mousedown', this._onmousedown)
        window.resizeCalls.push(this)
    }
})(this.Calendar)
