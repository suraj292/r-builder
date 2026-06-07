import { useResumeStore } from '../../store/useResumeStore';
import type { SkillChartBlock as SkillChartBlockType } from '../../types/resume';
import { cn } from '../../lib/utils';

export default ({ id }: { id: string }) => {
  const block = useResumeStore(state => state.resume.blocks[id]) as SkillChartBlockType;
  const updateBlock = useResumeStore(state => state.updateBlock);

  if (!block || block.type !== 'skill_chart') return null;

  const { skills, chartType, color } = block.data;
  const activeColor = color || 'var(--primary-color)';

  const handleLevelChange = (index: number, newLevel: number) => {
    const newSkills = [...skills];
    newSkills[index].level = newLevel;
    updateBlock(id, { skills: newSkills });
  };

  const handleNameChange = (index: number, newName: string) => {
    const newSkills = [...skills];
    newSkills[index].name = newName;
    updateBlock(id, { skills: newSkills });
  };

  return (
    <div className="py-2 flex flex-col gap-3">
      {skills.map((skill, idx) => (
        <div key={idx} className="flex flex-col gap-1 group/skill relative">
          <div className="flex justify-between items-center text-sm font-medium" style={{ color: 'var(--text-color)' }}>
            <input 
              type="text" 
              value={skill.name} 
              onChange={(e) => handleNameChange(idx, e.target.value)}
              className="bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 -ml-1"
            />
            <span className="text-xs opacity-50">{skill.level}%</span>
          </div>

          {chartType === 'bar' && (
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden flex relative group/bar">
              <div 
                className="h-full transition-all duration-300 rounded-full" 
                style={{ width: `${skill.level}%`, backgroundColor: activeColor }} 
              />
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={skill.level} 
                onChange={(e) => handleLevelChange(idx, parseInt(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize"
              />
            </div>
          )}

          {chartType === 'dots' && (
            <div className="flex gap-1 relative group/dots">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={cn("w-3 h-3 rounded-full transition-colors", (i + 1) * 20 <= skill.level ? "bg-opacity-100" : "bg-opacity-20")}
                  style={{ backgroundColor: activeColor }}
                />
              ))}
              <input 
                type="range" 
                min="0" 
                max="100" 
                step="20"
                value={skill.level} 
                onChange={(e) => handleLevelChange(idx, parseInt(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize"
              />
            </div>
          )}
        </div>
      ))}
      <button 
        onClick={() => updateBlock(id, { skills: [...skills, { name: 'New Skill', level: 50 }] })}
        className="text-[10px] text-gray-400 hover:text-blue-500 self-start mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        + Add Skill
      </button>
    </div>
  );
};