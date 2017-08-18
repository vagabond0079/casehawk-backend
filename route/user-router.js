'use strict';

// npm modules
const { Router } = require('express');
const jsonParser = require('body-parser').json();

// app modules
const User = require('../model/user.js');
const errorHandler = require('../lib/error-middleware.js');
const basicAuth = require('../lib/basic-auth-middleware.js');

// module logic
const userRouter = (module.exports = new Router());
const daysToMilliseconds = days => days * 1000 * 60 * 60 * 24;

// /api/signup
userRouter.post('/api/signup', jsonParser, (req, res, next) => {
  console.log('Hit POST /api/signup');
  console.log('req.body', req.body);
  User.create(req.body)
    .then(token => {
      let cookieOptions = { maxAge: daysToMilliseconds(7) };
      res.cookie('X-Casehawk-Token', token);
      res.send(token);
    })
    .catch(next);
});

userRouter.get('/api/signin', basicAuth, (req, res, next) => {
  console.log('Hit GET /api/signin');
  req.user
    .tokenCreate()
    .then(token => {
      let cookieOptions = { maxAge: daysToMilliseconds(7) };
      res.cookie('X-Casehawk-Token', token);
      res.send(token);
    })
    .catch(next);
});

userRouter.get('/api/500test', (req, res, next) => {
  console.log('Hit /api/500test');
  return errorHandler(new Error('fake-error'), req, res, next);
});
