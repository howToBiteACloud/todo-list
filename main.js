import {hslToHex, getRandomNumber, randomHexColor, paleRandomHexColor} from "./utils.js";
import {updateMySvgForRender, createSvg} from "./svg-helper.js";

const dialog = document.querySelector("dialog");
const showButton = document.querySelector(".new-task-button");
const closeButton = document.querySelector("#close");
const bold = document.querySelector('#bold');
const italic = document.querySelector('#italic');
const underline = document.querySelector('#underline');
const editor = document.querySelector('#editor');
const fonts = document.querySelector('.fonts');
const size = document.querySelector('.size');
const color = document.querySelector('#color');
const alignLeft = document.querySelector('#align-left');
const alignRight = document.querySelector('#align-right');
const alignCenter = document.querySelector('#align-center');
const listUl = document.querySelector('#list-ul');
const listOl = document.querySelector('#list-ol');
const contentTitle = document.querySelector('.content__title');
const save = document.querySelector('#save');
const grid = document.querySelector('.grid');
const wrapper = document.querySelector('.wrapper');
const gridItemsCollection = document.getElementsByClassName('grid-item');
const dialogDelete = document.querySelector('.dialog__delete');
const redactor = document.querySelector('.redactor');

let notes = JSON.parse(localStorage.getItem('notes')) ?? [];

const msnry = new Masonry(grid, {
  itemSelector: '.grid-item',
  columnWidth: 180
});

function changeContent(index, title, content) {
  grid.children[index].querySelector('.grid-item__title').innerHTML = title;
  grid.children[index].querySelector('.grid-item__content').innerHTML = content;
}

// =================================================
function makeGridItem(title, content, color) {
  const gridItem = document.createElement('div');
  const titleElement = document.createElement('div');
  const contentElement = document.createElement('div');
  const deleteElement = document.createElement('button');
  const buttonChangeColor = document.createElement('button');

  const svg = createSvg('tuiIconTrashOutline');
  const blobIcon = document.createElement('div');

  titleElement.innerHTML = title;
  contentElement.innerHTML = content;

  titleElement.classList.add('grid-item__title');
  contentElement.classList.add('grid-item__content');
  deleteElement.classList.add('delete');
  buttonChangeColor.classList.add('change-color-button');
  blobIcon.classList.add('change-color-icon');

  buttonChangeColor.append(blobIcon);
  deleteElement.append(svg);
  gridItem.append(deleteElement);
  gridItem.append(titleElement);
  gridItem.append(contentElement);
  gridItem.append(buttonChangeColor);
  gridItem.classList.add('grid-item');
  
  deleteElement.addEventListener('click', deleteGridItem);
  buttonChangeColor.addEventListener('click', changeColor);
  gridItem.addEventListener('click', openSaved);
  gridItem.style.setProperty('background-color', color);

  return gridItem;
}

function main() {
  addNotesToDomFromStorage();
  registerHandlers();

  document.querySelectorAll('my-svg').forEach(updateMySvgForRender);
}

function addNotesToDomFromStorage() {
  for (let note of notes) {
    const gridItem = makeGridItem(note.title, note.content, note.color);
    grid.append(gridItem);
    msnry.appended(gridItem);
  }
  
  msnry.reloadItems();
}

function registerHandlers() {
  registerRedactorHandlers();
  registerDialogHandlers();
}

function registerDialogHandlers() {
  // открыть диалог
  showButton.addEventListener("click", dialogOn);

  // закрыть диалог
  closeButton.addEventListener("click", dialogOff);

  dialog.addEventListener('close', () => {
    document.body.classList.remove('overflow-none');
    document.activeElement?.blur();
    dialog.removeAttribute('data-id');
  });

  contentTitle.oninput = function () {
    if (contentTitle.textContent === "" && editor.textContent === "") {
      save.disabled = true;
    } else {
      save.disabled = false;
    }
  }

  editor.oninput = function () {
    if (contentTitle.textContent === "" && editor.textContent === "") {
      save.disabled = true;
    } else {
      save.disabled = false;
    }
  };
}

