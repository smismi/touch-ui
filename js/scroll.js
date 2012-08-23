/**
 * Created with JetBrains WebStorm.
 * User: smi
 * Date: 09.08.12
 * Time: 21:30
 * To change this template use File | Settings | File Templates.
 */

function $(el) {
    return document.getElementById(el);
}
function $px(x) {
    return x + 'px';
}

(function () {

    //touch extention
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
    var isPlaybook = (/playbook/gi).test(navigator.appVersion);
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);
    var isTouch = 'ontouchstart' in window && !isTouchPad;

    var START_EV = isTouch ? 'touchstart' : 'mousedown';
    var CANCEL_EV = isTouch ? 'touchcancel' : 'mouseup';
    var MOVE_EV = isTouch ? 'touchmove' : 'mousemove';
    var END_EV = isTouch ? 'touchend' : 'mouseup';

    Scroll = function(el, options) {
        var that = this;
        that.scroller = $(el);
        that.started = false;
        that.options = {
            enabled:true,
            dimentions: {
                width: 0,
                height: 0
            },
            position: {
                x: 0,
                y: 0
            }
        };
        // User defined options
        for (i in options) that.options[i] = options[i];

        that.drawScroller(that.scroller);
        that.activateDisabler();

//        if (isTouch) {
//            that.bindTouch(that.scroller);
//        }
    };

    Scroll.prototype = {
//    touch
        handleEvent: function (e) {
                var that = this;
//                that._log(e.type)
                switch(e.type) {
                case START_EV:
                    if (!isTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move0(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
                case 'mouseout': that._mouseout(e); break;
                case 'webkitTransitionEnd': that._transitionEnd(e); break;
            }
        },
        _start: function(e) {
            var that = this;
            var point = isTouch ? e.touches[0] : e;
            that.started = true;
            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;
            that._log('_start');

        },
        _move0: function(e) {
            var that = this;
            if (!that.started) return;
            var point = isTouch ? e.touches[0] : e;
                deltaX = point.pageX - that.pointX;
                deltaY = point.pageY - that.pointY;
                newX = that.x + deltaX;
                newY = that.y + deltaY;
                timestamp = e.timeStamp || Date.now();
            that._log('_move'+ deltaY);
            that._move(deltaY);

        },
        _end: function(e) {
            var that = this;
            var point = isTouch ? e.touches[0] : e;
            that.started = false;
            that._log('_stop');
        },
//        onTouchStart:function (e) {
//            var that = this;
//
//            if (!that.options.enabled) return;
////                point = e.touches[0];
//            point = isTouch ? e.touches[0] : e;
//            that._log(point.clientX);
//            that._log(point.clientY);
//            // отменить действие по умолчанию (прокрутку элемента/страницы)
//            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
//        },
//    utils
        drawScroller : function(el) {
            var that = this;
            that.wrapper = document.createElement("div");
            that.scrollbar = document.createElement("div");
            that._addClass(that.wrapper, 'wrapper');
            that._addClass(that.scrollbar, 'scrollbar');
            that._addClass(that.scroller, 'scroller');


            that.wrapper.style.width = $px(that.options.dimentions.width);
            that.wrapper.style.height = $px(that.options.dimentions.height);
            that.wrapper.style.position = "relative";
            that.scroller = el.cloneNode(true);
            that.wrapper.appendChild(that.scroller);
            that.wrapper.appendChild(that.scrollbar);
            el.parentNode.replaceChild(that.wrapper, el);




            that.getDim(that.scroller);
            that.scrollbar.style.height = $px(that.options.dimentions.height * that.options.dimentions.height / that.height);
            that.bindMouseScroll();

            that._bind(START_EV, that.wrapper);
            that._bind(MOVE_EV, that.wrapper);
            that._bind(END_EV, that.wrapper);
            that._bind(CANCEL_EV, that.wrapper);
            that.wrapper.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        },
        getDim : function(el) {
            var that = this;

            that.width = el.clientWidth;
            that.height = el.clientHeight;
            that._log(that.width + " " + that.height)
        },
        activateDisabler:function () {
            var that = this;
            that.disabler = $(that.options.disabler);
            that.disabler.addEventListener("click", function (event) {
                var target = event.target;
                if (target.checked) {
                    that.wrapper.style.opacity = 0.5;
                    that.options.enabled = false;
                } else {
                    that.wrapper.style.opacity = 1;
                    that.options.enabled = true;
                }
            }, false);


        },
        _move:function (deltaY) {
            var that = this;
            that.options.position.y += deltaY / 4;
            that.scroller.style.position = 'absolute';
            that.scroller.style.top = $px(that.options.position.y);
            that.scrollbar.style.top = $px(that.options.position.y * that.options.dimentions.height / -that.height);

//            that.scrollbar.style.top = -that.options.position.y * that.wrapperHeight / that.scrollerHeight + 'px';

//            that._fadeInScroll();

        },
        bindMouseScroll:function (el) {
            var that = this;
            elem = that.wrapper;
            if (elem.addEventListener) {
                // IE9+, Opera, Chrome/Safari (можно onmousehweel = ...)
                elem.addEventListener("mousewheel", onMouseWheel, false);
                // Firefox (нельзя onDOMMouseScroll = ..., только addEventListener)
                elem.addEventListener("DOMMouseScroll", onMouseWheel, false);
            } else { // IE<9
                elem.attachEvent("onmousewheel", onMouseWheel);
            }
            function onMouseWheel(e) {
                if (!that.options.enabled) return;
                e = e || event;
                if (!e.wheelDelta) {
                    e.wheelDelta = -40 * e.detail; // для Firefox
                }
                if (e.wheelDelta < 0) {
                    if (that.options.position.y < -(that.height - that.options.dimentions.height)) return;
                    that._move(e.wheelDelta, el);
                }
                if (e.wheelDelta > 0) {
                    if (that.options.position.y >= 0) return;
                    that._move(e.wheelDelta, el);
                }

                that._log(that.options.position.y);
                // отменить действие по умолчанию (прокрутку элемента/страницы)
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            }


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
        },
        _bind: function (type, el, bubble) {
            el.addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            el.removeEventListener(type, this, !!bubble);
        }
    }
})();
