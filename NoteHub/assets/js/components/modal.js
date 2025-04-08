'use strict';

const overlay = document.createElement('div');
overlay.classList.add('overlay', 'active', 'modal-overlay');

/**
 * Creates and manages a modal for adding or editing notes.The modal
 * allows users to input a note's title and text and provides functionality to submit and save the note.
 * Also includes voice-to-text functionality for hands-free note creation.
 * 
 * @param {string} [title='Untitled'] - the default title for the note.
 * @param {string} [content='Add your note...'] - the default text for the note.
 * @param {string} [time=''] - The time associated with the note.
 * @returns {Object} - An object containing functions to open the modal, close the modal, and handle note submissions.
 */

const NoteModal = function (title = '', content = '', time = '') {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  modal.innerHTML = `
      <button class="icon-btn large" aria-label="Close modal"
      data-close-btn>
        <i class="fas fa-close" aria-hidden="true"></i>
        <div class="state-layer"></div>
      </button>

      <input type="text" placeholder="Untitled" value="${title}" class="modal-title text-title-medium"
      data-note-field>

      <div class="textarea-container">
        <textarea placeholder="Take a note..." class="modal-text text-body-large custom-scrollbar" data-note-field>${content}</textarea>
        <button class="voice-btn" aria-label="Voice to text" data-voice-btn>
          <i class="fas fa-microphone" aria-hidden="true"></i>
          <div class="state-layer"></div>
        </button>
      </div>

      <div class="modal-footer">
        <span class="time text-label-large">${time}</span>
        <span class="voice-status text-label-large" data-voice-status></span>
        <button class="btn text" data-submit-btn>
            <span class="text-label-large">Save</span>
            <div class="state-layer"></div>
        </button>
      </div>
  `;

  const submitBtn = modal.querySelector('[data-submit-btn]');
  submitBtn.disabled = true;

  const [titleField, textField] = modal.querySelectorAll('[data-note-field]');
  const voiceBtn = modal.querySelector('[data-voice-btn]');
  const voiceStatus = modal.querySelector('[data-voice-status]');

  const enableSubmit = function () {
    submitBtn.disabled = !titleField.value && !textField.value;
  }

  textField.addEventListener('keyup', enableSubmit);
  titleField.addEventListener('keyup', enableSubmit);

  // Speech recognition setup
  let recognition = null;
  let isListening = false;

  // Check if browser supports speech recognition
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = function() {
      isListening = true;
      voiceBtn.classList.add('active');
      voiceStatus.textContent = 'Listening...';
    };
    
    recognition.onresult = function(event) {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      
      // If it's a final result, append to textarea
      if (result.isFinal) {
        // If cursor is at a specific position, insert text there
        const cursorPos = textField.selectionStart;
        const textBefore = textField.value.substring(0, cursorPos);
        const textAfter = textField.value.substring(cursorPos);
        
        // Add space before new text if needed
        const spacer = (textBefore.length > 0 && textBefore[textBefore.length - 1] !== ' ' && 
                       transcript.length > 0 && transcript[0] !== ' ') ? ' ' : '';
        
        textField.value = textBefore + spacer + transcript + textAfter;
        
        // Update cursor position
        const newCursorPos = cursorPos + spacer.length + transcript.length;
        textField.setSelectionRange(newCursorPos, newCursorPos);
        
        // Enable save button if there's text
        enableSubmit();
      }
    };
    
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      stopListening();
      voiceStatus.textContent = `Error: ${event.error}`;
      setTimeout(() => {
        voiceStatus.textContent = '';
      }, 3000);
    };
    
    recognition.onend = function() {
      stopListening();
    };
  }
  
  function startListening() {
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (e) {
        console.error('Speech recognition error:', e);
      }
    }
  }
  
  function stopListening() {
    if (recognition && isListening) {
      isListening = false;
      voiceBtn.classList.remove('active');
      voiceStatus.textContent = '';
      try {
        recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
  }
  
  // Voice button click handler - toggle listening
  voiceBtn.addEventListener('click', function() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  });

  //opens the modal
  const open = function () {
    document.body.appendChild(modal);
    document.body.appendChild(overlay);
    titleField.focus();
  }

  //close the modal
  const close = function () {
    stopListening(); // Make sure to stop listening when closing
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  };

  // Attach click event to closeBtn
  const closeBtn = modal.querySelector('[data-close-btn]');
  closeBtn.addEventListener('click', close);

  /**
   * Handles the submissions of the note.
   * 
   * @param {Function} callback - the callback function to execute with the 
   * submitted note data.
   */
  const onSubmit = function (callback) {
    submitBtn.addEventListener('click', function () {
      if (submitBtn.disabled) return;

      const titleValue = titleField.value.trim();
      const contentValue = textField.value.trim();

      console.log('Modal values:', { // Debug log
        title: titleValue,
        content: contentValue
      });

      const noteData = {
        title: titleValue || 'Untitled',
        content: contentValue // Make sure we're using 'content' not 'text'
      };

      console.log('Sending note data:', noteData); // Debug log
      callback(noteData);
    });
  }

  return { open, close, onSubmit }
}

// Keep the DeleteConfirmModal unchanged
const DeleteConfirmModal = function (title) {
  // Your existing DeleteConfirmModal code...
  const modal = document.createElement('div');
  modal.classList.add('modal');

  modal.innerHTML = `
      <h3 class="modal-title text-title-medium">
        Are you sure you want to delete <strong>"${title}"</strong>
      </h3>

      <div class="modal-footer">

        <button class="btn text" data-action-btn="false">

          <span class="text-label-large">Cancel</span>

          <div class="state-layer"></div>
        </button>

        <button class="btn fill" data-action-btn="true">

          <span class="text-label-large">Delete</span>

          <div class="state-layer"></div>

        </button>

      </div>
  `

  const open = function () {
    document.body.appendChild(modal);
    document.body.appendChild(overlay);
  };

  // Closes the delete confirmation modal by removing it from the document body

  const close = function () {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  }

  const actionBtns = modal.querySelectorAll('[data-action-btn]');


  /**
   * Handles the submissions of the delete confirmation.
   * 
   * @param {Function} callback - the callback function to execute with the 
   * confirmation result (true for confirmation, false for cancel)
   */

  const onSubmit = function (callback) {
    actionBtns.forEach(btn => btn.addEventListener('click', function() {
      const /** {Boolean} */ isConfirm = this.dataset.actionBtn === 
      'true' ? true : false;

      callback(isConfirm);
    }));
  }

  return { open, close, onSubmit }
}

export { DeleteConfirmModal, NoteModal }