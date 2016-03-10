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

    it('actives pins ', function () {

        var gpio = new GPIO({pinsFilename: __dirname + '/fixture/pins'});
        var compiled = _.template('/sys/class/gpio/gpio<%= pin %>/direction');
        gpio.activatePinsOutput(['PG8', 'PG6', 'PG2', 'PG3']);
        writer.callCount.should.be.equal(8);
        writer.args[0][0].should.be.equal('/sys/class/gpio/export');
        writer.args[0][1].should.be.equal(200);
        writer.args[1][0].should.be.equal(compiled({pin: 200}));
        writer.args[1][1].should.be.equal('out');

        writer.args[2][0].should.be.equal('/sys/class/gpio/export');
        writer.args[2][1].should.be.equal(198);
        writer.args[3][0].should.be.equal(compiled({pin: 198}));
        writer.args[3][1].should.be.equal('out');

        writer.args[4][0].should.be.equal('/sys/class/gpio/export');
        writer.args[4][1].should.be.equal(194);
        writer.args[5][0].should.be.equal(compiled({pin: 194}));
        writer.args[5][1].should.be.equal('out');

        writer.args[6][0].should.be.equal('/sys/class/gpio/export');
        writer.args[6][1].should.be.equal(195);
        writer.args[7][0].should.be.equal(compiled({pin: 195}));
        writer.args[7][1].should.be.equal('out');
    });

    it('writes pin ', function () {

        var gpio = new GPIO({pinsFilename: __dirname + '/fixture/pins'});
        var compiled = _.template('/sys/class/gpio/gpio<%= pin %>/value');
        gpio.write('PG8', '1');
        writer.callCount.should.be.equal(1);
        writer.args[0][0].should.be.equal(compiled({pin: 200}));
        writer.args[0][1].should.be.equal('1');
    });


});