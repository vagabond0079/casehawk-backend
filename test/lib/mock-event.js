'use strict';

const faker = require('faker');
const Event = require('../../model/event.js');
const mockUser = require('./mock-user.js');

const mockEvent = module.exports = {};

mockEvent.createOne = () => {
  let result = {};
  return mockUser.createOne()
    .then(userData => {
      result = userData;
      return new Event({
        title: 'mock-event',
        start: 'Wed Aug 16 2017 17:03:41 GMT-0700 (PDT)',
        end: 'Wed Aug 16 2017 19:03:41 GMT-0700 (PDT)',
        eventType: 'appointment',
        ownerId: userData.user._id,
      })
        .save();
    })
    .then(event => {
      result.event = event;
      return result;
    });
};
