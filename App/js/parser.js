/**
 * parser.js
 * Universal extraction engine for Markdown content.
 */

export class MarkdownParser {
    constructor() {
        // Framework mapping for Monaco
        this.langMap = {
            'gherkin': 'java', // fallback
            'playwright': 'typescript',
            'cypress': 'javascript',
            'selenium': 'java',
            'karate': 'java',
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python'
        };
    }

    parse(markdownText) {
        // Generate a short stable hash from this document's content
        // so IDs are globally unique across all loaded files
        const docHash = this._hashCode(markdownText.slice(0, 300));
        return {
            flashcards: this.extractFlashcards(markdownText, docHash),
            quizzes:    this.extractQuizzes(markdownText, docHash),
            exercises:  this.extractExercises(markdownText, docHash)
        };
    }

    /** Stable 6-char alphanumeric hash of a string */
    _hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
        }
        return Math.abs(hash).toString(36).slice(0, 6);
    }

    extractFlashcards(text, docHash = 'xx') {
        const flashcards = [];
        const regex = /\*\*(?:Concept|Term):\*\*\s*(.*?)\r?\n([\s\S]*?)(?=\r?\n\*\*(?:Concept|Term):\*\*|\r?\n#|$)/g;
        let match;
        let idCounter = 1;
        while ((match = regex.exec(text)) !== null) {
            flashcards.push({
                id: `fc_${docHash}_${idCounter++}`,
                front: match[1].trim(),
                back: typeof marked !== 'undefined' ? marked.parse(match[2].trim()) : match[2].trim()
            });
        }
        return flashcards;
    }

    extractQuizzes(text, docHash = 'xx') {
        const quizzes = [];
        const regex = /###\s+(.*?)\r?\n((?:- \[[xX ]\] .*\r?\n?)+)/g;
        let match;
        let idCounter = 1;
        while ((match = regex.exec(text)) !== null) {
            const question = match[1].trim();
            const optionsBlock = match[2];
            const optionsRegex = /- \[([xX ])\]\s+(.*)/g;
            const options = [];
            let optMatch;
            while ((optMatch = optionsRegex.exec(optionsBlock)) !== null) {
                options.push({
                    text: optMatch[2].trim(),
                    isCorrect: optMatch[1].toLowerCase() === 'x'
                });
            }
            if (options.length > 0) {
                quizzes.push({
                    id: `qz_${docHash}_${idCounter++}`,
                    question: question,
                    options: options
                });
            }
        }
        return quizzes;
    }

    extractExercises(text, docHash = 'xx') {
        const exercises = [];
        const regex = /###\s+\[Exercise\]\s+(.*?)\r?\n([\s\S]*?)(?=\r?\n###\s+\[Exercise\]|$)/g;
        let match;
        let idCounter = 1;

        while ((match = regex.exec(text)) !== null) {
            const title = match[1].trim();
            const body = match[2];

            const diffMatch = /\*\*Difficulty:\*\*\s*(Basic|Intermediate|Advanced)/i.exec(body);
            const difficulty = diffMatch ? diffMatch[1] : 'Basic';

            const descMatch = /\*\*Description:\*\*\s*(.*?)\r?\n/i.exec(body);
            const description = descMatch ? descMatch[1].trim() : '';

            const codeBlocks = [];
            const codeRegex = /```(\w+)?\r?\n([\s\S]*?)```/g;
            let codeMatch;
            while ((codeMatch = codeRegex.exec(body)) !== null) {
                codeBlocks.push({
                    lang: codeMatch[1] || 'plaintext',
                    code: codeMatch[2]
                });
            }

            let setupCode = '';
            let solutionCode = '';
            let lang = 'javascript';

            if (codeBlocks.length >= 1) {
                setupCode = codeBlocks[0].code;
                lang = this.normalizeLang(codeBlocks[0].lang);
            }
            if (codeBlocks.length >= 2) {
                solutionCode = codeBlocks[1].code;
            }

            if (!solutionCode) {
                const solMatch = /(?:###|\*\*)?\s*Solution\s*(?:###|\*\*)?[\s\S]*?```(\w+)?\r?\n([\s\S]*?)```/i.exec(body);
                if (solMatch) {
                    solutionCode = solMatch[2];
                }
            }

            exercises.push({
                id: `ex_${docHash}_${idCounter++}`,
                title,
                difficulty,
                description,
                lang,
                setupCode,
                solutionCode: solutionCode || setupCode
            });
        }
        return exercises;
    }

    normalizeLang(lang) {
        lang = lang.toLowerCase();
        return this.langMap[lang] || lang;
    }
}
