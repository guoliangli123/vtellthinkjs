module.exports = class extends think.Mongo {
  addError(tag) {
    return this.add(tag);
  }
};
