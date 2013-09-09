## Lexed

A trivial lexer for Javascript.

```javascript
var rules = {
	'<\/[^>]+>': Lexed.IGNORE, // ignore close tags
	'<[^>]+>': Lexed.IGNORE, // ignore open tags
	'[^<>]+': function(text) { return text; } // return matched text content
};
var l = new Lexed('<div class="intro"><b>Hello!</b></div>', rules);

var token;
while ((token = l.lex()) != Lexed.EOF) {
	console.log(token); // writes Hello!
}
```

It also supports state transitions.

Take a look at the [tests](https://github.com/tantaman/lexed.js/blob/master/src/test) and [examples](https://github.com/tantaman/lexed.js/blob/master/examples) folders for more usage examples.

State transitions example: http://tantaman.github.io/lexed.js/examples/stateTransitions.html
Scoping existing CSS: http://tantaman.github.io/lexed.js/examples/scopeCss.html
