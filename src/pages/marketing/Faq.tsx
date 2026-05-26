
import { Link } from 'react-router-dom';

export default function Faq() {
    return (
        <>

            <main className="flex-grow">

                {/*  2. HERO SECTION  */}
                <section className="relative pt-20 pb-16 text-center px-6 overflow-hidden">
                    {/*  Background Decoration  */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div
                            className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float">
                        </div>
                        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"
                        ></div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 animate-slide-up">
                        Frequently Asked <span className="text-indigo-600">Questions</span>
                    </h1>
                    <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto animate-slide-up" >
                        Everything you need to know about building ATS-friendly resumes, our pricing, and how our AI technology
                        works.
                    </p>

                    {/*  6. SEARCH FAQ  */}
                    <div className="max-w-xl mx-auto relative mb-12 animate-slide-up" >
                        <input type="text" id="faq-search" placeholder="Search for answers..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-slate-800"
                            onKeyUp={() => { }} />
                        <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>
                </section>

                {/*  3. FAQ FILTER  */}
                <section className="container mx-auto px-6 max-w-4xl mb-12">
                    <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
                        <button onClick={() => { }}
                            className="filter-pill active px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">All
                            Questions</button>
                        <button onClick={() => { }}
                            className="filter-pill px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">General</button>
                        <button onClick={() => { }}
                            className="filter-pill px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">ATS
                            Checker</button>
                        <button onClick={() => { }}
                            className="filter-pill px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Pricing</button>
                        <button onClick={() => { }}
                            className="filter-pill px-5 py-2 rounded-full text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">Security</button>
                    </div>
                </section>

                {/*  4. FAQ LIST  */}
                <section className="container mx-auto px-6 max-w-3xl pb-24">
                    <div id="faq-container" className="space-y-4">

                        {/*  Category: General  */}
                        <div className="faq-item bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up"
                            data-category="general">
                            <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                onClick={() => { }}>
                                <span className="text-lg font-bold text-slate-800 faq-question transition-colors">What is an
                                    ATS-friendly resume?</span>
                                <i
                                    className="fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300"></i>
                            </button>
                            <div className="faq-answer px-6 text-slate-600 leading-relaxed">
                                <p>An ATS (Applicant Tracking System) friendly resume is formatted in a way that allows software
                                    to easily read and parse your information. This means avoiding complex layouts, graphics,
                                    and unreadable fonts so that your skills and experience are correctly identified by the
                                    system used by recruiters.</p>
                            </div>
                        </div>

                        <div className="faq-item bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up"
                            data-category="general" >
                            <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                onClick={() => { }}>
                                <span className="text-lg font-bold text-slate-800 faq-question transition-colors">How does the AI
                                    optimization work?</span>
                                <i
                                    className="fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300"></i>
                            </button>
                            <div className="faq-answer px-6 text-slate-600 leading-relaxed">
                                <p>Our AI analyzes millions of job descriptions to understand what recruiters are looking for.
                                    It then suggests specific keywords, action verbs, and formatting improvements for your
                                    resume to maximize your match score for your target role.</p>
                            </div>
                        </div>

                        {/*  Category: ATS  */}
                        <div className="faq-item bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up"
                            data-category="ats" >
                            <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                onClick={() => { }}>
                                <span className="text-lg font-bold text-slate-800 faq-question transition-colors">Can I upload my
                                    existing resume?</span>
                                <i
                                    className="fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300"></i>
                            </button>
                            <div className="faq-answer px-6 text-slate-600 leading-relaxed">
                                <p>Yes! You can upload your existing PDF or DOCX resume. Our system will scan it, extract the
                                    content, and give you a detailed score along with actionable tips to improve it instantly.
                                </p>
                            </div>
                        </div>

                        {/*  Category: Pricing  */}
                        <div className="faq-item bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up"
                            data-category="pricing" >
                            <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                onClick={() => { }}>
                                <span className="text-lg font-bold text-slate-800 faq-question transition-colors">Is there a free
                                    plan available?</span>
                                <i
                                    className="fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300"></i>
                            </button>
                            <div className="faq-answer px-6 text-slate-600 leading-relaxed">
                                <p>Absolutely. Our Free plan allows you to build one resume, use our basic templates, and
                                    download it as a text file. You also get a basic ATS score check for free.</p>
                            </div>
                        </div>

                        <div className="faq-item bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up"
                            data-category="pricing" >
                            <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                onClick={() => { }}>
                                <span className="text-lg font-bold text-slate-800 faq-question transition-colors">Can I cancel my
                                    subscription anytime?</span>
                                <i
                                    className="fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300"></i>
                            </button>
                            <div className="faq-answer px-6 text-slate-600 leading-relaxed">
                                <p>Yes, you can cancel your subscription at any time from your account settings. You will retain
                                    access to premium features until the end of your current billing cycle.</p>
                            </div>
                        </div>

                        {/*  Category: Security  */}
                        <div className="faq-item bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-md animate-slide-up"
                            data-category="security" >
                            <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                onClick={() => { }}>
                                <span className="text-lg font-bold text-slate-800 faq-question transition-colors">Is my personal
                                    data secure?</span>
                                <i
                                    className="fa-solid fa-chevron-down text-slate-400 faq-icon transition-transform duration-300"></i>
                            </button>
                            <div className="faq-answer px-6 text-slate-600 leading-relaxed">
                                <p>Security is our top priority. We use industry-standard encryption to protect your data. We do
                                    not sell your personal information to third parties or recruiters without your explicit
                                    consent.</p>
                            </div>
                        </div>

                    </div>

                    {/*  No Results Message  */}
                    <div id="no-results" className="hidden text-center py-12">
                        <div
                            className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-2xl">
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No questions found</h3>
                        <p className="text-slate-500">Try adjusting your search terms.</p>
                    </div>
                </section>

                {/*  7. STILL HAVE QUESTIONS  */}
                <section className="bg-indigo-50 py-16 border-t border-indigo-100">
                    <div className="container mx-auto px-6 text-center animate-fade-in">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Didn't find what you were looking for?</h2>
                        <p className="text-slate-600 mb-8">Our support team is always ready to help you with any questions.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/contact"
                                className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-500 transition-transform transform hover:-translate-y-1">
                                Contact Support
                            </Link>
                            <a href="#"
                                className="px-6 py-3 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                                Visit Help Center
                            </a>
                        </div>
                    </div>
                </section>

                {/*  8. TRUST CARDS  */}
                <section className="bg-white py-12 border-b border-slate-100">
                    <div className="container mx-auto px-6 max-w-4xl grid md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Secure Payments</h4>
                                <p className="text-xs text-slate-500">256-bit SSL Encryption</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <i className="fa-solid fa-ban"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">No Hidden Fees</h4>
                                <p className="text-xs text-slate-500">Transparent pricing always</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <i className="fa-regular fa-circle-xmark"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Cancel Anytime</h4>
                                <p className="text-xs text-slate-500">No long-term contracts</p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/*  FOOTER  */}




        </>
    );
}
