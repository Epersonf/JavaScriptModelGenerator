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

  /** @returns {string} */
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
      return `      ${this.name}: ${this.isNullable() ? `"${this.databaseName}" in dict ? ` : ""}${this.getSingleType()}.fromRemote(dict.${this.databaseName})${this.isNullable() ? ` : null` : ""},`;
    } else {
      return `      ${this.name}: ${this.isNullable() ? `"${this.databaseName}" in dict ? ` : ""}dict.${this.databaseName}.map(e => ${this.getSingleType()}.fromRemote(e))${this.isNullable() ? ` : null` : ""},`;
    }
  }
  
  /** @returns {string} */
  getToJSON() {
    if (this.isTypeAcceptedByJSON()) {
      return `      ${this.jsonName}: this.${this.name},`;
    } else if (!this.isArray()) {
      return `      ${this.jsonName}: this.${this.name}${this.isNullable() ? "?" : ""}.toJSON(),`;
    } else {
      return `      ${this.jsonName}: this.${this.name}${this.isNullable() ? "?" : ""}.map(e => e.toJSON()),`;      
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
    return this.varType.endsWith("[]") || this.varType.endsWith("[]?");
  }

  /** @returns {boolean} */
  isNullable() {
    return this.varType.endsWith("?");
  }

  /** @returns {boolean} */
  isValid() {
    return Boolean(this.name && this.varType && this.databaseName && this.jsonName);
  }

  /** @returns {string} */
  getSingleType() {
    if (this.varType.endsWith("[]")) return this.varType.slice(0, -2);
    if (this.varType.endsWith("[]?")) return this.varType.slice(0, -3);
    return this.varType;
  }
}

export default DeclaredVariable;