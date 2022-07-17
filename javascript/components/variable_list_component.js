// @ts-check

import DeclaredVariable from "../models/declared_variable.js";

class VariableListComponent {

  constructor(elemSelect) {
    /** @private @type {Element} */
    this.elem = document.querySelector(elemSelect);

    this.elem.innerHTML = `
      <button class="var-add-btn">Add Var</button>
      <section class="var-cards-container">
      </section>
    `;

    /** @private */
    this.cardsContainer = this.elem.querySelector(".var-cards-container");
    /** @private */
    this.varAddBtn = /** @type {HTMLButtonElement} */ (this.elem.querySelector(".var-add-btn"));

    this.varAddBtn.onclick = () => {
      if (!this.cardsContainer) return;
      this.cardsContainer.insertAdjacentHTML("beforeend", `<div class="variable-card">
        <input class="variable-name" placeholder="Variable name"/>
        <input class="variable-type" placeholder="Variable type"/>
        <input class="variable-db-name" placeholder="Variable database name"/>
        <input class="variable-json-name" placeholder="Variable json name"/>
        <button class="btn-remove-elem">Remove</button>
      </div>`);
      const addedCard = this.cardsContainer.children.item(this.cardsContainer.children.length - 1);
      const removeBtn = /** @type {HTMLButtonElement} */ (addedCard?.querySelector(".btn-remove-elem"));
      removeBtn.onclick = () => {
        addedCard?.remove();
      }
    }
  }

  /**
   * @returns {DeclaredVariable[]}
   */
  getVariables() {
    if (!this.cardsContainer) return [];
    const declaredVariables = Array.from(this.cardsContainer?.children).map(e => new DeclaredVariable({
      name: /** @type {HTMLInputElement} */ (e.querySelector(".variable-name")).value,
      varType: /** @type {HTMLInputElement} */ (e.querySelector(".variable-type")).value,
      databaseName: /** @type {HTMLInputElement} */ (e.querySelector(".variable-db-name")).value,
      jsonName: /** @type {HTMLInputElement} */ (e.querySelector(".variable-json-name")).value,
    }));
    if (declaredVariables.some(e => !e.isValid())) return [];
    return declaredVariables;
  }

}

export default VariableListComponent;