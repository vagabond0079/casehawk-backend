'use strict';

const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  title: {type: String, required: true},
  allDay: {type: Boolean},
  start: {type: Date, required: true},
  end: {type: Date, required: true},
  eventType: {type: String, required: true},
  tag: {type: String},
  notify: {type: Boolean},
  ownerId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
});

module.exports = mongoose.model('event', eventSchema);
