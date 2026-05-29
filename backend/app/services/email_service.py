import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

class EmailService:
    @staticmethod
    def send_email(to_email: str, subject: str, body: str, is_html: bool = False):
        if not all([settings.SMTP_HOST, settings.SMTP_PORT, settings.SMTP_USERNAME, settings.SMTP_PASSWORD]):
            print(f"SMTP configuration missing. Email to {to_email} with subject '{subject}' not sent.")
            print(f"Body: {body[:100]}...")
            return

        message = MIMEMultipart()
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email
        message["Subject"] = subject

        message.attach(MIMEText(body, "html" if is_html else "plain"))

        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
                server.send_message(message)
        except Exception as e:
            print(f"Error sending email: {e}")

    @classmethod
    def send_welcome_email(cls, to_email: str, full_name: str):
        subject = "Welcome to ResumeAI!"
        body = f"""
        <h1>Welcome, {full_name}!</h1>
        <p>Thank you for joining ResumeAI. Start building your professional resume today.</p>
        <p><a href="http://localhost:5173/builder">Get Started</a></p>
        """
        cls.send_email(to_email, subject, body, is_html=True)

    @classmethod
    def send_password_reset_email(cls, to_email: str, reset_link: str):
        subject = "Reset Your Password - ResumeAI"
        body = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-xl; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #4f46e5; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #334155; font-size: 16px; line-height: 1.6;">You requested to reset your password for your ResumeAI account. Click the button below to choose a new password:</p>
            <div style="margin: 30px 0; text-align: center;">
                <a href="{reset_link}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #64748b; font-size: 14px; line-height: 1.6;">Or copy and paste this link into your browser:</p>
            <p style="color: #4f46e5; font-size: 14px; word-break: break-all;"><a href="{reset_link}">{reset_link}</a></p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.6;">This link will expire in 15 minutes. If you did not request this, please ignore this email.</p>
        </div>
        """
        cls.send_email(to_email, subject, body, is_html=True)

