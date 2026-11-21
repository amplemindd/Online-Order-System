import React, { useEffect, useRef, useState } from 'react';

import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const slides = [
  {
    image: require('../assets/images/apple.jpg'),
    title: 'Apple For Live Healthy',
    subtitle:
      'Fresh apples for a healthy life. Enjoy the goodness of nature!',
    backgroundTitle: 'FRESH APPLES',
  },
  {
    image: require('../assets/images/vegetables.jpg'),
    title: 'Vegetable For Live Healthy',
    subtitle:
      'Eat fresh vegetables every day and nourish your body naturally.',
    backgroundTitle: 'FRESH VEGETABLES',
  },
  {
    image: require('../assets/images/oranges.jpg'),
    title: 'Fruit For Live Healthy',
    subtitle:
      'Orange Nova originated in the jungles of Jamaica, are very rare worldwide. You have never tasted anything like them!',
    backgroundTitle: 'ORANGE FRUIT',
  },
];

const Banner = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentSlide = slides[activeIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(previous => (previous + 1) % slides.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fadeAnim.setValue(0.3);

    const animation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    });

    animation.start();

    return () => animation.stop();
  }, [activeIndex, fadeAnim]);

  const changeSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.banner, { opacity: fadeAnim }]}>
        <ImageBackground
          source={currentSlide.image}
          style={styles.imageBackground}
          resizeMode="cover"
          imageStyle={styles.backgroundImage}
          onError={() => {
            console.log('Banner image failed to load');
          }}
        >
          <View style={styles.overlay}>
            <Text style={styles.backgroundTitle}>
              {currentSlide.backgroundTitle}
            </Text>

            <Text style={styles.title}>
              {currentSlide.title}
            </Text>

            <Text style={styles.subtitle}>
              {currentSlide.subtitle}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    backgroundColor: '#FFFFFF',
  },

  banner: {
    width: '100%',
    height: 195,
    overflow: 'hidden',
    backgroundColor: '#E8E8E8',
  },

  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
  },

  overlay: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },

  backgroundTitle: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: '900',
    color: 'rgba(255, 255, 255, 0.35)',
    textAlign: 'center',
    letterSpacing: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontFamily: 'Georgia',
    textAlign: 'center',
    marginBottom: 9,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 4,
  },

  subtitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    fontStyle: 'italic',
    fontFamily: 'Georgia',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {
      width: 1,
      height: 1,
    },
    textShadowRadius: 3,
  },
});

export default Banner;