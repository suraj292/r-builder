import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { RichText } from '../shared/RichText';
import { cn } from '../../lib/utils';

interface TextBlockProps {
  id: string;
  content: string;
  variant: 'p' | 'h1' | 'h2' | 'h3';
}

const TextBlock: React.FC<TextBlockProps> = ({ id, content, variant }) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);

  return (
    <div className="py-1">
      <RichText
        value={content}
        onChange={(val) => updateBlock(id, { content: val })}
        tagName={variant}
        className={cn(
          variant === 'p' && 'text-sm leading-relaxed',
          variant === 'h1' && 'text-2xl font-bold',
          variant === 'h2' && 'text-xl font-semibold border-b pb-1 mb-2',
          variant === 'h3' && 'text-lg font-medium'
        )}
        style={{
          color: variant === 'p' ? 'var(--theme-text-primary)' : 'var(--theme-secondary)',
          fontFamily: variant === 'p' ? 'var(--theme-font-body)' : 'var(--theme-font-heading)',
          borderColor: 'var(--theme-border)',
        }}
        placeholder="Type something..."
      />
    </div>
  );
};

export default TextBlock;

