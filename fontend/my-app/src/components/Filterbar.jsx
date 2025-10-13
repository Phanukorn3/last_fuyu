import React from "react";

export default function Filterbar({
  categories,
  quantity,
  selectedCategories,
  onCategoryChange,
  prices,
  selectedPrice,
  priceChange,
}) {
  return (
    <div>
        {/* ตาม category */}
      <div className="p-4 border-b-1 border-gray-400 mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">หมวดหมู่</h3> 
        <div className="flex flex-col gap-3">
          {categories.map((category) => (
            <label
              key={`${category}`}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300  focus:ring-orange-400"
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
              />
              <span className="text-gray-700">{category}</span><span className="text-sm text-gray-600">({quantity[category] || 0})</span>
            </label>
          ))}
        </div>
      </div>
      {/* ตามราคา */}
      <div className="p-4 border-b-1 border-gray-400">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">ราคา</h3>
        <div className="flex flex-col gap-3">
          {prices.map((price) => (
            <label
              key={`${price}`}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300  focus:ring-orange-400"
                checked={selectedPrice.includes(price)}
                onChange={() => priceChange(price)}
              />
              <span className="text-gray-700">{price}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
