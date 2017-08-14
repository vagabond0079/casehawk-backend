'use strict';

const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  dateTime: {type: Date, required: true},
  duration: {type: String, required: true},
  allDay: {type: Boolean},
  name: {type: String, required: true},
  type: {type: String, required: true},
  tag: {type: String},
  notify: {type: Boolean},
  ownerId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
});

module.exports = mongoose.model('event', eventSchema);
