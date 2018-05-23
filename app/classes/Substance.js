class Substance {
  constructor(name, id, keyCombo = null, zoom = "100x") {
    this.id = id;
    this.name = name;
    this.counter = 0;
    if (keyCombo) this.setKeyCombo(keyCombo);
    this.zoom = zoom;
  }

  increment() {
    this.counter++;
  };

  decrement() {
    if (this.counter == 0) return;
    this.counter--;
  };

  setKeyCombo(keyCombo) {
    this.keyCombo = keyCombo;
  }

  setZoom(zoom) {
    this.zoom = zoom
  }

}

// export default Substance;