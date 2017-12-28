window.app =
{
    width: window.innerWidth,
    height: window.innerHeight,
    element: {}
}

// TODO pass to onwindow resize array script
window.onresize = function onresize () {
    this.app.width = this.innerWidth
    this.app.height = this.innerHeight
    this.resizeCallbacks()
}
window.resizeCalls = []
window.resizeCallbacks = function () {
    for (let r = 0; r < this.resizeCalls.length; r++) {
        if (this.resizeCalls[r]._resize) this.resizeCalls[r]._resize(); else this.resizeCalls[r]()
    }
}

window.popup = function (url, title, width, height) {
    window.open(url, title, 'width=' + width + ',height=' + height + '')
}

window.appending = function (elem) {
    elem.appendAfter = function (elem, after) {
        after = after || this
        after.parentNode.insertBefore(elem, after.nextSibling)
    }

    elem.appendBefore = function (elem, before) {
        before = before || this
        before.parentNode.insertBefore(elem, before)
    }

    elem.appendAfterFirstChild = function (elem) {
        this.appendAfter(elem, this.firstChild)
    }

    elem.appendBeforeLastChild = function (elem) {
        this.appendBefore(elem, this.lastChild)
    }

    return elem
}
window.getStyleRules = function (elem, rule) {
    var rules = elem.sheet.cssRules || elem.sheet.rules
    var styleRule = null
    var find = '(^|,) *' + rule + ' *(,|$)'
    var regex = new RegExp(find, 'i')
    for (let i = 0; i < rules.length; i++) {
        rule = rules[i]
        if (regex.test(rule.selectorText)) {
            styleRule = rule
            break
        }
    }

    return styleRule.style
}

window.addStyleRules = function (elem, rule, style) {
    var sheet = elem.sheet
    sheet.addRule(rule, style)
    return sheet.rules[sheet.rules.length - 1].style
}
