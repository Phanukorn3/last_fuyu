import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export default function AddProduct({ onAddSuccess }) {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    picture: null,
    categories: []
  });

  const [allCategories, setAllCategories] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/api/categories/")
      .then(res => setAllCategories(res.data.categories))
      .catch(err => console.error(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files, selectedOptions } = e.target;

    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
      setPreviewUrl(files[0] ? URL.createObjectURL(files[0]) : null);
    } else if (type === "select-multiple") {
      const selectedValues = Array.from(selectedOptions).map(o => o.value);
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      if (key === "categories") {
        formData.categories.forEach(cat => data.append("categories", cat));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      await axios.post("http://localhost:8000/api/product/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]')?.value
        }
      });

      alert("เพิ่มสินค้าเรียบร้อย");
      navigate('/admin/dashboard/');
      if (onAddSuccess) onAddSuccess();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-4">เพิ่มสินค้า</h2>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">ชื่อสินค้า</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="border rounded p-2 focus:ring-2 focus:ring-orange-400"
          placeholder="ชื่อสินค้า"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">รายละเอียด</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="border rounded p-2 focus:ring-2 focus:ring-orange-400"
          rows={3}
          placeholder="รายละเอียดสินค้า"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">ราคา</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="border rounded p-2 focus:ring-2 focus:ring-orange-400"
            placeholder="ราคา"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">จำนวน</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            className="border rounded p-2 focus:ring-2 focus:ring-orange-400"
            placeholder="จำนวน"
            required
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">รูปสินค้า</label>
        <label
          htmlFor="picture-upload"
          className="inline-block cursor-pointer px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2"
        >
          Choose Image
        </label>
        <input
          id="picture-upload"
          type="file"
          name="picture"
          className="hidden"
          onChange={handleInputChange}
        />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-2 rounded-lg border max-h-64 object-contain"
          />
        )}
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">หมวดหมู่</label>
        <select
          name="categories"
          multiple
          value={formData.categories}
          onChange={handleInputChange}
          className="border rounded p-2 h-32 focus:ring-2"
        >
          {allCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button type="submit" className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
          บันทึก
        </button>
        <button type="button" onClick={() => setFormData({
          name: "", description: "", price: "", quantity: "", picture: null, categories: []
        })} className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
          ยกเลิก
        </button>
      </div>
    </form>
  );
}