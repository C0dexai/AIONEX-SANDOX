import React from 'react';
import { LayoutIcon } from './Icons';

export interface LayoutTemplateData {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js?: string;
}

const vegasBg = `
  background-image: linear-gradient(rgba(18, 18, 18, 0.7), rgba(18, 18, 18, 0.9)), url('https://images.unsplash.com/photo-1583311894928-857e4a1a0b3c?q=80&w=2574&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

const glassEffect = `
  background: rgba(28, 28, 30, 0.55);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  color: #EAEAEA;
`;

const layouts: LayoutTemplateData[] = [
    {
        id: 'holy-grail',
        name: 'Holy Grail',
        description: 'Classic 3-column responsive layout with a header and footer.',
        html: `
<header class="header">Header</header>
<div class="container">
  <main class="main-content">
    <h2>Main Content</h2>
    <p>This is the main area for content. It will adapt to different screen sizes.</p>
  </main>
  <aside class="sidebar-left">Left Sidebar</aside>
  <aside class="sidebar-right">Right Sidebar</aside>
</div>
<footer class="footer">Footer</footer>`,
        css: `
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: sans-serif;
  color: #EAEAEA;
}
body {
  display: flex;
  flex-direction: column;
  ${vegasBg}
}
.header, .footer, .main-content, .sidebar-left, .sidebar-right {
  ${glassEffect}
  padding: 1rem;
}
.header, .footer {
  text-align: center;
  flex-shrink: 0;
}
.container {
  display: grid;
  grid-template-areas:
    "left main right";
  grid-template-columns: 1fr 2.5fr 1fr;
  gap: 1rem;
  padding: 1rem;
  flex-grow: 1;
}
.main-content { grid-area: main; }
.sidebar-left { grid-area: left; }
.sidebar-right { grid-area: right; }
/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    grid-template-areas:
      "main"
      "left"
      "right";
    grid-template-columns: 1fr;
  }
}
`
    },
    {
        id: 'dashboard-shell',
        name: 'Dashboard Shell',
        description: 'A common application layout with a fixed sidebar and main content area.',
        html: `
<div class="dashboard-container">
  <aside class="dashboard-sidebar">
    <h2>Dashboard</h2>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Analytics</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
  </aside>
  <main class="dashboard-main">
    <h1>Welcome, User!</h1>
    <div class="content-card">Your dashboard content here.</div>
  </main>
