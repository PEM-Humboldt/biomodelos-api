import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import { logger } from '../log';
// import { promisify } from 'util';

// Schema for all the collections
import RecordSchema from './models/record';
import SpecieSchema from './models/specie';
import ModelSchema from './models/model';

// Create mongoose database models
const RecordModel = mongoose.model('Record', RecordSchema, 'records'); // general schemaModel for records.records collection
const SpecieModel = mongoose.model('Specie', SpecieSchema, 'species'); // general schemaModel for records.species collection
const Model = mongoose.model('Model', ModelSchema, 'models'); // general schemaModel for records.models collection

let connectionDB;
let connectionDBNative;

const getMongoURL = config => {
  const url = config
    .get('database.mongodb.servers')
    .reduce(
      (prev, cur) => `${prev}${cur},`,
      `mongodb://${encodeURIComponent(
        config.get('database.mongodb.user')
      )}:${encodeURIComponent(config.get('database.mongodb.pass'))}@`
    );

  return `${url.substr(0, url.length - 1)}/${config.get(
    'database.mongodb.db'
  )}?authMechanism=${config.get('database.mongodb.authMechanism')}`;
};

export const models = {
  Record: RecordModel,
  Reported: RecordModel,
  Updated: RecordModel,
  Created: RecordModel,
  Specie: SpecieModel,
  Model
};

/**
 * Returns a promise of a `db` object. Subsequent calls to this function returns
 * the **same** promise, so it can be called any number of times without setting
 * up a new connection every time.
 */
export const connect = async (config, dboptions) => {
  if (!connectionDB) {
    mongoose.Promise = global.Promise;
    try {
      connectionDB = await mongoose.connect(getMongoURL(config), {
        user: config.get('database.mongodb.user'),
        pass: config.get('database.mongodb.pass'),
        auth: config.get('database.mongodb.authMechanism'),
        db: dboptions.dbParameters(),
        server: dboptions.serverParameters(),
        replset: dboptions.replsetParameters()
      });
      logger.info('Successful connection with MongoDB Database');
      connectionDB = true;
    } catch (error) {
      logger.error(`Error connecting with MongoDB database: ${error}`);
      logger.error(error);
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
      logger.info('Successful connection with MongoDB Database');
    } catch (error) {
      logger.error(`Error connecting with MongoDB database: ${error}`);
      logger.error(error);
      throw new Error('Error connecting with MongoDB database');
    }
  }
  return connectionDBNative;
};

export const disconnect = async () => {
  try {
    await mongoose.disconnect();
    logger.info('Successful disconnection from MongoDB Database');
  } catch (error) {
    logger.info(`Database disconnection error: ${error}`);
  }
};
