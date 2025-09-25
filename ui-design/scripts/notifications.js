// displays a div on click on one element.
// The toggle must have id="clickable"
// The container to show must have id="notificationInteractiveWrapper"
// The container to hide must have id="unreadNotificationAlert"
// getElementById returns the first occurence of the id it finds;
// be mindful of id uniqueness!
var clickedDiv = document.getElementById("clickable");
if (clickedDiv) {
    clickedDiv.addEventListener("click", function () {
        var notificationInteractiveWrapper = document.getElementById("notificationInteractiveWrapper");
        var unreadNotificationAlert = document.getElementById("unreadNotificationAlert");
        if (notificationInteractiveWrapper) {
            if (notificationInteractiveWrapper.hasAttribute("selected"))
                notificationInteractiveWrapper.removeAttribute("selected");
            else
                notificationInteractiveWrapper.setAttribute("selected", "");
        }
        if (unreadNotificationAlert) {
            if (unreadNotificationAlert.hasAttribute("selected"))
                unreadNotificationAlert.removeAttribute("selected");
        }
    });
}
