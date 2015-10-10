var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var truths = [
	'What is your biggest fear?',
	'Who is your biggest crush right now?',
	'What is your deepest secret?',
	'What do you think about when you masturbate?',
	'What is your most popular porn search?',
	]

	function random(truths) {
		return Math.floor(Math.random() * truths.length)
	}

	var num = random(truths);
	  res.send(truths[num]);
});

module.exports = router;