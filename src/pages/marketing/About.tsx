
export default function About() {
    return (
        <>

            <main className="flex-grow">

                {/*  2. HERO SECTION  */}
                <section className="relative pt-20 pb-20 text-center px-6 overflow-hidden">
                    {/*  Decorative Elements  */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                        <div
                            className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float">
                        </div>
                        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-float"
                        ></div>
                    </div>

                    <div className="max-w-4xl mx-auto animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-6 leading-tight">
                            Helping Job Seekers <br /> <span className="text-gradient">Get Hired Faster</span>
                        </h1>
                        <p className="text-slate-500 text-xl max-w-2xl mx-auto leading-relaxed">
                            We built this platform to make resumes smarter, fairer, and completely ATS-friendly using advanced
                            AI.
                        </p>
                    </div>
                </section>

                {/*  3. OUR STORY  */}
                <section className="py-20 bg-white border-y border-slate-100">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="animate-slide-up">
                                <div
                                    className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase rounded-full mb-4">
                                    Our Story</div>
                                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">The System Was Broken. <br />So We
                                    Fixed It.</h2>
                                <div className="space-y-4 text-slate-600 leading-relaxed">
                                    <p>
                                        A few years ago, we realized a hard truth: <strong>being qualified isn't enough to get
                                            hired.</strong>
                                    </p>
                                    <p>
                                        We saw brilliant friends—engineers, designers, marketers—getting rejected instantly. Not
                                        because they lacked skills, but because their resumes couldn't get past the automated
                                        "gatekeepers" known as Applicant Tracking Systems (ATS).
                                    </p>
                                    <p>
                                        Traditional resume builders focused on pretty designs that bots couldn't read. We
                                        decided to build something different. A tool that prioritizes <strong>substance,
                                            strategy, and parseability</strong> without sacrificing style.
                                    </p>
                                </div>
                            </div>
                            <div className="relative animate-slide-up" >
                                <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden shadow-xl relative">
                                    {/*  Abstract Illustration of Resume vs Bot  */}
                                    <div
                                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
                                        <div
                                            className="relative w-48 h-64 bg-white rounded-lg shadow-lg transform -rotate-6 border border-slate-200 p-4">
                                            <div className="w-full h-2 bg-slate-200 rounded mb-2"></div>
                                            <div className="w-2/3 h-2 bg-slate-200 rounded mb-4"></div>
                                            <div className="space-y-2">
                                                <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                                                <div className="w-full h-1.5 bg-slate-100 rounded"></div>
                                            </div>
                                        </div>
                                        <div
                                            className="absolute right-10 bottom-10 w-24 h-24 bg-indigo-600 rounded-2xl shadow-2xl flex items-center justify-center text-white text-3xl transform rotate-3">
                                            <i className="fa-solid fa-robot"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/*  4. OUR MISSION  */}
                <section className="py-24 bg-slate-900 text-white text-center">
                    <div className="container mx-auto px-6 max-w-3xl animate-fade-in">
                        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-6">Our Mission</h2>
                        <p className="text-3xl md:text-4xl font-display font-bold leading-snug mb-8">
                            "To democratize career success by giving every job seeker the tools to create a resume that actually
                            gets seen."
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-300">
                            <span className="flex items-center gap-2"><i className="fa-solid fa-check text-green-400"></i> Simplify
                                Creation</span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full my-auto"></span>
                            <span className="flex items-center gap-2"><i className="fa-solid fa-check text-green-400"></i> Beat ATS
                                Ethically</span>
                            <span className="w-1 h-1 bg-slate-600 rounded-full my-auto"></span>
                            <span className="flex items-center gap-2"><i className="fa-solid fa-check text-green-400"></i> Empower
                                Candidates</span>
                        </div>
                    </div>
                </section>

                {/*  5. WHAT MAKES US DIFFERENT  */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Why Professionals Choose Us</h2>
                            <p className="text-slate-500">We don't just format text. We optimize your career story.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/*  Card 1  */}
                            <div className="value-card bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <div
                                    className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-6">
                                    <i className="fa-solid fa-brain"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">Trained on Real Hiring Data</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">Our AI models analyze millions of job
                                    descriptions to understand exactly what recruiters in your industry are looking for right
                                    now.</p>
                            </div>

                            {/*  Card 2  */}
                            <div className="value-card bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <div
                                    className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl mb-6">
                                    <i className="fa-solid fa-filter"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">ATS-First Architecture</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">We prioritize parseability. No hidden tables,
                                    no unreadable graphics. Just clean code that every hiring system can read perfectly.</p>
                            </div>

                            {/*  Card 3  */}
                            <div className="value-card bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                                <div
                                    className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-6">
                                    <i className="fa-solid fa-user-lock"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">You Own Your Data</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">We don't sell your resume to data brokers.
                                    Your career history is personal, and we keep it private and secure.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/*  6. OUR TECHNOLOGY  */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="md:w-1/2 animate-slide-up">
                                <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Powered by Smart AI</h2>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    It's not magic, it's engineering. Our ResumeAI engine works in three steps:
                                </p>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div
                                            className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                                            1</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Contextual Analysis</h4>
                                            <p className="text-sm text-slate-500 mt-1">We scan your input to understand your
                                                seniority, industry, and core skills.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div
                                            className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                                            2</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Gap Detection</h4>
                                            <p className="text-sm text-slate-500 mt-1">We compare your profile against
                                                top-performing resumes to find missing keywords.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div
                                            className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                                            3</div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">Optimization</h4>
                                            <p className="text-sm text-slate-500 mt-1">We rewrite passive bullet points into active,
                                                impact-driven statements.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="md:w-1/2 w-full animate-slide-up" >
                                <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-inner">
                                    {/*  Simple Visual Representation  */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm opacity-50">
                                            <div className="h-2 w-8 bg-slate-200 rounded"></div>
                                            <div className="h-2 w-full bg-slate-200 rounded"></div>
                                        </div>
                                        <div className="flex justify-center text-slate-300 text-2xl">
                                            <i className="fa-solid fa-arrow-down"></i>
                                        </div>
                                        <div
                                            className="bg-indigo-600 p-4 rounded-xl shadow-lg text-white flex items-center justify-center gap-3">
                                            <i className="fa-solid fa-wand-magic-sparkles animate-pulse"></i>
                                            <span className="font-bold">AI Processing...</span>
                                        </div>
                                        <div className="flex justify-center text-slate-300 text-2xl">
                                            <i className="fa-solid fa-arrow-down"></i>
                                        </div>
                                        <div
                                            className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-green-100">
                                            <div
                                                className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">
                                                <i className="fa-solid fa-check"></i>
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <div className="h-2 w-full bg-slate-800 rounded"></div>
                                                <div className="h-2 w-3/4 bg-slate-800 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/*  7. WHO WE SERVE  */}
                <section className="py-20 bg-slate-50 border-t border-slate-200">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-12">Who We Build For</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            <div
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
                                <div className="text-3xl mb-3">🎓</div>
                                <h4 className="font-bold text-slate-900">Fresh Graduates</h4>
                            </div>
                            <div
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
                                <div className="text-3xl mb-3">💼</div>
                                <h4 className="font-bold text-slate-900">Professionals</h4>
                            </div>
                            <div
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
                                <div className="text-3xl mb-3">🔄</div>
                                <h4 className="font-bold text-slate-900">Career Switchers</h4>
                            </div>
                            <div
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
                                <div className="text-3xl mb-3">💻</div>
                                <h4 className="font-bold text-slate-900">Freelancers</h4>
                            </div>
                        </div>
                    </div>
                </section>

                {/*  8. IMPACT METRICS  */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div
                            className="grid md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            <div className="py-4 md:py-0">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">50k+</div>
                                <div className="text-slate-500 font-medium">Resumes Built</div>
                            </div>
                            <div className="py-4 md:py-0">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">90%</div>
                                <div className="text-slate-500 font-medium">ATS Success Rate</div>
                            </div>
                            <div className="py-4 md:py-0">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">120+</div>
                                <div className="text-slate-500 font-medium">Countries Reached</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/*  9. FINAL CTA  */}
                <section
                    className="py-24 bg-gradient-to-br from-indigo-900 to-slate-900 text-white text-center px-6 relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48ZyBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDQwaDQwVjBIMHY0MHptMjAgMjBoMjBWMjBIMjB2MjB6TTAgMjBoMjBWMHgyMHYyMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvZz48L3N2Zz4=')] opacity-20">
                    </div>

                    <div className="relative z-10 animate-slide-up">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Your Next Job Starts with a <br />Better
                            Resume</h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="resume_builder.html"
                                className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors transform hover:-translate-y-1">
                                Build Resume Free
                            </a>
                            <a href="ats_checker.html"
                                className="px-8 py-4 bg-transparent border border-indigo-400 text-white font-bold rounded-xl hover:bg-indigo-900/50 transition-colors transform hover:-translate-y-1">
                                Check ATS Score
                            </a>
                        </div>
                    </div>
                </section>

            </main>

            {/*  FOOTER  */}



        </>
    );
}
