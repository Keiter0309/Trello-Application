export class SendMailTemplates {
  public static readonly MAIL_REGISTRATION = (firstName: string) => ({
    subject: "Welcome to Our Platform!",
    text: `Hello ${firstName},
        
        Welcome to Our Platform! We're excited to have you on board.
        
        Here are some resources to get you started:
        - Visit our website: https://dictiohub.site
        - Check out our help center: https://dictiohub.site/help
        - Join our community forum: https://dictiohub.site/forum
        
        If you have any questions, feel free to reply to this email or contact our support team at support@ourplatform.com.
        
        Best regards,
        The Our Platform Team`,
    html: `<p>Hello ${firstName},</p>
             <p>Welcome to <strong>Our Platform</strong>! We're excited to have you on board.</p>
             <p>Here are some resources to get you started:</p>
             <ul>
                 <li>Visit our website: <a href="https://dictiohub.site">https://dictiohub.site</a></li>
                 <li>Check out our help center: <a href="https://dictiohub.site/help">https://dictiohub.site/help</a></li>
                 <li>Join our community forum: <a href="https://dictiohub.site/forum">https://dictiohub.site/forum</a></li>
             </ul>
             <p>If you have any questions, feel free to reply to this email or contact our support team at <a href="mailto:support@ourplatform.com">support@ourplatform.com</a>.</p>
             <p>Best regards,<br>Dictiohub Team</p>`,
  });

  public static readonly MAIL_FORGOT_PASSWORD = (
    firstName: string,
    otp: number
  ) => ({
    subject: "Forgot Password Request",
    text: `Hello ${firstName},
        
        You are receiving this email because you have requested to reset your password.
        
        Your OTP is ${otp}.
        
        If you did not request this, please ignore this email.
        
        Best regards,
        The Our Platform Team`,
    html: `<p>Hello ${firstName},</p>
             <p>You are receiving this email because you have requested to reset your password.</p>
             <p>Your OTP is <strong>${otp}</strong>.</p>
             <p>If you did not request this, please ignore this email.</p>
             <p>Best regards,<br>Dictiohub Team</p>`,
  });

  public static readonly MAIL_RESET_PASSWORD = (firstName: string) => ({
    subject: "Password Reset Confirmation",
    text: `Hello ${firstName},
        
        Your password has been successfully reset.
        
        If you did not request this, please contact our support team immediately.

        Best regards,
        The Our Platform Team`,
    html: `<p>Hello ${firstName},</p>
             <p>Your password has been successfully reset.</p>
             <p>If you did not request this, please contact our support team immediately.</p>
             <p>Best regards,<br>The Dictiohub Team</p>`,
  });

  public static readonly MAIL_CHANGE_PASSWORD = (firstName: string) => ({
    subject: "Password Change Confirmation",
    text: `Hello ${firstName},
        
        Your password has been successfully changed.
        
        If you did not request this, please contact our support team immediately.

        Best regards,
        The Our Platform Team`,
    html: `<p>Hello ${firstName},</p>
             <p>Your password has been successfully changed.</p>
             <p>If you did not request this, please contact our support team immediately.</p>
             <p>Best regards,<br>Dictiohub Team</p>`,
  });
}
