import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';

const AboutUs: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner */}
      <Image
        source={require('../assets/images/about.jpg')}
        style={styles.banner}
        resizeMode="cover"
      />

      {/* Company Section */}
      <View style={styles.content}>
        <Text style={styles.heading}>OUR COMPANY</Text>

        <Text style={styles.paragraph}>
          Greenbee is dedicated to bringing fresh, healthy and quality
          fruits and vegetables directly to your doorstep. We believe
          that healthy living begins with fresh food and good choices.
        </Text>

        <Text style={styles.paragraph}>
          Our goal is to make everyday grocery shopping simple,
          convenient and reliable by providing carefully selected
          products that meet your everyday needs.
        </Text>

        {/* Highlighted Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quoteMark}>“</Text>

          <Text style={styles.quote}>
            Freshness you can trust, quality you can taste.
          </Text>
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

  banner: {
    width: '100%',
    height: 190,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 35,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 25,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 20,
    letterSpacing: 1,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 25,
    color: '#666666',
    marginBottom: 18,
    textAlign: 'justify',
  },

  quoteContainer: {
    marginTop: 15,
    padding: 20,
    backgroundColor: '#F1F8F4',
    borderRadius: 8,
    alignItems: 'center',
  },

  quoteMark: {
    fontSize: 55,
    color: '#16845C',
    height: 55,
  },

  quote: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    lineHeight: 27,
  },
});

export default AboutUs;