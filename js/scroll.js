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


    Scroll = function(el, options) {
        var that = this;
        that.scroller = $(el);
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
        }
        // User defined options
        for (i in options) that.options[i] = options[i];


        that.drawScroller(that.scroller);
        that.activateDisabler();
    },

    Scroll.prototype = {

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

            that.bindMouseScroll(that.scroller);
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
        _move:function (deltaY, el) {

            var that = this;
            console.log(el);
            that.options.position.y += deltaY / 4;
            that.scroller.style.position = 'absolute';
            that.scroller.style.top = that.options.position.y + 'px';

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
//                if (that.options.position.y < 0 && e.wheelDelta > 0) {

                    that._move(e.wheelDelta, el);
//                }

//                if ((Math.abs(that.options.position.y) < (that.scrollerHeight - that.wrapperHeight)) && e.wheelDelta < 0) {
                    that._move(e.wheelDelta, el);
//                }

                that._log(e.wheelDelta);
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
        }

    }
})();
