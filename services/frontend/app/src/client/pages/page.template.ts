type NavButton = {
	href: string;
	label: string;
};

interface Element {
	title: string;
	nextButtons?: NavButton[];
	backHref?: string;
	showBack?: boolean;
	homeHref?: string;
}

export function renderPageTemplate({
	title,
	nextButtons = [],
	backHref,
	showBack = true,
	homeHref = "/"
}: Element): string {
	const htmlPage = `
		<div class="pt-12 text-center text-2xl font-bold">${title}</div>
		<div class="flex justify-center mt-32 gap-8">
			${nextButtons.map(btn => `
				<a
					href="${btn.href}"
					data-link
					class="py-6 px-20 rounded-full border-2 border-black bg-gradient-to-br from-[#8be300] to-[#12a51a] shadow-lg hover:scale-110 transition-all text-white text-2xl font-semibold"
				>
					${btn.label}
				</a>
			`).join('')}
		</div>
		<div class="fixed inset-x-0 bottom-0 flex justify-center gap-4 mb-2">
			${showBack && backHref ? `
				<a
					href="${backHref}"
					data-link
					id="back-btn"
					class="py-3 px-8 rounded-full border border-black bg-gradient-to-br from-[#ffcc00] to-[#ea9800] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold"
				>
					Back
				</a>
			` : ''}
			<a
				href="${homeHref}"
				data-link
				id="home-btn"
				class="py-3 px-8 rounded-full border border-black bg-gradient-to-br from-[#ff0000] to-[#ea0075] shadow-md hover:scale-105 transition-all text-white text-lg font-semibold"
			>
				HOME
			</a>
		</div>
	`;
	return htmlPage;
}
