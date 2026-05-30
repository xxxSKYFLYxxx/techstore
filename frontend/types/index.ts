export interface User {
  id: number;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  images: string[];
  specs: Record<string, string>;
  category: Category;
  brand: Brand;
  createdAt: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  product: Product;
}

export interface Order {
  id: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  total: string;
  address: string;
  phone: string;
  createdAt: string;
  items: OrderItem[];
}

export interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: User;
}
