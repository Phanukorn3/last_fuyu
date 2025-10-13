import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../assets/fuyuicon.png";
import TextInput from "../components/TextInput";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        form
      );

      console.log(response.data);
      navigate("/user/home");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.username) setError(data.username);
        else if (data.password) setError(data.password);
        else if (data.non_field_errors) setError(data.non_field_errors[0]);
        else setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-md mx-md p-6 mb-25">
        <img src={Icon} alt="icon" className="w-auto h-auto" />
        <h2 className="text-4xl mb-6 text-center font-sans">เข้าสู่ระบบ</h2>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="กรอกชื่อผู้ใช้ของคุณ"
            className="mb-2"
          />
          <TextInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="กรอกรหัสผ่านของคุณ"
          />
          {error && (
            <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
          >
            Login
          </button>
          <div className="flex justify-between">
          <div className="flex mt-1 mr-5 text-sm items-end text-gray-500 hover:underline hover:text-blue-400">
            <Link to="/register">หากคุณยังไม่มีบัญชี</Link>
          </div>
          <div className="flex mt-1 mr-5 text-sm items-end text-gray-500 hover:underline hover:text-blue-400">
            <Link to="/resetpassword">ลืมรหัสผ่าน?</Link>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
}
