'use strict';

var GPIO = require('../index');
require('should');
var sinon = require('sinon');
var fs = require('fs');
var _ = require('lodash');


describe('GPIO', function () {

    var writer;

    beforeEach(function () {
        writer = sinon.stub(fs, 'writeFileSync');
    });

    afterEach(function () {
        writer.restore();
    });

    it('gets existing pins ', function () {

        var gpio = new GPIO({pinsFilename: __dirname + '/fixture/pins'});
        var list = gpio.getExistingPins('./');
        list.length.should.be.greaterThan(0);

    });

    it('actives pin ', function () {

        var reader = sinon.stub(fs, 'readdirSync');
        reader.onCall(0).returns(['sample.file']);
        var gpio = new GPIO({pinsFilename: __dirname + '/fixture/pins'});
        var compiled = _.template('/sys/class/gpio/gpio<%= pin %>/direction');
        var pin = gpio.getPin('PG8');
        gpio.activatePin(pin, 'out');
        writer.callCount.should.be.equal(2);
        writer.args[0][0].should.be.equal('/sys/class/gpio/export');
        writer.args[0][1].should.be.equal(200);
        writer.args[1][0].should.be.equal(compiled({pin: 200}));
        writer.args[1][1].should.be.equal('out');
        reader.restore();
    });

    it('actives pin without export', function () {

        var reader = sinon.stub(fs, 'readdirSync');
        reader.onCall(0).returns(['gpio200']);
        var gpio = new GPIO({pinsFilename: __dirname + '/fixture/pins'});
        var compiled = _.template('/sys/class/gpio/gpio<%= pin %>/direction');
        var pin = gpio.getPin('PG8');
        gpio.activatePin(pin, 'out');
        writer.callCount.should.be.equal(1);
        writer.args[0][0].should.be.equal(compiled({pin: 200}));
        writer.args[0][1].should.be.equal('out');
        reader.restore();
    });

    it('writes to pin ', function () {

        var gpio = new GPIO({pinsFilename: __dirname + '/fixture/pins'});
        var compiled = _.template('/sys/class/gpio/gpio<%= pin %>/value');
        var pin = gpio.getPin('PG8');
        gpio.writeToPin(pin, '1');
        writer.callCount.should.be.equal(1);
        writer.args[0][0].should.be.equal(compiled({pin: 200}));
        writer.args[0][1].should.be.equal('1');
    });


});