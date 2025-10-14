import { useState } from "react";
import axios from "axios";

export default function AddProduct({ onClose, onAddSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: ""
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:8000/api/product/", formData);
      alert("เพิ่มสินค้าเรียบร้อย");
      onAddSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">เพิ่มสินค้า</h2>
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="ชื่อสินค้า"
          value={formData.name}
          onChange={handleInputChange}
          className="border rounded p-2"/>
        <input
          type="text"
          name="price"
          placeholder="ราคา"
          value={formData.price}
          onChange={handleInputChange}
          className="border rounded p-2"/>
        <input
          type="number"
          name="quantity"
          placeholder="จำนวน"
          value={formData.quantity}
          onChange={handleInputChange}
          className="border rounded p-2"/>

        <div className="flex gap-2 mt-2">
          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            บันทึก
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}