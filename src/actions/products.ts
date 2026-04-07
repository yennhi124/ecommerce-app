"use server"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import z from "zod"

// Định nghĩa khung kiểm tra dữ liệu đầu vào
const ProductSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  price: z.coerce.number().positive("Giá phải lớn hơn 0"),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().cuid(),
})

export async function createProduct(formData: FormData) {
  // Kiểm tra dữ liệu từ form
  const result = ProductSchema.safeParse(Object.fromEntries(formData))
  
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Lưu vào database qua Prisma
  await prisma.product.create({
    data: result.data
  })

  // Cập nhật lại cache để hiển thị sản phẩm mới ngay lập tức
  revalidatePath("/products")
  revalidatePath("/admin/products")
  redirect("/admin/products")
}