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
    new Substance("Vitsippa", 1),
    new Substance("Blåsippa", 2),
    new Substance("Ros", 3),
    new Substance("Vass", 4),
    new Substance("Säv", 5),
    new Substance("Kaveldun", 6),
    new Substance("Gul", 7),
    new Substance("Natearter", 8),
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

  const sub = new Substance("", View.substances.length + 1);
  View.substances.push(sub);
  render();
}

function render() {
  const html = `
        <table id="table" class="table table-striped table-bordered table-hover">
          <thead class="thead-dark">
            <th scope="col">#</th>
            <th scope="col">Ämne</th>
            <th scope="col">Hotkey</th>
            <th scope="col">Zoom</th>
            <th scope="col">Antal</th>
          </thead>
          <tbody>
          ${ View.substances.map((substance) => {
            const hotKey = View.hotkeys.find(viewHotkeys => viewHotkeys.id === substance.id);
            return `
              <tr>
                <td>${substance.id}</td>
                <td class="substance" contenteditable="true">${substance.name}</td>
                <td class="hotkey" onclick="assignHotkey(${substance.id})">${hotKey ? hotKey.keyCombo.shift ? "shift +" : "" : ""} ${hotKey ? hotKey.keyCombo.ctrl ? "ctrl +" : "" : ""} ${hotKey ? hotKey.keyCombo.alt ? "alt +" : "" : ""} ${hotKey ? hotKey.keyCombo.key : 'no key'}</td>
                <td class="zoom" contenteditable="true">100x</td>
                <th class="counter">${substance.counter}</th>
              </tr>` }
            ).join("") }

              <tr>
                <th class="pointer" colspan="5" onclick="addNew()">
                  <img>
                  Lägg Till
                </th>
              </tr>
          </tbody>
        </table>`

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

  let key = String.fromCharCode(e.keyCode);
  // Å Ä Ö
  switch (e.keyCode) {
    case 219:
      key = "Å";
      break;
    case 222:
      key = "Ä";
      break;
    case 186:
      key = "Ö"
  }

  let hotkey = {
    id: null,
    keyCombo: {
      key: key,
      alt: e.altKey,
      ctrl: e.ctrlKey,
      shift: e.shiftKey
    }
  }

  // If shortcut exists
  const shortcut = View.hotkeys.find(viewHotkey => {
    return JSON.stringify(viewHotkey.keyCombo) === JSON.stringify(hotkey.keyCombo);
  });

  // Replaces existing hotkey
  if (shortcut) {
    // if substance already has shortcut
    const replaced = View.hotkeys.find(viewHotkey => viewHotkey.id === id);
    if (replaced) {
      View.hotkeys.splice(View.hotkeys.indexOf(replaced), 1);
    }
    shortcut.id = id;

    console.log(`replaced key with ${shortcut.keyCombo.key}`);
  } else {
    // if substance already has shortcut
    const replaced = View.hotkeys.find(viewHotkey => viewHotkey.id === id);
    if (replaced) {
      View.hotkeys.splice(View.hotkeys.indexOf(replaced), 1);
    }

    hotkey.id = id;
    View.hotkeys.push(hotkey);
    console.log("setting key", hotkey.keyCombo.key);
  }

  render();
  window.addEventListener('keydown', runHotkey);
}

function runHotkey(e) {
  e.preventDefault();

  let key = String.fromCharCode(e.keyCode);
  // Å Ä Ö
  switch (e.keyCode) {
    case 219:
      key = "Å";
      break;
    case 222:
      key = "Ä";
      break;
    case 186:
      key = "Ö"
  }

  const keyCombo = {
    key: key,
    alt: e.altKey,
    ctrl: e.ctrlKey,
    shift: e.shiftKey,
  }

  console.log("running key", e);

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