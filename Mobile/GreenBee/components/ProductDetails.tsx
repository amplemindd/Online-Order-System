import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from '@react-native-vector-icons/feather';
import { Product as CartProduct, useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const API_BASE = 'https://online-order-system-1.onrender.com';
const SCREEN_WIDTH = Dimensions.get('window').width;

type ProductData = {
  id: number;
  name: string;
  price: number | string;
  image?: ImageSourcePropType | string | null;
  image_path?: string | null;
  // MySQL products table stores up to three images in these columns.
  image_url?: string | null;
  image_2?: string | null;
  image_3?: string | null;
  images?: Array<string | { image_path?: string; url?: string }>;
  category_name?: string;
  category?: string;
  description?: string | null;
  details?: string | null;
  pricing_type?: string | null;
  quantity?: string | number | null;
  stock?: number | string | null;
  stock_quantity?: number | string | null;
  mrp?: number | string | null;
  original_price?: number | string | null;
  highlights?: string[] | Record<string, string> | null;
  imported?: string | boolean | null;
  product_type?: string | null;
  good_for?: string | null;
  top_nutrients?: string | null;
  [key: string]: unknown;
};

type Props = {
  product: ProductData;
  onBack: () => void;
  onOpenCart?: () => void;
};
const money = (v: number | string | null | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) ? `₹${n.toFixed(0)}` : '₹0';
};
const imageUri = (path?: string | null) => {
  if (!path) return null;
  return path.startsWith('http://') || path.startsWith('https://')
    ? path
    : `${API_BASE}/${path.replace(/^\/+/, '')}`;
};

