'use strict';

const path = require('path');

require('dotenv').config({ path: `${__dirname}/../.test.env` });

const expect = require('expect');
const superagent = require('superagent');

const server = require('../lib/server.js');

const API_URL = process.env.API_URL;

describe('testing server', () => {
  after(server.stop);
  describe('Testing Server', () => {
    it('should return 404 for non-existent route', () => {
      server.start();
      return superagent
        .get(`${API_URL}/api/not-a-route`)
        .then(res => {
          throw res;
        })
        .catch(res => {
          expect(res.status).toEqual(404);
          server.stop();
        });
    });
    it('should throw an error if server already DOWN', () => {
      server.isOn = false;
      return server.stop().catch(err => {
        expect(err).toEqual('Error: server is not running');
      });
    });
    it('should throw an error if server already on', () => {
      server.isOn = true;
      return server.start().catch(err => {
        expect(err).toEqual('Error: server is already running');
      });
    });
  });
});

describe('testing error-handler 500 response', () => {
  before(server.start);
  after(server.stop);
  describe('Testing Error-Handler', () => {
    it('should return 500 for server error', done => {
      superagent.get(`${API_URL}/api/500test`).end((err, res) => {
        expect(res.status).toEqual(500);
        done();
      });
    });
  });
});
