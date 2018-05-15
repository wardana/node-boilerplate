console.time('StartServer');
console.time('requireLib');
import express from 'express';
import Pipa from 'pipa';
import bodyParser from 'body-parser';
import expressLogger from 'express-request-logger';
import Winston from 'winston';
import cors from 'cors';
import Settings from 'settings';
import constant from './config/constant.js';
import ejs from 'ejs';
console.timeEnd('requireLib');

const config = new Settings(`${__dirname}/config/config`);
const app = express();

console.time("configLogger");
const log = new (Winston.Logger)({
  transports: [
    new (Winston.transports.Console)({ colorize: true, level: 'debug' }),
    new (Winston.transports.File)({ filename: `${__dirname}/logs/apps.log`, handleExceptions: true, colorize: true })
  ],
  exceptionHandlers: [
    new (Winston.transports.Console)({ colorize: true, level: 'warn' }),
    new (Winston.transports.File)({ filename: `${__dirname}/logs/exceptions.log`, handleExceptions: true, colorize: true })
  ]
});

app.use((req, res, next) => { 
  req.log = log;
  next();
 })

console.timeEnd("configLogger");


const corsOpts = {
  origin(origin, callback) {
    const originIsWhitelisted = constant.originWhitelist.includes(origin);
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted)
  }
};
app.use(cors());

// if (constant.isEnableCors)
//   app.use(cors(corsOpts));
// else
//   app.use(cors());

console.time("configViewEngine")

app.engine('html', ejs.renderFile);
app.set('views', `${__dirname}/views`)
app.set('view engine', 'html')
app.use('/assets', express.static(`${__dirname}/views/assets`))
console.timeEnd("configViewEngine")


console.time("configRouter")
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ extended: true, limit: '50mb' }));
app.use(expressLogger.create(log))
app.disable('x-powered-by')

let pipa = new Pipa(app, 'routes', 'middlewares')
// Open pipa
pipa.open();

console.timeEnd("configRouter");

app.listen(config.port);

console.timeEnd('StartServer');
log.debug('---------------------------------------');
log.debug('  APPLICATION STARTED AT PORT: ' + config.port);
log.debug('---------------------------------------');