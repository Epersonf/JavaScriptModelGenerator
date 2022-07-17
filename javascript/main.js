// @ts-check

import CommonModal from "./components/common_modal.js";
import VariableListComponent from "./components/variable_list_component.js";

const classNameInput = /** @type {HTMLInputElement} */ (document.querySelector("#class_name_input"));
const useES6Toggle = /** @type {HTMLInputElement} */ (document.querySelector("#use_es6_toggle"));
const generateButton = /** @type {HTMLButtonElement} */ (document.querySelector("#generate_button"));
const variableListComponent = new VariableListComponent("#variables_container");

const outputTextArea = /** @type {HTMLTextAreaElement} */ (document.querySelector("#model_output_textarea"));
const copyModelButton = /** @type {HTMLButtonElement} */ (document.querySelector("#copy_model_button"));

generateButton.onclick = () => {
  const className = classNameInput.value;
  const isUsingES6 = useES6Toggle.checked;

  if (!className) {
    CommonModal.showModal({ title: "Error", message: "No class name provided.", });
    return;
  } else if (variableListComponent.getVariables().length <= 0) {
    CommonModal.showModal({ title: "Error", message: "Invalid variables.", });
    return;
  }

  outputTextArea.innerHTML = `// @ts-check

${isUsingES6 ? `export ` : ""}class ${className} {
  /**
  * @param {{
${variableListComponent.getVariables().map(e => e.getJSDOCHeader()).join("\n")}
  * }} params
  */
  constructor({
${variableListComponent.getVariables().map(e => e.getName()).join("\n")}
  }) {
${variableListComponent.getVariables().map(e => e.getConstructor()).join("\n")}
  }

  /** 
  * @param {Object} dict
  * @returns {${className}}
  */
  static fromRemote(dict) {
    return new ${className}({
${variableListComponent.getVariables().map(e => e.getFromRemote()).join("\n")}
    });
  }

  /** @returns {Object} */
  toJSON() {
    return {
${variableListComponent.getVariables().map(e => e.getToJSON()).join("\n")}
    };
  }
}

${!isUsingES6 ? `module.exports = { ${className} };` : ""}`;
}

copyModelButton.onclick = () => {
  navigator.clipboard.writeText(outputTextArea.value);
  CommonModal.showModal({
    title: "Success!",
    message: "Model copied successfully."
  });
}