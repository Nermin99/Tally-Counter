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
  hotkeys: [],
  substances: []
}

function init() {

  var substances = [
    new Substance("Vitsippa", 0),
    new Substance("Blåsippa", 1),
    new Substance("Ros", 2),
  ];

  View.substances = substances;

  render();
}
init();

function increment(id) {
  const substance = View.substances.find(sub => sub.id==id)
  substance.increment();
  render();
}

function decrement(id) {
  const substance = View.substances.find(sub => sub.id==id)
  substance.decrement();
  render();
}

function addNew(substance) {
  // Kolla så att ID är unikt
  // Exempelvis array.length + 1;
  View.substances.push(substance);
  render();
}

function render() {
  const html = `
        <ul>
          ${ View.substances.map((substance) => {
            const hotKey = View.hotkeys.find(viewHotkeys => viewHotkeys.id === substance.id);
            return `<li class='obj' onclick="assignHotkey(${substance.id})">
                ${substance.name}
                <b>${substance.counter}</b>
                <button onclick="increment(${substance.id})">^</button>
                <button onclick="decrement(${substance.id})">v</button>
                <span>${hotKey ? hotKey.keyCombo.key : 'no key'}</span>
            </li> <hr>`}
          ).join("") }
        </ul>`

  root.innerHTML = html;
}

/**
 * Hotkeys
 */

function assignHotkey(id) {
  console.log("press a key");
  window.removeEventListener('keyup', settingHotkey);
  window.addEventListener('keyup', (e) => {settingHotkey(id, e)}, { once:true });
  window.removeEventListener('keydown', runHotkey);
}

function settingHotkey(id, e) {
  e.preventDefault();

  let hotkey = {
    id: null,
    keyCombo: {
      key: e.key,
      alt: e.altKey,
      ctrl: e.ctrlKey,
      shift: e.shiftKey
    }
  }

  // If exist
  const shortcut = View.hotkeys.find(viewHotkey => {
    return JSON.stringify(viewHotkey.keyCombo) === JSON.stringify(hotkey.keyCombo);
  });

  // Replaces existing hotkey
  if (shortcut) {
    // if exist
    const replaced = View.hotkeys.find(viewHotkey => viewHotkey.id === id);
    if (replaced) {
      View.hotkeys.splice(View.hotkeys.indexOf(replaced), 1);
    }
    shortcut.id = id;

    console.log(`replaced key with ${shortcut.keyCombo.key}`);
  }

  if (!shortcut) {
    // if exist
    const replaced = View.hotkeys.find(viewHotkey => viewHotkey.id === id);
    if (replaced) {
      View.hotkeys.splice(View.hotkeys.indexOf(replaced), 1);
    }

    hotkey.id = id;
    View.hotkeys.push(hotkey);
    console.log("setting key", hotkey.keyCombo.key);
  }

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

  const hotKey = View.hotkeys.find(viewHotkeys => {
    return JSON.stringify(viewHotkeys.keyCombo) === JSON.stringify(keyCombo);
  });

  if (!hotKey) return;
  increment(hotKey.id);
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