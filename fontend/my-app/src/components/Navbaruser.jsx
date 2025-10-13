import { Link } from "react-router-dom";

export default function Navbaruser() {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <nav className="bg-gray-100 shadow-md px-6 py-6 flex justify-end">
        <Link
          to="/login"
          className="text-gray-600 hover:text-blue-600 font-medium mr-5"
        >
          Logout
        </Link>
      </nav>
      <nav className="bg-white shadow-md px-6 py-8 flex items-end justify-between">
        <div className="flex items-center">
          <img src="/iconindex.svg" alt="Icon" className="w-20 h-20 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">FuyuShop</h1>
        </div>
        <ul className="flex gap-10 absolute left-1/2 transform -translate-x-1/2 -translate-y-0">
          <li className="relative group">
            <button className="text-gray-800 hover:text-red-500 border-b-2 border-transparent font-medium hover:border-red-500 transition duration-200">
              อาหารสำหรับสุนัข
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full hidden text-gray-400 group-hover:block bg-white shadow-md rounded-b-md w-55 h-50">
                <div className="flex">
              <ul className="py-2 px-8 mt-5">
                <li className="px-2 py-2 hover:text-red-500 border-b-2 border-transparent hover:underline cursor-pointer">
                    <Link to="">
                  อาหารลูกสุนัข</Link>
                </li>
                <li className="px-2 py-2 hover:text-red-500 border-b-2 border-transparent hover:underline cursor-pointer">
                    <Link to="">
                  อาหารสุนัขโตเต็มวัย</Link>
                </li>
                <li className="px-2 py-2 hover:text-red-500 border-b-2 border-transparent hover:underline cursor-pointer">
                    <Link to="">
                  อาหารสุนัขสูงวัย</Link>
                </li>
              </ul>

              </div>
            </div>
          </li>

          <li className="relative group">
            <button className="text-gray-800 hover:text-red-500 border-b-2 border-transparent font-medium hover:border-red-500 transition duration-200">
              อาหารสำหรับแมว
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full hidden text-gray-400 group-hover:block bg-white shadow-md rounded-b-md w-55 h-50">
                <div className="flex">
              <ul className="py-2 px-8 mt-5">
                <li className="px-2 py-2 hover:text-red-500 border-b-2 border-transparent hover:underline cursor-pointer">
                    <Link to="">
                  อาหารลูกแมว</Link>
                </li>
                <li className="px-2 py-2 hover:text-red-500 border-b-2 border-transparent hover:underline cursor-pointer">
                    <Link to="">
                  อาหารแมวโตเต็มวัย</Link>
                </li>
                <li className="px-2 py-2 hover:text-red-500 border-b-2 border-transparent hover:underline cursor-pointer">
                    <Link to="">
                  อาหารแมวสูงวัย</Link>
                </li>
              </ul>

              </div>

            </div>
          </li>

        </ul>
            <div className="flex items-center ml-auto mr-10">
          <input
            type="text"
            placeholder="ค้นหาสินค้า..."
            className="border border-gray-300 rounded-l-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-red-400"
          />
          <button className="bg-red-500 text-white px-3 py-1 rounded-r-md hover:bg-red-600 transition">
            ค้นหา
          </button>
        </div>
      </nav>
    </div>
  );
}
