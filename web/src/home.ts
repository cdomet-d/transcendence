import './style.css';

const main = document.getElementById('app')!;

export function renderHome(main) {
  main.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-white">
      <a
        href="/game"
        data-link
        id="play-btn"
        class="relative flex items-center justify-center px-20 py-8 rounded-full bg-gradient-to-br from-[#ea9800] to-[#ffcc00] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group text-white font-bold text-5xl uppercase tracking-widest"
        title="Play"
      >
        <span class="absolute inset-0 rounded-full border-2 border-black/80 pointer-events-none"></span>
        <span class="relative z-10">PLAY</span>
      </a>
    </div>
  `;
}
