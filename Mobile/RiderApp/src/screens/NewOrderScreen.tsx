import React, {useState} from 'react';
import { RiderOrder } from '../types/order';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { apiRequest } from '../services/api';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface NewOrderScreenProps {
  order: RiderOrder;
  onAccept?: () => void;
  onReject?: () => void;
}

const NewOrderScreen: React.FC<NewOrderScreenProps> = ({
  order,
  onAccept,
  onReject,
}) => {
    const [isAccepting, setIsAccepting] = useState(false);

    const handleAccept = async () => {
  try {
    setIsAccepting(true);

    const token = await AsyncStorage.getItem('riderToken');

    if (!token) {
      throw new Error('Please log in again.');
    }

    const response = await apiRequest(
      `/rider/orders/${order.id}/accept`,
      {
        method: 'POST',
      },
      token,
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to accept order.');
    }

    onAccept?.();

  } catch (error: any) {
    Alert.alert(
      'Unable to Accept Order',
      error.message || 'Please try again.',
    );
  } finally {
    setIsAccepting(false);
  }
};


  return (
    // <View style={styles.container}>
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBar barStyle="light-content" />

      <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <View style={styles.notificationIcon}>
               <Text style={{fontSize: 25}}>🔔</Text>
            </View>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>New Order Received!</Text>
              <Text style={styles.headerSubtitle}>
              A new delivery request is waiting for you.
              </Text>
            </View>
          </View>

          <View style={styles.newOrderBadge}>
            <View style={styles.onlineDot} />
              <Text style={styles.badgeText}>NEW DELIVERY REQUEST</Text>
            </View>
          </View>

          {/* Order Summary */}
<View style={styles.orderCard}>
  <Text style={styles.sectionTitle}>Delivery Information</Text>

  {/* Delivery Location */}
  <View style={styles.routeRow}>
    <View style={styles.routeIcons}>
      <Text style={styles.dropIcon}>🏠</Text>
    </View>

    <View style={styles.locationDetails}>
      <Text style={styles.locationLabel}>DELIVERY LOCATION</Text>
      <Text style={styles.locationName}>{order.customer_name}</Text>
      <Text style={styles.locationAddress}>
        {order.address}
        {order.apartment ? `, ${order.apartment}` : ''}
      </Text>
      <Text style={styles.locationAddress}>
        {order.city}, {order.state} - {order.postal_code}
      </Text>
      <Text style={styles.locationAddress}>
        Phone: {order.customer_phone}
      </Text>
    </View>
  </View>

  <View style={styles.orderSummary}>
    <Text style={styles.summaryLabel}>Order ID</Text>
    <Text style={styles.summaryValue}>#{order.id}</Text>
  </View>

  <View style={styles.orderSummary}>
    <Text style={styles.summaryLabel}>Total Items</Text>
    <Text style={styles.summaryValue}>
      {order.items.reduce((total, item) => total + Number(item.quantity), 0)} Items
    </Text>
  </View>

  <View style={styles.orderSummary}>
    <Text style={styles.summaryLabel}>Payment Method</Text>
    <Text style={styles.summaryValue}>
      {order.payment_method?.toUpperCase()}
    </Text>
  </View>

  <View style={styles.orderSummary}>
    <Text style={styles.summaryLabel}>Order Amount</Text>
    <Text style={styles.summaryValue}>
      ₹{Number(order.total_amount).toFixed(2)}
    </Text>
  </View>
</View>
      </ScrollView>



      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={styles.rejectButton}
        onPress={onReject}
        disabled={isAccepting}
        activeOpacity={0.7}
        >
            <Text style={styles.rejectText}>✕  Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
         style={styles.acceptButton}
         onPress={handleAccept}
         disabled={isAccepting}
         activeOpacity={0.8}
        >

        <Text style={styles.acceptText}>
  {isAccepting ? 'Accepting...' : '✓ Accept Order'}
</Text>

        </TouchableOpacity>
       </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F5',
  },

  header: {
  backgroundColor: '#16834A',
  paddingHorizontal: 22,
  paddingTop: 25,
  paddingBottom: 22,
  borderBottomLeftRadius: 25,
  borderBottomRightRadius: 25,
},

headerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#FFFFFF',
},

