"use client"

import Link from "next/link"
import { ShoppingCart, Search, User, Store } from "lucide-react"
import { useCart } from "@/lib/store"
import { useEffect, useState } from "react"

export default function Navbar() {
  const items = useCart((state: any) => state.items)
  const [mounted, setMounted] = useState(false)

  // Tránh lỗi Hydration (lệch dữ liệu giữa Server và Client khi dùng LocalStorage)
  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItems = items.reduce((acc: number, item: any) => acc + item.quantity, 0)

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/products" className="flex items-center gap-2 text-xl font-black tracking-tighter text-blue-600">
          <Store size={24} />
          MYSTORE
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-gray-600">
          <Link href="/products" className="hover:text-blue-600 transition">Sản phẩm</Link>
          <Link href="#" className="hover:text-blue-600 transition">Danh mục</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <Search size={20} />
          </button>
          
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition relative">
            <ShoppingCart size={20} />
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </Link>

          <button className="p-2 hover:bg-gray-100 rounded-full transition">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}