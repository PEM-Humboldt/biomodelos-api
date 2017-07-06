/* eslint-env mocha */

require('babel-register');
const test = require('assert');
const mongo = require('./index');
const {
  config,
  dbSettings,
  dbSettingsNative
} = require('../../config/application-config');

describe('MongoDB Connection', () => {
  it('Should connect with MongoDB database', done => {
    mongo.connect(config, dbSettings).then(db => {
      test.notEqual(null, db);
      mongo.disconnect().then(() => {
        done();
      });
    });
  });

  it('MongoDB Biomodels index is not empty', done => {
    mongo.connectNativeDriver(config, dbSettingsNative).then(db => {
      db.listCollections().toArray((err, item) => {
        test.ok(item.length > 0);
        done();
      });
    });
  });

  it('MongoDB Biomodels database must have 3 collections', done => {
    mongo.connectNativeDriver(config, dbSettingsNative).then(db => {
      db.listCollections().toArray((err, item) => {
        test.equal(null, err);
        test.equal(3, item.length);
        db.close();
        done();
      });
    });
  });
});
