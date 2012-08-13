/**
 * Created with JetBrains WebStorm.
 * User: smi
 * Date: 09.08.12
 * Time: 21:30
 * To change this template use File | Settings | File Templates.
 */

(function(){
    var m = Math;


    // Constructor
    UI = function (el, options) {
        var _this = this;


            _this._drawScroll(el);


    };
// Prototype
    UI.prototype = {







    _drawScroll: function (el) {
        var _this = this;
        var scrollbar = document.createElement("div");
        _this._addClass(scrollbar, 'scrollbar');
        _this._addClass(el, 'scrollwrapper');
        _this._addClass(el, 'scrollwrapper');
        el.appendChild(scrollbar);


        coord = _this._getCoords(el);
        var scrollHeight = el.scrollHeight;
        var wrapperHeight =  el.clientHeight;

        var scrollerHeight = wrapperHeight * el.clientHeight / el.scrollHeight;
        scrollbar.style.height = scrollerHeight + 'px';
        _this._log('draw');
        _this._log('coord = ' + coord.top + ' ' + coord.left);
        _this._log('scrollerHeight = ' + wrapperHeight + ' ' + scrollerHeight);

    },


//    utils

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
