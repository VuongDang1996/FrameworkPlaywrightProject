/**
 * Test data interfaces for Automation Exercise tests
 */

export interface UserRegistrationData {
  name: string;
  email: string;
  title: 'Mr' | 'Mrs';
  password: string;
  day: string;
  month: string;
  year: string;
  newsletter?: boolean;
  offers?: boolean;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  filePath?: string;
}

export interface ProductReviewData {
  name: string;
  email: string;
  review: string;
}

export interface PaymentData {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expirationMonth: string;
  expirationYear: string;
}

export interface AddressData {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

/**
 * Test data constants
 */
export const TEST_USERS = {
  VALID_USER: {
    email: 'vanvuongbtm@gmail.com',
    password: 'vanvuongbtm@gmail.com',
  },
  INVALID_USER: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  EXISTING_USER: {
    email: 'existing@example.com',
    password: 'password123',
  },
} as const;

export const SAMPLE_REGISTRATION_DATA: UserRegistrationData = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  title: 'Mr',
  password: 'password123',
  day: '15',
  month: 'January',
  year: '1990',
  newsletter: true,
  offers: true,
  firstName: 'Test',
  lastName: 'User',
  company: 'Test Company',
  address1: '123 Test Street',
  address2: 'Apt 456',
  country: 'United States',
  state: 'California',
  city: 'Los Angeles',
  zipcode: '90210',
  mobileNumber: '+1234567890',
};

export const SAMPLE_CONTACT_DATA: ContactFormData = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Test Subject',
  message: 'This is a test message for the contact form. Testing automation.',
};

export const SAMPLE_REVIEW_DATA: ProductReviewData = {
  name: 'Test Reviewer',
  email: 'reviewer@example.com',
  review: 'This is an excellent product! Highly recommended for anyone looking for quality.',
};

export const SAMPLE_PAYMENT_DATA: PaymentData = {
  nameOnCard: 'Test User',
  cardNumber: '4111111111111111',
  cvc: '123',
  expirationMonth: '12',
  expirationYear: '2025',
};

/**
 * Search terms for product testing
 */
export const SEARCH_TERMS = {
  SHIRT: 'shirt',
  DRESS: 'dress',
  JEANS: 'jeans',
  TOP: 'top',
} as const;

/**
 * Category names
 */
export const CATEGORIES = {
  WOMEN: {
    DRESS: 'Dress',
    TOPS: 'Tops',
    SAREE: 'Saree',
  },
  MEN: {
    TSHIRTS: 'Tshirts',
    JEANS: 'Jeans',
  },
  KIDS: {
    DRESS: 'Dress',
    TOPS_SHIRTS: 'Tops & Shirts',
  },
} as const;

/**
 * Brand names
 */
export const BRANDS = {
  POLO: 'Polo',
  H_AND_M: 'H&M',
  MADAME: 'Madame',
  MAST_HARBOUR: 'Mast & Harbour',
  BABYHUG: 'Babyhug',
  ALLEN_SOLLY_JUNIOR: 'Allen Solly Junior',
  KOOKIE_KIDS: 'Kookie Kids',
  BIBA: 'Biba',
} as const;
