var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {
var dares = [
	'Kiss somebody of the same sex.',
	'Moon the next person who drives by.',
	'Try to seduce the person who is closest to you.',
	'Tickle a stranger.',
	'Speak in a fake language to a stranger.',
	"Finger a stranger's belly button.",
	'Hug a stranger.',
	"Go into an elevator alone and when sombody joins you, tell them you've been expecting them.",
	'Pee on a fire hydrant.'
	];

function random(dares) {
	return Math.floor(Math.random() * dares.length)
}

var num = random(dares);
  res.send(dares[num]);
});

module.exports = router;
