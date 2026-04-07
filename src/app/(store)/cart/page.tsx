"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const cart = useCart();

  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  // Định dạng tiền tệ: 1.000.000 VNĐ
  const formatCurrency = (price: number) => {
    return price.toLocaleString('vi-VN') + " VNĐ";
  };

  const totalPrice = cart.items.reduce((total, item) => {
    return total + (Number(item.price) * (item.quantity || 1));
  }, 0);

  const onCheckout = async () => {
    try {
      const response = await axios.post("/api/checkout", {
        items: cart.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        email: "khachhang@example.com", // Có thể thay bằng email từ Clerk/Auth
      });
      window.location = response.data.url;
    } catch (error) {
      toast.error("Lỗi kết nối thanh toán.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-10">Giỏ hàng của bạn</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-4">
          {cart.items.length === 0 && <p className="text-gray-500 italic">Giỏ hàng của bạn đang trống.</p>}
          
          {cart.items.map((item) => (
            <div key={item.id} className="flex py-6 border-b justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex gap-6">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border" />
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-xl mb-1">{item.name}</p>
                  <p className="text-emerald-600 font-semibold text-lg">{formatCurrency(Number(item.price))}</p>
                  
                  {/* ĐIỀU CHỈNH SỐ LƯỢNG */}
                  <div className="flex items-center gap-4 mt-3">
                    <button 
                      onClick={() => cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      -
                    </button>
                    <span className="font-bold text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                      className="w-9 h-9 border rounded-full flex items-center justify-center hover:bg-gray-100 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => cart.removeItem(item.id)} 
                className="text-red-500 hover:text-red-700 font-medium px-4 py-2"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>

        {/* CỘT THANH TOÁN */}
        <div className="lg:col-span-5 bg-zinc-50 p-8 rounded-3xl h-fit sticky top-10 border border-zinc-200">
          <h2 className="text-2xl font-bold mb-6">Chi tiết đơn hàng</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính:</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-zinc-300 pt-6 text-2xl font-black text-black">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(totalPrice)}</span>
          </div>
          <button 
            disabled={cart.items.length === 0}
            onClick={onCheckout}
            className="w-full bg-black text-white mt-10 py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 disabled:bg-gray-300 transition-all shadow-lg"
          >
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
}