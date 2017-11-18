// TODO - pass to UTILS script
var Wheel = function (elem, func) {
    // TODO - pass to UTILS script
    function wheel(event) {
        var delta = 0;
        if (!event) event = window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
        } else if (event.detail) {
            delta = -event.detail / 3;
        }
        if (delta)
            this.enterWheel.func(delta);
        if (event.preventDefault)
            event.preventDefault();
        event.returnValue = false;
    }
    elem.enterWheel = {action: wheel, func: func}
    /* Mouse wheel function . */
    // TODO pass to UTILS script
    if (elem.addEventListener)
    elem.addEventListener('DOMMouseScroll', wheel, false);
    elem.onmousewheel = elem.enterWheel.action;
}