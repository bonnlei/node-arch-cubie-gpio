'use strict';

var fs = require('fs');
var _ = require('lodash');

const PINS_FILE = '/sys/kernel/debug/pinctrl/1c20800.pinctrl/pins';

/**
 *
 * @param {String} filename - GPIO Pins file in the ArchLinux
 * @returns {Array}
 *                 - {Int} pin
 *                 - {String} gpio
 */
function getPins(filename) {

    var list = [];

    if (!filename) return list;


    const lines = fs.readFileSync(filename).toString().split("\n").filter(function (line) {
        return line != '';
    });
    const pinLines = lines.slice(1, lines.length);

    for (var i = 0; i < pinLines.length; i++) {
        var words = _.words(pinLines[i]);
        list[i] = {pin: parseInt(words[1]), gpio: words[2] + words[3]};
    }

    return list;
}

module.exports.getPins = getPins;