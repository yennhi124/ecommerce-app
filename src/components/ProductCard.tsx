"use client";

import Link from "next/link";

interface ProductCardProps {
  data: {
    id: string;
    name: string;
    slug: string;
    price: number; // Phải khai báo là number
    image: string;
  };
}

export default function ProductCard({ data }: ProductCardProps) {
  return (
    <Link href={`/products/${data.slug}`} className="group border rounded-2xl p-4 hover:shadow-lg transition block">
      <div className="aspect-square mb-4 overflow-hidden rounded-xl bg-zinc-100 flex items-center justify-center">
        {/* Dùng thẻ img thường để tránh lỗi cấu hình Next/Image tạm thời */}
        <img 
          src={data.image} 
          alt={data.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
        />
      </div>
      <h3 className="font-bold text-lg mb-2 line-clamp-1">{data.name}</h3>
      <p className="text-emerald-600 font-bold">
        {data.price.toLocaleString('vi-VN')} đ
      </p>
    </Link>
  );
}