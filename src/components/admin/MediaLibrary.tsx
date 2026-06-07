import { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api';
import Swal from 'sweetalert2';

interface MediaItem {
    id: number;
    file_path: string;
    file_name: string;
    alt_text?: string;
    caption?: string;
    mime_type: string;
    size_bytes: number;
    created_at: string;
}

interface MediaLibraryProps {
    onSelect?: (media: MediaItem) => void;
    onClose?: () => void;
    selectionMode?: boolean;
}

export default function MediaLibrary({ onSelect, onClose, selectionMode = false }: MediaLibraryProps) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<MediaItem[]>('/v1/admin/media/');
            setMediaItems(data);
        } catch (error: any) {
            console.error('Failed to fetch media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const newItem = await api.post<MediaItem>('/v1/admin/media/upload', formData);
            setMediaItems([newItem, ...mediaItems]);
            Swal.fire('Uploaded!', 'File uploaded successfully.', 'success');
        } catch (error: any) {
            Swal.fire('Upload Failed', error.message || 'Error uploading file', 'error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Delete file?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            confirmButtonText: 'Yes, delete it'
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/v1/admin/media/${id}`);
                setMediaItems(mediaItems.filter(m => m.id !== id));
            } catch (error: any) {
                Swal.fire('Error', 'Failed to delete file', 'error');
            }
        }
    };

    return (
        <div className={`bg-white rounded-3xl overflow-hidden flex flex-col ${selectionMode ? 'h-[80vh] max-w-5xl w-full shadow-2xl' : 'min-h-[400px]'}`}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <h3 className="font-bold text-xl text-slate-900">Media Library</h3>
                    <p className="text-xs text-slate-500">Manage images and assets for your blog.</p>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleUpload} 
                        className="hidden" 
                        accept="image/*"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isUploading ? (
                            <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : (
                            <i className="fa-solid fa-upload"></i>
                        )}
                        Upload
                    </button>
                    {onClose && (
                        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-100 transition-colors">
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-medium">Scanning gallery...</p>
                    </div>
                ) : mediaItems.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 text-2xl mb-4">
                            <i className="fa-solid fa-images"></i>
                        </div>
                        <p className="text-slate-400 font-medium">No media items found.</p>
                        <p className="text-xs text-slate-300 mt-1">Upload images to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {mediaItems.map((item) => (
                            <div 
                                key={item.id} 
                                className={`group relative aspect-square rounded-2xl border-2 transition-all cursor-pointer overflow-hidden ${
                                    selectionMode ? 'hover:border-indigo-500' : 'border-slate-100'
                                }`}
                                onClick={() => onSelect?.(item)}
                            >
                                <img 
                                    src={item.file_path} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                    alt={item.alt_text || item.file_name} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                        <span className="text-[10px] text-white truncate max-w-[70%] font-medium">
                                            {item.file_name}
                                        </span>
                                        {!selectionMode && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                                                className="w-6 h-6 rounded bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600"
                                            >
                                                <i className="fa-solid fa-trash text-[10px]"></i>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
