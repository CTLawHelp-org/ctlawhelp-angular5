import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as express from 'express';
import * as compression from 'compression';
import { join } from 'path';
import { readFileSync } from 'fs';

const domino = require('domino');

// Redis
const RURL = process.env.RURL || '127.0.0.1';
const RDB = process.env.RDB || 0;
const Redis = require('ioredis');
const client = new Redis({
  port: 6379,
  host: RURL,
  db: RDB
});
client.on('error', (error) => {});

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();
app.use(compression());

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

const win = domino.createWindow(template);
global['window'] = win;
Object.defineProperty(win.document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  },
});
global['document'] = win.document;
global['KeyboardEvent'] = win.KeyboardEvent;
global['MouseEvent'] = win.MouseEvent;
global['CSS'] = null;
global['Prism'] = null;

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

/* - Example Express Rest API endpoints -
  app.get('/api/**', (req, res) => { });
*/

app.get('/admin/**', (req, res) => {
  global['navigator'] = req['headers']['user-agent'];
  res.render('index', { req });
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// ALl regular routes use the Universal engine
app.get('*', (req, res) => {
  global['navigator'] = req['headers']['user-agent'];
  const url = req.url;
  client.get(url, function (err, result) {
    if (result) {
      return res.send(result);
    } else {
      res.render('index', { req }, (error, html) => {
        client.set(url, html, 'EX', 864000);
        res.send(html);
      });
    }
  });
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});
