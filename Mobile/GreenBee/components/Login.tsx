import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface LoginProps {
  onBack: () => void;
  onRegisterPress: () => void;
}

const Login: React.FC<LoginProps> = ({
  onBack,
  onRegisterPress,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = async () => {
    setEmailError('');
    setPasswordError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setEmailError('Email is required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setEmailError('Please enter a valid email.');
      return;
    }

    if (!password) {
      setPasswordError('Password is required.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: cleanEmail,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Login Failed',
          data.message || 'Invalid email or password.'
        );
        return;
      }

      if (!data.token) {
  Alert.alert('Login Error', 'Authentication token not received.');
  return;
}

await AsyncStorage.setItem('userToken', data.token);

Alert.alert(
  'Welcome!',
  'Login successful!',
  [{ text: 'Continue', onPress: onBack }]
);

   } catch (error) {
  console.error('LOGIN ERROR:', error);

  Alert.alert(
    'Login Error',
    String(error)
  );
}

    finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Sign In</Text>

      <View style={styles.underlineContainer}>
        <View style={styles.greenUnderline} />
        <View style={styles.greyUnderline} />
      </View>

      <Text style={styles.instruction}>
        Insert your account information:
      </Text>

      {/* Email Address */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>✉</Text>

        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#B5B5B5"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setEmailError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
        />
      </View>

      {emailError ? (
        <Text style={styles.errorText}>
          {emailError}
        </Text>
      ) : null}

      {/* Password */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>♙</Text>

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#B5B5B5"
          value={password}
          onChangeText={text => {
            setPassword(text);
            setPasswordError('');
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
        />

        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.eyeText}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>

      {passwordError ? (
        <Text style={styles.errorText}>
          {passwordError}
        </Text>
      ) : null}

      {/* Forgot Password */}
      <TouchableOpacity
        style={styles.forgotContainer}
        onPress={() =>
          Alert.alert(
            'Forgot Password',
            'This feature is not available yet.'
          )
        }
      >
        <Text style={styles.forgotText}>
          ✉ Forgot your{' '}
          <Text style={styles.linkText}>
            Password?
          </Text>
        </Text>
      </TouchableOpacity>

      {/* Register */}
      <Text style={styles.registerText}>
        If you have an account, please{' '}
        <Text
          style={styles.linkText}
          onPress={onRegisterPress}
        >
          Register Here
        </Text>
      </Text>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={validateForm}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'PLEASE WAIT...' : 'LOGIN'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingVertical: 8,
  },

  backButtonText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#171717',
    marginBottom: 10,
  },

  underlineContainer: {
    height: 2,
    flexDirection: 'row',
    marginBottom: 20,
  },

  greenUnderline: {
    width: '52%',
    backgroundColor: '#16834A',
  },

  greyUnderline: {
    flex: 1,
    backgroundColor: '#E5E5E5',
  },

  instruction: {
    fontSize: 16,
    color: '#222222',
    marginBottom: 20,
  },

  inputContainer: {
    height: 59,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },

  inputIcon: {
    width: 56,
    textAlign: 'center',
    fontSize: 21,
    color: '#BFC2C5',
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
    paddingVertical: 16,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#222222',
  },

  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  eyeText: {
    fontSize: 12,
    color: '#555555',
  },

  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginBottom: 10,
    marginTop: 1,
  },

  forgotContainer: {
    marginTop: 22,
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 13,
    color: '#888888',
  },

  linkText: {
    color: '#4D8BD8',
    fontWeight: '600',
  },

  registerText: {
    fontSize: 14,
    color: '#222222',
    lineHeight: 22,
    marginBottom: 26,
  },

  loginButton: {
    width: 150,
    height: 56,
    borderRadius: 4,
    backgroundColor: '#202020',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Login;
