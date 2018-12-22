// @flow
import React from 'react';
import { View } from 'react-native';

import FormTextInput from '../form-text-input/FormTextInput';
import FormField from '../form-field/FormField';
import Button from '../../button/Button';

type Props = {
  email: ?string,
  password: ?string,
  onShouldChangeEmail: (email: string) => void,
  onShouldChangePassword: (password: string) => void,
  onShouldSubmit: () => void,
  isValidEmail: boolean,
  isValidPassword: boolean,
};

const styles = {
  container: {
    flex: 1,
  },
  formField: {
    flex: 1,
    maxHeight: 75,
    marginVertical: 10,
  },
  submitButton: {
    flex: 1,
    maxHeight: 55,
    marginVertical: 25,
  },
};

export default function LoginForm(props: Props) {
  return (
    <View style={styles.container}>
      <FormField
        labelText="Email"
        style={styles.formField}
        isValid={props.isValidEmail}
      >
        <FormTextInput
          autoCapitalize="none"
          autoCorrect={false}
          value={props.email}
          keyboardType="email-address"
          onShouldChangeValue={props.onShouldChangeEmail}
        />
      </FormField>
      <FormField
        labelText="Password"
        style={styles.formField}
        isValid={props.isValidPassword}
      >
        <FormTextInput
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          value={props.password}
          onShouldChangeValue={props.onShouldChangePassword}
        />
      </FormField>
      <Button
        style={styles.submitButton}
        text="Login"
        onPress={props.onShouldSubmit}
      />
    </View>
  );
}
