// @ts-check

class DeclaredVariable {
  
  /**
   * @param {{
   *  name: string,
   *  varType: string,
   *  databaseName: string,
   *  jsonName: string,
   * }} params 
   */
  constructor({name, varType, databaseName, jsonName}) {
    this.name = name;
    this.varType = varType;
    this.databaseName = databaseName;
    this.jsonName = jsonName;
  }

  getJSDOCHeader() {
    return `  *  ${this.name}: ${this.varType},`;
  }

  /** @returns {string} */
  getName() {
    return `   ${this.name},`;
  }
  
  /** @returns {string} */
  getConstructor() {
    return `    this.${this.name} = ${this.name};`;
  }

  /** @returns {string} */
  getFromRemote() {
    if (this.isTypeAcceptedByJSON()) {
      return `      ${this.name}: dict.${this.databaseName},`;
    } else if (!this.isArray()) {
      return `      ${this.name}: ${this.varType}.fromRemote(dict.${this.databaseName}),`;
    } else {
      return `      ${this.name}: dict.${this.databaseName}.map(e => ${this.varType.slice(0, -2)}.fromRemote(e)),`;
    }
  }

  getToJSON() {
    if (this.isTypeAcceptedByJSON()) {
      return `      ${this.jsonName}: this.${this.name},`;
    } else if (!this.isArray()) {
      return `      ${this.jsonName}: this.${this.name}.toJSON(),`;
    } else {
      return `      ${this.jsonName}: this.${this.name}.map(e => e.toJSON()),`;      
    }
  }

  /** @returns {boolean} */
  isTypeAcceptedByJSON() {
    if (this.varType.startsWith("number")) return true;
    if (this.varType.startsWith("string")) return true;
    if (this.varType.startsWith("boolean")) return true;
    return false;
  }
  
  /** @returns {boolean} */
  isArray() {
    return this.varType.endsWith("[]");
  }

  /** @returns {boolean} */
  isValid() {
    return Boolean(this.name && this.varType && this.databaseName && this.jsonName);
  }
}

export default DeclaredVariable;