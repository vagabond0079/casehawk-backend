'use strict';

const User = require('../../model/user.js');
const Day = require('../../model/day.js');

module.exports = () => {
  return Promise.all([
    User.remove({}),
    Day.remove({}),
  ]);
};
