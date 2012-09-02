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
    var m = Math;
    var mround = function (r) { return r >> 0; };
    var vendor = (/webkit/i).test(navigator.appVersion) ? 'webkit' :
        (/firefox/i).test(navigator.userAgent) ? 'Moz' :
            'opera' in window ? 'O' : '';
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
    var KEYDOWN = 'keydown';
    var KEYUP = 'keyup';
        // Helpers
    var trnOpen = 'translate' + '(';
    var trnClose = ')';

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
            hScroll: true,
            vScroll: true
        };

        // User defined options
        for (i in options) that.options[i] = options[i];

        // Set starting position
        that.x = that.options.x;
        that.y = that.options.y;
        that.w = that.options.w;
        that.h = that.options.h;
        that.vScroll = that.options.vScroll;
        that.hScroll = that.options.hScroll;
        that.altDir = false;

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
            that._bind(KEYDOWN, document);
            that._bind(KEYUP, document);


            that.wrapper.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);


        },




//    action
        handleEvent: function (e) {
                var that = this;
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
                case MOVE_EV: that._move(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case KEYDOWN: that.testKey(e, true); break;
                case KEYUP: that.testKey(e, false); break;
                case 'mouseout': that._mouseout(e); break;
                case 'webkitTransitionEnd': that._transitionEnd(e); break;
            }
        },
        scroll: function(e) {
            var that = this;
            var delta;
            if (!that.options.enabled) return;
            e = e || event;
            if (!e.wheelDelta) {
                e.wheelDelta = -40 * e.detail; // для Firefox
            }


            delta = e.wheelDelta;
            that._log(that.altDir + ' ' + that.hScroll + ' ' + that.vScroll);

//
            if (that.altDir) {
                var newY = that.y + delta;
                var newX = that.x + delta;

            } else {

                var newY = that.y + delta;
                var newX = that.x + delta;
            }






            if (newY > 0) {
                newY = 0;
            }
            if (newY < - that.height + that.h) {
                newY =  -that.height + that.h;
            }
            if (newX > 0) {
                newX = 0;
            }
            if (newX < - that.width + that.w) {
                newX =  -that.width + that.w;
            }
            that._pos(newX, newY);
            that.scrollbarV.style.top = $px(that.y * that.h / -that.height);
            that.scrollbarH.style.left = $px(that.x * that.w / -that.width);

            // отменить действие по умолчанию (прокрутку элемента/страницы)
            e.stopPropagation();
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

        },
        start: function(e) {
            var that = this;
            if (!that.options.enabled) return;
            var point = isTouch ? e.touches[0] : e;
            that.started = true;
//            that.startX = that.x;
//            that.startY = that.y;
//            that.pointX = point.pageX;
//            that.pointY = point.pageY;
//            that._log('_start' + that.pointX + ' ' + that.pointY);



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

            that.startTime = e.timeStamp || Date.now();

            if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

        },
        _end: function(e) {
            var that = this;
            var point = isTouch ? e.touches[0] : e;
            that.started = false;
            that._log('_stop');
        },

        testKey: function(e, q) {
            var that = this;
            that._log(q);

            if (e.keyCode == 18) {
                that.altDir = q;
            }
        },

        _move:function (e) {
            var that = this;
            var point = isTouch ? e.touches[0] : e;
            var deltaX = point.pageX - that.pointX;
            var deltaY = point.pageY - that.pointY;
            var newX = that.x + deltaX;
            var newY = that.y + deltaY;
            var timestamp = e.timeStamp || Date.now();
            if (!e.wheelDelta) {
                e.wheelDelta = -40 * e.detail; // для Firefox
            }
            if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

            if (!that.started) return;
            that.pointX = point.pageX;
            that.pointY = point.pageY;

            // Slow down if outside of the boundaries
            that._log(that.height + ' ' + that.h);

            if (newY > 0) {
                newY = 0;
            }
            if (newY < - that.height + that.h) {
                newY =  -that.height + that.h;
            }
            if (newX > 0) {
                newX = 0;
            }
            if (newX < - that.width + that.w) {
                newX =  -that.width + that.w;
            }
            that.distX += deltaX;
            that.distY += deltaY;
            that.absDistX = m.abs(that.distX);
            that.absDistY = m.abs(that.distY);

            if (that.absDistX < 6 && that.absDistY < 6) {
                return;
            }

            // Lock direction
            if (that.options.lockDirection) {
                if (that.absDistX > that.absDistY + 5) {
                    newY = that.y;
                    deltaY = 0;
                } else if (that.absDistY > that.absDistX + 5) {
                    newX = that.x;
                    deltaX = 0;
                }
            }

            that.moved = true;

            that.scrollbarV.style.top = $px(that.y * that.h / -that.height);
            that.scrollbarH.style.left = $px(that.x * that.w / -that.width);

            that._pos(newX, newY);
            that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (timestamp - that.startTime > 300) {
                that.startTime = timestamp;
                that.startX = that.x;
                that.startY = that.y;
            }

            if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);


        },

