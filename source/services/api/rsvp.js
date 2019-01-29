import * as selectOptions from 'scenes/Rsvp/components/Form/Panes/selectOptions';
import store from '../store';

const rsvpRoute = `${process.env.API_ENDPOINT}/rsvp`;

// Read frontend data from form state, serialize to be compatible with api spec
const serialize = data => {
  const serialized = {};
  serialized.isAttending = data.isAttending;
  serialized.phone = data.phone;
  serialized.diet = data.diet;
  serialized.transportation = selectOptions.transportation[data.transportation].value;
  serialized.programmingExperience = {
    python: data.python,
    javascript: data.javascript,
    java: data.java,
    'cc++': data.c,
    go: data.go,
    ruby: data.ruby,
    rust: data.rust,
  };
  serialized.techInterests = new Array(6);
  serialized.techInterests[selectOptions.range[data.dataScience] - 1] = 'DATASCIENCE';
  serialized.techInterests[selectOptions.range[data.webDev] - 1] = 'WEBDEV';
  serialized.techInterests[selectOptions.range[data.systems] - 1] = 'SYSTEMS';
  serialized.techInterests[selectOptions.range[data.appDev] - 1] = 'APPDEV';
  serialized.techInterests[selectOptions.range[data.hardware] - 1] = 'HARDWARE';
  serialized.techInterests[selectOptions.range[data.devTools] - 1] = 'DEVTOOLS';
  serialized.osProject = data.osProject;

  return serialized;
};

const findIndex = (data, field, comparisonField) => {
  for (let i = 0; i < selectOptions[field].length; i += 1) {
    if (selectOptions[field][i][comparisonField] === data) {
      return i;
    }
  }
  return -1;
};

const deserialize = data => {
  // Takes data from the backend and formats it for the frontend components
  const res = {};
  res.isAttending = data.isAttending;
  res.phone = data.phone;
  res.diet = data.diet;
  res.transportation = findIndex(data.transportation, 'transportation', 'value');
  res.python = data.programmingExperience.python;
  res.javascript = data.programmingExperience.javascript;
  res.java = data.programmingExperience.java;
  res.c = data.programmingExperience['cc++'];
  res.go = data.programmingExperience.go;
  res.ruby = data.programmingExperience.ruby;
  res.rust = data.programmingExperience.rust;
  res.dataScience = data.techInterests.indexOf('DATASCIENCE') + 1;
  res.webDev = data.techInterests.indexOf('WEBDEV') + 1;
  res.systems = data.techInterests.indexOf('SYSTEMS') + 1;
  res.appDev = data.techInterests.indexOf('APPDEV') + 1;
  res.hardware = data.techInterests.indexOf('HARDWARE') + 1;
  res.devTools = data.techInterests.indexOf('DEVTOOLS') + 1;
  res.osProject = data.osProject;
  return res;
};

export default function rsvp(data) {
  const serializedData = serialize(data);
  const method = store.getState().rsvp.data === null ? 'POST' : 'PUT';
  return fetch(`${rsvpRoute}/`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: store.getState().auth.jwt,
    },
    body: JSON.stringify(serializedData),
  }).then(response => {
    if (response.status >= 400) {
      throw new Error(response);
    }
    return response.json();
  });
}

// For prepoluating form when a prior registration exists
export function fetchRsvpData() {
  return fetch(`${rsvpRoute}/`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: store.getState().auth.jwt,
    },
  })
    .then(response => {
      if (response.status >= 400) {
        throw new Error(response);
      }
      return response.json();
    })
    .then(data => deserialize(data));
}
