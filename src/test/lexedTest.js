test("Uses first match (if other matches are same len)", function() {
	var rules = {
		"[a-z]+": 1,
		"[a-zA-Z]+": 2
	};
	var l = new Lexed("abc", rules);

	ok(l.lex() == 1);
});

test("Uses first longest mast if multiple matches", function() {
	var rules = {
		"[a-z]+": 1,
		"[a-z]+ ": 2,
	};

	var l = new Lexed("abc ", rules);

	ok(l.lex() == 2);
});

test("Will run functions if provided in rules", function() {
	var ruleRan = false;
	var rules = {
		"a*": function() {
			ruleRan = true;
		}
	};

	var l = new Lexed("aaaaaaaaa", rules);
	l.lex();

	ok(ruleRan);
	ok(l.lex() == Lexed.EOF, "EOF");
});

test("Will provide the text of the match to the rule", function() {
	var matchText;
	var rules = {
		"a+b*": function(text) {
			matchText = text;
		}
	};

	var l = new Lexed("aaa", rules);
	l.lex();
	ok(matchText == "aaa");

	var l = new Lexed("abbb", rules);
	l.lex();
	ok(matchText == "abbb");
});

test("Matching must be continuous, throws exception if not.", function() {
	var rules = {
		"a": 1,
		"b": 2,
		"c": 3,
		"d": 4
	};

	var exception = null;
	try {
		var l = new Lexed("acdadbcadbccdba d", rules);
		while (l.lex() != Lexed.EOF);
	} catch (e) {
		exception = e;
	}

	ok(exception === Lexed.NO_MATCH);
});

test("Returns EOF after matching everything", function() {
	var rules = {
		"a": 1,
		"b": 2,
		"c": 3
	};

	var str = "abcbcbcacbccbbaabcbcaabcccbbb";
	var l = new Lexed(str, rules);
	var i = 0;
	var lastToken;
	while((lastToken = l.lex()) != Lexed.EOF) {
		++i;
	}

	ok(lastToken == Lexed.EOF);
	ok(i == str.length, "Matched appropriate number of times");
});

test("Allows state transitions!", function() {
	var rules = {
			initial: {
				'<\/[^>]+>': Lexed.IGNORE,
				'<[^>]+>': Lexed.IGNORE,
				'[^<>]+': function(text) {
					return text;
				},
				'<!--': function(text, lexed) {
					lexed.state('comment');
					return Lexed.IGNORE;
				}
			},
			comment: {
				'[^-]+': Lexed.IGNORE,
				'-->': function(text, lexed) {
					lexed.state('initial');
					return Lexed.IGNORE;
				},
				'-': Lexed.IGNORE
			}
		};

	var str = '<div class="container"><h1>Welcome</h1><!-- some comment -->More text</div>';
	var l = new Lexed(str, null, rules);

	var token;
	var allText = '';
	while((token = l.lex()) != Lexed.EOF) {
		allText += token;
	}
	
	ok("WelcomeMore text" == allText);
});