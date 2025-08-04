import './style.css'

export function renderProfile(main) {
	main.innerHTML = `
	<div class="absolute inset-x-200 bottom-0 h-16">
	<a
        href="/game"
        data-link
        id="back-btn"
        class="mt-4 py-3 px-8 rounded-full border-1 border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold"
      >
        Back
      </a>
	</div>
  `;
}
