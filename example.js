var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var SofiaTree = require('./sofia-tree.js');

// var agent = require('webkit-devtools-agent');
// agent.start();

// A micro REST search service to benchmark SofiaTree performance

// create application/json parser
var jsonParser = bodyParser.json({limit: '5mb'})

function randomPositive(max){

	return Math.floor((Math.random() * max) + 1);
}

function randomSub(w){

	return w.substring(0,randomPositive(w.length));
}


//Just To compare performance
function linealSearch(st,dict){
	var t = process.hrtime();

	var term= st.toLowerCase();

	var	matches=_.filter(dict,function(word){
		return word.indexOf(term) === 0;
	});

	t = process.hrtime(t);
	console.log('Found %d results using Lineal search took %d s and %d ms',matches.length, t[0], t[1]/ 1e6);
	return matches;
}

// Global
var server = express();

var port=process.argv[2] || 8000;

//Provide sane defaults to avoid errors on empty dictionary searches
var dictionary=[];

var sofiaTree= new SofiaTree();

// ///////////////////////////////////////////////////////////////////////////////////
server.post('/dictionary/',jsonParser, function (req, res) {

	if (!req.body) 
		return res.sendStatus(400)

	dictionary= e=_.uniq(req.body,true);
	//Reset whole tree on each new dictionary submission to reset cache
	sofiaTree= new SofiaTree();

	dictionary.forEach(function(word){
		sofiaTree.insert(word);
	},server);

	//print the just generated tree
	// console.log(sofiaTree.buildWordsArray(''));
    res.writeHead(200, { 'content-type': 'application/json' });
    res.write(JSON.stringify({ status: "ok" }));
    console.log("Dictionary loaded with " + dictionary.length + " entries [" + dictionary[0] + ",... ...," + dictionary[dictionary.length -1] + "]" );

    res.end();
});



// ///////////////////////////////////////////////////////////////////////////////////
server.get('/search/:term',function (req, res) {

	process.stdout.write("Searching for '"+ req.params.term + "' ...");
	// UNCOMMENT THIS to compare SofiaTree with linealSearch >>>>>>>>>>>
	// linealSearch(req.params.term.toLowerCase(),dictionary);

	var t = process.hrtime();
	var result=sofiaTree.getCompletions(req.params.term.toLowerCase());
	t = process.hrtime(t);
	console.log("  %d results found on %d s and %d ms", result.length, t[0], t[1] / 1e6);

	res.writeHead(200, { 'content-type': 'application/json' });
	res.write(JSON.stringify(result));

	res.end();
});

// ///////////////////////////////////////////////////////////////////////////////////
server.get('/gentests/:max',function (req, res) {

	console.log("Generating "+ req.params.max + " tests");

	var BASE_URL="curl 'http://127.0.0.1:"+ port +"/search/"
	var result=[];
	var i;
	var randomWord;

	if(dictionary && dictionary.length)
		for(i=0; i < req.params.max; i++){
			randomWord=dictionary[randomPositive(dictionary.length)];
			result.push(BASE_URL + randomSub(randomWord)  + "'")
			console.log(BASE_URL + randomSub(randomWord)  + "'")
		}

	res.writeHead(200, { 'content-type': 'application/json' });
	res.write(JSON.stringify(result));
	res.end();
});


server.listen(port);
console.log("Server started at port " + port + "...")

