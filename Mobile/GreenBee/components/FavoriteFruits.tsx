import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

const FavoriteFruits: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Top Favorite Fruits</Text>

      <Text style={styles.description}>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui
        blanditiis praesentium.
      </Text>

      <View style={styles.fruitsContainer}>
        <View style={styles.fruitItem}>
          <Image
            source={require('../assets/images/fforange.jpeg')}
            style={styles.fruitImage}
            resizeMode="contain"
          />
          <Text style={styles.fruitName}>ORANGE</Text>
        </View>

        <View style={styles.fruitItem}>
          <Image
            source={require('../assets/images/ffgrape.jpeg')}
            style={styles.fruitImage}
            resizeMode="contain"
          />
          <Text style={styles.fruitName}>GRAPE</Text>
        </View>

        <View style={styles.fruitItem}>
          <Image
            source={require('../assets/images/ffpeach.jpeg')}
            style={styles.fruitImage}
            resizeMode="contain"
          />
          <Text style={styles.fruitName}>PEACH</Text>
        </View>
      </View>
    </View>
  );
};

export default FavoriteFruits;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 30,
    paddingHorizontal: 14,
    paddingBottom: 30,
    alignItems: 'center',
  },

  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#172337',
    textAlign: 'center',
    marginBottom: 6,
  },

  description: {
    fontSize: 11,
    color: '#424242',
    textAlign: 'center',
    lineHeight: 17,
    paddingHorizontal: 2,
  },

  fruitsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 42,
  },

  fruitItem: {
    alignItems: 'center',
    width: '32%',
  },

  fruitImage: {
    width: 90,
    height: 90,
  },

  fruitName: {
    fontSize: 9,
    fontWeight: '700',
    color: '#333333',
    marginTop: 12,
  },
});