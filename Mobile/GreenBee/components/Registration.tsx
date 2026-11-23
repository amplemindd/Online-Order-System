
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';


interface RegistrationProps {
  onLoginPress: () => void;
}

  const Registration: React.FC<RegistrationProps> = ({ onLoginPress }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [password, setPassword] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRegister = async () => {
    const first = firstName.trim();
    const last = lastName.trim();
    const emailValue = email.trim().toLowerCase();

    // Names may contain letters, spaces, apostrophes and hyphens.
    const namePattern = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setPhoneError('');

    let hasError = false;

    if (!first) {
      setFirstNameError('First name is required.');
      hasError = true;
    } else if (!namePattern.test(first)) {
      setFirstNameError('Only letters are allowed.');
      hasError = true;
    }

    if (!last) {
      setLastNameError('Last name is required.');
      hasError = true;
    } else if (!namePattern.test(last)) {
      setLastNameError('Only letters are allowed.');
      hasError = true;
    }

    if (!emailValue) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!emailPattern.test(emailValue)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    }

    if (!phone.trim()) {
      setPhoneError('Phone number is required.');
      hasError = true;
    } else if (!/^[0-9]{10}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setLoading(true);

try {
  const response = await fetch(
    'https://online-order-system-1.onrender.com/api/register',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: first,
        last_name: last,
        email: emailValue,
        phone: phone.trim(),
        password,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    Alert.alert('Registration Failed', data.message || 'Please try again.');
    return;
  }

  Alert.alert('Success', 'Account created successfully!', [
    { text: 'Login Now', onPress: onLoginPress },
  ]);

} catch (error) {
  Alert.alert('Connection Error', 'Unable to connect to the server.');
} finally {
  setLoading(false);
}
  };

  const renderField = (
    icon: string,
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    options: {
      keyboardType?: 'default' | 'email-address' | 'phone-pad';
      autoCapitalize?: 'none' | 'words';
    } = {},
  ) => (
    <View style={styles.inputContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.fieldIcon}>{icon}</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#b7b7b7"
        value={value}
        onChangeText={onChangeText}
        keyboardType={options.keyboardType ?? 'default'}
        autoCapitalize={options.autoCapitalize ?? 'words'}
        autoCorrect={false}
      />
    </View>
  );

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Create an account</Text>

        <View style={styles.headingUnderline}>
          <View style={styles.greenLine} />
        </View>

        {/* First Name */}
        <View style={styles.fieldWrapper}>
          {renderField(
            '♙',
            'First Name',
            firstName,
            (text) => {
              setFirstName(text);
              setFirstNameError('');
            },
          )}

          {!!firstNameError && (
            <Text style={styles.errorText}>{firstNameError}</Text>
          )}
        </View>

        {/* Last Name */}
        <View style={styles.fieldWrapper}>
          {renderField(
            '♙',
            'Last Name',
            lastName,
            (text) => {
              setLastName(text);
              setLastNameError('');
            },
          )}

          {!!lastNameError && (
            <Text style={styles.errorText}>{lastNameError}</Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.fieldWrapper}>
          {renderField(
            '✉',
            'Email',
            email,
            (text) => {
              setEmail(text);
              setEmailError('');
            },
            {
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            },
          )}

          {!!emailError && (
            <Text style={styles.errorText}>{emailError}</Text>
          )}
        </View>


        {/* Phone Number */}
        <View style={styles.fieldWrapper}>
          {renderField(
            '☎', 'Phone Number', phone,
            (text) => {
              setPhone(text.replace(/[^0-9]/g, '').slice(0, 10));
              setPhoneError('');
            },
            {
              keyboardType: 'phone-pad',
              autoCapitalize: 'none',
            },
            )}
            
            {!!phoneError && (
              <Text style={styles.errorText}>{phoneError}</Text>
              )}
              </View>


        {/* Password */}
        <View style={styles.fieldWrapper}>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Text style={styles.fieldIcon}>♙</Text>
            </View>

            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#b7b7b7"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showPasswordText}>
                {showPassword ? 'Hide' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>

          {!!passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
        </View>

        {/* Newsletter Checkbox */}
        <Pressable
          style={styles.newsletterRow}
          onPress={() => setNewsletter(!newsletter)}
        >
          <View
            style={[
              styles.checkbox,
              newsletter && styles.checkboxSelected,
            ]}
          >
            {newsletter && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>

          <Text style={styles.newsletterText}>
            Sign up for our newsletter
          </Text>
        </Pressable>

        {/* Login Link */}
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>
            If you have an account, please{' '}
          </Text>

          <TouchableOpacity
            onPress={onLoginPress}
          >
            <Text style={styles.loginLink}>Login Here</Text>
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.registerButtonText}>REGISTER</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderLeftColor: '#dedede',
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 30,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 10,
  },

  headingUnderline: {
    height: 2,
    backgroundColor: '#eeeeee',
    marginBottom: 20,
  },

  greenLine: {
    width: '52%',
    height: 2,
    backgroundColor: '#8bbcae',
  },

  fieldWrapper: {
    marginBottom: 9,
  },

  inputContainer: {
    height: 59,
    borderWidth: 1,
    borderColor: '#e4e4e8',
    borderRadius: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: '#ffffff',
  },

  iconContainer: {
    width: 56,
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#e4e4e8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fieldIcon: {
    color: '#bcbfc2',
    fontSize: 20,
    textAlign: 'center',
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 14,
    color: '#333333',
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 12,
    paddingRight: 4,
    fontSize: 14,
    color: '#333333',
  },

  showPasswordButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },

  showPasswordText: {
    color: '#777777',
    fontSize: 12,
  },

  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
    marginLeft: 2,
  },

  newsletterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 11,
    marginBottom: 16,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#999999',
    borderRadius: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkboxSelected: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },

  checkmark: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },

  newsletterText: {
    color: '#a6a6b0',
    fontSize: 10,
  },

  loginRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 24,
  },

  loginText: {
    color: '#111111',
    fontSize: 14,
  },

  loginLink: {
    color: '#4385d8',
    fontSize: 14,
  },

  registerButton: {
    width: 150,
    height: 56,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },

  disabledButton: {
    opacity: 0.65,
  },

  registerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
