class AudioEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    }

    // Convert MIDI note number to frequency
    midiToFreq(midi) {
        return 440 * Math.pow(2, (midi - 69) / 12);
    }

    playNote(midi, duration = 0.5) {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        const freq = this.midiToFreq(midi);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Simple "piano-ish" envelope
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playCorrect() {
        this.playNote(72, 0.1); // C5
        setTimeout(() => this.playNote(76, 0.2), 100); // E5
    }

    playWrong() {
        this.playNote(48, 0.3); // C3 
    }
}

window.audioEngine = new AudioEngine();
