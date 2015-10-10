'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tournament = Schema({
  games: [{type: mongoose.Schema.ObjectId, ref: 'Game'}]
});
