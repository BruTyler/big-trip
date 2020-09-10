export const AdapterDecorator = (superclass = Object) => class extends superclass {
  static adaptToClient(_serverStructure) {
    throw new Error(`Not implemented adaptToClient`);
  }

  static adaptToServer(_clientStructure) {
    throw new Error(`Not implemented adaptToServer`);
  }
};

// eslint-disable-next-line new-cap
export default AdapterDecorator(Object);
