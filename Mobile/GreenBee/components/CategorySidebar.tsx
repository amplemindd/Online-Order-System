
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SCREEN_WIDTH = Dimensions.get('window').width;
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.88, 340);

type Category = {
  id: string;
  title: string;
  icon: number;
  decoration?: number;
  description: string;
  sections: {
    title: string;
    items: string[];
  }[];
};

const categories: Category[] = [
  {
    id: 'fruits',
    title: 'Fresh Fruits',
    icon: require('../assets/images/Grapes.jpg'),
    decoration: require('../assets/images/yloworange.png'),
    description: 'Apple, Orange, Watermelon,\nBanana Pineapple, Grapes...',
    sections: [
      {
        title: 'BY CATEGORY',
        items: [
          'Berries',
          'Grapes',
          'Mangoes',
          'Melons',
          'Pears',
          'Plums & Apricots',
        ],
      },
      {
        title: 'BY BRANDS',
        items: [
          'Nova Fruits',
          'Nova Organic',
          'VisatootI',
          'Vinova',
          'Orange',
          'Apple',
        ],
      },
      {
        title: 'EXOTIC FRUITS',
        items: ['Berries', 'Tropical Fruits', 'Banana'],
      },
    ],
  },
  {
    id: 'vegetables',
    title: 'Vegetables',
    icon: require('../assets/images/vegetabl.jpg'),
    decoration: require('../assets/images/morevegies.png'),
    description: 'Cabbage, Onion, Kale, Parsley\nGarlic, Asparagus...',
    sections: [
      {
        title: 'DAILY VEGETABLES',
        items: [
          'Beans & Brinjals',
          'Broccoli & Cauliflower',
          'Chilies, Garlic, Lemon & Ginger',
          'Cut Vegetables & Salads',
          'Gourd, Cucumber & Pumpkin',
          'Herbs & Sprouts',
          'Lettuce & Leafy',
          'Truffles & Mushrooms',
        ],
      },
      {
        title: 'EXOTIC VEGETABLES',
        items: [
          'Avocados & Peppers',
          'Broccoli & Zucchini',
          'Celery, Fennel & Leeks',
          'Chilies & Lime',
          'Edible Flowers',
          'Heirloom Tomatoes',
          'Herbs & Microgreens',
          'Lettuce & Leafy Vegetables',
        ],
      },
    ],
  },
  {
    id: 'juices',
    title: 'Fresh Juices',
    icon: require('../assets/images/juice.jpg'),
    description: 'Apple, Orange, Watermelon,\nBanana Pineapple, Grapes...',
    sections: [
      {
        title: '',
        items: [
          'Lemonade',
          'Orange Juice',
          'Grape Juice',
          'Pineapple Juice',
          'Apple juice',
          'Watermelon',
          'Cranberry Juice',
          'Strawberry Juice',
          'White Grape Juice',
        ],
      },
    ],
  },
  {
    id: 'tea',
    title: 'Tea & Coffee',
    icon: require('../assets/images/tea.jpg'),
    description: 'Lemon Tea, Peach Tea, Milk Tea,\nWeight Loss Tea, Coffee ...',
    sections: [
      {
        title: '',
        items: [
          'Lemon Tea',
          'Peach Tea',
          'Milk Tea',
          'Weight Loss Tea',
          'Coffee',
        ],
      },
    ],
  },
  {
    id: 'bread',
    title: 'Bread',
    icon: require('../assets/images/bread.jpg'),
    description: 'Bread, CupCake, Croissants, Rice\nCake, Donuts...',
    sections: [
      {
        title: '',
        items: ['Bread', 'CupCake', 'Croissants', 'Rice Cake', 'Donuts'],
      },
    ],
  },
  {
    id: 'meats',
    title: 'Fresh Meats',
    icon: require('../assets/images/meat.jpg'),
    description: 'Pork, Beef, Lamb Chops, Salmon\nChicken, Sausage...',
    sections: [
      {
        title: '',
        items: [
          'Pork',
          'Beef',
          'Lamb Chops',
          'Salmon',
          'Chicken',
          'Sausage',
        ],
      },
    ],
  },
];

