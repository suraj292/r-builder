import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { RichText } from '../shared/RichText';
import { TEMPLATE_REGISTRY } from '../../templates/registry';
import { cn } from '../../lib/utils';

interface ExperienceItemBlockProps {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

const ExperienceItemBlock: React.FC<ExperienceItemBlockProps> = ({
  id,
  company,
  role,
  location,
  startDate,
  endDate,
  description,
}) => {
  const updateBlock = useResumeStore((state) => state.updateBlock);
  const templateId = useResumeStore((state) => state.resume.metadata.templateId);
  const template = TEMPLATE_REGISTRY[templateId] || TEMPLATE_REGISTRY['modern-professional'];
  
  const style = template.blocks.experienceStyle;

  return (
    <div 
      className={cn(
        "py-2 group",
        style === 'card' && "bg-[var(--theme-surface)] p-4 rounded-xl border border-[var(--theme-border)] shadow-sm",
        style === 'bordered' && "border-l-4 border-[var(--theme-primary)] pl-4",
        style === 'timeline' && "relative pl-6 before:absolute before:left-0 before:top-4 before:bottom-0 before:w-px before:bg-[var(--theme-border)] after:absolute after:left-[-4px] after:top-4 after:w-2 after:h-2 after:rounded-full after:bg-[var(--theme-primary)]"
      )} 
      style={{ marginBottom: 'var(--theme-item-gap)' }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <RichText
            value={role}
            onChange={(val) => updateBlock(id, { role: val })}
            tagName="h3"
            className="text-md font-bold"
            style={{ color: 'var(--theme-text-primary)', fontFamily: 'var(--theme-font-heading)' }}
            placeholder="Role Name"
          />
          <RichText
            value={company}
            onChange={(val) => updateBlock(id, { company: val })}
            tagName="p"
            className="text-sm font-semibold"
            style={{ color: 'var(--theme-primary)' }}
            placeholder="Company Name"
          />
        </div>
        <div className="text-right" style={{ color: 'var(--theme-text-secondary)' }}>
          <div className="flex items-center justify-end gap-1 text-sm font-medium">
            <RichText
              value={startDate}
              onChange={(val) => updateBlock(id, { startDate: val })}
              placeholder="Start"
            />
            <span>–</span>
            <RichText
              value={endDate}
              onChange={(val) => updateBlock(id, { endDate: val })}
              placeholder="End"
            />
          </div>
          <RichText
            value={location}
            onChange={(val) => updateBlock(id, { location: val })}
            tagName="p"
            className="text-xs italic"
            placeholder="Location"
          />
        </div>
      </div>
      <RichText
        value={description}
        onChange={(val) => updateBlock(id, { description: val })}
        tagName="div"
        className="text-sm mt-1 leading-normal whitespace-pre-wrap"
        style={{ color: 'var(--theme-text-primary)' }}
        placeholder="Job description and achievements..."
      />
    </div>
  );
};

export default ExperienceItemBlock;
