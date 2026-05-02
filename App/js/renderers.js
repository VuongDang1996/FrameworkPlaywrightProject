/**
 * renderers.js
 * Handles DOM generation and interactions for learning modes.
 */

export class Renderer {
    constructor() {
        this.editors = {};
    }

    renderFlashcards(flashcards, container) {
        container.innerHTML = '';
        if(flashcards.length === 0) {
            container.innerHTML = '<p>No flashcards found in this document.</p>';
            return;
        }

        flashcards.forEach(card => {
            const el = document.createElement('div');
            el.className = 'flashcard';
            
            const inner = document.createElement('div');
            inner.className = 'flashcard-inner';
            
            const front = document.createElement('div');
            front.className = 'flashcard-front';
            front.innerHTML = marked.parse(card.front); // Render markdown inside front too
            
            const back = document.createElement('div');
            back.className = 'flashcard-back';
            back.innerHTML = card.back;
            
            const controls = document.createElement('div');
            controls.className = 'srs-controls';
            
            const btnAgain = document.createElement('button');
            btnAgain.className = 'srs-btn again';
            btnAgain.textContent = 'Again';
            btnAgain.onclick = (e) => this.handleSrsClick(e, card.id, 0);
            
            const btnHard = document.createElement('button');
            btnHard.className = 'srs-btn hard';
            btnHard.textContent = 'Hard';
            btnHard.onclick = (e) => this.handleSrsClick(e, card.id, 1);
            
            const btnEasy = document.createElement('button');
            btnEasy.className = 'srs-btn easy';
            btnEasy.textContent = 'Easy';
            btnEasy.onclick = (e) => this.handleSrsClick(e, card.id, 2);
            
            controls.appendChild(btnAgain);
            controls.appendChild(btnHard);
            controls.appendChild(btnEasy);
            back.appendChild(controls);

            inner.appendChild(front);
            inner.appendChild(back);
            el.appendChild(inner);

            el.addEventListener('click', (e) => {
                if(!e.target.classList.contains('srs-btn')) {
                    el.classList.toggle('flipped');
                }
            });

            container.appendChild(el);
        });
    }

    handleSrsClick(e, cardId, score) {
        e.stopPropagation();
        const progress = JSON.parse(localStorage.getItem('learning_lab_srs') || '{}');
        progress[cardId] = score;
        localStorage.setItem('learning_lab_srs', JSON.stringify(progress));
        document.dispatchEvent(new Event('progress-updated'));
        
        // Flip back
        e.target.closest('.flashcard').classList.remove('flipped');
    }

    renderQuizzes(quizzes, container) {
        container.innerHTML = '';
        if (quizzes.length === 0) {
            container.innerHTML = '<p>No quizzes found in this document.</p>';
            return;
        }

        const progress = JSON.parse(localStorage.getItem('learning_lab_quiz') || '{}');

        quizzes.forEach(quiz => {
            const card = document.createElement('div');
            card.className = 'quiz-card';

            const qText = document.createElement('div');
            qText.className = 'quiz-question';
            qText.innerHTML = marked.parseInline(quiz.question);
            card.appendChild(qText);

            const optionsContainer = document.createElement('div');
            optionsContainer.className = 'quiz-options';

            // Track which option the user has selected (before submitting)
            let selectedIdx = null;
            const alreadyAnswered = progress[quiz.id] !== undefined;

            const optionBtns = quiz.options.map((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.innerHTML = marked.parseInline(opt.text);

                if (alreadyAnswered) {
                    // Restore previously submitted state
                    btn.disabled = true;
                    if (opt.isCorrect) btn.classList.add('correct');
                    else if (progress[quiz.id] === idx && !opt.isCorrect) btn.classList.add('incorrect');
                } else {
                    // Fresh question — just track selection, no color yet
                    btn.onclick = () => {
                        optionBtns.forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');
                        selectedIdx = idx;
                        submitBtn.disabled = false;
                    };
                }

                optionsContainer.appendChild(btn);
                return btn;
            });

            card.appendChild(optionsContainer);

            // Submit button — only shown for unanswered questions
            const submitBtn = document.createElement('button');
            submitBtn.className = 'quiz-submit-btn';
            submitBtn.textContent = 'Check Answer';
            submitBtn.disabled = true; // disabled until an option is selected

            if (!alreadyAnswered) {
                submitBtn.onclick = () => {
                    if (selectedIdx === null) return;

                    // Lock all options
                    optionBtns.forEach(b => {
                        b.disabled = true;
                        b.classList.remove('selected');
                    });

                    // Colour correct / incorrect
                    if (quiz.options[selectedIdx].isCorrect) {
                        optionBtns[selectedIdx].classList.add('correct');
                    } else {
                        optionBtns[selectedIdx].classList.add('incorrect');
                        // Reveal the correct one
                        optionBtns.forEach((b, i) => {
                            if (quiz.options[i].isCorrect) b.classList.add('correct');
                        });
                    }

                    // Save progress
                    progress[quiz.id] = selectedIdx;
                    localStorage.setItem('learning_lab_quiz', JSON.stringify(progress));
                    document.dispatchEvent(new Event('progress-updated'));

                    // Hide submit button after answering
                    submitBtn.style.display = 'none';
                };

                card.appendChild(submitBtn);
            }

            container.appendChild(card);
        });
    }

