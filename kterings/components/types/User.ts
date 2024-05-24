// User.ts

export interface User {
  client_id: string;
  first_name: string;
  last_name: string;
  user_type: "kterer" | "other"; // Assuming 'user_type' can be 'kterer' or other types
  email: string;
  phone: string;
  country: string;
  email_notification: boolean;
  affiliate_link: string;
  kterer?: Kterer; // Assuming Kterer is another type/interface
  favourites?: Favourite[]; // Assuming Favourite is another type/interface
  addresses?: Address[]; // Assuming Address is another type/interface
  foodReviews?: FoodReview[]; // Assuming FoodReview is another type/interface
  ktererReviews?: KtererReview[]; // Assuming KtererReview is another type/interface
  orders?: Order[]; // Assuming Order is another type/interface
}

export interface Kterer {
  // Define properties of Kterer here
}

export interface Favourite {
  // Define properties of Favourite here
}

export interface Address {
  // Define properties of Address here
}

export interface FoodReview {
  // Define properties of FoodReview here
}

export interface KtererReview {
  // Define properties of KtererReview here
}

export interface Order {
  // Define properties of Order here
}
