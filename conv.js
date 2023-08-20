var parser = require('@jscad/openscad-openjscad-translator');
var fs = require('fs');

var openSCADText = fs.readFileSync('./public/scad/angbu.scad', "utf8");
var openJSCADResult = parser.parse(openSCADText);

console.log(openJSCADResult);