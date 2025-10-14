import React, { useState, useEffect } from "react";
import axios from "axios";
import Filterbar from "../components/Filterbar";
import CartIcon from "../components/CartIcon";
import Cart from "../components/Cart";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [allCategoryQuantities, setAllCategoryQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const prices = ["0-200", "201-400", "401-700", "700+"];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/product/");
        setProducts(res.data.products);
        // console.log(res.data.products);

        const categoriesSet = new Set();
        const quantities = {};

        res.data.products.forEach((product) => {
          product.categories.forEach((cat) => {
          console.log(cat)
          categoriesSet.add(cat);
          quantities[cat] = (quantities[cat] || 0) + 1;
          console.log(quantities[cat])
        });
      });
      
      setAllCategories(Array.from(categoriesSet).sort());
      console.log(quantities)
        setAllCategoryQuantities(quantities);
      } catch (err) {
        console.error("ไม่สามารถดึงสินค้า:", err);
      }
    };

    fetchAllProducts();
  }, []);

  const fetchFilteredProducts = async () => {
    try {
      const params = {};
      if (selectedCategories.length > 0)
        params["categories[]"] = selectedCategories;
      if (selectedPrice.length > 0) params["price[]"] = selectedPrice;

      const res = await axios.get("http://localhost:8000/api/product/", {
        params,
      });
      setProducts(res.data.products);
      console.log(res.data.products);
    } catch (err) {
      console.error("ไม่สามารถดึงสินค้า filtered:", err);
    }
  };

  // เรียก fetchFilteredProducts เมื่อ filter เปลี่ยน
  useEffect(() => {
    fetchFilteredProducts();
  }, [selectedCategories, selectedPrice]);

  // category filter
  const handleCategoryChange = (categoryName) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  // price filter
  const handlePriceChange = (priceRange) => {
    setSelectedPrice((prev) =>
      prev.includes(priceRange)
        ? prev.filter((p) => p !== priceRange)
        : [...prev, priceRange]
    );
  };
  const handleAddToCart = (productToAdd) => {
    // เพื่ออัปเดต state ของตะกร้า
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === productToAdd.id
      );

      // ถ้ามีของอยู่แล้ว
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // ถ้ายังไม่มี
      return [...prevItems, { ...productToAdd, quantity: 1 }];
    });

    // setIsCartOpen(true);

    // (ตัวเลือก) console.log สำหรับเช็คค่า
    console.log(`${productToAdd.name} added to cart!`);
  };
  const handleRemoveFromCart = (productIdToRemove) => {
    setCartItems((prevItems) =>
      // สร้าง array ใหม่ โดยกรองเอาเฉพาะสินค้าที่ id ไม่ตรงกับ id ที่ต้องการลบ
      prevItems.filter((item) => item.id !== productIdToRemove)
    );
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="container mx-auto mt-[12%] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row gap-8">
        {/* Filter sidebar */}
        <div className="w-1/4 border-r-1 border-gray-400">
          <Filterbar
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            prices={prices}
            quantity={allCategoryQuantities} // quantity คงที่ ไม่เปลี่ยนตาม filter
            selectedPrice={selectedPrice}
            priceChange={handlePriceChange}
          />
        </div>

        {/* Product grid */}
        <div className="w-3/4">
          <div className="flex flex-wrap gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col w-64 h-auto border items-center border-gray-200 rounded-2xl transition-all hover:scale-105 shadow-md p-5"
              >
                <img
                  src={`http://localhost:8000${product.picture}`}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded-md"
                />
                <h3 className="text-lg text-gray-800 font-medium group-hover:text-red-500 text-center">
                  {product.name}
                </h3>
                <p className="text-gray-600 mt-2">{product.price} บาท</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 w-auto rounded-lg bg-orange-500 px-4 py-2 text-white transition hover:bg-orange-600"
                >
                  เพิ่มลงตะกร้า
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CartIcon itemCount={cartItems.length} onClick={openCart} />
      <Cart isOpen={isCartOpen} onClose={closeCart} cartItems={cartItems} onRemoveItem={handleRemoveFromCart}/>
    </div>
  );
}
