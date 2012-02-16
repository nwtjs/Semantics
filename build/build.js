/**
 * Packages all of the NWTui scripts together.
 */

var fs = require('fs'),

packages = require("./package"),

scriptContent,

uglify = require("uglify-js");

for( var i in packages ) {

	scriptContent = [];

	for( var j = 0, file; file = packages[i][j] ; j++ ) {
		console.log('Compressing file file:', file);
		var thisScript = fs.readFileSync(__dirname + '/../' + file, 'utf8');
		scriptContent.push(thisScript);
	}

	// Wrap every file in an anonymous function
	scriptContent = scriptContent.join('');
	
	// Finished a package
	scriptContent = uglify(scriptContent, {mangle_options: {toplevel: true}});


	// Prepent the nwtui code into the file
	var nwtuiCode = fs.readFileSync(__dirname + '/../node_modules/nwtui/nwt.main.min.js', 'utf8');
	scriptContent = nwtuiCode + ';' + scriptContent;
	
	fs.writeFileSync(__dirname + '/../' + i + '.min.js', scriptContent);

	console.log(scriptContent);
}