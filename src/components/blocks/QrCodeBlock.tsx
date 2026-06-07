import { useResumeStore } from '../../store/useResumeStore';
import type { QrCodeBlock as QrCodeBlockType } from '../../types/resume';

export default ({ id }: { id: string }) => {
  const block = useResumeStore(state => state.resume.blocks[id]) as QrCodeBlockType;
  const updateBlock = useResumeStore(state => state.updateBlock);

  if (!block || block.type !== 'qr_code') return null;

  const { url, label } = block.data;

  // We use a free API for generating the QR code image for simplicity in this prototype.
  // In a real app, you might use a client-side library like qrcode.react.
  const qrImageUrl = url ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}` : '';

  return (
    <div className="flex flex-col items-center gap-2 py-2">
      {qrImageUrl ? (
        <img src={qrImageUrl} alt="QR Code" className="w-24 h-24 mix-blend-multiply" />
      ) : (
        <div className="w-24 h-24 bg-gray-100 border border-gray-200 flex items-center justify-center">
           <span className="text-[10px] text-gray-400">QR Code</span>
        </div>
      )}
      
      <input 
        type="text" 
        value={url} 
        onChange={(e) => updateBlock(id, { url: e.target.value })}
        placeholder="https://your-link.com"
        className="text-[10px] text-center bg-transparent border-b border-gray-200 focus:border-blue-400 outline-none w-32 pb-0.5 text-gray-500 hover:text-gray-900 transition-colors"
      />
      {label !== undefined && (
         <input 
           type="text" 
           value={label} 
           onChange={(e) => updateBlock(id, { label: e.target.value })}
           placeholder="Label (optional)"
           className="text-[10px] font-medium text-center bg-transparent border-none outline-none w-32 text-gray-700"
         />
      )}
    </div>
  );
};