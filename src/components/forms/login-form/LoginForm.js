// @flow
import React from 'react';
import { View } from 'react-native';

import FormTextInput from '../form-text-input/FormTextInput';
import FormField from '../form-field/FormField';

type Props = {
  email: ?string,
  password: ?string,
  onShouldChangeEmail: (email: string) => void,
  onShouldChangePassword: (password: string) => void,
};

const styles = {
  container: {
    flex: 1,
  },
  formField: {
    maxHeight: 75,
    marginVertical: 10
  },
};

export default function LoginForm(props: Props) {
  return (
    <View style={styles.container}>
      <FormField labelText="Email" style={styles.formField}>
        <FormTextInput
          value={props.email}
          onShouldChangeValue={props.onShouldChangeEmail}
        />
      </FormField>
      <FormField labelText="Password" style={styles.formField}>
        <FormTextInput
          value={props.password}
          onShouldChangeValue={props.onShouldChangePassword}
        />
      </FormField>
    </View>
  );
}
