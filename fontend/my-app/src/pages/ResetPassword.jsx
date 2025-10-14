import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../assets/fuyuicon.png";
import TextInput from "../components/TextInput";
import axios from "axios";

export default function ResetPassword() {
  const [form, setForm] = useState({
    username: "",
    new_password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.new_password !== form.confirm_password) {
      setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }
    console.log(form.username);
    console.log(form.new_password);
    console.log(form.confirm_password);

    try {
      await axios.post("http://localhost:8000/api/resetpassword/", form);

      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.username) {
          setError(data.username[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else if (data.new_password) {
          setError(data.new_password[0]);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors[0]);
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
            name="confirm_password"
            value={form.confirm_password}
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
