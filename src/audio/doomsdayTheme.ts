/**
 * DATAVERSE Doomsday background music.
 *
 * A procedural, looping dark-cinematic score built with the Web Audio API — no
 * audio files, no 404s. Layers: sub-bass drone, tolling bell, war-drum hits,
 * a slow brass dirge and a choir-like minor pad (Dm → Bb → Gm → A).
 *
 * To use a real track instead, drop an mp3 at `public/audio/doomsday-theme.mp3`.
 * It is detected automatically; otherwise the synthesized score plays.
 *
 * Browsers block audio until the user interacts with the page, so `start()`
 * must be called from a user gesture (click / key / touch).
 */

const FILE_URL = "/audio/doomsday-theme.mp3";
const MASTER_VOLUME = 0.32;
const FILE_VOLUME = 0.45;

const BPM = 54;
const BEAT = 60 / BPM; // seconds per beat
const PHRASE_BEATS = 16; // 4 bars of 4
const LOOKAHEAD = 0.7; // seconds scheduled ahead
const TICK_MS = 120;

// Pad chords, one per 4 beats (Dm, Bb, Gm, A)
const CHORDS: number[][] = [
  [73.42, 146.83, 174.61, 220.0],
  [58.27, 116.54, 146.83, 174.61],
  [49.0, 98.0, 116.54, 146.83],
  [55.0, 110.0, 138.59, 164.81],
];

// Brass dirge: [beat in phrase, frequency Hz, length in beats]
const MELODY: Array<[number, number, number]> = [
  [0, 146.83, 2], // D3
  [2, 174.61, 1], // F3
  [3, 164.81, 1], // E3
  [4, 146.83, 2], // D3
  [6, 130.81, 2], // C3
  [8, 116.54, 2], // Bb2
  [10, 130.81, 1], // C3
  [11, 146.83, 1], // D3
  [12, 138.59, 3], // C#3 (leading tone, unresolved tension)
  [15, 110.0, 1], // A2
];

class DoomsdayMusicEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverbSend: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private droneNodes: Array<OscillatorNode | AudioBufferSourceNode> = [];

  private audioEl: HTMLAudioElement | null = null;
  private fileChecked = false;
  private fileAvailable = false;

  private timer: number | null = null;
  private nextBeatTime = 0;
  private beatIndex = 0;

  private playing = false;
  private pausedByVisibility = false;
  private visibilityBound = false;

  public get isPlaying(): boolean {
    return this.playing;
  }

  /** Start (or resume) the music. Call from a user gesture. */
  public async start(): Promise<void> {
    if (this.playing || typeof window === "undefined") return;
    this.playing = true;
    this.bindVisibility();

    await this.detectFile();
    if (!this.playing) return; // stopped while we were checking

    if (this.fileAvailable) {
      this.startFile();
    } else {
      this.startSynth();
    }
  }

  /** Fade out and stop. */
  public stop(): void {
    if (!this.playing) return;
    this.playing = false;
    this.pausedByVisibility = false;

    if (this.audioEl) {
      const el = this.audioEl;
      this.fadeElement(el, 0, 600, () => el.pause());
    }

    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setTargetAtTime(0.0001, t, 0.25);
      this.stopDrone(t + 1.4);
    }
  }

  public toggle(): boolean {
    if (this.playing) {
      this.stop();
      return false;
    }
    void this.start();
    return true;
  }

  // ---------------------------------------------------------------- file mode

  private async detectFile(): Promise<void> {
    if (this.fileChecked) return;
    this.fileChecked = true;
    try {
      const res = await fetch(FILE_URL, { method: "HEAD", cache: "no-store" });
      const type = res.headers.get("content-type") ?? "";
      this.fileAvailable = res.ok && type.startsWith("audio");
    } catch {
      this.fileAvailable = false;
    }
  }

  private startFile(): void {
    if (!this.audioEl) {
      this.audioEl = new Audio(FILE_URL);
      this.audioEl.loop = true;
      this.audioEl.preload = "auto";
    }
    const el = this.audioEl;
    el.volume = 0;
    el.play()
      .then(() => this.fadeElement(el, FILE_VOLUME, 1500))
      .catch(() => {
        this.playing = false;
      });
  }

  private fadeElement(el: HTMLAudioElement, target: number, ms: number, done?: () => void): void {
    const from = el.volume;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / ms, 1);
      el.volume = Math.max(0, Math.min(1, from + (target - from) * p));
      if (p < 1) requestAnimationFrame(step);
      else done?.();
    };
    requestAnimationFrame(step);
  }

  // --------------------------------------------------------------- synth mode

  private startSynth(): void {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      this.playing = false;
      return;
    }

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.buildGraph(this.ctx);
    }
    const ctx = this.ctx;
    if (ctx.state === "suspended") void ctx.resume();

    const t = ctx.currentTime;
    this.master!.gain.cancelScheduledValues(t);
    this.master!.gain.setValueAtTime(0.0001, t);
    this.master!.gain.linearRampToValueAtTime(MASTER_VOLUME, t + 3);

    this.startDrone(t);
    this.nextBeatTime = t + 0.15;
    this.beatIndex = 0;
    this.timer = window.setInterval(() => this.schedule(), TICK_MS);
    this.schedule();
  }

  private buildGraph(ctx: AudioContext): void {
    const master = ctx.createGain();
    master.gain.value = 0.0001;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 4;
    master.connect(comp);
    comp.connect(ctx.destination);

    // Cathedral-style reverb from a generated noise impulse
    const reverb = ctx.createConvolver();
    const len = Math.floor(ctx.sampleRate * 3.2);
    const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = impulse.getChannelData(c);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
    }
    reverb.buffer = impulse;
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    reverb.connect(wet);
    wet.connect(master);

    const send = ctx.createGain();
    send.gain.value = 1;
    send.connect(reverb);

    // Reusable noise for drum transients
    const nLen = ctx.sampleRate;
    const noise = ctx.createBuffer(1, nLen, ctx.sampleRate);
    const nData = noise.getChannelData(0);
    for (let i = 0; i < nLen; i++) nData[i] = Math.random() * 2 - 1;

    this.master = master;
    this.reverbSend = send;
    this.noiseBuffer = noise;
  }

  /** Continuous sub-bass drone with a slowly breathing filter. */
  private startDrone(t: number): void {
    const ctx = this.ctx!;
    this.stopDrone(t);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;
    filter.Q.value = 4;

    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.2;
    filter.connect(droneGain);
    droneGain.connect(this.master!);
    droneGain.connect(this.reverbSend!);

    // D1 + slightly detuned D1 + dissonant Eb2 for unease
    const freqs: Array<[number, number]> = [
      [36.71, 0],
      [36.71, 7],
      [73.42, -5],
      [77.78, 3],
    ];
    for (const [f, detune] of freqs) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = f;
      osc.detune.value = detune;
      osc.connect(filter);
      osc.start(t);
      this.droneNodes.push(osc);
    }

    // Slow LFO on the filter cutoff ("breathing")
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 90;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(t);
    this.droneNodes.push(lfo);
  }

  private stopDrone(at: number): void {
    for (const node of this.droneNodes) {
      try {
        node.stop(at);
      } catch {
        /* already stopped */
      }
    }
    this.droneNodes = [];
  }

  private schedule(): void {
    if (!this.ctx || !this.playing) return;
    while (this.nextBeatTime < this.ctx.currentTime + LOOKAHEAD) {
      this.scheduleBeat(this.beatIndex, this.nextBeatTime);
      this.nextBeatTime += BEAT;
      this.beatIndex++;
    }
  }

  private scheduleBeat(index: number, t: number): void {
    const beat = index % PHRASE_BEATS;
    const bar = Math.floor(beat / 4);
    const beatInBar = beat % 4;

    // War drum: heavy on the 1, softer on the 3, ghost note before the next bar
    if (beatInBar === 0) this.drum(t, 0.95);
    else if (beatInBar === 2) this.drum(t, 0.5);
    else if (beatInBar === 3 && bar % 2 === 1) this.drum(t + BEAT * 0.5, 0.28);

    // Choir pad: one chord per bar
    if (beatInBar === 0) this.pad(CHORDS[bar % CHORDS.length], t, BEAT * 4);

    // Brass dirge
    for (const [b, freq, len] of MELODY) {
      if (b === beat) this.brass(freq, t, len * BEAT);
    }

    // Tolling bell at the start of the phrase and halfway through
    if (beat === 0) this.bell(293.66, t, 0.5); // D4
    if (beat === 8) this.bell(233.08, t, 0.38); // Bb3
  }

  // ------------------------------------------------------------------ voices

  private drum(t: number, vel: number): void {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vel * 0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    gain.connect(this.master!);
    gain.connect(this.reverbSend!);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(105, t);
    osc.frequency.exponentialRampToValueAtTime(34, t + 0.35);
    osc.connect(gain);
    osc.start(t);
    osc.stop(t + 1.15);

    // Skin "thwack"
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const nf = ctx.createBiquadFilter();
    nf.type = "lowpass";
    nf.frequency.value = 420;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(vel * 0.35, t);
    ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    src.connect(nf);
    nf.connect(ng);
    ng.connect(this.master!);
    src.start(t);
    src.stop(t + 0.15);
  }

  private pad(freqs: number[], t: number, dur: number): void {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(380, t);
    filter.frequency.linearRampToValueAtTime(900, t + dur * 0.6);
    filter.frequency.linearRampToValueAtTime(320, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.085, t + dur * 0.45);
    gain.gain.linearRampToValueAtTime(0.0001, t + dur + 0.6);
    filter.connect(gain);
    gain.connect(this.master!);
    gain.connect(this.reverbSend!);

    for (const f of freqs) {
      for (const detune of [-9, 9]) {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = f;
        osc.detune.value = detune;
        osc.connect(filter);
        osc.start(t);
        osc.stop(t + dur + 0.7);
      }
    }
  }

  private brass(freq: number, t: number, dur: number): void {
    const ctx = this.ctx!;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 2;
    filter.frequency.setValueAtTime(260, t);
    filter.frequency.exponentialRampToValueAtTime(1100, t + Math.min(0.5, dur * 0.4));
    filter.frequency.exponentialRampToValueAtTime(300, t + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.16, t + 0.28);
    gain.gain.setValueAtTime(0.16, t + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.35);
    filter.connect(gain);
    gain.connect(this.master!);
    gain.connect(this.reverbSend!);

    for (const [mult, detune] of [
      [1, -6],
      [1, 6],
      [2, 0],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.value = freq * mult;
      osc.detune.value = detune;
      // Slight vibrato that blooms late in the note
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.frequency.value = 4.6;
      vibGain.gain.setValueAtTime(0, t);
      vibGain.gain.linearRampToValueAtTime(7, t + dur);
      vib.connect(vibGain);
      vibGain.connect(osc.detune);
      osc.connect(filter);
      osc.start(t);
      vib.start(t);
      osc.stop(t + dur + 0.4);
      vib.stop(t + dur + 0.4);
    }
  }

  private bell(freq: number, t: number, vol: number): void {
    const ctx = this.ctx!;
    // Inharmonic partials give the metallic tolling character
    const partials: Array<[number, number, number]> = [
      [1, 1, 6.5],
      [2.0, 0.55, 4.2],
      [2.76, 0.4, 3.2],
      [5.4, 0.2, 1.8],
      [8.93, 0.1, 1.0],
    ];
    for (const [ratio, amp, decay] of partials) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq * ratio;
      gain.gain.setValueAtTime(vol * amp * 0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      osc.connect(gain);
      gain.connect(this.master!);
      gain.connect(this.reverbSend!);
      osc.start(t);
      osc.stop(t + decay + 0.1);
    }
  }

  // ------------------------------------------------------------- visibility

  /** Pause when the tab is hidden so music never plays in the background. */
  private bindVisibility(): void {
    if (this.visibilityBound) return;
    this.visibilityBound = true;
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && this.playing) {
        this.pausedByVisibility = true;
        this.audioEl?.pause();
        void this.ctx?.suspend();
      } else if (!document.hidden && this.pausedByVisibility && this.playing) {
        this.pausedByVisibility = false;
        void this.audioEl?.play().catch(() => undefined);
        void this.ctx?.resume();
      }
    });
  }
}

export const doomsdayMusic = new DoomsdayMusicEngine();
