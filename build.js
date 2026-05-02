const fs = require('fs');
const path = require('path');

// Try to require marked, if not found, we'll provide a fallback or error
let marked;
try {
    marked = require('marked');
} catch (e) {
    console.error('Error: "marked" library not found. Please run "npm install marked" first.');
    process.exit(1);
}

const SOURCE_DIR = path.join(__dirname, 'Lerning');
const OUTPUT_DIR = path.join(__dirname, 'App');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

async function build() {
    console.log('🚀 Starting build process...');

    // 1. Read the Directory
    const files = fs.readdirSync(SOURCE_DIR)
        .filter(file => file.endsWith('.md'))
        .sort();

    const documentationData = [];

    // 2. Markdown Parsing
    files.forEach(file => {
        const filePath = path.join(SOURCE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Convert to HTML
        const htmlContent = marked.parse(content);
        
        // Extract title from filename (e.g., 01-Framework-Overview -> Framework Overview)
        const title = file
            .replace(/^\d+-/, '')
            .replace('.md', '')
            .replace(/-/g, ' ');

        documentationData.push({
            id: file.replace('.md', ''),
            title: title,
            content: htmlContent
        });
        
        console.log(`✅ Processed: ${file}`);
    });

    // 3. Generate Files

    // Generate styles.css
    const cssContent = `
:root {
    --primary-color: #6366f1;
    --primary-hover: #4f46e5;
    --bg-color: #0f172a;
    --sidebar-bg: #1e293b;
    --text-color: #e2e8f0;
    --text-muted: #94a3b8;
    --border-color: #334155;
    --code-bg: #1e293b;
    --sidebar-width: 300px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    display: flex;
    height: 100vh;
    overflow: hidden;
}

/* Sidebar Styling */
aside {
    width: var(--sidebar-width);
    background-color: var(--sidebar-bg);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.sidebar-header {
    padding: 2rem;
    border-bottom: 1px solid var(--border-color);
}

.sidebar-header h1 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-color);
    letter-spacing: -0.025em;
}

nav {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem 0;
}

.nav-item {
    display: block;
    padding: 0.75rem 2rem;
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.2s;
    border-left: 3px solid transparent;
}

.nav-item:hover {
    color: var(--text-color);
    background-color: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
    color: var(--primary-color);
    background-color: rgba(99, 102, 241, 0.1);
    border-left-color: var(--primary-color);
    font-weight: 600;
}

/* Main Content Styling */
main {
    flex: 1;
    overflow-y: auto;
    padding: 4rem 2rem;
    display: flex;
    justify-content: center;
}

#content {
    width: 100%;
    max-width: 800px;
    animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Markdown Elements Typography */
h1 { font-size: 2.5rem; margin-bottom: 2rem; color: #fff; }
h2 { font-size: 1.8rem; margin: 2.5rem 0 1.5rem; color: #fff; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; }
h3 { font-size: 1.3rem; margin: 2rem 0 1rem; color: #fff; }

p { margin-bottom: 1.25rem; }

ul, ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
li { margin-bottom: 0.5rem; }

code {
    background-color: var(--code-bg);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
}

pre {
    background-color: var(--code-bg);
    padding: 1.5rem;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 1.5rem;
    border: 1px solid var(--border-color);
}

pre code {
    background-color: transparent;
    padding: 0;
}

blockquote {
    border-left: 4px solid var(--primary-color);
    background-color: rgba(99, 102, 241, 0.05);
    padding: 1rem 1.5rem;
    margin-bottom: 1.5rem;
    font-style: italic;
    color: var(--text-muted);
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
}

th, td {
    border: 1px solid var(--border-color);
    padding: 0.75rem;
    text-align: left;
}

th {
    background-color: rgba(255, 255, 255, 0.05);
    font-weight: 600;
}

img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1.5rem 0;
}

/* Responsive */
@media (max-width: 768px) {
    body { flex-direction: column; }
    aside { width: 100%; height: auto; max-height: 300px; }
    .sidebar-header { padding: 1rem; }
    main { padding: 2rem 1rem; }
}
`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'styles.css'), cssContent);

    // Generate script.js
    const scriptContent = `
const documentationData = ${JSON.stringify(documentationData)};

document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('sidebar-nav');
    const contentArea = document.getElementById('content');

    // Load initial content
    if (documentationData.length > 0) {
        loadContent(documentationData[0].id);
    }

    // Function to load content
    function loadContent(id) {
        const item = documentationData.find(d => d.id === id);
        if (!item) return;

        // Update content
        contentArea.innerHTML = item.content;
        
        // Update URL hash without jumping
        window.history.pushState(null, null, '#' + id);

        // Update active state in sidebar
        document.querySelectorAll('.nav-item').forEach(link => {
            link.classList.toggle('active', link.dataset.id === id);
        });

        // Scroll content to top
        document.querySelector('main').scrollTop = 0;
        
        // Re-run code highlighting if needed (assuming highlight.js is present)
        if (window.hljs) {
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }

    // Add click listeners to sidebar links
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadContent(link.dataset.id);
        });
    });

    // Handle back/forward buttons
    window.addEventListener('popstate', () => {
        const id = window.location.hash.substring(1);
        if (id) loadContent(id);
    });
});
`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'script.js'), scriptContent);

    // Generate index.html
    const navHtml = documentationData.map(item => 
        `<a href="#${item.id}" class="nav-item" data-id="${item.id}">${item.title}</a>`
    ).join('\n            ');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Framework Documentation</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code&display=swap" rel="stylesheet">
    <!-- Highlight.js for code highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
</head>
<body>
    <aside>
        <div class="sidebar-header">
            <h1>🎭 Playwright Docs</h1>
        </div>
        <nav id="sidebar-nav">
            ${navHtml}
        </nav>
    </aside>

    <main>
        <article id="content">
            <!-- Content loaded dynamically -->
        </article>
    </main>

    <script src="script.js"></script>
</body>
</html>
`;
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), htmlContent);

    console.log('✨ Build complete! Open App/index.html to view your documentation.');
}

build().catch(err => {
    console.error('❌ Build failed:', err);
});
