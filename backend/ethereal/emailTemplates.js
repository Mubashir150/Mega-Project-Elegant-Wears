export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset Successful</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We're writing to confirm that your password has been successfully reset.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>If you did not initiate this password reset, please contact our support team immediately.</p>
    <p>For security reasons, we recommend that you:</p>
    <ul>
      <li>Use a strong, unique password</li>
      <li>Enable two-factor authentication if available</li>
      <li>Avoid using the same password across multiple sites</li>
    </ul>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #eeeeee;
        }
        .header h1 {
            color: #3498db; /* A nice blue color */
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 20px 0;
            text-align: center;
        }
        .content p {
            margin-bottom: 15px;
        }
        .button-container {
            margin-top: 30px;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: #3498db;
            color: #ffffff;
            padding: 12px 25px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding-top: 20px;
            margin-top: 20px;
            border-top: 1px solid #eeeeee;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verify Your Email Address</h1>
        </div>
        <div class="content">
            <p>Hi there,</p>
            <p>Thank you for registering with us! To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
            <p>Hi there,</p>
 <p>Thank you for registering with us! Your verification code is:</p>
<p style="font-size: 24px; font-weight: bold; color: #3498db; text-align: center; letter-spacing: 5px;">
 {verificationCode}
</p>
 <p style="margin-top: 20px;">Please enter this code in the verification box on our website.</p>
<p>This code is valid for a limited time.</p>
 <p>If you did not create an account, no further action is required.</p>
            <p>This link is valid for a limited time.</p>
            <p>If you did not create an account, no further action is required.</p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
        </div>
    </div>
</body>
</html>`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Password Reset</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>We received a request to reset your password. If you didn't make this request, please ignore this email.</p>
    <p>To reset your password, click the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
    </div>
    <p>This link will expire in 1 hour for security reasons.</p>
    <p>Best regards,<br>Your App Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>This is an automated message, please do not reply to this email.</p>
  </div>
</body>
</html>
`;

export const ORDER_CONFIRMATION_TEMPLATE=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #4CAF50; }
        ul { list-style: none; padding: 0; }
        li { margin-bottom: 10px; padding: 5px 0; border-bottom: 1px dashed #eee; }
        li:last-child { border-bottom: none; }
        .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #777; }
        a { color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmed!</h1>
        </div>
        <p>Dear {userName},</p>
        <p>Your order has been successfully placed at <strong>Elegant Wears</strong>.</p>
        <p>Here are your order details:</p>
        
        <h3>Order Items:</h3>
        <ul>
            {orderItems}
        </ul>

        <div class="total-section">
            Total: {totalAmount}
        </div>

        <p>Thank you for your purchase!</p>
        <p>Sincerely,</p>
        <p>The Elegant Wears Team</p>
    </div>
    <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Elegant Wears. All rights reserved.</p>
    </div>
</body>
</html>
`
