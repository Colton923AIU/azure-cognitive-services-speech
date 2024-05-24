const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const { timeStamp } = require('console');
const utils = require('./utils');

// fn to create express server
const create = async () => {
  // server
  const app = express();
  app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));

  // Log request
  app.use(utils.appLogger);

  // creates a temp file on server, the streams to client
  /* eslint-disable no-unused-vars */
  app.get('/text-to-speech', async (req, res, next) => {
    const { key, region, phrase, file } = req.query;

    if (!key || !region || !phrase)
      res.status(404).send('Invalid query string');

    let fileName = null;

    // stream from file or memory
    if (file && file === true) {
      fileName = `./temp/stream-from-file-${timeStamp()}.mp3`;
    }

    // const audioStream = await textToSpeech(key, region, phrase, fileName);

    // Create an audio element
    // res.src = URL.createObjectURL(audioStream);
    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    });
  });

  app.get('/speech-to-text', async (req, res, next) => {
    const { key, region, file } = req.query;
    if (!key || !region) res.status(404).send('Invalid query string');

    let fileName = null;

    if (file && file === true) {
      fileName = `./temp/stt-${timeStamp()}.txt`;
    }

    res.set({
      'Content-Type': 'text/plain',
    });
  });

  // root route - serve static file
  app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '../public/client.html'))
  );

  app.get('/test', (req, res) =>
    res.sendFile(path.join(__dirname, '../public/test.html'))
  );

  // Catch errors
  app.use(utils.logErrors);
  app.use(utils.clientError404Handler);
  app.use(utils.clientError500Handler);
  app.use(utils.errorHandler);

  return app;
};

module.exports = {
  create,
};
