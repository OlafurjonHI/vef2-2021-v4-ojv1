import express from 'express';
import fetch from 'node-fetch';
import { timerStart, timerEnd } from './time.js';
export const router = express.Router();

const returnEarthquake = async (type, period) => {
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
  const data = await fetch(URL);
  return data;
};

router.get('/', async (req, res) => {
  const start = timerStart();
  const { period, type } = req.query;
  returnEarthquake(type, period).then((resp) => {
    if (resp.status !== 200) {
      res.json({ error: 'Unable to connect to server' });
    }
    return resp.json();
  }).then((data) => {
    const end = timerEnd(start);
    const newdata = data;
    newdata.info = {
      elapsed: end,
      cached: false,
    };

    res.json(newdata);
  });
});
