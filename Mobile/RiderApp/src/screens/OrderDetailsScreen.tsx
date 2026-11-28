import React from 'react';
import { RiderOrder } from '../types/order';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface OrderDetailsScreenProps {
  order: RiderOrder;
  onNavigate?: () => void;
  onBack?: () => void;
}

const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  order,
  onNavigate,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Order Details</Text>
          <Text style={styles.orderId}>Order #{order.id}</Text>
        </View>

        {/* Order Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>ORDER STATUS</Text>

          <View style={styles.statusStep}>
            <View style={styles.completedDot}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Order Accepted</Text>
              <Text style={styles.statusSubtitle}>
              You have accepted this delivery request.
              </Text>
            </View>
          </View>

          <View style={styles.statusLine} />

          <View style={styles.statusStep}>
            <View style={styles.pendingDot} />
              <View style={styles.statusTextContainer}>
                <Text style={styles.pendingTitle}>Preparing Order</Text>
                <Text style={styles.statusSubtitle}>
                Waiting for the store to prepare the order.
                </Text>
              </View>
            </View>

            <View style={styles.statusLine} />

            <View style={styles.statusStep}>
              <View style={styles.pendingDot} />
                <View style={styles.statusTextContainer}>
                  <Text style={styles.pendingTitle}>Ready for Pickup</Text>
                  <Text style={styles.statusSubtitle}>
                  The order will be ready for collection.
                  </Text>
                </View>
              </View>
            </View>

        {/* Pickup Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>
          <View style={styles.locationRow}>
            <Text style={styles.pickupIcon}>📍</Text>
            <View style={styles.locationDetails}>
              <Text style={styles.locationName}>Store Pickup</Text>
              <Text style={styles.locationAddress}>
               Pickup address will be provided by the store.
              </Text>
              <Text style={styles.locationExtra}>
                Please contact the store for pickup instructions.
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Delivery Location</Text>

          <View style={styles.locationRow}>
            <Text style={styles.deliveryIcon}>🏠</Text>

            <View style={styles.locationDetails}>
              <Text style={styles.locationName}>{order.customer_name}</Text>
<Text style={styles.locationAddress}>
  {order.address}
  {order.apartment ? `, ${order.apartment}` : ''}
</Text>
<Text style={styles.locationAddress}>
  {order.city}, {order.state} - {order.postal_code}
</Text>
              <Text style={styles.locationExtra}>
              Deliver the order to the customer.
              </Text>
            </View>
          </View>
        </View>

        {/* Customer Details */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Customer Details</Text>

          <View style={styles.customerRow}>
            <View style={styles.customerAvatar}>
              <Text style={styles.avatarText}>
                {order.customer_name
                ?.split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()}
              </Text>
            </View>

            <View style={styles.customerInfo}>
             <Text style={styles.customerName}>{order.customer_name}</Text>
             <Text style={styles.customerPhone}>{order.customer_phone}</Text>
            </View>

            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>☎ Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Items */}
<View style={styles.infoCard}>
  <View style={styles.itemsHeader}>
    <Text style={styles.sectionTitle}>Order Items</Text>
    <Text style={styles.itemCount}>
      {order.items.length} Products
    </Text>
  </View>

  {order.items.map((item, index) => (
    <React.Fragment key={`${item.order_id}-${item.product_id}-${index}`}>
      <View style={styles.itemRow}>
        <View style={styles.itemImage}>
          <Text style={styles.itemEmoji}>🛒</Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>
            {item.product_name}
          </Text>

          <Text style={styles.itemQuantity}>
            Qty: {item.quantity}
            {item.product_size ? ` • ${item.product_size}` : ''}
          </Text>
        </View>

        <Text style={styles.itemPrice}>
          ₹{Number(item.subtotal).toFixed(2)}
        </Text>
      </View>

      {index !== order.items.length - 1 && (
        <View style={styles.itemDivider} />
      )}
    </React.Fragment>
  ))}
</View>


       {/* Payment Summary */}
<View style={styles.infoCard}>
  <Text style={styles.sectionTitle}>Payment Summary</Text>

  <View style={styles.paymentRow}>
    <Text style={styles.paymentLabel}>Items Subtotal</Text>
    <Text style={styles.paymentValue}>
      ₹
      {order.items
        .reduce((total, item) => total + Number(item.subtotal), 0)
        .toFixed(2)}
    </Text>
  </View>

  <View style={styles.paymentRow}>
    <Text style={styles.paymentLabel}>Order Total</Text>
    <Text style={styles.paymentValue}>
      ₹{Number(order.total_amount).toFixed(2)}
    </Text>
  </View>

  <View style={styles.paymentRow}>
    <Text style={styles.paymentLabel}>Payment Method</Text>
    <Text style={styles.paymentValue}>
      {order.payment_method?.toUpperCase()}
    </Text>
  </View>

  <View style={styles.paymentRow}>
    <Text style={styles.paymentLabel}>Payment Status</Text>
    <Text style={styles.paymentValue}>
      {order.payment_status?.toUpperCase()}
    </Text>
  </View>
