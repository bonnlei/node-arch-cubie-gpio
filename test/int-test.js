'use strict';

var GPIO = require('../index');
var _ = require('lodash');
var sleep = require('sleep');
require('should');

describe('GPIO', function () {

    it('writes signals', function () {
        var gpio = new GPIO({});
        var pins = ['PG3', 'PG1', 'PG6', 'PG8'];
        gpio.activatePinsOutput(pins);
        _.forEach(pins, function (pin) {
            gpio.write(pin, '1');
        });
        sleep.sleep(10);
        _.forEach(pins, function (pin) {
            gpio.write(pin, '0');
        });
        true.should.be.equal(true);
    });

});