import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard";

export default async function HomePage() {
  // 1. Lấy dữ liệu (Chỉ dùng id để sắp xếp vì schema của bạn không có createdAt)
  const products = await prisma.product.findMany({
    orderBy: { id: 'desc' },
  });

  // 2. ÉP KIỂU TRIỆT ĐỂ: Biến Decimal thành Number thuần túy của JavaScript
  const safeProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price), // Ép kiểu tại đây
    image: p.image,
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold mb-10">Sản phẩm nổi bật</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {safeProducts.map((product) => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
    </div>
  );
}