class Substance {
  constructor(name, id, keyCombo = null, zoom = "100x") {
    this.name = name;
    this.id = id;
    this.keyCombo = keyCombo;
    this.zoom = zoom;
    this.counter = 0;
  }
}

// export default Substance;