function registerRedactorHandlers() {
  bold.addEventListener('click', function(event) {
    document.execCommand('bold');
    editor.focus();
  });

  italic.addEventListener('click', function(event) {
    document.execCommand('italic', false, null);
    editor.focus();
  });

  underline.addEventListener('click', function() {
    document.execCommand('underline', false, null);
    editor.focus();
  });

  fonts.onchange = function() {
    let font = this.value;
    document.execCommand('fontName', false, font);
  };

  size.onchange = function() {
    let size = this.value;
    document.execCommand('fontSize', false, size);
  };

  color.onclick = function() {
    editor.focus();
  }

  color.onchange = function() {
    let value = this.value;
    document.execCommand('foreColor', false, value);
  }

  alignLeft.onclick = function() {
    document.execCommand('justifyLeft', false, null);
  };

  alignCenter.onclick = function() {
    document.execCommand('justifyCenter', false, null);
  };

  alignRight.onclick = function() {
    document.execCommand('justifyRight', false, null);
  };

  listUl.onclick = function() {
    document.execCommand('insertUnorderedList', false, null);
  };

  listOl.onclick = function() {
    document.execCommand('insertOrderedList', false, null);
  };

  // сохранение
  save.onclick = saveNoteHandler;

  dialogDelete.addEventListener('click', deleteFromDialog);
}

// handlers
function dialogOn() {
  contentTitle.innerHTML = '';
  editor.innerHTML = '';

  save.disabled = true;

  document.body.classList.add('overflow-none');
  dialog.showModal();
}

function dialogOff() {
  dialog.close();
}

function changeColor(event) {
  event.stopPropagation();
  const arrayGrid = Array.from(gridItemsCollection);
  const gridColor = randomHexColor();
  const gridItem = event.currentTarget.closest('.grid-item');

  const foundedIndex = arrayGrid.findIndex(elem => elem === gridItem);

  notes[foundedIndex].color = gridColor;
  gridItem.style.setProperty('background-color', gridColor);
  localStorage.setItem('notes', JSON.stringify(notes));
}

function saveNoteHandler(event) {
  if (contentTitle.textContent === "" && editor.textContent === "") return;

  const foundedIndex = dialog.getAttribute('data-id');
  
  if (foundedIndex) {
    updateCurrentNote(foundedIndex);
  } else {
    createNewNote();
  }
  
  localStorage.setItem('notes', JSON.stringify(notes));
}

function createNewNote() {
  const note = {
    title: contentTitle.innerHTML,
    content: editor.innerHTML,
    color: paleRandomHexColor(),
  };

  notes.push(note);

  dialog.setAttribute('data-id', gridItemsCollection.length);

  const gridItem = makeGridItem(note.title, note.content, note.color);
  
  grid.append(gridItem);
  msnry.appended(gridItem);
}

function updateCurrentNote(foundedIndex) {
  const note = {
    title: contentTitle.innerHTML,
    content: editor.innerHTML,
    color: notes[foundedIndex].color
  };

  notes[foundedIndex] = note;

  changeContent(foundedIndex, note.title, note.content);
  msnry.layout();
}

function openSaved(event) {
  const arrayGrid = Array.from(grid.children);

  const foundedIndex = arrayGrid.findIndex((elem) => {
    return elem === event.currentTarget;
  });

  dialog.setAttribute('data-id', foundedIndex);

  const savedNotes = JSON.parse(localStorage.getItem('notes'));
  contentTitle.innerHTML = savedNotes[foundedIndex].title;
  editor.innerHTML = savedNotes[foundedIndex].content;

  document.body.classList.add('overflow-none');
  dialog.showModal();
}

function deleteFromDialog(event) {
  event.stopPropagation();
  if (contentTitle.textContent === "" && editor.textContent === "") {
    dialogOff();
  };

  const foundedIndex = dialog.getAttribute('data-id');

  const gridItem = gridItemsCollection[foundedIndex];

  gridItem.remove();
  msnry.remove(gridItem);
  msnry.layout();
  notes.splice(foundedIndex, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
  dialogOff();
}

function deleteGridItem(event) {
  event.stopPropagation();

  const arrayGrid = Array.from(grid.children);
  const gridItem = event.target.closest('.grid-item');

  const foundedIndex = arrayGrid.findIndex((elem) => {
    return elem === gridItem;
  })

  gridItem.remove();
  msnry.remove(gridItem);
  msnry.layout();
  notes.splice(foundedIndex, 1);
  localStorage.setItem('notes', JSON.stringify(notes));
}

main();
