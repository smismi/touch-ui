/**
 * Created with JetBrains WebStorm.
 * User: smi
 * Date: 09.08.12
 * Time: 21:30
 * To change this template use File | Settings | File Templates.
 */

(function(){
    var m = Math;
    var mround = function (r) { return r >> 0; };
    var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : 'opera' in window ? 'O' : '';
     // Browser capabilities
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var isIDevice = (/iphone|ipad/gi).test(navigator.appVersion);
    var isPlaybook = (/playbook/gi).test(navigator.appVersion);
    var isTouchPad = (/hp-tablet/gi).test(navigator.appVersion);

    var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix();
    var hasTouch = 'ontouchstart' in window && !isTouchPad;
    var hasTransform = vendor + 'Transform' in document.documentElement.style;
    var hasTransitionEnd = isIDevice || isPlaybook;

    var nextFrame = (function() {
            return window.requestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || window.oRequestAnimationFrame
                || window.msRequestAnimationFrame
                || function(callback) { return setTimeout(callback, 17); }
        })();
    var cancelFrame = (function () {
            return window.cancelRequestAnimationFrame
                || window.webkitCancelAnimationFrame
                || window.webkitCancelRequestAnimationFrame
                || window.mozCancelRequestAnimationFrame
                || window.oCancelRequestAnimationFrame
                || window.msCancelRequestAnimationFrame
                || clearTimeout
        })();

    // Events
    var RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize';
    var START_EV = hasTouch ? 'touchstart' : 'mousedown';
    var MOVE_EV = hasTouch ? 'touchmove' : 'mousemove';
    var END_EV = hasTouch ? 'touchend' : 'mouseup';
    var CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup';

    // Helpers
    var trnOpen = 'translate' + (has3d ? '3d(' : '(');
    var trnClose = has3d ? ',0)' : ')';
// Constructor
    TouchUI = function (el, options) {
        var that = this,
            doc = document,
            i;
        that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);

//        that.wrapper = typeof el == 'object' ? doc.getElementsByClassName(el.class) : doc.getElementById(el);
//        if (typeof el == 'object') {
//            for(var k = 0, j=doc.getElementsByClassName(el.class).length; k<j; k++){
//                that.wrapper = doc.getElementsByClassName(el.class)[k];
//            }
//        } else {
//            that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
//        }


//        console.log(that.wrapper);
        that.wrapper.style.border = '1px solid red';
        that.logger = doc.getElementById("log");


        // Default options
        that.options = {
            hScroll: true,
            vScroll: true,
            x: 1,
            y: 2,
            bounce: true,
            bounceLock: false,
            momentum: true,
            lockDirection: true,
            useTransform: false,
            useTransition: false,

            // Events
            onRefresh: null,
            onBeforeScrollStart: function (e) { e.preventDefault(); },
            onScrollStart: null,
            onBeforeScrollMove: null,
            onScrollMove: null,
            onBeforeScrollEnd: null,
            onScrollEnd: null,
            onTouchEnd: null,
            onDestroy: null
        };
        // User defined options
        for (i in options) that.options[i] = options[i];
        that.refresh();
        that._bind(RESIZE_EV, window);
        that._bind(START_EV);
        if (!hasTouch) that._bind('mouseout', that.wrapper);

    };
// Prototype
    TouchUI.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        handleEvent: function (e) {
            var that = this;
            switch(e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move(e); break;
                case END_EV:that._end(e); break;
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
            }
        },
        _resize: function () {
            this.refresh();
        },
        _start: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e ;
            that.started = true;
            that.moved = false;
            that.animating = false;
            that.zoomed = false;
            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;
            that.dirX = 0;
            that.dirY = 0;
            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;
//            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);
//            if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);
//            if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);


            this._simple_log('_start');
//            that.startTime = e.timeStamp || Date.now();
            that._bind(MOVE_EV);
            that._bind(END_EV);      //биндится отпускание
            that._bind(CANCEL_EV);   //биндится уход с элемента
//            that._log(e);
        },

        _move: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - that.pointX,
                deltaY = point.pageY - that.pointY,
                newX = that.x + deltaX,
                newY = that.y + deltaY,
                timestamp = e.timeStamp || Date.now();



          //  that.moved = true;
            that._pos(newX, newY);



            if (that.started) {
                that.moved = true;
            }

        },
        _pos: function (x, y) {
            var that = this;
            if (that.moved) {
                that._simple_log('_pos');
                this.x = x;
                this.y = y;

                this.hScroll = this.x;
                this.vScroll = this.y;
            x = this.hScroll ? x : 0;
            y = this.vScroll ? y : 0;
//
//            this.x++;
//            this.y++;
//            if (this.options.useTransform) {
//                this.wrapper.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(' + this.scale + ')';
//            } else {
//                x = mround(x);
//                y = mround(y);

                this.wrapper.style.left = x + 'px';
                this.wrapper.style.top = y + 'px';
//             }
        }
        },
        _end: function (e) {
            var that = this;
            that._simple_log('_end');

            if (!that.moved) {
                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                that.started = false;
                that.moved = false;
                return;
            }

            if (that.options.onScrollEnd) that.options.onScrollEnd.call(that, e);
            that.started = false;
            that.moved = false;
        },
        _bind: function (type, el, bubble) {
            (el || this.wrapper).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.wrapper).removeEventListener(type, this, !!bubble);
        },

//utils
//        _offset: function (el) {
//            var left = -el.offsetLeft,
//                top = -el.offsetTop;
//
//            while (el = el.offsetParent) {
//                left -= el.offsetLeft;
//                top -= el.offsetTop;
//            }
//
//            return { left: left, top: top };
//        },
        _log: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                matrix, x, y;
            var logs = document.createElement("div");
            logs.innerHTML = point.type + " " + point.clientX + " " + point.clientY + " " + that.duration;
            that.logger.appendChild(logs);
//            that.wrapper.innerHTML = point.clientX + " " + point.clientY;
////           console.log()
//            that.startX = that.x;
//            that.startY = that.y;
//            that.pointX = point.pageX;
//            that.pointY = point.pageY;
        },
        _simple_log: function (text) {
            var logs = document.createElement("div");
            logs.innerHTML = text;
            document.getElementById("log").appendChild(logs);
//            that.wrapper.innerHTML = point.clientX + " " + point.clientY;
////           console.log()
//            that.startX = that.x;
//            that.startY = that.y;
//            that.pointX = point.pageX;
//            that.pointY = point.pageY;
        },
        refresh: function () {
            var that = this,
                offset;
            console.log('refresh');

        }
    }

    if (typeof exports !== 'undefined') exports.TouchUI = TouchUI;
    else window.TouchUI = TouchUI;
})();



