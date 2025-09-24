var tabs = document.querySelectorAll(".tab");
tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        document
            .querySelectorAll(".tab-panel")
            .forEach(function (panel) { return panel.removeAttribute("selected"); });
        tabs.forEach(function (tab) { return tab.removeAttribute("selected"); });
        var clickedTab = tab.getAttribute("data-tab");
        if (clickedTab) {
            var panel = document.querySelector(".tab-panel[data-content=\"".concat(clickedTab, "\"]"));
            if (panel) {
                panel.setAttribute("selected", "");
                tab.setAttribute("selected", "");
            }
        }
    });
});
