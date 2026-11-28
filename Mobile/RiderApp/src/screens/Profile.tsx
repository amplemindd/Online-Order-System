import React, {useEffect, useState} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from '@react-native-vector-icons/material-icons';

interface MenuItem {
  id: string;
  title: string;
  iconName: string;
  color: string;
  isLogout?: boolean;
}

interface RiderUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  role: string;
  vehicle_type?: string;
  status?: string;
}

interface ProfileScreenProps {
  onGoBack?: () => void;
  onOpenEarnings?: () => void;
  onOpenSupport?: () => void;
  onLogout?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onGoBack,
  onOpenEarnings,
  onOpenSupport,
  onLogout,
}) => {
  const [rider, setRider] = useState<RiderUser | null>(null);

  useEffect(() => {
    const loadRiderProfile = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('riderUser');

        if (storedUser) {
          setRider(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Unable to load rider profile:', error);
      }
    };

    loadRiderProfile();
  }, []);

  const fullName = rider
    ? `${rider.first_name || ''} ${rider.last_name || ''}`.trim()
    : 'Loading profile...';

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'My Earnings',
      iconName: 'account-balance-wallet',
      color: '#157544',
    },
    {
      id: '2',
      title: 'My Orders',
      iconName: 'receipt-long',
      color: '#157544',
    },
    {
      id: '3',
      title: 'Ratings & Reviews',
      iconName: 'star-border',
      color: '#157544',
    },
    {
      id: '4',
      title: 'Bank Details',
      iconName: 'account-balance',
      color: '#157544',
    },
    {
      id: '5',
      title: 'Support',
      iconName: 'support-agent',
      color: '#157544',
    },
    {
      id: '6',
      title: 'Logout',
      iconName: 'logout',
      color: '#D9383A',
      isLogout: true,
    },
  ];

  const renderIcon = (item: MenuItem) => {
    return (
      <MaterialIcons name={item.iconName as any} size={22} color={item.color} />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Profile</Text>

        <View style={styles.dummySpace} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Profile Image */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={require('../assets/images/deliverpartner.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.userName}>{fullName}</Text>

          <Text style={styles.riderId}>
            Rider ID: {rider ? `TM${rider.id}` : '---'}
          </Text>
        </View>

        {/* Rider Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={20} color="#157544" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Mobile Number</Text>
              <Text style={styles.detailValue}>
                {rider?.mobile_number || 'Not available'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={20} color="#157544" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>
                {rider?.email || 'Not available'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="two-wheeler" size={20} color="#157544" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Vehicle Type</Text>
              <Text style={styles.detailValue}>
                {rider?.vehicle_type || 'Not available'}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="verified-user" size={20} color="#157544" />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Account Status</Text>
              <Text style={styles.detailValue}>
                {rider?.status || 'Not available'}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Card */}
        <View style={styles.card}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.title === 'My Earnings') {
                    onOpenEarnings?.();
                  } else if (item.title === 'Support') {
                    onOpenSupport?.();
                  } else if (item.title === 'Logout') {
                    onLogout?.();
                  } else {
                    console.log(`${item.title} pressed`);
                  }
                }}>
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconWrapper}>{renderIcon(item)}</View>

                  <Text
                    style={[
                      styles.menuText,
                      item.isLogout && styles.logoutText,
                    ]}>
                    {item.title}
                  </Text>
                </View>

                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color="#C4C4C4"
                />
              </TouchableOpacity>

              {index < menuItems.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6F8',
  },

  header: {
    backgroundColor: '#0F7A44',
    height: 60,
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
  },

  dummySpace: {
    width: 32,
  },

  content: {
    paddingBottom: 30,
  },

  profileSection: {
    alignItems: 'center',
    marginVertical: 24,
  },

  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2F0E7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },

      android: {
        elevation: 4,
      },
    }),
  },

  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },

  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 12,
  },

  riderId: {
    fontSize: 14,
    color: '#7D7D7D',
    marginTop: 4,
  },

  detailsCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  detailTextContainer: {
    marginLeft: 14,
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: '#888888',
  },

  detailValue: {
    fontSize: 15,
    color: '#222222',
    fontWeight: '500',
    marginTop: 3,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 6,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },

      android: {
        elevation: 2,
      },
    }),
  },

  menuItem: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconWrapper: {
    width: 32,
    height: 28,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  menuText: {
    fontSize: 16,
    color: '#2D2D2D',
    fontWeight: '500',
    marginLeft: 8,
  },

  logoutText: {
    color: '#D9383A',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 56,
  },
});