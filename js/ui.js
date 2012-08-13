/**
 * Created with JetBrains WebStorm.
 * User: smi
 * Date: 09.08.12
 * Time: 21:30
 * To change this template use File | Settings | File Templates.
 */

(function(){
    var m = Math;
    var g_delta = 0;

    // Constructor
    UI = function (el, options) {
        var _this = this;
        _this.scroller = el.children[0];

        _this._drawScroll(el);
        _this._bindMouseScroll(el);

    };
// Prototype
    UI.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        scrollHeight: 0,





    _drawScroll: function (el) {
        var _this = this;
        var scrollbar = document.createElement("div");
        _this._addClass(scrollbar, 'scrollbar');
        _this._addClass(el, 'scrollwrapper');
        el.appendChild(scrollbar);


//        coord = _this._getCoords(el);
        scrollHeight = el.scrollHeight;
        var wrapperHeight =  el.clientHeight;

        var scrollerHeight = wrapperHeight * el.clientHeight / el.scrollHeight;
        scrollbar.style.height = scrollerHeight + 'px';
//        _this._log('draw');
//        _this._log('coord = ' + coord.top + ' ' + coord.left);
//        _this._log('scrollerHeight = ' + wrapperHeight + ' ' + scrollerHeight);
        _this.h = scrollHeight;

    },
    _move: function (deltaY) {
        var _this = this;



        _this.y += deltaY/4;
        _this.scroller.style.position = 'absolute';

//                _this._log(_this.y + ' ' + _this.h);
                _this.scroller.style.top = _this.y + 'px';
                g_delta += _this.y;






//       _this._log(deltaY + " " + g_delta);

    },


//    utils
        _bindMouseScroll: function(elem) {
            var _this = this;
            if (elem.addEventListener) {
                // IE9+, Opera, Chrome/Safari (можно onmousehweel = ...)
                elem.addEventListener ("mousewheel", onMouseWheel, false);
                // Firefox (нельзя onDOMMouseScroll = ..., только addEventListener)
                elem.addEventListener ("DOMMouseScroll", onMouseWheel, false);
            } else { // IE<9
                elem.attachEvent ("onmousewheel", onMouseWheel);
            }


            function onMouseWheel(e) {
                e = e || event;

                if (!e.wheelDelta) {
                    e.wheelDelta = -40*e.detail; // для Firefox
                }

//                _this._log(e.wheelDelta + " " + g_delta);
                if (_this.y <= 0 && e.wheelDelta > 0) {
                    _this._log('up');

                    _this._move(e.wheelDelta);
                }

                if ((Math.abs(_this.y) < _this.h) && e.wheelDelta < 0) {
                    _this._log('down');
                    _this._log(Math.abs(_this.y) + " " + _this.h);
                    _this._move(e.wheelDelta);
                }


                // отменить действие по умолчанию (прокрутку элемента/страницы)
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            }
        },
        _getCoords: function(elem) {
            var box = elem.getBoundingClientRect();

            var body = document.body;
            var docElem = document.documentElement;

            var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
            var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

            var clientTop = docElem.clientTop || body.clientTop || 0;
            var clientLeft = docElem.clientLeft || body.clientLeft || 0;

            var top  = box.top +  scrollTop - clientTop;
            var left = box.left + scrollLeft - clientLeft;

            return { top: Math.round(top), left: Math.round(left) };
        },
        _addClass: function(elem, clazz) {
            var c = elem.className.split(' ');
            for(var i=0; i<c.length; i++) {
                if (c[i] == clazz) return;
            }

            if (elem.className == '') elem.className = clazz;
            else elem.className += ' ' + clazz;
        },
        _log: function (text) {
            var logs = document.createElement("div");
            logs.innerHTML = text;
            document.getElementById("log").appendChild(logs);
        }
    }
})();
