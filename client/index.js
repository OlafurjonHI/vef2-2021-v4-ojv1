import { fetchEarthquakes } from './lib/earthquakes';
import { el, element, formatDate } from './lib/utils';
import { init, createPopup, clearMarkers } from './lib/map';

const createLoader = () => {
  if (!document.querySelector('.loading')) {
    document.querySelector('.title').textContent = '';
    document.querySelector('.cache').textContent = '';
    const ul = document.querySelector('.earthquakes');
    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }
    const container = document.querySelector('.earthquakes');
    const loadingP = el('p', 'Hleð gögnum...');
    loadingP.classList.add('loading');
    container.parentNode.insertBefore(loadingP, container);
  }
};
const updateMap = async (period, type) => {
  createLoader();
  const map = document.querySelector('.map');
  clearMarkers(map);
  const earthquakes = await fetchEarthquakes(type, period);

  // Fjarlægjum loading skilaboð eftir að við höfum sótt gögn
  const loading = document.querySelector('.loading');
  let parent = null;
  if (loading) {
    parent = loading.parentNode;
    parent.removeChild(loading);
  }
  const { elapsed, cached } = earthquakes.info;
  const cachedText = (!cached) ? 'Gögn eru ekki í cache.' : 'Gögn eru í cache';
  document.querySelector('.cache').textContent = `${cachedText} Fyrirspurnin tók ${elapsed} sek.`;
  if (parent && !earthquakes) {
    parent.appendChild(
      el('p', 'Villa við að sækja gögn'),
    );
  }

  const ul = document.querySelector('.earthquakes');
  if (earthquakes.features.length === 0) {
    ul.appendChild(el('li', 'Enginn'));
    return;
  }
  earthquakes.features.forEach((quake) => {
    const {
      title, mag, time, url,
    } = quake.properties;

    const link = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent = el('div',
      el('h3', title),
      el('p', formatDate(time)),
      el('p', link));
    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup();
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', title),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString())),
        element('div', { class: 'buttons' }, null,
          element('button', null, { click: onClick }, 'Sjá á korti'),
          link)),
    );

    ul.appendChild(li);
  });
};
const earthQuakeClickHandler = async (e) => {
  e.preventDefault();
  const href = e.target.getAttribute('href');
  const urlparam = new URLSearchParams(href);
  // const period = urlparam.get('period');
  const time = e.target.parentNode.parentNode.parentNode.querySelector('h2').textContent;
  const period = href.split('?period=')[1].split('&')[0];
  const type = urlparam.get('type');
  await updateMap(period, type);
  const textTitle = `${e.target.textContent},${time.toLowerCase()}`;
  document.querySelector('.title').textContent = textTitle;
};

document.addEventListener('DOMContentLoaded', async () => {
  const eartquakesLinks = document.querySelectorAll('.earthquakeLink');
  eartquakesLinks.forEach((b) => b.addEventListener('click', earthQuakeClickHandler));
  const map = document.querySelector('.map');

  init(map);
});
