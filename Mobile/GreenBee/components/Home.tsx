import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
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
import OrderHistory from './OrderHistory';
import ProductDetails from './ProductDetails';

const API_BASE = "http://localhost:5000/api";
const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.78, 320);


const SERVER_URL = "http://localhost:5000";

const getImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return undefined;

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  return `${SERVER_URL}/${imagePath.replace(/^\/+/, "")}`;
};

type HomeCategory = {
  id: number | string;
  name: string;
  image_path?: string | null;
  description?: string | null;
  product_count?: number;
};

type HomeProduct = {
  id: number | string;
  name: string;
  price: number | string;
  image_path?: string | null;
  pricing_type?: string | null;
};

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
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Home page category and product data
  const [categories, setCategories] = useState<HomeCategory[]>([]);
  const [homeProducts, setHomeProducts] = useState<HomeProduct[]>([]);
  const [homeLoading, setHomeLoading] = useState<boolean>(true);
  const [homeError, setHomeError] = useState<string>('');
  

  const insets = useSafeAreaInsets();

const [selectedCategory, setSelectedCategory] =
  useState<number | string | null>(null);

  const getImageUrl = (imagePath?: string | null): string | null => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `http://localhost:5000/${imagePath.replace(/^\/+/, '')}`;
  };

  useEffect(() => {
    let isMounted = true;

    const loadHomeData = async () => {
      try {
        setHomeLoading(true);
        setHomeError('');

        const [categoryResponse, productResponse] = await Promise.all([
          fetch(`${API_BASE}/categories`),
          fetch(`${API_BASE}/products`),
        ]);

        if (!categoryResponse.ok || !productResponse.ok) {
          throw new Error('Unable to load categories and products.');
        }

        const categoryData = await categoryResponse.json();
        const productData = await productResponse.json();

        const fetchedCategories = Array.isArray(categoryData)
          ? categoryData
          : categoryData.categories || [];

        const fetchedProducts = Array.isArray(productData)
          ? productData
          : productData.products || [];

        // Shuffle products so the home page shows a different selection/order.
        const shuffledProducts = [...fetchedProducts];
        for (let i = shuffledProducts.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledProducts[i], shuffledProducts[j]] = [
            shuffledProducts[j],
            shuffledProducts[i],
          ];
        }

        if (isMounted) {
          setCategories(fetchedCategories);
          setHomeProducts(shuffledProducts.slice(0, 8));
        }
      } catch (error: any) {
        console.log("HOME API ERROR:", error);
        if (isMounted) {
          setHomeError(error?.message || 'Unable to load home page data.');
        }
      } finally {
        if (isMounted) setHomeLoading(false);
      }
    };

    loadHomeData();

    return () => {
      isMounted = false;
    };
  }, []);

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

      {!selectedProduct && (
        <View style={{ paddingTop: insets.top }}>
          <Navbar
            onMenuPress={openMenu}
            onCategoryPress={() => setCategoryOpen(true)}
            onSearch={handleSearch}
          />
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

      {selectedProduct ? (
        <ProductDetails
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onOpenCart={() => {
            setSelectedProduct(null);
            setShowCart(true);
          }}
        />
      ) : showLogin ? (
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
  <Products
    categoryId={selectedCategory}
    onProductPress={(product) => setSelectedProduct(product)}
    onBack={() => {
      setShowProducts(false);
      setSelectedCategory(null);
      scrollToTop();
    }}
  />
) : (
<>
  <Banner />
  <View style={styles.homeSection}>
    <Text style={styles.sectionTitle}>Shop by Category</Text>
    <Text style={styles.sectionSubtitle}>
      Explore fresh products from your favourite categories
    </Text>

    {homeLoading ? (
      <ActivityIndicator
        size="large"
        color="#16845C"
        style={styles.homeLoader}
      />
    ) : categories.length > 0 ? (
      <View style={styles.categoryGrid}>
        {categories.map((category) => {
          const categoryImage = getImageUrl(category.image_path);

          return (
            <TouchableOpacity
              key={String(category.id)}
              style={styles.categoryCard}
              activeOpacity={0.8}
              onPress={() => {
  setSelectedCategory(category.id);
  setShowProducts(true);
  setCategoryOpen(false);
  scrollToTop();
}}
            >
              <View style={styles.categoryImageWrap}>
                {categoryImage ? (
                  <Image
  source={
    category.image_path
      ? { uri: getImageUrl(category.image_path) ?? undefined }
      : undefined
  }
  style={styles.categoryImage}
  resizeMode="contain"
/>
                ) : (
                  <Text style={styles.categoryPlaceholder}>
                    {String(category.name || 'C').charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <Text style={styles.categoryName} numberOfLines={2}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ) : (
      <Text style={styles.emptyHomeText}>
        {homeError || 'No categories available yet.'}
      </Text>
    )}
  </View>

  <View style={styles.homeProductsSection}>
    <View style={styles.productsHeadingRow}>
      <View>
        <Text style={styles.sectionTitle}>Popular Products</Text>
        <Text style={styles.sectionSubtitle}>
          Fresh picks for you
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowProducts(true)}
      >
        <Text style={styles.viewAllText} onPress={() => {
  setSelectedCategory(null);
  setShowProducts(true);
}}>View All</Text>
      </TouchableOpacity>
    </View>

    {homeLoading ? (
      <ActivityIndicator
        size="small"
        color="#16845C"
        style={styles.homeLoader}
      />
    ) : homeProducts.length > 0 ? (
      <View style={styles.productGrid}>
        {homeProducts.map((product) => {
          const productImage = getImageUrl(product.image_path);

          return (
            <TouchableOpacity
              key={String(product.id)}
              style={styles.homeProductCard}
              activeOpacity={0.85}
              onPress={() => setSelectedProduct(product)}
            >
              <View style={styles.homeProductImageWrap}>
                {productImage ? (
                 <Image
  source={
    product.image_path
      ? { uri: getImageUrl(product.image_path) ?? undefined }
      : undefined
  }
  style={styles.homeProductImage}
  resizeMode="contain"
/>
                ) : (
                  <Text style={styles.productPlaceholder}>🛒</Text>
                )}
              </View>
              <Text style={styles.homeProductName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={styles.homeProductPrice}>
                ₹{Number(product.price || 0).toFixed(2)}
                {product.pricing_type ? ` / ${product.pricing_type}` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ) : (
      <Text style={styles.emptyHomeText}>
        {homeError || 'No products available yet.'}
      </Text>
    )}
  </View>
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
      {!selectedProduct && <View
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
      </View>}
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

  homeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#182333',
  },

  sectionSubtitle: {
    fontSize: 13,
    color: '#777777',
    marginTop: 5,
    marginBottom: 18,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginHorizontal: -4,
  },

  categoryCard: {
    width: '30%',
    marginHorizontal: '1.5%',
    marginBottom: 18,
    alignItems: 'center',
  },

  categoryImageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F7F5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  categoryImage: {
    width: '100%',
    height: '100%',
  },

  categoryPlaceholder: {
    fontSize: 36,
    fontWeight: '700',
    color: '#16845C',
  },

  categoryName: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    color: '#333333',
    textAlign: 'center',
  },

  homeProductsSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#F8FAF8',
  },

  productsHeadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  viewAllText: {
    color: '#16845C',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  homeProductCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEF1EE',
  },

  homeProductImageWrap: {
    width: '100%',
    height: 125,
    backgroundColor: '#FAFBFA',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  homeProductImage: {
    width: '100%',
    height: '100%',
  },

  productPlaceholder: {
    fontSize: 34,
  },

  homeProductName: {
    marginTop: 9,
    fontSize: 14,
    fontWeight: '700',
    color: '#263238',
  },

  homeProductPrice: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '700',
    color: '#16845C',
  },

  homeLoader: {
    marginVertical: 28,
  },

  emptyHomeText: {
    color: '#777777',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 22,
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
