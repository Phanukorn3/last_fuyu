import React, { useState } from "react";
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("form data:", form);

    try {
      const response = await axios.post("http://localhost:8000/api/profile/", {
        first_name: form.firstname,
        last_name: form.lastname,
        email: form.email,
        phone_number: form.phone_number,
        address: form.address,
      });

      console.log(response.data);

      navigate("/user/home");
    } catch (err) {
      console.error(err);
      const errorData = err.response?.data;
      console.log(errorData);
      const Errors = Object.values(errorData);
      setError(Errors);
    }
  };

  return (
    <div className="flex justify-center items-center h-auto mt-[12%]">
      <div className="w-md mx-md p-6">
        <h2 className="text-4xl mb-10 text-center font-sans">
          บัญชีของคุณ 
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
              label="Phone number"
              type="username"
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
              type="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="กรอกที่อยู่ของคุณ"
            />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
