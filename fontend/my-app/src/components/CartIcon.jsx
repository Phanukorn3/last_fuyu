import React from "react";
// 1. Import SVG เข้ามา (จะได้เป็น URL path)
import shopping_cart from "../assets/shopping-cart.svg";

export default function CartIcon({ itemCount = 0, onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-20 right-20 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      aria-label={`View shopping cart with ${itemCount} items`}
    >
      <img 
        src={shopping_cart} 
        alt="Shopping Cart" 
        className="h-8 w-8" 
      />

      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
          {itemCount}
        </span>
      )}
    </button>
  );
}