    renderExercises(exercises, container) {
        container.innerHTML = '';
        if(exercises.length === 0) {
            container.innerHTML = '<p>No coding exercises found in this document.</p>';
            return;
        }

        const savedCode = JSON.parse(localStorage.getItem('learning_lab_code') || '{}');

        exercises.forEach((ex) => {
            const card = document.createElement('div');
            card.className = 'exercise-card';

            const header = document.createElement('div');
            header.className = 'exercise-header';
            header.innerHTML = `
                <div class="exercise-title">${ex.title}</div>
                <div class="badge ${ex.difficulty.toLowerCase()}">${ex.difficulty}</div>
            `;

            const body = document.createElement('div');
            body.className = 'exercise-body';

            if (ex.description) {
                const desc = document.createElement('div');
                desc.className = 'exercise-desc';
                desc.innerHTML = marked.parse(ex.description);
                body.appendChild(desc);
            }

            const editorId = `editor_${ex.id}`;
            const editorDiv = document.createElement('div');
            editorDiv.id = editorId;
            editorDiv.className = 'editor-container';
            body.appendChild(editorDiv);

            const controls = document.createElement('div');
            controls.className = 'exercise-controls';

            const runBtn = document.createElement('button');
            runBtn.className = 'btn-primary';
            runBtn.textContent = 'Run Validation';
            runBtn.onclick = () => this.runValidation(ex, editorId);

            const solBtn = document.createElement('button');
            solBtn.className = 'btn-secondary';
            solBtn.textContent = 'Show Solution';
            
            const solutionBox = document.createElement('div');
            solutionBox.className = 'solution-box';
            solutionBox.innerHTML = `<pre><code class="language-${ex.lang}">${ex.solutionCode}</code></pre>`;

            solBtn.onclick = () => {
                solutionBox.classList.toggle('show');
                Prism.highlightAllUnder(solutionBox);
            };

            controls.appendChild(runBtn);
            controls.appendChild(solBtn);
            body.appendChild(controls);

            const feedback = document.createElement('div');
            feedback.id = `feedback_${ex.id}`;
            feedback.className = 'feedback-box';
            body.appendChild(feedback);
            body.appendChild(solutionBox);

            card.appendChild(header);
            card.appendChild(body);
            container.appendChild(card);

            // Setup initialization queue for Monaco
            const initEditor = () => {
                this.initMonaco(editorId, ex.lang, savedCode[ex.id] || ex.setupCode, ex.id);
            };

            if (window.monacoLoaded) {
                setTimeout(initEditor, 50);
            } else {
                document.addEventListener('monaco-loaded', initEditor);
            }
        });
    }

    initMonaco(editorId, lang, initialCode, exId) {
        const el = document.getElementById(editorId);
        if (!el || !window.monaco) return;
        
        if(this.editors[editorId]) {
            this.editors[editorId].dispose(); // Clean up if re-rendering
        }

        const editor = window.monaco.editor.create(el, {
            value: initialCode,
            language: lang,
            theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'vs',
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            roundedSelection: false,
        });

        this.editors[editorId] = editor;

        let debounceTimer;
        editor.onDidChangeModelContent(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const code = editor.getValue();
                const savedCode = JSON.parse(localStorage.getItem('learning_lab_code') || '{}');
                savedCode[exId] = code;
                localStorage.setItem('learning_lab_code', JSON.stringify(savedCode));
            }, 500);
        });
    }

    runValidation(exercise, editorId) {
        const editor = this.editors[editorId];
        if (!editor) return;

        const userCode = editor.getValue();
        const feedback = document.getElementById(`feedback_${exercise.id}`);
        feedback.className = 'feedback-box'; // reset

        // Heuristic validation engine
        const expectedTokens = this.extractTokens(exercise.solutionCode);
        const missingTokens = expectedTokens.filter(token => !userCode.includes(token));

        if (missingTokens.length === 0) {
            feedback.innerHTML = '✅ Excellent! Your solution passes the validation checks.';
            feedback.classList.add('success');
            
            // Mark as solved
            const solved = JSON.parse(localStorage.getItem('learning_lab_solved') || '{}');
            solved[exercise.id] = exercise.difficulty;
            localStorage.setItem('learning_lab_solved', JSON.stringify(solved));
            document.dispatchEvent(new Event('progress-updated'));
        } else {
            feedback.innerHTML = '❌ Validation Failed. Missing keywords or structures:<br><ul>' + 
                missingTokens.map(t => `<li><code>${t}</code></li>`).join('') + '</ul>';
            feedback.classList.add('error');
        }
    }

    extractTokens(code) {
        // Extract method calls or significant keywords to use as heuristic checks
        const tokens = [];
        const regexes = [
            /([a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)/g, // obj.method
            /\b(def\s+[a-zA-Z0-9_]+)\b/g, // python function defs
            /\b(class\s+[a-zA-Z0-9_]+)\b/g, // class defs
            /\b(assert\s|assertEquals|assertTrue)\b/g, // assertions
            /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/gi // sql keywords
        ];
        
        regexes.forEach(regex => {
            const matches = code.match(regex);
            if (matches) {
                tokens.push(...matches);
            }
        });

        // If no tokens found, default to passing (or we could use simple exact check)
        if (tokens.length === 0) return [];
        
        const unique = [...new Set(tokens)];
        // Filter out very common short words or irrelevant ones if needed.
        // Return up to 5 key tokens to not make it unreasonably strict
        return unique.slice(0, 5); 
    }

    layoutEditors() {
        Object.values(this.editors).forEach(editor => {
            if(editor) editor.layout();
        });
    }
}
