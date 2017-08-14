'use strict';

const User = require('../../model/user.js');
const Event = require('../../model/event.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
    Event.remove({}),
  ]);
};
