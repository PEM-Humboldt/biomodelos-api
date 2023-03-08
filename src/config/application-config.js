// App configuration
import convict from 'convict';
import convict_format_with_validator from 'convict-format-with-validator';
import json5 from 'json5';
import util from 'util';
import path from 'path';

const debug = require('debug')('biomodels-api:configuration');

export const apiDefinition = {
  swagger: '2.0',
  info: {
    // API informations (required)
    title: 'Biomodelos API', // Title (required)
    version: '1.6.0', // Version (required)
    description: 'Biomodelos API', // Description (optional)
    termsOfService: 'http://betabiomodelos.humboldt.org.co/home/terms',
    license: {
      name: 'MIT'
    },
    contact: {
      name: 'Equipo Biomodelos',
      url: 'http://biomodelos.humboldt.org.co/home/contact_us',
      email: 'biomodelos@humboldt.org.co'
    }
  },
  // format of bodies a client can send (Content-Type)
  consumes: ['application/json'],
  // format of the responses to the client (Accepts)
  produces: ['application/json'],
  schemes: ['http', 'https'],
  securityDefinitions: {
    api_key: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header'
    },
    biomodelapi_auth: {
      type: 'oauth2',
      authorizationUrl: 'http://swagger.io/api/oauth/dialog',
      flow: 'accessCode',
      scopes: {
        'write:model': 'modify models in your account',
        'read:model': 'read models'
      },
      tokenUrl: 'token data'
    }
  }
};

export const dbSettingsNative = {
  poolSize: 10,
  autoReconnect: true,
  keepAlive: 300,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  ha: true,
  haInterval: 10000,
  replicaSet: null,
  connectWithNoPrimary: true,
  w: 'majority',
  wtimeout: 10000,
  j: true,
  readPreference: 'ReadPreference.SECONDARY_PREFERRED'
};

export const dbSettings = {
  dbParameters: () => ({
    w: 'majority',
    wtimeout: 10000,
    j: true,
    readPreference: 'ReadPreference.SECONDARY_PREFERRED',
    native_parser: false
  }),
  serverParameters: () => ({
    autoReconnect: true,
    poolSize: 10,
    socketoptions: {
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  }),
  replsetParameters: (replset = 'rs1') => ({
    replicaSet: replset,
    ha: true,
    haInterval: 10000,
    poolSize: 10,
    socketoptions: {
      keepAlive: 300,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000
    }
  })
};

convict.addFormats(convict_format_with_validator);
convict.addParser({ extension: 'json', parse: json5.parse });

export const config = convict({
  appRoot: {
    doc: 'Application root folder.',
    default: path.normalize(`${__dirname}/../../`) // App path root
  },
  appSrc: {
    doc: 'Application src folder.',
    default: path.normalize(`${__dirname}/../`) // App src path
  },
  env: {
    doc: 'Application environment.',
    format: ['production', 'development'],
    default: 'development',
    env: 'NODE_ENV'
  },
  service: {
    name: {
      doc: 'The name of your service/platform.',
      format: String,
      default: 'Biomodel API Services',
      env: 'SERVICE_NAME'
    }
  },
  logs: {
    location: {
      doc: 'Log save location',
      format: String,
      default: 'logs/dataportal-api.log',
      env: 'LOG'
    },
    level: {
      doc: 'Level of log display',
      format: String,
      default: 'info',
      env: 'LOGLEVEL'
    },
    http: {
      doc: 'HTTP request log.',
      format: Boolean,
      default: true
    }
  },
  server: {
    port: {
      doc: 'The server port to bind.',
      format: 'port',
      default: 3000,
      env: 'BIOMODELS_API_PORT'
    },
    hostname: {
      doc: 'Server hostname address.',
      format: 'ipaddress',
      default: '127.0.0.1',
      env: 'BIOMODELS_API_IP'
    }
  },
  livereload: {
    enabled: {
      doc: 'Livereload run status.',
      format: Boolean,
      default: false
    },
    server: {
      doc: 'Livereload run status.',
      default: 'localhost'
    },
    port: {
      doc: 'Livereload server port to bind.',
      format: 'port',
      default: 35729
    }
  },
  swagger: {
    // paths 404
    enabled: {
      doc: 'Enable OpenAPI Swagger specification.',
      format: Boolean,
      default: true
    }
  },
  router: {
    ignore: {
      doc: 'Route folder to be ignore from folder parsing.',
      format: Array,
      default: []
    },
    path: {
      // paths 404
      doc: 'Paths 404.',
      format: String,
      default: '/:url(api|assets|lib|bower_components)/*'
    }
  },
  database: {
    mongodb: {
      db: {
        doc: 'MongoDB Database of Biomodels',
        format: String,
        default: 'produccion',
        env: 'BIOMODELS_DB'
      },
      user: {
        doc: 'MongoDB Biomodels DB Username',
        format: String,
        default: 'biomodels',
        env: 'BIOMODELS_DB_USER'
      },
      pass: {
        doc: 'MongoDB Biomodels DB password',
        format: String,
        default: 'biomodels_password2017',
        env: 'BIOMODELS_DB_PASS'
      },
      repl: {
        doc: 'MongoDB Replicaset name',
        format: String,
        default: 'rs1',
        env: 'BIOMODELS_DB_REPLS'
      },
      authMechanism: {
        doc: 'MongoDB authentication mecanism',
        format: String,
        default: 'SCRAM-SHA-1'
      },
      servers: {
        doc: 'MongoDB Replicaset name',
        default: process.env.BIOMODELS_DB_SERVERS
          ? process.env.BIOMODELS_DB_SERVERS.split(' ')
          : ['localhost:27017'],
        env: 'BIOMODELS_DB_SERVERS'
      }
    }
  }
})
  .loadFile(path.join(__dirname, 'config.json'))
  .validate();

// print the environment for debugging
debug(
  util.inspect(process.env, {
    colors: true
  })
);

// perform the config validation
config.validate();

debug('Configuration file loaded successfully.');
