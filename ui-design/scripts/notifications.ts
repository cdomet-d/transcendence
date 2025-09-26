// displays a div on click on one element.
// The toggle must have id="notifToggle"
// The container to show must have id="notifPopup"
// The container to hide must have id="notifAlert"
// getElementById returns the first occurence of the id it finds;
// be mindful of id uniqueness!

const clickedDiv = document.getElementById("notifToggle");

if (clickedDiv) {
  clickedDiv.addEventListener("click", () => {
    const notifPopup = document.getElementById("notifPopup");
    const notifAlert = document.getElementById("notifAlert");

    if (notifPopup) {
      if (notifPopup.hasAttribute("selected"))
        notifPopup.removeAttribute("selected");
      else notifPopup.setAttribute("selected", "");
    
	  const pos = clickedDiv.getBoundingClientRect();
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
