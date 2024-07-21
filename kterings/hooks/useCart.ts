import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useCartCount } from "@/hooks/CartContext";

export interface CartItem {
  id: string;
  maxQuantity: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  kterer_id?: number;
}

function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { cartCount, updateCartCount } = useCartCount();

  useEffect(() => {
    const getCartItems = async () => {
      try {
        const cart = await SecureStore.getItemAsync("cart");
        if (cart) {
          setCartItems(JSON.parse(cart));
        }
      } catch (error) {
        console.error("Failed to load cart items from Secure Store", error);
      }
    };

    getCartItems();
  }, []);

  useEffect(() => {
    const syncCartWithSecureStore = async () => {
      try {
        const cart = await SecureStore.getItemAsync("cart");
        setCartItems(cart ? JSON.parse(cart) : []);
      } catch (error) {
        console.error("Failed to sync cart items with Secure Store", error);
      }
    };

    const handleStorageChange = () => {
      syncCartWithSecureStore();
    };

    // Use event listener for storage change if necessary in your context

    return () => {
      // Remove event listener if necessary
    };
  }, []);

  const saveCartItems = async (items: CartItem[]) => {
    try {
      await SecureStore.setItemAsync("cart", JSON.stringify(items));
      setCartItems(items);
    } catch (error) {
      console.error("Failed to save cart items to Secure Store", error);
    }
  };

  const addItemToCart = async (newItem: CartItem) => {
    try {
      const cart = await SecureStore.getItemAsync("cart");
      const arItems = cart ? JSON.parse(cart) : [];

      const existingItemIndex = arItems.findIndex(
        (item: any) => item.id === newItem.id && item.size === newItem.size
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = arItems.map((item: any, index: any) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...arItems, newItem];
      }

      await saveCartItems(updatedItems);
      updateCartCount(updatedItems.length);
    } catch (error) {
      console.error("Failed to add item to cart", error);
    }
  };

  const removeItemFromCart = async (id: string, size: string) => {
    try {
      const updatedItems = cartItems.filter(
        (item) => !(item.id === id && item.size === size)
      );

      await saveCartItems(updatedItems);
      updateCartCount(updatedItems.length);
    } catch (error) {
      console.error("Failed to remove item from cart", error);
    }
  };

  const updateItemQuantity = async (
    id: string,
    size: string,
    newQuantity: number
  ) => {
    try {
      const updatedItems = cartItems.map((item) => {
        if (item.id === id && item.size === size) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      await saveCartItems(updatedItems);
    } catch (error) {
      console.error("Failed to update item quantity", error);
    }
  };

  const clearCart = async () => {
    try {
      await SecureStore.deleteItemAsync("cart");
      setCartItems([]);
      updateCartCount(0);
    } catch (error) {
      console.error("Failed to clear cart", error);
    }
  };

  const getCartLength = async () => {
    try {
      const cart = await SecureStore.getItemAsync("cart");
      const cartItems = cart ? JSON.parse(cart) : [];
      return cartItems.length;
    } catch (error) {
      console.error("Failed to get cart length from Secure Store", error);
      return 0;
    }
  };

  return {
    cartItems,
    setCartItems,
    addItemToCart,
    removeItemFromCart,
    updateItemQuantity,
    clearCart,
    getCartLength, // Expose the new function
  };
}

export default useCart;
