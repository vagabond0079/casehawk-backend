'use strict';

// npm modules
const moment = require('moment');
const {Router} = require('express');
const jsonParser = require('body-parser').json();

// app modules
const Event = require('../model/day.js');
const basicAuth = require('../lib/basic-auth-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module logic
const eventRouter = module.exports = new Router();

// /api/events
eventRouter.post('/api/events', bearerAuth, jsonParser, (req, res, next) => {
  console.log('Hit POST /api/events');

  new Event({

  })
    .save()
    .then(day => {
      res.json(day);})
    .catch(next);
});
//
eventRouter.get('/api/events/:id', (req, res, next) => {
  console.log('Hit GET /api/events/:id');
  Event.findById(req.params.id)
    .then(day => res.json(day))
    .catch(next);
});

eventRouter.put('/api/events/:id', bearerAuth, jsonParser, (req, res, next) => {
  console.log('Hit PUT /api/events/:id');

  let options = {
    runValidators: true,
    new: true,
  };

  Event.findById(req.params.id)
    .then(day => {
      Event.findByIdAndUpdate(req.params.id, req.body, options)
        .then(day => res.json(day))
        .catch(next);
    })
    .catch(next);
});

eventRouter.delete('/api/events/:id', bearerAuth, (req, res, next) => {
  console.log('Hit DELETE /api/events/:id');
  Event.findById(req.params.id)
    .then(day => {
      if (req.user._id.toString() !== day.ownerId.toString()){
        throw Error('Unauthorized - cannot change another users resource');
      }
      return day;
    })
    .then(day => {
      Event.findByIdAndRemove(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(next);
    })
    .catch(next);
});