headerSubtitle: {
  fontSize: 12,
  color: '#E5F5EA',
  marginTop: 5,
},

  headerTopRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

notificationIcon: {
  width: 50,
  height: 50,
  borderRadius: 15,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 14,
},

headerTextContainer: {
  flex: 1,
},

newOrderBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#26945D',
  alignSelf: 'flex-start',
  paddingHorizontal: 12,
  paddingVertical: 7,
  borderRadius: 20,
  marginTop: 18,
},

onlineDot: {
  width: 7,
  height: 7,
  borderRadius: 5,
  backgroundColor: '#B9F6CA',
  marginRight: 7,
},

badgeText: {
  fontSize: 10,
  fontWeight: 'bold',
  color: '#FFFFFF',
  letterSpacing: 0.7,
},

  timerContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  timerLabel: {
    fontSize: 14,
    color: '#666666',
  },

  timer: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#16834A',
    marginVertical: 5,
  },

  timerHint: {
    fontSize: 12,
    color: '#888888',
  },

  scrollView: {
  flex: 1,
},

scrollContent: {
  paddingBottom: 15,
},

buttonContainer: {
  flexDirection: 'row',
  paddingHorizontal: 18,
  paddingTop: 12,
  paddingBottom: 12,
  gap: 12,
  backgroundColor: '#FFFFFF',
  borderTopWidth: 1,
  borderTopColor: '#EEEEEE',
  alignItems: 'center',
},

progressBar: {
  width: '75%',
  height: 7,
  backgroundColor: '#E0E0E0',
  borderRadius: 10,
  marginVertical: 10,
  overflow: 'hidden',
},

progressFill: {
  height: '100%',
  backgroundColor: '#16834A',
  borderRadius: 10,
},

 earningCard: {
  backgroundColor: '#E4F5E9',
  marginHorizontal: 18,
  marginVertical: 12,
  padding: 15,
  borderRadius: 16,
  alignItems: 'center',
  elevation: 2,
},

earningLabel: {
  fontSize: 12,
  color: '#555555',
  fontWeight: '600',
  letterSpacing: 0.8,
},

earningAmount: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#16834A',
  marginTop: 6,
},

earningDivider: {
  height: 1,
  backgroundColor: '#C5E5CE',
  width: '100%',
  marginVertical: 15,
},

earningRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginVertical: 5,
},

earningDetail: {
  fontSize: 13,
  color: '#555555',
},

orderCard: {
  backgroundColor: '#FFFFFF',
  marginHorizontal: 18,
  marginBottom: 12,
  padding: 15,
  borderRadius: 15,
  elevation: 3,
  borderWidth: 1,
  borderColor: '#EEEEEE',
},

  estimatedTime: {
  color: '#16834A',
  fontSize: 13,
  fontWeight: 'bold',
},

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 20,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  locationDetails: {
    flex: 1,
  },

  locationLabel: {
    fontSize: 11,
    color: '#888888',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  locationName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222222',
  },

  locationAddress: {
    fontSize: 13,
    color: '#777777',
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 17,
  },

  routeRow: {
  flexDirection: 'row',
  alignItems: 'stretch',
},

routeIcons: {
  width: 40,
  alignItems: 'center',
},

routeLine: {
  height: 55,
  borderLeftWidth: 2,
  borderStyle: 'dashed',
  borderColor: '#16834A',
},

locationIcon: {
  fontSize: 20,
},

dropIcon: {
  fontSize: 20,
},

  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  summaryLabel: {
    color: '#777777',
    fontSize: 13,
  },

  summaryValue: {
    color: '#222222',
    fontSize: 13,
    fontWeight: 'bold',
  },

  rejectButton: {
  flex: 1,
  height: 54,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: '#E65B50',
  alignItems: 'center',
  justifyContent: 'center',
},

acceptButton: {
  flex: 2,
  height: 54,
  borderRadius: 12,
  backgroundColor: '#16834A',
  alignItems: 'center',
  justifyContent: 'center',
},

  rejectText: {
    color: '#E65B50',
    fontSize: 15,
    fontWeight: 'bold',
  },

  acceptText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default NewOrderScreen;