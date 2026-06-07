export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 text-3xl">
        <i className="fa-solid fa-screwdriver-wrench"></i>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mx-auto">
        This management module is currently under construction. Check back soon for full controls over {title.toLowerCase()}.
      </p>
      <button className="mt-8 px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
        Refresh Status
      </button>
    </div>
  );
}
