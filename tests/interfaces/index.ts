/**
 * User credential interface for authentication
 */
export interface UserCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Login result interface
 */
export interface LoginResult {
  success: boolean;
  errorMessage?: string;
  redirectUrl?: string;
}

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: Date;
}

/**
 * User roles enumeration
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  GUEST = 'guest'
}

/**
 * Product interface
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  inStock: boolean;
  imageUrl?: string;
}

/**
 * Cart item interface
 */
export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

/**
 * Form data interface
 */
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
}

/**
 * API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

/**
 * Test configuration interface
 */
export interface TestConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  headless: boolean;
}

/**
 * Navigation menu item interface
 */
export interface NavigationItem {
  label: string;
  url: string;
  isActive?: boolean;
  hasSubMenu?: boolean;
  subItems?: NavigationItem[];
}
