// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Loader from 'scenes/Loader';
import { getGithubOAuthURL } from 'services/api/auth';
import { getRsvpData, touchData } from 'services/rsvp/actions';
import FormContext from './FormContext';
import SideBar from './components/SideBar';
import ScrollableForm from './components/Form';
import { required, validatePane } from './components/Form/check';
import { checkUnique } from './Form/inputValidators';
import './styles.scss';

import type { RegistrationData } from './FormContext';

type Props = {
  jwt: ?string,
  regValid: boolean,
  regData: ?Object,
  checkRsvp: () => void,
  touchData: () => void,
};

type State = {
  pane: number,
  data: RegistrationData,
  errors: { [string]: boolean },
};

const INITIAL_REGISTRATION_STATE = {
  isAttending: -1,
  phone: '',
  diet: [],
  transportation: -1,
  python: 0,
  javascript: 0,
  java: 0,
  c: 0,
  go: 0,
  ruby: 0,
  rust: 0,
  dataScience: -1,
  webDev: -2,
  systems: -3,
  appDev: -4,
  hardware: -5,
  devTools: -6,
  openSource: '',
};

class Registration extends Component<Props, State> {
  constructor() {
    super();

    this.state = {
      pane: 0,
      data: INITIAL_REGISTRATION_STATE,
      errors: {},
    };

    this.initializeState = this.initializeState.bind(this);
    this.setPane = this.setPane.bind(this);
    this.registerField = this.registerField.bind(this);
  }

  componentDidMount() {
    const { regValid, regData, checkRsvp, jwt } = this.props;
    if (jwt) {
      if (regValid) {
        this.initializeState(regData);
      } else {
        checkRsvp();
      }
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Check for registration request to go from invalid to valid
    const { regValid, regData } = this.props;
    if (!prevProps.regValid && regValid) {
      this.initializeState(regData);
    }
  }

  // Handles changing of panes. Only allows changes if all required
  // fields are filled, and there are no errors so far
  setPane: number => void;
  setPane(newPane: number) {
    this.setState(prevState => {
      const { data, pane, errors } = prevState;
      const missing = required(pane, data);
      if (missing.length === 0 && validatePane(pane, errors)) {
        return { pane: newPane };
      }

      const e = {};
      missing.forEach(field => {
        e[field] = true;
      });
      return { errors: Object.assign({}, errors, e) };
    });
  }

  initializeState: (?Object) => void;
  initializeState(regData) {
    if (regData !== null) {
      this.setState({
        data: regData,
      });
    }
  }

  registerField: (string, ?(string) => boolean) => string => void;
  registerField(field: string, validator?: string => boolean, isTechInterest?: boolean) {
    /* eslint-disable react/destructuring-assignment */
    // Resume uploads separately from rest of data, so we will track
    // what has and has not been updated, and only call the necessary
    // routes
    const dirtyFn = this.props.touchData;
    /* eslint-enable react/destructuring-assignment */

    // This function has closure over the field, validator function,
    // and the dirty function.
    // Bascially modifies the appropriate key in local state with the
    // value passed. Optional validator function can be used to
    // validate the input value.
    return (value: string) => {
      const { data } = this.state;
      if (!(field in data)) {
        throw new Error(`${field} missing from Form state`);
      }
      dirtyFn();
      this.setState(prevState => {
        const d = {};
        d[field] = value;
        const e = {};
        if (validator === undefined) {
          e[field] = false;
        } else {
          e[field] = !validator(value);
        }
        if (isTechInterest) {
          switch (field) {
            case 'dataScience':
              e[field] = !checkUnique(prevState.data.dataScience, [
                prevState.data.webDev,
                prevState.data.systems,
                prevState.data.appDev,
                prevState.data.hardware,
                prevState.data.devTools,
              ]);
              break;
            case 'webDev':
              e[field] = !checkUnique(prevState.data.webDev, [
                prevState.data.dataScience,
                prevState.data.systems,
                prevState.data.appDev,
                prevState.data.hardware,
                prevState.data.devTools,
              ]);
              break;
            case 'systems':
              e[field] = !checkUnique(prevState.data.systems, [
                prevState.data.dataScience,
                prevState.data.webDev,
                prevState.data.appDev,
                prevState.data.hardware,
                prevState.data.devTools,
              ]);
              break;
            case 'appDev':
              e[field] = !checkUnique(prevState.data.appDev, [
                prevState.data.dataScience,
                prevState.data.webDev,
                prevState.data.systems,
                prevState.data.hardware,
                prevState.data.devTools,
              ]);
              break;
            case 'hardware':
              e[field] = !checkUnique(prevState.data.hardware, [
                prevState.data.dataScience,
                prevState.data.webDev,
                prevState.data.systems,
                prevState.data.appDev,
                prevState.data.devTools,
              ]);
              break;
            case 'devTools':
              e[field] = !checkUnique(prevState.data.devTools, [
                prevState.data.dataScience,
                prevState.data.webDev,
                prevState.data.systems,
                prevState.data.appDev,
                prevState.data.hardware,
              ]);
              break;
            default:
              e[field] = false;
          }
        }
        return {
          data: Object.assign({}, prevState.data, d),
          errors: Object.assign({}, prevState.errors, e),
        };
      });
    };
  }

  render() {
    const { jwt, regValid } = this.props;
    const { pane, data, errors } = this.state;

    if (!jwt) {
      window.location.replace(getGithubOAuthURL('/register'));
      return null;
    }
    if (!regValid) {
      return <Loader />;
    }
    return (
      <div className="registration">
        <SideBar pane={pane} />
        <FormContext.Provider value={{ data, errors, registerField: this.registerField }}>
          <ScrollableForm pane={pane} setPane={this.setPane} />
        </FormContext.Provider>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  jwt: state.auth.jwt,
  regValid: state.registration.valid,
  regData: state.registration.data,
});

const mapDispatchToProps = dispatch => ({
  checkRsvp: () => dispatch(getRsvpData()),
  touchData: () => dispatch(touchData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Registration);