</View>



      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={onNavigate}>
          <Text style={styles.navigateButtonText}>
            Navigate to Pickup →
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },

  header: {
    backgroundColor: '#00852B',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  backButton: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 18,
  },

  headerTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
  },

  orderId: {
    color: '#E5F5E8',
    fontSize: 13,
    marginTop: 6,
  },

  statusCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 18,
    borderRadius: 14,
    elevation: 2,
  },

  statusLabel: {
    fontSize: 11,
    color: '#888888',
    fontWeight: 'bold',
  },

  statusValue: {
    fontSize: 17,
    color: '#00852B',
    fontWeight: 'bold',
    marginTop: 10,
  },

  statusHint: {
    fontSize: 12,
    color: '#777777',
    marginTop: 6,
  },

  statusStep: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 15,
},

completedDot: {
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: '#16834A',
  justifyContent: 'center',
  alignItems: 'center',
},

checkMark: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: 'bold',
},

pendingDot: {
  width: 26,
  height: 26,
  borderRadius: 13,
  borderWidth: 2,
  borderColor: '#C9D8CC',
  backgroundColor: '#FFFFFF',
},

statusLine: {
  height: 22,
  borderLeftWidth: 2,
  borderStyle: 'dashed',
  borderColor: '#C9D8CC',
  marginLeft: 12,
},

statusTextContainer: {
  marginLeft: 12,
  flex: 1,
},

statusTitle: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#16834A',
},

pendingTitle: {
  fontSize: 14,
  fontWeight: '600',
  color: '#777777',
},

statusSubtitle: {
  fontSize: 11,
  color: '#888888',
  marginTop: 3,
},

  infoCard: {
  backgroundColor: '#FFFFFF',
  marginHorizontal: 16,
  marginBottom: 14,
  padding: 18,
  borderRadius: 14,
  elevation: 2,
},

sectionTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#222222',
  marginBottom: 16,
},

locationRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

pickupIcon: {
  fontSize: 23,
  marginRight: 13,
},

deliveryIcon: {
  fontSize: 23,
  marginRight: 13,
},

locationDetails: {
  flex: 1,
},

locationName: {
  fontSize: 15,
  fontWeight: 'bold',
  color: '#222222',
},

locationAddress: {
  fontSize: 13,
  color: '#666666',
  marginTop: 5,
},

locationExtra: {
  fontSize: 12,
  color: '#888888',
  marginTop: 7,
},

customerRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

customerAvatar: {
  width: 45,
  height: 45,
  borderRadius: 25,
  backgroundColor: '#E8F5E9',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

avatarText: {
  color: '#00852B',
  fontSize: 16,
  fontWeight: 'bold',
},

customerInfo: {
  flex: 1,
},

customerName: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#222222',
},

customerPhone: {
  fontSize: 12,
  color: '#777777',
  marginTop: 5,
},

callButton: {
  backgroundColor: '#E8F5E9',
  paddingHorizontal: 13,
  paddingVertical: 9,
  borderRadius: 20,
},

callButtonText: {
  color: '#00852B',
  fontSize: 12,
  fontWeight: 'bold',
},

itemsHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

itemCount: {
  fontSize: 12,
  color: '#00852B',
  fontWeight: 'bold',
  backgroundColor: '#E8F5E9',
  paddingHorizontal: 10,
  paddingVertical: 5,
  borderRadius: 12,
},

itemRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
},

itemImage: {
  width: 48,
  height: 48,
  borderRadius: 10,
  backgroundColor: '#F5F7F5',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},

itemEmoji: {
  fontSize: 25,
},

itemInfo: {
  flex: 1,
},

itemName: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#222222',
},

itemQuantity: {
  fontSize: 12,
  color: '#777777',
  marginTop: 5,
},

itemPrice: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#222222',
},

itemDivider: {
  height: 1,
  backgroundColor: '#EEEEEE',
},

paymentRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 8,
},

paymentLabel: {
  fontSize: 13,
  color: '#777777',
},

paymentValue: {
  fontSize: 13,
  color: '#333333',
  fontWeight: '600',
},

discountValue: {
  fontSize: 13,
  color: '#16834A',
  fontWeight: '600',
},

paymentDivider: {
  height: 1,
  backgroundColor: '#EEEEEE',
  marginVertical: 12,
},

totalLabel: {
  fontSize: 14,
  color: '#222222',
  fontWeight: 'bold',
},

totalValue: {
  fontSize: 15,
  color: '#222222',
  fontWeight: 'bold',
},

paymentMethod: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 15,
  paddingTop: 12,
  borderTopWidth: 1,
  borderTopColor: '#EEEEEE',
},

paymentMethodValue: {
  fontSize: 12,
  color: '#00852B',
  fontWeight: 'bold',
},

riderEarningCard: {
  backgroundColor: '#E8F5E9',
  padding: 14,
  borderRadius: 10,
  marginTop: 18,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

riderEarningLabel: {
  fontSize: 13,
  color: '#333333',
  fontWeight: '600',
},

riderEarningValue: {
  fontSize: 20,
  color: '#00852B',
  fontWeight: 'bold',
},

  bottomContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    elevation: 5,
  },

  navigateButton: {
    backgroundColor: '#00852B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  navigateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default OrderDetailsScreen;