import { useState } from 'react';
import MediaLibrary from '../../MediaLibrary';

interface ImageBlockProps {
    data: { url: string; alt: string; caption: string };
    onChange: (data: any) => void;
}

export default function ImageBlock({ data, onChange }: ImageBlockProps) {
    const [isMediaOpen, setIsMediaOpen] = useState(false);

    return (
        <div className="space-y-4">
            {data.url ? (
                <div className="relative group">
                    <img src={data.url} alt={data.alt} className="w-full rounded-2xl shadow-sm" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                        <button 
                            onClick={() => setIsMediaOpen(true)}
                            className="px-4 py-2 bg-white text-slate-900 rounded-xl font-bold text-sm shadow-xl"
                        >
                            Change Image
                        </button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsMediaOpen(true)}
                    className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400 hover:bg-slate-100 hover:border-indigo-300 hover:text-indigo-500 transition-all"
                >
                    <i className="fa-solid fa-image text-3xl"></i>
                    <span className="font-bold text-sm">Add Image from Library</span>
                </button>
            )}

            <div className="grid grid-cols-2 gap-4">
                <input 
                    type="text" 
                    value={data.alt}
                    onChange={(e) => onChange({ ...data, alt: e.target.value })}
                    placeholder="Alt text..."
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <input 
                    type="text" 
                    value={data.caption}
                    onChange={(e) => onChange({ ...data, caption: e.target.value })}
                    placeholder="Caption..."
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
            </div>

            {isMediaOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-12 bg-slate-900/60 backdrop-blur-sm">
                    <MediaLibrary 
                        selectionMode 
                        onClose={() => setIsMediaOpen(false)}
                        onSelect={(media) => {
                            onChange({ ...data, url: media.file_path, alt: media.alt_text || media.file_name });
                            setIsMediaOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
