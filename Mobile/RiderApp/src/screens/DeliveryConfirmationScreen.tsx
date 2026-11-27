import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../services/api';
import { RiderOrder } from '../types/order';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface DeliveryConfirmationScreenProps {
  order: RiderOrder;
  onBack?: () => void;
  onConfirm?: () => void;
}

const DeliveryConfirmationScreen: React.FC<
  DeliveryConfirmationScreenProps
> = ({order, onBack, onConfirm}) => {


const [isConfirming, setIsConfirming] = useState(false);

const handleConfirmDelivery = async () => {
  try {
    setIsConfirming(true);

    const token = await AsyncStorage.getItem('riderToken');

    if (!token) {
      throw new Error('Please log in again.');
    }

    const response = await apiRequest(
      `/rider/orders/${order.id}/deliver`,
      {
        method: 'PUT',
      },
      token,
    );

    if (!response.success) {
      throw new Error(response.message || 'Unable to confirm delivery.');
    }

    Alert.alert(
      'Delivery Successful',
      'The order has been marked as delivered.',
    );

    onConfirm?.();

  } catch (error: any) {
    Alert.alert(
      'Delivery Failed',
      error.message || 'Unable to update order status.',
    );
  } finally {
    setIsConfirming(false);
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Delivery Confirmation</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✓</Text>
        </View>

            <Text style={styles.successTitle}>Order Delivered!</Text>

            <Text style={styles.successSubtitle}>
                Great job! You have successfully delivered the order.
            </Text>

        <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>
                DELIVERY COMPLETED
            </Text>
        </View>

        <View style={styles.deliveryCard}>
            <Text style={styles.deliveryCardTitle}>Delivery Summary</Text>

            <View style={styles.deliveryRow}>
  <Text style={styles.deliveryLabel}>Order ID</Text>
  <Text style={styles.deliveryValue}>#{order.id}</Text>
</View>

<View style={styles.deliveryRow}>
  <Text style={styles.deliveryLabel}>Customer</Text>
  <Text style={styles.deliveryValue}>{order.customer_name}</Text>
</View>

<View style={styles.deliveryRow}>
  <Text style={styles.deliveryLabel}>Delivery Address</Text>
  <Text style={styles.deliveryValue}>
    {order.address}, {order.city}, {order.state} - {order.postal_code}
  </Text>
</View>

<View style={styles.deliveryRow}>
  <Text style={styles.deliveryLabel}>Order Total</Text>
  <Text style={styles.earningsValue}>
    ₹{Number(order.total_amount).toFixed(2)}
  </Text>
</View>

        </View>

     </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
            Alert.alert(
                'Confirm Delivery',
                'Are you sure you have successfully delivered this order?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Yes, Delivered',
                        onPress: handleConfirmDelivery,
                    },
                ],
            );
        }}>
          <Text style={styles.confirmButtonText}>
            Confirm Delivery
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },
  header: {
    backgroundColor: '#00852B',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 30,
    marginRight: 15,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconContainer: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: '#E1F5E6',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
  borderWidth: 3,
  borderColor: '#A5D6AE',
},
successIcon: {
  fontSize: 55,
  color: '#16834A',
  fontWeight: 'bold',
},
successTitle: {
  fontSize: 25,
  fontWeight: 'bold',
  color: '#222222',
  marginBottom: 10,
},
successSubtitle: {
  fontSize: 14,
  color: '#777777',
  textAlign: 'center',
  paddingHorizontal: 30,
  lineHeight: 21,
},
successBadge: {
  backgroundColor: '#E8F5E9',
  paddingHorizontal: 18,
  paddingVertical: 9,
  borderRadius: 20,
  marginTop: 22,
},
successBadgeText: {
  color: '#16834A',
  fontSize: 11,
  fontWeight: 'bold',
  letterSpacing: 1,
},
deliveryCard: {
  width: '90%',
  backgroundColor: '#FFFFFF',
  padding: 18,
  borderRadius: 12,
  marginTop: 30,
  elevation: 2,
},
deliveryCardTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#222222',
  marginBottom: 15,
},
deliveryRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 9,
},
deliveryLabel: {
  fontSize: 12,
  color: '#888888',
  flex: 1,
},
deliveryValue: {
  fontSize: 12,
  color: '#333333',
  fontWeight: '600',
  flex: 1,
  textAlign: 'right',
},
earningsValue: {
  fontSize: 15,
  color: '#16834A',
  fontWeight: 'bold',
},
  placeholder: {
    fontSize: 18,
    color: '#777777',
  },
  bottomContainer: {
    padding: 18,
    backgroundColor: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: '#00852B',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});