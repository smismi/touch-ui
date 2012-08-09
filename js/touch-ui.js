/**
 * Created with JetBrains WebStorm.
 * User: smi
 * Date: 09.08.12
 * Time: 21:30
 * To change this template use File | Settings | File Templates.
 */

(function(){
    var m = Math,
        mround = function (r) { return r >> 0; },
        vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
            (/firefox/i).test(navigator.userAgent) ? 'Moz' :
                'opera' in window ? 'O' : '',

    // Browser capabilities
        isAndroid = (/android/gi).test(navigator.appVersion),
        isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
        isPlaybook = (/playbook/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

        has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = vendor + 'Transform' in document.documentElement.style,
        hasTransitionEnd = isIDevice || isPlaybook,

        nextFrame = (function() {
            return window.requestAnimationFrame
                || window.webkitRequestAnimationFrame
                || window.mozRequestAnimationFrame
                || window.oRequestAnimationFrame
                || window.msRequestAnimationFrame
                || function(callback) { return setTimeout(callback, 17); }
        })(),
        cancelFrame = (function () {
            return window.cancelRequestAnimationFrame
                || window.webkitCancelAnimationFrame
                || window.webkitCancelRequestAnimationFrame
                || window.mozCancelRequestAnimationFrame
                || window.oCancelRequestAnimationFrame
                || window.msCancelRequestAnimationFrame
                || clearTimeout
        })(),

    // Events
        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',

    // Helpers
        trnOpen = 'translate' + (has3d ? '3d(' : '('),
        trnClose = has3d ? ',0)' : ')',
// Constructor
    TouchUI = function (el, options) {
        var that = this,
            doc = document,
            i;
        that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
        that.wrapper.style.border = '1px solid red';



        // Default options
        that.options = {
            hScroll: true,
            vScroll: true,
            x: 0,
            y: 0,
            bounce: true,
            bounceLock: false,
            momentum: true,
            lockDirection: true,
            useTransform: true,
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


//        that._bind(START_EV, window);
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
            }
        },
        _start: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                matrix, x, y;
            that.wrapper.innerHTML = point.clientX + " " + point.clientY;
//           console.log(point.type + " " + point.clientX + " " + point.clientY)

        },

        _bind: function (type, el, bubble) {
            (el || this.wrapper).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.wrapper).removeEventListener(type, this, !!bubble);
        }
    }

    if (typeof exports !== 'undefined') exports.TouchUI = TouchUI;
    else window.TouchUI = TouchUI;
})();

