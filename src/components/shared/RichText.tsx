import { useRef, useEffect } from 'react';
import type { ElementType } from 'react';
import { cn } from '../../lib/utils';

interface RichTextProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  tagName?: ElementType;
  style?: React.CSSProperties;
}

export const RichText: React.FC<RichTextProps> = ({
  value,
  onChange,
  placeholder,
  className,
  tagName: Tag = 'div',
  style,
}) => {
  const ref = useRef<HTMLElement>(null);

  // Sync value from props to DOM only if it's different to avoid cursor jumps
  useEffect(() => {
    if (ref.current && ref.current.innerText !== value) {
      ref.current.innerText = value;
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    onChange(e.currentTarget.innerText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && Tag !== 'div' && Tag !== 'p') {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    }
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={cn(
        'outline-none focus:ring-1 focus:ring-blue-400/50 rounded-sm transition-all',
        !value && 'after:content-[attr(data-placeholder)] after:text-gray-400',
        className
      )}
      style={style}
      data-placeholder={placeholder}
    />
  );
};
