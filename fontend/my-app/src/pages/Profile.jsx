import React, { useState, useEffect } from "react"; // 👈 1. Import useEffect
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import axios from "axios";

export default function Profile() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  // --- ⬇️ 2. ดึงข้อมูลโปรไฟล์เมื่อเปิดหน้า ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // **ข้อสันนิษฐาน:** axios ของคุณถูกตั้งค่าให้ส่ง token ไปกับ request โดยอัตโนมัติแล้ว
        const response = await axios.get("http://localhost:8000/api/profile/");
        const profileData = response.data;

        // นำข้อมูลที่ได้มาใส่ใน State ของฟอร์ม
        setForm({
          firstname: profileData.first_name || "",
          lastname: profileData.last_name || "",
          email: profileData.email || "",
          phone_number: profileData.phone_number || "",
          address: profileData.address || "",
        });
      } catch (err) {
        console.error("ดึงข้อมูลโปรไฟล์ไม่สำเร็จ:", err);
        setError("ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
      }
    };

    fetchProfile();
  }, []); // การใส่ [] ว่างๆ หมายถึงให้ effect นี้ทำงานแค่ครั้งเดียวตอน component โหลดเสร็จ

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- ⬇️ 3. เปลี่ยน handleSubmit ให้ใช้ PATCH เพื่ออัปเดต ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ใช้ axios.patch (ไม่ใช่ post) เพื่อส่งข้อมูลไปอัปเดต
      const response = await axios.patch("http://localhost:8000/api/profile/", {
        first_name: form.firstname,
        last_name: form.lastname,
        email: form.email,
        phone_number: form.phone_number,
        address: form.address,
      });

      console.log("อัปเดตโปรไฟล์สำเร็จ:", response.data);
      alert("อัปเดตข้อมูลสำเร็จ!"); // แจ้งเตือนผู้ใช้
    } catch (err) {
      console.error("อัปเดตโปรไฟล์ไม่สำเร็จ:", err);
      const errorData = err.response?.data;
      if (errorData) {
        // แปลง object error ให้อยู่ในรูปแบบที่อ่านง่าย
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"); // \n คือการขึ้นบรรทัดใหม่
        setError(errorMessages);
      } else if (data.non_field_errors) {
        setError(data.non_field_errors[0]);
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
          {/* ... TextInput ทั้งหมดของคุณ ... */}
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

          {/* เพิ่ม whitespace-pre-line เพื่อให้ \n ทำงาน */}
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
