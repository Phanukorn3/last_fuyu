import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../assets/fuyuicon.png";
import TextInput from "../components/TextInput";
import axios from "axios";

export default function ResetPassword() {
  // รับ uid และ token จาก URL
  const { uid, token } = useParams();

  const [form, setForm] = useState({
    username: "",
    new_password: "",
    con_new_password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-Side Validation (ตรวจสอบข้อมูลก่อนส่ง)
    if (!form.new_password || !form.con_new_password) {
      setError("กรุณากรอกรหัสผ่านทั้งสองช่อง");
      return;
    }
    if (form.new_password !== form.con_new_password) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }
    if (form.new_password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    try {
      // ส่ง uid และ token ไปพร้อมกับรหัสผ่านใหม่
      // สังเกต: เราไม่ได้ส่ง form.username ไปกับ request นี้
      // เพราะ API มักจะยืนยันตัวตนจาก uid และ token เท่านั้น
      await axios.post(
        "http://localhost:8000/api/reset_password/",
        {
          uid: uid,
          token: token,
          new_password: form.new_password,
          con_new_password: form.con_new_password,
        }
      );

      // เมื่อสำเร็จ ให้ส่งผู้ใช้ไปหน้า Login พร้อมข้อความแจ้งเตือน
      navigate("/login", {
        state: {
          message: "ตั้งรหัสผ่านใหม่สำเร็จแล้ว! กรุณาเข้าสู่ระบบอีกครั้ง",
        },
      });
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.new_password) {
          setError(data.new_password.join(" "));
        } else if (data.token) {
          setError("ลิงก์ตั้งรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว");
        } else {
          setError("เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง");
        }
      } else {
        setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-md mx-md p-6 mb-25">
        <img src={Icon} alt="icon" className="w-auto h-auto mx-auto mb-4" />
        <h2 className="text-4xl mb-6 text-center font-sans">
          ตั้งรหัสผ่านใหม่
        </h2>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="กรอกชื่อของคุณ"
          />
          <TextInput
            label="New Password"
            type="password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            placeholder="กรอกรหัสผ่านใหม่ของคุณ"
          />
          <TextInput
            label="Confirm New Password"
            type="password"
            name="con_new_password"
            value={form.con_new_password}
            onChange={handleChange}
            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
          />
          {error && (
            <div className="text-red-500 text-sm my-3 text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
          >
            ยืนยันรหัสผ่านใหม่
          </button>
        </form>
      </div>
    </div>
  );
}