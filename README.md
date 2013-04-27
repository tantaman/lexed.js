## Lexed

A trivial lexer for Javascript.

```javascript
var rules = {
	'<\/[^>]+>': 'close_tag',
	'<[^>]+>': function(match) { return {type: 'open_tag', text: match} },
	'[^<>]+': function(match) { return match; }
};
var l = new Lexed('<div class="intro"><b>Hello!</b></div>', rules);

var token;
while ((token = l.lex()) != Lexed.EOF) {
	console.log(token);
}
```

It also supports state transitions.

Take a look at the [tests](https://github.com/tantaman/lexed.js/blob/master/src/test) and [examples](https://github.com/tantaman/lexed.js/blob/master/examples) folders for more usage examples.
