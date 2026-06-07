import razorpay
from app.config import settings

class RazorpayService:
    def __init__(self):
        self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    def create_order(self, amount: int, currency: str = "INR") -> dict:
        """
        Create a Razorpay order.
        amount: In paise/cents (integer)
        """
        data = {
            "amount": amount,
            "currency": currency,
            "payment_capture": 1 # Auto capture
        }
        return self.client.order.create(data=data)

    def verify_payment(self, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        """
        Verify Razorpay payment signature.
        """
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        try:
            self.client.utility.verify_payment_signature(params_dict)
            return True
        except Exception:
            return False
