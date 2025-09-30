const notifToggle = document.getElementById("notifToggle");

if (notifToggle) {
  notifToggle.addEventListener("click", () => {
    const notifPopup = document.getElementById("notifPopup");
    const notifAlert = document.getElementById("notifAlert");

    if (notifPopup) {
      if (notifPopup.hasAttribute("selected"))
        notifPopup.removeAttribute("selected");
      else notifPopup.setAttribute("selected", "");
    
	  const pos = notifToggle.getBoundingClientRect();
      const popupWidth = notifPopup.offsetWidth;
      const pOffsetLeft = pos.left - popupWidth;
      const pOffsetTop = pos.top - 8;

      notifPopup.style.position = "fixed";
      notifPopup.style.left = `${pOffsetLeft}px`;
      notifPopup.style.top = `${pOffsetTop}px`;
    }
    if (notifAlert) {
      if (notifAlert.hasAttribute("selected"))
        notifAlert.removeAttribute("selected");
    }
  });
}
