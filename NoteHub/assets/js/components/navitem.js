'Use strict';

// import module..................

import { Tooltip } from "./tooltip.js";
import { activeNoteBook, makeElemEditable} from "../utility.js";
import { db } from "../db.js";
import { client } from "../client.js";
import { DeleteConfirmModal } from "./modal.js";

const notePanelTitle = document.querySelector('[data-note-panel-title]');

export const navitem = function (id, name) {
  const navItem = document.createElement('div');
  navItem.classList.add('nav-item');
  navItem.setAttribute('data-notebook', id);

  navItem.innerHTML = `
    <span class="text-label-large" data-notebook-field>${name}</span>

    <div class="state-layer"></div>

    <button class="icon-btn small" aria-label="Edit notebook" data-tooltip="Edit notebook" data-edit-btn>
      <i class="fas fa-pen" aria-hidden="true"></i>
      <div class="state-layer"></div>
    </button>

    <button class="icon-btn small" aria-label="Delete notebook" data-tooltip="Delete notebook" data-delete-btn>
      <i class="fas fa-trash" aria-hidden="true"></i>
      <div class="state-layer"></div>
    </button>
  `;

  // Initialize tooltips
  const tooltipElements = navItem.querySelectorAll('[data-tooltip]');
  tooltipElements.forEach(element => Tooltip(element));

  // Get notebook field reference after creating the element
  const notebookField = navItem.querySelector('[data-notebook-field]');
  const editBtn = navItem.querySelector('[data-edit-btn]');

  // Edit button functionality
  editBtn.addEventListener('click', function(event) {
    event.stopPropagation();
    makeElemEditable(notebookField);
    notebookField.focus();
  });

  // Notebook rename functionality
  notebookField.addEventListener('keydown', async function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.blur();
    }
  });

  notebookField.addEventListener('blur', async function () {
    try {
      const newName = this.textContent.trim();
      if (!newName) {
        this.textContent = name;
        return;
      }

      this.setAttribute('contenteditable', 'false');
      
      const updatedData = await db.update.notebook(id, newName);
      
      if (updatedData) {
        client.notebook.update(id, updatedData);
      }
    } catch (error) {
      console.error('Error updating notebook name:', error);
      this.textContent = name;
    }
  });

  // Delete notebook functionality
  const deleteBtn = navItem.querySelector('[data-delete-btn]');
  deleteBtn.addEventListener('click', async function (event) {
    event.stopPropagation();
    const modal = DeleteConfirmModal(name);
    modal.open();

    modal.onSubmit(async function (isConfirm) {
      if (isConfirm) {
        try {
          await db.delete.notebook(id);
          navItem.remove();
          document.querySelector('[data-note-panel-title]').textContent = '';
          document.querySelector('[data-note-panel]').innerHTML = '';
        } catch (error) {
          console.error('Error deleting notebook:', error);
        }
      }
      modal.close();
    });
  });

  return navItem;
};
