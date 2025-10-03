import { createUploadInput, createInputGrp } from "./web-element-helpers/inputs/fields-helper-modules.js";
import { createHeading } from "./web-element-helpers/typography/typo-helper-modules.js";
import { createRadioBtn, createCheckbox } from "./web-element-helpers/inputs/buttons-helper-modules.js";
import { createBtn } from "./web-element-helpers/navigation/nav-helper-modules.js";

window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});

const wrapper = document.createElement("div");
wrapper.classList.add("grid", "gap-6", "justify-center", "w-[100vw]");

wrapper.appendChild(createHeading("1", "Heading 1"));
wrapper.appendChild(createHeading("2", "Heading 2"));
wrapper.appendChild(createHeading("3", "Heading 3"));
wrapper.appendChild(createUploadInput("upload"));
wrapper.appendChild(
  createInputGrp(
    "text",
    "Username",
    "username",
    "^[a-zA-Z0-9]{4,18}$",
    "Username"
  )
);
wrapper.appendChild(createBtn("test"));
wrapper.appendChild(createRadioBtn("radio", "test"));
wrapper.appendChild(createCheckbox("check", "test"));

document.body.append(wrapper);

if (import.meta.hot) {
  import.meta.hot.accept();
}
