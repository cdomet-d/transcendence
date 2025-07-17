import './style.css';
import { renderGame } from './game';

const main = document.getElementById('main-content')!;

function renderHome() {
  main.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-white">
      <button
        id="play-btn"
        class="relative flex items-center justify-center px-20 py-8 rounded-full bg-gradient-to-br from-[#ea9800] to-[#ffcc00] shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group text-white font-bold text-5xl uppercase tracking-widest"
        title="Play"
      >
        <span class="absolute inset-0 rounded-full border-2 border-black/80 pointer-events-none"></span>
        <span class="relative z-10">PLAY</span>
      </button>
    </div>
  `;
  document.getElementById('play-btn')!.onclick = () =>
    renderGame(main, renderHome);
}

// Render the home screen on load
renderHome();
