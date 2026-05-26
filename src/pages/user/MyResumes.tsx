
export default function MyResumes() {
  return (
    <>
      

    {/*  1. HEADER  */}
    <header className="glass-header sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <a href="index.html" className="flex items-center gap-2.5 group">
                <div
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-sm shadow-md group-hover:rotate-6 transition-transform">
                    <i className="fa-solid fa-file-contract"></i>
                </div>
                <span className="text-lg font-display font-bold text-slate-800 tracking-tight">Resume<span
                        className="text-indigo-600">AI</span></span>
            </a>

            

            <div className="flex items-center gap-4">
                <button
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <i className="fa-regular fa-bell"></i>
                </button>
                <div className="relative group cursor-pointer">
                    <img src="https://ui-avatars.com/api/?name=Alex+Morgan&background=6366f1&color=fff"
                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm hover:border-indigo-200 transition-all" />
                </div>
            </div>
        </div>
    </header>

    <main className="flex-grow container mx-auto px-6 py-8">

        {/*  2. PAGE TITLE & ACTIONS  */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 animate-fade-in">
            <div>
                <h1 className="text-3xl font-display font-bold text-slate-900">My Resumes</h1>
                <p className="text-slate-500 text-sm mt-1">Manage and optimize your career documents.</p>
            </div>
            <div className="flex gap-3">
                <button
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm">
                    <i className="fa-solid fa-file-import"></i> Import
                </button>
                <a href="resume_builder.html"
                    className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200">
                    <i className="fa-solid fa-plus"></i> New Resume
                </a>
            </div>
        </div>

        {/*  5. FILTERS & SEARCH  */}
        <div
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 animate-slide-up">
            <div className="relative w-full md:w-96">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" id="resume-search" placeholder="Search resumes..."
                    className="search-input w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none transition-all"
                    onKeyUp={() => {}} />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
                <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Sort By:</span>
                <select
                    className="text-sm border-none bg-transparent font-medium text-slate-700 focus:ring-0 cursor-pointer">
                    <option>Last Edited</option>
                    <option>Name (A-Z)</option>
                    <option>ATS Score (High-Low)</option>
                </select>
                <div className="h-4 w-px bg-slate-200"></div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                    <button className="p-1.5 bg-white rounded shadow-sm text-slate-800"><i
                            className="fa-solid fa-grid-2"></i></button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600"><i className="fa-solid fa-list"></i></button>
                </div>
            </div>
        </div>

        {/*  6. ATS INSIGHT BAR (Optional)  */}
        <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex items-center justify-between animate-slide-up"
            >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <i className="fa-solid fa-chart-line"></i>
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800">Resume Performance</p>
                    <p className="text-xs text-slate-500">Your average ATS score is <span
                            className="text-green-600 font-bold">78/100</span>. Aim for 85+.</p>
                </div>
            </div>
            <a href="ats_checker.html" className="text-xs font-bold text-indigo-600 hover:underline">Check ATS Score →</a>
        </div>

        {/*  2. RESUME GRID  */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up"
             id="resume-grid">

            {/*  Create New Card (Placeholder)  */}
            <a href="resume_builder.html"
                className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-8 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group h-[320px] cursor-pointer">
                <div
                    className="w-14 h-14 rounded-full bg-slate-50 group-hover:bg-white text-slate-400 group-hover:text-indigo-600 flex items-center justify-center mb-4 shadow-sm transition-colors text-xl">
                    <i className="fa-solid fa-plus"></i>
                </div>
                <h3 className="font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Create New Resume</h3>
                <p className="text-xs text-slate-400 mt-1">Start from scratch or template</p>
            </a>

            {/*  Resume Card 1  */}
            <div
                className="resume-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[320px] group relative">
                {/*  Thumbnail  */}
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                    {/*  Mock Document  */}
                    <div
                        className="absolute top-4 left-4 right-4 bottom-[-20px] bg-white shadow-sm p-4 text-[6px] text-slate-300 leading-relaxed rounded-t-lg pointer-events-none select-none">
                        <div className="w-1/3 h-2 bg-slate-800 mb-2 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                        <div className="w-2/3 h-1 bg-slate-200 mb-4 rounded"></div>
                        <div className="w-1/4 h-1.5 bg-slate-400 mb-2 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                    </div>

                    {/*  Overlay Actions  */}
                    <div className="card-overlay absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <a href="resume_builder.html"
                            className="px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold shadow hover:bg-indigo-50 transition-colors transform hover:scale-105">
                            <i className="fa-solid fa-pen mr-1"></i> Edit
                        </a>
                        <button
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow hover:bg-indigo-500 transition-colors transform hover:scale-105">
                            <i className="fa-solid fa-download mr-1"></i> PDF
                        </button>
                    </div>
                </div>

                {/*  Info  */}
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 text-sm truncate pr-2"
                            title="Senior Product Manager Resume">Senior Product Manager...</h3>
                        <button className="text-slate-400 hover:text-slate-600" onClick={() => {}}>
                            <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        {/*  Dropdown Menu (Hidden)  */}
                        <div
                            className="absolute right-4 top-48 bg-white border border-slate-100 shadow-xl rounded-xl w-36 py-1 hidden z-10 menu-dropdown">
                            <button
                                className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600"><i
                                    className="fa-regular fa-copy mr-2"></i> Duplicate</button>
                            <button
                                className="w-full text-left px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-indigo-600"><i
                                    className="fa-regular fa-pen-to-square mr-2"></i> Rename</button>
                            <div className="h-px bg-slate-100 my-1"></div>
                            <button className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-50"
                                onClick={() => {}}><i className="fa-regular fa-trash-can mr-2"></i> Delete</button>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mb-4">Edited 2 hours ago</p>

                    <div className="mt-auto flex items-center justify-between">
                        <span
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded border border-green-100">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 85/100 ATS
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Modern</span>
                    </div>
                </div>
            </div>

            {/*  Resume Card 2  */}
            <div
                className="resume-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[320px] group relative">
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                    <div
                        className="absolute top-4 left-4 right-4 bottom-[-20px] bg-white shadow-sm p-4 text-[6px] text-slate-300 leading-relaxed rounded-t-lg pointer-events-none select-none">
                        <div className="flex gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                            <div className="flex-1 space-y-1">
                                <div className="w-full h-1.5 bg-slate-800 rounded"></div>
                                <div className="w-2/3 h-1 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                        <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                    </div>
                    <div className="card-overlay absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <a href="resume_builder.html"
                            className="px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold shadow hover:bg-indigo-50 transition-colors">Edit</a>
                        <a href="ats_checker.html"
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold shadow hover:bg-slate-800 transition-colors">Check
                            ATS</a>
                    </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 text-sm truncate pr-2">Marketing Lead 2024</h3>
                        <button className="text-slate-400 hover:text-slate-600"><i
                                className="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">Edited 2 days ago</p>
                    <div className="mt-auto flex items-center justify-between">
                        <span
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-50 text-yellow-700 text-[10px] font-bold rounded border border-yellow-100">
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> 62/100 ATS
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Creative</span>
                    </div>
                </div>
            </div>

            {/*  Resume Card 3 (Draft)  */}
            <div
                className="resume-card bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[320px] group relative">
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                    <div
                        className="absolute top-4 left-4 right-4 bottom-[-20px] bg-white shadow-sm p-4 text-[6px] text-slate-300 leading-relaxed rounded-t-lg pointer-events-none select-none opacity-50">
                        <div className="w-1/2 h-2 bg-slate-800 mb-4 rounded"></div>
                        <div className="w-full h-1 bg-slate-200 mb-1 rounded"></div>
                    </div>
                    <div className="card-overlay absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <a href="resume_builder.html"
                            className="px-4 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold shadow hover:bg-indigo-50 transition-colors">Continue
                            Editing</a>
                    </div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-800 text-sm truncate pr-2">Untitled Resume</h3>
                        <button className="text-slate-400 hover:text-slate-600"><i
                                className="fa-solid fa-ellipsis-vertical"></i></button>
                    </div>
                    <p className="text-xs text-slate-400 mb-4">Edited 5 days ago</p>
                    <div className="mt-auto flex items-center justify-between">
                        <span
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded border border-slate-200">
                            Draft
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Standard</span>
                    </div>
                </div>
            </div>

        </div>

    </main>

    {/*  8. DELETE MODAL  */}
    <div id="delete-modal" className="fixed inset-0 z-50 hidden">
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => {}}>
        </div>
        <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-pop">
            <div
                className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 text-xl">
                <i className="fa-solid fa-trash-can"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Resume?</h3>
            <p className="text-sm text-slate-500 text-center mb-6">Are you sure you want to delete this resume? This action
                cannot be undone.</p>
            <div className="flex gap-3">
                <button onClick={() => {}}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                <button onClick={() => {}}
                    className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Delete</button>
            </div>
        </div>
    </div>

    {/*  TOAST NOTIFICATION  */}
    <div id="toast"
        className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 toast">
        <i className="fa-solid fa-circle-check text-green-400"></i>
        <span className="text-sm font-medium">Resume deleted successfully</span>
    </div>

    

    </>
  );
}
