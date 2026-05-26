
export default function AtsChecker() {
    return (
        <>

            <main className="flex-grow">

                {/*  2. HERO SECTION (Initial View)  */}
                <div id="initial-view">
                    <section id="hero-section" className="pt-16 pb-12 text-center px-6 max-w-4xl mx-auto animate-slide-up">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 leading-tight">
                            Check How <span className="text-indigo-600">ATS-Friendly</span><br />Your Resume Is
                        </h1>
                        <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
                            Don't let a bot reject your application. Upload your resume to get an instant analysis of your
                            keywords, formatting, and readability.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm font-medium text-slate-600">
                            <div
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 animate-pulse-slow">
                                <i className="fa-solid fa-check-circle text-green-500"></i> Keyword Match
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 animate-pulse-slow"
                            >
                                <i className="fa-solid fa-check-circle text-green-500"></i> Formatting Check
                            </div>
                            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 animate-pulse-slow"
                            >
                                <i className="fa-solid fa-check-circle text-green-500"></i> Readability Score
                            </div>
                        </div>
                    </section>

                    {/*  3. RESUME INPUT SECTION  */}
                    <section id="input-section" className="px-6 pb-20 transition-all duration-500 animate-slide-up"
                    >
                        <div
                            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">

                            {/*  Tabs Header  */}
                            <div className="flex border-b border-slate-100 bg-slate-50/50">
                                <button
                                    className="flex-1 py-4 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 bg-white transition-colors flex items-center justify-center gap-2"
                                    onClick={() => { }}>
                                    <i className="fa-solid fa-cloud-arrow-up"></i> Upload Resume
                                </button>
                                <button
                                    className="flex-1 py-4 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                                    onClick={() => { }}>
                                    <i className="fa-solid fa-paste"></i> Paste Text
                                </button>
                            </div>

                            <div className="p-8">
                                {/*  Tab A: Upload  */}
                                <div id="tab-upload" className="tab-content active">
                                    <div className="border-2 border-dashed border-slate-300 rounded-xl h-64 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-indigo-50/20 hover:border-indigo-400 transition-all cursor-pointer group relative"
                                        id="dropzone">
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={() => { }} />

                                        {/*  Default State  */}
                                        <div className="text-center group-hover:-translate-y-1 transition-transform duration-300"
                                            id="upload-prompt">
                                            <div
                                                className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-indigo-600 text-2xl group-hover:scale-110 transition-transform">
                                                <i className="fa-solid fa-file-arrow-up"></i>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">Drag & Drop or Click to Upload</h3>
                                            <p className="text-slate-500 text-sm mt-1">Supports PDF, DOCX, TXT (Max 5MB)</p>
                                        </div>

                                        {/*  Success State (Hidden initially)  */}
                                        <div className="hidden text-center" id="upload-success">
                                            <div
                                                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 text-2xl animate-bounce">
                                                <i className="fa-solid fa-check"></i>
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800" id="filename-display">resume.pdf</h3>
                                            <p className="text-green-600 text-sm mt-1 font-medium">Ready for analysis</p>
                                        </div>
                                    </div>
                                </div>

                                {/*  Tab B: Paste  */}
                                <div id="tab-paste" className="tab-content">
                                    <textarea
                                        className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none text-sm leading-relaxed"
                                        placeholder="Copy and paste your resume content here..."></textarea>
                                </div>

                                {/*  4. ANALYZE BUTTON  */}
                                <div className="mt-8">
                                    <button onClick={() => { }}
                                        className="w-full py-4 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                                        <span className="relative z-10 group-hover:hidden">Analyze Resume</span>
                                        <span className="relative z-10 hidden group-hover:inline">Start Free Scan <i
                                            className="fa-solid fa-arrow-right ml-1"></i></span>
                                        <div
                                            className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700">
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/*  LOADING STATE (Overlay)  */}
                <div id="loading-overlay" className="hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
                    <div
                        className="relative w-64 h-80 border-2 border-slate-200 rounded-lg bg-white shadow-xl overflow-hidden mb-8 scale-75 md:scale-100">
                        {/*  Mock Resume Lines  */}
                        <div className="p-6 space-y-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-full mb-4"></div>
                            <div className="w-3/4 h-4 bg-slate-200 rounded"></div>
                            <div className="w-1/2 h-4 bg-slate-200 rounded"></div>
                            <div className="space-y-2 pt-4">
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                                <div className="w-3/4 h-2 bg-slate-100 rounded"></div>
                            </div>
                            <div className="space-y-2 pt-4">
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                                <div className="w-full h-2 bg-slate-100 rounded"></div>
                            </div>
                        </div>
                        {/*  Scanning Line  */}
                        <div
                            className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-scan-line">
                        </div>
                    </div>

                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Analyzing Resume...</h2>
                    <div id="loading-text" className="text-slate-500 text-sm font-medium h-6 overflow-hidden animate-pulse">
                        Parsing keywords and formatting...
                    </div>
                </div>

                {/*  5-10. RESULTS DASHBOARD  */}
                <section id="results-dashboard" className="hidden container mx-auto px-6 py-12 pb-24">

                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-slide-up">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Analysis Report</h2>
                            <p className="text-slate-500 text-sm">Scan completed just now</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex gap-3">
                            <button
                                className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                                <i className="fa-solid fa-download mr-2"></i> Download PDF
                            </button>
                            <button onClick={() => { }}
                                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-lg">
                                <i className="fa-solid fa-plus mr-2"></i> New Scan
                            </button>
                        </div>
                    </div>

                    {/*  Top Row: Score & Summary  */}
                    <div className="grid lg:grid-cols-3 gap-8 mb-8">

                        {/*  Score Card  */}
                        <div className="bg-white rounded-2xl p-8 card-shadow text-center border border-slate-100 animate-slide-up relative overflow-hidden"
                        >
                            <div
                                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500">
                            </div>
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-6">Overall ATS Score</h3>

                            <div className="relative w-48 h-48 mx-auto mb-6">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent"
                                        r="42" cx="50" cy="50" />
                                    <circle className="progress-ring__circle text-indigo-600" strokeWidth="8"
                                        strokeLinecap="round" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50"
                                        strokeDasharray="264" strokeDashoffset="264" id="score-ring" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-6xl font-display font-bold text-slate-900 tracking-tighter"
                                        id="score-counter">0</span>
                                    <span className="text-sm font-medium text-slate-400">/100</span>
                                </div>
                            </div>

                            <div
                                className="inline-block px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-bold text-sm mb-4">
                                Needs Improvement
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Your resume is parseable but lacks specific keywords from the job description.
                            </p>
                        </div>

                        {/*  Executive Summary & Quick Fixes  */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/*  Quick Stats  */}
                            <div className="grid grid-cols-3 gap-4 h-full">
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow flex flex-col justify-center animate-slide-up"
                                >
                                    <div
                                        className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-lg mb-3">
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900">12/18</span>
                                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">Keywords Matched</span>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow flex flex-col justify-center animate-slide-up"
                                >
                                    <div
                                        className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg mb-3">
                                        <i className="fa-solid fa-briefcase"></i>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900">Mid-Level</span>
                                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">Experience Detected</span>
                                </div>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 card-shadow flex flex-col justify-center animate-slide-up"
                                >
                                    <div
                                        className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg mb-3">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900">3 Errors</span>
                                    <span className="text-xs text-slate-500 font-medium uppercase mt-1">Critical Issues</span>
                                </div>
                            </div>

                            {/*  Critical Issues Box  */}
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex-grow animate-slide-up"
                            >
                                <h4 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                                    <i className="fa-solid fa-circle-exclamation"></i> Top Priorities to Fix
                                </h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                        <i className="fa-solid fa-xmark text-red-500 mt-1"></i>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800">Missing Hard Skills</span>
                                            <span className="text-xs text-slate-600">You are missing 'Python', 'AWS', and 'Docker'
                                                which are critical for this role.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3 bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                                        <i className="fa-solid fa-xmark text-red-500 mt-1"></i>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-800">Contact Info Parsing
                                                Error</span>
                                            <span className="text-xs text-slate-600">Your email address is inside a header/footer
                                                which some ATS cannot read.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/*  Deep Dive Section  */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">

                        {/*  Skills Gap Analysis  */}
                        <div className="bg-white rounded-2xl p-8 card-shadow border border-slate-100 animate-slide-up"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-slate-900">Skills Gap Analysis</h3>
                                <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">65% Match</span>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-green-600 uppercase mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-check"></i> Found on Resume
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span
                                            className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-100">Project
                                            Management</span>
                                        <span
                                            className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-100">Agile</span>
                                        <span
                                            className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-100">Scrum</span>
                                        <span
                                            className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-100">Team
                                            Leadership</span>
                                        <span
                                            className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-100">Communication</span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <h4 className="text-xs font-bold text-red-500 uppercase mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-xmark"></i> Missing (Add These!)
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <span
                                            className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 border-dashed">Python</span>
                                        <span
                                            className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 border-dashed">Data
                                            Analysis</span>
                                        <span
                                            className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 border-dashed">SQL</span>
                                        <span
                                            className="px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-100 border-dashed">JIRA</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-3 italic">
                                        <i className="fa-solid fa-lightbulb text-yellow-400 mr-1"></i> Tip: Add these to your
                                        "Skills" section or weave them into bullet points.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/*  Formatting & Parseability  */}
                        <div className="bg-white rounded-2xl p-8 card-shadow border border-slate-100 animate-slide-up"
                        >
                            <h3 className="font-bold text-lg text-slate-900 mb-6">Formatting Health</h3>

                            <div className="space-y-4">
                                {/*  Item  */}
                                <div
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <i className="fa-regular fa-file-pdf"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">File Format</h4>
                                            <p className="text-xs text-slate-500">PDF (Text-based)</p>
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-bold text-sm"><i className="fa-solid fa-check mr-1"></i>
                                        Pass</span>
                                </div>

                                {/*  Item  */}
                                <div
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                            <i className="fa-solid fa-heading"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">Section Headers</h4>
                                            <p className="text-xs text-slate-500">Standard naming conventions</p>
                                        </div>
                                    </div>
                                    <span className="text-green-600 font-bold text-sm"><i className="fa-solid fa-check mr-1"></i>
                                        Pass</span>
                                </div>

                                {/*  Item  */}
                                <div
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors bg-red-50/50">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                            <i className="fa-solid fa-image"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">Graphics/Images</h4>
                                            <p className="text-xs text-slate-500">Headshot detected</p>
                                        </div>
                                    </div>
                                    <span className="text-red-600 font-bold text-sm"><i className="fa-solid fa-xmark mr-1"></i>
                                        Fail</span>
                                </div>

                                {/*  Item  */}
                                <div
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                            <i className="fa-regular fa-calendar"></i>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-sm">Date Formatting</h4>
                                            <p className="text-xs text-slate-500">Inconsistent formats used</p>
                                        </div>
                                    </div>
                                    <span className="text-yellow-600 font-bold text-sm"><i
                                        className="fa-solid fa-triangle-exclamation mr-1"></i> Warn</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Content Impact  */}
                    <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl animate-slide-up"
                    >
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-wand-magic-sparkles text-indigo-400"></i> Content Impact Analysis
                                </h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    We analyzed your bullet points for strength, clarity, and measurable results.
                                </p>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Action Verbs Usage</span>
                                            <span className="font-bold text-green-400">Strong (85%)</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full w-[85%]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">Quantifiable Results (Numbers/%)</span>
                                            <span className="font-bold text-red-400">Weak (20%)</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2">
                                            <div className="bg-red-500 h-2 rounded-full w-[20%]"></div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Try adding metrics like "Increased revenue by
                                            20%"</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-1/3 bg-slate-800 p-6 rounded-xl border border-slate-700">
                                <h4 className="font-bold text-sm text-slate-300 mb-4 uppercase tracking-wide">Recruiter Simulation
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                                        <span className="text-slate-400">Word Count</span>
                                        <span className="font-mono">642 (Good)</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-slate-700 pb-2">
                                        <span className="text-slate-400">Avg Bullet Length</span>
                                        <span className="font-mono">14 words</span>
                                    </div>
                                    <div className="flex justify-between text-sm pb-2">
                                        <span className="text-slate-400">Reading Level</span>
                                        <span className="font-mono">Grade 10</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*  Fix Actions  */}
                    <div className="mt-8 flex justify-center animate-slide-up" >
                        <a href="resume_builder.html"
                            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transform hover:-translate-y-1">
                            <i className="fa-solid fa-wrench mr-2"></i> Fix These Issues in Resume Builder
                        </a>
                    </div>

                </section>
            </main>



        </>
    );
}
