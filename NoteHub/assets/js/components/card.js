'use strict';

// import module
import { Tooltip } from "./tooltip.js";
import { getRelativeTime, markdownToHtml } from "../utility.js";
import { DeleteConfirmModal, NoteModal } from "./modal.js";
import { db } from "../db.js";
import { client } from "../client.js";

/**
 * Creates an HTML and element representing a note based on provided note data.
 * 
 * @param {Object} noteData - Data representing the note to be displayed in the card.
 * @returns {HTMLElement} - The generated card element.
 */
export const Card = function (noteData) {

  const { id, title, content, postedOn, notebookId } = noteData;

  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-note', id);

  // Convert markdown to HTML for display
  const htmlContent = markdownToHtml(content);

  card.innerHTML = `
    <div class="card-content">
      <h3 class="card-title text-title-medium">${title}</h3>
      <div class="card-text text-body-large">${htmlContent}</div>
    </div>

    <div class="card-footer">
      <span class="card-time text-label-large">${getRelativeTime(postedOn)}</span>

      <button class="icon-btn large" aria-label="Delete note" data-tooltip="Delete note" data-delete-btn>
        <i class="fas fa-trash" aria-label="true"></i>
        <div class="state-layer"></div>
      </button>
    </div>

    <div class="state-layer"></div>
  `;

  // Add necessary CSS to ensure the footer stays at bottom
  const style = document.createElement('style');
  style.textContent = `
    .card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .card-content {
      flex: 1;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
  `;
  document.head.appendChild(style);

  Tooltip(card.querySelector('[data-tooltip]'));

  /**
   * Note detail view and edit functionality
   * 
   * Attaches a click event listener to card element.
   * When the card is clicked, it opens a modal with the note's details and allows for updating the note.
   */
  card.addEventListener('click', function (event) {
    // Prevent clicking if we're clicking the delete button
    if (event.target.closest('[data-delete-btn]')) {
        return;
    }

    // Pass the raw markdown content to the modal for editing
    const modal = NoteModal(title, content, getRelativeTime(postedOn));
    modal.open();

    modal.onSubmit(async function (noteData) {
        try {
            console.log('Submitting note data:', noteData);

            // Ensure we have valid data before updating
            if (!noteData.content || !noteData.title) {
                console.error('Missing required fields:', noteData);
                return;
            }

            const updatedData = await db.update.note(id, {
                title: noteData.title.trim(),
                content: noteData.content.trim()
            });

            console.log('Updated data received:', updatedData);

            client.note.update(id, updatedData);
            modal.close();
        } catch (error) {
            console.error('Error updating note:', error);
        }
    });
  });

  /**
   * Note delete functionality
   * 
   * Attaches a click event listener to delete button element within card.
   * When the delete button is clicked, it opens a confirmation modal for deleting the associated note.
   * If the deletion is confirmed, it updates the UI and database to remove the note
   */
  const deleteBtn = card.querySelector('[data-delete-btn]');
  deleteBtn.addEventListener('click', async function (event) {
    event.stopImmediatePropagation();

    const modal = DeleteConfirmModal(title || 'Untitled');
    modal.open();

    modal.onSubmit(async function (isConfirm) {
        if (isConfirm) {
            try {
                // Wait for the delete operation and get remaining notes
                const remainingNotes = await db.delete.note(notebookId, id);
                
                // Update UI with the correct remaining notes
                client.note.delete(id, remainingNotes.length > 0);
                
                // If there are remaining notes, update the note panel
                if (remainingNotes.length > 0) {
                    client.note.read(remainingNotes);
                }
            } catch (error) {
                console.error('Error deleting note:', error);
            }
        }
        modal.close();
    });
  });

  return card;
}