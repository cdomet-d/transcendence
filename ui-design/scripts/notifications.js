// displays a div on click on one element.
// The toggle must have id="clickable"
// The container to show must have id="notificationIninteractiveWrapper"
// The container to hide must have id="unreadNotificationAlert"
// getElementById returns the first occurence of the id it finds;
// be mindful of id uniqueness!
var clickedDiv = document.getElementById("clickable");
if (clickedDiv) {
    clickedDiv.addEventListener("click", function () {
        var notificationIninteractiveWrapper = document.getElementById("notificationIninteractiveWrapper");
        var unreadNotificationAlert = document.getElementById("unreadNotificationAlert");
        if (notificationIninteractiveWrapper) {
            if (notificationIninteractiveWrapper.hasAttribute("selected"))
                notificationIninteractiveWrapper.removeAttribute("selected");
            else
                notificationIninteractiveWrapper.setAttribute("selected", "");
        }
        if (unreadNotificationAlert) {
            if (unreadNotificationAlert.hasAttribute("selected"))
                unreadNotificationAlert.removeAttribute("selected");
        }
    });
}
