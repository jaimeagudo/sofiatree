var chai = require('chai');
var assert = chai.assert;

var _ = require('underscore');
// var SofiaTree = require('../sofia-tree');
var SofiaTree = require('../');

describe('SofiaTree very basic test suite', function() {

	var dictionary=["b","bar","barbar","f","foo","foobar"];
	var sofiaTree= new SofiaTree({useCache: true});


	dictionary.forEach(function(word){
		sofiaTree.insert(word);
	},this);
	

	it("Retrieve all the completions starting by foo",function(){
		assert.deepEqual(sofiaTree.getCompletions("foo"),["foo","foobar"]);
	});


	it("Prints the whole dictionary when asking for empty string",function(){
		assert.deepEqual(_.sortBy(sofiaTree.getCompletions()),dictionary);
	});

  });
