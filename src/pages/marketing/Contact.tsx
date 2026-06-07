
import { Link } from 'react-router-dom';
import { useSystemStore } from '../../store/useSystemStore';

export default function Contact() {
    const { settings } = useSystemStore();
    const contactEmail = settings?.contact_email || 'support@resumeai.com';
    const contactPhone = settings?.contact_phone || '+1 (555) 000-0000';
    const contactAddress = settings?.contact_address || 'San Francisco, CA';

    return (
        <>

            <main className="flex-grow">

                {/*  2. HERO SECTION  */}
                <section className="relative pt-20 pb-24 text-center px-6 overflow-hidden">
                    {/*  Background Decoration  */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div
                            className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob">
                        </div>
                        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"
                        ></div>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 animate-slide-up">
                            We’d Love to <span className="text-indigo-600">Hear From You</span>
                        </h1>
                        <p className="text-slate-500 text-lg mb-0 animate-slide-up" >
                            Have questions about our resume builder, ATS checking, or enterprise pricing? Our team is ready to
                            help you land your dream job.
                        </p>
                    </div>
                </section>

                {/*  3. CONTACT CARDS & FORM WRAPPER  */}
                <section className="container mx-auto px-6 pb-24 -mt-10">

                    {/*  Info Cards (Floating above)  */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16 relative z-10 animate-fade-in"
                    >
                        {/*  Email  */}
                        <div
                            className="info-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center group cursor-pointer">
                            <div
                                className="icon-box w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl transition-all duration-300">
                                <i className="fa-regular fa-envelope"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">Email Support</h3>
                            <p className="text-sm text-slate-500 mb-3">Our team typically responds within 24 hours.</p>
                            <a href={`mailto:${contactEmail}`}
                                className="text-indigo-600 font-semibold hover:underline">{contactEmail}</a>
                        </div>

                        {/*  Phone  */}
                        <div
                            className="info-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center group cursor-pointer">
                            <div
                                className="icon-box w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl transition-all duration-300">
                                <i className="fa-solid fa-phone"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">Phone (Sales)</h3>
                            <p className="text-sm text-slate-500 mb-3">Mon-Fri from 9am to 6pm EST.</p>
                            <a href={`tel:${contactPhone}`} className="text-blue-600 font-semibold hover:underline">{contactPhone}</a>
                        </div>

                        {/*  Location  */}
                        <div
                            className="info-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center group cursor-pointer">
                            <div
                                className="icon-box w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl transition-all duration-300">
                                <i className="fa-solid fa-location-dot"></i>
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">Headquarters</h3>
                            <p className="text-sm text-slate-500 mb-3">Visit our office for a coffee and chat.</p>
                            <span className="text-purple-600 font-semibold">{contactAddress}</span>
                        </div>
                    </div>

                    {/*  4. CONTACT FORM SECTION  */}
                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row animate-slide-up"
                    >

                        {/*  Left: Visual/Context  */}
                        <div
                            className="md:w-5/12 bg-slate-900 p-10 text-white relative overflow-hidden flex flex-col justify-between">
                            {/*  Decor  */}
                            <div
                                className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob">
                            </div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
                            ></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-display font-bold mb-4">Send us a message</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-8">
                                    Fill out the form and our team will get back to you as soon as possible. We love hearing
                                    your feedback!
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <i className="fa-solid fa-check-circle text-green-400"></i>
                                        <span>Fast 24h response time</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <i className="fa-solid fa-shield-halved text-green-400"></i>
                                        <span>Your data is secure</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <i className="fa-solid fa-user-group text-green-400"></i>
                                        <span>Real human support</span>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 mt-12">
                                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                                    <p className="text-xs italic text-indigo-100 mb-2">"The support team helped me format my resume
                                        perfectly for the job I wanted. Highly recommended!"</p>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold">
                                            AJ</div>
                                        <span className="text-xs font-bold">Alex J.</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*  Right: Form  */}
                        <div className="md:w-7/12 p-8 md:p-10 relative">
                            <form id="contactForm" onSubmit={(e) => e.preventDefault()} className="space-y-6">

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/*  Name  */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Full Name <span
                                            className="text-red-500">*</span></label>
                                        <input type="text" required
                                            className="form-input w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            placeholder="John Doe" />
                                    </div>
                                    {/*  Email  */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Email Address
                                            <span className="text-red-500">*</span></label>
                                        <input type="email" required
                                            className="form-input w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            placeholder="john@example.com" />
                                    </div>
                                </div>

                                {/*  Subject  */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Subject</label>
                                    <div className="relative">
                                        <select
                                            className="form-input w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer">
                                            <option>General Inquiry</option>
                                            <option>Technical Support</option>
                                            <option>Billing & Pricing</option>
                                            <option>Feature Request</option>
                                            <option>Partnership</option>
                                        </select>
                                        <div
                                            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <i className="fa-solid fa-chevron-down text-xs"></i>
                                        </div>
                                    </div>
                                </div>

                                {/*  Message  */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Message <span
                                        className="text-red-500">*</span></label>
                                    <textarea required rows={4}
                                        className="form-input w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                                        placeholder="How can we help you?"></textarea>
                                    <p className="text-xs text-slate-400 text-right">0/500 characters</p>
                                </div>

                                {/*  Submit Button  */}
                                <button type="submit" id="submitBtn"
                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                                    <span>Send Message</span>
                                    <i className="fa-regular fa-paper-plane"></i>
                                </button>

                            </form>

                            {/*  Success Message Overlay  */}
                            <div id="successMessage"
                                className="absolute inset-0 bg-white z-20 hidden flex-col items-center justify-center text-center p-8 animate-fade-in">
                                <div
                                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-3xl mb-6 animate-bounce">
                                    <i className="fa-solid fa-check"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                                <p className="text-slate-500 mb-8 max-w-sm">Thank you for reaching out. We've received your message
                                    and will get back to you shortly.</p>
                                <button onClick={() => { }}
                                    className="px-6 py-2 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-50 transition-colors">
                                    Send Another
                                </button>
                            </div>

                        </div>
                    </div>
                </section>

                {/*  6. FAQ SHORTCUT  */}
                <section className="bg-slate-50 py-16 border-t border-slate-200">
                    <div className="container mx-auto px-6 text-center">
                        <div className="inline-block p-4 bg-white rounded-2xl shadow-sm border border-slate-100 animate-slide-up">
                            <span className="text-slate-500 font-medium mr-4">Looking for quick answers?</span>
                            <div className="inline-flex gap-2 mt-2 sm:mt-0">
                                <a href="#"
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-colors">Visit
                                    Help Center</a>
                                <a href="#"
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Read
                                    FAQs</a>
                            </div>
                        </div>
                    </div>
                </section>

                {/*  8. CTA  */}
                <section
                    className="py-24 bg-gradient-to-br from-slate-900 to-indigo-900 text-white text-center px-6 relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwaDQwVjBIMHY0MHptMjAgMjBoMjBWMjBIMjB2MjB6TTAgMjBoMjBWMHgyMHYyMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-20">
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to Build Your Resume with AI?</h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/builder"
                                className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors">
                                Build Resume Free
                            </Link>
                            <Link to="/ats-checker"
                                className="px-8 py-4 bg-transparent border border-indigo-400 text-white font-bold rounded-xl hover:bg-indigo-800 transition-colors">
                                Check ATS Score
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            {/*  FOOTER  */}




        </>
    );
}
