class InputManager {
    constructor(onNoteInput) {
        this.onNoteInput = onNoteInput;
        this.currentMapping = 'scheme-a';
        this.setupMidi();
        this.setupKeyboard();
    }

    setMapping(mapping) {
        this.currentMapping = mapping;
    }

    setupMidi() {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(
                (midi) => this.onMidiSuccess(midi),
                (err) => this.onMidiFailure(err)
            );
        } else {
            console.warn('Web MIDI API not supported in this browser.');
        }
    }

    onMidiSuccess(midi) {
        const statusEl = document.getElementById('midi-status');
        const inputs = midi.inputs.values();

        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = (msg) => this.handleMidiMessage(msg);
            statusEl.innerText = 'MIDI 已连接: ' + input.value.name;
            statusEl.classList.add('connected');
        }

        midi.onstatechange = (e) => {
            if (e.port.type === 'input') {
                if (e.port.state === 'connected') {
                    statusEl.innerText = 'MIDI 已连接: ' + e.port.name;
                    statusEl.classList.add('connected');
                    e.port.onmidimessage = (msg) => this.handleMidiMessage(msg);
                } else {
                    statusEl.innerText = 'MIDI 未连接';
                    statusEl.classList.remove('connected');
                }
            }
        };
    }

    onMidiFailure(err) {
        console.warn('Could not access MIDI devices.', err);
    }

    handleMidiMessage(msg) {
        const [command, note, velocity] = msg.data;
        // 144 is Note On, 128 is Note Off
        if (command === 144 && velocity > 0) {
            this.onNoteInput(note);
        }
    }

    setupKeyboard() {
        window.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            const note = this.mapKeyToNote(e.key.toLowerCase());
            if (note !== null) {
                this.onNoteInput(note);
            }
        });
    }

    mapKeyToNote(key) {
        if (this.currentMapping === 'scheme-a') {
            // Scheme A: A-G maps to note names
            // Simple mapping to mid-range notes for feedback
            const mapping = {
                'c': 60, 'd': 62, 'e': 64, 'f': 65, 'g': 67, 'a': 69, 'b': 71
            };
            return mapping[key] || null;
        } else {
            // Scheme B: Piano layout (A S D F G H J -> C D E F G A B)
            const mapping = {
                'a': 60, 's': 62, 'd': 64, 'f': 65, 'g': 67, 'h': 69, 'j': 71
            };
            return mapping[key] || null;
        }
    }
}
