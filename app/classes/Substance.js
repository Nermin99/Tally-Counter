class Substance {
  constructor(name, id, keyCombo = null, zoom = "100x") {
    this.counter = 0;
    this.id = id;
    this.keyCombo = keyCombo;
    this.name = name;
    this.zoom = zoom;
  }
}

// export default Substance;