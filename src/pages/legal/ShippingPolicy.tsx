
export default function ShippingPolicy() {
  return (
    <>
      



    <main className="flex-grow">

        {/*  2. HERO SECTION  */}
        <section className="bg-white border-b border-slate-100 pt-16 pb-12 text-center px-6 relative overflow-hidden">
            <div
                className="absolute top-0 right-1/4 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob">
            </div>
            <div
                className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000">
            </div>

            <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Shipping & Delivery Policy
                </h1>
                <p className="text-slate-500 text-lg">
                    ResumeAI is a fully digital platform. This policy explains how you access our services instantly.
                </p>
                <p className="text-sm text-slate-400 mt-4">Last Updated: October 24, 2023</p>
            </div>
        </section>

        {/*  MAIN CONTENT LAYOUT  */}
        <div className="container mx-auto px-6 py-12 max-w-6xl">
            <div className="grid lg:grid-cols-12 gap-12">

                {/*  Table of Contents (Desktop Sidebar)  */}
                <aside className="hidden lg:block lg:col-span-3">
                    <nav className="sticky top-24 space-y-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-3">Table of Contents</h4>
                        <a href="#digital-delivery"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">1.
                            Digital Delivery</a>
                        <a href="#account-access"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">2.
                            Account Access</a>
                        <a href="#confirmation"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">3.
                            Payment Confirmation</a>
                        <a href="#issues"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">4.
                            Technical Issues</a>
                    </nav>
                </aside>

                {/*  Policy Content  */}
                <div
                    className="lg:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 policy-content animate-slide-up">

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-8 flex items-start gap-3">
                        <i className="fa-solid fa-cloud-arrow-down text-blue-600 mt-1"></i>
                        <p className="text-sm text-blue-900 m-0">
                            <strong>Instant Access:</strong> We do not ship physical products (CDs, books, or printed
                            resumes). All our services are accessed online immediately after purchase.
                        </p>
                    </div>

                    <div id="digital-delivery">
                        <h2>1. Digital Delivery</h2>
                        <p>ResumeAI provides purely digital services ("Software as a Service").</p>
                        <ul>
                            <li><strong>Resume Builder:</strong> Access to the builder is available immediately upon
                                signing up or logging in.</li>
                            <li><strong>Downloads:</strong> PDF and DOCX files of your resume can be downloaded
                                instantly to your device once created.</li>
                            <li><strong>No Shipping Fees:</strong> Since there is no physical delivery, there are
                                absolutely no shipping or handling charges.</li>
                        </ul>
                    </div>

                    <div id="account-access">
                        <h2>2. Account Access</h2>
                        <p>Your purchase is tied to the email address you provide during registration or checkout.</p>
                        <ul>
                            <li><strong>Paid Plans:</strong> If you upgrade to a Pro or Premium plan, the features are
                                unlocked on your account instantly.</li>
                            <li><strong>Login Credentials:</strong> You are responsible for ensuring your email address
                                is correct. If you cannot access your account, please check your email for login details
                                or reset your password.</li>
                        </ul>
                    </div>

                    <div id="confirmation">
                        <h2>3. Payment Confirmation</h2>
                        <p>Once your payment is processed successfully:</p>
                        <ul>
                            <li>You will see a success confirmation screen on our website.</li>
                            <li>An automated email receipt will be sent to your registered email address immediately.
                            </li>
                            <li>Your account status will be updated to "Pro" or "Premium" within seconds.</li>
                        </ul>
                    </div>

                    <div id="issues">
                        <h2>4. Technical Issues & Delays</h2>
                        <p>In rare cases, technical issues or banking delays might cause a slight delay in activating
                            your plan.</p>
                        <ul>
                            <li><strong>Pending Payments:</strong> If your bank deducts money but your account is not
                                upgraded, please wait 15 minutes as the transaction might be processing.</li>
                            <li><strong>Support:</strong> If you still do not have access after 30 minutes, please
                                contact our support team immediately.</li>
                        </ul>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <h2 className="mt-0">Need Help?</h2>
                        <p>If you haven't received your plan upgrade or cannot access your account, contact us:</p>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block w-full">
                            <ul >
                                <li><strong>Email:</strong> <a href="mailto:support@resumeai.com"
                                        className="text-indigo-600 hover:underline">support@resumeai.com</a></li>
                                <li><strong>Turnaround:</strong> We typically respond within 24 hours.</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/*  FOOTER  */}
        

    </main>

    {/*  Smooth Scroll Script for Sidebar Links  */}
    


    </>
  );
}
