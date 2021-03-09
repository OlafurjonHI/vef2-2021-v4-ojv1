import express from 'express';
import fetch from 'node-fetch';

export const router = express.Router();

const returnEarthquake = async (type, period) => {
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${type}_${period}.geojson`;
  const data = await fetch(URL);
  return data;
};

router.get('/', async (req, res) => {
  const { period, type } = req.query;
  returnEarthquake(type, period).then((resp) => {
    if (resp.status !== 200) {
      res.json({ error: 'Unable to connect to server' });
    }
    return resp.json();
  }).then((data) => {
    res.json(data);
  });
});
