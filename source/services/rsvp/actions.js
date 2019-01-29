import { fetchRsvpData } from 'services/api/rsvp';

export const RSVP_REQUEST = 'RSVP_REQUEST';
export const RSVP_RESPONSE = 'RSVP_RESPONSE';
export const TOUCH_DATA = 'TOUCH_DATA';
export const INVALIDATE_DATA = 'INVALIDATE_DATA';

function requestRsvp() {
  return {
    type: RSVP_REQUEST,
  };
}

function receiveRsvp(data) {
  return {
    type: RSVP_RESPONSE,
    data,
  };
}

export function getRsvpData() {
  return dispatch => {
    dispatch(requestRsvp());
    fetchRsvpData()
      .then(data => dispatch(receiveRsvp(data)))
      .catch(() => dispatch(receiveRsvp(null)));
  };
}

export function touchData() {
  return {
    type: TOUCH_DATA,
  };
}

export function invalidateData() {
  return {
    type: INVALIDATE_DATA,
  };
}
