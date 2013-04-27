;(function(glob, undefined) {
	'use strict'

	function Lexed(textStream, ruleMap) {
		if (typeof textStream === 'string') {
			textStream = new Lexed.StringStream(textStream);
		}

		this._stream = textStream;
		this._currString = '';
		var ruleKeys = Object.keys(ruleMap);

		this._rules = [];
		ruleKeys.forEach(function(ruleKey) {
			if (ruleKey[0] == '^') {
				throw "rules with ^ as their first character are currently unsupported."
			} else {
				var rule = {
					regex: new RegExp('^' + ruleKey),
					action: ruleMap[ruleKey]
				};

				this._rules.push(rule);
			}
		}, this);
	}

	Lexed.EOF = {};
	Lexed.NO_MATCH = {msg: "NO SUITABLE CONTINUOUS MATCH"};
	Lexed.StringStream = function StringStream(string) {
		this._string = string;
	};

	Lexed.StringStream.prototype = {
		nextString: function() {
			var temp = this._string;
			this._string = undefined;
			return temp;
		}
	}

	Lexed.prototype = {
		lex: function() {
			var input = this._getInput();
			if (!input && (this._currString == '' || !this._currString))
				return Lexed.EOF;

			this._currString += input;

			var match;
			// Doing this iteratively even though it is
			// a bit uglier than the recursive solution.
			var index;
			while (!match) {
				for (var i = 0; i < this._rules.length; ++i) {
					var rule = this._rules[i];
					var tempMatch = rule.regex.exec(this._currString);
					if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
						match = tempMatch;
						index = i;
					}
				}

				if (!match) {
					var input = this._getInput(true);
					if (!input) {
						throw Lexed.NO_MATCH;
					}
					this._currString += input;
				}
			}

			this._currString = this._currString.substring(match[0].length);

			var rule = this._rules[index];
			if (typeof rule.action === 'function') {
				return rule.action(match[0]);
			} else {
				return rule.action;
			}
		},

		_getInput: function(needsInput) {
			if (!this._currString || this._currString == '' || needsInput) {
				return this._stream.nextString();
			} else {
				return '';
			}
		}
	};

	glob.Lexed = Lexed;
	/*
	format:
	{
		"rule": terminal -or- function...
	}
	*/
}(this));