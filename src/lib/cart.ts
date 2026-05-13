import { Product } from "@/lib/api/productsApi";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  image?: string;
  price: number;
  stockQuantity: number;
  quantity: number;
};

export const CART_STORAGE_KEY = "wow_cart";

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  const value = localStorage.getItem(CART_STORAGE_KEY);

  if (!value) return [];

  try {
    return JSON.parse(value) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("wow-cart-updated"));
}

export function getSellingPrice(product: Product) {
  return product.discountPrice && product.discountPrice > 0
    ? product.discountPrice
    : product.price;
}

export function addProductToCart(product: Product, quantity: number = 1) {
  const currentItems = getCartItems();
  const existingItem = currentItems.find(
    (item) => item.productId === product._id,
  );

  const sellingPrice = getSellingPrice(product);

  if (existingItem) {
    const newQuantity = Math.min(
      existingItem.quantity + quantity,
      product.stockQuantity,
    );

    const updatedItems = currentItems.map((item) =>
      item.productId === product._id
        ? {
            ...item,
            quantity: newQuantity,
            stockQuantity: product.stockQuantity,
            price: sellingPrice,
          }
        : item,
    );

    saveCartItems(updatedItems);
    return;
  }

  const newItem: CartItem = {
    productId: product._id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    image: product.images?.[0],
    price: sellingPrice,
    stockQuantity: product.stockQuantity,
    quantity: Math.min(quantity, product.stockQuantity),
  };

  saveCartItems([...currentItems, newItem]);
}

export function removeCartItem(productId: string) {
  const items = getCartItems().filter((item) => item.productId !== productId);
  saveCartItems(items);
}

export function updateCartItemQuantity(productId: string, quantity: number) {
  const items = getCartItems().map((item) =>
    item.productId === productId
      ? {
          ...item,
          quantity: Math.max(1, Math.min(quantity, item.stockQuantity)),
        }
      : item,
  );

  saveCartItems(items);
}

export function clearCart() {
  saveCartItems([]);
}
