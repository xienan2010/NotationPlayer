const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = Vex.Flow;

class NotationManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.renderer = new Renderer(this.container, Renderer.Backends.SVG);
        this.renderer.resize(400, 150);
        this.context = this.renderer.getContext();

        this.currentClef = 'treble';
        this.currentNote = null;
    }

    setClef(clef) {
        this.currentClef = clef;
        this.drawRandomNote();
    }

    // Get a random note within range
    // Treble: C4 (middle C) to G5 (top space + 1)
    // For this app, let's specify: 
    // Treble: A3 to E6 (Upper/Lower 2 ledger lines approx)
    // Actually user said: Up to 2 ledger lines.
    // Treble: Middle C is C4. 
    // Upper 2 ledger lines: A5 (1 line), C6 (2 lines). 
    // Lower 2 ledger lines: A3 (1 line), F3 (2 lines).
    getRandomNote() {
        const trebleRange = [
            { key: 'a/3', midi: 57 }, { key: 'b/3', midi: 59 },
            { key: 'c/4', midi: 60 }, { key: 'd/4', midi: 62 }, { key: 'e/4', midi: 64 }, { key: 'f/4', midi: 65 },
            { key: 'g/4', midi: 67 }, { key: 'a/4', midi: 69 }, { key: 'b/4', midi: 71 }, { key: 'c/5', midi: 72 },
            { key: 'd/5', midi: 74 }, { key: 'e/5', midi: 76 }, { key: 'f/5', midi: 77 }, { key: 'g/5', midi: 79 },
            { key: 'a/5', midi: 81 }, { key: 'b/5', midi: 83 }, { key: 'c/6', midi: 84 }
        ];

        const bassRange = [
            { key: 'c/2', midi: 36 }, { key: 'd/2', midi: 38 }, { key: 'e/2', midi: 40 }, { key: 'f/2', midi: 41 },
            { key: 'g/2', midi: 43 }, { key: 'a/2', midi: 45 }, { key: 'b/2', midi: 47 }, { key: 'c/3', midi: 48 },
            { key: 'd/3', midi: 50 }, { key: 'e/3', midi: 52 }, { key: 'f/3', midi: 53 }, { key: 'g/3', midi: 55 },
            { key: 'a/3', midi: 57 }, { key: 'b/3', midi: 59 }, { key: 'c/4', midi: 60 }, { key: 'd/4', midi: 62 }, { key: 'e/4', midi: 64 }
        ];

        const range = this.currentClef === 'treble' ? trebleRange : bassRange;
        return range[Math.floor(Math.random() * range.length)];
    }

    drawNote(noteObj) {
        this.context.clear();
        this.currentNote = noteObj;

        const stave = new Stave(10, 20, 380);
        stave.addClef(this.currentClef);
        stave.setContext(this.context).draw();

        const note = new StaveNote({
            clef: this.currentClef,
            keys: [noteObj.key],
            duration: 'q'
        });

        // No accidentals needed for diatonic range

        const voice = new Voice({ num_beats: 1, beat_value: 4 });
        voice.addTickables([note]);

        new Formatter().joinVoices([voice]).format([voice], 350);
        voice.draw(this.context, stave);
    }

    drawRandomNote() {
        const note = this.getRandomNote();
        this.drawNote(note);
        return note;
    }
}

window.notationManager = new NotationManager('output');
