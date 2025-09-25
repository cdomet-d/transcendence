const clickedDiv = document.getElementById("pwHintTrigger");

if (clickedDiv) {
  clickedDiv.addEventListener("click", () => {
    const pwHint = document.getElementById("pwHint");

    if (pwHint) {
      if (pwHint.hasAttribute("selected")) pwHint.removeAttribute("selected");
      else pwHint.setAttribute("selected", "");
    }
  });
}
