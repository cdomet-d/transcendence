export function render404(main: HTMLElement | null): void {
  if (!main) return ;
  main.innerHTML = `
  <div class="container">
    <img src="src/images/capybara.webp" alt="capy" style="width:100%;">
  </div>
  `
}
