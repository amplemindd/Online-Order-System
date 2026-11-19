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
// const Login: React.FC = () => {
const Login: React.FC<LoginProps> = ({ onBack, onRegisterPress }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;

    setPhoneError('');
    setPasswordError('');

    if (!phone.trim()) {
      setPhoneError('Phone number is required.');
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Password must contain at least 8 characters.');
      isValid = false;
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordError('Password must contain both letters and numbers.');
      isValid = false;
    }

    if (isValid) {
      Alert.alert(
        'Validation Successful',
        'Your phone number and password meet the requirements. Login is not connected yet.',
      );
    }

    return isValid;
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

      {/* Phone Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputIcon}>☎</Text>

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#B5B5B5"
          value={phone}
          onChangeText={text => {
            setPhone(text.replace(/[^0-9]/g, '').slice(0, 10));
            setPhoneError('');
          }}
          keyboardType="phone-pad"
          maxLength={10}
          autoComplete="tel"
        />
      </View>

      {phoneError ? (
        <Text style={styles.errorText}>{phoneError}</Text>
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
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {/* Forgot Password */}
      <TouchableOpacity
        style={styles.forgotContainer}
        onPress={() =>
          Alert.alert(
            'Forgot Password',
            'This feature is not available yet.',
          )
        }
      >
        <Text style={styles.forgotText}>
          ✉ Forgot your <Text style={styles.linkText}>Password?</Text>
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

      {/* Login */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={validateForm}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>LOGIN</Text>
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