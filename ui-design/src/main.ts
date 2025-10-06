import * as inputs from "./web-element-helpers/inputs/fields-helper-modules.js";
import * as typography from "./web-element-helpers/typography/typo-helper-modules.js";
import * as formBtns from "./web-element-helpers/inputs/buttons-helper-modules.js";
import * as nav from "./web-element-helpers/navigation/nav-helper-modules.js";

import type { Tab } from "./web-elements/navigation/tabs.js";
import type { InputField } from "./web-element-helpers/inputs/fields-helper-modules.js";

const tabs: Array<Tab> = [
  { id: "history", content: "Game history", default: true },
  { id: "stats", content: "Statistics", default: false },
  { id: "friends", content: "Friends", default: false },
];

const fieldData: InputField = {
  type: "text",
  pattern: "^[a-zA-Z0-9]{4,18}$",
  id: "username",
  placeholder: "Enter your username [Aa - Zz, 4 - 18 char]",
  labelContent: "Username",
};

window.addEventListener("error", (e) => {
  console.error("Global error:", e.error);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});

const wrapper = document.createElement("div");
wrapper.classList.add("grid", "gap-6", "justify-center", "w-[100vw]", "pad-sm");

try {
  wrapper.appendChild(typography.createHeading("1", "Heading 1"));
  wrapper.appendChild(typography.createHeading("2", "Heading 2"));
  wrapper.appendChild(typography.createHeading("3", "Heading 3"));
  wrapper.appendChild(inputs.createUploadInput("upload"));
  wrapper.appendChild(inputs.createInputGrp(fieldData));
  wrapper.appendChild(formBtns.createRadioBtn("radio", "test"));
  wrapper.appendChild(formBtns.createCheckbox("check", "test"));
  wrapper.appendChild(nav.createBtn("test"));
  wrapper.appendChild(nav.createTabs(tabs));
} catch (error) {
  console.log("[ERROR}", error);
}

document.body.append(wrapper);

if (import.meta.hot) {
  import.meta.hot.accept();
}