//    utils
        _pos: function (x, y) {
            var that = this;
            x = that.hScroll ? x : 0;
            y = that.vScroll ? y : 0;
            if (this.options.transform) {
                this.scroller.style[vendor + 'Transform'] = trnOpen + x + 'px,' + y + 'px' + trnClose + ' scale(1)';
            } else {
                x = mround(x);
                y = mround(y);
                this.scroller.style.left = $px(x);
                this.scroller.style.top = $px(y);
            }

            //that._log(this.x +' ' + this.y);
            this.x = x;
            this.y = y;
            that.fadeInScroll();
        },
        drawScroller : function(el) {
            var that = this;
            that.wrapper = document.createElement("div");


            that.scroller = el.cloneNode(true);


            that.scrollbarV = document.createElement("div");
            that.scrollbarH = document.createElement("div");
            that._addClass(that.wrapper, 'wrapper');
            that._addClass(that.scrollbarV, 'scrollbarV');
            that._addClass(that.scrollbarH, 'scrollbarH');
            that._addClass(that.scroller, 'scroller');


            that.wrapper.style.width = $px(that.w);
            that.wrapper.style.height = $px(that.h);
            that.wrapper.style.position = "relative";
            that.wrapper.appendChild(that.scroller);
            that.wrapper.appendChild(that.scrollbarV);
            that.wrapper.appendChild(that.scrollbarH);

            el.parentNode.replaceChild(that.wrapper, el);
            this.scroller.style.position = "absolute";

            that.getDim(that.scroller);


            that.scrollbarV.style.height = $px(that.h * that.h / that.height);
            that.scrollbarH.style.width = $px(that.w * that.w / that.width);
            that.scrollbarV.style.opacity = .2;
            that.scrollbarH.style.opacity = .2;

            if (that.h > that.height) {
                that.scrollbarV.style.display = "none";
                that.vScroll = false;
            }
            if (that.w > that.width) {
                that.scrollbarH.style.display = "none";
                that.hScroll = false;
            }
//            if (that.w < that.width && that.h < that.height && !isTouch) {
//                that.hScroll = false;
//            }
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
        fadeInScroll:function () {
            var that = this;
            that.scrollbarH.style.opacity = 1;
            that.scrollbarV.style.opacity = 1;
            clearTimeout(that.timerId);
            clearTimeout(that.timerId2);
            that.timerId = setTimeout(function () {

                that.doAnimation(that.scrollbarH, 'opacity', .2);
                that.doAnimation(that.scrollbarV, 'opacity', .2);
//            _this.scrollbar.style.opacity = 0.2;
            }, 700);

        },
        doAnimation:function (el, prop, threshold) {
            var that = this;
            var checkProp = function (cssProp) {
                if (el.currentStyle)
                    var y = el.currentStyle[cssProp];
                else if (window.getComputedStyle)
                    var y = document.defaultView.getComputedStyle(el, null).getPropertyValue(cssProp);
                return y;
            }
            if (checkProp(prop)) {
                function doMove() {
                    el.style[prop] = (el.style[prop] > threshold) ? (el.style[prop] - 0.05) : threshold; // pseudo-property code
                    that.timerId2 = setTimeout(doMove, 20); // call doMove() in 20 msec
                }

                doMove()
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
