'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = Schema({
  players: [{type: mongoose.Schema.ObjectId, ref: 'User'}]
  tournament: {type: mongoose.Schema.ObjectId, ref: 'Tournament'}
});
