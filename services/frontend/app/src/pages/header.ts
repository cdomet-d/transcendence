export function renderHeader(): string {
	return `
	<header class="w-full bg-amber-200 text-white px-4 py-2 flex items-center justify-between shadow">
		<!-- Logo and Site Title -->
		<div class="flex items-center space-x-3 flex-shrink-0">
			<img src="src/images/sunflower.svg" alt="BigT Pong Logo" class="h-10 w-10 object-contain"/>
			<span class="text-2xl font-bold text-black">BigT Pong</span>
		</div>

		<!-- Center/Left Search + Leaderboard -->
		<div class="flex flex-1 items-center justify-center relative max-w-xl ml-12 mr-4">
			<input id="search-bar"
				type="search"
				placeholder="Search someone's profile..."
				class="w-72 px-4 py-2 rounded-full bg-amber-50 text-gray-800 focus:outline-none shadow"
			/>
			<button
				class="ml-4 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
			>
				Leaderboard
			</button>
		</div>

		<!-- Profile Button -->
		<button class="ml-8 flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 rounded-full px-4 py-2 transition">
			<svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
				<circle cx="12" cy="8" r="4"></circle>
				<path d="M6 20c0-2 4-3 6-3s6 1 6 3"></path>
			</svg>
			<span>Profile</span>
		</button>
	</header>
	`
}
