import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

const testimonials = [
  {
    id: '1',
    image: require('../assets/images/ceo1.jpeg'),
  },
  {
    id: '2',
    image: require('../assets/images/ceo2.jpeg'),
  },
  {
    id: '3',
    image: require('../assets/images/ceo3.jpeg'),
  },
  {
    id: '4',
    image: require('../assets/images/ceo4.jpeg'),
  },
];

const Testimonial: React.FC = () => {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Breadcrumb */}
      <View style={styles.breadcrumb}>
        <Text style={styles.breadcrumbText}>
          Home
        </Text>
        <Text style={styles.separator}>◆</Text>
        <Text style={styles.breadcrumbText}>
          Page Testimonial
        </Text>
      </View>

      {/* Page Heading */}
      <Text style={styles.heading}>
        Testimonial
      </Text>

      {/* Testimonial Cards */}
      <View style={styles.testimonialContainer}>
        {testimonials.map((item) => (
          <View key={item.id} style={styles.card}>

            {/* Profile Image */}
            <Image
              source={item.image}
              style={styles.profileImage}
            />

            {/* Name */}
            <Text style={styles.name}>
              WILLIAM JAMES
            </Text>

            {/* Designation */}
            <Text style={styles.designation}>
              CEO - Vinova
            </Text>

            {/* Description */}
            <Text style={styles.description}>
              Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Mauris augue mi, interdum ut
              purus id, blandit suscipit mauris. Sed tortor
              lorem, eleifend non urna non, congue bibendum
              libero. Duis sodales pellentesque sagittis.
              Fusce venenatis sagittis pellentesque. Nunc
              eu eros in ipsum semper condimentum in a risus.
            </Text>

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

  heading: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#111111',
    marginTop: 17,
    marginBottom: 32,
    marginHorizontal: 30,
  },

  testimonialContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
  },

  card: {
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 29,
    backgroundColor: '#FFFFFF',
  },

  profileImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 7,
    backgroundColor: '#F3F3F3',
  },

  name: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },

  designation: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 14,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    color: '#111111',
    textAlign: 'center',
  },
});

export default Testimonial;