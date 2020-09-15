export const mixAdapter = (superclass = Object) => class extends superclass {
  static adaptToClient(_serverStructure) {
    throw new Error(`Not implemented adaptToClient`);
  }

  static adaptToServer(_clientStructure) {
    throw new Error(`Not implemented adaptToServer`);
  }
};

export default mixAdapter(Object);
