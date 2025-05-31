import resend from './resendTransporter.js';
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  ORDER_CONFIRMATION_TEMPLATE
} from './emailTemplates.js';

const SENDER_EMAIL = "onboarding@resend.dev"; 

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
    const info = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Verify your email',
      html,
    });
    console.log("Verification email sent:", info);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Email verification mail failed to send.");
  }
};

export const sendOrderConfirmationEmail=async(email, name, orderDetails)=>{
  const orderItemsHtml=orderDetails.items.map(item=>(`
     <li>
            <span><strong>${item.name}</strong> (Qty: ${item.quantity})</span>
            <span>$${item.price.toFixed(2)} each</span>
        </li>
    `));
    let html=ORDER_CONFIRMATION_TEMPLATE;
    html = html.replace("{userName}", name);
    html = html.replace("{orderItems}", orderItemsHtml);
    html = html.replace("{totalAmount}", orderDetails.totalAmount.toFixed(2));
    try {
      const info = await resend.emails.send({
        from: SENDER_EMAIL,
        to: email,
        subject: `Your Elegant Wears Order Confirmed!`, 
        html,
        text: `Dear ${name},\n\nYour order from Elegant Wears has been confirmed!\n\nOrder Items:\n${orderDetails.items.map(item => {
                
                return `- ${item.name} (Qty: ${item.quantity}) - $${item.price.toFixed(2)} each`;
            }).join('\n')}\n\nTotal: $${orderDetails.totalAmount.toFixed(2)}\n\nThank you for your purchase!`
    });
    console.log("Simplified order confirmation email sent:", info);
    } catch (error) {
      console.error("Error sending simplified order confirmation email:", error);
        throw new Error("Simplified order confirmation email failed to send.");
    }
}

export const sendWelcomeEmail = async (email, username) => {
  const html = `<p>Welcome, ${username}!</p>
  <p>Thanks for joining us.</p>
  <p>Use code "E15" to get 15% off on your purchase</p>
  <p>Happy Shopping</p>`;
  try {
    const info = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Welcome to Our Platform!',
      html,
    });
    console.log("Welcome email sent:", info);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Welcome email failed to send.");
  }
};

export const sendForgotPasswordMail = async (email, resetUrl) => {
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl);
  try {
    const info = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html,
    });
    console.log("Password reset email sent:", info);
  } catch (error) {
    console.error("Error sending forgot password email:", error);
    throw new Error("Password reset email failed to send.");
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const info = await resend.emails.send({
      from: SENDER_EMAIL,
      to: email,
      subject: 'Password Reset Success',
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent:", info);
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    throw new Error("Password reset success email failed to send.");
  }
};
