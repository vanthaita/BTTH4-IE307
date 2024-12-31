export interface UserData {
  id: string;
  name: string | { firstname: string; lastname: string };
  username?: string;
  email?: string;
  phone?: string;
  address?: {
    geolocation?: {
      lat?: string;
      long?: string;
    };
    city?: string;
    street?: string;
    number?: number;
    zipcode?: string;
  };
}
export type CartItem = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};
export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category?: string;
  rating?: {
    rate: number;
    count: number;
  };
}
