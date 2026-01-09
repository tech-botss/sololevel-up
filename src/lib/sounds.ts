// Sound effects using Web Audio API

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
  } catch {
    return null;
  }
}

function playTone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume: number = 0.15,
  type: OscillatorType = 'sine'
) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

// Satisfying chime when quest complete button unlocks
export function playUnlockChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Bright ascending chime
  playTone(ctx, 880, now, 0.12, 0.12);        // A5
  playTone(ctx, 1108.73, now + 0.08, 0.12, 0.15); // C#6
  playTone(ctx, 1318.51, now + 0.16, 0.25, 0.18); // E6 (hold)
}

// Epic achievement unlock sound (already exists, but centralized here)
export function playAchievementSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Epic unlock sound sequence
  playTone(ctx, 523.25, now, 0.15, 0.2);         // C5
  playTone(ctx, 659.25, now + 0.1, 0.15, 0.2);   // E5
  playTone(ctx, 783.99, now + 0.2, 0.15, 0.2);   // G5
  playTone(ctx, 1046.50, now + 0.3, 0.4, 0.25);  // C6 (hold)
  playTone(ctx, 1318.51, now + 0.35, 0.4, 0.15); // E6 (shimmer)
}

// Coin/purchase sound
export function playPurchaseSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Coin drop + sparkle
  playTone(ctx, 1396.91, now, 0.08, 0.15);       // F6
  playTone(ctx, 1760, now + 0.05, 0.08, 0.12);   // A6
  playTone(ctx, 2093.00, now + 0.1, 0.15, 0.1);  // C7
  playTone(ctx, 2637.02, now + 0.15, 0.2, 0.08); // E7 (sparkle)
}

// Error/denied sound
export function playErrorSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Low buzz
  playTone(ctx, 150, now, 0.15, 0.15, 'square');
  playTone(ctx, 140, now + 0.12, 0.15, 0.12, 'square');
}

// Click/tap feedback
export function playClickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(ctx, 1000, now, 0.05, 0.08);
}
