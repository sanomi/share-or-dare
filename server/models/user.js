'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  game: {type: mongoose.Schema.ObjectId, ref: 'Game'},
  tournament: {type: mongoose.Schema.ObjectId, ref: 'Tournament'}
});


