"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"

export default function ProductFilters({ categories }: { categories: any[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Lưu trạng thái của các ô nhập liệu
  const [text, setText] = useState(searchParams.get("q") || "")

  // Hàm xử lý khi thay đổi tham số trên URL
  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6 p-4 border rounded-xl bg-white shadow-sm">
      {/* 1. Tìm kiếm theo tên */}
      <div>
        <label className="text-sm font-bold flex items-center gap-2 mb-2">
          <Search size={16} /> Tìm kiếm
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateFilters("q", text)}
          placeholder="Nhập tên sản phẩm..."
          className="w-full p-2 border rounded-md text-sm outline-blue-500"
        />
      </div>

      {/* 2. Lọc theo Danh mục */}
      <div>
        <label className="text-sm font-bold flex items-center gap-2 mb-2">
          <Filter size={16} /> Danh mục
        </label>
        <select
          onChange={(e) => updateFilters("category", e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
          defaultValue={searchParams.get("category") || ""}
        >
          <option value="">Tất cả</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 3. Lọc theo giá */}
      <div>
        <label className="text-sm font-bold mb-2 block">Khoảng giá (VNĐ)</label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Từ"
            onChange={(e) => updateFilters("minPrice", e.target.value)}
            className="w-1/2 p-2 border rounded-md text-sm"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Đến"
            onChange={(e) => updateFilters("maxPrice", e.target.value)}
            className="w-1/2 p-2 border rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  )
}