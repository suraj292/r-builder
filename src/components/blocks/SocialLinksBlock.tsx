import { useResumeStore } from '../../store/useResumeStore';
import type { SocialLinksBlock as SocialLinksBlockType } from '../../types/resume';
import { Globe, Link } from 'lucide-react';

const ICONS: Record<string, React.ElementType> = {
  github: Link,
  linkedin: Link,
  twitter: Link,
  dribbble: Link,
  globe: Globe,
};

export default ({ id }: { id: string }) => {
  const block = useResumeStore(state => state.resume.blocks[id]) as SocialLinksBlockType;
  const updateBlock = useResumeStore(state => state.updateBlock);

  if (!block || block.type !== 'social_links') return null;

  const { links, displayMode } = block.data;

  const handleLinkChange = (index: number, handle: string) => {
    const newLinks = [...links];
    newLinks[index].handle = handle;
    updateBlock(id, { links: newLinks });
  };

  return (
    <div className="py-2 flex flex-wrap gap-4">
      {links.map((link, idx) => {
        const Icon = ICONS[link.platform] || Globe;
        return (
          <div key={idx} className="flex items-center gap-1.5 text-[var(--text-color)] group/social">
            <Icon className="w-4 h-4 text-[var(--primary-color)]" />
            {displayMode === 'icon-text' && (
              <input
                type="text"
                value={link.handle}
                onChange={(e) => handleLinkChange(idx, e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-medium focus:border-b focus:border-blue-400 w-24"
              />
            )}
          </div>
        );
      })}
      <button 
        onClick={() => updateBlock(id, { links: [...links, { platform: 'globe', url: '#', handle: 'new.link' }] })}
        className="text-[10px] text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
      >
        + Add
      </button>
    </div>
  );
};