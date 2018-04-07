//import Bacteria from './classes/Bacteria';

/**
 * Global
 * NODEs
 */
const root = document.querySelector("#root");

/**
 * Objects
 */

let View = {
  // title: '',
  // date: '',
  hotkeys: {},
  bacterias: []
}

let Hotkey = {
  97: ''
}

function init() {

  var bacterias = [
    new Bacteria("Vitsippa"),
    new Bacteria("Blåsippa"),
    new Bacteria("Ros"),
  ];

  View.bacterias = bacterias;

  render();
}
init();

function increment(index) {
  View.bacterias[index].increment();
  render();
}

function decrement(index) {
  View.bacterias[index].decrement();
  render();
}

function render() {
  const html = `
        <ul>
          ${ View.bacterias.map((bacteria, index) =>
            `<li>
                ${bacteria.name}
                <b>${bacteria.counter}</b>
                <button onclick="increment(${index})">^</button>
                <button onclick="decrement(${index})">v</button>
            </li>`
          ).join("") }
        </ul>`

    root.innerHTML = html;
}

function save(key, value) {
  try {
    const data = JSON.stringify(value);
    localStorage.setItem(key, data);
  }  catch(error) {
    console.error("CANT SAVE", error);
  }
}

function load(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    console.error("CANT LOAD", error);
  }
}