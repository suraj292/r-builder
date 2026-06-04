
import { useSystemStore } from '../../store/useSystemStore';

export default function Terms() {
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
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Terms & Conditions</h1>
                <p className="text-slate-500 text-lg">
                    By using our platform, you agree to the following terms. We've written them in plain English to
                    ensure clarity and fairness.
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
                        <a href="#acceptance"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">1.
                            Acceptance of Terms</a>
                        <a href="#services"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">2.
                            Services Description</a>
                        <a href="#responsibilities"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">3.
                            User Responsibilities</a>
                        <a href="#ai-disclaimer"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">4.
                            AI Disclaimer</a>
                        <a href="#payments"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">5.
                            Subscriptions & Payments</a>
                        <a href="#ip"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">6.
                            Intellectual Property</a>
                        <a href="#liability"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">7.
                            Limitation of Liability</a>
                        <a href="#contact"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">8.
                            Contact Us</a>
                    </nav>
                </aside>

                {/*  Terms Content  */}
                <div
                    className="lg:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 terms-content animate-slide-up">

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mb-8 flex items-start gap-3">
                        <i className="fa-solid fa-scale-balanced text-amber-600 mt-1"></i>
                        <p className="text-sm text-amber-900 m-0">
                            <strong>Summary:</strong> Treat our platform with respect, don't use it for illegal
                            activities, and understand that our AI suggestions are tools to help you, not guarantees of
                            employment.
                        </p>
                    </div>

                    <div id="acceptance">
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing or using {projectName} (the "Service"), you agree to be bound by these Terms &
                            Conditions. If you do not agree with any part of these terms, you may not use our Service.
                            These terms apply to all visitors, users, and others who access the Service.</p>
                    </div>

                    <div id="services">
                        <h2>2. Service Description</h2>
                        <p>{projectName} provides online tools for career development, including:</p>
                        <ul>
                            <li><strong>Resume Builder:</strong> An AI-powered tool to create and format professional
                                resumes.</li>
                            <li><strong>ATS Checker:</strong> An analysis tool that simulates Applicant Tracking Systems
                                to score your resume.</li>
                            <li><strong>Templates:</strong> Pre-designed document layouts for resumes and cover letters.
                            </li>
                        </ul>
                        <p>We work hard to ensure our services are available 24/7, but we cannot guarantee zero downtime
                            due to maintenance or unforeseen technical issues.</p>
                    </div>

                    <div id="responsibilities">
                        <h2>3. User Responsibilities</h2>
                        <p>When using our platform, you agree to:</p>
                        <ul>
                            <li>Provide accurate, current, and complete information about yourself.</li>
                            <li>Maintain the security of your account password.</li>
                            <li>Not upload content that is illegal, offensive, defamatory, or violates the rights of
                                others.</li>
                            <li>Not use the Service to spam recruiters or employers.</li>
                            <li>Not attempt to reverse engineer, hack, or compromise our platform's security.</li>
                        </ul>
                        <p>We reserve the right to suspend or terminate accounts that violate these rules without prior
                            notice.</p>
                    </div>

                    <div id="ai-disclaimer">
                        <h2>4. AI & Employment Disclaimer</h2>
                        <p>Our platform uses Artificial Intelligence to provide suggestions, optimizations, and scores.
                            It is important to understand that:</p>
                        <ul>
                            <li><strong>No Guarantees:</strong> While we aim to improve your chances, we <strong>do not
                                    guarantee</strong> that using our Service will result in job interviews, offers, or
                                employment.</li>
                            <li><strong>Accuracy:</strong> AI suggestions are based on patterns and data but may not
                                always be perfect. You are responsible for reviewing and verifying all content on your
                                resume before submitting it to employers.</li>
                            <li><strong>ATS Scoring:</strong> Our ATS score is an estimation based on common industry
                                standards. Different companies use different systems, and a high score on our platform
                                does not guarantee a 100% match on every external system.</li>
                        </ul>
                    </div>

                    <div id="payments">
                        <h2>5. Subscriptions & Payments</h2>
                        <p>We offer both free and paid subscription plans.</p>
                        <ul>
                            <li><strong>Billing:</strong> Paid plans are billed in advance on a recurring and periodic
                                basis (monthly or yearly).</li>
                            <li><strong>Payment Processors:</strong> We use secure third-party payment processors (such
                                as Razorpay or Stripe). We do not store your full credit card details on our servers.
                            </li>
                            <li><strong>Cancellations:</strong> You may cancel your subscription at any time via your
                                account settings. You will continue to have access to paid features until the end of
                                your current billing period.</li>
                            <li><strong>Refunds:</strong> Refund requests are handled on a case-by-case basis as per our
                                Refund Policy. generally within 7 days of purchase if you are unsatisfied.</li>
                        </ul>
                    </div>

                    <div id="ip">
                        <h2>6. Intellectual Property</h2>
                        <p><strong>Your Content:</strong> You retain full ownership of the personal data and resume
                            content you upload or create on {projectName}. We claim no intellectual property rights over your
                            personal career history.</p>
                        <p><strong>Our Content:</strong> The {projectName} platform, including its code, design, logos, AI
                            models, and templates, is the exclusive property of {projectName} and is protected by copyright
                            and intellectual property laws.</p>
                    </div>

                    <div id="liability">
                        <h2>7. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law, {projectName} shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages, including without limitation, loss
                            of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
                        <ul>
                            <li>Your access to or use of or inability to access or use the Service.</li>
                            <li>Any conduct or content of any third party on the Service.</li>
                            <li>Any content obtained from the Service.</li>
                            <li>The outcome of any job application submitted using documents created on our platform.
                            </li>
                        </ul>
                    </div>

                    <div id="governing">
                        <h2>8. Governing Law</h2>
                        <p>These Terms shall be governed and construed in accordance with the laws of India, without
                            regard to its conflict of law provisions. Our failure to enforce any right or provision of
                            these Terms will not be considered a waiver of those rights.</p>
                    </div>

                    <div id="contact" className="mt-12 pt-8 border-t border-slate-100">
                        <h2 className="mt-0">9. Contact Us</h2>
                        <p>If you have any questions about these Terms, please contact us:</p>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block">
                            <p className="mb-2"><strong>Email:</strong> <a href={`mailto:${settings?.contact_email || 'legal@resumeai.com'}`}
                                    className="text-indigo-600 hover:underline">{settings?.contact_email || 'legal@resumeai.com'}</a></p>
                            <p className="mb-0"><strong>Address:</strong> {settings?.contact_address || '123 Tech Park, Bangalore, India'}</p>
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
