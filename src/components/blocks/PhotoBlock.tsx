import React, { useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import type { PhotoBlock as PhotoBlockType } from '../../types/resume';
import { ImagePlus } from 'lucide-react';

export default ({ id }: { id: string }) => {
  const block = useResumeStore(state => state.resume.blocks[id]) as PhotoBlockType;
  const updateBlock = useResumeStore(state => state.updateBlock);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!block || block.type !== 'photo') return null;

  const { url, shape, borderStyle, filter, objectPosition } = block.data;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBlock(id, { url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const borderRadius = shape === 'circle' ? '50%' : shape === 'rounded' ? '16px' : '0';

  return (
    <div className="relative group w-32 h-32 mx-auto">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handlePhotoUpload}
      />
      
      <div 
        className="w-full h-full bg-gray-100 overflow-hidden flex items-center justify-center cursor-pointer relative"
        style={{ 
          borderRadius, 
          border: borderStyle || 'none',
          filter: filter || 'none'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        {url ? (
          <img 
            src={url} 
            alt="Custom Block" 
            className="w-full h-full object-cover" 
            style={{ objectPosition: objectPosition || 'center' }}
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400 gap-1">
            <ImagePlus className="w-6 h-6" />
            <span className="text-[10px] font-medium">Add Photo</span>
          </div>
        )}
      </div>

      {url && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity no-print pointer-events-none">
           <div className="bg-black/50 text-white text-[10px] px-2 py-1 rounded">Click to change</div>
        </div>
      )}
    </div>
  );
};