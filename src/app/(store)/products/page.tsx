import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard"
import ProductFilters from "@/components/store/ProductFilters"

export default async function ProductsPage({ searchParams }: { searchParams: any }) {
  // 1. Lấy params từ URL
  const { category, minPrice, maxPrice, q, sort } = searchParams

  // 2. Lấy Categories cho bộ lọc (Dữ liệu tĩnh, không bị lỗi Decimal)
  const categories = await prisma.category.findMany()

  // 3. Truy vấn sản phẩm từ DB
  const productsFromDb = await prisma.product.findMany({
    where: {
      AND: [
        category ? { category: { slug: category } } : {},
        minPrice ? { price: { gte: Number(minPrice) } } : {},
        maxPrice ? { price: { lte: Number(maxPrice) } } : {},
        q ? { name: { contains: q, mode: "insensitive" } } : {},
      ]
    },
    include: { category: true },
    orderBy: sort === "price-asc" ? { price: "asc" } : 
             sort === "price-desc" ? { price: "desc" } : { id: "desc" }
  })

  // 4. KHẮC PHỤC LỖI DECIMAL: Chuyển đổi sang Plain Object
  const products = productsFromDb.map(p => ({
    ...p,
    price: Number(p.price) // Biến Decimal thành Number để Client Component đọc được
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cột bên trái: Bộ lọc */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <ProductFilters categories={categories} />
        </aside>

        {/* Cột bên phải: Danh sách sản phẩm */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b pb-4">
             <h1 className="text-2xl font-black tracking-tighter">
               SẢN PHẨM ({products.length})
             </h1>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed rounded-3xl">
              <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm nào phù hợp.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}