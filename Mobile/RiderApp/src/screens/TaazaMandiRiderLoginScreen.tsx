
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, ActivityIndicator } from 'react-native';
import { apiRequest } from '../services/api';
import {useNavigation} from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { MaterialIcons as Icon } from '@react-native-vector-icons/material-icons';

const TaazaMlogo = require('../assets/images/TaazaMlogo.png');
const TMRider = require('../assets/images/TMRider_blended.png');

const TaazaMandiRiderLoginScreen = () => {
  const navigation = useNavigation<any>();
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  if (!/^\d{10}$/.test(mobileNumber)) {
    Alert.alert('Invalid Mobile Number', 'Enter a valid 10-digit mobile number.');
    return;
  }

  if (!password.trim()) {
    Alert.alert('Missing Password', 'Please enter your password.');
    return;
  }

  try {
    setIsLoading(true);

    const response = await apiRequest('/rider/login', {
      method: 'POST',
      body: JSON.stringify({
        mobileNumber,
        password,
      }),
    });

console.log('RIDER USER DATA:', response.user);

    if (!response.success || !response.token) {
      throw new Error(response.message || 'Login failed.');
    }

    await AsyncStorage.setItem('riderToken', response.token);
    await AsyncStorage.setItem(
      'riderUser',
      JSON.stringify(response.user),
    );

    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });

  } catch (error: any) {
    Alert.alert(
      'Login Failed',
      error.message || 'Unable to connect to the server.',
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          source={TaazaMlogo}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Rider Image */}
        <Image
          source={TMRider}
          style={styles.riderImage}
          resizeMode="contain"
        />

        {/* Login Form */}
        <View style={styles.form}>

          {/* Mobile Number */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="phone" size={22} color="#0F7A44" />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#000000"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="lock" size={22} color="#0F7A44" />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#000000"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={22}
                color="#0F7A44"
              />
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={handleLogin}
          disabled={isLoading}
          >
         {isLoading ? (
           <ActivityIndicator color="#FFFFFF" />
            ) : (
          <Text style={styles.loginButtonText}>Login</Text>
           )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotButton}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>
              Don't have an account?
            </Text>

            <TouchableOpacity activeOpacity={0.7}
            onPress={() => navigation.navigate('Register')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: 5,
    paddingBottom: 15,
  },

logo: {
  width: 290,
  height: 250,
  alignSelf: 'center',
  marginBottom: -10,
},
  riderImage: {
    width: 320,
    height: 220,
    alignSelf: 'center',
    marginBottom: 5,
    opacity: 0.96,
    backgroundColor: 'transparent',
  },

  form: {
    paddingHorizontal: 20,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  input: {
    flex: 1,
    height: 48,
    fontSize: 17,
    color: '#000000',
  },

  eyeIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButton: {
    backgroundColor: '#0F7A44',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 12,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },

  forgotText: {
    color: '#0F7A44',
    fontSize: 15,
    fontWeight: '600',
  },

  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  signUpText: {
    fontSize: 15,
    color: '#8E8E93',
  },

  signUpLink: {
    fontSize: 15,
    color: '#0F7A44',
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default TaazaMandiRiderLoginScreen;
