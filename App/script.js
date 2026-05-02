document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-item');
    const contentArea = document.getElementById('content');

    // Configure marked options
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    async function loadMarkdown(filename) {
        try {
            contentArea.innerHTML = '<div class="loading">Loading content...</div>';
            
            // In a real scenario, we fetch the .md file. 
            // Note: If opening via file://, some browsers block local fetches.
            const response = await fetch(`../Lerning/${filename}`);
            if (!response.ok) throw new Error('File not found');
            
            const markdown = await response.text();
            
            // Render Markdown to HTML
            contentArea.innerHTML = marked.parse(markdown);
            
            // Trigger Highlight.js
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });

            // Scroll to top
            document.querySelector('main').scrollTop = 0;

        } catch (error) {
            console.error('Error loading markdown:', error);
            contentArea.innerHTML = `
                <div class="error-screen">
                    <h2>Oops! Could not load the content.</h2>
                    <p>This might be because you are opening the file directly from your disk (CORS restriction).</p>
                    <p>To view the full documentation, please run the <code>build.js</code> script or serve this folder using a local web server.</p>
                    <div class="code-box">npx serve App</div>
                </div>
            `;
        }
    }

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filename = link.getAttribute('href').substring(1);
            
            // Update UI
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Load content
            loadMarkdown(filename);
            
            // Update hash
            window.history.pushState(null, null, `#${filename}`);
        });
    });

    // Handle initial load from hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        const activeLink = Array.from(navLinks).find(l => l.getAttribute('href') === `#${initialHash}`);
        if (activeLink) {
            activeLink.click();
        }
    }
});
