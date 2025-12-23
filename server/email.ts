import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key from environment
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'axeoncorporation@gmail.com';
const TO_EMAIL = process.env.SENDGRID_TO_EMAIL || 'axeoncorporation@gmail.com';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface InquiryEmailData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  productId?: string;
  productTitle?: string;
  productModel?: string;
}

export async function sendInquiryEmail(data: InquiryEmailData): Promise<void> {
  // Skip if API key not configured (development mode)
  if (!SENDGRID_API_KEY) {
    console.warn('SendGrid API key not configured. Email not sent.');
    return;
  }

  const isProductInquiry = !!data.productId;
  const subject = isProductInquiry
    ? `Product Inquiry: ${data.productTitle || 'Product'} (${data.productModel || 'N/A'})`
    : 'Contact Form Submission - Axeon Corporation';

  // Build HTML email content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #002C5C 0%, #00AEEF 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin-top: 20px; border-radius: 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #002C5C; }
        .value { margin-top: 5px; }
        .product-info { background: #e3f2fd; padding: 15px; border-left: 4px solid #00AEEF; margin: 20px 0; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isProductInquiry ? '🛒 New Product Inquiry' : '📧 New Contact Form Submission'}</h1>
        </div>

        ${isProductInquiry ? `
        <div class="product-info">
          <h3 style="margin-top: 0;">Product Details</h3>
          <div><strong>Product:</strong> ${data.productTitle || 'N/A'}</div>
          <div><strong>Model:</strong> ${data.productModel || 'N/A'}</div>
        </div>
        ` : ''}

        <div class="content">
          <h3>Customer Information</h3>

          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${data.name}</div>
          </div>

          <div class="field">
            <div class="label">Email:</div>
            <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
          </div>

          ${data.phone ? `
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value"><a href="tel:${data.phone}">${data.phone}</a></div>
          </div>
          ` : ''}

          ${data.company ? `
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">Message:</div>
            <div class="value" style="white-space: pre-wrap;">${data.message}</div>
          </div>
        </div>

        <div class="footer">
          <p>This email was sent from your HVAC Catalog website</p>
          <p>Axeon Corporation - Professional HVAC & Refrigeration Equipment</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Plain text version for email clients that don't support HTML
  const textContent = `
${isProductInquiry ? 'NEW PRODUCT INQUIRY' : 'NEW CONTACT FORM SUBMISSION'}
${isProductInquiry ? '===================' : '==========================='}

${isProductInquiry ? `
PRODUCT DETAILS:
- Product: ${data.productTitle || 'N/A'}
- Model: ${data.productModel || 'N/A'}
` : ''}

CUSTOMER INFORMATION:
- Name: ${data.name}
- Email: ${data.email}
${data.phone ? `- Phone: ${data.phone}` : ''}
${data.company ? `- Company: ${data.company}` : ''}

MESSAGE:
${data.message}

---
Sent from Axeon Corporation HVAC Catalog
  `.trim();

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: subject,
    text: textContent,
    html: htmlContent,
    replyTo: data.email, // Allow direct reply to customer
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully to:', TO_EMAIL);
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw new Error('Failed to send email notification');
  }
}

export function isEmailConfigured(): boolean {
  return !!SENDGRID_API_KEY;
}
