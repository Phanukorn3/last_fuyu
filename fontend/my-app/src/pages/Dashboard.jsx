import Card from "../components/Card";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);
    
    const [minQuantity, setMinQuantity] = useState(0);
    const [maxQuantity, setMaxQuantity] = useState(0);

    const fetchProducts = () => {
        axios.get("http://localhost:8000/api/product/")
        .then(res => {
            setProducts(res.data.products);
            setFilterProducts(res.data.products);
            setTotalProducts(res.data.total_products || 0);

            setMinQuantity(res.data.min_quantity || 0);
            setMaxQuantity(res.data.max_quantity || 0);
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {
        if (window.confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
            try {
                await axios.delete(`http://localhost:8000/api/product/${productId}/`);
                alert('ลบสินค้าเรียบร้อยแล้ว');
                fetchProducts(); 
            } catch (err) {
                console.error("เกิดข้อผิดพลาดในการลบสินค้า:", err);
                alert('เกิดข้อผิดพลาดในการลบสินค้า');
            }
        }
    };

    const filterLowest = () => {
        setFilterProducts(
            [...products].sort((a, b) => a.quantity - b.quantity)
        );
    };

    const filterHighest = () => {
        setFilterProducts(
            [...products].sort((a, b) => b.quantity - a.quantity)
        );
    };

    const filterAll = () => {
        setFilterProducts(products);
    };

  return (
    
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <Link
          to="/addproduct" 
          className="inline-block px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 transition"
        >
          เพิ่มสินค้า
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="จำนวนสินค้าทั้งหมด" value={totalProducts} />
        <Card title="จำนวนน้อยที่สุด" value={minQuantity} />
        <Card title="จำนวนมากที่สุด" value={maxQuantity} />
      </div>

      <div className="bg-white shadow rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-gray-700 mr-2">เรียงตามจำนวน:</span>
        <button
          onClick={filterAll}
          className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-sky-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-sky-500">
          ทั้งหมด
        </button>
        <button
          onClick={filterLowest}
          className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-sky-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-sky-500">
          น้อยที่สุด
        </button>
        <button
          onClick={filterHighest}
          className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-800 hover:bg-sky-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-sky-500">
          มากที่สุด
        </button>
      </div>

      <div className="bg-white shadow-md rounded-2xl overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">ชื่อสินค้า</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">หมวดหมู่</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">ราคา</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">จำนวน</th>
              <th className="py-3 px-4 text-center text-sm font-semibold">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filterProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="py-3 px-4 text-sm text-slate-600">{product.id}</td>
                <td className="py-3 px-4 text-sm text-slate-800 font-medium">{product.name}</td>
                <td className="py-3 px-4 text-sm text-slate-600">
                  {product.categories.map(cat => cat.name).join(", ")}
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">{product.price}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{product.quantity}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center items-center gap-2">
                    <Link
                      to={`/editproduct/${product.id}`}
                      className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-md hover:bg-amber-600 transition"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-md hover:bg-red-600 transition"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}