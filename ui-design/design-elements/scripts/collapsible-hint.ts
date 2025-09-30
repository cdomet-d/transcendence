const hintToggle = document.getElementById("pwHintTrigger");

if (hintToggle) {
  hintToggle.addEventListener("click", () => {
    const pwHint = document.getElementById("pwHint");

    if (pwHint) {
      if (pwHint.hasAttribute("selected")) pwHint.removeAttribute("selected");
      else pwHint.setAttribute("selected", "");
    }
  });
}
