#!/usr/bin/env node

'use strict';

let 
		fs = require('fs'),
		path = require('path'),
		program = require('commander'),
		glob = require('glob'),
		_ = require('lodash'),
		cheerio = require('cheerio'),

		defaultOptions = {
			globPattern: '**/*.html',
			jsMode: true,		// compile replacer patterns as Javascript code (until I come up with a DSL for this)
			dryRun: true,		// perform all actions, but don't write to the filesystem
			quiet: false,		// whether to post updates to the console, or just shut up unless there are errors
			dumpContent: true	// if true, dump each document to the console
		},
		options = _.extend({}, defaultOptions);

function exception(message, opts) {
	return {
		message,
		opts
	};
}

function makeMatcher(matchPattern, replacers) {
	return function (txt) {
		let $ = cheerio.load(txt);
		let $match = $(matchPattern);

		if ($match.length === 0) {
			return false;
		}

		replacers.forEach( replacer => {
			replacer($match, $);
		});

		return {			
			matches: $match,
			document: $
		}
	};
}

function makeSearcher(matchPattern, replacers) {
	if (options.jsMode) {
		replacers = replacers.map( replacerStr => {
			return new Function('$el', '$', replacerStr);
		});
	}

	let matcher = makeMatcher(matchPattern, replacers);

	return function (filename) {
		if (!fs.existsSync(filename)) {
			throw exception("file not found", {filename: filename});
		}
		let src = fs.readFileSync(filename, {encoding:'utf8'});
		let match = matcher(src);

		if (match) {
			let document = match.document.html();

			if (!options.dryRun) {
				fs.writeFileSync(filename, document, {encoding:'utf8'});
			}

			if (!options.quiet) {
				console.log(`changed ${filename}`);
			}

			if (options.dumpContent) {
				console.log(document);
			}

			return {
				filename,				
				document
			}
		}
		return null;
	};
}

function buildFileList(root, options) {
	return glob.sync(options.globPattern, {
		cwd: root,
		nosort: true		
	});
}

program
	.arguments('<root> <find> [replacer...]')
	.action(function (root, find, replacers, env) {
		let files = buildFileList(root, options);

		files = files.map(makeSearcher(find, replacers)).filter( v => v !== null );
	});

program.parse(process.argv);

