import store from '../store';

const decisionRoute = `${process.env.API_ENDPOINT}/decision`;

export default function getDecision() {
  return fetch(`${decisionRoute}/`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: store.getState().auth.jwt,
    },
  }).then(response => {
    if (response.status >= 400) {
      throw new Error(response);
    }
    return response.json();
  });
}
