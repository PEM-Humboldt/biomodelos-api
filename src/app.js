import http from 'http';
import express from 'express';
import util from 'util';
import { dbSettings, apiDefinition, config } from './config/application-config';
import swaggerConfig from './server/openapi';
import { connect as dbConnect } from './server/database';

const debug = require('debug')('biomodel-api-server:initialization');
const log = require('./config/log').logger();

// catch all error without handler
process.on('uncaughtException', error => {
  log.error(
    `Caught exception without specific handler: ${util.inspect(error)}`
  );
  log.error(error.stack, 'error');
  debug(`Caught exception without specific handler: ${util.inspect(error)}`);
  debug(error.stack, 'error');
  process.exit(1);
});

process.on('uncaughtRejection', error => {
  log.error(
    `Caught rejection without specific handler: ${util.inspect(error)}`
  );
  log.error(error.stack, 'error');
  debug(`Caught rejection without specific handler: ${util.inspect(error)}`);
  debug(error.stack, 'error');
  process.exit(1);
});

log.info('Starting --- BIOMODELOS API - SERVICE ---');
const app = express();

// Load all middleware
require('./server/middleware').default(app);

// Load OpenAPI specification and configuration
swaggerConfig(app, apiDefinition);

// Load router
require('./server/router').default(app);

// Create HTTP server.
const server = http.createServer(app);

(async () => {
  try {
    log.info('Connecting with Biomodelos Database');
    await dbConnect(config, dbSettings);
    // Start https server in listening mode
    server.listen(
      config.get('server.port'),
      config.get('server.hostname'),
      undefined,
      () => {
        process.env.NODE_ENV = config.get('env');
        log.info(
          '\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@@@@@@@@@@@@@@@GLt11tL0@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@@@@@@@@@@@@@G1:,,,,,,:L@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@@@@@@88888C1:,,,,,,,,,:f@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@@@@@88880f;:::,:::::,,,:L@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@@@@8@@@01:::::::::::::,,;0@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@@@8@@8Gi:::::::::,,,,::,,1@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@@8@@80i,,,::::::::,,::,,,:G@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@80@88G;,,,:::::::::::,,,:,t@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@808800C1::::::::::::,,,,::;8@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@88@@8880Li:::::::::::,,,,::0@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@0008@@@@@0t:::::::::::,,,::G@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@0L1i;;i1tfLGGL:::,,,,::::,,::C@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@0t;,,:::,,,,,::;:,,,,,,,:::,:::fG@8888888888888888888888888888888888888888888888888888888888888888888888888@@\n\
@@@C;,,,,,:::::,,,,::::::,,,,:::::;LL@8GCCCG0@@8LG@@@@@@@@@GC8@@@@@8CG@@@@@@@@@@@@@0L0@@@@@@@@0L8@@@@@@@@@@@@@@@@\n\
@@f::::::::::::::::::::,::,,,::::,1GG@0;;LLf;t@01C@@@888@@@1:i0@@@0i:1@@@888@@@@@88L,C@@@88@@@f:G@@@888@@@@888@@@\n\
@0;:::::::::::::::::::::,,::,,::::tC8@0:iGGL;f@0iL@Gttftt0@1;1iG@0i1;i@0ttft1G@G1tf1:C@L1ff1C@f:G@L1ff1f8G1tff8@@\n\
@L:,,:::::::::::::::::::::,::,,::11G@@0:;LLfit8G:f8;i8@0:1@1i8t;Lit8ii@1:0@8i;0;i8@L:CG:iLL118f:GG:f@@L,LCi1fC8@@\n\
@t,,,,,::::::::::::::::::::::::::;t0@@0:;GGCi;8G,f81;G0L:f@ii88f;f8@ii@f:L0G;10i;G0t,C0;iCGCG@f:G0;100t:G0CC1:G@@\n\
@t,::::::::::,,,::::::::::::::::iL@@@@8fffffC0@0fG@8CfffG@@LL@@@8@@@LL@@GfffC8@0ffLCf0@0LffLG@Gf0@0LffL0@0LLLC8@@\n\
@0i::::::::,,::::,,,,::::::::;1L8@@@@@8888888888888888888888888888888888888888888888888888888888888888888888888@@\n\
@@L::::::,,,::::::::::;i::;1fG8@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@8Ci::::,,::;;i1tLCGGCt1L08@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@GL1iitfCG0088@@8CttC8@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@80088@@88888CttC8@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@888@8088888C08@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\
@@@@@@@@@@@88@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@'
        );
        log.info(
          `Server listening on http://${config.get(
            'server.hostname'
          )}:${config.get('server.port')} in mode ${config.get('env')}`
        );
      }
    );
  } catch (error) {
    log.error('Error initializing Biomodelos API');
  }
})();
