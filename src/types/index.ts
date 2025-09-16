export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  loyalty_points: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  delivery_address: string;
  delivery_date: string;
  delivery_time: string;
  cake_message?: string;
  status: OrderStatus;
  payment_reference?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 
  | 'pending_payment'
  | 'payment_verified'
  | 'baking'
  | 'out_for_delivery'
  | 'delivered';

export interface AdminLog {
  id: string;
  admin_user: string;
  action: string;
  order_id?: string;
  details?: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  getTotalItems: () => number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
}