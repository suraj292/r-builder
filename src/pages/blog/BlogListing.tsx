
export default function BlogListing() {
    return (
        <>

            <main className="flex-grow">

                {/*  2. BLOG HERO  */}
                <section className="bg-white border-b border-slate-100 pt-16 pb-16 relative overflow-hidden">
                    <div
                        className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob">
                    </div>
                    <div
                        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000">
                    </div>

                    <div className="container mx-auto px-6 text-center relative z-10 animate-fade-in">
                        <span
                            className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">The
                            Career Blog</span>
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                            Resume Tips, <span className="text-indigo-600">ATS Insights</span> & Career Advice
                        </h1>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Master the art of job hunting with expert guides on building resumes that pass the bots and impress
                            the humans.
                        </p>
                    </div>
                </section>

                {/*  3. FEATURED POST  */}
                <section className="container mx-auto px-6 py-12">
                    <article
                        className="relative group rounded-3xl overflow-hidden shadow-lg animate-slide-up hover:shadow-2xl transition-all duration-300">
                        <a href="blog-detail.html" className="block relative h-[400px] md:h-[500px]">
                            <img src="https://picsum.photos/seed/resume/1200/600" alt="Featured Post"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90">
                            </div>
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
                                <span
                                    className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg mb-4">ATS
                                    Strategy</span>
                                <h2
                                    className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight group-hover:text-indigo-200 transition-colors">
                                    10 Hidden Keywords That Will Triple Your Interview Chances in 2024
                                </h2>
                                <p className="text-slate-300 mb-6 line-clamp-2">
                                    Stop guessing what recruiters want. We analyzed 100,000 job descriptions to find the power
                                    words that consistently beat the ATS algorithms.
                                </p>
                                <div className="flex items-center gap-3 text-white/80 text-sm">
                                    <img src="https://ui-avatars.com/api/?name=Sarah+J&background=6366f1&color=fff"
                                        className="w-8 h-8 rounded-full" />
                                    <span className="font-semibold">Sarah Jenkins</span>
                                    <span>•</span>
                                    <span>Oct 24, 2023</span>
                                    <span>•</span>
                                    <span>8 min read</span>
                                </div>
                            </div>
                        </a>
                    </article>
                </section>

                <section className="container mx-auto px-6 py-8">
                    <div className="grid lg:grid-cols-12 gap-12">

                        {/*  4. BLOG GRID (Left)  */}
                        <div className="lg:col-span-8">
                            <div className="grid md:grid-cols-2 gap-8 mb-12">

                                {/*  Post 1  */}
                                <article
                                    className="blog-card bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-full animate-slide-up">
                                    <a href="blog-detail.html" className="block h-48 overflow-hidden relative">
                                        <img src="https://picsum.photos/seed/work/600/400"
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                        <span
                                            className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full">Guides</span>
                                    </a>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3
                                            className="text-xl font-bold text-slate-900 mb-3 hover:text-indigo-600 transition-colors">
                                            <a href="blog-detail.html">How to Explain Employment Gaps on Your Resume</a>
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                                            Don't let a career break hurt your chances. Here are 5 ATS-friendly ways to frame
                                            your time off positively.
                                        </p>
                                        <div
                                            className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                                            <span>5 min read</span>
                                            <span>Oct 20, 2023</span>
                                        </div>
                                    </div>
                                </article>

                                {/*  Post 2  */}
                                <article
                                    className="blog-card bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-full animate-slide-up"
                                >
                                    <a href="blog-detail.html" className="block h-48 overflow-hidden relative">
                                        <img src="https://picsum.photos/seed/office/600/400"
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                        <span
                                            className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full">Templates</span>
                                    </a>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3
                                            className="text-xl font-bold text-slate-900 mb-3 hover:text-indigo-600 transition-colors">
                                            <a href="blog-detail.html">Best Fonts for Resumes: What Recruiters Actually Read</a>
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                                            Is Times New Roman dead? We rank the top 10 fonts for readability and parsing
                                            compatibility.
                                        </p>
                                        <div
                                            className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                                            <span>4 min read</span>
                                            <span>Oct 18, 2023</span>
                                        </div>
                                    </div>
                                </article>

                                {/*  5. INLINE ADSENSE PLACEHOLDER  */}
                                <div className="md:col-span-2 my-4 animate-fade-in">
                                    <div
                                        className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                                        <span
                                            className="absolute top-0 right-0 bg-slate-200 text-slate-500 text-[10px] px-2 py-0.5 rounded-bl">Sponsored</span>
                                        <div
                                            className="w-full md:w-1/3 h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                                            <i className="fa-regular fa-image text-3xl"></i>
                                        </div>
                                        <div className="w-full md:w-2/3 text-center md:text-left">
                                            <h4 className="font-bold text-slate-800 mb-2">Master Your Interview Skills</h4>
                                            <p className="text-sm text-slate-500 mb-4">Join our partner platform for mock interviews
                                                with real FAANG engineers.</p>
                                            <button
                                                className="text-xs font-bold text-indigo-600 uppercase tracking-wide border border-indigo-600 px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition-colors">Learn
                                                More</button>
                                        </div>
                                    </div>
                                </div>

                                {/*  Post 3  */}
                                <article
                                    className="blog-card bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-full animate-slide-up">
                                    <a href="blog-detail.html" className="block h-48 overflow-hidden relative">
                                        <img src="https://picsum.photos/seed/tech/600/400"
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                        <span
                                            className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full">Tech</span>
                                    </a>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3
                                            className="text-xl font-bold text-slate-900 mb-3 hover:text-indigo-600 transition-colors">
                                            <a href="blog-detail.html">Resume vs CV: Which One Do You Really Need?</a>
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                                            The definitive guide to understanding the differences and when to use each format.
                                        </p>
                                        <div
                                            className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                                            <span>6 min read</span>
                                            <span>Oct 15, 2023</span>
                                        </div>
                                    </div>
                                </article>

                                {/*  Post 4  */}
                                <article
                                    className="blog-card bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col h-full animate-slide-up"
                                >
                                    <a href="blog-detail.html" className="block h-48 overflow-hidden relative">
                                        <img src="https://picsum.photos/seed/writing/600/400"
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                                        <span
                                            className="absolute top-4 left-4 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full">Writing</span>
                                    </a>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3
                                            className="text-xl font-bold text-slate-900 mb-3 hover:text-indigo-600 transition-colors">
                                            <a href="blog-detail.html">Action Verbs List: 100+ Words to Replace "Responsible
                                                For"</a>
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">
                                            Stop using passive language. Energize your bullet points with these powerful action
                                            verbs.
                                        </p>
                                        <div
                                            className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                                            <span>3 min read</span>
                                            <span>Oct 10, 2023</span>
                                        </div>
                                    </div>
                                </article>

                            </div>

                            {/*  7. PAGINATION  */}
                            <div className="flex justify-center items-center gap-2 mt-12 animate-fade-in">
                                <button
                                    className="w-10 h-10 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all flex items-center justify-center">
                                    <i className="fa-solid fa-chevron-left"></i>
                                </button>
                                <button className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-bold shadow-md">1</button>
                                <button
                                    className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all">2</button>
                                <button
                                    className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all">3</button>
                                <span className="text-slate-400">...</span>
                                <button
                                    className="w-10 h-10 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:border-indigo-200 transition-all">12</button>
                                <button
                                    className="w-10 h-10 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all flex items-center justify-center">
                                    <i className="fa-solid fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>

                        {/*  6. SIDEBAR (Right)  */}
                        <aside className="lg:col-span-4 space-y-8 animate-slide-up" >

                            {/*  Search  */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4">Search</h4>
                                <div className="relative">
                                    <input type="text" placeholder="Search articles..."
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                                    <i
                                        className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                                </div>
                            </div>

                            {/*  Categories  */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4">Categories</h4>
                                <ul className="space-y-2">
                                    <li><a href="#"
                                        className="flex justify-between items-center text-slate-600 hover:text-indigo-600 transition-colors group"><span
                                            className="group-hover:translate-x-1 transition-transform">Resume Tips</span> <span
                                                className="bg-slate-100 text-xs px-2 py-0.5 rounded-full text-slate-500">24</span></a>
                                    </li>
                                    <li><a href="#"
                                        className="flex justify-between items-center text-slate-600 hover:text-indigo-600 transition-colors group"><span
                                            className="group-hover:translate-x-1 transition-transform">ATS Secrets</span> <span
                                                className="bg-slate-100 text-xs px-2 py-0.5 rounded-full text-slate-500">18</span></a>
                                    </li>
                                    <li><a href="#"
                                        className="flex justify-between items-center text-slate-600 hover:text-indigo-600 transition-colors group"><span
                                            className="group-hover:translate-x-1 transition-transform">Career Advice</span>
                                        <span
                                            className="bg-slate-100 text-xs px-2 py-0.5 rounded-full text-slate-500">32</span></a>
                                    </li>
                                    <li><a href="#"
                                        className="flex justify-between items-center text-slate-600 hover:text-indigo-600 transition-colors group"><span
                                            className="group-hover:translate-x-1 transition-transform">Cover Letters</span>
                                        <span
                                            className="bg-slate-100 text-xs px-2 py-0.5 rounded-full text-slate-500">12</span></a>
                                    </li>
                                </ul>
                            </div>

                            {/*  AdSense Sidebar Placeholder  */}
                            <div
                                className="bg-slate-100 rounded-2xl h-[300px] flex flex-col items-center justify-center text-slate-400 relative overflow-hidden border border-slate-200">
                                <span
                                    className="absolute top-2 right-2 text-[10px] bg-white/50 px-2 py-0.5 rounded text-slate-500">Sponsored</span>
                                <i className="fa-regular fa-image text-4xl mb-2"></i>
                                <span className="text-sm">Ad Space (300x250)</span>
                            </div>

                            {/*  Recent Posts  */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-4">Trending Now</h4>
                                <div className="space-y-4">
                                    <a href="blog-detail.html" className="flex gap-4 group">
                                        <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                                            <img src="https://picsum.photos/seed/trend1/100/100"
                                                className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h5
                                                className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                5 Things You Should Remove From Your Resume Immediately</h5>
                                            <span className="text-xs text-slate-400 mt-1 block">Oct 22, 2023</span>
                                        </div>
                                    </a>
                                    <a href="blog-detail.html" className="flex gap-4 group">
                                        <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                                            <img src="https://picsum.photos/seed/trend2/100/100"
                                                className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h5
                                                className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                How to Beat the Applicant Tracking System</h5>
                                            <span className="text-xs text-slate-400 mt-1 block">Oct 19, 2023</span>
                                        </div>
                                    </a>
                                </div>
                            </div>

                        </aside>
                    </div>
                </section>

            </main>

            {/*  FOOTER  */}



        </>
    );
}
