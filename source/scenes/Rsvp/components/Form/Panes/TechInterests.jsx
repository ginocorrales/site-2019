// @flow
import React from 'react';

import Select from 'components/Select';

import { range } from './selectOptions';
import FormTransition from '../FormTransition';
import FormContext from '../../../FormContext';

type Props = {
  visible: boolean,
};

const LanguageInfo = (props: Props) => {
  const { visible } = props;
  return (
    <FormTransition visible={visible} uid="student-info">
      <FormContext.Consumer>
        {({ data, errors, registerField }) => (
          <div className="scrolled-form">
            <h2>Order 1 (most) to 6 (least) by your interest</h2>
            <Select
              label="Data Science"
              placeholder="1-6"
              items={range}
              onSelect={registerField('dataScience', null, true)}
              disableInput
              index={data.dataScience}
              error={errors.dataScience}
              errorMessage="Please select a unique number for each field"
            />
            <Select
              label="Web Development"
              placeholder="1-6"
              items={range}
              onSelect={registerField('webDev', null, true)}
              disableInput
              index={data.webDev}
              error={errors.webDev}
              errorMessage="Please select a unique number for each field"
            />
            <Select
              label="Systems Programming"
              placeholder="1-6"
              items={range}
              onSelect={registerField('systems', null, true)}
              disableInput
              index={data.systems}
              error={errors.systems}
              errorMessage="Please select a unique number for each field"
            />
            <Select
              label="App Development"
              placeholder="1-6"
              items={range}
              onSelect={registerField('appDev', null, true)}
              disableInput
              index={data.appDev}
              error={errors.appDev}
              errorMessage="Please select a unique number for each field"
            />
            <Select
              label="Hardware"
              placeholder="1-6"
              items={range}
              onSelect={registerField('hardware', null, true)}
              disableInput
              index={data.hardware}
              error={errors.hardware}
              errorMessage="Please select a unique number for each field"
            />
            <Select
              label="Development Tools"
              placeholder="1-6"
              items={range}
              onSelect={registerField('devTools', null, true)}
              disableInput
              index={data.devTools}
              error={errors.devTools}
              errorMessage="Please select a unique number for each field"
            />
          </div>
        )}
      </FormContext.Consumer>
    </FormTransition>
  );
};

export default LanguageInfo;
