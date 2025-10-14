import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import api from "../api/axiosConfig";

export default function Profile() {
  const [form, setForm] = useState({ });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      navigate("/login");
      return;
    }
    setUserId(storedUserId);

    const fetchProfile = async () => {
      try {
        // api ไดนามิก
        const response = await api.get(`/profile/${storedUserId}/`);
        const profileData = response.data;

        setForm({
          firstname: profileData.first_name || "",
          lastname: profileData.last_name || "",
          email: profileData.email || "",
          phone_number: profileData.phone_number || "",
          address: profileData.address || "",
        });
      } catch (err) {
        console.error("ดึงข้อมูลโปรไฟล์ไม่สำเร็จ:", err);
        setError("ไม่สามารถดึงข้อมูลโปรไฟล์ได้ (อาจต้อง Login ใหม่)");
      }
    };

 fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // api ไดนามิก
      await api.patch(`/profile/${userId}/`, {
        first_name: form.firstname,
        last_name: form.lastname,
        email: form.email,
        phone_number: form.phone_number,
        address: form.address,
      });

      alert("อัปเดตข้อมูลสำเร็จ!");
      navigate("/user/home");
    } catch (err) {
      console.error("อัปเดตโปรไฟล์ไม่สำเร็จ:", err);
      const errorData = err.response?.data;
      if (errorData) {
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        setError(errorMessages);
      } else {
        setError("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-auto mt-[12%]">
      <div className="w-md mx-md p-6">
        <h2 className="text-4xl mb-10 text-center font-sans">บัญชีของคุณ</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <TextInput
              label="Firstname"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              placeholder="กรอกชื่อของคุณ"
              className=" mr-[10%] w-[95%]"
            />
            <TextInput
              label="Lastname"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="กรอกนามสกุลของคุณ"
              className="w-[100%]"
            />
          </div>
          <div className="flex">
            <TextInput
              label="Phone number"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
              className=" mr-[10%] w-[95%]"
            />
            <TextInput
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="กรอกอีเมลของคุณ"
            />
          </div>
          <TextInput
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="กรอกที่อยู่ของคุณ"
          />

          {error && (
            <p className="text-red-500 text-sm mt-2 whitespace-pre-line">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
          >
            อัพเดต
          </button>
        </form>
      </div>
    </div>
  );
}
