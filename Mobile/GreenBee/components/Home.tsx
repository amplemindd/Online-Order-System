import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Modal,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import Navbar from './Navbar';
import Banner from './Banner';
import Footer from './Footer';
import CategorySidebar from './CategorySidebar';
import Products from './Products';
import Cart from './Cart';
import { useCart } from '../context/CartContext';
import Wishlist from './Wishlist';
import Checkout from './Checkout';
import Login from './Login';
import Registration from './Registration';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import FAQs from './FAQs';
import TermsAndServices from './TermsAndServices';
import PrivacyPolicy from './PrivacyPolicy';
import Testimonials from './Testimonials';
import Ourteam from './Ourteam';
import NotFound from './NotFound';
import FavoriteFruits from './FavoriteFruits';
import OrderHistory from './OrderHistory';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);

const Home: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [pagesOpen, setPagesOpen] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const { cartCount } = useCart();
  const [showWishlist, setShowWishlist] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [showFAQs, setShowFAQs] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
const [showTestimonials, setShowTestimonials] = useState(false);
const [showOurTeam, setShowOurTeam] = useState(false);
const [showNotFound, setShowNotFound] = useState(false);
const [showOrderHistory, setShowOrderHistory] = useState(false);
  

  const insets = useSafeAreaInsets();

  const scrollViewRef =
    useRef<React.ElementRef<typeof ScrollView>>(null);

  // Main sidebar starts outside the screen on the RIGHT.
  const translateX = useRef(
    new Animated.Value(SIDEBAR_WIDTH),
  ).current;

  // Prevent multiple close animations from running together.
  const isClosing = useRef(false);

  const menuItems = ['Home', 'Products', 'Categories', 'Pages', 'Blog'];
  
  const pageItems = ['About Us', 'Contact Us', 'FAQs Page', 'Terms and Services', 'Privacy Policy', 'Testimonial Page', 'Our Team', '404 Error Page',
  ];

  // Open the main sidebar from the RIGHT.
  const openMenu = (): void => {
    isClosing.current = false;
    translateX.stopAnimation();
    translateX.setValue(SIDEBAR_WIDTH);

    setMenuOpen(true);

    Animated.timing(translateX, {
      toValue: 0,
      duration: 280,
      useNativeDriver: true,
    }).start();
  };

  // Close the main sidebar towards the RIGHT.
  const closeMenu = (): void => {
    if (!menuOpen || isClosing.current) {
      return;
    }

    isClosing.current = true;
    translateX.stopAnimation();

    Animated.timing(translateX, {
      toValue: SIDEBAR_WIDTH,
      duration: 240,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMenuOpen(false);
      }

      isClosing.current = false;
    });
  };

  const scrollToTop = (): void => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  const handleSearch = (keyword: string): void => {
    if (keyword.trim() === '') {
      Alert.alert('Search', 'Please enter a keyword.');
      return;
    }

    Alert.alert('Search', `Searching for: ${keyword}`);
  };

  const handleMenuItem = (item: string): void => {
    if (item === 'Pages') {
    setPagesOpen(prev => !prev);
    return;
  }
  const pageNavigation: Record<string, () => void> = {
  'About Us': () => setShowAboutUs(true),
  'Contact Us': () => setShowContactUs(true),
  'FAQs Page': () => setShowFAQs(true),
  'Terms and Services': () => setShowTerms(true),
  'Privacy Policy': () => setShowPrivacyPolicy(true),
  'Testimonial Page': () => setShowTestimonials(true),
  'Our Team': () => setShowOurTeam(true),
  '404 Error Page': () => setShowNotFound(true),
};

if (pageNavigation[item]) {
  closeMenu();
  setShowLogin(false);
  setShowRegistration(false);
  setShowCheckout(false);
  
  setShowCart(false);
  setShowWishlist(false);
  setShowProducts(false);

  setShowAboutUs(false);
  setShowContactUs(false);
  setShowFAQs(false);
  setShowTerms(false);
  setShowPrivacyPolicy(false);
  setShowTestimonials(false);
  setShowOurTeam(false);
  setShowNotFound(false);

  pageNavigation[item]();
  return;
}
  closeMenu();

  // Reset other screens
  setShowLogin(false);
  setShowRegistration(false);
  setShowCheckout(false);
  setShowCart(false);
  setShowWishlist(false);
  setShowPrivacyPolicy(false);
  setShowTestimonials(false);
  setShowOurTeam(false);
  setShowNotFound(false);

  if (item === 'Home') {
    setShowPrivacyPolicy(false);
    setShowTestimonials(false);
    setShowOurTeam(false);
    setShowNotFound(false);
    setShowTerms(false);
    setShowFAQs(false);
    setShowContactUs(false);
    setShowProducts(false);
    setShowAboutUs(false);
    scrollToTop();
    return;
  }

  if (item === 'Products') {
    setShowTerms(false);
    setShowFAQs(false);
    setShowContactUs(false);
    setShowAboutUs(false);
    setShowProducts(true);
    scrollToTop();
    return;
  }

  if (item === 'Categories') {
    setCategoryOpen(true);
    return;
  }

  if (item === 'Blog') {
    Alert.alert('Blog', 'Blog page coming soon!');
    return;
  }
};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={{ paddingTop: insets.top }}>
        <Navbar
          onMenuPress={openMenu}
          onCategoryPress={() => setCategoryOpen(true)}
          onSearch={handleSearch}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

      {showLogin ? (
        <Login
        onBack={() => {
          setShowLogin(false);
          setShowProducts(false);
          setShowCart(false);
          setShowWishlist(false);
          setShowCheckout(false);
          scrollToTop();
        }}
        onRegisterPress={() => {
          setShowLogin(false);
          setShowRegistration(true);
        }}
        />
      ) : showRegistration ? (
        <Registration
         onLoginPress={() => {
          setShowRegistration(false);
          setShowLogin(true);
        }}
        />
      ) : showCheckout ? (
        <Checkout
        onBackToCart={() => {
          setShowCheckout(false);
          setShowCart(true);
        }}
        onContinueShopping={() => {
          setShowCheckout(false);
          setShowCart(false);
          setShowProducts(true);
        }}
        />

        ) : showOrderHistory ? (
  <OrderHistory
    onBack={() => setShowOrderHistory(false)}
  />
      ) : showCart ? (
      <Cart
      onContinueShopping={() => {
        setShowCart(false);
        setShowProducts(true);
      }}
      onProceedToCheckout={() => {
        setShowCart(false);
        setShowCheckout(true);
      }}
      />
    ) : showWishlist ? (
    <Wishlist
    onContinueShopping={() => {
      setShowWishlist(false);
      setShowProducts(true);
    }}
    />
  ) : showPrivacyPolicy ? (
    <PrivacyPolicy />
  ) : showTestimonials ? (
    <Testimonials />
  ) : showOurTeam ? (
    <Ourteam />
  ) : showNotFound ? (
    <NotFound />
  ) : showTerms ? (
    <TermsAndServices />
  ) : showFAQs ? (
    <FAQs />
  ) : showContactUs ? (
    <ContactUs />
  ) : showAboutUs ? (
    <AboutUs />
  ) : showProducts ? (
  <Products />
) : (
<>
<Banner />
<FavoriteFruits />
<Footer />
</>
)}
      </ScrollView>


      {/* Account Menu */}
      <Modal
      visible={accountMenuOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setAccountMenuOpen(false)}
      >
      <Pressable
      style={styles.accountBackdrop}
      onPress={() => setAccountMenuOpen(false)}
      >
      <View style={styles.accountMenu}>
      <Text style={styles.accountTitle}>My Account</Text>

      <TouchableOpacity
        style={styles.accountItem}
        onPress={() => {
          setShowCheckout(false);
          setShowCart(false);
          setShowWishlist(false);
          setAccountMenuOpen(false);
          setShowRegistration(false);
          setShowLogin(true);
        }}
      >
        <Text style={styles.accountItemText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accountItem}
        onPress={() => {
          setShowCheckout(false);
          setShowCart(false);
          setShowWishlist(false);
          setAccountMenuOpen(false);
          setShowLogin(false);
          setShowRegistration(true);
        }}
      >
        <Text style={styles.accountItemText}>Register Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accountItem}
        onPress={() => {
          setAccountMenuOpen(false);
          setShowLogin(false);
          setShowRegistration(false);
          setShowCart(false);
          setShowWishlist(false);
          setShowCheckout(true);
        }}
      >
        <Text style={styles.accountItemText}>Check Out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accountItem}
        onPress={() => {
          setAccountMenuOpen(false);
          setShowLogin(false);
          setShowRegistration(false);
          setShowCheckout(false);
          setShowCart(false);
          setShowWishlist(true);
        }}
      >
        <Text style={styles.accountItemText}>My Wishlist</Text>
      </TouchableOpacity>
