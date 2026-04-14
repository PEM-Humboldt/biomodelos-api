import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const log = require('../../config/log').logger();

let connectionDB;
let connectionDBNative;

const getMongoConfig = config => ({
  user: config.get('database.mongodb.user'),
  pass: config.get('database.mongodb.pass'),
  db: config.get('database.mongodb.db'),
  servers: config.get('database.mongodb.servers'),
  authMechanism: config.get('database.mongodb.authMechanism')
})

const mongoConnectionMessage = config => {
  const mongo = getMongoConfig(config);
  return `${mongo.db} database with user ${mongo.user}`
}

const getMongoURL = config => {
  const mongo = getMongoConfig(config);

  const servers = mongo.servers.join(',');
  const url = `mongodb://${encodeURIComponent(mongo.user)}:${encodeURIComponent(mongo.pass)}@${servers}`;

  return `${url}/${config.get(
    'database.mongodb.db'
  )}?authMechanism=${config.get('database.mongodb.authMechanism')}`;
};

/**
 * Returns a promise of a `db` object. Subsequent calls to this function returns
 * the **same** promise, so it can be called any number of times without setting
 * up a new connection every time.
 */
export const connect = async (config) => {
  if (!connectionDB) {
    // Successfully connected
    mongoose.connection.on('connected', () => {
      log.info(`MongoDB connected on ${getMongoURL(config)}`);
    });

    // Connection throws an error
    mongoose.connection.on('error', err => {
      log.info(`MongoDB was not able to connect to ${mongoConnectionMessage(config)}`);
    });

    // Connection is disconnected
    mongoose.connection.on('disconnected', err => {
      log.info(`MongoDB disconnected from: ${mongoConnectionMessage(config)}`);
    });

    mongoose.Promise = global.Promise;

    try {
      connectionDB = await mongoose.connect(getMongoURL(config));
      log.info('Successful connection with MongoDB Database');
      connectionDB = true;
    } catch (error) {
      log.error(`Error connecting with MongoDB database: ${error}`);
      log.error(error);
      throw new Error('Error connecting with MongoDB database');
    }
  }
  return connectionDB;
};

/**
 * Returns a promise of a `db` object. Subsequent calls to this function returns
 * the **same** promise, so it can be called any number of times without setting
 * up a new connection every time.
 */
export const connectNativeDriver = async (config, dboptions) => {
  if (!connectionDBNative) {
    try {
      connectionDBNative = await MongoClient.connect(
        getMongoURL(config),
        dboptions
      );
      log.info('Successful connection with MongoDB Database');
    } catch (error) {
      log.error(`Error connecting with MongoDB database: ${error}`);
      log.error(error);
      throw new Error('Error connecting with MongoDB database');
    }
  }
  return connectionDBNative;
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    log.info('Successful disconnection from MongoDB Database');
  } catch (error) {
    log.info(`Database disconnection error: ${error}`);
  }
};
