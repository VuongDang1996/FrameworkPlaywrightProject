/**
 * main.js
 * Core application controller.
 */

import { MarkdownParser } from './parser.js';
import { Renderer } from './renderers.js';

// We will fetch the markdown files located in the root directory
// Or you can update this list to fetch from 'docs/' etc.
const MARKDOWN_FILES = [
    { title: '01 Framework Overview', url: '../Lerning/01-Framework-Overview.md' },
    { title: '02 POM and Architecture', url: '../Lerning/02-POM-and-Architecture.md' },
    { title: '03 Write Your First Test', url: '../Lerning/03-Write-Your-First-Test.md' },
    { title: '04 Commands and Cheat Sheet', url: '../Lerning/04-Commands-and-Cheat-Sheet.md' },
    { title: '05 Locators and Selectors', url: '../Lerning/05-Locators-and-Selectors.md' },
    { title: '06 Fixtures and Test Data', url: '../Lerning/06-Fixtures-and-Test-Data.md' },
    { title: '07 Allure Reporting', url: '../Lerning/07-Allure-Reporting.md' },
    { title: '08 Debugging and Troubleshooting', url: '../Lerning/08-Debugging-and-Troubleshooting.md' },
    { title: '09 TypeScript Basics', url: '../Lerning/09-TypeScript-Basics-for-Testers.md' },
    { title: '10 Test Walkthrough', url: '../Lerning/10-Line-by-Line-Test-Walkthrough.md' },
    { title: '11 Test Cases Map', url: '../Lerning/11-All-26-Test-Cases-Map.md' },
    { title: '12 🏋️ Practice Exercises', url: '../Lerning/12-Interactive-Exercises.md' },
    { title: '13 🚀 Advanced Patterns', url: '../Lerning/13-Advanced-Exercises.md' },
    { title: '14 🌍 Real-World Scenarios', url: '../Lerning/14-Real-World-Scenarios.md' },
    { title: '15 🔷 TypeScript Mastery', url: '../Lerning/15-TypeScript-Mastery.md' },
    { title: '16 🔌 API Testing & CI/CD', url: '../Lerning/16-API-Testing-and-CICD.md' },
    { title: '17 📱 Mobile Emulation', url: '../Lerning/17-Mobile-Emulation-and-Touch.md' },
    { title: '18 ♿ Accessibility Testing', url: '../Lerning/18-Accessibility-Testing.md' },
    { title: '19 🥒 Cucumber BDD Integration', url: '../Lerning/19-Cucumber-Integration.md' }
];

class App {
    constructor() {
        this.parser = new MarkdownParser();
        this.renderer = new Renderer();
        this.documents = {};
        this.currentDocId = null;
        this.currentFilter = 'all';

        this.initTheme();
        this.initMonaco();
        this.bindEvents();
        this.loadDocuments();
    }

