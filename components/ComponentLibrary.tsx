import React from 'react';
import type { DraggableComponent } from '../types';
import { 
    HeadingIcon, ParagraphIcon, ButtonIcon, ImageIcon, ContainerIcon, LinkIcon, 
    InputIcon, ListIcon, IconProps, FormIcon, PasswordIcon, TextareaIcon, 
    CheckboxIcon, RadioButtonIcon, DropdownIcon 
} from './Icons';

interface ComponentCategory {
    name: string;
    components: (DraggableComponent & { icon: React.ReactElement<IconProps> })[];
}

const componentCategories: ComponentCategory[] = [
    {
        name: "Layout",
        components: [
            { id: 'container', name: 'Container', icon: <ContainerIcon />, html: '<div class="p-4 border border-dashed my-2 border-gray-600 rounded-lg">\n  <!-- Drop other components here -->\n</div>' },
            { id: 'form', name: 'Form', icon: <FormIcon />, html: '<form class="space-y-6 p-4 border border-gray-700 rounded-lg my-2">\n  \n</form>' }
        ]
    },
    {
        name: "Content",
        components: [
            { id: 'heading', name: 'Heading', icon: <HeadingIcon />, html: '<h1 class="text-2xl font-bold my-4" contenteditable="true">New Heading</h1>' },
            { id: 'paragraph', name: 'Paragraph', icon: <ParagraphIcon />, html: '<p class="my-2" contenteditable="true">This is a new paragraph. You can edit this text.</p>' },
            { id: 'link', name: 'Link', icon: <LinkIcon />, html: '<a href="#" class="text-blue-400 hover:underline my-2" contenteditable="true">This is a link</a>' },
            { id: 'list', name: 'List', icon: <ListIcon />, html: '<ul class="list-disc list-inside my-2 space-y-1 text-gray-300">\n  <li contenteditable="true">List item 1</li>\n  <li contenteditable="true">List item 2</li>\n</ul>' },
        ]
    },
    {
        name: 'Form Controls',
        components: [
            { id: 'text-input', name: 'Text Input', icon: <InputIcon />, html: `<div class="my-2">\n  <label for="text-input" class="block mb-2 text-sm font-medium text-gray-300">Your Name</label>\n  <input type="text" id="text-input" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="John Doe" required>\n</div>` },
            { id: 'password-input', name: 'Password', icon: <PasswordIcon />, html: `<div class="my-2">\n  <label for="password-input" class="block mb-2 text-sm font-medium text-gray-300">Password</label>\n  <input type="password" id="password-input" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="••••••••" required>\n</div>` },
            { id: 'textarea', name: 'Text Area', icon: <TextareaIcon />, html: `<div class="my-2">\n  <label for="message" class="block mb-2 text-sm font-medium text-gray-300">Your message</label>\n  <textarea id="message" rows="4" class="block p-2.5 w-full text-sm text-white bg-gray-700 rounded-lg border border-gray-600 focus:ring-blue-500 focus:border-blue-500" placeholder="Leave a comment..."></textarea>\n</div>` },
            { id: 'checkbox', name: 'Checkbox', icon: <CheckboxIcon />, html: `<div class="flex items-center my-2">\n  <input id="remember" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2">\n  <label for="remember" class="ml-2 text-sm font-medium text-gray-300">Remember me</label>\n</div>` },
            { id: 'radio-group', name: 'Radio Group', icon: <RadioButtonIcon />, html: `<fieldset class="my-2">\n  <legend class="text-sm font-medium text-gray-300 mb-2">Choose an option</legend>\n  <div class="flex items-center mb-2">\n    <input id="radio-1" type="radio" name="radios" value="option1" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2" checked>\n    <label for="radio-1" class="ml-2 text-sm font-medium text-gray-300">Option 1</label>\n  </div>\n  <div class="flex items-center">\n    <input id="radio-2" type="radio" name="radios" value="option2" class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2">\n    <label for="radio-2" class="ml-2 text-sm font-medium text-gray-300">Option 2</label>\n  </div>\n</fieldset>`},
            { id: 'dropdown', name: 'Dropdown', icon: <DropdownIcon />, html: `<div class="my-2">\n  <label for="countries" class="block mb-2 text-sm font-medium text-gray-300">Select an option</label>\n  <select id="countries" class="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">\n    <option selected>Choose an option</option>\n    <option value="1">Option 1</option>\n    <option value="2">Option 2</option>\n    <option value="3">Option 3</option>\n  </select>\n</div>`},
            { id: 'submit-button', name: 'Submit Button', icon: <ButtonIcon />, html: '<button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center my-2">Submit</button>' },
        ]
    },
    {
        name: "Media",
        components: [
             { id: 'image', name: 'Image', icon: <ImageIcon />, html: '<img src="https://via.placeholder.com/150" alt="placeholder image" class="my-2 rounded-lg">' },
        ]
    }
];

interface ComponentLibraryProps {
    onDragStart: () => void;
    onDragEnd: () => void;
    onComponentClick: (component: DraggableComponent) => void;
}

const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onDragStart, onDragEnd, onComponentClick }) => {
    const DATA_TYPE = 'application/vnd.live-dev-sandbox.component+json';

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, component: DraggableComponent) => {
        onDragStart();
        e.dataTransfer.setData(DATA_TYPE, JSON.stringify(component));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div className="space-y-4">
            {componentCategories.map(category => (
                <div key={category.name}>
                    <h4 className="text-sm font-semibold text-[var(--neon-blue)] mb-2 px-1">{category.name}</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {category.components.map(component => {
                            const draggableComponent: DraggableComponent = {
                                id: component.id,
                                name: component.name,
                                html: component.html,
                            };
                            return (
                                <div
                                    key={component.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, draggableComponent)}
                                    onDragEnd={onDragEnd}
                                    onClick={() => onComponentClick(draggableComponent)}
                                    className="flex flex-col items-center justify-center p-3 bg-black/20 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-200 border border-transparent hover:border-[var(--neon-pink)] hover:shadow-[0_0_8px_var(--neon-pink)]"
                                    title={`Click or Drag to add ${component.name}`}
                                >
                                    <div className="h-6 w-6 text-gray-300 mb-1">
                                        {React.cloneElement(component.icon, { className: 'h-full w-full' })}
                                    </div>
                                    <p className="text-xs text-center text-gray-300">{component.name}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ComponentLibrary;