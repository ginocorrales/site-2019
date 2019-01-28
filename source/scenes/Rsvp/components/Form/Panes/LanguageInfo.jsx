// @flow
import React from 'react';

import Slider from 'components/Slider';

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
            <Slider
              label="Python"
              onChange={registerField('python')}
              index={data.python}
              error={errors.python}
              errorMessage="Rate your skill"
            />
          </div>
        )}
      </FormContext.Consumer>
    </FormTransition>
  );
};

export default LanguageInfo;
