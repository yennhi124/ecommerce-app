import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  // Dòng này sẽ giúp bạn biết chính xác hệ thống đang thiếu gì
  throw new Error("Chưa tìm thấy STRIPE_SECRET_KEY trong file .env");
}

export const stripe = new Stripe(secretKey, {
  apiVersion: "2023-10-16", // Hoặc phiên bản bạn đang dùng
  typescript: true,
});