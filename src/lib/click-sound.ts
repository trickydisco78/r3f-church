/**
 * A synthesized "switch" tick for the theme toggle. No audio file: it is built with the Web Audio
 * API when needed.
 *
 * It is a single short burst of white noise that fades out very steeply (so it is a sharp tick, not a
 * hiss), shaped by a high-pass filter and then a resonant band-pass filter that gives it its bright,
 * plastic character. The band-pass sits a little higher when switching to dark. Kept deliberately
 * simple and quiet: a tiny low thump or a second "clack" made it sound heavy rather than crisp.
 *
 * To use a recorded sample instead, play an AudioBuffer in playToggleClick() and drop this synth.
 */

const DURATION = 0.022; // seconds
const HIGHPASS_HZ = 2000;
const BANDPASS_Q = 1.6;
const LIGHT_BANDPASS_HZ = 4500;
const DARK_BANDPASS_HZ = 6000;
const LEVEL = 0.45;

/** Builds the tick into `c`, starting at time `at`. Exported so it can also be rendered offline. */
export function renderToggleClick(c: BaseAudioContext, toDark: boolean, at = c.currentTime) {
  // White noise with a steep (power-5) fade-out baked into the samples.
  const frames = Math.floor(c.sampleRate * DURATION);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / frames, 5);

  const source = c.createBufferSource();
  source.buffer = buffer;

  // High-pass keeps only the crisp top end; the band-pass adds a resonant peak.
  const highpass = c.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = HIGHPASS_HZ;

  const bandpass = c.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = toDark ? DARK_BANDPASS_HZ : LIGHT_BANDPASS_HZ;
  bandpass.Q.value = BANDPASS_Q;

  const gain = c.createGain();
  gain.gain.value = LEVEL;

  source.connect(highpass).connect(bandpass).connect(gain).connect(c.destination);
  source.start(at);
}

let ctx: AudioContext | null = null;

/**
 * Plays the tick. Only call from a user click (browsers block audio before a gesture).
 * Skipped when the visitor prefers reduced motion. Never throws.
 */
export function playToggleClick(toDark: boolean) {
  try {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx ??= new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    renderToggleClick(ctx, toDark);
  } catch {
    /* audio is a nicety; ignore any failure */
  }
}
