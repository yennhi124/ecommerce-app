import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { items, email } = await req.json();

    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
    });

    const line_items = items.map((item: any) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        price_data: {
          currency: "vnd", // Đổi sang VNĐ
          product_data: { name: product.name },
          unit_amount: Number(product.price), 
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=1`,
      customer_email: email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("LỖI STRIPE:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}