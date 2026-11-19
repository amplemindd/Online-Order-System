import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const PrivacyPolicy: React.FC = () => {
  return (
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >

      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbText}>
          Home
        </Text>

        <Text style={styles.separator}>
          ◆
        </Text>

        <Text style={styles.breadcrumbText}>
          Page Privacy Policy
        </Text>
      </View>

      <View style={styles.policyContainer}>
        <Text style={styles.pageTitle}>
          Privacy Policy
        </Text>

        <Text style={styles.mainHeading}>
          Sample Privacy Policy Template
        </Text>

        <Text style={styles.paragraph}>
          A Privacy Policy is a legal statement found on a website
          or app that outlines explicit details on how it will use
          personal data provided by users. Such personal data may
          include details like names, addresses, phone numbers,
          date of birth or data related to one's financial
          information like credit card details.
        </Text>

        <Text style={styles.paragraph}>
          Other than outlining how your website will use the data,
          a Privacy Policy also describes the legal obligations you
          have if you fail to meet stipulated responsibilities as
          the website owner.
        </Text>

        <Text style={styles.paragraph}>
          As a business owner who's considering putting up a
          website, this article will give you a basic understanding
          of why you need to have a Privacy Policy and how you
          should incorporate one.
        </Text>

        <Text style={styles.paragraph}>
          As part of an array of privacy laws available across the
          globe, if your website will collect user information,
          you are legally required to have a Privacy Policy in
          place.
        </Text>

        <Text style={styles.paragraph}>
          If you are a resident member of the EU, having a Privacy
          Policy shows compliance with the General Data Protection
          Regulation (GDPR). Failure to comply with this EU
          regulation can lead to a fine of up to 20 million Euros
          according to Intersoft Consulting.
        </Text>

        <Text style={styles.paragraph}>
          The U.S., on the other hand, doesn't have a singular
          governing data protection legislation. Rather, the U.S.
          uses a combination of related data privacy laws at the
          federal and state level.
        </Text>

        <Text style={styles.paragraph}>
          For instance, the Federal Trade Commission Act (FTCA)
          empowers the Federal Trade Commission to enforce privacy
          and data protection laws in federal jurisdiction. On the
          other hand, the California Online Privacy Protection Act
          (CalOPPA) is one such data privacy law which protects
          users with residency in California.
        </Text>

        <Text style={styles.paragraph}>
          A Privacy Policy also instils trust into users that
          their information is safe from unrelated parties. If
          not, you might be liable to legal repercussions. In
          general, a Privacy Policy further legitimises your
          business by ensuring all the parties involved are part
          of a legally binding agreement.
        </Text>

        <Text style={styles.paragraph}>
          Having a strong Privacy Policy also offers a substantial
          competitive advantage. We don't precisely understand how
          Google's search algorithm works, but the biggest
          consensus is that if Google trusts your business, the
          higher your chances of appearing on its first search
          results pages.
        </Text>

        <Text style={styles.paragraph}>
          According to Woorank, most SEO experts believe that a
          website's privacy policy has a pivotal role to play in
          how Google and other search engines ultimately identify
          you as "trust-worthy."
        </Text>

        <Text style={styles.sectionHeading}>
          What to Include in Your Privacy Policy
        </Text>

        <Text style={styles.paragraph}>
          The content of your Privacy Policy will largely depend
          on the function of your website, the information
          gathered and how you intend to use said information.
          However, to pass legal standards, all Privacy policies
          should have these basic elements within the text.
        </Text>

        <Text style={styles.subHeading}>
          Your Business Contact Information
        </Text>

        <Text style={styles.paragraph}>
          Your Privacy needs to display your organization details
          like the legal name, contact details and place of
          business. Best practice recommends that this part
          should appear as the first or the last part of your
          Privacy Policy for visibility.
        </Text>

        <Text style={styles.subHeading}>
          The Type of Data You Will Collect
        </Text>

        <Text style={styles.paragraph}>
          This ranges from emails, physical and IP addresses,
          credit card details, phone numbers or tracking locations.
          CalOPPA goes a step further to mandate that commercial
          or online websites collecting information on California
          residents must categorically list the type of personal
          information collected.
        </Text>

        <Text style={styles.subHeading}>
          How You Will Collect the Information
        </Text>

        <Text style={styles.paragraph}>
          In addition to filling out forms, you can also collect
          data automatically through the use of cookies. Internet
          cookies are, by far, the easiest way to collect user
          data since browsers collect and save information from
          an array of sites users have previously visited.
          However, you must also obtain consent from users to
          use their cookies when collecting information.
        </Text>

        <Text style={styles.subHeading}>
          How You Intend to Use the Data
        </Text>

        <Text style={styles.paragraph}>
          A vital element of a Privacy Policy is describing how
          you intend to use the data collected. This clause is
          particularly important if third-parties like advertising
          programs or fintech companies are in the loop.
        </Text>

        <Text style={styles.paragraph}>
          Will you use the data for transactional purposes alone
          or will you also send newsletters to your visitors?
          Will your company share information with other
          third-party entities like merchants? If so, the law
          legally requires you to list down all the relevant
          parties who will also have access to user information
          alongside your business.
        </Text>

        <Text style={styles.paragraph}>
          In Quora's Privacy Policy, they have explained in great
          detail how they intend to use user information, and even
          further clarifying that they do not sell to third parties.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    paddingBottom: 8,
  },

  // Breadcrumb Styles
  breadcrumb: {
    height: 65,
    backgroundColor: '#F2F2F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  breadcrumbText: {
    fontSize: 10,
    color: '#888888',
  },

  separator: {
    fontSize: 8,
    color: '#999999',
    marginHorizontal: 10,
  },

  policyContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 25,
    paddingBottom: 35,
  },

  pageTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#17202B',
    marginBottom: 25,
  },

  mainHeading: {
    fontSize: 19,
    fontWeight: '800',
    color: '#222222',
    marginBottom: 15,
    lineHeight: 27,
  },

  sectionHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222222',
    marginTop: 20,
    marginBottom: 15,
    lineHeight: 28,
  },

  subHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    marginTop: 18,
    marginBottom: 12,
    lineHeight: 23,
  },

  paragraph: {
    fontSize: 13,
    lineHeight: 23,
    color: '#58616C',
    textAlign: 'left',
    marginBottom: 16,
  },
});

export default PrivacyPolicy;