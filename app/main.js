// import Substance from './classes/Substance';

/**
 * Global
 * NODEs
 */
const root = document.querySelector("#root");

/**
 * Objects
 */
var substanceS = [];

function init() {
  let subs = [
    new Substance("Vitsippa", 0),
    new Substance("Blåsippa", 1),
    new Substance("Ros", 2),
    new Substance("Vass", 3),
    new Substance("Säv", 4),
    new Substance("Kaveldun", 5),
    new Substance("Gul", 6),
    new Substance("Natearter", 7),
  ];

  substanceS = subs;

  render();
}
init();

function increment(substance) {
  substance.increment();
  animate(substance.id);
}

function decrement(substance) {
  substance.decrement();
  render();
}

function addNew() {
  const n = document.querySelector('#number').value;

  for (let i = 0; i < n; i++) {
    const substance = new Substance("", substanceS.length);
    substanceS.push(substance);
  }
  render();
}

function removeOld(id) {
  substanceS.splice(id, 1);

  for (let i = id; i < substanceS.length; i++) {
    substanceS[i].id--;
  }

  render();
}

function animate(id, e) {
  const substanceRow = document.querySelector(`[data-id="${id}"]`);
  if (substanceRow.dataset.animating) return; // don't add another animation if current one is running

  substanceRow.classList.add('animate');
  substanceRow.dataset.animating = "true";

  substanceRow.addEventListener("transitionend", () => {
    // remove the class
    substanceRow.classList.remove("animate");
    substanceRow.addEventListener("transitionend", () => {
      substanceRow.dataset.animating = "false";
      render(); // render once the remove is complete
    });
  });
}

function render() {
  const currentAnimation = document.querySelector(".animate");
  if (currentAnimation && currentAnimation.dataset.animating) {
    return; // current
  }

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
          ${ substanceS.map(substance => {
            const hotkey = substance.keyCombo;
            return `
              <tr data-id="${substance.id}">
                <td class="id">${substance.id}</td>
                <td class="substance">${substance.name}</td>
                <td class="hotkey" onclick="assignHotkey(${substance.id})">${hotkey ? hotkey.shift ? "shift +" : "" : ""} ${hotkey ? hotkey.ctrl ? "ctrl +" : "" : ""} ${hotkey ? hotkey.alt ? "alt +" : "" : ""} ${hotkey ? hotkey.key : 'no key'}</td>
                <td class="zoom" contenteditable="true">${substance.zoom}</td>
                <th class="counter">${substance.counter}</th>
                <td> <i class="fas fa-minus-circle pointer" onclick="removeOld(${substance.id})"></i> </td>
              </tr>` }
            ).join("") }

              <tr>
                <th class="pointer" colspan="3" >
                  <i class="fas fa-plus-circle"></i>
                  <span id="addRtext">Lägg Till Rad</span>
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
  let currentElem = document.querySelector(`[data-id='${id}']`);
  currentElem.querySelector(".hotkey").innerText = "select key please";

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

  const keyCombo = {
    key: key,
    alt: e.altKey,
    ctrl: e.ctrlKey,
    shift: e.shiftKey
  }

  const otherSubstance = substanceS.find(substance => {
    return JSON.stringify(substance.keyCombo) === JSON.stringify(keyCombo);
  })

  // If another substance already has the keyCombo replace its
  if (otherSubstance) otherSubstance.setKeyCombo(null);

  substanceS.find(substance => substance.id === id).setKeyCombo(keyCombo);

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

  const substance = substanceS.find(substance => {
    return JSON.stringify(substance.keyCombo) === JSON.stringify(keyCombo);
  });


  // If hotkey exists
  if (!substance) return;
  increment(substance);
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