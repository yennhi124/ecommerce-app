import { Resend } from "resend";

// Khởi tạo Resend với Key từ .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({ email, orderId, amount }: { 
  email: string, 
  orderId: string, 
  amount: number 
}) {
  try {
    await resend.emails.send({
      from: "Cửa hàng của bạn <onboarding@resend.dev>", // Thay đổi sau khi verify domain
      to: email,
      subject: `Xác nhận đơn hàng #${orderId.slice(-6)}`,
      html: `
        <h1>Cảm ơn bạn đã mua hàng!</h1>
        <p>Đơn hàng <strong>${orderId}</strong> đã được thanh toán thành công.</p>
        <p>Tổng thanh toán: <strong>${(amount).toLocaleString('vi-VN')} VNĐ</strong></p>
        <p>Chúng tôi sẽ sớm giao hàng cho bạn.</p>
      `
    });
    console.log("=> Đã gửi email thành công!");
  } catch (error) {
    console.error("Lỗi gửi mail:", error);
  }
}