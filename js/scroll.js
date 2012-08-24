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
    var SCROLL_EV = 'mousewheel';
    var CANCEL_EV = isTouch ? 'touchcancel' : 'mouseup';
    var MOVE_EV = isTouch ? 'touchmove' : 'mousemove';
    var END_EV = isTouch ? 'touchend' : 'mouseup';

    Scroll = function(el, options) {
        var that = this;
        that.scroller = $(el);
        that.started = false;
        that.options = {
            enabled:true,
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            hScroll: false,
            vScroll: true
        };

        // User defined options
        for (i in options) that.options[i] = options[i];

        // Set starting position
        that.x = that.options.x;
        that.y = that.options.y;
        that.w = that.options.w;
        that.h = that.options.h;

        that.prepareTo();
        that.activateDisabler();

//        if (isTouch) {
//            that.bindTouch(that.scroller);
//        }
    };

    Scroll.prototype = {
        prepareTo: function () {
            that = this;
            that.drawScroller(that.scroller);





            that._bind(SCROLL_EV, that.wrapper);
            that._bind(START_EV, that.wrapper);
            that._bind(MOVE_EV, that.wrapper);
            that._bind(END_EV, that.wrapper);
            that._bind(CANCEL_EV, that.wrapper);


            that.wrapper.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        },




//    action
        handleEvent: function (e) {
                var that = this;
                that._log(e.type)
                switch(e.type) {
                case SCROLL_EV:
                    that.scroll(e);
                    e.stopPropagation();
                    break;

                case START_EV:
                    if (!isTouch && e.button !== 0) return;
                    that.start(e);
                    e.stopPropagation();
                    break;
                case MOVE_EV: that._move0(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
                case 'mouseout': that._mouseout(e); break;
                case 'webkitTransitionEnd': that._transitionEnd(e); break;
            }
        },
        scroll: function(e) {
            var that = this;
            if (!that.options.enabled) return;
            e = e || event;
            if (!e.wheelDelta) {
                e.wheelDelta = -40 * e.detail; // для Firefox
            }
            if (e.wheelDelta < 0) {
                if (that.y < -(that.height - that.h)) return;
                that._move(e.wheelDelta, that.scroller);
            }
            if (e.wheelDelta > 0) {
                if (that.y >= 0) return;
                that._move(e.wheelDelta, that.scroller);
            }
            // отменить действие по умолчанию (прокрутку элемента/страницы)
            e.stopPropagation();
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

        },
        start: function(e) {
            var that = this;
            var point = isTouch ? e.touches[0] : e;
            that.started = true;
            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;
            that._log('_start' + that.pointX + ' ' + that.pointY);

        },
        _move0: function(e) {
            var that = this;
            if (!that.started) return;
            var point = isTouch ? e.touches[0] : e;
                deltaX = that.startX + point.pageX - that.pointX;
                deltaY = that.startY + point.pageY - that.pointY;
            that.x = deltaX;
            that.y = deltaY;

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

        _move:function (delta) {
            var that = this;
            if (that.options.hScroll) that.x += delta / 4;
            if (that.options.vScroll) that.y += delta / 4;
            that.scroller.style.position = 'absolute';
            that.scroller.style.top = $px(that.y);
            that.scroller.style.left = $px(that.x);
            that.scrollbar.style.top = $px(that.y * that.h / -that.height);
            that._log(that.y);


        },

//    utils
        drawScroller : function(el) {
            var that = this;
            that.wrapper = document.createElement("div");
            that.scrollbar = document.createElement("div");
            that._addClass(that.wrapper, 'wrapper');
            that._addClass(that.scrollbar, 'scrollbar');
            that._addClass(that.scroller, 'scroller');


            that.wrapper.style.width = $px(that.w);
            that.wrapper.style.height = $px(that.h);
            that.wrapper.style.position = "relative";
            that.scroller = el.cloneNode(true);
            that.wrapper.appendChild(that.scroller);
            that.wrapper.appendChild(that.scrollbar);
            el.parentNode.replaceChild(that.wrapper, el);




            that.getDim(that.scroller);
            that.scrollbar.style.height = $px(that.h * that.h / that.height);
            //that.bindMouseScroll();


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
            if (el.addEventListener) {
                // IE9+, Opera, Chrome/Safari (можно onmousehweel = ...)
                el.addEventListener(type, this, !!bubble);
            } else { // IE<9
                el.attachEvent(type, !!bubble);
            }
        },

        _unbind: function (type, el, bubble) {
            el.removeEventListener(type, this, !!bubble);
        }
    }
})();
