'use strict';

var gpio = require('../index');
var assert = require('should');

describe('get Pins', function () {
    it('returns array', function () {
        var pins = gpio.getPins(__dirname + '/fixture/pins');
        pins.should.be.instanceof(Array).and.have.lengthOf(175);
        pins[6].should.have.property('pin', 6);
        pins[6].should.have.property('gpio', 'PA6');
    });
});