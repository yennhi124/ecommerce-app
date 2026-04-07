import { Html, Head, Body, Container, Text, Section, Heading } from "@react-email/components";

export const OrderConfirmationEmail = ({ order }: { order: any }) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <Container>
        <Heading>Cảm ơn bạn đã mua hàng!</Heading>
        <Section>
          <Text>Mã đơn hàng: <strong>{order.orderNumber}</strong></Text>
          <Text>Tổng thanh toán: <strong>{order.totalAmount.toLocaleString()} VNĐ</strong></Text>
        </Section>
        <Text>Chúng tôi sẽ sớm liên hệ để giao hàng.</Text>
      </Container>
    </Body>
  </Html>
);