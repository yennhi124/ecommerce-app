"use server";

import { prisma } from "@/lib/prisma"; // Đảm bảo có dấu { } bao quanh prisma
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// 1. Định nghĩa Schema kiểm tra dữ liệu đầu vào
const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm ít nhất 3 ký tự"),
  price: z.coerce.number().min(1, "Giá phải lớn hơn 0"),
  stock: z.coerce.number().min(0, "Kho hàng không được âm"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
});

export async function createProduct(formData: FormData) {
  // 2. Lấy dữ liệu từ Form
  const rawData = {
    name: formData.get("name") as string,
    price: formData.get("price"),
    stock: formData.get("stock"),
    categoryId: formData.get("categoryId") as string,
  };

  // 3. Kiểm tra tính hợp lệ của dữ liệu
  const result = productSchema.safeParse(rawData);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    // 4. Tự động tạo Slug từ Name (Ví dụ: "Áo Thun" -> "ao-thun")
    const generatedSlug = result.data.name
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu tiếng Việt
      .replace(/[^\w\s-]/g, "") // Xóa ký tự đặc biệt
      .replace(/[\s_-]+/g, "-") // Thay khoảng trắng bằng gạch ngang
      .replace(/^-+|-+$/g, ""); // Xóa gạch ngang thừa ở đầu/cuối

    // 5. Lưu vào Database qua Prisma (Đã thêm trường slug)
    await prisma.product.create({
      data: {
        name: result.data.name,
        price: result.data.price,
        stock: result.data.stock,
        categoryId: result.data.categoryId,
        slug: generatedSlug, // QUAN TRỌNG: Thêm dòng này để hết lỗi Build
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return { error: "Không thể tạo sản phẩm. Vui lòng thử lại." };
  }

  // 6. Làm mới trang và quay về danh sách
  revalidatePath("/admin/products");
  redirect("/admin/products");
}