</div>`,
        css: `
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: sans-serif;
  color: #EAEAEA;
  ${vegasBg}
}
.dashboard-container {
  display: flex;
  height: 100%;
}
.dashboard-sidebar {
  width: 240px;
  padding: 1.5rem;
  flex-shrink: 0;
  ${glassEffect}
}
.dashboard-sidebar h2 { margin-top: 0; }
.dashboard-sidebar nav ul { list-style: none; padding: 0; }
.dashboard-sidebar nav li { margin-bottom: 1rem; }
.dashboard-sidebar nav a { color: #aeb9c6; text-decoration: none; transition: color 0.2s; }
.dashboard-sidebar nav a:hover { color: #fff; }
.dashboard-main {
  flex-grow: 1;
  padding: 2rem;
  overflow-y: auto;
}
.content-card {
  margin-top: 2rem;
  padding: 1.5rem;
  ${glassEffect}
}
@media (max-width: 768px) {
    .dashboard-container { flex-direction: column; }
    .dashboard-sidebar { width: 100%; height: auto; }
}
`
    },
    {
        id: 'grid-gallery',
        name: 'Grid Gallery',
        description: 'A responsive image gallery using CSS Grid and populated via Fetch API.',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CSS Grid Gallery</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
      <h1>CSS Grid Gallery</h1>
      <p>Content loaded from a remote API.</p>
    </header>
    <main>
      <div id="gallery-container" class="grid-container">
        <p class="loading">Loading images...</p>
      </div>
    </main>
    <script src="script.js"></script>
</body>
</html>`,
        css: `body {
  font-family: sans-serif;
  color: #f0f0f0;
  margin: 0;
  ${vegasBg}
}
header {
  text-align: center;
  padding: 2rem;
  margin: 1rem;
  ${glassEffect}
}
main {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
.grid-item {
  text-align: center;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  overflow: hidden;
  ${glassEffect}
}
.grid-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.3);
}
.grid-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}
.grid-item p {
  padding: 0.75rem;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}
.loading {
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  ${glassEffect}
}`,
        js: `document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.getElementById('gallery-container');

  fetch('https://jsonplaceholder.typicode.com/photos?_limit=12')
    .then(response => {
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }
      return response.json();
    })
    .then(photos => {
      gallery.innerHTML = ''; // Clear loading message
      photos.forEach(photo => {
        const item = document.createElement('div');
        item.className = 'grid-item';
        
        const img = document.createElement('img');
        img.src = photo.thumbnailUrl;
        img.alt = photo.title;
        
        const title = document.createElement('p');
        title.textContent = photo.title;
        
        item.appendChild(img);
        item.appendChild(title);
        gallery.appendChild(item);
      });
    })
    .catch(error => {
      gallery.innerHTML = \`<p class="loading" style="color: #f87171;">Error: \${error.message}</p>\`;
      console.error('Error fetching gallery data:', error);
    });
});`
    },
    {
        id: 'crud-table',
        name: 'CRUD Table Page',
        description: 'A layout for a data table, perfect for CRUD apps. Data loaded via Fetch.',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CRUD Table</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
      <header class="page-header">
        <h1>User Management</h1>
        <button class="add-btn">Add User</button>
      </header>
      <div class="table-container">
        <table id="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr><td colspan="4" class="status-cell">Loading users...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        css: `body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #E5E7EB;
  padding: 2rem;
  ${vegasBg}
}
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  ${glassEffect}
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  padding-bottom: 1.5rem;
}
.add-btn {
  background-color: #10B981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}
.add-btn:hover { background-color: #059669; }
.table-container { width: 100%; overflow-x: auto; }
#user-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
#user-table th, #user-table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
#user-table th {
  background-color: rgba(255,255,255,0.1);
  font-weight: 600;
}
#user-table tbody tr {
  transition: background-color 0.2s;
}
#user-table tbody tr:hover {
  background-color: rgba(255,255,255,0.05);
}
.action-btn {
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 0.8rem;
  transition: opacity 0.2s;
}
.action-btn:hover { opacity: 0.8; }
.edit-btn { background-color: #3B82F6; color: white; }
.delete-btn { background-color: #EF4444; color: white; }
.status-cell { text-align: center; color: #9CA3AF; }
`,
        js: `document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#user-table tbody');

  fetch('https://jsonplaceholder.typicode.com/users?_limit=8')
    .then(response => {
      if (!response.ok) throw new Error('Network request failed');
      return response.json();
    })
    .then(users => {
      tableBody.innerHTML = ''; // Clear loading message
      users.forEach(user => {
        const row = tableBody.insertRow();
        row.innerHTML = \`
          <td>\${user.id}</td>
          <td>\${user.name}</td>
          <td><a href="mailto:\${user.email}" class="email-link">\${user.email}</a></td>
          <td>
            <button class="action-btn edit-btn">Edit</button>
            <button class="action-btn delete-btn">Delete</button>
          </td>
        \`;
      });
    })
    .catch(error => {
      tableBody.innerHTML = '<tr><td colspan="4" class="status-cell" style="color: #f87171;">Failed to load data.</td></tr>';
      console.error('Error fetching user data:', error);
    });
});`
    },
    {
        id: 'sticky-header-footer',
        name: 'Sticky Header/Footer',
        description: 'A layout where the header and footer stick to the top and bottom.',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sticky Layout</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="page-container">
      <header class="page-header">
        <h1>Sticky Header</h1>
        <nav>
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>
      <main class="page-main">
        <h2>Main Content Area</h2>
        <p>This area will scroll independently of the header and footer.</p>
        <button id="load-content">Load Post from API</button>
        <div id="content-target" class="content-box">Click the button above.</div>
        <h3>Placeholder Content</h3>
        <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
        <p>Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis.</p>
      </main>
      <footer class="page-footer">
        <p>&copy; 2024 Sticky Footer Inc.</p>
      </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        css: `html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: sans-serif;
  color: #EAEAEA;
  ${vegasBg}
}
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: transparent;
}
.page-header, .page-footer {
  flex-shrink: 0;
  padding: 1rem 1.5rem;
  z-index: 10;
  ${glassEffect}
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-header h1 { margin: 0; font-size: 1.5rem; }
.page-header nav a { color: #CBD5E0; margin-left: 1.5rem; text-decoration: none; }
.page-main {
  flex-grow: 1;
  overflow-y: auto;
  padding: 2rem;
}
.content-box {
  padding: 1.5rem;
  margin: 1rem 0;
  min-height: 50px;
  ${glassEffect}
}
.page-footer {
  text-align: center;
}
.page-footer p { margin: 0; }
button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}
`,
        js: `document.getElementById('load-content').addEventListener('click', () => {
  const target = document.getElementById('content-target');
  target.textContent = 'Loading...';

  fetch('https://jsonplaceholder.typicode.com/posts/1')
    .then(response => {
      if (!response.ok) throw new Error('API request failed');
      return response.json();
    })
    .then(post => {
      target.innerHTML = \`
        <h3>\${post.title}</h3>
        <p>\${post.body}</p>
      \`;
    })
    .catch(error => {
      target.textContent = 'Failed to load content.';
      console.error('Error fetching post:', error);
    });
});`
    },
];


const LayoutPreview: React.FC<{ layout: LayoutTemplateData }> = ({ layout }) => {
    // This is a simplified visual representation.
    const getPreviewStructure = () => {
        switch(layout.id) {
            case 'holy-grail':
                return (
                    <div className="flex flex-col w-full h-full bg-gray-200">
                        <div className="h-2 bg-gray-500 flex-shrink-0"></div>
                        <div className="flex-grow flex gap-1 p-1">
                            <div className="w-3 bg-gray-400"></div>
                            <div className="flex-grow bg-gray-100"></div>
                            <div className="w-3 bg-gray-400"></div>
                        </div>
                        <div className="h-2 bg-gray-500 flex-shrink-0"></div>
                    </div>
                );
            case 'dashboard-shell':
                return (
                    <div className="flex w-full h-full bg-gray-200">
                        <div className="w-4 bg-gray-600"></div>
                        <div className="flex-grow bg-gray-100 p-1"></div>
                    </div>
                );
            case 'grid-gallery':
                 return (
                    <div className="flex flex-col w-full h-full bg-gray-700">
                        <div className="h-2 bg-gray-600 flex-shrink-0"></div>
                        <div className="flex-grow grid grid-cols-3 gap-0.5 p-0.5">
                            <div className="bg-gray-500"></div>
                            <div className="bg-gray-500"></div>
                            <div className="bg-gray-500"></div>
                            <div className="bg-gray-500"></div>
                            <div className="bg-gray-500"></div>
                            <div className="bg-gray-500"></div>
                        </div>
                    </div>
                );
            case 'crud-table':
                return (
                    <div className="flex flex-col w-full h-full bg-gray-700 p-1 gap-1">
                        <div className="h-2 bg-gray-600 rounded-sm"></div>
                        <div className="flex-grow bg-gray-500 rounded-sm"></div>
                    </div>
                );
            case 'sticky-header-footer':
                 return (
                    <div className="flex flex-col w-full h-full bg-gray-200">
                        <div className="h-2 bg-gray-500 flex-shrink-0"></div>
                        <div className="flex-grow bg-gray-100"></div>
                        <div className="h-2 bg-gray-600 flex-shrink-0"></div>
                    </div>
                );
            default:
                return <LayoutIcon className="w-8 h-8 text-gray-400" />
        }
    }
    return getPreviewStructure();
};

interface LayoutTemplatesProps {
    onLayoutSelect: (layout: LayoutTemplateData) => void;
}

const LayoutTemplates: React.FC<LayoutTemplatesProps> = ({ onLayoutSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-2">
            {layouts.map(layout => (
                 <div
                    key={layout.id}
                    onClick={() => onLayoutSelect(layout)}
                    className="flex flex-col items-center p-2 bg-black/20 hover:bg-black/40 rounded-md cursor-pointer transition-all duration-200 border border-transparent hover:border-[var(--neon-green)] hover:shadow-[0_0_8px_var(--neon-green)]"
                    title={`Apply ${layout.name} layout`}
                >
                    <div className="h-16 w-full bg-black/20 rounded-sm mb-2 overflow-hidden border border-gray-600">
                        <LayoutPreview layout={layout} />
                    </div>
                    <p className="text-xs text-center text-gray-300 font-semibold">{layout.name}</p>
                    <p className="text-[10px] text-center text-gray-400 mt-1 hidden lg:block">{layout.description}</p>
                </div>
            ))}
        </div>
    );
};

export default LayoutTemplates;