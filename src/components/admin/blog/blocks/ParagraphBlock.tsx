import { useRef, useEffect } from 'react';

interface ParagraphBlockProps {
    data: { text: string };
    onChange: (data: any) => void;
}

export default function ParagraphBlock({ data, onChange }: ParagraphBlockProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '0px';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [data.text]);

    return (
        <textarea
            ref={textareaRef}
            value={data.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Type your content here..."
            className="w-full bg-transparent border-none focus:outline-none text-slate-600 leading-relaxed text-lg resize-none min-h-[1.5em] overflow-hidden"
        />
    );
}
