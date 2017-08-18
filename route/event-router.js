'use strict';

// npm modules
const moment = require('moment');
const { Router } = require('express');
const jsonParser = require('body-parser').json();

// app modules
const Event = require('../model/event.js');
const basicAuth = require('../lib/basic-auth-middleware.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

// module logic
const eventRouter = (module.exports = new Router());

// /api/events
eventRouter.post('/api/events', bearerAuth, jsonParser, (req, res, next) => {
  console.log('Hit POST /api/events');
  new Event({
    title: req.body.title,
    allDay: req.body.allDay,
    start: req.body.start,
    end: req.body.end,
    eventType: req.body.eventType,
    tag: req.body.tag,
    notify: req.body.notify,
    ownerId: req.user._id.toString(),
  })
    .save()
    .then(event => {
      console.log('POST event req', req.body);
      console.log('POST event res', event);
      res.json(event);
    })
    .catch(next);
});

eventRouter.get('/api/events/:id', (req, res, next) => {
  console.log('Hit GET /api/events/:id');
  Event.findById(req.params.id).then(event => res.json(event)).catch(next);
});

eventRouter.get('/api/events/', (req, res, next) => {
  Event.find({}).then(events => res.json(events)).catch(next);
});

eventRouter.put('/api/events/:id', bearerAuth, jsonParser, (req, res, next) => {
  console.log('Hit PUT /api/events/:id');

  let options = {
    runValidators: true,
    new: true,
  };

  Event.findById(req.params.id)
    .then(event => {
      Event.findByIdAndUpdate(req.params.id, req.body, options)
        .then(event => {
          res.json(event);
        })
        .catch(next);
    })
    .catch(next);
});

eventRouter.delete('/api/events/:id', bearerAuth, (req, res, next) => {
  console.log('Hit DELETE /api/events/:id');
  Event.findById(req.params.id)
    .then(event => {
      if (req.user._id.toString() !== event.ownerId.toString()) {
        throw Error('Unauthorized - cannot change another users resource');
      }
      return event;
    })
    .then(event => {
      Event.findByIdAndRemove(req.params.id)
        .then(() => res.sendStatus(204))
        .catch(next);
    })
    .catch(next);
});
