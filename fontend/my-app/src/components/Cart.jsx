import React from "react";
import { Link } from "react-router-dom"; // อย่าลืม import Link เข้ามา

export default function Cart({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveItem,
}) {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* พื้นหลัง */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      ></div>

      {/* Sidebar ตะกร้า */}
      <div
        className={`relative flex flex-col h-full w-full max-w-md ml-auto bg-white shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* --- ส่วนหัว --- */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            ตะกร้าสินค้า ({cartItems.length} รายการ)
          </h2>
          {/* --- ⬇️ จุดที่ 1: แก้ไขปุ่มนี้ให้เป็นปุ่ม "ปิด" (onClose) --- */}
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="Close cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* --- รายการสินค้า --- */}
        <div className="flex-grow p-4 overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">ไม่มีสินค้าในตะกร้า</p>
          ) : (
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <img
                    src={`http://localhost:8000${item.picture}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} x {item.price.toLocaleString()} บาท
                    </p>
                  </div>
                  {/* --- ⬇️ จุดที่ 2: ย้ายปุ่ม "ลบ" มาไว้ตรงนี้ --- */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.144-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.057-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- ส่วนสรุปราคา --- */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between mb-4">
              <span className="text-lg text-gray-600">ราคารวม</span>
              <span className="text-xl font-bold text-gray-800">
                {subtotal.toLocaleString()} บาท
              </span>
            </div>
            <Link to="/checkout" state={{ cartItems: cartItems }}>
              <button
                className="w-full py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition"
                onClick={onClose} // ปิดตะกร้าเมื่อกดไปหน้า checkout
              >
                ชำระเงิน
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}