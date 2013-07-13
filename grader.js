#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var CHECKSURL_DEFAULT = "http://tranquil-fortress-2271.herokuapp.com";
var sourceHTML = '';


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLValid = function(inURL) {
    var inURLStr = inURL.toString();
     //to do - add a url verification check via restler 
   return inURLStr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var buildfn = function(url,checksfile) {
    var response2console = function(data) {
        
        	sourceHTML = data;
        	
        	var htmlsource = sourceHTML;
            //console.log("Html from restler" + sourceHTML); 
        	 //$ = htmlsource;
        	  var checks = loadChecks(checksfile).sort();
        	  var out = {};
        	    for(var ii in checks) {
        	    	var present = sourceHTML.indexOf(checks[ii]) !== -1;
        	        //var present = true;
        	    	//var present = htmlsource(checks[ii]).length > 0;
        	        out[checks[ii]] = present;
        	    }
        	    var outJson = JSON.stringify(out, null, 4);
        	    console.log(outJson);
        	    
        	    //return out;
            
    };
    
    return response2console;
};

var webHtmlFile = function(url) {
 var 	html = ''; 
	
	rest.get(url).on('complete',function(data) {
	      html = data;
	      });
	return html;
};

var checkWebHtmlFile = function (url,checksfile){

//var htmlsource = webHtmlFile(url);

var response2console = buildfn(url,checksfile);
rest.get(url).on('complete', response2console);



};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url <check_url>', 'Path to heroku url', clone(assertURLValid), CHECKSURL_DEFAULT)
      .parse(process.argv);
    
    if(program.url)
    
      checkWebHtmlFile(program.url,program.checks); 
    
      else
     {
    	var checkJson = checkHtmlFile(program.file, program.checks);
        var outJson = JSON.stringify(checkJsonWeb, null, 4);
        console.log(outJson);
    	
     };	
    //var checkJsonWeb = checkWebHtmlFile(program.url,program.checks); 
    
} else {
    exports.checkHtmlFile = checkHtmlFile;
};