const ProductDetails: React.FC<Props> = ({ product, onBack, onOpenCart }) => {
  const insets = useSafeAreaInsets();
  const { addToCart, cartCount } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  // Keep only the ScrollView's scrollTo method to avoid ScrollView ref typing
  // differences between React Native versions.
  const galleryScrollTo = useRef<((x: number) => void) | null>(null);
  const [highlightsOpen, setHighlightsOpen] = useState(true);
  const [informationOpen, setInformationOpen] = useState(false);

  const cartProduct: CartProduct = useMemo(() => {
    let image: ImageSourcePropType = require('../assets/images/apples-p.jpg');
    if (typeof product.image === 'number') image = product.image;
    else if (typeof product.image === 'string') {
      const uri = imageUri(product.image);
      if (uri) image = { uri };
    } else if (product.image && typeof product.image === 'object')
      image = product.image as ImageSourcePropType;
    else {
      const uri = imageUri(product.image_path);
      if (uri) image = { uri };
    }
    return {
      id: Number(product.id),
      name: String(product.name || 'Product'),
      price: Number(product.price || 0),
      image,
    };
  }, [product]);

  console.log('PRODUCT IMAGE DATA:', {
  id: product.id,
  image_path: product.image_path,
  image_2: product.image_2,
  image_3: product.image_3,
});

  const imageSources = useMemo((): ImageSourcePropType[] => {
    // /api/products returns p.* so these are the actual MySQL columns:
    // image_url (also exposed as image_path), image_2 and image_3.
    const candidates: unknown[] = [
      product.image_url,
      product.image_path,
      product.image_2,
      product.image_3,
      typeof product.image === 'string' ? product.image : null,
    ];

    if (Array.isArray(product.images)) {
      candidates.push(
        ...product.images.map(item =>
          typeof item === 'string' ? item : item?.url || item?.image_path,
        ),
      );
    }

    const urls = candidates
      .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
      .map(value => imageUri(value.trim()))
      .filter((value): value is string => Boolean(value));

    const uniqueUrls = Array.from(new Set(urls));
    if (uniqueUrls.length) return uniqueUrls.map(uri => ({ uri }));

    if (typeof product.image === 'number' || (product.image && typeof product.image === 'object')) {
      return [product.image as ImageSourcePropType];
    }
    return [];
  }, [product]);

  const category = String(
    product.category_name || product.category || 'Fresh Grocery',
  );
  const stockValue = Number(product.stock_quantity ?? product.stock);
  const hasStock = product.stock_quantity != null || product.stock != null;
  const inStock = !hasStock || stockValue > 0;
  const mrp = Number(product.mrp ?? product.original_price);
  const hasMrp = Number.isFinite(mrp) && mrp > Number(product.price || 0);
  const discount = hasMrp
    ? Math.round(((mrp - Number(product.price || 0)) / mrp) * 100)
    : 0;
  const wishlisted = isWishlisted(cartProduct.id);

  const addSelectedToCart = () => {
    if (!inStock)
      return Alert.alert(
        'Out of stock',
        'This product is currently unavailable.',
      );
    for (let i = 0; i < quantity; i += 1) addToCart(cartProduct);
    Alert.alert(
      'Added to Cart',
      `${quantity} ${cartProduct.name} added to your cart.`,
    );
  };
  const slideWidth = SCREEN_WIDTH - 28;
  const onGalleryScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setActiveImage(Math.max(0, Math.min(nextIndex, imageSources.length - 1)));
  };

  const goToImage = (index: number) => {
    if (imageSources.length <= 1) return;
    const next = (index + imageSources.length) % imageSources.length;
    galleryScrollTo.current?.(next * slideWidth);
    setActiveImage(next);
  };

  // Automatic animated slideshow: advances every 3 seconds and loops forever.
  // Manual arrows/dots and swipe update activeImage, which restarts this timer.
  useEffect(() => {
    if (imageSources.length <= 1) return;
    const timer = setTimeout(() => {
      goToImage(activeImage + 1);
    }, 3000);
    return () => clearTimeout(timer);
  }, [activeImage, imageSources.length]);

  // Reset the gallery when a different product is opened.
  useEffect(() => {
    setActiveImage(0);
    galleryScrollTo.current?.(0);
  }, [product.id]);

  const defaultHighlights: [string, string][] = [
    ['Category', category],
    ['Product Type', String(product.product_type || category)],
    [
      'Net Quantity',
      String(product.quantity || product.pricing_type || 'As shown on pack'),
    ],
    ['Imported', product.imported == null ? '—' : String(product.imported)],
    ['Good For', String(product.good_for || 'Everyday nutrition')],
    ['Top Nutrients', String(product.top_nutrients || '—')],
  ];
  const highlightRows: [string, unknown][] = Array.isArray(product.highlights)
    ? product.highlights.map((v, i) => [`Highlight ${i + 1}`, v])
    : product.highlights && typeof product.highlights === 'object'
    ? Object.entries(product.highlights)
    : defaultHighlights;

  return (
    <View style={s.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={[s.topBar, { paddingTop: Math.max(insets.top, 10) }]}>
        <TouchableOpacity onPress={onBack} style={s.roundIcon}>
          <Feather name="arrow-left" size={22} color="#20372A" />
        </TouchableOpacity>
        <View style={s.topTitleWrap}>
          <Text style={s.topTitle}>Product Details</Text>
          <Text style={s.topSubtitle}>Freshness, selected for you</Text>
        </View>
        <TouchableOpacity
          onPress={() => toggleWishlist(cartProduct)}
          style={s.roundIcon}
        >
          <Feather
            name="heart"
            size={21}
            color={wishlisted ? '#E34D59' : '#20372A'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.galleryCard}>
          {imageSources.length ? (
            <>
              <ScrollView
                ref={instance => {
                  galleryScrollTo.current = instance
                    ? (x: number) => instance.scrollTo({ x, animated: true })
                    : null;
                }}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onGalleryScroll}
              >
                {imageSources.map((source, i) => (
                  <View style={s.imageSlide} key={`product-image-${i}`}>
                    <Image
  source={source}
  style={s.productImage}
  resizeMode="contain"
  onLoad={() => console.log('IMAGE LOADED:', source)}
  onError={(error) =>
    console.log('IMAGE LOAD ERROR:', source, error.nativeEvent)
  }
/>
                  </View>
                ))}
              </ScrollView>
              <>
                  <TouchableOpacity
                    style={[s.slideArrow, s.slideArrowLeft]}
                    onPress={() => goToImage(activeImage - 1)}
                    disabled={imageSources.length <= 1}
                  >
                    <Feather
                      name="chevron-left"
                      size={24}
                      color={imageSources.length <= 1 ? '#AAB4AC' : '#20372A'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.slideArrow, s.slideArrowRight]}
                    onPress={() => goToImage(activeImage + 1)}
                    disabled={imageSources.length <= 1}
                  >
                    <Feather
                      name="chevron-right"
                      size={24}
                      color={imageSources.length <= 1 ? '#AAB4AC' : '#20372A'}
                    />
                  </TouchableOpacity>
                  <View style={s.slideCounter}>
                    <Text style={s.slideCounterText}>
                      {activeImage + 1} / {imageSources.length}
                    </Text>
                  </View>
                  {imageSources.length > 1 && (
                    <View style={s.dots}>
                      {imageSources.map((_, i) => (
                        <TouchableOpacity
                          key={i}
                          onPress={() => goToImage(i)}
                          style={[s.dot, activeImage === i && s.activeDot]}
                        />
                      ))}
                    </View>
                  )}
                </>
            </>
          ) : (
            <View style={s.noImage}>
              <Feather name="image" size={44} color="#9AA69D" />
              <Text style={s.noImageText}>Product image unavailable</Text>
            </View>
          )}
          {hasMrp && (
            <View style={s.discountBadge}>
              <Text style={s.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={s.productCard}>
          <View style={s.categoryRow}>
            <Text style={s.categoryText}>{category.toUpperCase()}</Text>
            <View style={[s.stockPill, !inStock && s.outStockPill]}>
              <View style={[s.stockDot, !inStock && s.outStockDot]} />
              <Text style={[s.stockText, !inStock && s.outStockText]}>
                {inStock ? 'In Stock' : 'Out of Stock'}
              </Text>
            </View>
          </View>
          <Text style={s.productName}>{product.name}</Text>
          <Text style={s.productSubline}>
            {product.quantity
              ? `Net quantity: ${product.quantity}`
              : 'Fresh grocery product'}
            {product.pricing_type ? ` / ${product.pricing_type}` : ''}
          </Text>
          <View style={s.priceRow}>
            <Text style={s.currentPrice}>{money(product.price)}</Text>
            {hasMrp && <Text style={s.oldPrice}>{money(mrp)}</Text>}
            {hasMrp && (
              <Text style={s.savingText}>
                Save {money(mrp - Number(product.price))}
              </Text>
            )}
          </View>
          <Text style={s.taxText}>Inclusive of applicable taxes</Text>
          <View style={s.quantityDivider} />
          <View style={s.quantityRow}>
            <View>
              <Text style={s.quantityTitle}>Select quantity</Text>
              <Text style={s.quantityHint}>Choose the number of packs</Text>
            </View>
            <View style={s.quantityControl}>
              <TouchableOpacity
                style={s.quantityButton}
                onPress={() => setQuantity(v => Math.max(1, v - 1))}
                disabled={quantity <= 1}
              >
                <Feather
                  name="minus"
                  size={17}
                  color={quantity <= 1 ? '#AAB4AC' : '#176B36'}
                />
              </TouchableOpacity>
              <Text style={s.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={s.quantityButton}
                onPress={() => setQuantity(v => v + 1)}
              >
                <Feather name="plus" size={17} color="#176B36" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={s.benefitsCard}>
          <View style={s.benefit}>
            <View style={s.benefitIcon}>
              <Feather name="truck" size={23} color="#176B36" />
            </View>
            <Text style={s.benefitTitle}>Fast Delivery</Text>
            <Text style={s.benefitSub}>To your doorstep</Text>
          </View>
          <View style={s.benefitDivider} />
          <View style={s.benefit}>
            <View style={s.benefitIcon}>
              <Feather name="check-circle" size={23} color="#176B36" />
            </View>
            <Text style={s.benefitTitle}>Quality Checked</Text>
            <Text style={s.benefitSub}>Fresh grocery picks</Text>
          </View>
        </View>

        <View style={s.accordionCard}>
          <TouchableOpacity
            style={s.accordionHeader}
            onPress={() => setHighlightsOpen(v => !v)}
          >
            <Text style={s.accordionTitle}>Product Highlights</Text>
            <Feather
              name={highlightsOpen ? 'chevron-up' : 'chevron-down'}
              size={21}
              color="#20372A"
            />
          </TouchableOpacity>
          {highlightsOpen && (
            <View style={s.highlightList}>
              {highlightRows.map(([label, value], i) => (
                <View style={s.highlightRow} key={`${label}-${i}`}>
                  <Text style={s.highlightLabel}>
                    {String(label).replaceAll('_', ' ')}
                  </Text>
                  <Text style={s.highlightValue}>{String(value || '—')}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={s.accordionDivider} />
          <TouchableOpacity
            style={s.accordionHeader}
            onPress={() => setInformationOpen(v => !v)}
          >
            <Text style={s.accordionTitle}>Product Information</Text>
            <Feather
              name={informationOpen ? 'chevron-up' : 'chevron-down'}
              size={21}
              color="#20372A"
            />
          </TouchableOpacity>
          {informationOpen && (
            <Text style={s.description}>
              {String(
                product.description ||
                  product.details ||
                  'Product information will be shown here when available.',
              )}
            </Text>
          )}
        </View>
        <View style={{ height: 12 }} />
      </ScrollView>

      <View
        style={[s.bottomBar, { paddingBottom: Math.max(insets.bottom, 10) }]}
      >
        <TouchableOpacity style={s.cartShortcut} onPress={onOpenCart}>
          <Feather name="shopping-bag" size={23} color="#176B36" />
          <View style={s.cartBadge}>
            <Text style={s.cartBadgeText}>{cartCount}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.addButton, !inStock && s.disabledAddButton]}
          onPress={addSelectedToCart}
          disabled={!inStock}
        >
          <Feather name="shopping-cart" size={18} color="#fff" />
          <Text style={s.addButtonText}>
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </Text>
          <Text style={s.addButtonPrice}>
            {money(Number(product.price || 0) * quantity)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F3F6F2' },
  topBar: {
    minHeight: 74,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9EEE9',
  },
  roundIcon: {
    width: 42,
    height: 42,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E1E8E1',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitleWrap: { flex: 1, alignItems: 'center' },
  topTitle: { color: '#20372A', fontSize: 16, fontWeight: '800' },
  topSubtitle: { color: '#839087', fontSize: 10, marginTop: 3 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 12 },
  galleryCard: {
    margin: 14,
    marginBottom: 10,
    height: 285,
    borderRadius: 20,
    backgroundColor: '#EAF1E9',
    overflow: 'hidden',
    position: 'relative',
  },
  imageSlide: {
    width: SCREEN_WIDTH - 28,
    height: 285,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideArrow: {
    position: 'absolute',
    top: '45%',
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  slideArrowLeft: { left: 10 },
  slideArrowRight: { right: 10 },
  slideCounter: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  slideCounterText: { color: '#20372A', fontSize: 10, fontWeight: '800' },
  productImage: { width: '88%', height: '88%' },
  noImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noImageText: { marginTop: 8, color: '#7C8B80', fontSize: 12 },
  dots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#AAB7AC' },
  activeDot: { width: 18, backgroundColor: '#176B36' },
  discountBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: '#176B36',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  productCard: {
    marginHorizontal: 14,
    marginBottom: 12,
    padding: 17,
    borderRadius: 19,
    backgroundColor: '#fff',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    color: '#21834A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  stockPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EAF7ED',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22A653',
  },
  stockText: { color: '#21834A', fontSize: 10, fontWeight: '700' },
  outStockPill: { backgroundColor: '#FDECEC' },
  outStockDot: { backgroundColor: '#D94B4B' },
  outStockText: { color: '#C33D3D' },
  productName: {
    marginTop: 10,
    color: '#20372A',
    fontSize: 24,
    fontWeight: '800',
  },
  productSubline: { marginTop: 5, color: '#7A867E', fontSize: 12 },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  currentPrice: { color: '#176B36', fontSize: 25, fontWeight: '900' },
  oldPrice: {
    color: '#9BA49D',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  savingText: { color: '#21834A', fontSize: 11, fontWeight: '800' },
  taxText: { color: '#99A29B', fontSize: 10, marginTop: 3 },
  quantityDivider: {
    height: 1,
    backgroundColor: '#EDF1ED',
    marginVertical: 16,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityTitle: { color: '#26382D', fontSize: 13, fontWeight: '800' },
  quantityHint: { color: '#929D94', fontSize: 10, marginTop: 3 },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    borderColor: '#DDE9DE',
    borderRadius: 12,
    padding: 5,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#EFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    color: '#20372A',
    fontSize: 15,
    fontWeight: '800',
    minWidth: 14,
    textAlign: 'center',
  },
  benefitsCard: {
    marginHorizontal: 14,
    marginBottom: 12,
    padding: 15,
    borderRadius: 19,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefit: { flex: 1, alignItems: 'center', gap: 4 },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#EFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  benefitTitle: { color: '#293B30', fontSize: 11, fontWeight: '800' },
  benefitSub: { color: '#929D94', fontSize: 9 },
  benefitDivider: { width: 1, height: 65, backgroundColor: '#EDF1ED' },
  accordionCard: {
    marginHorizontal: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 19,
    backgroundColor: '#fff',
  },
  accordionHeader: {
    minHeight: 54,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: { color: '#20372A', fontSize: 15, fontWeight: '800' },
  highlightList: { paddingBottom: 13, gap: 13 },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  highlightLabel: {
    flex: 1,
    color: '#8A958D',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  highlightValue: {
    flex: 1,
    color: '#35453A',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'right',
    textTransform: 'capitalize',
  },
  accordionDivider: { height: 1, backgroundColor: '#EDF1ED' },
  description: {
    color: '#758178',
    fontSize: 12,
    lineHeight: 20,
    paddingBottom: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 14,
    paddingTop: 11,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8EEE8',
    elevation: 12,
  },
  cartShortcut: {
    width: 54,
    height: 51,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#D7E4D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: '#176B36',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  addButton: {
    flex: 1,
    height: 51,
    borderRadius: 13,
    backgroundColor: '#176B36',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 10,
  },
  disabledAddButton: { backgroundColor: '#AAB4AC' },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  addButtonPrice: { color: '#E5F5E8', fontSize: 12, fontWeight: '700' },
});

export default ProductDetails;
