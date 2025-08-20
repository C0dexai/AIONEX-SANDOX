import type { FileSystemState, TemplateRegistry, HandoverLog } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const registry: TemplateRegistry = {
  TEMPLATES: {
    REACT: { path: "./react-vite", tags: ["spa", "frontend", "vite"], description: 'A modern React setup.' },
    VANILLA: { path: "./vanilla", tags: ["basic", "javascript"], description: 'A classic HTML, CSS, JS setup.' }
  },
  UI: {
    TAILWIND: { path: "./tailwind-css", tags: ["styles", "utility-css"], description: 'Utility-first CSS.' },
  },
  DATASTORE: {
    // Future expansion
  }
};

const templates: Record<string, FileSystemState> = {
    VANILLA: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vanilla JS App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Welcome to the Vanilla App!</h1>
    <p>Edit script.js to add functionality.</p>
    <div id="app"></div>
    <script src="script.js"></script>
</body>
</html>`,
        '/style.css': `body {
    font-family: sans-serif;
    background-color: #1a1a1a;
    color: #f0f0f0;
    text-align: center;
    padding: 2rem;
}`,
        '/script.js': `console.log("Hello from script.js!");
document.getElementById('app').textContent = 'JavaScript is running.';`
    },
    REACT: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React TSX App</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="root"></div>
    <script type="text/babel" data-presets="react,typescript" src="app.tsx"></script>
</body>
</html>`,
        '/style.css': `body {
    font-family: sans-serif;
    background-color: #1a1a1a;
    color: #f0f0f0;
    margin: 0;
    padding: 2rem;
}`,
        '/app.tsx': `
declare var React: any;
declare var ReactDOM: any;

const App: React.FC = () => {
    const [count, setCount] = React.useState<number>(0);

    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Hello from React with TypeScript!</h1>
            <p className="mb-4">You clicked {count} times</p>
            <button 
                onClick={() => setCount(count + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Click me
            </button>
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
}
`
    },
    TAILWIND: {
        '/index.html': `<script src="https://cdn.tailwindcss.com"></script>`
    }
};

export const createContainer = (
    operator: string, 
    prompt: string, 
    selectedTemplates: { base: string, ui: string[], datastore: string | null },
    environment?: Record<string, string>
): { newFiles: FileSystemState, rootPath: string } => {
    const containerId = `container_${uuidv4()}`;
    const rootPath = `/containers/${containerId}`;
    let mergedFiles: FileSystemState = {};

    // 1. Add base template files
    const baseTemplateFiles = templates[selectedTemplates.base] || {};
    for (const [path, content] of Object.entries(baseTemplateFiles)) {
        mergedFiles[`${rootPath}${path}`] = content;
    }

    // 2. Merge UI templates
    for (const uiKey of selectedTemplates.ui) {
        const uiTemplateFiles = templates[uiKey] || {};
        for (const [path, content] of Object.entries(uiTemplateFiles)) {
            const targetPath = `${rootPath}${path}`;
            if (path.endsWith('.html') && mergedFiles[targetPath]) {
                // Smart merge for HTML: inject content into <head>
                if (mergedFiles[targetPath].includes('</head>')) {
                     mergedFiles[targetPath] = mergedFiles[targetPath].replace('</head>', `  ${content}\n</head>`);
                } else {
                    // Fallback if no head tag found
                    mergedFiles[targetPath] += `\n${content}`;
                }
            } else {
                mergedFiles[targetPath] = content;
            }
        }
    }
    
    // 3. Create handover.json
    const now = new Date().toISOString();
    const handoverLog: HandoverLog = {
        container_id: containerId,
        operator: operator,
        prompt: prompt,
        chosen_templates: selectedTemplates,
        environment,
        status: "initialized",
        created_at: now,
        history: [
            {
                action: "create",
                by: operator,
                at: now,
                details: {
                    templates: selectedTemplates
                }
            },
            {
                action: "command",
                by: "system",
                at: now,
                details: {
                    command: "Simulated: npm install",
                    status: "success"
                }
            }
        ]
    };

    mergedFiles[`${rootPath}/handover.json`] = JSON.stringify(handoverLog, null, 2);

    return { newFiles: mergedFiles, rootPath };
};