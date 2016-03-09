'use strict';

var GPIO = require('../index');
require('should');
var sinon = require('sinon');
var fs = require('fs');
var _ = require('lodash');


describe('GPIO', function () {


    afterEach(function () {
        fs.writeFile.restore();
    });

    it('actives pins ', function () {
        var writer = sinon.spy(fs, 'writeFile');
        var gpio = new GPIO({pinsFilename: __dirname + '/fixture/pins'});
        var compiled = _.template('/sys/class/gpio/gpio<%= pin %>/direction');
        gpio.activatePinsOutput(['PG8', 'PG6', 'PG2', 'PG3']);
        writer.callCount.should.be.equal(4);
        writer.args[0][0].should.be.equal(compiled({pin: 200}));
        writer.args[0][1].should.be.equal('out');
        writer.args[1][0].should.be.equal(compiled({pin: 198}));
        writer.args[1][1].should.be.equal('out');
        writer.args[2][0].should.be.equal(compiled({pin: 194}));
        writer.args[2][1].should.be.equal('out');
        writer.args[3][0].should.be.equal(compiled({pin: 195}));
        writer.args[3][1].should.be.equal('out');
    });

    it('write pin ', function () {
        var writer = sinon.spy(fs, 'writeFile');
        var gpio = new GPIO({pinsFilename: __dirname + '/fixture/pins'});
        var compiled = _.template('/sys/class/gpio/gpio<%= pin %>/value');
        gpio.write('PG8', '1');
        writer.callCount.should.be.equal(1);
        writer.args[0][0].should.be.equal(compiled({pin: 200}));
        writer.args[0][1].should.be.equal('1');
    });


});