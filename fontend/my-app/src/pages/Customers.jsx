import Card from "../components/Card";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/customers/")
        .then(res => {
            setCustomers(res.data.customers);
        });
    }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customer</h1>

      <div className="bg-white shadow rounded-2xl overflow-hidden">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">ชื่อ</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">ที่อยู่</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">เบอร์โทร</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={customer.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="py-3 px-4 text-sm">{customer.id}</td>
                <td className="py-3 px-4 text-sm">{customer.full_name}</td>
                <td className="py-3 px-4 text-sm">{customer.address}</td>
                <td className="py-3 px-4 text-sm">{customer.phone_number}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}