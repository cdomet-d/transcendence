import { menuButton } from "./atoms.js";

const wrap = document.createElement('div');
const cont = document.createElement('div');
const test = document.createElement('button', { is: 'menu-button' }) as menuButton;

console.log("this script is running");

cont.classList.add('flex', 'justify-center','items-center', 'w-[100%]', 'h-[15rem]')
wrap.classList.add('w-[200px]', 'h-[100px]');
test.render("Hello");

wrap.appendChild(test);
cont.appendChild(wrap);
document.body.append(cont);

if (import.meta.hot) {
  import.meta.hot.accept()
}
