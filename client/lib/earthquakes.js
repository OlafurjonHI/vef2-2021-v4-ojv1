export async function fetchEarthquakes(type = 'significant', period = 'week') {
  const URL = `/api?period=${period}&type=${type}`;
  let result;
  try {
    result = await fetch(URL);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();
  return data;
}
