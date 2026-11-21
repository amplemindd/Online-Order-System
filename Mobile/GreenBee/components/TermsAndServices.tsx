import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

const termsData = [
  {
    heading: 'Terms and Conditions',
    paragraphs: [
      'Welcome to Greenbee! These terms and conditions outline the rules and regulations for using the Greenbee website and mobile application.',
      'By accessing or using Greenbee, you agree to comply with these terms. If you do not agree with any part of these terms, please discontinue using our services.',
      'Greenbee provides an online platform that allows customers to browse and purchase fruits, vegetables and other grocery products. We reserve the right to update these terms whenever necessary.',
    ],
  },
  {
    heading: 'Cookies',
    paragraphs: [
      'Greenbee may use cookies and similar technologies to improve your browsing experience, remember your preferences and understand how visitors interact with our platform.',
      'You can manage cookie preferences through your browser settings. Disabling certain cookies may affect some website features.',
    ],
  },
  {
    heading: 'License',
    paragraphs: [
      'Unless otherwise stated, Greenbee and its licensors own the intellectual property rights for the content available on the platform.',
      'You may access and use the platform for personal, non-commercial shopping purposes. You must not reproduce, redistribute or commercially exploit our content without prior permission.',
    ],
  },
  {
    heading: 'User Accounts',
    paragraphs: [
      'Customers may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your login credentials.',
      'Please ensure that the information provided during registration is accurate and up to date. Notify us if you suspect unauthorized access to your account.',
    ],
  },
  {
    heading: 'Products and Pricing',
    paragraphs: [
      'Greenbee aims to provide accurate product descriptions, images and prices. However, minor differences in product appearance, availability or pricing may occur.',
      'Prices and product availability may change without prior notice. We reserve the right to correct errors in product listings whenever they are identified.',
    ],
  },
  {
    heading: 'Orders and Payments',
    paragraphs: [
      'When placing an order, customers are responsible for providing accurate delivery and contact information.',
      'An order is subject to confirmation and product availability. Available payment methods and applicable charges will be displayed during checkout.',
    ],
  },
  {
    heading: 'Limitation of Liability',
    paragraphs: [
      'Greenbee aims to provide reliable services but does not guarantee uninterrupted or error-free access to the platform.',
      'To the extent permitted by applicable law, Greenbee shall not be responsible for indirect or incidental losses arising from the use of the platform.',
    ],
  },
  {
    heading: 'Changes to Terms',
    paragraphs: [
      'Greenbee reserves the right to modify these terms and conditions at any time. Updated terms will be published on this page.',
      'Continued use of the platform after changes are published indicates acceptance of the revised terms.',
    ],
  },
];

const TermsAndServices: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Grey Title Banner */}
      <View style={styles.titleBanner}>
        <Text style={styles.bannerTitle}>
          TERM AND SERVICES
        </Text>
      </View>

      {/* Terms Content */}
      <View style={styles.content}>
        {termsData.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.heading}>
              {section.heading}
            </Text>

            {section.paragraphs.map((paragraph, paragraphIndex) => (
              <Text
                key={paragraphIndex}
                style={styles.paragraph}
              >
                {paragraph}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  titleBanner: {
    height: 160,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bannerTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#222222',
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 48,
    paddingBottom: 50,
  },

  section: {
    marginBottom: 30,
  },

  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 25,
  },

  paragraph: {
    fontSize: 16,
    lineHeight: 28,
    color: '#707070',
    marginBottom: 2,
    textAlign: 'left',
  },
});

export default TermsAndServices;