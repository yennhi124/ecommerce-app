import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCart = create<any>()(
  persist(
    (set, get) => ({
      items: [],
      // Hàm thêm sản phẩm
      addItem: (product: any) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item: any) => item.id === product.id)

        if (existingItem) {
          // Nếu có rồi thì tăng số lượng
          const updatedItems = currentItems.map((item: any) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
          set({ items: updatedItems })
        } else {
          // Nếu chưa có thì thêm mới vào danh sách
          set({ items: [...currentItems, { ...product, quantity: 1 }] })
        }
      },
      // Hàm xóa sản phẩm
      removeItem: (id: string) => {
        set({ items: get().items.filter((item: any) => item.id !== id) })
      },
    }),
    { name: 'cart-storage' } // Lưu vào trình duyệt để F5 không mất giỏ hàng
  )
)