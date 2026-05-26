
export default function Privacy() {
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
                <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-500 text-lg">
                    Your privacy is important to us. This policy explains comfortably and clearly how we collect, use,
                    and protect your data.
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
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 pl-3">Contents</h4>
                        <a href="#info-collect"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">1.
                            Information We Collect</a>
                        <a href="#how-use"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">2.
                            How We Use Information</a>
                        <a href="#security"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">3.
                            Storage & Security</a>
                        <a href="#third-party"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">4.
                            Third-Party Services</a>
                        <a href="#cookies"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">5.
                            Cookies</a>
                        <a href="#rights"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">6.
                            Your Rights</a>
                        <a href="#contact"
                            className="block px-3 py-2 text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">7.
                            Contact Us</a>
                    </nav>
                </aside>

                {/*  Policy Content  */}
                <div
                    className="lg:col-span-9 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 policy-content animate-slide-up">

                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-8">
                        <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                            <i className="fa-solid fa-shield-halved"></i> Trust Summary
                        </h3>
                        <p className="text-sm text-indigo-800">
                            We do <strong>not</strong> sell your resume data to recruiters, data brokers, or third
                            parties. Your resume is yours, and we only use it to help you build it better.
                        </p>
                    </div>

                    <div id="info-collect">
                        <h2>1. Information We Collect</h2>
                        <p>To provide our resume building and ATS checking services, we collect the following types of
                            information:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> Name, email address, and phone number when you
                                create an account.</li>
                            <li><strong>Resume Content:</strong> Any text, images, or files you upload or type into the
                                resume builder (experience, education, skills, etc.).</li>
                            <li><strong>Job Descriptions:</strong> Text you paste into the ATS Checker to compare
                                against your resume.</li>
                            <li><strong>Usage Data:</strong> Information on how you interact with our website (e.g.,
                                pages visited, time spent) to help us improve performance.</li>
                            <li><strong>Payment Information:</strong> If you upgrade to a paid plan, our secure payment
                                processors (like Razorpay or Stripe) handle your financial details. We do not store your
                                full credit card information.</li>
                        </ul>
                    </div>

                    <div id="how-use">
                        <h2>2. How We Use Your Information</h2>
                        <p>We use your data solely to deliver and improve our services:</p>
                        <ul>
                            <li>To generate, format, and download your resumes.</li>
                            <li>To analyze your resume against job descriptions and calculate ATS scores.</li>
                            <li>To improve our AI algorithms (e.g., suggesting better keywords or phrasing).</li>
                            <li>To send you important account updates, security alerts, and support messages.</li>
                            <li>To provide customer support when you encounter issues.</li>
                        </ul>
                    </div>

                    <div id="security">
                        <h2>3. Data Storage & Security</h2>
                        <p>We take the security of your personal data seriously.</p>
                        <ul>
                            <li><strong>Encryption:</strong> All data transmitted between your browser and our servers
                                is encrypted using SSL (Secure Socket Layer) technology. Your data is also encrypted at
                                rest in our databases.</li>
                            <li><strong>Secure Infrastructure:</strong> We use industry-leading cloud providers (like
                                AWS or Google Cloud) with robust physical and digital security measures.</li>
                            <li><strong>Access Control:</strong> Access to your personal data is restricted to
                                authorized personnel who need it to perform their job duties.</li>
                        </ul>
                    </div>

                    <div id="third-party">
                        <h2>4. Third-Party Services</h2>
                        <p>We may share limited data with trusted third-party service providers to help us operate our
                            business. These providers act on our behalf and are contractually obligated to protect your
                            data.</p>
                        <ul>
                            <li><strong>Payment Processors:</strong> To securely process transactions.</li>
                            <li><strong>Analytics Providers:</strong> To understand website traffic and usage patterns
                                (e.g., Google Analytics).</li>
                            <li><strong>Cloud Hosting:</strong> To store our application data securely.</li>
                        </ul>
                        <p>We ensure these providers follow strict privacy standards and only receive the data necessary
                            to perform their specific functions.</p>
                    </div>

                    <div id="cookies">
                        <h2>5. Cookies & Tracking</h2>
                        <p>We use cookies (small text files stored on your device) to:</p>
                        <ul>
                            <li>Keep you logged in to your account.</li>
                            <li>Remember your preferences (like language or narrative tone).</li>
                            <li>Analyze how our site is used so we can improve it.</li>
                        </ul>
                        <p>You can control or disable cookies through your browser settings, though some features of the
                            platform may not function correctly without them.</p>
                    </div>

                    <div id="rights">
                        <h2>6. Your Rights & Data Retention</h2>
                        <p>You have full control over your data:</p>
                        <ul>
                            <li><strong>Access & Update:</strong> You can view and edit your profile and resumes at any
                                time via your dashboard.</li>
                            <li><strong>Delete Account:</strong> You can request the deletion of your account and all
                                associated data from your profile settings. We will permanently remove your data from
                                our active servers.</li>
                            <li><strong>Data Portability:</strong> You can download your resumes in PDF or DOCX format
                                at any time.</li>
                            <li><strong>Retention:</strong> We retain your data only for as long as you have an active
                                account. If you delete your account, we delete your data.</li>
                        </ul>
                    </div>

                    <div id="children">
                        <h2>7. Children's Privacy</h2>
                        <p>Our service is designed for professionals and job seekers. We do not knowingly collect
                            personal information from children under the age of 13 (or 16, depending on local laws). If
                            we become aware that a child has provided us with personal data, we will take steps to
                            delete it.</p>
                    </div>

                    <div id="updates">
                        <h2>8. Policy Updates</h2>
                        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or
                            legal requirements. We will notify you of any significant changes by posting the new policy
                            on this page and updating the "Last Updated" date.</p>
                    </div>

                    <div id="contact" className="mt-12 pt-8 border-t border-slate-100">
                        <h2 className="mt-0">9. Contact Us</h2>
                        <p>If you have any questions or concerns about this Privacy Policy or your data, please reach
                            out to us:</p>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block">
                            <p className="mb-2"><strong>Email:</strong> <a href="mailto:privacy@resumeai.com"
                                    className="text-indigo-600 hover:underline">privacy@resumeai.com</a></p>
                            <p className="mb-0"><strong>Address:</strong> 123 Tech Park, Bangalore, India</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/*  8. TRUST FOOTER  */}
        <section className="bg-white py-12 border-t border-slate-100">
            <div className="container mx-auto px-6 text-center">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Your data is safe with us</h3>
                <div
                    className="flex flex-wrap justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-lock text-2xl text-slate-400"></i>
                        <span className="font-bold text-slate-600">SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-server text-2xl text-slate-400"></i>
                        <span className="font-bold text-slate-600">Secure Cloud Storage</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <i className="fa-solid fa-user-shield text-2xl text-slate-400"></i>
                        <span className="font-bold text-slate-600">GDPR Compliant</span>
                    </div>
                </div>
            </div>
        </section>

    </main>

    {/*  FOOTER  */}
    

    {/*  Smooth Scroll Script for Sidebar Links  */}
    


    </>
  );
}
