// import React from 'react';
// import {
//   View,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
// } from 'react-native';

// type Props = {
//   onMenuPress?: () => void;
// };

// const Navbar: React.FC<Props> = ({ onMenuPress }) => {
//   return (
//     <View style={styles.navbar}>
//       {/* Logo (left side) */}
//       <Image
//         source={require('../assets/images/logo.jpg')}
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       {/* Search Bar (middle) */}
//       <View style={styles.searchBox}>
//         <TextInput
//           placeholder="ENTER YOUR KEYWORD"
//           placeholderTextColor="#AAAAAA"
//           style={styles.input}
//         />

//         <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
//           <Text style={styles.searchIcon}>⌕</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Hamburger Icon (right side) */}
//       <TouchableOpacity
//         style={styles.menuButton}
//         onPress={onMenuPress}
//         activeOpacity={0.6}
//         hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
//       >
//         <Text style={styles.menuIcon}>☰</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   navbar: {
//     height: 58,
//     backgroundColor: '#FFFFFF',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     gap: 10,
//     elevation: 3,
//   },

//   logo: {
//     width: 100,
//     height: 38,
//   },

//   searchBox: {
//     flex: 1,
//     height: 40,
//     backgroundColor: '#F3F3F5',
//     borderRadius: 25,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//   },

//   input: {
//     flex: 1,
//     fontSize: 9,
//     paddingVertical: 0,
//     color: '#333333',
//   },

//   searchIcon: {
//     fontSize: 25,
//     color: '#16845C',
//     fontWeight: 'bold',
//   },

//   menuButton: {
//     width: 40,
//     height: 40,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   menuIcon: {
//     fontSize: 24,
//     color: '#111111',
//   },
// });

// export default Navbar;






import React, { useState } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';

type Props = {
  onMenuPress?: () => void;
  onCategoryPress?: () => void;
  onSearch?: (keyword: string) => void;
};

const Navbar: React.FC<Props> = ({
  onMenuPress,
  onCategoryPress,
  onSearch,
}) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    Keyboard.dismiss();
    onSearch?.(keyword.trim());
  };

  return (
    <View style={styles.navbar}>
      {/* New left-side category hamburger */}
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={onCategoryPress}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
        accessibilityRole="button"
        accessibilityLabel="Open categories"
      >
        <Text style={styles.categoryIcon}>☰</Text>
      </TouchableOpacity>

      {/* Existing logo */}
      <Image
        source={require('../assets/images/logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Existing search bar */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="ENTER YOUR KEYWORD"
          placeholderTextColor="#999999"
          style={styles.input}
          value={keyword}
          onChangeText={setKeyword}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
          onEndEditing={() => {}}
          autoCapitalize="none"
          accessibilityLabel="Search products"
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel="Search"
        >
          <View style={styles.searchCircle} />
          <View style={styles.searchHandle} />
        </TouchableOpacity>
      </View>

      {/* Existing right-side hamburger */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={onMenuPress}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    minHeight: 58,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 8,
    elevation: 3,
    zIndex: 10,
  },

  /* New left-side button */
  categoryButton: {
    width: 22,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  categoryIcon: {
    fontSize: 17,
    color: '#111111',
  },

  /* Existing logo styles */
  logo: {
    width: 94,
    height: 38,
    flexShrink: 0,
  },

  searchBox: {
    flex: 1,
    minWidth: 0,
    height: 40,
    backgroundColor: '#F3F3F5',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 13,
    paddingRight: 8,
  },

  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 0,
    fontSize: 10,
    color: '#333333',
  },

  searchButton: {
    width: 30,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchCircle: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#16845C',
    position: 'absolute',
    top: 10,
    left: 7,
  },

  searchHandle: {
    width: 7,
    height: 2,
    backgroundColor: '#16845C',
    position: 'absolute',
    top: 23,
    left: 19,
    transform: [{ rotate: '48deg' }],
    borderRadius: 2,
  },

  /* Existing right-side button styles */
  menuButton: {
    width: 30,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  menuIcon: {
    fontSize: 23,
    color: '#111111',
  },
});

export default Navbar;
