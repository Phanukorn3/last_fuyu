import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import Icon from "../assets/fuyuicon.png";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    password: "",
    email: "",
    confirmpassword: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("form data:", form);

    try {
      const response = await axios.post("http://localhost:8000/api/register/", {
        first_name: form.firstname,
        last_name: form.lastname,
        username: form.username,
        email: form.email,
        password: form.password,
        password2: form.confirmpassword,
      });

      console.log(response.data);

      navigate("/login");
    } catch (err) {
      console.error(err);

      const errorData = err.response?.data;
      console.log(errorData)
      const Errors = Object.values(errorData)
      setError(Errors)
      // setError("เกิดข้อผิดพลาดในการสร้างบัญชี");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-md mx-md p-6">
        <img src={Icon} alt="icon" className="w-sm h-sm" />
        <h2 className="text-4xl mb-3 text-center font-sans">
          สร้างบัญชีของคุณ
        </h2>
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
              label="Username"
              type="username"
              name="username"
              value={form.usernane}
              onChange={handleChange}
              placeholder="กรอกชื่อผู้ใช้ของคุณ"
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
          <div className="flex">
            <TextInput
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="กรอกรหัสผ่านของคุณ"
              className=" mr-[10%] w-[95%]"
            />
            <TextInput
              label="ConfirmPassword"
              type="password"
              name="confirmpassword"
              value={form.confirmpassword}
              onChange={handleChange}
              placeholder="กรอกรหัสผ่านอีกครั้ง"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
          >
            สร้างบัญชี
          </button>
          <div className="flex mt-1 mr-5 justify-end text-sm items-end text-gray-500 hover:underline hover:text-blue-400">
            <Link to="/login">หากคุณมีบัญชีอยู่แล้ว</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
