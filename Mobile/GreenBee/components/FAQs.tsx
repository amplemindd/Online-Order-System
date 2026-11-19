import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const faqData = [
  {
    question: 'How can I place an order?',
    answer:
      'Browse our products, select the items you want, add them to your cart and proceed to checkout.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'Available payment methods will be displayed during checkout. Please select from the options provided.',
  },
  {
    question: 'How can I track my order?',
    answer:
      'You can check your order status through the Orders section of your account once order tracking is available.',
  },
  {
    question: 'Do you offer home delivery?',
    answer:
      'Yes! Greenbee is designed to make grocery shopping convenient by bringing your selected products to your doorstep.',
  },
  {
    question: 'Can I cancel my order?',
    answer:
      'Please contact our customer support as soon as possible to request an order cancellation.',
  },
  {
    question: 'What if I receive damaged products?',
    answer:
      'Contact our customer support with your order details so that we can assist you with the issue.',
  },
  {
    question: 'How can I add products to my wishlist?',
    answer:
      'Tap the wishlist option on a product to save it. You can view your saved products in the Wishlist section.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'Visit our Contact Us page to find our customer service phone number, email address and contact form.',
  },
];

const FAQs: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex(
      expandedIndex === index ? null : index
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>

        <Text style={styles.heading}>
          Frequently asked question
        </Text>

        {faqData.map((item, index) => {
          const isExpanded = expandedIndex === index;

          return (
            <View key={index} style={styles.faqContainer}>

              <TouchableOpacity
                style={styles.questionRow}
                activeOpacity={0.7}
                onPress={() => toggleFAQ(index)}
              >
                <View style={styles.numberBox}>
                  <Text style={styles.number}>
                    {index + 1}
                  </Text>
                </View>

                <View style={styles.questionBox}>
                  <Text style={styles.question}>
                    {item.question}
                  </Text>
                </View>

                <View style={styles.iconBox}>
                  <Text style={styles.icon}>
                    {isExpanded ? '−' : '+'}
                  </Text>
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.answerBox}>
                  <Text style={styles.answer}>
                    {item.answer}
                  </Text>
                </View>
              )}

            </View>
          );
        })}

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
    paddingTop: 35,
    paddingBottom: 55,
  },

  heading: {
    fontSize: 27,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 70,
  },

  faqContainer: {
    marginBottom: 9,
  },

  questionRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#F8F8F8',
    minHeight: 70,
  },

  numberBox: {
    width: 70,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  number: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },

  questionBox: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 17,
    paddingHorizontal: 16,
  },

  question: {
    fontSize: 17,
    fontWeight: '700',
    color: '#252525',
    lineHeight: 25,
  },

  iconBox: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    fontSize: 29,
    fontWeight: '600',
    color: '#222222',
  },

  answerBox: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 17,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },

  answer: {
    fontSize: 15,
    lineHeight: 24,
    color: '#666666',
  },
});

export default FAQs;