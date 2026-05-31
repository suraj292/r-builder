interface HeadingBlockProps {
    data: { level: number; text: string };
    onChange: (data: any) => void;
}

export default function HeadingBlock({ data, onChange }: HeadingBlockProps) {
    return (
        <div className="group relative">
            <div className="flex gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -left-20 top-0">
                {[1, 2, 3].map(l => (
                    <button 
                        key={l}
                        onClick={() => onChange({ ...data, level: l })}
                        className={`w-6 h-6 rounded text-[10px] font-bold border ${data.level === l ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-200'}`}
                    >
                        H{l}
                    </button>
                ))}
            </div>
            <input 
                type="text"
                value={data.text}
                onChange={(e) => onChange({ ...data, text: e.target.value })}
                placeholder={`Heading ${data.level}...`}
                className={`w-full bg-transparent border-none focus:outline-none font-display font-bold text-slate-900 ${
                    data.level === 1 ? 'text-4xl' : data.level === 2 ? 'text-3xl' : 'text-2xl'
                }`}
            />
        </div>
    );
}
