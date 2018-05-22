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
    new Substance("Vass", 3),
    new Substance("Säv", 4),
    new Substance("Kaveldun", 5),
    new Substance("Gul", 6),
    new Substance("Natearter", 7),
  ];

  View.substances = substances;

  render();
}
init();

function increment(id) {
  const substance = View.substances.find(sub => sub.id == id)
  substance.increment();
  render();

  // animate(id);
}

function decrement(id) {
  const substance = View.substances.find(sub => sub.id == id)
  substance.decrement();
  render();
}

function addNew() {
  const n = document.querySelector('#number').value;

  for (let i = 0; i < n; i++) {
    const sub = new Substance("", View.substances.length);
    View.substances.push(sub);
  }
  render();
}

function removeOld(id) {
  View.substances.splice(id, 1);
  View.hotkeys.splice(id, 1)

  for (let i = id; i < View.substances.length; i++) {
    View.substances[i].id--;
  }
  /* Byt till objektorienterade hotkeys!!! */
  View.hotkeys.forEach(key => {
    if (key.id >= id) {
      key.id--;
    }
  });
  render();
}

function animate(id, e) {
  const substanceCell = document.querySelector(`[data-id="${id}"]`);
  substanceCell.classList.add('animate');

  console.log(substanceCell);

  substanceCell.addEventListener('transitionend', (e) => {
    console.log(e);
    if (e.propertyName !== 'transform') return;
    e.target.classList.remove('playing');
  });
}

function render() {
  const html = `
        <table id="table" class="table table-striped table-bordered table-hover">
          <thead class="thead-dark">
            <th scope="col">#</th>
            <th scope="col">Ämne</th>
            <th scope="col">Hotkey</th>
            <th scope="col">Zoom</th>
            <th scope="col" colspan="2">Antal</th>
          </thead>
          <tbody>
          ${ View.substances.map((substance) => {
            const hotKey = View.hotkeys.find(viewHotkeys => viewHotkeys.id === substance.id);
            return `
              <tr data-id="${substance.id}">
                <td class="id">${substance.id}</td>
                <td class="substance">${substance.name}</td>
                <td class="hotkey" onclick="assignHotkey(${substance.id})">${hotKey ? hotKey.keyCombo.shift ? "shift +" : "" : ""} ${hotKey ? hotKey.keyCombo.ctrl ? "ctrl +" : "" : ""} ${hotKey ? hotKey.keyCombo.alt ? "alt +" : "" : ""} ${hotKey ? hotKey.keyCombo.key : 'no key'}</td>
                <td class="zoom" contenteditable="true">100x</td>
                <th class="counter">${substance.counter}</th>
                <td> <img src="img/minus.png" height="26px" class="pointer" onclick="removeOld(${substance.id})"> </td>
              </tr>` }
            ).join("") }

              <tr>
                <th class="pointer" colspan="3" onclick="addNew()">
                  <img src="img/plus.png" height="26px">
                  Lägg Till Rad
                </th>
                <td colspan="3">
                  <input id="number" type="number" value="1">
                </td>
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

  console.log("running key", keyCombo.key);

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