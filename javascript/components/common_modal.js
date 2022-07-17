// @ts-check

class CommonModal {

  /**
   * 
   * @param {{
   *  title: string,
   *  message: string,
   *  buttons?: {
   *    text: string,
   *    onclick: (close: () => void) => any,
   *  }[]
   * }} params 
   * @returns 
   */
  static showModal({title, message, buttons=[{text: "Ok", onclick: (close) => close()}]}) {
    const modal = CommonModal.getModal();
    if (!modal) return;
    modal.style.display = "flex";
    const titleField = modal.querySelector(".commmon-modal-alert-title");
    const textField = modal.querySelector(".common-modal-alert-text");
    const buttonsContainer = modal.querySelector(".common-modal-alert-buttons-div");
    if (!titleField || !textField || !buttonsContainer) return;
    titleField.innerHTML = title;
    textField.innerHTML = message;
    buttonsContainer.innerHTML = "";
    buttons.forEach((button) => {
      buttonsContainer.insertAdjacentHTML("beforeend", `<button style="width: 100%;">${button.text}</button>`);
      const addedButton = /** @type {HTMLButtonElement} */ (buttonsContainer.children.item(buttonsContainer.children.length - 1));
      addedButton.onclick = () => button.onclick(CommonModal.closeModal);
    });
  }

  static closeModal() {
    const modal = CommonModal.getModal();
    if (!modal) return;
    modal.style.display = "none";
  }

  /**
   *  @private
   *  @returns {HTMLElement?}
   */
  static getModal() {
    let modal = document.getElementById("common_modal_alert");
    if (modal) return modal;
    document.body.insertAdjacentHTML("beforeend", `<div id="common_modal_alert" style="display: none; flex-direction: column; position: fixed; z-index: 1; left: 50%; top: 50%; transform: translate(-50%, -50%); gap: 1em; border-radius: 10px; background-color: #ddd; padding: 16px; box-shadow: 0px 0px 30px #333f;">
      <h3 class="commmon-modal-alert-title" style="font-size: 1.5em; font-weight: bold;"></h3>
      <p class="common-modal-alert-text"></p>
      <div class="common-modal-alert-buttons-div" style="display: flex; flex-direction: column; gap: .2em;"></div>
    </div>`);
    return document.getElementById("common_modal_alert");
  }

}

export default CommonModal;