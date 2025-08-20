import type { AjaxTemplate } from '../types';

const vegasBg = `
  background-image: linear-gradient(rgba(18, 18, 18, 0.7), rgba(18, 18, 18, 0.9)), url('https://images.unsplash.com/photo-1583311894928-857e4a1a0b3c?q=80&w=2574&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
`;

const glassEffect = (blur = 10) => `
  background: rgba(28, 28, 30, 0.65);
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

const commonStyle = `
body { 
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #E5E7EB;
  padding: 2rem;
  text-align: center;
  ${vegasBg}
}
button {
  ${glassEffect(10)}
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: rgba(60, 60, 62, 0.75);
}
#output {
  ${glassEffect(15)}
  margin-top: 2rem;
  padding: 1.5rem;
  text-align: left;
  white-space: pre-wrap;
  font-family: monospace;
}
.error {
  color: #ef4444;
  border-color: #ef4444 !important;
}
`;

const fetchJsonTemplate: AjaxTemplate = {
    id: 'fetch-json',
    name: 'Fetch API (JSON)',
    description: 'Load and display JSON data using the modern Fetch API.',
    blockquote: 'This template demonstrates fetching local JSON data. You could now ask me to "style the output box with a neon border" or "add a more descriptive loading message".',
    files: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fetch JSON</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Fetch API with JSON</h1>
    <button id="load-data">Load User Data</button>
    <div id="output">Click the button to load data.</div>
    <script src="script.js"></script>
</body>
</html>`,
        '/script.js': `document.getElementById('load-data').addEventListener('click', () => {
    fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const output = document.getElementById('output');
            output.textContent = JSON.stringify(data, null, 2);
            output.classList.remove('error');
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            const output = document.getElementById('output');
            output.textContent = 'Error loading data: ' + error.message;
            output.classList.add('error');
        });
});`,
        '/style.css': commonStyle,
        '/data.json': `{
    "id": 1,
    "name": "Leanne Graham",
    "username": "Bret",
    "email": "Sincere@april.biz",
    "address": {
        "street": "Kulas Light",
        "suite": "Apt. 556",
        "city": "Gwenborough",
        "zipcode": "92998-3874"
    }
}`
    }
};

