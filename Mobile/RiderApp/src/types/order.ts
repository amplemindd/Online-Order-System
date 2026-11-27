export interface OrderItem {
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  product_size: string | null;
  product_color: string | null;
  image_path: string | null;
}

export interface RiderOrder {
  id: number;
  assignment_id?: number;
  rider_status?: 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  address: string;
  apartment: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
  items: OrderItem[];
}