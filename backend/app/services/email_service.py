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
