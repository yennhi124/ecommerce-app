import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>; // 1. Khai báo params là một Promise
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  // 2. PHẢI AWAIT PARAMS TRƯỚC: Đây là lý do gây lỗi ở Next.js 15
  const { slug } = await params;

  // 3. Truy vấn Database với slug đã được giải nén
  const product = await prisma.product.findUnique({
    where: {
      slug: slug,
    },
  });

  if (!product) {
    return notFound();
  }

  // 4. Ép kiểu dữ liệu để hiển thị an toàn
  const displayPrice = Number(product.price);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-3xl bg-zinc-100 overflow-hidden border">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain p-10"
          />
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-black text-zinc-900">{product.name}</h1>
          <p className="text-3xl font-bold text-emerald-600">
            {displayPrice.toLocaleString('vi-VN')} đ
          </p>
          <div className="h-px bg-zinc-200 my-4" />
          <button className="w-full md:w-max bg-zinc-900 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-black transition shadow-lg">
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
}