<TouchableOpacity
  style={styles.accountItem}
  onPress={() => {
    setAccountMenuOpen(false);
    setShowLogin(false);
    setShowRegistration(false);
    setShowCheckout(false);
    setShowCart(false);
    setShowWishlist(false);
    setShowOrderHistory(true);
  }}
>
  <Text style={styles.accountItemText}>My Orders</Text>
</TouchableOpacity>
      <TouchableOpacity
        style={styles.accountClose}
        onPress={() => setAccountMenuOpen(false)}
      >
        <Text style={styles.accountCloseText}>Close</Text>
        </TouchableOpacity>
        </View>
        </Pressable>
      </Modal>

      {/* Main sidebar */}
      <Modal
        visible={menuOpen}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.backdrop}
            onPress={closeMenu}
          />

          <Animated.View
            style={[
              styles.sidebar,
              {
                paddingTop: insets.top + 20,
                transform: [{ translateX }],
              },
            ]}
          >
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>
                GreenBee
              </Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeMenu}
                accessibilityRole="button"
                accessibilityLabel="Close menu"
              >
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {menuItems.map((item) => (
              <View key={item}>
                <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => handleMenuItem(item)}
                >
                  <Text style={styles.menuItemText}>
                    {item}
                  </Text>
                  
                  <Text style={styles.arrow}>
                    {item === 'Pages'
                    ? pagesOpen ? '⌄' : '›'
                    : '›'}
                  </Text>
                </TouchableOpacity>
                
                {item === 'Pages' && pagesOpen && (
                  <View style={styles.subMenu}>
                    {pageItems.map((page) => (
                      <TouchableOpacity
                      key={page}
                      style={styles.subMenuItem}
                      activeOpacity={0.7}
                      onPress={() => handleMenuItem(page)}
                    >
                      
                      <Text style={styles.subMenuText}>
                        {page}
                      </Text>
                      </TouchableOpacity>
                    ))}
                    </View>
                  )}
                  </View>
                ))}

          </Animated.View>
        </View>
      </Modal>

      {/* Category sidebar */}
      <CategorySidebar
        visible={categoryOpen}
        onClose={() => setCategoryOpen(false)}
      />

      {/* Fixed bottom navigation */}
      <View
        style={[
          styles.fixedBottom,
          { paddingBottom: Math.max(insets.bottom, 8) },
        ]}
      >
        {/* Home */}
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => {
            setShowTerms(false);
            setShowFAQs(false);
            setShowContactUs(false);
            setShowAboutUs(false);
            setShowLogin(false);
            setShowProducts(false);
            setShowCart(false);
            setShowWishlist(false);
            setShowCheckout(false);
            setShowRegistration(false);
            scrollToTop();
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Home"
        >
          <Feather
            name="home"
            size={23}
            color="#555555"
          />
          <Text style={styles.bottomLabel}>Home</Text>
        </TouchableOpacity>

        {/* Wishlist */}
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => {
            setShowLogin(false);
            setShowCart(false);
            setShowProducts(false);
            setShowWishlist(true);
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Wishlist"
        >
          <Feather
            name="heart"
            size={23}
            color="#222222"
          />
          <Text style={styles.bottomLabel}>Wishlist</Text>
        </TouchableOpacity>

        {/* Cart */}
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={() => {
            setShowLogin(false);
            setShowProducts(false);
            setShowWishlist(false);
            setShowCart(true);
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Cart"
        >
          <View style={styles.cartIcon}>
            <Feather
              name="shopping-bag"
              size={22}
              color="#555555"
            />

            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          </View>

          <Text style={styles.bottomLabel}>Cart</Text>
        </TouchableOpacity>

        {/* Setting */}
        <TouchableOpacity
          style={styles.bottomItem}
          // onPress={() => {
          //   setShowProducts(false);
          //   setShowCart(false);
          //   setShowWishlist(false);
          //   setShowCheckout(false);
          //   setShowLogin(true);
          // }}
          onPress={() => {
            setAccountMenuOpen(true);
          }}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Setting"
        >
          <Feather
            name="settings"
            size={23}
            color="#555555"
          />
          <Text style={styles.bottomLabel}>Setting</Text>
        </TouchableOpacity>

        {/* On Top */}
        <TouchableOpacity
          style={styles.bottomItem}
          onPress={scrollToTop}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="On Top, scroll to top"
        >
          <MaterialIcons
            name="vertical-align-top"
            size={23}
            color="#111111"
          />

          <Text style={styles.bottomLabel}>On Top</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 8,
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },

  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    elevation: 12,
    zIndex: 1,
  },

  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: 12,
  },

  sidebarTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#16845C',
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F3F5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    fontSize: 20,
    color: '#222222',
  },

  menuItem: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  menuItemText: {
    fontSize: 16,
    color: '#333333',
  },

  arrow: {
    fontSize: 25,
    color: '#16845C',
  },

  fixedBottom: {
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 7,
    paddingHorizontal: 4,
    elevation: 8,
  },

  bottomItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },

  bottomLabel: {
    fontSize: 10,
    color: '#999999',
    marginTop: 3,
  },

  cartIcon: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartBadge: {
    position: 'absolute',
    right: -7,
    top: -5,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00875A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  accountBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  accountMenu: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 30,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  accountTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#16845C',
    marginBottom: 12,
  },

  accountItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  accountItemText: {
    fontSize: 16,
    color: '#333333',
  },

  accountClose: {
    marginTop: 18,
    backgroundColor: '#16845C',
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 5,
  },

  accountCloseText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
 },
 subMenu: {
  backgroundColor: '#F8FBF9',
  paddingLeft: 15,
  paddingVertical: 4,
},

subMenuItem: {
  minHeight: 43,
  justifyContent: 'center',
  paddingHorizontal: 12,
  borderBottomWidth: 1,
  borderBottomColor: '#EEEEEE',
},

subMenuText: {
  fontSize: 14,
  color: '#555555',
},
});

export default Home;