    initTheme() {
        const toggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('learning_lab_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeUI(savedTheme, toggle);

        toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('learning_lab_theme', newTheme);
            this.updateThemeUI(newTheme, toggle);

            // Update Monaco theme if loaded
            if (window.monaco) {
                window.monaco.editor.setTheme(newTheme === 'dark' ? 'vs-dark' : 'vs');
            }
        });
    }

    updateThemeUI(theme, btn) {
        if (theme === 'dark') {
            btn.textContent = '☀️ Light Mode';
            document.getElementById('prism-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css";
        } else {
            btn.textContent = '🌙 Dark Mode';
            document.getElementById('prism-theme').href = "https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css";
        }
    }

    initMonaco() {
        require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            window.monacoLoaded = true;
            document.dispatchEvent(new Event('monaco-loaded'));
        });
    }

    bindEvents() {
        // Mode switcher
        document.getElementById('mode-switcher').addEventListener('click', (e) => {
            if (e.target.classList.contains('mode-btn')) {
                // Update buttons
                document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                // Update panes
                const mode = e.target.getAttribute('data-mode');
                document.querySelectorAll('.mode-pane').forEach(pane => pane.classList.remove('active'));
                document.getElementById(`${mode}-mode`).classList.add('active');

                // If switching to coding, lay out editors
                if (mode === 'coding') {
                    // Monaco needs to re-calculate layout when its container becomes visible
                    setTimeout(() => this.renderer.layoutEditors(), 10);
                }
            }
        });

        // Exercise filters
        const filterContainer = document.querySelector('.exercise-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.getAttribute('data-difficulty');

                    if (this.currentDocId) {
                        this.renderExercisesOnly();
                    }
                }
            });
        }

        // Progress updates
        document.addEventListener('progress-updated', () => this.updateDashboard());

        // Reset progress
        const resetBtn = document.getElementById('reset-progress');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm("Are you sure you want to reset all progress?")) {
                    localStorage.removeItem('learning_lab_srs');
                    localStorage.removeItem('learning_lab_quiz');
                    localStorage.removeItem('learning_lab_code');
                    localStorage.removeItem('learning_lab_solved');
                    this.updateDashboard();
                    if (this.currentDocId) {
                        this.renderDocument(this.currentDocId);
                    }
                }
            });
        }

        // Export PDF
        const exportBtn = document.getElementById('export-pdf');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportToPDF());
        }
    }

    /**
     * Resolves the html2pdf library, handling both the global and AMD
     * (RequireJS, from Monaco Editor) module cases.
     * @returns {Promise<Function>}
     */
    async resolveHtml2pdf() {
        // 1) Already a global function – use it
        if (typeof html2pdf === 'function') return html2pdf;

        // 2) Loaded as an AMD module via RequireJS (Monaco loads RequireJS before
        //    html2pdf.js, so the UMD bundle registers as an AMD module instead of
        //    setting window.html2pdf).
        if (window.require) {
            try {
                const mod = await new Promise((resolve, reject) => {
                    window.require(['html2pdf'], resolve, reject);
                });
                // Cache on window for subsequent calls
                window.html2pdf = mod;
                return mod;
            } catch {
                // Module not registered with require – fall through to dynamic load
            }
        }

        // 3) Dynamic load – also nukes AMD detection so the bundle sets the global
        return new Promise((resolve, reject) => {
            const savedDefine = window.define;
            window.define = undefined;

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = () => {
                window.define = savedDefine;
                if (typeof html2pdf === 'function') {
                    resolve(html2pdf);
                } else {
                    reject(new Error('html2pdf loaded but not available as a function'));
                }
            };
            script.onerror = () => {
                window.define = savedDefine;
                reject(new Error('Failed to load html2pdf library from CDN'));
            };
            document.head.appendChild(script);
        });
    }

    async exportToPDF() {
        if (!this.currentDocId) {
            alert('Please select a document first.');
            return;
        }

        const btn = document.getElementById('export-pdf');
        const originalText = btn.innerHTML;
        btn.innerHTML = '⏳ Generating...';
        btn.disabled = true;

        let html2pdfLib;
        try {
            html2pdfLib = await this.resolveHtml2pdf();
        } catch (err) {
            console.error('PDF Export Error:', err);
            alert('Failed to load PDF library. Please check your internet connection.');
            btn.innerHTML = originalText;
            btn.disabled = false;
            return;
        }

        const doc = this.documents[this.currentDocId];
        const element = document.getElementById('reading-mode');

        const opt = {
            margin: [15, 10],
            filename: `${doc.title.replace(/\s+/g, '_')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['css', 'legacy'], avoid: ['pre', 'code', 'h1', 'h2', 'h3'] }
        };

        // --- Temporarily apply print styles directly to the live document ---
        
        // 1. Force light mode for printing
        const originalTheme = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', 'light');

        // 2. Add header
        const header = document.createElement('div');
        header.id = 'temp-pdf-header';
        header.style.borderBottom = '2px solid #6366f1';
        header.style.paddingBottom = '10px';
        header.style.marginBottom = '30px';
        header.innerHTML = `
            <h1 style="color:#6366f1; margin:0; font-size: 24pt;">${doc.title}</h1>
            <p style="color:#6b7280; margin:5px 0 0 0; font-size: 10pt;">Playwright Interactive Learning Lab • Study Guide</p>
        `;
        element.prepend(header);

        // ---------- Export ----------
        const cleanup = () => {
            // Restore theme
            document.documentElement.setAttribute('data-theme', originalTheme);
            // Remove header
            const h = document.getElementById('temp-pdf-header');
            if (h) h.parentNode.removeChild(h);
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        };

        // Wait a frame for styles to apply
        await new Promise(resolve => requestAnimationFrame(resolve));

        html2pdfLib().set(opt).from(element).save().then(() => {
            cleanup();
        }).catch(err => {
            console.error('PDF Export Error:', err);
            alert('Failed to generate PDF. Please try again.');
            cleanup();
        });
    }

    async loadDocuments() {
        const tabsContainer = document.getElementById('docs-tabs');
        tabsContainer.innerHTML = '';

        for (let i = 0; i < MARKDOWN_FILES.length; i++) {
            const file = MARKDOWN_FILES[i];
            const id = `doc_${i}`;

            try {
                const response = await fetch(file.url);
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                const text = await response.text();

                const parsedData = this.parser.parse(text);
                this.documents[id] = {
                    title: file.title,
                    text: text,
                    data: parsedData
                };

                // Create tab
                const tab = document.createElement('button');
                tab.className = 'tab-btn';
                tab.textContent = file.title;
                tab.onclick = () => {
                    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    this.renderDocument(id);
                };
                tabsContainer.appendChild(tab);

                // Auto-select first tab
                if (i === 0) {
                    tab.click();
                }
            } catch (err) {
                console.error(`Failed to load ${file.url}:`, err);
            }
        }

        if (Object.keys(this.documents).length === 0) {
            document.getElementById('reading-mode').innerHTML = `
                <div style="color:var(--error-color)">
                    <h2>Error loading documents.</h2>
                    <p>Check the console and ensure you are running this via a local HTTP server.</p>
                </div>
            `;
        }

        this.updateDashboard();
    }

    renderDocument(docId) {
        this.currentDocId = docId;
        const doc = this.documents[docId];

        // 1. Reading Mode - Extract only the teaching content.
        // We look for the first occurrence of an interactive section header.
        const readingContainer = document.getElementById('reading-mode');
        const interactiveHeaderMatch = doc.text.match(/^## (?:🧠 Flashcards|📝 Quizzes|🏋️ Coding Exercises)/m);

        let readingContent = doc.text;
        if (interactiveHeaderMatch) {
            readingContent = doc.text.substring(0, interactiveHeaderMatch.index);
        }

        readingContainer.innerHTML = marked.parse(readingContent);
        Prism.highlightAllUnder(readingContainer);

        // 2. Flashcards
        this.renderer.renderFlashcards(doc.data.flashcards, document.getElementById('flashcards-container'));

        // 3. Quizzes
        this.renderer.renderQuizzes(doc.data.quizzes, document.getElementById('quizzes-container'));

        // 4. Exercises
        this.renderExercisesOnly();
    }

    renderExercisesOnly() {
        const doc = this.documents[this.currentDocId];
        if (!doc) return;

        let filtered = doc.data.exercises;
        if (this.currentFilter !== 'all') {
            filtered = doc.data.exercises.filter(ex => ex.difficulty.toLowerCase() === this.currentFilter);
        }

        this.renderer.renderExercises(filtered, document.getElementById('exercises-container'));
    }

    updateDashboard() {
        const srsProgress = JSON.parse(localStorage.getItem('learning_lab_srs') || '{}');
        const quizProgress = JSON.parse(localStorage.getItem('learning_lab_quiz') || '{}');
        const solved = JSON.parse(localStorage.getItem('learning_lab_solved') || '{}');

        // Flashcards
        let totalCards = 0;
        Object.values(this.documents).forEach(d => totalCards += d.data.flashcards.length);
        const masteredCards = Object.values(srsProgress).filter(score => score === 2).length;

        const fcStat = document.getElementById('flashcard-stat');
        const fcProg = document.getElementById('flashcard-progress');
        if (fcStat) fcStat.textContent = `${masteredCards} / ${totalCards}`;
        if (fcProg) fcProg.style.width = totalCards > 0 ? `${(masteredCards / totalCards) * 100}%` : '0%';

        // Quizzes
        let totalQuizzes = 0;
        let correctQuizzes = 0;
        Object.values(this.documents).forEach(doc => {
            totalQuizzes += doc.data.quizzes.length;
            doc.data.quizzes.forEach(q => {
                if (quizProgress[q.id] !== undefined) {
                    if (q.options[quizProgress[q.id]].isCorrect) {
                        correctQuizzes++;
                    }
                }
            });
        });

        const quizScore = totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0;
        const qzStat = document.getElementById('quiz-stat');
        const qzProg = document.getElementById('quiz-progress');
        if (qzStat) qzStat.textContent = `${quizScore}%`;
        if (qzProg) qzProg.style.width = `${quizScore}%`;

        // Exercises
        let basicTotal = 0, interTotal = 0, advTotal = 0;
        Object.values(this.documents).forEach(doc => {
            doc.data.exercises.forEach(ex => {
                const diff = ex.difficulty.toLowerCase();
                if (diff === 'basic') basicTotal++;
                else if (diff === 'intermediate') interTotal++;
                else if (diff === 'advanced') advTotal++;
            });
        });

        let basicSolved = 0, interSolved = 0, advSolved = 0;
        Object.values(solved).forEach(diff => {
            const d = diff.toLowerCase();
            if (d === 'basic') basicSolved++;
            else if (d === 'intermediate') interSolved++;
            else if (d === 'advanced') advSolved++;
        });

        const exBasic = document.getElementById('ex-basic');
        const exInter = document.getElementById('ex-intermediate');
        const exAdv = document.getElementById('ex-advanced');

        if (exBasic) exBasic.textContent = `${basicSolved}/${basicTotal}`;
        if (exInter) exInter.textContent = `${interSolved}/${interTotal}`;
        if (exAdv) exAdv.textContent = `${advSolved}/${advTotal}`;
    }
}

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
