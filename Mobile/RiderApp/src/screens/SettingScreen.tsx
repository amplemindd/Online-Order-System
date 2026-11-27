import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';

import MaterialIcons from '@react-native-vector-icons/material-icons';

interface SettingsScreenProps {
  onGoBack?: () => void;
  onLogout?: () => void;
  onOpenSupport?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onGoBack,
  onLogout,
  onOpenSupport,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  return (
    <View style={styles.container}>
      {/* Header - Same as Profile Screen */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={25} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.dummySpace} />
      </View>

      <View style={styles.settingsList}>
        {/* Notifications */}
        <TouchableOpacity style={styles.item} activeOpacity={0.7}>
          <View style={styles.itemLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="notifications" size={22} color="#157544" />
            </View>
            <Text style={styles.itemText}>Notifications</Text>
          </View>

          <View style={styles.itemRight}>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D1D6', true: '#157544' }}
              thumbColor="#fff"
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </TouchableOpacity>

        {/* Location Services */}
        <TouchableOpacity style={styles.item} activeOpacity={0.7}>
          <View style={styles.itemLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="my-location" size={22} color="#157544" />
            </View>
            <Text style={styles.itemText}>Location Services</Text>
          </View>

          <View style={styles.itemRight}>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#D1D1D6', true: '#157544' }}
              thumbColor="#fff"
              ios_backgroundColor="#D1D1D6"
            />
          </View>
        </TouchableOpacity>

        {/* Language */}
        <TouchableOpacity style={styles.item} activeOpacity={0.7}>
          <View style={styles.itemLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="language" size={22} color="#157544" />
            </View>
            <Text style={styles.itemText}>Language</Text>
          </View>

          <View style={styles.itemRight}>
            <View style={styles.rightTextContainer}>
              <Text style={styles.rightText}>English</Text>
              <MaterialIcons name="chevron-right" size={18} color="#8E8E93" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Help & Support */}
        <TouchableOpacity
          style={styles.item}
          activeOpacity={0.7}
          onPress={onOpenSupport}
        >
          <View style={styles.itemLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="help" size={22} color="#157544" />
            </View>
            <Text style={styles.itemText}>Help & Support</Text>
          </View>

          <View style={styles.itemRight}>
            <MaterialIcons name="chevron-right" size={18} color="#8E8E93" />
          </View>
        </TouchableOpacity>

        {/* Terms & Conditions */}
        <TouchableOpacity style={styles.item} activeOpacity={0.7}>
          <View style={styles.itemLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="description" size={22} color="#157544" />
            </View>
            <Text style={styles.itemText}>Terms & Conditions</Text>
          </View>

          <View style={styles.itemRight}>
            <MaterialIcons name="chevron-right" size={18} color="#8E8E93" />
          </View>
        </TouchableOpacity>

        {/* Privacy Policy */}
        <TouchableOpacity style={styles.item} activeOpacity={0.7}>
          <View style={styles.itemLeft}>
            <View style={styles.iconCircle}>
              <MaterialIcons name="policy" size={22} color="#157544" />
            </View>
            <Text style={styles.itemText}>Privacy Policy</Text>
          </View>

          <View style={styles.itemRight}>
            <MaterialIcons name="chevron-right" size={18} color="#8E8E93" />
          </View>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.item, styles.logoutItem]}
          activeOpacity={0.7}
          onPress={onLogout}
        >
          <View style={styles.itemLeft}>
            <View style={styles.iconCircleLogout}>
              <MaterialIcons name="logout" size={22} color="#FF3B30" />
            </View>
            <Text style={[styles.itemText, styles.logoutText]}>Logout</Text>
          </View>

          <View style={styles.itemRight}>
            <MaterialIcons name="chevron-right" size={18} color="#8E8E93" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingVertical: 0,
  },

  // Header - Same as Profile
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

  settingsList: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },

  itemLast: {
    borderBottomWidth: 0,
  },

  logoutItem: {
    backgroundColor: '#FFF5F5',
  },

  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  iconCircleLogout: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  itemText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000000',
  },

  logoutText: {
    color: '#FF3B30',
  },

  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightText: {
    fontSize: 17,
    color: '#157544',
    marginRight: 8,
  },
});

export default SettingsScreen;
