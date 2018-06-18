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

  if (typeof(Storage) !== "undefined") {
    // loads the saved substances
    if (localStorage.getItem('substances') !== null) {
      substanceS = load("substances");
    }

    // saves new toggle variable for table size
    if (localStorage.getItem('tSize') === null) {
      save('tSize', "");
    }
  }

  render();
  initLoadFromFile();
  window.addEventListener('keydown', runHotkey);
}
init();

function increment(substance) {
  substance.counter++;
  animate(substance.id);
}

function decrement(substance) {
  if (substance.counter == 0) return;
    substance.counter--;
  render();
}

function addNew() {
  const n = document.querySelector('#number').value;

  for (let i = 0; i < n; i++) {
    const substance = new Substance("", substanceS[substanceS.length-1].id + 1);
    substanceS.push(substance);
  }
  render();
}

function removeOld(id) {
  const substance = substanceS.find(substance => substance.id === id);

  substanceS.splice(substanceS.indexOf(substance), 1);
  render();
}

function animate(id) {
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

  /* substanceS.sort((a, b) => {
    if (a.counter == b.counter) return 0;
    if (a.counter < b.counter) return -1;
    if (a.counter > b.counter) return 1;

  }).reverse(); */

  const html = `
        <table id="table" class="table table-striped table-bordered table-hover ${load('tSize')}">
          <thead class="thead-dark">
            <th scope="col">#</th>
            <th scope="col">Ämne</th>
            <th scope="col">Hotkey</th>
            <th scope="col">Zoom</th>
            <th scope="col" colspan="2">Antal</th>
          </thead>
          <tbody>
          ${ substanceS.map((substance, index) => {
            const hotkey = substance.keyCombo;
            return `
              <tr data-id="${substance.id}">
                <td class="index">${index}</td>
                <td class="name" contenteditable="true" oninput="saveEdit(this)">${substance.name}</td>
                <td class="hotkey" onclick="assignHotkey(${substance.id})">${hotkey ? hotkey.shift ? "shift +" : "" : ""} ${hotkey ? hotkey.ctrl ? "ctrl +" : "" : ""} ${hotkey ? hotkey.alt ? "alt +" : "" : ""} ${hotkey ? hotkey.key : 'no key'}</td>
                <td class="zoom" contenteditable="true" oninput="saveEdit(this)">${substance.zoom}</td>
                <th class="counter" contenteditable="true" oninput="saveEdit(this)">${substance.counter}</th>
                <td> <i class="fas fa-minus-circle pointer" onclick="removeOld(${substance.id})"></i> </td>
              </tr>` }
            ).join("") }

              <tr>
                <th class="pointer" colspan="3" onclick="addNew()">
                  <i class="fas fa-plus-circle"></i>
                  <span>Lägg Till Rad</span>
                </th>
                <td colspan="3">
                  <input id="number" type="number" value="1">
                </td>
              </tr>
          </tbody>
        </table>`

  root.innerHTML = html;
  save("substances", substanceS);
}

function saveEdit(e) {
  const substance = substanceS.find(sub => sub.id == e.parentElement.dataset.id);

  const attribute = e.classList.value;
  substance[attribute] = e.innerHTML;

  save("substances", substanceS);
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

  // Special characters
  if (String.fromCharCode(e.keyCode) != e.key.toUpperCase()) {
    key = `${key} / ${e.key}`;
  } else {
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
  if (otherSubstance) otherSubstance.keyCombo = null;

  const substance = substanceS.find(substance => substance.id === id);
  substance.keyCombo = keyCombo;

  render();
  window.addEventListener('keydown', runHotkey);
}

function runHotkey(e) {
  // Don't run on input
  if (e.target.contentEditable == "true") return;

  let key = String.fromCharCode(e.keyCode);

  // Special characters
  if (String.fromCharCode(e.keyCode) != e.key.toUpperCase()) {
    key = `${key} / ${e.key}`;
  } else {
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

function saveToFile() {
  const data = JSON.stringify(substanceS);
  let a = document.createElement("a");
  const file = new Blob([data], {type: "application/json"});

  a.href = URL.createObjectURL(file);
  a.download = prompt("Ange namn på filen");
  a.click();
}

function initLoadFromFile() {
  let reader = new FileReader();
  const fileInput = document.querySelector("#fileInput");

  fileInput.addEventListener('change', fileInputChange);

  function fileInputChange() {
    // Only allow .json
    if (fileInput.files[0].type != "application/json") {
      alert("Fel filtyp!");
      return;
    }

    // Check if file uploaded pre reader run
    if (fileInput.files.length > 0) reader.readAsBinaryString(fileInput.files[0]);
  }

  reader.onload = function () {
    try {
      substanceS = JSON.parse(decodeURIComponent(escape(reader.result))); // decode UTF8 and parse result
      render();
    } catch (error) {
      alert("Ett fel inträffade");
      console.log(error);
    }
  }
}

function loadFromFile() {
  const fileInput = document.querySelector("#fileInput");
  fileInput.click();
}

/**
 * Aside buttons
 */

function toggleTableSize() {
  load('tSize') === "" ? save('tSize', "table-sm") : save('tSize', "");
  render();
}

function resetTable() {
  if (confirm('Är du säker på att du vill återställa tabellen?')) {
    localStorage.clear();
    location.reload();
  }
}

// function exportExcel() {
//   var body = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv=\"content-type\" content=\"application/vnd.ms-excel; charset=UTF-8\"><head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"></head><body>`; 
//   var table_text = body + "<table border='2px'><tr bgcolor='#87AFC6'>";
//   var table = document.getElementById('table'); // id of table

//   /* Stripping table */
//   table.rows[0].deleteCell(0); // Remove #
//   table.rows[0].deleteCell(1); // Remove Hotkey

//   for (let i = 1; i < table.rows.length - 1; i++) {
//     table.rows[i].deleteCell(0); // #
//     table.rows[i].deleteCell(1); // Hotkey
//     table.rows[i].deleteCell(3); // -
//   }
//   table.deleteRow(table.rows.length - 1); // Bottom Row
//   table.rows[0].cells[table.rows[0].cells.length - 1].colSpan = 1; // Colspan on "Antal"

//   /* Generate table text */
//   for (let i = 0; i < table.rows.length; i++) {
//     table_text += unescape(encodeURIComponent(table.rows[i].innerHTML)) + "</tr>";
//     // table_text += "</tr>";
//   }

//   table_text += "</table></body></html>";

//   var ua = window.navigator.userAgent;
//   var msie = ua.indexOf("MSIE ");

//   if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) { // If Internet Explorer
//     txtArea1.document.open("txt/html", "replace");
//     txtArea1.document.write(table_text);
//     txtArea1.document.close();
//     txtArea1.focus();
//     sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
//   } else { // other browser not tested on IE 11
//     sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(table_text));
//   }

//   return (sa);
// }

function exportExcel(filename = "filnamn.csv") {
  const divider = ";";
  let csv = `\ufeffNamn${divider}Zoom${divider}Antal\r\n`;
    
  csv += substanceS.map(substance => {
    return `${substance.name + divider + substance.zoom + divider + substance.counter}\r\n`;
  }).join("");

  var blob = new Blob([csv], { type: 'text;charset=UTF-8;' });
  if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
  } else {
      var link = document.createElement("a");
      if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
  }
}