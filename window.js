var app =
{
    width: window.innerWidth,
    height: window.innerHeight,
    element: {}
}

// TODO pass to onwindow resize array script
window.onresize = function onresize() {
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
    var myWindow = window.open(url, title, 'width='+width+',height='+height+'');
}

window.bootstrap = function (elem) {
    elem.appendAfter = function (elem) {
        this.parentNode.insertBefore(elem, this.nextSibling);
    }

    elem.appendBefore = function (elem) {
        this.parentNode.insertBefore(elem, this);
    }
}
window.getStyleRules = function (elem, rule) {
    var rules = elem.sheet.cssRules || elem.sheet.rules;
    var styleRule = null;
    var find = '(^|,) *'+rule+' *(,|$)';
    var regex = new RegExp(find, 'i');
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (regex.test(rule.selectorText)) {
            styleRule = rule;
            break;
        }
    }

    return styleRule.style
}

window.addStyleRules = function (elem, rule, style) {
    var sheet = elem.sheet
    sheet.addRule(rule, style);
    return sheet.rules[sheet.rules.length - 1].style
}