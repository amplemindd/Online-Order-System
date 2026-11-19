import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotFound: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>Page Not Found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#16845C',
  },
  subtitle: {
    fontSize: 18,
    color: '#555555',
  },
});

export default NotFound;