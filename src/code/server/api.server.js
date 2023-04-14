
'use strict';

const register = require('react-server-dom-webpack/node-register');
register();
const babelRegister = require('@babel/register');

babelRegister({
  ignore: [/[\\\/](build|server|node_modules)[\\\/]/],
  presets: [['react-app', { runtime: 'automatic' }]],
  plugins: ['@babel/transform-modules-commonjs'],
});

const express = require('express');
const compress = require('compression');
const superagent = require('superagent');
const { readFileSync } = require('fs');
const { renderToPipeableStream } = require('react-server-dom-webpack/writer');
const path = require('path');

const React = require('react');
// const ReactApp = require('../src/App.server').default;

const ReactAppContent = require('../src/Content.server').default;


const PORT = process.env.PORT || 4000;
const proxyUrl = process.env.proxyUrl || '';

const app = express();
function handleErrors(fn) {
  return async function (req, res, next) {
    try {
      return await fn(req, res);
    } catch (x) {
      next(x);
    }
  };
}

async function renderReactTree(res, props) {
  await waitForWebpack();
  const manifest = readFileSync(
    path.resolve(__dirname, '../build/react-client-manifest.json'),
    'utf8'
  );
  const moduleMap = JSON.parse(manifest);
  const { pipe } = renderToPipeableStream(
    React.createElement(ReactAppContent, props),
    moduleMap
  );
  pipe(res);
}

function sendResponse(req, res, redirectToId) {
  const location = JSON.parse(req.query.location);
  if (redirectToId) {
    location.selectedId = redirectToId;
  }
  res.set('X-Location', JSON.stringify(location));
  renderReactTree(res, {
    selectedId: location.selectedId,
    isEditing: location.isEditing,
    searchText: location.searchText,
    proxyUrl
  });
}

async function waitForWebpack() {
  while (true) {
    try {
      readFileSync(path.resolve(__dirname, '../build/index.html'));
      return;
    } catch (err) {
      console.log(
        'Could not find webpack build output. Will retry in a second...'
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}


app.use(compress());
app.use(express.json());
app.use('/internal', (req, res) => {
  const originalUrl = req.originalUrl;
  const url = proxyUrl + originalUrl;
  const method = req.method;
  const headers = req.headers;
  const query = req.query;
  const body = req.body;
  delete headers.host;
  delete headers.origin;
  superagent(method, url)
    .set(headers)
    .query(query)
    .send(body)
    .timeout(50000)
    .end((err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response.body);
      }
    });

});
app.use('/assets', (req, res) => {
  // const url = proxyUrl + req.originalUrl;
  // res.redirect(url);
  const originUrl = req.originalUrl;
  const url = proxyUrl + originUrl;
  const method = req.method;
  const headers = req.headers;

  const query = req.query;
  const body = req.body;
  delete headers.host;
  delete headers.origin;
  superagent(method, url)
    .set(headers)
    // .query(query)
    // .send(body)
    .timeout(50000)
    .end((err, response) => {
      if (err) {
        res.status(500).send(err);
      } else {
       
        if(response._body) {
          res.set({
            'Content-Type': 'application/javascript; charset=utf-8',
          });
          res.send(response._body);
        } else if(response.text) {
          res.set({
            'Content-Type': `${response.type}; charset=${response.charset || 'utf-8'}`,
          });
          res.send(response.text);
        } else {
          res.send(response.body)
        }
        
      }
    });
});
app.use(express.static('build'));
app.use(express.static('public'));

app.use((req, res, next) => {
  const originalUrl = req.originalUrl;
  const path = req.path;
  if (path === '/' || path === '/react' || path === '/proxyUrl' || path === '/assets' || path === '/internal') {
    next();
  } else {

    const url = proxyUrl + originalUrl;
    const method = req.method;
    const headers = req.headers;

    const query = req.query;
    const body = req.body;
    delete headers.host;
    delete headers.origin;
    superagent(method, url)
      .set(headers)
      .query(query)
      .send(body)
      .timeout(50000)
      .end((err, response) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(response.body);
        }
      });
  }
});

app.get(
  '/proxyUrl',
  (req, res) => {
    res.json({
      proxyUrl
    })
  }
);

app.get(
  '/',
  handleErrors(async function (_req, res) {
    await waitForWebpack();
    const html = readFileSync(
      path.resolve(__dirname, '../build/index.html'),
      'utf8'
    );
    res.send(html);
  })
);


app.get('/react', function (req, res) {
  sendResponse(req, res, null);
});


app
  .listen(PORT, () => {
    console.log(`React Notes listening at ${PORT}...`);
  })
  .on('error', function (error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const isPipe = (portOrPipe) => Number.isNaN(portOrPipe);
    const bind = isPipe(PORT) ? 'Pipe ' + PORT : 'Port ' + PORT;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });