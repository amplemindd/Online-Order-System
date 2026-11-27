import { Product } from '../../context/CartContext';

const API_BASE_URL = 'http://localhost:5000';

interface BackendProduct {
  id: number;
  category_id: number | null;
  name: string;
  price: string | number;
  image_path: string | null;
  description: string | null;
  stock: number;
  pricing_type: string;
}

interface ProductsResponse {
  success: boolean;
  count: number;
  products: BackendProduct[];
}

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products`);

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();

    if (!data.success || !Array.isArray(data.products)) {
      throw new Error('Invalid products response from server.');
    }

    return data.products.map(item => {
      const imagePath = item.image_path
        ? item.image_path.replace(/^\/+/, '')
        : '';

             return {
  id: item.id,
  name: item.name,
  price: Number(item.price),
  image: imagePath
    ? { uri: `${API_BASE_URL}/${imagePath}` }
    : require('../../assets/images/apples-p.jpg'),
  categoryId: item.category_id,
  description: item.description,
  stock: item.stock,
  pricingType: item.pricing_type,
};

          });
  } catch (error) {
    console.error('Product fetching failed:', error);
    throw error;
  }
};