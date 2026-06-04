
import { useSystemStore } from '../../store/useSystemStore';

export default function RefundPolicy() {
  const { settings } = useSystemStore();
  const projectName = settings?.project_name || 'ResumeAI';

  return (
    <>
      



    <main className="flex-grow">

        {/*  2. HERO SECTION  */}
        <section className="bg-white border-b border-slate-100 pt-16 pb-12 text-center px-6 relative overflow-hidden">
            <div
                className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob">
            </div>
            <div
                className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000">
            </div>

            <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Refund & Cancellation Policy
                </h1>
                <p className="text-slate-500 text-lg">
                    We believe in fairness and transparency. Here is everything you need to know about our billing,
                    refunds, and cancellations.
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
                        <a href="#free-plan"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">1.
                            Free Plan</a>
                        <a href="#paid-subscriptions"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">2.
                            Paid Subscriptions</a>
                        <a href="#refund-policy"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">3.
                            Refund Policy</a>
                        <a href="#cancellation"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">4.
                            Cancellation Policy</a>
                        <a href="#payment-failures"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">5.
                            Payment Failures</a>
                        <a href="#how-to-request"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">6.
                            How to Request</a>
                    </nav>
                </aside>

                {/*  Policy Content  */}
                <div
                    className="lg:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 policy-content animate-slide-up">

                    <div className="p-4 bg-green-50 rounded-xl border border-green-100 mb-8 flex items-start gap-3">
                        <i className="fa-solid fa-hand-holding-heart text-green-600 mt-1"></i>
                        <p className="text-sm text-green-900 m-0">
                            <strong>Our Promise:</strong> We want you to be happy with {projectName}. If you have an issue,
                            please contact us first, and we will do our best to resolve it.
                        </p>
                    </div>

                    <div id="free-plan">
                        <h2>1. Free Plan</h2>
                        <p>{projectName} offers a free tier that allows users to create a resume and test our features
                            without any cost.</p>
                        <ul>
                            <li><strong>Charges:</strong> $0. No credit card is required.</li>
                            <li><strong>Refunds:</strong> Since there is no charge, the concept of a refund does not
                                apply to the Free plan.</li>
                        </ul>
                    </div>

                    <div id="paid-subscriptions">
                        <h2>2. Paid Subscriptions</h2>
                        <p>We offer Pro and Premium plans billed on a subscription basis (Monthly or Yearly).</p>
                        <ul>
                            <li><strong>Billing Cycle:</strong> You are billed in advance at the start of each billing
                                cycle.</li>
                            <li><strong>Automatic Renewal:</strong> To ensure uninterrupted service, subscriptions
                                automatically renew at the end of each billing period unless cancelled.</li>
                        </ul>
                    </div>

                    <div id="refund-policy">
                        <h2>3. Refund Policy</h2>
                        <p>We offer a <strong>7-day money-back guarantee</strong> for first-time purchases of our paid
                            plans, subject to the following conditions:</p>
                        <ul>
                            <li><strong>Eligibility:</strong> Refund requests must be made within 7 days of the initial
                                purchase date.</li>
                            <li><strong>Good Faith:</strong> Refunds are generally granted if you are unsatisfied with
                                the service or experienced technical issues that we could not resolve.</li>
                            <li><strong>Non-Refundable Cases:</strong> We reserve the right to deny refunds in cases
                                where:
                                <ul >
                                    <li>You have downloaded multiple resumes or used a significant amount of AI credits
                                        (fair use policy).</li>
                                    <li>The request is made after the 7-day window.</li>
                                    <li>The account has violated our Terms of Service.</li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <div id="cancellation">
                        <h2>4. Cancellation Policy</h2>
                        <p>You are free to cancel your subscription at any time.</p>
                        <ul>
                            <li><strong>How to Cancel:</strong> Go to 'Account Settings' &gt; 'Subscription' and click
                                'Cancel Subscription'.</li>
                            <li><strong>Access:</strong> After cancellation, you will continue to have access to paid
                                features until the end of your current billing period.</li>
                            <li><strong>No Partial Refunds:</strong> We do not offer pro-rated refunds for unused days
                                in a billing cycle. Once you cancel, no further charges will be applied.</li>
                        </ul>
                    </div>

                    <div id="payment-failures">
                        <h2>5. Payment Failures & Chargebacks</h2>
                        <p>If a payment fails (e.g., expired card, insufficient funds):</p>
                        <ul>
                            <li>We will attempt to process the payment again over the next few days.</li>
                            <li>If payment continues to fail, your account will be downgraded to the Free plan
                                automatically.</li>
                        </ul>
                        <p><strong>Chargebacks:</strong> If you initiate a chargeback dispute with your bank, your
                            account will be immediately suspended pending investigation. We recommend contacting our
                            support team first to resolve billing issues amicably.</p>
                    </div>

                    <div id="how-to-request" className="mt-12 pt-8 border-t border-slate-100">
                        <h2 className="mt-0">6. How to Request a Refund</h2>
                        <p>To request a refund, please email our billing team with the following details:</p>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block w-full">
                            <ul >
                                <li><strong>Email To:</strong> <a href={`mailto:${settings?.contact_email || 'billing@resumeai.com'}`}
                                        className="text-indigo-600 hover:underline">{settings?.contact_email || 'billing@resumeai.com'}</a></li>
                                <li><strong>Subject Line:</strong> Refund Request - [Your Email Address]</li>
                                <li><strong>Details:</strong> Please include your transaction ID (found in your email
                                    receipt) and a brief reason for the request.</li>
                            </ul>
                            <p className="text-sm text-slate-500 mb-0"><em>We typically process refund requests within 3-5
                                    business days. Once processed, it may take 5-10 days for the funds to appear in your
                                    bank account depending on your bank's policies.</em></p>
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
