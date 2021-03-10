import express from 'express';
import fetch from 'node-fetch';
import { timerStart, timerEnd } from './time.js';
import { getFromCache, writeToCache } from './cache.js';

export const router = express.Router();

const returnEarthquake = async (type, period) => {
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
  const data = await fetch(URL);
  return data;
};

router.get('/', async (req, res) => {
  const start = timerStart();
  const { period, type } = req.query;
  const key = `${period}:${type}`;
  const cachedData = await getFromCache(key);
  if (cachedData) {
    const cData = JSON.parse(cachedData);
    cData.info = {
      elapsed: timerEnd(start),
      cached: true,
    };
    res.json(cData);
    return;
  }
  returnEarthquake(type, period).then((resp) => {
    if (resp.status !== 200) {
      res.json({ error: 'Unable to connect to server' });
    }
    return resp.json();
  }).then(async (data) => {
    const newdata = data;
    newdata.info = {
      elapsed: timerEnd(start),
      cached: false,
    };
    const JsonData = JSON.stringify(newdata);
    await writeToCache(key, JsonData);
    res.json(newdata);
  });
});
