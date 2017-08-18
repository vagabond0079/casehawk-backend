'use strict';

const path = require('path');

require('dotenv').config({ path: `${__dirname}/../.test.env` });

const expect = require('expect');
const superagent = require('superagent');

const User = require('../model/user.js');
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const mockUser = require('./lib/mock-user.js');
const mockEvent = require('./lib/mock-event.js');

const API_URL = process.env.API_URL;

describe('Testing Event model', () => {
  let tempUserData;

  before(server.start);
  after(server.stop);
  beforeEach('create mockEvent', () => {
    return mockEvent.createOne().then(userData => {
      tempUserData = userData;
    });
  });
  afterEach(clearDB);

  describe('Testing POST', () => {
    it('should return a event and a 200 status', () => {
      console.log(tempUserData);
      return superagent
        .post(`${API_URL}/api/events`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          title: 'mock-event',
          start: 'Wed Aug 16 2017 17:03:41 GMT-0700 (PDT)',
          end: 'Wed Aug 16 2017 19:03:41 GMT-0700 (PDT)',
          eventType: 'appointment',
        })
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual('mock-event');
          expect(res.body.start).toEqual('2017-08-17T00:03:41.000Z');
          expect(res.body.end).toEqual('2017-08-17T02:03:41.000Z');
          expect(res.body.eventType).toEqual('appointment');
          expect(res.body.allDay).toEqual(undefined);
          expect(res.body.notify).toEqual(undefined);
          expect(res.body.tag).toEqual(undefined);
          expect(res.body.ownerId).toEqual(tempUserData.user._id);
        });
    });
    it('should return a 401 for no authorization', () => {
      console.log(tempUserData);
      return superagent
        .post(`${API_URL}/api/events`)
        .send({
          title: 'mock-event',
          start: 'Wed Aug 16 2017 17:03:41 GMT-0700 (PDT)',
          end: 'Wed Aug 16 2017 19:03:41 GMT-0700 (PDT)',
          eventType: 'appointment',
        })
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
    it('should respond with a 400 if no body provided', () => {
      return superagent
        .post(`${API_URL}/api/events`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({})
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
    it('should respond with a 400 if invalid body', () => {
      return superagent
        .post(`${API_URL}/api/events`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({
          title: 'mock-event',
          start: 'Wed Aug 16 2017 17:03:41 GMT-0700 (PDT)',
          end: 'Wed Aug 16 2017 19:03:41 GMT-0700 (PDT)',
          eventType: {},
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
  });
  describe('Testing GET /api/events', () => {
    it('should return a event and a 200 status', () => {
      return superagent
        .get(`${API_URL}/api/events/${tempUserData.event._id}`)
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual(tempUserData.event.title);
          expect(res.body.allDay).toEqual(tempUserData.event.allDay);
          expect(new Date(res.body.start)).toEqual(tempUserData.event.start);
          expect(new Date(res.body.end)).toEqual(tempUserData.event.end);
          expect(res.body.eventType).toEqual(tempUserData.event.eventType);
          expect(res.body.tag).toEqual(tempUserData.event.tag);
          expect(res.body.notify).toEqual(tempUserData.event.notify);
        });
    });
    it('should return a event and a 200 status', () => {
      return superagent
        .get(`${API_URL}/api/events/`)
        .then(res => {
          console.log('tempUserData.event', tempUserData.event);
          console.log('res.body', res.body);
          expect(res.status).toEqual(200);
          expect(res.body[0].title).toEqual(tempUserData.event.title);
          expect(res.body[0].allDay).toEqual(tempUserData.event.allDay);
          expect(new Date(res.body[0].start)).toEqual(tempUserData.event.start);
          expect(new Date(res.body[0].end)).toEqual(tempUserData.event.end);
          expect(res.body[0].eventType).toEqual(tempUserData.event.eventType);
          expect(res.body[0].tag).toEqual(tempUserData.event.tag);
          expect(res.body[0].notify).toEqual(tempUserData.event.notify);
        });
    });
    it('should respond with status 404 for event.id not found', () => {
      return superagent.get(`${API_URL}/api/events/notAnId`).catch(res => {
        expect(res.status).toEqual(404);
        expect(res.body).toBe(undefined);
      });
    });
  });
  describe('Testing PUT', () => {
    it('should return an updated event and a 200 status', () => {
      return superagent
        .put(`${API_URL}/api/events/${tempUserData.event._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({title: 'updated-title'})
        .then(res => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual('updated-title');
          expect(res.body.allDay).toEqual(tempUserData.event.allDay);
          expect(new Date(res.body.start)).toEqual(tempUserData.event.start);
          expect(new Date(res.body.end)).toEqual(tempUserData.event.end);
          expect(res.body.eventType).toEqual(tempUserData.event.eventType);
          expect(res.body.tag).toEqual(tempUserData.event.tag);
          expect(res.body.notify).toEqual(tempUserData.event.notify);
        });
    });
    // it.only('should respond with a 400 if no body provided', () => {
    //   return superagent
    //     .put(`${API_URL}/api/events/${tempUserData.event._id}`)
    //     .set('Authorization', `Bearer ${tempUserData.token}`)
    //     .send({})
    //     .catch(res => {
    //       expect(res.status).toEqual(400);
    //     });
    // });
    it('should respond with a 401 if no token provided', () => {
      return superagent
        .put(`${API_URL}/api/events/${tempUserData.event._id}`)
        .set('Authorization', `Bearer `)
        .send({})
        .catch(res => {
          expect(res.status).toEqual(401);
        });
    });
    it('should respond with a 400 if invalid body', () => {
      return superagent
        .put(`${API_URL}/api/events/${tempUserData.event._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({ title: '' })
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(400);
        });
    });
    it('should respond with status 404 for event.id not found', () => {
      return superagent
        .put(`${API_URL}/api/events/not-an-id`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .send({})
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
    it('should respond with status 401 for user not found', () => {
      //unreturned promise below is intentional to spoof 'no user found' without triggering 'no token'.
      superagent
        .put(`${API_URL}/api/events/${tempUserData.event._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(401);
          expect(err.message).toEqual('unauthorized no user found');
        });
    });
  });
  describe('Testing DELETE /api/events', () => {
    it('should delete a event and respond with a 204 status', () => {
      return superagent
        .delete(`${API_URL}/api/events/${tempUserData.event._id}`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(204);
        });
    });
    it('should respond with a 401 because user cannot delete another users event', () => {
      return mockUser
        .createOne()
        .then(userData => {
          return userData;
        })
        .then(userData => {
          let deleteTestUserData = userData;
          return superagent
            .delete(`${API_URL}/api/events/${tempUserData.event._id}`)
            .set('Authorization', `Bearer ${deleteTestUserData.token}`)
            .then(res => {
              throw res;
            })
            .catch(res => {
              expect(res.status).toEqual(401);
            });
        });
    });
    it('should respond with status 404 for event.id not found', () => {
      return superagent
        .delete(`${API_URL}/api/events/not-an-id`)
        .set('Authorization', `Bearer ${tempUserData.token}`)
        .catch(res => {
          expect(res.status).toEqual(404);
        });
    });
  });
});
