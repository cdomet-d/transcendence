// displays a div on click on one element.
// The toggle must have id="notifToggle"
// The container to show must have id="notifPopup"
// The container to hide must have id="notifAlert"
// getElementById returns the first occurence of the id it finds;
// be mindful of id uniqueness!
var clickedDiv = document.getElementById("notifToggle");
if (clickedDiv) {
    clickedDiv.addEventListener("click", function () {
        var notifPopup = document.getElementById("notifPopup");
        var notifAlert = document.getElementById("notifAlert");
        if (notifPopup) {
            if (notifPopup.hasAttribute("selected"))
                notifPopup.removeAttribute("selected");
            else
                notifPopup.setAttribute("selected", "");
            var pos = clickedDiv.getBoundingClientRect();
            var popupWidth = notifPopup.offsetWidth;
            var pOffsetLeft = pos.left - popupWidth;
            var pOffsetTop = pos.top - 8;
            notifPopup.style.position = "fixed";
            notifPopup.style.left = "".concat(pOffsetLeft, "px");
            notifPopup.style.top = "".concat(pOffsetTop, "px");
        }
        if (notifAlert) {
            if (notifAlert.hasAttribute("selected"))
                notifAlert.removeAttribute("selected");
        }
    });
}
