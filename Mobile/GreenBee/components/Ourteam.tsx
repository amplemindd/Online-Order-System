import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

const teamMembers = [
  {
    id: '1',
    name: 'William James',
    role: 'CEO - Vinova',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac pretium metus. Curabitur velit sem, egestas sit amet dolor nec, tris tique.',
    phone: '(+612) 2531 5600',
    email: 'sonata@domain.com',
    image: require('../assets/images/ceo2.jpeg'),
  },
  {
    id: '2',
    name: 'Rebecca Jenkins',
    role: 'Developer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac pretium metus. Curabitur velit sem, egestas sit amet dolor nec, tris tique.',
    phone: '(+312) 2531 5600',
    email: 'minimart@domain.com',
    image: require('../assets/images/ceo1.jpeg'),
  },
  {
    id: '3',
    name: 'Alex Nguyen',
    role: 'Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac pretium metus. Curabitur velit sem, egestas sit amet dolor nec, tris tique.',
    phone: '(+612) 2531 5600',
    email: 'sonata@domain.com',
    image: require('../assets/images/ceo3.jpeg'),
  },
  {
    id: '4',
    name: 'Lucy Watson',
    role: 'Designer',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac pretium metus. Curabitur velit sem, egestas sit amet dolor nec, tris tique.',
    phone: '(+612) 2531 5600',
    email: 'lucy@domain.com',
    image: require('../assets/images/ceo4.jpeg'),
  },
  {
    id: '5',
    name: 'Support Team',
    role: 'Customer Support',
    description:
      'Our support team is always ready to help you. Contact us anytime for assistance and quick solutions to your queries.',
    phone: '(+612) 2531 5600',
    email: 'support@domain.com',
    image: require('../assets/images/ceo1.jpeg'),
  },
  {
    id: '6',
    name: 'Account Manager',
    role: 'Account Management',
    description:
      'Our account manager helps clients manage their accounts, provides expert guidance and ensures a smooth experience.',
    phone: '(+612) 2531 5600',
    email: 'manager@domain.com',
    image: require('../assets/images/ceo3.jpeg'),
  },
  {
    id: '7',
    name: 'Account Manager',
    role: 'Senior Account Manager',
    description:
      'Our senior account manager is dedicated to building strong client relationships and providing professional account assistance.',
    phone: '(+612) 2531 5600',
    email: 'accounts@domain.com',
    image: require('../assets/images/ceo4.jpeg'),
  },
];

const OurTeam: React.FC = () => {

  const openPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const openEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const openSocial = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* Breadcrumb - Same as Testimonial */}
        <View style={styles.breadcrumb}>

          <Text style={styles.breadcrumbText}>
            Home
          </Text>

          <Text style={styles.separator}>
            ◆
          </Text>

          <Text style={styles.breadcrumbText}>
            Page Ourteam
          </Text>

        </View>

        {/* Main Content */}
        <View style={styles.content}>

          <Text style={styles.heading}>
            Meet Our Team
          </Text>

          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Sed ac pretium metus. Curabitur velit sem,
            egestas sit amet dolor nec, tristique vulputate enim.
            Etiam a lorem libero. In egestas ultricies convallis.
            Sed iaculis arcu id justo dapibus pharetra.
            Maecenas et aliquam eros, sit amet volutpat nisi.
            Duis feugiat mattis maximus. Nulla sollicitudin
            lorem vitae neque ultricies efficitur. Sed pulvinar
            tellus enim, non tincidunt nisl imperdiet quis.
            Maecenas maximus lorem eu justo tincidunt mollis.
            Quisque vulputate, leo nec elementum rutrum, risus
            diam rhoncus nulla, ac sollicitudin dui augue
            convallis sem. Sed sit amet nulla lorem. Ut fringilla
            justo nisi, nec interdum diam pretium ac. In iaculis
            porttitor sem.
          </Text>

        </View>

        {/* Team Members */}
        <View style={styles.teamContainer}>

          {teamMembers.map((member) => (

            <View
              key={member.id}
              style={styles.memberCard}
            >

              {/* Profile Image */}
              <Image
                source={member.image}
                style={styles.profileImage}
                resizeMode="cover"
              />

              {/* Member Details */}
              <View style={styles.memberInfo}>

                <Text style={styles.memberName}>
                  {member.name}
                </Text>

                <Text style={styles.memberRole}>
                  {member.role}
                </Text>

                <Text style={styles.memberDescription}>
                  {member.description}
                </Text>

                {/* Contact Details */}
                <View style={styles.contactContainer}>

                  <TouchableOpacity
                    style={styles.contactRow}
                    onPress={() => openPhone(member.phone)}
                  >

                    <Text style={styles.contactIcon}>
                      ♧
                    </Text>

                    <Text style={styles.contactText}>
                      {member.phone}
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.contactRow}
                    onPress={() => openEmail(member.email)}
                  >

                    <Text style={styles.contactIcon}>
                      ✉
                    </Text>

                    <Text style={styles.contactText}>
                      {member.email}
                    </Text>

                  </TouchableOpacity>

                </View>

                {/* Social Media Icons */}
                <View style={styles.socialContainer}>

                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openSocial('https://facebook.com')}
                  >
                    <Text style={styles.socialText}>f</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openSocial('https://twitter.com')}
                  >
                    <Text style={styles.socialText}>♥</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openSocial('https://pinterest.com')}
                  >
                    <Text style={styles.socialText}>p</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.socialButton}
                    onPress={() => openSocial('https://instagram.com')}
                  >
                    <Text style={styles.socialText}>◎</Text>
                  </TouchableOpacity>

                  {member.id === '1' && (
                    <TouchableOpacity
                      style={styles.socialButton}
                      onPress={() => openSocial('https://dribbble.com')}
                    >
                      <Text style={styles.socialText}>◉</Text>
                    </TouchableOpacity>
                  )}

                </View>

              </View>

            </View>

          ))}

        </View>

      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 0,
  },

  // Breadcrumb - Same as Testimonial
  breadcrumb: {
    height: 65,
    width: '100%',
    backgroundColor: '#F2F2F2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    margin: 0,
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

  // Main Content
  content: {
    paddingTop: 17,
    marginHorizontal: 30,
    marginBottom: 28,
  },

  heading: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 10,
  },

  description: {
    fontSize: 13,
    lineHeight: 19.5,
    color: '#111111',
  },

  // Team Members
  teamContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },

  memberCard: {
    width: '100%',
    marginBottom: 40,
    backgroundColor: '#FFFFFF',
  },

  profileImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#F3F3F3',
  },

  memberInfo: {
    paddingTop: 20,
  },

  memberName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 6,
  },

  memberRole: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 13,
  },

  memberDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: '#444444',
    marginBottom: 13,
  },

  // Contact Details
  contactContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    paddingVertical: 8,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
  },

  contactIcon: {
    width: 35,
    fontSize: 19,
    color: '#BBBBBB',
  },

  contactText: {
    fontSize: 13,
    color: '#222222',
  },

  // Social Icons
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 8,
  },

  socialButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#BDBDBD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  socialText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },

});

export default OurTeam;