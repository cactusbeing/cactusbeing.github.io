export type BakerySound = 'pickup' | 'drop' | 'return' | 'bake' | 'success' | 'retry';
type Tone = [frequency: number, offset: number, duration: number];
const tones: Record<BakerySound, Tone[]> = {
  pickup: [[740, 0, .06]],
  drop: [[520, 0, .07], [780, .035, .09]],
  return: [[520, 0, .065], [390, .04, .08]],
  bake: [[880, 0, .18], [1320, .07, .2]],
  success: [[523.25, 0, .18], [659.25, .1, .18], [783.99, .2, .18], [1046.5, .32, .26]],
  retry: [[392, 0, .1], [329.63, .09, .12]],
};

export function createBakerySound() {
  let context: AudioContext | null = null;
  let output: GainNode | null = null;
  let enabled = true;
  let lastPlayed = -Infinity;
  const supported = typeof window !== 'undefined' && typeof window.AudioContext === 'function';
  function setEnabled(value: boolean) {
    enabled = value;
    if (context && output) {
      output.gain.cancelScheduledValues(context.currentTime);
      output.gain.value = value ? .055 : 0;
    }
  }
  function play(sound: BakerySound) {
    if (!enabled || !supported) return;
    try {
      if (!context) {
        context = new window.AudioContext();
        output = context.createGain(); output.gain.value = .055; output.connect(context.destination);
      }
      if (context.state === 'closed') return;
      if (context.state === 'suspended') void context.resume().catch(() => {});
      const now = context.currentTime;
      if (sound !== 'success' && now - lastPlayed < .035) return;
      lastPlayed = now;
      for (const [frequency, offset, duration] of tones[sound]) {
        const oscillator = context.createOscillator();
        const envelope = context.createGain();
        const start = now + .005 + offset;
        oscillator.type = sound === 'bake' ? 'sine' : 'triangle';
        oscillator.frequency.setValueAtTime(frequency, start);
        envelope.gain.setValueAtTime(.0001, start);
        envelope.gain.exponentialRampToValueAtTime(.35, start + .008);
        envelope.gain.exponentialRampToValueAtTime(.0001, start + duration);
        oscillator.connect(envelope); envelope.connect(output!);
        oscillator.start(start); oscillator.stop(start + duration + .01);
        oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
      }
    } catch { /* Audio availability never interrupts the teaching activity. */ }
  }
  function dispose() { if (context && context.state !== 'closed') void context.close().catch(() => {}); }
  return { supported, play, setEnabled, dispose };
}