const CategorySidebar: React.FC<Props> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();

  const translateX = useRef(
    new Animated.Value(-SIDEBAR_WIDTH),
  ).current;

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (visible) {
      translateX.setValue(-SIDEBAR_WIDTH);

      Animated.timing(translateX, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateX]);

  const closeSidebar = (): void => {
    translateX.stopAnimation();

    Animated.timing(translateX, {
      toValue: -SIDEBAR_WIDTH,
      duration: 240,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  };

  const toggleCategory = (id: string): void => {
    setExpanded((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeSidebar}
    >
      <View style={styles.modalContainer}>
        {/* Blank space: tap here to close */}
        <Pressable
          style={styles.backdrop}
          onPress={closeSidebar}
        />

        {/* Left-side category sidebar */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              paddingTop: insets.top + 12,
              paddingBottom: Math.max(insets.bottom, 12),
              transform: [{ translateX }],
            },
          ]}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {categories.map((category) => {
              const isExpanded = !!expanded[category.id];

              return (
                <View key={category.id} style={styles.category}>
                  {/* Category row */}
                  <View style={styles.categoryHeader}>
                    <Image
                      source={category.icon}
                      style={styles.categoryIcon}
                      resizeMode="contain"
                    />

                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryTitle}>
                        {category.title}
                      </Text>

                      <Text style={styles.description}>
                        {category.description}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.expandButton,
                        isExpanded && styles.expandButtonActive,
                      ]}
                      onPress={() => toggleCategory(category.id)}
                      activeOpacity={0.7}
                      accessibilityRole="button"
                      accessibilityLabel={
                        `${isExpanded ? 'Collapse' : 'Expand'} ${category.title}`
                      }
                    >
                      <Text style={styles.expandSymbol}>
                        {isExpanded ? '−' : '+'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Expandable category details */}
                  {isExpanded && (
                    <View style={styles.categoryDetails}>
                      {category.sections.map((section, index) => (
                        <View
                          key={`${category.id}-${index}`}
                          style={styles.section}
                        >
                          {section.title !== '' && (
                            <Text style={styles.sectionTitle}>
                              {section.title}
                            </Text>
                          )}

                          {section.items.map((item, itemIndex) => (
                            <TouchableOpacity
                              key={`${item}-${itemIndex}`}
                              style={styles.subcategoryButton}
                              activeOpacity={0.7}
                              onPress={() => {
                                // Product/category navigation can be connected later.
                              }}
                            >
                              <Text style={styles.subcategoryText}>
                                {item}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}

                      {/* Decorative image for fruits and vegetables */}
                      {category.decoration && (
                        <Image
                          source={category.decoration}
                          style={styles.decorationImage}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    elevation: 12,
    zIndex: 1,
  },

  listContent: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },

  category: {
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },

  categoryHeader: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  categoryIcon: {
    width: 42,
    height: 42,
    marginRight: 12,
  },

  categoryInfo: {
    flex: 1,
    minWidth: 0,
    paddingRight: 4,
  },

  categoryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 8,
  },

  description: {
    fontSize: 10,
    lineHeight: 15,
    color: '#888888',
  },

  expandButton: {
    width: 15,
    height: 15,
    backgroundColor: '#B9B9B9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },

  expandButtonActive: {
    backgroundColor: '#16845C',
  },

  expandSymbol: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 16,
    fontWeight: '700',
    textAlign: 'center',
  },

  categoryDetails: {
    paddingTop: 22,
    paddingHorizontal: 15,
    paddingBottom: 18,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#76B82A',
    marginBottom: 15,
  },

  subcategoryButton: {
    minHeight: 27,
    justifyContent: 'center',
  },

  subcategoryText: {
    fontSize: 11,
    color: '#555555',
  },

  decorationImage: {
    width: '100%',
    height: 170,
    marginTop: 8,
    alignSelf: 'center',
  },
});

export default CategorySidebar;
