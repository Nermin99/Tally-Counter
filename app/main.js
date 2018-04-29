//import Substance from './classes/Substance';

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
  substances: []
}

function init() {

  var substances = [
    new Substance("Vitsippa"),
    new Substance("Blåsippa"),
    new Substance("Ros"),
  ];

  View.substances = substances;

  render();
}
init();

function increment(e) {
  console.log(e);
  //View.substances[index].increment();
  //render();
}

function decrement(index) {
  View.substances[index].decrement();
  render();
}

function render() {
  const html = `
        <ul>
          ${ View.substances.map((Substance, index) =>
            `<li class='obj'>
                ${Substance.name}
                <b>${Substance.counter}</b>
                <button onclick="increment(${this})">^</button>
                <button onclick="decrement(this)">v</button>
            </li> <hr>`
          ).join("") }
        </ul>`

  root.innerHTML = html;
}

/**
 * Hotkeys
 */

let hotkeys = [];

let buttons = document.querySelectorAll('li');
buttons.forEach(button => button.addEventListener('click', assignHotkey));

function assignHotkey() {
  console.log("press a key");
  window.addEventListener('keyup', settingHotkey, { once:true });
  window.removeEventListener('keydown', runHotkey);
}

function settingHotkey(e) {
  e.preventDefault();

  const keyCombo = {
    key: e.key,
    alt: e.altKey,
    ctrl: e.ctrlKey,
    shift: e.shiftKey
  }

  console.log("setting key", keyCombo);

  hotkeys.push(keyCombo);
  window.addEventListener('keydown', runHotkey);
}

function runHotkey(e) {
  e.preventDefault();

  const keyCombo = {
    key: e.key,
    alt: e.altKey,
    ctrl: e.ctrlKey,
    shift: e.shiftKey,
  }

  console.log("running key", e.key);

  const substance = hotkeys.find(combo => {
    return JSON.stringify(combo) === JSON.stringify(keyCombo);
  });

  if (!substance) return;
  console.log("incrementing...", substance);
  // increment(e);
}

/**
 * save & load
 */

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