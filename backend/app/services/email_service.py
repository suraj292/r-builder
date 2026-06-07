import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
from app.models.system import SystemSettings
from sqlalchemy.future import select
from app.db.session import SessionLocal

class EmailService:
    @staticmethod
    async def _get_settings():
        try:
            async with SessionLocal() as db:
                result = await db.execute(select(SystemSettings).limit(1))
                return result.scalars().first()
        except Exception as e:
            print(f"Error fetching system settings for email: {e}")
            return None

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
        <p><a href="{settings.FRONTEND_URL}/builder">Get Started</a></p>
        """
        cls.send_email(to_email, subject, body, is_html=True)

    @classmethod
    async def send_verification_email(cls, to_email: str, full_name: str, token: str):
        sys_settings = await cls._get_settings()
        
        project_name = sys_settings.project_name if sys_settings else "ResumeAI"
        support_email = sys_settings.contact_email if sys_settings else "support@resumeai.com"
        logo_url = sys_settings.site_logo if sys_settings else ""
        
        verification_link = f"{settings.FRONTEND_URL}/auth/verify-email?token={token}"
        
        subject = f"Verify Your Email Address - {project_name}"
        
        # Modern Responsive Template
        body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; margin: 0; padding: 0; background-color: #f8fafc; }}
                .container {{ max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }}
                .header {{ padding: 32px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #f1f5f9; }}
                .logo {{ max-height: 40px; margin-bottom: 16px; }}
                .content {{ padding: 40px; }}
                .title {{ font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 16px; text-align: center; }}
                .text {{ font-size: 16px; color: #475569; margin-bottom: 24px; }}
                .button-container {{ text-align: center; margin: 32px 0; }}
                .button {{ background-color: #4f46e5; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.2s; }}
                .footer {{ padding: 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center; font-size: 14px; color: #94a3b8; }}
                .help-text {{ font-size: 12px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 24px; }}
                @media (max-width: 600px) {{ .container {{ margin: 0; border-radius: 0; }} }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    {f'<img src="{logo_url}" alt="{project_name}" class="logo">' if logo_url else f'<h2 style="color: #4f46e5; margin: 0;">{project_name}</h2>'}
                </div>
                <div class="content">
                    <h1 class="title">Verify Your Email Address</h1>
                    <p class="text">Hi {full_name},</p>
                    <p class="text">Thank you for creating your {project_name} account. To activate your account and secure your access, please verify your email address by clicking the button below.</p>
                    
                    <div class="button-container">
                        <a href="{verification_link}" class="button">Verify Email Address</a>
                    </div>
                    
                    <p class="text" style="font-size: 14px; color: #64748b;">This verification link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
                    
                    <div class="help-text">
                        Need help? Contact us at <a href="mailto:{support_email}" style="color: #4f46e5; text-decoration: none;">{support_email}</a>
                    </div>
                </div>
                <div class="footer">
                    &copy; {datetime.now().year} {project_name}. All rights reserved.
                </div>
            </div>
        </body>
        </html>
        """
        cls.send_email(to_email, subject, body, is_html=True)

    @classmethod
    def send_password_reset_email(cls, to_email: str, reset_link: str):
        subject = "Reset Your Password - ResumeAI"
        body = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
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

    @classmethod
    def send_admin_email(cls, to_email: str, subject: str, message: str):
        body = f"""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5; margin-bottom: 20px;">Support Message from ResumeAI</h2>
            <div style="color: #334155; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">
                {message}
            </div>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="color: #94a3b8; font-size: 12px;">This is a message from the ResumeAI Administration Team.</p>
        </div>
        """
        cls.send_email(to_email, subject, body, is_html=True)
