import React from 'react';
import type { AjaxTemplate } from '../types';
import { ajaxTemplates } from '../services/ajaxTemplates';
import { ServerIcon } from './Icons';

interface AjaxTemplatesProps {
    onTemplateSelect: (template: AjaxTemplate) => void;
}

const AjaxTemplates: React.FC<AjaxTemplatesProps> = ({ onTemplateSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-2">
            {ajaxTemplates.map(template => (
                 <div
                    key={template.id}
                    onClick={() => onTemplateSelect(template)}
                    className="flex flex-col items-center p-2 bg-black/20 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-200 border border-transparent hover:border-[var(--neon-green)] hover:shadow-[0_0_8px_var(--neon-green)]"
                    title={`Apply ${template.name} template`}
                >
                    <div className="h-10 w-10 flex items-center justify-center bg-black/20 rounded-sm mb-2 border border-gray-600">
                        <ServerIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-xs text-center text-gray-300 font-semibold">{template.name}</p>
                    <p className="text-[10px] text-center text-gray-400 mt-1 hidden lg:block">{template.description}</p>
                </div>
            ))}
        </div>
    );
};

export default AjaxTemplates;