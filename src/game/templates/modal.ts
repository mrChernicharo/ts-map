export class Modal {
  container: Element;
  constructor() {
    this._initTemplate();
  }

  _initTemplate() {
    this.container = document.querySelector('#app');

    const modalTemplate = `
        <div id="tower-modal">
            <h2>Tower Build</h2>
            <main>Tower Name</main>
            <button>Create Tower!</button>
        </div>`;
    this.container.innerHTML += modalTemplate;
  }
}
