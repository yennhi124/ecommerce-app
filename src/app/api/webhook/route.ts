import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email"; // 1. Thêm import này

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as any;

  if (event.type === "checkout.session.completed") {
    const orderId = session?.metadata?.orderId;

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    // Giữ nguyên logic cập nhật Database của bạn
    await prisma.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        address: session?.customer_details?.address,
        phone: session?.customer_details?.phone || "",
      },
    });

    // 2. CHÈN THÊM: Gửi email sau khi DB đã cập nhật xong
    const customerEmail = session?.customer_details?.email;
    if (customerEmail) {
      await sendOrderConfirmationEmail({
        email: customerEmail,
        orderId: orderId,
        amount: session.amount_total, // Stripe trả về VNĐ chuẩn
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}