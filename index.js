'use strict';

var fs = require('fs');
var _ = require('lodash');


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


    var lines = fs.readFileSync(filename).toString().split("\n").filter(function (line) {
        return _.isString(line);
    });
    var pinLines = lines.slice(1, lines.length);

    for (var i = 0; i < pinLines.length; i++) {
        var words = _.words(pinLines[i]);
        list[i] = {pin: _.parseInt(words[1]), gpio: words[2] + words[3]};
    }

    return list;
}

/**
 *
 * @param {String} direction - "in" or "out", default: "out"
 * @returns {*}
 */
function sanitizeDirection(direction) {
    direction = (direction || "").toLowerCase().trim();
    if (direction === "in" || direction === "input") {
        return "in";
    } else if (direction === "out" || direction === "output" || !direction) {
        return "out";
    } else {
        throw new Error("Direction must be 'input' or 'output'");
    }
}

/**
 *
 * @param {Array} options
 *                      - pinsFilename
 *
 */
function gpio(options) {

    this.pinsFilename = '/sys/kernel/debug/pinctrl/1c20800.pinctrl/pins';
    this.gpioFilename = '/sys/class/gpio';
    this.options = options;

    if (this.options && this.options.pinsFilename) {
        this.pinsFilename = this.options.pinsFilename;
    }

    this.pins = getPins(this.pinsFilename);

    this.activatePinsOutput = function (gpioKeys) {
        var self = this;
        _(gpioKeys).forEach(function (key) {
            self.setDirection(key, 'out');
        });
    }

    this.setDirection = function (gpioKey, direction) {
        var pin = this.getPin(gpioKey);
        if (_.isNull(pin)) {
            throw new Error(gpioKey + ' not found');
        }

        fs.writeFile(this.gpioFilename + "/gpio" + pin + "/direction", sanitizeDirection(direction), function (err) {
            if (err) throw err;
        });
    }

    this.getPin = function (gpioKey) {
        var found = _.find(this.pins, _.matchesProperty('gpio', gpioKey));
        if (_.isObject(found)) {
            return found.pin;
        }
        return null;
    }

    this.write = function (gpioKey, signal) {
        if (_.isEmpty(signal))
            signal = '0';
        var pin = this.getPin(gpioKey);
        if (_.isNull(pin)) {
            throw new Error(gpioKey + ' not found');
        }
        fs.writeFile(this.gpioFilename + "/gpio" + pin + "/value", signal, 'utf8', function (err) {
            if (err) throw err;
        });
    }
}

module.exports = gpio;