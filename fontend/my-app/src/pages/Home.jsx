// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import Icon from "../assets/fuyuicon.png";
// import TextInput from "../components/TextInput";
// import axios from "axios";
import Card from "../components/Card";

export default function Home() {
  return (
<div className="flex flex-col w-auto h-auto mt-[12%]">
  <h2 className="text-red-600 text-3xl mb-12 ml-10">Discover our products</h2>

  <div className="flex flex-row gap-5 mx-auto">
    <div className="flex flex-col w-sm h-auto border-1 rounded-2xl p-6 items-center ">
      <img src={Icon} alt="" />
      <h3>อาหารลูกแมว</h3>
    </div>
    <div className="flex flex-col w-sm h-auto border-1 rounded-2xl p-6 items-center ">
      <img src={Icon} alt="" />
      <h3>อาหารลูกแมว</h3>
    </div>
    <div className="flex flex-col w-sm h-auto border-1 rounded-2xl p-6 items-center ">
      <img src={Icon} alt="" />
      <h3>อาหารลูกแมว</h3>
    </div>
    <div className="flex flex-col w-sm h-auto border-1 rounded-2xl p-6 items-center ">
      <img src={Icon} alt="" />
      <h3>อาหารลูกแมว</h3>
    </div>
  </div>
</div>
  );
}
