'use strict';

var GPIO = require('../index');
var _ = require('lodash');
var sleep = require('sleep');
require('should');

describe('GPIO', function () {

    it('writes signals', function () {
        var gpio = new GPIO({});
        var gpioNames = ['PG3', 'PG1', 'PG6', 'PG8'];
        _.forEach(gpioNames, function (gp) {
            var pin = gpio.getPin(gp);
            gpio.activatePin(pin, 'out');
            gpio.writeToPin(pin, '1');
        });
        sleep.sleep(1);
        _.forEach(gpioNames, function (gp) {
            var pin = gpio.getPin(gp);
            gpio.writeToPin(pin, '0');
        });
        true.should.be.equal(true);
    });

});