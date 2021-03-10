import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import dotenv from 'dotenv';

import { router as proxyRouter } from './proxy.js';

dotenv.config();

const {
  PORT: port = 3001, // Mun verða proxyað af browser-sync í development
} = process.env;

const app = express();
const path = dirname(fileURLToPath(import.meta.url));

app.use(express.static(join(path, '../public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'html');
// TODO setja upp proxy þjónustu
// TODO birta index.html skjal

/**
 * Middleware sem sér um 404 villur.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 */
// eslint-disable-next-line no-unused-vars
function notFoundHandler(req, res, next) {
  res.status(404).send('Síða fannst ekki');
  next();
}

/**
 * Middleware sem sér um villumeðhöndlun.
 *
 * @param {object} err Villa sem kom upp
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send('Villa kom upp');
  next();
}
const index = (req, res) => {
  const indexUrl = join(path, '../index.html');
  res.sendFile(indexUrl);
};
app.get('/', index);



app.use('/api', proxyRouter);
// Verðum að setja bara *port* svo virki á heroku
app.use(notFoundHandler);
app.use(errorHandler);
app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});
