import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/product/");
        setProducts(res.data.products);
        console.log(res.data.products);
      } catch (err) {
        console.error("ไม่สามารถดึงข้อมูลสินค้าได้:", err);
      }
    };

    fetchProducts();
  }, []);
  return (
    <div className="flex flex-col w-auto h-auto mt-[12%]">
      <h2 className="text-red-600 text-3xl mb-12 ml-10">
        Discover our products
      </h2>

      <div className="flex flex-row gap-25 mx-auto flex-wrap justify-start ml-20">
        {products &&
          products.slice(0, 10).map((product) => (
            <Link to="/user/product" key={product.id}>
            <div
              className="group flex flex-col w-65 h-auto border items-center border-white rounded-2xl transition-all hover:scale-110 shadow-md p-5"
            >
              <img
                src={`http://localhost:8000${product.picture}`}
                alt={product.name}
                className="w-auto h-auto object-cover mb-3"
              />
              <h3 className="text-md text-gray-800 font-medium group-hover:text-red-500">{product.name}</h3>
            </div></Link>
          ))}
      </div>
    </div>
  );
}
