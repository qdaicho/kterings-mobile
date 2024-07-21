interface AmountDetails {
  tip: any[];
}

interface AutomaticPaymentMethods {
  allow_redirects: string;
  enabled: boolean;
}

interface PaymentMethodConfigurationDetails {
  id: string;
  parent: any | null;
}

interface AfterpayClearpayOptions {
  reference: any | null;
}

interface CardOptions {
  installments: any | null;
  mandate_options: any | null;
  network: any | null;
  request_three_d_secure: string;
}

interface KlarnaOptions {
  preferred_locale: any | null;
}

interface LinkOptions {
  persistent_token: any | null;
}

interface PaymentMethodOptions {
  afterpay_clearpay: AfterpayClearpayOptions;
  card: CardOptions;
  klarna: KlarnaOptions;
  link: LinkOptions;
}

export interface PaymentIntent {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: AmountDetails;
  amount_received: number;
  application: any | null;
  application_fee_amount: any | null;
  automatic_payment_methods: AutomaticPaymentMethods;
  canceled_at: any | null;
  cancellation_reason: any | null;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: any | null;
  description: any | null;
  invoice: any | null;
  last_payment_error: any | null;
  latest_charge: any | null;
  livemode: boolean;
  metadata: any[];
  next_action: any | null;
  on_behalf_of: any | null;
  payment_method: any | null;
  payment_method_configuration_details: PaymentMethodConfigurationDetails;
  payment_method_options: PaymentMethodOptions;
  payment_method_types: string[];
  processing: any | null;
  receipt_email: any | null;
  review: any | null;
  setup_future_usage: any | null;
  shipping: any | null;
  source: any | null;
  statement_descriptor: any | null;
  statement_descriptor_suffix: any | null;
  status: string;
  transfer_data: any | null;
  transfer_group: any | null;
}


export interface DoorDashResponse {
  statusCode: number;
  data: {
    external_delivery_id: string;
    currency: string;
    delivery_status: string;
    fee: number;
    locale: string;
    pickup_address: string;
    pickup_business_name: string;
    pickup_phone_number: string;
    pickup_external_business_id: string;
    pickup_external_store_id: string;
    dropoff_address: string;
    dropoff_location: {
      lat: number;
      lng: number;
    };
    dropoff_phone_number: string;
    dropoff_options: {
      signature: string;
      id_verification: string;
      proof_of_delivery: string;
      catering_setup: string;
    };
    order_value: number;
    updated_at: string;
    pickup_time_estimated: string;
    dropoff_time_estimated: string;
    fee_components: any[];
    tax: number;
    tax_components: {
      type: string;
      amount: number;
    }[];
    tracking_url: string;
    contactless_dropoff: boolean;
    action_if_undeliverable: string;
    tip: number;
    order_contains: {
      alcohol: boolean;
      pharmacy_items: boolean;
      age_restricted_pharmacy_items: boolean;
      tobacco: boolean;
      hemp: boolean;
      otc: boolean;
    };
    dropoff_requires_signature: boolean;
    dropoff_cash_on_delivery: number;
  };
}

export interface ProductStored {
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
      metadata: {
        food_id: string;
        size: string;
      };
      images: string[];
    };
  };
  quantity: number;
}

export interface SessionData {
  id: string;
  object: string;
  after_expiration: any;
  allow_promotion_codes: any;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: {
    enabled: boolean;
    liability: any;
    status: any;
  };
  billing_address_collection: any;
  cancel_url: string;
  client_reference_id: any;
  client_secret: any;
  consent: any;
  consent_collection: any;
  created: number;
  currency: string;
  currency_conversion: any;
  custom_fields: any[];
  custom_text: {
    after_submit: any;
    shipping_address: any;
    submit: any;
    terms_of_service_acceptance: any;
  };
  customer: any;
  customer_creation: string;
  customer_details: any;
  customer_email: any;
  expires_at: number;
  invoice: any;
  invoice_creation: {
    enabled: boolean;
    invoice_data: {
      account_tax_ids: any;
      custom_fields: any;
      description: any;
      footer: any;
      issuer: any;
      metadata: any[];
      rendering_options: any;
    };
  };
  livemode: boolean;
  locale: any;
  metadata: {
    kterer_id: string;
    shipping_address: string;
    tip: string;
    user_id: string;
  };
  mode: string;
  payment_intent: any;
  payment_link: any;
  payment_method_collection: string;
  payment_method_configuration_details: {
    id: string;
    parent: any;
  };
  payment_method_options: {
    affirm: any[];
    card: {
      request_three_d_secure: string;
    };
  };
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: {
    enabled: boolean;
  };
  recovered_from: any;
  saved_payment_method_options: any;
  setup_intent: any;
  shipping_address_collection: {
    allowed_countries: string[];
  };
  shipping_cost: any;
  shipping_details: any;
  shipping_options: any[];
  status: string;
  submit_type: any;
  subscription: any;
  success_url: string;
  total_details: {
    amount_discount: number;
    amount_shipping: number;
    amount_tax: number;
  };
  ui_mode: string;
  url: string;
}

export interface Address {
  address: string;
  created_at: string;
  deleted_at: string | null;
  id: string;
  type: string;
  updated_at: string;
  user_id: number;
}

export interface qImage {
  id: string;
  food_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Quantity {
  id: string;
  food_id: string;
  size: string;
  price: string;
  quantity: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Food {
  id: string;
  kterer_id: number;
  name: string;
  description: string;
  ingredients: string;
  halal: string;
  kosher: boolean;
  vegetarian: string;
  desserts: string;
  contains_nuts: boolean;
  meat_type: string;
  ethnic_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  auto_delivery_time: number;
  images: qImage[];
  quantities: Quantity[];
  rating: number;
}

export interface User {
  id: number;
  client_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  email_notification: number;
  user_type: string;
  affiliate_link: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Kterer {
  id: number;
  profile_image_url: string;
  rating: number;
  user: User;
}

export interface UserFoodReview {
  reviewText: string;
  author: string;
  rating: number;
}

export interface Review {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  rating: number;
  review: string;
  created_at: string;
  images: string[];
}

export interface KtererProfile {
  id: number;
  user_id: number;
  is_verified: boolean;
  admin_verified: number;
  stripe_account_id: string | null;
  profile_image_url: string;
  bio: string;
  ethnicity: string;
  experienceUnit: string | null;
  experienceValue: string | null;
  street_address: string;
  city: string;
  apartment: string;
  province: string;
  country: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  door_dash_business_id: string;
  door_dash_store_id: string;
  name: string;
  rating: number;
  user: User;
}

export interface KtererResponse {
  isFavorite: boolean;
  kterer: KtererProfile;
  message: string;
}
