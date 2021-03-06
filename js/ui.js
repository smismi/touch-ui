/**
 * Created with JetBrains WebStorm.
 * User: smi
 * Date: 09.08.12
 * Time: 21:30
 * To change this template use File | Settings | File Templates.
 */

(function () {
    var m = Math;
    var g_delta = 0;
    // Constructor
    UI = function (el, options) {
        var _this = this;
        _this.wrapper = el;
        _this.scroller = el.children[0];
        // Default options
        _this.options = {
            enabled:true
        };
        // User defined options
        for (i in options) _this.options[i] = options[i];


        _this._activateDisabler();
        _this._drawScroll(el);
        _this._bindMouseScroll(el);
    };
// Prototype
    UI.prototype = {
        enabled:true,
        x:0,
        y:0,
        w:0,
        h:0,
        scrollerHeight:0,
        wrapperHeight:0,
        _drawScroll:function (el) {
            var _this = this;
            _this.scrollbar = document.createElement("div");
            _this._addClass(_this.scrollbar, 'scrollbar');
            _this._addClass(el, 'scrollwrapper');
            el.appendChild(_this.scrollbar);


//        coord = _this._getCoords(el);
            _this.scrollerHeight = el.scrollHeight;
            _this.wrapperHeight = el.clientHeight;

            var scrollhandlerHeight = _this.wrapperHeight * _this.wrapperHeight / _this.scrollerHeight;
            _this.scrollbar.style.height = scrollhandlerHeight + 'px';

//        _this.scrollbar._bindMouseClick(el);
            _this._bindMouseClick(_this.scrollbar);

        },
        _activateDisabler:function () {
            var _this = this;
            _this.disabler = document.getElementById(_this.options.disabler);

            _this.disabler.addEventListener("click", function (event) {
                var target = event.target;
                if (target.checked) {
                    _this.wrapper.style.opacity = 0.5;
                    _this.options.enabled = false;
                } else {
                    _this.wrapper.style.opacity = 1;
                    _this.options.enabled = true;

                }
            }, false);


        },
        _move:function (deltaY) {

            var _this = this;
            _this.y += deltaY / 4;
            _this.scroller.style.position = 'absolute';
            _this.scroller.style.top = _this.y + 'px';
            g_delta += _this.y;

            _this.scrollbar.style.top = -_this.y * _this.wrapperHeight / _this.scrollerHeight + 'px';

            _this._fadeInScroll();

        },
        _fadeInScroll:function () {
            var _this = this;
            _this.scrollbar.style.opacity = 1;
            clearTimeout(_this.timerId);
            clearTimeout(_this.timerId2);
            _this.timerId = setTimeout(function () {

                _this._doAnimation(_this.scrollbar, 'opacity');
//            _this.scrollbar.style.opacity = 0.2;
            }, 700);

        },

        _doAnimation:function (el, prop) {
            var _this = this;
            var checkProp = function (cssProp) {
                if (el.currentStyle)
                    var y = el.currentStyle[cssProp];
                else if (window.getComputedStyle)
                    var y = document.defaultView.getComputedStyle(el, null).getPropertyValue(cssProp);
                return y;
            }
            if (checkProp(prop)) {
                function doMove() {
                    el.style[prop] = (el.style[prop] - 0.05); // pseudo-property code: Move right by 10px
                    _this.timerId2 = setTimeout(doMove, 20); // call doMove() in 20 msec
                }

                doMove()
            }
        },
        _drag:function (elem) {
            _this._log(_this._getCoords(_this.scrollbar).top + " " + _this._getCoords(_this.scrollbar).left);


        },

//    utils
        _bindMouseScroll:function (elem) {
            var _this = this;
            if (elem.addEventListener) {
                // IE9+, Opera, Chrome/Safari (можно onmousehweel = ...)
                elem.addEventListener("mousewheel", onMouseWheel, false);
                // Firefox (нельзя onDOMMouseScroll = ..., только addEventListener)
                elem.addEventListener("DOMMouseScroll", onMouseWheel, false);
            } else { // IE<9
                elem.attachEvent("onmousewheel", onMouseWheel);
            }


            function onMouseWheel(e) {

                if (!_this.options.enabled) return;
                e = e || event;
                if (!e.wheelDelta) {
                    e.wheelDelta = -40 * e.detail; // для Firefox
                }
                if (_this.y < 0 && e.wheelDelta > 0) {

                    _this._move(e.wheelDelta);
                }

                if ((Math.abs(_this.y) < (_this.scrollerHeight - _this.wrapperHeight)) && e.wheelDelta < 0) {
//                    _this._log('down');
//                    _this._log(m.abs(_this.y) + " " + _this.scrollerHeight - _this.wrapperHeight);
                    _this._move(e.wheelDelta);
                }

                // отменить действие по умолчанию (прокрутку элемента/страницы)
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            }
        },
        _bindMouseClick:function (elem) {
            var _this = this;
            if (elem.addEventListener) {
                // IE9+, Opera, Chrome/Safari (можно onmousehweel = ...)
                elem.addEventListener ("mousedown", startDragDrop, false);
                // Firefox (нельзя onDOMMouseScroll = ..., только addEventListener)
                elem.addEventListener ("mousedown", startDragDrop, false);
            } else { // IE<9
                elem.attachEvent ("mousedown", startDragDrop);
            }

            function startDragDrop(e) {
                e = e || event;
                draggable = true;
                _this._bindMouseMove(elem);
            }
        },
        _bindMouseMove:function (elem) {
            var _this = this;
            if (elem.addEventListener) {
                // IE9+, Opera, Chrome/Safari (можно onmousehweel = ...)
                elem.addEventListener ("mousemove", moveDragDrop, false);
                // Firefox (нельзя onDOMMouseScroll = ..., только addEventListener)
                elem.addEventListener ("mousemove", moveDragDrop, false);
            } else { // IE<9
                elem.attachEvent ("mousemove", moveDragDrop);
            }
            function moveDragDrop(e) {
                e = e || event;
                _this._log('xxx')
            }

        },
        _bindCheck:function (elem) {
            var _this = this;

        },
        _getCoords:function (elem) {
            var box = elem.getBoundingClientRect();

            var body = document.body;
            var docElem = document.documentElement;

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            var top = box.top + scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return { top:Math.round(top), left:Math.round(left) };
        },
        _addClass:function (elem, clazz) {
            var c = elem.className.split(' ');
            for (var i = 0; i < c.length; i++) {
                if (c[i] == clazz) return;
            }

            if (elem.className == '') elem.className = clazz;
            else elem.className += ' ' + clazz;
        },
        _log:function (text) {
            var logs = document.createElement("div");
            logs.innerHTML = text;
            document.getElementById("log").appendChild(logs);
        }
    }
})();
