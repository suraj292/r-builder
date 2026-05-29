from app.db.base import Base
from app.models.user import User
from app.models.resume import Resume
from app.models.subscription import Plan, Subscription
from app.models.ai import AIPrompt
from app.models.template import TemplateSettings
from app.models.activity import UserActivityLog
from app.models.guest_log import GuestScanLog
from app.models.payment import Transaction
from app.models.coupon import Coupon, UserCouponUsage
from app.models.system import SystemSettings