const xhrXmlTemplate: AjaxTemplate = {
    id: 'xhr-xml',
    name: 'XHR (XML)',
    description: 'Load and parse XML data using XMLHttpRequest.',
    blockquote: 'This template uses the classic XMLHttpRequest to fetch and parse an XML file. As a next step, you could ask me to "convert the output list to a styled table" or "handle XML parsing errors gracefully".',
    files: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>XHR XML</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>XMLHttpRequest with XML</h1>
    <button id="load-data">Load Plant Data</button>
    <div id="output">Click the button to load data.</div>
    <script src="script.js"></script>
</body>
</html>`,
        '/script.js': `document.getElementById('load-data').addEventListener('click', () => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './data.xml', true);

    xhr.onload = function() {
        if (this.status === 200) {
            const xmlDoc = this.responseXML;
            const plants = xmlDoc.getElementsByTagName('PLANT');
            let html = '<ul>';
            for (let i = 0; i < plants.length; i++) {
                const commonName = plants[i].getElementsByTagName('COMMON')[0].childNodes[0].nodeValue;
                const botanicalName = plants[i].getElementsByTagName('BOTANICAL')[0].childNodes[0].nodeValue;
                html += \`<li>\${commonName} (<em>\${botanicalName}</em>)</li>\`;
            }
            html += '</ul>';
            
            const output = document.getElementById('output');
            output.innerHTML = html;
            output.classList.remove('error');
        } else {
            console.error('Error loading XML');
            const output = document.getElementById('output');
            output.textContent = 'Error loading data. Status: ' + this.status;
            output.classList.add('error');
        }
    };
    
    xhr.onerror = function() {
        console.error('Request Error');
        const output = document.getElementById('output');
        output.textContent = 'Request failed.';
        output.classList.add('error');
    };

    xhr.send();
});`,
        '/style.css': commonStyle.replace('pre-wrap', 'normal'), // Allow ul/li to render correctly
        '/data.xml': `<?xml version="1.0" encoding="UTF-8"?>
<CATALOG>
    <PLANT>
        <COMMON>Bloodroot</COMMON>
        <BOTANICAL>Sanguinaria canadensis</BOTANICAL>
        <ZONE>4</ZONE>
        <LIGHT>Mostly Shady</LIGHT>
        <PRICE>$2.44</PRICE>
        <AVAILABILITY>031599</AVAILABILITY>
    </PLANT>
    <PLANT>
        <COMMON>Columbine</COMMON>
        <BOTANICAL>Aquilegia canadensis</BOTANICAL>
        <ZONE>3</ZONE>
        <LIGHT>Mostly Shady</LIGHT>
        <PRICE>$9.37</PRICE>
        <AVAILABILITY>030699</AVAILABILITY>
    </PLANT>
</CATALOG>`
    }
};

const fetchMarkdownTemplate: AjaxTemplate = {
    id: 'fetch-md',
    name: 'Fetch API (Text/MD)',
    description: 'Fetch a Markdown or text file and display its content.',
    blockquote: 'This template fetches a plain text file. You could ask me to "render the markdown as HTML using a library" or "fetch a different text file by its URL".',
    files: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fetch Markdown</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Fetch API with Markdown/Text</h1>
    <button id="load-data">Load Document</button>
    <div id="output">Click the button to load data.</div>
    <script src="script.js"></script>
</body>
</html>`,
        '/script.js': `document.getElementById('load-data').addEventListener('click', () => {
    fetch('./document.md')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(text => {
            const output = document.getElementById('output');
            output.textContent = text;
            output.classList.remove('error');
        })
        .catch(error => {
            const output = document.getElementById('output');
            output.textContent = 'Error: ' + error.message;
            output.classList.add('error');
        });
});`,
        '/style.css': commonStyle,
        '/document.md': `# Sample Document

This is a sample markdown file fetched from the server.

- It has list items.
- It demonstrates fetching plain text.

You could use a library like **marked** to render this as HTML.`
    }
};

const fetchYamlTemplate: AjaxTemplate = {
    id: 'fetch-yaml',
    name: 'Fetch API (YAML)',
    description: 'Load a YAML file and parse it using a third-party library.',
    blockquote: `We've loaded a template that fetches a YAML configuration file. Try asking me to "display only the database settings" or "add a new 'environment' key with the value 'development' to the config".`,
    files: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fetch YAML</title>
    <link rel="stylesheet" href="style.css">
    <!-- js-yaml library for parsing YAML -->
    <script src="https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js"></script>
</head>
<body>
    <h1>Fetch API with YAML</h1>
    <button id="load-data">Load Config</button>
    <div id="output">Click the button to load data.</div>
    <script src="script.js"></script>
</body>
</html>`,
        '/script.js': `document.getElementById('load-data').addEventListener('click', () => {
    // Check if jsyaml library is loaded
    if (typeof jsyaml === 'undefined') {
        const output = document.getElementById('output');
        output.textContent = 'Error: js-yaml library not found. Check the script tag in index.html.';
        output.classList.add('error');
        return;
    }

    fetch('./config.yaml')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(yamlText => {
            try {
                const data = jsyaml.load(yamlText);
                const output = document.getElementById('output');
                output.textContent = JSON.stringify(data, null, 2);
                output.classList.remove('error');
            } catch (e) {
                throw new Error('YAML parsing error: ' + e.message);
            }
        })
        .catch(error => {
            const output = document.getElementById('output');
            output.textContent = 'Error: ' + error.message;
            output.classList.add('error');
        });
});`,
        '/style.css': commonStyle,
        '/config.yaml': `
# Sample YAML configuration file
application:
  name: "My Awesome App"
  version: "1.2.3"
database:
  host: "localhost"
  port: 5432
  user: "admin"
features:
  - name: "User Authentication"
    enabled: true
  - name: "Data Export"
    enabled: false
`
    }
};

const fetchPostTemplate: AjaxTemplate = {
    id: 'fetch-post',
    name: 'Fetch API (POST)',
    description: 'Send data to a server using a POST request with Fetch API.',
    blockquote: `I've loaded a template that sends data with a POST request. Why not try asking me to "add validation to the input fields" or "change the button color on successful submission"?`,
    files: {
        '/index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fetch POST</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Fetch API - POST Request</h1>
    <form id="post-form">
        <input type="text" id="title" placeholder="Enter title" required>
        <textarea id="body" placeholder="Enter body" required></textarea>
        <button type="submit">Create Post</button>
    </form>
    <div id="output">Submit the form to create a new post.</div>
    <script src="script.js"></script>
</body>
</html>`,
        '/script.js': `document.getElementById('post-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const output = document.getElementById('output');

    output.textContent = 'Sending data...';
    output.classList.remove('error', 'success');

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            body: body,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        output.textContent = 'Post created successfully! Response:\\n' + JSON.stringify(data, null, 2);
        output.classList.add('success');
    })
    .catch(error => {
        console.error('Error:', error);
        output.textContent = 'Error creating post: ' + error.message;
        output.classList.add('error');
    });
});`,
        '/style.css': `
body { 
  font-family: system-ui, sans-serif;
  color: #E5E7EB;
  padding: 2rem;
  ${vegasBg}
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  ${glassEffect(15)}
  border-radius: 1rem;
}
input, textarea {
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(0, 0, 0, 0.2);
  color: #E5E7EB;
  font-size: 1rem;
}
textarea {
  min-height: 100px;
  resize: vertical;
}
button {
  background-color: rgba(16, 185, 129, 0.5);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
button:hover {
  background-color: rgba(16, 185, 129, 0.7);
}
#output {
  margin-top: 2rem;
  padding: 1.5rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
  white-space: pre-wrap;
  font-family: monospace;
  ${glassEffect(15)}
  border-radius: 1rem;
}
.error { color: #ef4444; border-color: #ef4444 !important; }
.success { color: #10b981; border-color: #10b981 !important; }`
    }
};


export const ajaxTemplates: AjaxTemplate[] = [
    fetchJsonTemplate,
    fetchPostTemplate,
    xhrXmlTemplate,
    fetchMarkdownTemplate,
    fetchYamlTemplate
];