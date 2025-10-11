import Card from "../components/Card";
import AddProduct from "../components/AddProduct";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [products, setProducts] = useState([]);
    const [filterProducts, setFilterProducts] = useState([]);
    const [totalProducts, setTotalProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const fetchProducts = () => {
        axios.get("http://localhost:8000/api/product/")
        .then(res => {
            setProducts(res.data.products);
            setFilterProducts(res.data.products);
            setTotalProducts(res.data.total_products);
        })
        .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

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
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          เพิ่มสินค้า
        </button>

      {showForm && (
        <AddProduct
          onClose={() => setShowForm(false)}
          onAddSuccess={fetchProducts}  />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="จำนวนสินค้าทั้งหมด" value={totalProducts.total} />
        <Card title="รายงานยอดขาย" value="$12,430" />
        <Card title="Active Sessions" value="320" />
      </div>

      <div className="bg-white shadow rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-medium text-gray-700 mr-2">จำนวน:</span>

        <button
          onClick={filterAll}
          className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 hover:bg-blue-500 hover:text-white transition">
          ทั้งหมด
        </button>

        <button
          onClick={filterLowest}
          className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 hover:bg-blue-500 hover:text-white transition">
          ต่ำสุด
        </button>

        <button
          onClick={filterHighest}
          className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 hover:bg-blue-500 hover:text-white transition">
          สูงสุด
        </button>
      </div>

      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">ชื่อสินค้า</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">หมวดหมู่</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">ราคา</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">จำนวน</th>
            </tr>
          </thead>
          <tbody>
            {filterProducts.map((product, index) => (
              <tr
                key={product.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-4 text-sm">{product.id}</td>
                <td className="py-3 px-4 text-sm">{product.name}</td>
                <td className="py-3 px-4 text-sm">{product.categories.name}</td>
                <td className="py-3 px-4 text-sm">{product.price}</td>
                <td className="py-3 px-4 text-sm">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}