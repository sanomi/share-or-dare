var express = require('express');
var router = express.Router();

var truths = [
'What is your biggest fear?',
'Who is your biggest crush right now?',
'What is your deepest secret?',
'What do you think about when you masturbate?',
'What is your most popular porn search?',
]

router.get('/', function(req,res,next){
	res.send('truths');
})

module.exports = router;