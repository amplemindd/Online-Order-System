
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

import { MaterialIcons as Icon } from '@react-native-vector-icons/material-icons';

interface SupportScreenProps {
  onGoBack?: () => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ onGoBack }) => {
  return (
    <View style={styles.container}>

      {/* Green Header - Same as Settings */}
      <View style={styles.greenHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Support</Text>

        <View style={styles.emptySpace} />
      </View>

      <View style={styles.content}>

        {/* Illustration */}
        <Image
          source={require('../assets/images/SupportDesk.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Need Help Text */}
        <Text style={styles.title}>Need Help?</Text>

        <Text style={styles.subtitle}>
          Our support team is here to assist you.
        </Text>

        {/* Chat With Us Button */}
        <TouchableOpacity style={styles.greenButton} activeOpacity={0.8}>
          <Icon name="chat" size={22} color="#FFFFFF" />
          <Text style={styles.buttonText}> Chat With Us</Text>
        </TouchableOpacity>

        {/* Or Call Us Section */}
        <View style={styles.orContainer}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>Or Call Us</Text>
          <View style={styles.orLine} />
        </View>

        {/* Call Us Button */}
        <TouchableOpacity style={styles.callButton} activeOpacity={0.8}>
          <View style={styles.callIconContainer}>
            <Icon name="phone" size={22} color="#157544" />
          </View>

          <View style={styles.callTextContainer}>
            <Text style={styles.callLabel}>Call Us</Text>
            <Text style={styles.phoneNumber}>+91 98765 43210</Text>
          </View>

          <Icon name="chevron-right" size={22} color="#157544" />
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  greenHeader: {
    height: 60,
    backgroundColor: '#0F7A44',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  backButton: {
    width: 32,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },

  emptySpace: {
    width: 32,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },

  illustration: {
    width: 260,
    height: 260,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 40,
  },

  greenButton: {
    backgroundColor: '#0F7A44',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '85%',
  },

  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D1D6',
  },

  orText: {
    color: '#8E8E93',
    fontSize: 14,
    marginHorizontal: 12,
  },

  callButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  callIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  callTextContainer: {
    flex: 1,
  },

  callLabel: {
    fontSize: 17,
    color: '#8E8E93',
  },

  phoneNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },

});

export default SupportScreen;
