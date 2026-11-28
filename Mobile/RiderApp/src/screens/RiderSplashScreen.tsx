
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const TaazaMlogo = require('../assets/images/TaazaMlogo.png');
const TMRider = require('../assets/images/TMRider_blended.png');

export default function RiderSplashScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background Decorations */}
      <View style={styles.backgroundDecor}>
        {/* Left City */}
        <View style={styles.leftCity}>
          <View style={styles.buildingOne} />
          <View style={styles.buildingTwo} />
          <View style={styles.buildingThree} />
          <View style={styles.treeOne} />
          <View style={styles.treeTwo} />
        </View>

        {/* Right City */}
        <View style={styles.rightCity}>
          <View style={styles.buildingFour} />
          <View style={styles.buildingFive} />
          <View style={styles.buildingSix} />
          <View style={styles.treeThree} />
          <View style={styles.treeFour} />
        </View>
      </View>

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={TaazaMlogo}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.tagline}>
          — Freshness at Your Doorstep —
        </Text>
      </View>

      {/* Rider Image */}
      <View style={styles.riderContainer}>
        <Image
          source={TMRider}
          style={styles.riderImage}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Green Design */}
      <View style={styles.bottomSection}>
        <View style={styles.lightWave} />
        <View style={styles.limeWave} />
        <View style={styles.greenWave} />
        <View style={styles.darkGreenBase} />

        {/* Bottom Text */}
        <View style={styles.bottomText}>
          <Text style={styles.heading}>Rider App</Text>

          <Text style={styles.bottomTagline}>
            Deliver Freshness, Earn More!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  backgroundDecor: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },

  /* City Decorations */

  leftCity: {
    position: 'absolute',
    left: 0,
    top: height * 0.36,
    width: width * 0.28,
    height: height * 0.35,
    opacity: 0.45,
  },

  rightCity: {
    position: 'absolute',
    right: 0,
    top: height * 0.36,
    width: width * 0.28,
    height: height * 0.35,
    opacity: 0.45,
  },

  buildingOne: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 22,
    height: 105,
    backgroundColor: '#E4F7E7',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  buildingTwo: {
    position: 'absolute',
    bottom: 0,
    left: 19,
    width: 25,
    height: 75,
    backgroundColor: '#D2F0D7',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  buildingThree: {
    position: 'absolute',
    bottom: 0,
    left: 43,
    width: 18,
    height: 48,
    backgroundColor: '#E6F8E9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  buildingFour: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 95,
    backgroundColor: '#E0F5E3',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  buildingFive: {
    position: 'absolute',
    bottom: 0,
    right: 22,
    width: 22,
    height: 65,
    backgroundColor: '#D3F0D7',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },

  buildingSix: {
    position: 'absolute',
    bottom: 0,
    right: 43,
    width: 18,
    height: 42,
    backgroundColor: '#E8F8E9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  treeOne: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#B9EBC1',
  },

  treeTwo: {
    position: 'absolute',
    bottom: 10,
    left: 35,
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#C8F0CD',
  },

  treeThree: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 42,
    height: 42,
    borderRadius: 25,
    backgroundColor: '#B9EBC1',
  },

  treeFour: {
    position: 'absolute',
    bottom: 12,
    right: 35,
    width: 32,
    height: 32,
    borderRadius: 20,
    backgroundColor: '#C8F0CD',
  },

  /* Logo */

  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.015,
    zIndex: 2,
  },

  logo: {
    width: width * 0.88,
    height: height * 0.25,
  },

  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: '#237A43',
    letterSpacing: 0.5,
    marginTop: -12,
  },

  /* Rider */

  riderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    paddingBottom: height * 0.12,
  },

  riderImage: {
    width: width * 1.02,
    height: height * 0.43,
  },

  /* Bottom Waves */

  bottomSection: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: height * 0.29,
    overflow: 'hidden',
    zIndex: 1,
  },

  lightWave: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.23,
    backgroundColor: '#C7F0A0',
    borderRadius: width,
    top: height * 0.035,
    left: -width * 0.25,
    transform: [{ rotate: '-7deg' }],
  },

  limeWave: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.23,
    backgroundColor: '#85D52B',
    borderRadius: width,
    top: height * 0.09,
    left: -width * 0.28,
    transform: [{ rotate: '7deg' }],
  },

  greenWave: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.23,
    backgroundColor: '#168D36',
    borderRadius: width,
    top: height * 0.14,
    left: -width * 0.22,
    transform: [{ rotate: '-5deg' }],
  },

  darkGreenBase: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 0.27,
    backgroundColor: '#00652F',
    borderRadius: width,
    top: height * 0.18,
    left: -width * 0.25,
  },

  /* Bottom Text */

  bottomText: {
    position: 'absolute',
    bottom: height * 0.045,
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
  },

  heading: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 5,
  },

  bottomTagline: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
