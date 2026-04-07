"use client"

import Link from "next/link"
import { useCart } from "@/lib/store"
import { ShoppingCart } from "lucide-react"

export default function ProductCard({ product }: { product: any }) {
  const addItem = useCart((state: any) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    // Chặn không cho thẻ <Link> kích hoạt chuyển trang khi nhấn vào nút này
    e.preventDefault() 
    e.stopPropagation()
    
    addItem(product)
    // Bạn có thể thay alert bằng một thông báo Toast đẹp hơn sau này
    alert(`Đã thêm ${product.name} vào giỏ hàng!`)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group cursor-pointer">
      <div className="group relative border rounded-2xl p-4 hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col">
        {/* Hình ảnh */}
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
          <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">
            No Image
          </span>
        </div>
        
        {/* Thông tin */}
        <div className="mt-4 flex-1 flex flex-col">
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">
            {product.category?.name || "Danh mục"}
          </p>
          
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto pt-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-gray-500 mb-0.5">Giá bán</p>
              <p className="text-lg font-black text-gray-900">
                {Number(product.price).toLocaleString()}đ
              </p>
            </div>
            <span className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
              Kho: {product.stock}
            </span>
          </div>
        </div>

        {/* Nút hành động */}
        <button 
          onClick={handleAddToCart}
          className="mt-4 w-full bg-black text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-sm"
        >
          <ShoppingCart size={14} />
          Thêm vào giỏ
        </button>
      </div>
    </Link>
  )
}