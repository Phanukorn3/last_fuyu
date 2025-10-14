import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditProduct() {
  const { id } = useParams();
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/product/${id}/`);
        const product = res.data;
        
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          picture: null, 
          categories: product.categories.map(cat => String(cat.id))
        });

        if (product.picture) {
          const imageUrl = `http://localhost:8000${product.picture}`;
          setPreviewUrl(imageUrl); 
        }

      } catch (err) {
        console.error("Failed to fetch product", err);
        setError("ไม่พบสินค้าที่ต้องการแก้ไข หรือเกิดข้อผิดพลาด");
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/categories/");
        setAllCategories(res.data.categories);
      } catch (err) {
        console.error("Failed", err);
      }
    };

    Promise.all([fetchProduct(), fetchCategories()]).then(() => {
      setIsLoading(false); 
    });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, files, selectedOptions } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, [name]: file }); 
      setPreviewUrl(file ? URL.createObjectURL(file) : null);
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
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    formData.categories.forEach(catId => data.append("categories", catId));

    if (formData.picture) {
      data.append("picture", formData.picture);
    }
    
    try {
      await axios.put(`http://localhost:8000/api/product/${id}/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });

      alert("แก้ไขสินค้าเรียบร้อย");
      navigate('/admin/dashboard/');
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการแก้ไขสินค้า");
    }
  };
  
  if (isLoading) return <div className="text-center p-10">กำลังโหลดข้อมูลสินค้า...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold mb-4">แก้ไขสินค้า: {id}</h2>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">ชื่อสินค้า</label>
        <input
          type="text" name="name" value={formData.name} onChange={handleInputChange}
          className="border rounded p-2 focus:ring-2 focus:ring-orange-400" required
        />
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">รายละเอียด</label>
        <textarea
          name="description" value={formData.description} onChange={handleInputChange}
          className="border rounded p-2 focus:ring-2 focus:ring-orange-400" rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">ราคา</label>
          <input
            type="number" name="price" value={formData.price} onChange={handleInputChange}
            className="border rounded p-2 focus:ring-2 focus:ring-orange-400" required
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-700">จำนวน</label>
          <input
            type="number" name="quantity" value={formData.quantity} onChange={handleInputChange}
            className="border rounded p-2 focus:ring-2 focus:ring-orange-400" required
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label htmlFor="picture-upload" className="inline-block cursor-pointer px-5 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-2">
          เลือกรูปใหม่
        </label>
        <input id="picture-upload" type="file" name="picture" className="hidden" onChange={handleInputChange} />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="mt-2 rounded-lg border max-h-64 object-contain" />
        )}
      </div>

      <div className="flex flex-col">
        <label className="mb-1 text-sm font-medium text-gray-700">หมวดหมู่</label>
        <select
          name="categories" multiple value={formData.categories} onChange={handleInputChange}
          className="border rounded p-2 h-32 focus:ring-2"
        >
          {allCategories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button type="submit" className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">
          บันทึกการเปลี่ยนแปลง
        </button>
        <button type="button" onClick={() => navigate('/admin/dashboard')} className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">
          ยกเลิก
        </button>
      </div>
    </form>
  );
}