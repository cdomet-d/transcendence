const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll<HTMLElement>(".tab-panel")
      .forEach((panel) => panel.removeAttribute("selected"));
	tabs.forEach(tab => tab.removeAttribute("selected"));
   
    const clickedTab = tab.getAttribute("data-tab");
    if (clickedTab) {
      const panel = document.querySelector<HTMLElement>(
        `.tab-panel[data-content="${clickedTab}"]`
      );
      if (panel) {
        panel.setAttribute("selected", "");
		tab.setAttribute("selected", "");
      }
    }
  });
});
