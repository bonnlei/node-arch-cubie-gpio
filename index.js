'use strict';

var fs = require('fs');
var _ = require('lodash');
var sleep = require('sleep');
var util = require("util");

/**
 *
 * @param {String} filename - GPIO Pins file in the ArchLinux
 * @returns {Object}
 *                 - {Int} pin
 *                 - {String} gpio
 */
function getGPIOList(filename) {

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

function logDeep(title, value) {
    console.log('#### START ' + title + ' #### \n' + util.inspect(value, false, null) + '\n#### END ' + title + ' ####');
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
 * @class
 * @param {Object} options - settings
 * @param {String} [options.pinsFilename ='/sys/kernel/debug/pinctrl/1c20800.pinctrl/pins'] - registered pins
 */
function gpio(options) {

    this.pinsFilename = '/sys/kernel/debug/pinctrl/1c20800.pinctrl/pins';
    this.gpioFilename = '/sys/class/gpio';
    this.options = options;

    if (this.options && this.options.pinsFilename) {
        this.pinsFilename = this.options.pinsFilename;
    }

    this.gpioList = getGPIOList(this.pinsFilename);
    logDeep('GPIO list', this.gpioList);

    /**
     *
     * @param {String} pin - pin number
     * @param {String} direction - 'out' or 'in'
     * @returns {void}
     */
    this.activatePin = function (pin, direction) {
        if (_.indexOf(this.getExistingPins(this.gpioFilename), 'gpio' + pin) === -1) {
            this.exportPin(pin);
            sleep.usleep(10);
        }
        this.setDirection(pin, direction);
        sleep.usleep(10);
        console.log('Pin ' + pin + ' activated for ' + direction);
    };

    this.setDirection = function (pin, direction) {

        if (_.isNull(pin)) {
            throw new Error('Pin ' + pin + ' not found');
        }

        fs.writeFileSync(this.gpioFilename + "/gpio" + pin + "/direction", sanitizeDirection(direction));
    };

    this.exportPin = function (pin) {

        if (_.isNull(pin)) {
            throw new Error('Pin ' + pin + ' not found');
        }

        fs.writeFileSync(this.gpioFilename + "/export", pin);
    };

    /**
     *
     * @param {String} gpioName - GPIO name
     * @returns {*} - pin number or null
     *
     */
    this.getPin = function (gpioName) {
        var found = _.find(this.gpioList, _.matchesProperty('gpio', gpioName));
        if (_.isObject(found)) {
            console.log('GPIO ' + gpioName + ' is the Pin ' + found.pin);
            return found.pin;
        }
        return null;
    };

    /**
     *
     * @param {String} pin - pin number
     * @param {String} signal - '0' or '1'
     * @returns {void}
     */
    this.writeToPin = function (pin, signal) {
        if (_.isEmpty(signal))
            signal = '0';
        if (_.isNull(pin)) {
            throw new Error('Pin ' + pin + ' not found');
        }
        fs.writeFileSync(this.gpioFilename + "/gpio" + pin + "/value", signal);
        console.log(signal + ' written to Pin ' + pin);
    };

    this.getExistingPins = function (path) {
        var list = fs.readdirSync(path)
        return list;
    };

}

module.exports = gpio;