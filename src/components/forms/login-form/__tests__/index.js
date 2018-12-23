// @flow
import React from 'react';
import renderer from 'react-test-renderer';
import noop from 'lodash/noop';

import LoginForm from '../LoginForm';

test('renders as expected', () => {
  const tree = renderer
    .create(
      <LoginForm
        email="jpbrennecke@gmail.com"
        password="password"
        isValidEmail
        isValidPassword
        onShouldChangeEmail={noop}
        onShouldChangePassword={noop}
        onShouldSubmit={noop}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
