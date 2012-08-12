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
        this._log('i/m ready');
        this._getPos(el);


    };
// Prototype
    UI.prototype = {


        //utils
        _getPos: function(el) {
            var currentX = el.offsetLeft;
            var currentY = el.offsetTop;
            this._log(currentX + ' ' + currentX);
        },
        _log: function(textToLog) {
            var logs = document.createElement("div");
            logs.innerHTML = textToLog;
            document.getElementById("log").appendChild(logs);
        }
    }
})();
