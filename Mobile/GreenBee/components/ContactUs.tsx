import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const ContactUs: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      Alert.alert('Missing Details', 'Please fill in your name, email and message.');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for contacting Greenbee!'
    );

    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>

        {/* Page Heading */}
        <Text style={styles.pageTitle}>Contact Us</Text>

        {/* Customer Service */}
        <View style={styles.infoSection}>
          <Text style={styles.label}>Call Customer Services :</Text>
          <Text style={styles.phoneNumber}>84-0123-456-789</Text>
        </View>

        {/* Address */}
        <View style={styles.infoSection}>
          <Text style={styles.label}>Address :</Text>
          <Text style={styles.infoText}>
            PO Box 1622 Vissaosang Street West
          </Text>
        </View>

        {/* Email */}
        <View style={styles.infoSection}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.infoText}>Support@domain.com</Text>
        </View>

        {/* Social Media */}
        {/* <View style={styles.socialContainer}>
          {['f', '♥', '℗', 'v', '◎'].map((icon, index) => (
            <Text key={index} style={styles.socialIcon}>
              {icon}
            </Text>
          ))}
        </View> */}

        {/* Contact Form */}
        <View style={styles.form}>

          <TextInput
            style={styles.input}
            placeholder="YOUR NAME"
            placeholderTextColor="#BDBDBD"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="YOUR EMAIL"
            placeholderTextColor="#BDBDBD"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="PHONE NUMBER"
            placeholderTextColor="#BDBDBD"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="MESSAGE"
            placeholderTextColor="#BDBDBD"
            value={message}
            onChangeText={setMessage}
            multiline
            textAlignVertical="top"
          />

          {/* Send Message Button */}
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>SEND MESSAGE</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 40,
  },

  pageTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 30,
  },

  infoSection: {
    marginBottom: 58,
  },

  label: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 12,
  },

  phoneNumber: {
    fontSize: 23,
    fontWeight: '700',
    color: '#222222',
  },

  infoText: {
    fontSize: 18,
    color: '#333333',
    lineHeight: 27,
  },

  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '65%',
    marginTop: 285,
    marginBottom: 65,
  },

  socialIcon: {
    fontSize: 27,
    fontWeight: '700',
    color: '#444444',
  },

  form: {
    width: '100%',
  },

  input: {
    height: 77,
    backgroundColor: '#F3F3F3',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    paddingHorizontal: 27,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: '#333333',
    marginBottom: 18,
  },

  messageInput: {
    height: 190,
    paddingTop: 25,
  },

  sendButton: {
    backgroundColor: '#111111',
    paddingVertical: 19,
    paddingHorizontal: 28,
    alignSelf: 'flex-end',
    marginTop: 5,
  },

  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default ContactUs;