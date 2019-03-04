#!/usr/bin/env node
'use strict';

var _getArgs = require('./getArgs');

var exec = require('child_process').exec;
var coffeeProcess = exec('gulp --gulpfile ' + __dirname + '/gulpfile.babel.js ' + (_getArgs.start ? ' --start' : '') + (_getArgs.build ? ' --build' : '') + (_getArgs.localize ? ' --localize' : '') + ' --cwd ' + process.cwd(), function (error, stdout, stderr) {});

coffeeProcess.stdout.pipe(process.stdout);
coffeeProcess.stderr.pipe(process.stderr);