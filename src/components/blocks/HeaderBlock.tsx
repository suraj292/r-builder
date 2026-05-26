import React, { useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { RichText } from '../shared/RichText';
import { Mail, Phone, MapPin, Globe, Upload, Trash } from 'lucide-react';
import { TEMPLATE_REGISTRY } from '../../templates/registry';

interface HeaderBlockProps {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  location?: string;
  website?: string;
  photoUrl?: string;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({
  id,
  name,
  title,
  email,
  phone,
  location,
  website,
  photoUrl,
}) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);
  const templateId = useResumeStore((state) => state.resume.metadata.templateId);
  const template = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['modern-professional'];
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBlock(id, { photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const align = template.blocks.headerAlignment;
  const showPhoto = template.photo.enabled;
  const photoShape = template.photo.shape === 'circle' ? '50%' : template.photo.shape === 'rounded' ? '12px' : '0';

  return (
    <div className="py-4" style={{ textAlign: align }}>
      <div className={`flex ${align === 'center' ? 'flex-col items-center' : align === 'right' ? 'flex-row-reverse justify-between' : 'flex-row justify-between'} gap-6`}>
        
        {/* Content Area */}
        <div className={`flex-1 ${align === 'center' ? 'flex flex-col items-center' : ''}`}>
          <RichText
            value={name}
            onChange={(val) => updateBlock(id, { name: val })}
            tagName="h1"
            className="text-3xl tracking-tight"
            style={{ color: 'var(--theme-text-primary)', fontFamily: 'var(--theme-font-heading)', fontWeight: 'var(--heading-weight)' }}
            placeholder="Your Name"
          />
          <RichText
            value={title}
            onChange={(val) => updateBlock(id, { title: val })}
            tagName="p"
            className="text-lg font-medium mt-1"
            style={{ color: 'var(--theme-primary)' }}
            placeholder="Job Title"
          />
          
          <div 
            className={`flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm ${align === 'center' ? 'justify-center' : ''}`}
            style={{ color: 'var(--theme-text-secondary)' }}
          >
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
              <RichText
                value={email}
                onChange={(val) => updateBlock(id, { email: val })}
                placeholder="email@example.com"
              />
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
              <RichText
                value={phone}
                onChange={(val) => updateBlock(id, { phone: val })}
                placeholder="+1 234 567 890"
              />
            </div>
            {location !== undefined && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
                <RichText
                  value={location}
                  onChange={(val) => updateBlock(id, { location: val })}
                  placeholder="City, Country"
                />
              </div>
            )}
            {website !== undefined && (
              <div className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
                <RichText
                  value={website}
                  onChange={(val) => updateBlock(id, { website: val })}
                  placeholder="portfolio.com"
                />
              </div>
            )}
          </div>
        </div>

        {/* Photo Area */}
        {showPhoto && (
          <div className="shrink-0 relative group">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handlePhotoUpload}
            />
            <div 
              className="w-24 h-24 bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center cursor-pointer relative"
              style={{ borderRadius: photoShape }}
              onClick={() => !photoUrl && fileInputRef.current?.click()}
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}

              {photoUrl && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity no-print">
                  <button 
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="p-1.5 bg-white text-gray-700 rounded-full hover:bg-gray-100"
                    title="Change Photo"
                  >
                    <Upload className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); updateBlock(id, { photoUrl: undefined }); }}
                    className="p-1.5 bg-white text-red-600 rounded-full hover:bg-red-50"
                    title="Remove Photo"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderBlock;
