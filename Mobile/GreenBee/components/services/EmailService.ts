const EMAILJS_SERVICE_ID = 'service_eclxplh';
const EMAILJS_TEMPLATE_ID = 'template_xuhu8xc';
const EMAILJS_PUBLIC_KEY = 'JPBRGHyZpODaok35x';

interface OrderEmailDetails {
  to_email: string;
  customer_name: string;
  order_id: string;
  order_items: string;
  subtotal: string;
  gst: string;
  shipping: string;
  total: string;
  delivery_address: string;
}

export const sendOrderConfirmation = async (
  orderDetails: OrderEmailDetails,
) => {
  try {
    const response = await fetch(
      'https://api.emailjs.com/api/v1.0/email/send',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID,
          template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY,
          template_params: orderDetails,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};
