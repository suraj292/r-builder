import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { RichText } from '../shared/RichText';

interface SectionBlockProps {
  id: string;
  title: string;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ id, title }) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);

  return (
    <div className="mb-2">
      <RichText
        value={title}
        onChange={(val) => updateBlock(id, { title: val })}
        tagName="h2"
        className="text-lg font-[var(--heading-weight)] tracking-wider"
        style={{
          color: 'var(--theme-primary)',
          fontFamily: 'var(--theme-font-heading)',
          textTransform: 'var(--section-title-style)' as any,
          borderBottom: 'var(--section-title-border-bottom)',
          border: 'var(--section-title-border-all)',
          padding: 'var(--section-title-padding)',
        }}
        placeholder="Section Title"
      />
    </div>
  );
};

export default SectionBlock;
