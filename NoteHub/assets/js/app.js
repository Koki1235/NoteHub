// app.js
'use strict';

import { greeting, getDate, makeElemEditable } from "./utility.js";
import { Tooltip } from "./components/tooltip.js";
import { db } from "./db.js";
import { client } from "./client.js";
import { NoteModal } from "./components/modal.js";

// Initialize auth state listener
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
const auth = getAuth();

// Wait for auth state before loading data
onAuthStateChanged(auth, (user) => {
  if (user) {
    renderExistedNotebook();
  }
});

// sidebar toggler
const sidebar = document.querySelector('[data-sidebar]');
const sidebarTogglers = document.querySelectorAll('[data-sidebar-toggler]');
const overlay = document.querySelector('[data-sidebar-overlay]');

sidebarTogglers.forEach(sidebarToggler => {
  sidebarToggler.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  });
});

// Initialize tooltips
const toolTipEL = document.querySelectorAll('[data-tooltip]');
toolTipEL.forEach(element => Tooltip(element));

// Set greeting and date
const greetingEl = document.querySelector('[data-greeting]');
const getDateEl = document.querySelector('[data-current-date]');

getDateEl.textContent = getDate();
greetingEl.textContent = greeting();

// Notebook creation
const sidebarList = document.querySelector('[data-sidebar-list]');
const addNoteBtnEl = document.querySelector('[data-add-notebook]');
const notePanelTitle = document.querySelector('[data-note-panel-title]');

const showNoteBookField = function () {
  const navItem = document.createElement('div');
  navItem.classList.add('nav-item');

  navItem.innerHTML = `
    <span class="text text-label-large" data-notebook-field></span>
    <div class="state-layer"></div>
  `;

  sidebarList.appendChild(navItem);

  const navItemField = navItem.querySelector('[data-notebook-field]');
  makeElemEditable(navItemField);

  const createNoteBook = async function (event) {
    if (event.key === 'Enter') {
      try {
        const notebookData = await db.post.notebook(this.textContent || 'Untitled');
        this.parentElement.remove();
        client.notebook.create(notebookData);
      } catch (error) {
        console.error('Error creating notebook:', error);
        alert('Failed to create notebook');
      }
    }
  };
  
  navItemField.addEventListener('keydown', createNoteBook);
};

addNoteBtnEl.addEventListener('click', showNoteBookField);

// Render existing notebooks
const renderExistedNotebook = async function () {
  try {
    const notebookList = await db.get.notebook();
    client.notebook.read(notebookList);
  } catch (error) {
    console.error('Error loading notebooks:', error);
  }
};

// Note creation
const noteCreateBtns = document.querySelectorAll('[data-note-create-btn]');

noteCreateBtns.forEach(element => {
  element.addEventListener('click', function () {
    const activeNotebook = document.querySelector('[data-notebook].active');
    if (!activeNotebook) {
      console.error('No active notebook selected');
      return;
    }

    const modal = NoteModal();
    modal.open();

    modal.onSubmit(async noteObj => {
      try {
        const activeNotebookId = activeNotebook.dataset.notebook;
        const noteData = await db.post.note(activeNotebookId, noteObj);
        client.note.create(noteData);
        modal.close();
      } catch (error) {
        console.error('Error creating note:', error);
      }
    });
  });
});

// Render existing notes
const renderExistedNote = async function (notebookId) {
  if (!notebookId) return;
  
  try {
    const noteList = await db.get.note(notebookId);
    client.note.read(noteList);
  } catch (error) {
    console.error('Error loading notes:', error);
  }
};

// Handle notebook switching
document.addEventListener('click', async function(e) {
  const notebookItem = e.target.closest('[data-notebook]');
  if (!notebookItem) return;
  
  const activeItem = document.querySelector('[data-notebook].active');
  if (activeItem) activeItem.classList.remove('active');
  
  notebookItem.classList.add('active');
  notePanelTitle.textContent = notebookItem.querySelector('[data-notebook-field]').textContent;
  
  await renderExistedNote(notebookItem.dataset.notebook);
});