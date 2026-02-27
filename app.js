class App {
    constructor() {
        this.stats = {
            correct: 0,
            wrong: 0
        };

        this.currentNote = null;
        this.init();
    }

    init() {
        // Initialize Managers
        this.notation = window.notationManager;
        this.audio = window.audioEngine;
        this.input = new InputManager((midiNote) => this.handleInput(midiNote));

        // UI Elements
        this.clefSelect = document.getElementById('clef-select');
        this.mappingSelect = document.getElementById('mapping-select');
        this.feedbackEl = document.getElementById('feedback-indicator');

        // Event Listeners
        this.clefSelect.addEventListener('change', (e) => {
            this.notation.setClef(e.target.value);
            this.currentNote = this.notation.currentNote;
        });

        this.mappingSelect.addEventListener('change', (e) => {
            this.input.setMapping(e.target.value);
        });

        // Initial Draw
        this.currentNote = this.notation.drawRandomNote();
    }

    handleInput(inputMidi) {
        // Normalize input MIDI to the same octave for keyboard mapping if needed?
        // Actually, for keyboard, we just care about the note name (C, D, E...)
        // For MIDI, we care about the exact note.

        const expectedMidi = this.currentNote.midi;

        // Check if the note name matches (C, D, E...)
        // This allows user to play the correct note in any octave for keyboard
        // For MIDI, we might want to be strict or flexible. 
        // Let's be flexible: if the note name matches, it's correct.
        const inputNoteName = inputMidi % 12;
        const expectedNoteName = expectedMidi % 12;

        if (inputNoteName === expectedNoteName) {
            this.onCorrect(inputMidi);
        } else {
            this.onWrong(inputMidi);
        }
    }

    onCorrect(midi) {
        this.stats.correct++;
        this.audio.playNote(midi);
        this.showFeedback('✓', 'correct');
        this.updateStats();

        // Delay slightly before next note
        setTimeout(() => {
            this.currentNote = this.notation.drawRandomNote();
            this.feedbackEl.className = 'feedback-indicator';
        }, 500);
    }

    onWrong(midi) {
        this.stats.wrong++;
        this.audio.playWrong();
        this.showFeedback('✗', 'wrong');
        this.updateStats();

        // Optional: play the wrong note too?
        this.audio.playNote(midi, 0.2);

        setTimeout(() => {
            this.feedbackEl.className = 'feedback-indicator';
        }, 800);
    }

    showFeedback(text, type) {
        this.feedbackEl.innerText = text;
        this.feedbackEl.className = `feedback-indicator ${type}`;
    }

    updateStats() {
        document.getElementById('correct-count').innerText = this.stats.correct;
        document.getElementById('wrong-count').innerText = this.stats.wrong;

        const total = this.stats.correct + this.stats.wrong;
        const accuracy = total === 0 ? 0 : Math.round((this.stats.correct / total) * 100);
        document.getElementById('accuracy').innerText = `${accuracy}%`;
    }
}

// Start the app
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
