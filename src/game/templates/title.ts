export class Title extends HTMLElement {
  constructor(private container: Element) {
    super();
    this.textContent = 'Hello Map';
    this.innerHTML = `<div><h1>${this.textContent}</h1></div>`;
    this.style.border = '2px solid blue';

    this.container.appendChild(this);
  }
}
