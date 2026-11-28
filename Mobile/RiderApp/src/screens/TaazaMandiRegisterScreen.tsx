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

const TMlogo = require('../assets/images/TaazaMlogo.png');

const TaazaMandiRegisterScreen = () => {
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('Bike');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [showVehicleDropdown, setShowVehicleDropdown] = useState(false);

  const vehicles = ['Bike', 'Scooter', 'Car', 'Truck'];

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
          source={TMlogo}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.subtitle}>Create Your Account</Text>

        <View style={styles.form}>

          {/* Full Name */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="person" size={22} color="#0F7A44" />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#000000"
              value={fullName}
              onChangeText={setFullName}
              keyboardType="default"
            />
          </View>

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

          {/* Email Address */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="email" size={22} color="#0F7A44" />
            </View>

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#000000"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Vehicle Type */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="directions-bike" size={22} color="#0F7A44" />
            </View>

            <TouchableOpacity
              style={styles.selectVehicleContainer}
              activeOpacity={0.7}
              onPress={() => setShowVehicleDropdown(!showVehicleDropdown)}
            >
              <Text style={styles.selectVehicleText}>
                {selectedVehicle}
              </Text>

              <Icon
                name="arrow-drop-down"
                size={24}
                color="#0F7A44"
              />
            </TouchableOpacity>
          </View>

          {/* Vehicle Dropdown */}
          {showVehicleDropdown && (
            <View style={styles.dropdown}>
              {vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle}
                  style={[
                    styles.dropdownItem,
                    selectedVehicle === vehicle && styles.selectedDropdownItem,
                  ]}
                  onPress={() => {
                    setSelectedVehicle(vehicle);
                    setShowVehicleDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedVehicle === vehicle &&
                        styles.selectedDropdownItemText,
                    ]}
                  >
                    {vehicle}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* License Number */}
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Icon name="credit-card" size={22} color="#0F7A44" />
            </View>

            <TextInput
              style={styles.input}
              placeholder="License Number"
              placeholderTextColor="#000000"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              keyboardType="default"
              autoCapitalize="characters"
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
            onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login now</Text>
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
    paddingTop: 15,
    paddingBottom: 15,
  },

logo: {
  width: 290,
  height: 210,
  alignSelf: 'center',
  marginBottom: 5,
},

  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },

  form: {
    paddingHorizontal: 20,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 14,
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
    fontSize: 16,
    color: '#000000',
  },

  selectVehicleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },

  selectVehicleText: {
    fontSize: 16,
    color: '#000000',
  },

  dropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginTop: -5,
    marginBottom: 12,
    elevation: 3,
    overflow: 'hidden',
  },

  dropdownItem: {
    paddingVertical: 11,
    paddingHorizontal: 16,
  },

  selectedDropdownItem: {
    backgroundColor: '#F0F0F7',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },

  selectedDropdownItemText: {
    color: '#0F7A44',
    fontWeight: '600',
  },

  registerButton: {
    backgroundColor: '#0F7A44',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 16,
  },

  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  loginText: {
    fontSize: 15,
    color: '#060607',
  },

  loginLink: {
    fontSize: 15,
    color: '#0F7A44',
    fontWeight: '600',
    marginLeft: 4,
  },

});

export default TaazaMandiRegisterScreen;
