import { menuButton } from "./atoms";
const wrap = document.createElement('div');
const test = document.createElement('button', { is: 'menu-button' });
console.log("this script is running");
wrap.classList.add('flex', 'justify-center', 'w-[100px]', 'h-[100px]');
test.render('Hello');
wrap.appendChild(test);
document.body.append(wrap);
const paragraph = document.createElement('p');
paragraph.textContent = 'HELLO IS ANYONEHERE';
document.body.append(paragraph);
//# sourceMappingURL=test.js.map