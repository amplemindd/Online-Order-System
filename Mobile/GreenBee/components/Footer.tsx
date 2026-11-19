import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const Footer = () => {
  const [email, setEmail] = useState('');

  const openLink = (title: string) => {
    Alert.alert(title, `${title} page can be connected here.`);
  };

  const openPhone = () => {
    Linking.openURL('tel:+61225315600').catch(() => {
      Alert.alert('Error', 'Unable to open phone application.');
    });
  };

  const openEmail = () => {
    Linking.openURL('mailto:greenbee@domain.com').catch(() => {
      Alert.alert('Error', 'Unable to open email application.');
    });
  };

  const handleSubscribe = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      Alert.alert('Newsletter', 'Please enter your email address.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert('Newsletter', 'Please enter a valid email address.');
      return;
    }

    Alert.alert(
      'Thank you!',
      'Your email is valid. Connect a newsletter service to complete your subscription.',
    );
  };

  const benefits = [
    {
      icon: require('../assets/images/cash_on_delivery.png'),
      title: 'CASH ON DELIVERY',
    },
    {
      icon: require('../assets/images/free_shipping.png'),
      title: 'FREE SHIPPING',
    },
    {
      icon: require('../assets/images/money_back_guarantee.png'),
      title: 'MONEY BACK GUARANTEE',
    },
  ];

  const sections = [
    {
      title: 'CUSTOMER SERVICE',
      links: [
        'Contact us',
        'Help and advice',
        'Shipping & Returns',
        'Terms and conditions',
        'Refund Policy',
      ],
    },
    {
      title: 'INFORMATION',
      links: [
        'About Us',
        'Testimonials',
        'My Account',
        'Payments & Returns',
        'Catalogues Online',
      ],
    },
    {
      title: 'ABOUT US',
      links: [
        'Who We Are ?',
        'Corporate Responsibility',
        'California Laws',
        'Careers',
        'Privacy Policy',
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* NEWSLETTER SECTION */}
      <ImageBackground
        source={require('../assets/images/Grass.jpg')}
        style={styles.newsletterBackground}
        resizeMode="cover"
      >
        <View style={styles.greenOverlay} />

        <View style={styles.newsletterCard}>
          {/* Organic badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.ribbonLeft} />
            <View style={styles.ribbonRight} />

            <View style={styles.badgeCircle}>
              <View style={styles.badgeInner}>
                <Text style={styles.badgeTop}>
                  100% ORGANIC
                </Text>

                <Text style={styles.leafSymbol}>❧</Text>

                <Text style={styles.badgeBottom}>
                  PREMIUM QUALITY
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.newsletterTitle}>
            Sign Up For Newsletters
          </Text>

          <Text style={styles.newsletterDescription}>
            Sign up for newsletter to receive special offers
            and exclusive news about Greenbee products
          </Text>

          <View style={styles.subscribeBar}>
            <TextInput
              style={styles.emailInput}
              placeholder="ENTER YOUR EMAIL"
              placeholderTextColor="#80B9A5"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel="Enter your email"
            />

            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={handleSubscribe}
              activeOpacity={0.8}
              accessibilityRole="button"
            >
              <Text style={styles.subscribeButtonText}>
                SUBSCRIBE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* BENEFITS - EXISTING ICONS PRESERVED */}
      <View style={styles.benefitsContainer}>
        {benefits.map((item) => (
          <View style={styles.benefitRow} key={item.title}>
            <View style={styles.iconCircle}>
              <Image
                source={item.icon}
                style={styles.benefitImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.benefitContent}>
              <Text style={styles.benefitTitle}>
                {item.title}
              </Text>

              <Text style={styles.benefitDescription}>
                Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Aliquam sit amet tellus mauris
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* FOOTER LINKS */}
      <View style={styles.linksContainer}>
        {sections.map((section) => (
          <View style={styles.section} key={section.title}>
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>

            {section.links.map((link) => (
              <TouchableOpacity
                key={link}
                onPress={() => openLink(link)}
                activeOpacity={0.7}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>{link}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* CONTACT US */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>CONTACT US</Text>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={openPhone}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="call"
              size={19}
              color="#B9C0C0"
              style={styles.contactIcon}
            />
            <Text style={styles.contactText}>
              (+612) 2531 5600
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactRow}
            onPress={openEmail}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name="mail-outline"
              size={19}
              color="#B9C0C0"
              style={styles.contactIcon}
            />
            <Text style={styles.contactText}>
              greenbee@domain.com
            </Text>
          </TouchableOpacity>

          <View style={styles.contactRow}>
            <MaterialIcons
              name="location-on"
              size={20}
              color="#B9C0C0"
              style={styles.contactIcon}
            />
            <Text style={styles.contactText}>
              PO Box 1622 Vissasoasang Street West
            </Text>
          </View>

          <View style={styles.contactRow}>
            <MaterialIcons
              name="schedule"
              size={19}
              color="#B9C0C0"
              style={styles.contactIcon}
            />
            <Text style={styles.contactText}>
              Opening Hours : 8.00AM - 21.00AM
            </Text>
          </View>
        </View>
      </View>

      {/* COPYRIGHT */}
      <View style={styles.copyrightContainer}>
        <Text style={styles.copyrightText}>
          Copyright © 2020 Vinovathemes. All rights reserved.
        </Text>

        {/* PAYMENT LOGOS */}
        <View style={styles.paymentRow}>
          <View style={styles.paymentBox}>
            <Text style={styles.amex}>AMERICAN</Text>
            <Text style={styles.amex}>EXPRESS</Text>
          </View>

          <View style={styles.paymentBox}>
            <Text style={styles.mastercard}>●</Text>
            <Text style={styles.paymentSmall}>MasterCard</Text>
          </View>

          <View style={styles.paymentBox}>
            <Text style={styles.visa}>VISA</Text>
          </View>

          <View style={styles.paymentBox}>
            <Text style={styles.paypal}>PayPal</Text>
          </View>

          <View style={styles.paymentBox}>
            <Text style={styles.dbs}>✿ DBS</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },

  // Newsletter
  newsletterBackground: {
    width: '100%',
    minHeight: 250,
    // paddingHorizontal: 1,
    paddingTop: 120,
    paddingBottom: 45,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },

  greenOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(13, 91, 30, 0.22)',
  },

  newsletterCard: {
    width: '100%',
    minHeight: 290,
    backgroundColor: 'rgba(255, 255, 250, 0.94)',
    borderRadius: 22,
    paddingHorizontal: 15,
    paddingTop: 75,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeContainer: {
    position: 'absolute',
    top: -80,
    width: 130,
    height: 155,
    alignItems: 'center',
    zIndex: 2,
  },

  badgeCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#427D30',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  badgeInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#427D30',
    backgroundColor: '#F8FFF4',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeTop: {
    color: '#326B27',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },

  leafSymbol: {
    color: '#4B852F',
    fontSize: 39,
    lineHeight: 43,
    transform: [{ rotate: '-20deg' }],
  },

  badgeBottom: {
    color: '#326B27',
    fontSize: 8,
    fontWeight: '900',
    textAlign: 'center',
  },

  ribbonLeft: {
    position: 'absolute',
    top: 90,
    left: 18,
    width: 34,
    height: 62,
    backgroundColor: '#619947',
    transform: [{ rotate: '24deg' }],
  },

  ribbonRight: {
    position: 'absolute',
    top: 90,
    right: 18,
    width: 34,
    height: 62,
    backgroundColor: '#619947',
    transform: [{ rotate: '-24deg' }],
  },

  newsletterTitle: {
    color: '#17202B',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 9,
  },

  newsletterDescription: {
    color: '#00875A',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 15,
    textAlign: 'center',
    marginBottom: 28,
  },

  subscribeBar: {
    width: '100%',
    height: 47,
    flexDirection: 'row',
    backgroundColor: '#087F5B',
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
  },

  emailInput: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 10,
  },

  subscribeButton: {
    width: '45%',
    height: '100%',
    backgroundColor: '#4CBD70',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },

  // Benefits
  benefitsContainer: {
    backgroundColor: '#F7F6F2',
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 10,
  },

  benefitRow: {
    minHeight: 79,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 17,
  },

  iconCircle: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
  },

  benefitImage: {
    width: 78,
    height: 78,
  },

  benefitContent: {
    flex: 1,
  },

  benefitTitle: {
    color: '#111111',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 10,
  },

  benefitDescription: {
    color: '#58616C',
    fontSize: 10,
    lineHeight: 15,
  },

  // Links
  linksContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 13,
    paddingTop: 30,
  },

  section: {
    marginBottom: 55,
  },

  sectionTitle: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 17,
  },

  linkButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  linkText: {
    color: '#58616C',
    fontSize: 11,
    lineHeight: 14,
  },

  // Contact
  contactSection: {
    marginBottom: 27,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  contactIcon: {
    width: 33,
    marginRight: 0,
  },

  contactText: {
    flex: 1,
    color: '#58616C',
    fontSize: 10,
    lineHeight: 16,
  },

  // Copyright
  copyrightContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    paddingTop: 21,
    paddingBottom: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  copyrightText: {
    color: '#555555',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 18,
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
  },

  paymentBox: {
    minWidth: 39,
    height: 27,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    backgroundColor: '#FFFFFF',
  },

  amex: {
    color: '#3074AD',
    fontSize: 5,
    fontWeight: '900',
  },

  mastercard: {
    color: '#D95043',
    fontSize: 13,
    lineHeight: 13,
  },

  paymentSmall: {
    color: '#555555',
    fontSize: 5,
  },

  visa: {
    color: '#174A91',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '900',
  },

  paypal: {
    color: '#234D8C',
    fontSize: 9,
    fontStyle: 'italic',
    fontWeight: '900',
  },

  dbs: {
    color: '#B3262D',
    fontSize: 9,
    fontWeight: '900',
  },
});

export default Footer;