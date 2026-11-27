import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest } from '../services/api';

interface EarningsScreenProps {
  onBack: () => void;
}

type Period = 'Today' | 'Week' | 'Month';

interface ChartItem {
  label: string;
  orders: number;
  earnings: number;
}

interface Transaction {
  order_id: number;
  delivered_at: string;
  earning_amount: number;
}

interface EarningsResponse {
  success: boolean;
  summary: {
    totalEarnings: number;
    totalOrders: number;
    averageEarning: number;
  };
  chartData: ChartItem[];
  transactions: Transaction[];
}

const EarningsScreen: React.FC<EarningsScreenProps> = ({ onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('Today');

  const [earnings, setEarnings] = useState<EarningsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (amount: number) =>
    `₹${Number(amount || 0).toLocaleString('en-IN')}`;

  const fetchEarnings = async (period: Period) => {
    try {
      setLoading(true);
      setError('');

      const token = await AsyncStorage.getItem('riderToken');

      if (!token) {
        throw new Error('Please log in again to view your earnings.');
      }

      const periodValue = period.toLowerCase();

      const response = (await apiRequest(
        `/rider/earnings?period=${periodValue}`,
        { method: 'GET' },
        token,
      )) as EarningsResponse;

      setEarnings(response);
    } catch (err: any) {
      console.error('Earnings fetch error:', err);
      setError(err.message || 'Unable to load earnings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings(selectedPeriod);
  }, [selectedPeriod]);

  const chartData = earnings?.chartData || [];

  const maximumEarning = Math.max(
    ...chartData.map(item => Number(item.earnings)),
    0,
  );

  const getBarHeight = (amount: number) => {
    if (maximumEarning === 0) return 5;

    return Math.max(5, (amount / maximumEarning) * 110);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Lucide name="arrow-left" size={24} color="#222222" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Earnings</Text>

          <TouchableOpacity onPress={() => fetchEarnings(selectedPeriod)}>
            <Lucide name="refresh-cw" size={22} color="#222222" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          {(['Today', 'Week', 'Month'] as Period[]).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.filterButton,
                selectedPeriod === period && styles.activeFilter,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedPeriod === period && styles.activeFilterText,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00852B" />
            <Text style={styles.loadingText}>Loading earnings...</Text>
          </View>
        ) : error ? (
          <View style={styles.messageCard}>
            <Text style={styles.errorText}>{error}</Text>

            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchEarnings(selectedPeriod)}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.earningsCard}>
              <Text style={styles.earningsLabel}>Total Earnings</Text>

              <Text style={styles.earningsAmount}>
                {formatCurrency(earnings?.summary.totalEarnings || 0)}
              </Text>

              <View style={styles.earningsGrowth}>
                <Lucide name="trending-up" size={16} color="#FFFFFF" />
                <Text style={styles.earningsGrowthText}>
                  Your earnings summary
                </Text>
              </View>
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Earnings Overview</Text>
                <Text style={styles.chartSubtitle}>
                  {selectedPeriod === 'Today'
                    ? 'Today'
                    : selectedPeriod === 'Week'
                      ? 'Last 7 Days'
                      : 'This Month'}
                </Text>
              </View>

              {chartData.length > 0 ? (
                <View style={styles.chart}>
                  {chartData.map((item, index) => (
                    <View key={index} style={styles.chartColumn}>
                      <View
                        style={[
                          styles.bar,
                          { height: getBarHeight(Number(item.earnings)) },
                        ]}
                      />
                      <Text style={styles.chartDay}>{item.label}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyChart}>
                  <Text style={styles.emptyText}>
                    No earnings recorded for this period.
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statsCard}>
                <View style={styles.statsIcon}>
                  <Lucide name="package-check" size={22} color="#00852B" />
                </View>

                <Text style={styles.statsValue}>
                  {earnings?.summary.totalOrders || 0}
                </Text>

                <Text style={styles.statsLabel}>Total Orders</Text>
              </View>

              <View style={styles.statsCard}>
                <View style={styles.statsIcon}>
                  <Lucide name="indian-rupee" size={22} color="#00852B" />
                </View>

                <Text style={styles.statsValue}>
                  {formatCurrency(earnings?.summary.averageEarning || 0)}
                </Text>

                <Text style={styles.statsLabel}>Average per Order</Text>
              </View>
            </View>

            <View style={styles.transactionSection}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionTitle}>
                  Recent Transactions
                </Text>
              </View>

              {earnings?.transactions &&
              earnings.transactions.length > 0 ? (
                earnings.transactions.map((item, index) => (
                  <View key={`${item.order_id}-${index}`} style={styles.transactionCard}>
                    <View style={styles.transactionIcon}>
                      <Lucide name="wallet" size={21} color="#00852B" />
                    </View>

                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionId}>
                        #TM{item.order_id}
                      </Text>

                      <Text style={styles.transactionDate}>
                        {formatDate(item.delivered_at)}
                      </Text>
                    </View>

                    <Text style={styles.transactionAmount}>
                      +{formatCurrency(Number(item.earning_amount))}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyTransactions}>
                  <Text style={styles.emptyText}>
                    No completed deliveries yet.
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },

  scrollContent: {
    paddingBottom: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222222',
  },

  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    marginHorizontal: 18,
    marginTop: 18,
    padding: 4,
    borderRadius: 25,
  },

  filterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 22,
  },

  activeFilter: {
    backgroundColor: '#00852B',
  },

  filterText: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },

  activeFilterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  earningsCard: {
    backgroundColor: '#00852B',
    marginHorizontal: 18,
    marginTop: 20,
    padding: 22,
    borderRadius: 18,
    elevation: 3,
  },

  earningsLabel: {
    color: '#E5F5E8',
    fontSize: 15,
    fontWeight: '500',
  },

  earningsAmount: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 8,
  },

  earningsGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },

  earningsGrowthText: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  chartCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 18,
    marginTop: 18,
    padding: 18,
    borderRadius: 16,
    elevation: 2,
  },

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  chartTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  chartSubtitle: {
    fontSize: 12,
    color: '#888888',
  },

  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 140,
    marginTop: 20,
  },

  chartColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },

  bar: {
    width: 18,
    backgroundColor: '#00852B',
    borderRadius: 6,
  },

  chartDay: {
    fontSize: 11,
    color: '#666666',
    marginTop: 8,
  },

  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginTop: 18,
    gap: 12,
  },

  statsCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 15,
    elevation: 2,
  },

  statsIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 12,
  },

  statsLabel: {
    fontSize: 12,
    color: '#777777',
    marginTop: 4,
  },

  transactionSection: {
    marginHorizontal: 18,
    marginTop: 22,
    marginBottom: 25,
  },

  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  transactionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  transactionCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },

  transactionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },

  transactionId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222222',
  },

  transactionDate: {
    fontSize: 11,
    color: '#888888',
    marginTop: 4,
  },

  transactionAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#00852B',
  },

  loadingContainer: {
    padding: 60,
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#666666',
  },

  messageCard: {
    backgroundColor: '#FFFFFF',
    margin: 18,
    padding: 22,
    borderRadius: 15,
    alignItems: 'center',
  },

  errorText: {
    color: '#D32F2F',
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#00852B',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },

  retryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  emptyChart: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTransactions: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 13,
    alignItems: 'center',
  },

  emptyText: {
    color: '#888888',
    fontSize: 13,
  },
});

export default EarningsScreen;