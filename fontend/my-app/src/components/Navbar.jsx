import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src="/iconindex.svg"
          alt="Icon"
          className="w-12 h-12 mr-2"
        />
      <h1 className="text-lg font-bold text-gray-800">FuyuShop</h1></div>
      <div className="flex gap-6">
        <Link
          to="/"
          className="text-gray-600 hover:text-blue-600 font-medium"
        >
          Product
        </Link>
        <Link
          to="/customers"
          className="text-gray-600 hover:text-blue-600 font-medium"
        >
          Customer
        </Link>
      </div>
    </nav>
  );
}