
import { Link } from 'react-router-dom';

export default function Checkout() {
  return (
    <>
      

    {/*  1. HEADER  */}
    <header className="glass-header sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            {/*  Logo  */}
            <Link to="/" className="flex items-center gap-2.5 group">
                <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-sm shadow-md">
                    <i className="fa-solid fa-file-contract"></i>
                </div>
                <span className="text-lg font-display font-bold text-slate-800 tracking-tight">Resume<span
                        className="text-indigo-600">AI</span></span>
            </Link>

            {/*  Secure Indicator  */}
            <div
                className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 text-xs font-bold">
                <i className="fa-solid fa-lock"></i>
                <span>SSL Secure Checkout</span>
            </div>
        </div>
    </header>

    <main className="flex-grow container mx-auto px-6 py-12 max-w-6xl">

        {/*  2. HERO TITLE  */}
        <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">Complete Your Purchase</h1>
            <p className="text-slate-500">Unlock premium features and land your dream job faster.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">

            {/*  LEFT COLUMN: PAYMENT DETAILS  */}
            <div className="lg:col-span-7 space-y-8 animate-slide-up">

                {/*  4. PLAN DETAILS  */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                    <div
                        className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                        SELECTED</div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Pro Plan <span
                                    className="text-slate-400 font-normal mx-2">|</span> Monthly</h3>
                            <p className="text-sm text-slate-500">Unlimited resumes, AI optimization, PDF downloads</p>
                        </div>
                        <Link to="/pricing"
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">Change
                            Plan</Link>
                    </div>
                </div>

                {/*  5. USER DETAILS  */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span
                            className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">1</span>
                        Billing Information
                    </h3>

                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                                <input type="text" value="Alex Morgan"
                                    className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                                    readOnly />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email
                                    Address</label>
                                <input type="email" value="alex@example.com"
                                    className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50"
                                    readOnly />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">GST Number <span
                                    className="text-slate-400 font-normal lowercase">(optional)</span></label>
                            <input type="text" placeholder="Enter GST Number for business invoice"
                                className="form-input w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-400" />
                        </div>
                    </form>
                </div>

                {/*  7. PAYMENT METHOD (Razorpay Placeholder)  */}
                <div
                    className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 payment-card cursor-pointer group">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span
                            className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">2</span>
                        Payment Method
                    </h3>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 text-center">
                        <div
                            className="flex justify-center items-center gap-4 mb-4 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                            <i className="fa-brands fa-google-pay text-2xl"></i>
                            <i className="fa-brands fa-cc-visa text-2xl"></i>
                            <i className="fa-brands fa-cc-mastercard text-2xl"></i>
                            <i className="fa-solid fa-building-columns text-xl"></i>
                        </div>
                        <h4 className="font-bold text-indigo-900 mb-1">Pay Securely with Razorpay</h4>
                        <p className="text-xs text-indigo-600 mb-4">Supports UPI, Credit/Debit Cards, Net Banking, and
                            Wallets</p>

                        <button onClick={() => {}}
                            className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-2 mx-auto">
                            <i className="fa-solid fa-lock text-xs"></i> Proceed to Pay
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-slate-400 mt-4">
                        <i className="fa-solid fa-shield-halved text-green-500 mr-1"></i> Your payment information is
                        encrypted and secure.
                    </p>
                </div>

            </div>

            {/*  RIGHT COLUMN: ORDER SUMMARY  */}
            <div className="lg:col-span-5 space-y-6 animate-slide-up" >

                {/*  8. ORDER SUMMARY CARD  */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 sticky top-24">
                    <h3 className="font-bold text-slate-900 text-lg mb-6 border-b border-slate-100 pb-4">Order Summary</h3>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Pro Plan (Monthly)</span>
                            <span className="font-medium text-slate-900">₹499.00</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>GST (18%)</span>
                            <span className="font-medium text-slate-900">₹89.82</span>
                        </div>

                        {/*  Discount Row (Hidden initially)  */}
                        <div id="discount-row"
                            className="flex justify-between text-sm text-green-600 font-bold hidden coupon-success">
                            <span>Coupon Discount (20%)</span>
                            <span>-₹99.80</span>
                        </div>
                    </div>

                    {/*  6. COUPON CODE  */}
                    <div className="mb-6">
                        <div className="relative">
                            <input type="text" id="coupon-input" placeholder="Have a coupon code?"
                                className="form-input w-full pl-4 pr-24 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 uppercase placeholder-none" />
                            <button onClick={() => {}}
                                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition-colors">
                                Apply
                            </button>
                        </div>
                        <p id="coupon-msg" className="text-xs mt-2 hidden"></p>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mb-6">
                        <div className="flex justify-between items-end">
                            <span className="text-slate-500 font-medium">Total Payable</span>
                            <div className="text-right">
                                <span className="block text-3xl font-display font-bold text-slate-900"
                                    id="total-price">₹588.82</span>
                                <span className="text-[10px] text-slate-400">Includes all taxes</span>
                            </div>
                        </div>
                    </div>

                    {/*  9. TRUST BADGES  */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <i className="fa-solid fa-award text-indigo-500"></i>
                            <div className="text-[10px] leading-tight text-slate-600">
                                <span className="font-bold block text-slate-800">Money Back</span>
                                7-day guarantee
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <i className="fa-solid fa-headset text-indigo-500"></i>
                            <div className="text-[10px] leading-tight text-slate-600">
                                <span className="font-bold block text-slate-800">Support</span>
                                24/7 Assistance
                            </div>
                        </div>
                    </div>

                    {/*  11. FOOTER NOTE  */}
                    <p className="text-[10px] text-slate-400 text-center mt-6 leading-relaxed">
                        By proceeding, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of
                            Service</a> and <a href="#" className="underline hover:text-slate-600">Privacy Policy</a>.
                        Subscriptions auto-renew but can be cancelled anytime.
                    </p>
                </div>

            </div>
        </div>
    </main>

    {/*  FOOTER  */}
    

    {/*  RAZORPAY SCRIPT (Placeholder for future logic)  */}
    

    

    </>
  );
}
