import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import type { BadgeBlock as BadgeBlockType } from '../../types/resume';
import { cn } from '../../lib/utils';
import { Award, Star, CheckCircle, Zap } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  award: <Award className="w-3.5 h-3.5" />,
  star: <Star className="w-3.5 h-3.5" />,
  check: <CheckCircle className="w-3.5 h-3.5" />,
  zap: <Zap className="w-3.5 h-3.5" />,
};

export default ({ id }: { id: string }) => {
  const block = useResumeStore(state => state.resume.blocks[id]) as BadgeBlockType;
  const updateBlock = useResumeStore(state => state.updateBlock);

  if (!block || block.type !== 'badge') return null;

  const { text, icon, style } = block.data;

  return (
    <div className="py-1 flex">
      <div className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide transition-all",
        style === 'solid' && "bg-[var(--primary-color)] text-white shadow-sm",
        style === 'outline' && "border-2 border-[var(--primary-color)] text-[var(--primary-color)] bg-transparent",
        style === 'soft' && "bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
      )}>
        {icon && ICONS[icon]}
        <input
          type="text"
          value={text}
          onChange={(e) => updateBlock(id, { text: e.target.value })}
          className="bg-transparent border-none outline-none focus:ring-1 focus:ring-white/50 rounded -mx-1 px-1 w-[80px]"
          placeholder="Badge text"
        />
      </div>
    </div>
  );
};