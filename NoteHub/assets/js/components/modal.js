'use strict';

// First, let's update the modal.js file to include rich text editing capabilities

const overlay = document.createElement('div');
overlay.classList.add('overlay', 'active', 'modal-overlay');

/**
 * Creates and manages a modal for adding or editing notes with rich text capabilities.
 * Allows users to format text with markdown, insert code snippets with syntax highlighting,
 * and provides voice-to-text functionality for hands-free note creation.
 * 
 * @param {string} [title=''] - The default title for the note.
 * @param {string} [content=''] - The default text for the note.
 * @param {string} [time=''] - The time associated with the note.
 * @returns {Object} - An object containing functions to open the modal, close the modal, and handle note submissions.
 */

const NoteModal = function (title = '', content = '', time = '') {
  const modal = document.createElement('div');
  modal.classList.add('modal', 'rich-modal');

  // Create modal structure with rich editor container
  modal.innerHTML = `
      <button class="icon-btn large" aria-label="Close modal"
      data-close-btn>
        <i class="fas fa-close" aria-hidden="true"></i>
        <div class="state-layer"></div>
      </button>

      <input type="text" placeholder="Untitled" value="${title}" class="modal-title text-title-medium"
      data-note-field>

      <div class="editor-toolbar">
        <button type="button" class="toolbar-btn" title="Bold" data-format-btn="bold">
          <i class="fas fa-bold" aria-hidden="true"></i>
        </button>
        <button type="button" class="toolbar-btn" title="Italic" data-format-btn="italic">
          <i class="fas fa-italic" aria-hidden="true"></i>
        </button>
        <button type="button" class="toolbar-btn" title="Heading" data-format-btn="heading">
          <i class="fas fa-heading" aria-hidden="true"></i>
        </button>
        <button type="button" class="toolbar-btn" title="List" data-format-btn="list">
          <i class="fas fa-list" aria-hidden="true"></i>
        </button>
        <button type="button" class="toolbar-btn" title="Code" data-format-btn="code">
          <i class="fas fa-code" aria-hidden="true"></i>
        </button>
        <button type="button" class="toolbar-btn" title="Code Block" data-format-btn="codeblock">
          <i class="fas fa-file-code" aria-hidden="true"></i>
        </button>
        <button type="button" class="toolbar-btn" title="Link" data-format-btn="link">
          <i class="fas fa-link" aria-hidden="true"></i>
        </button>
      </div>

      <div class="textarea-container">
        <div class="editor-container">
          <div class="rich-editor custom-scrollbar" contenteditable="true" data-editor>${content}</div>
          <textarea class="hidden-editor" data-note-field>${content}</textarea>
        </div>
        <button class="voice-btn" aria-label="Voice to text" data-voice-btn>
          <i class="fas fa-microphone" aria-hidden="true"></i>
          <div class="state-layer"></div>
        </button>
      </div>

      <div class="modal-footer">
        <span class="time text-label-large">${time}</span>
        <span class="voice-status text-label-large" data-voice-status></span>
        <div class="editor-status">
          <span class="text-label-large" data-editor-mode>Edit Mode: Rich Text</span>
          <button class="toggle-mode-btn text-label-large" data-toggle-mode>
            Toggle Markdown
          </button>
        </div>
        <button class="btn text" data-submit-btn>
            <span class="text-label-large">Save</span>
            <div class="state-layer"></div>
        </button>
      </div>
  `;

  // References to key elements
  const submitBtn = modal.querySelector('[data-submit-btn]');
  submitBtn.disabled = true;

  const titleField = modal.querySelector('[data-note-field]');
  const hiddenTextField = modal.querySelector('textarea.hidden-editor');
  const richEditor = modal.querySelector('.rich-editor');
  const voiceBtn = modal.querySelector('[data-voice-btn]');
  const voiceStatus = modal.querySelector('[data-voice-status]');
  const toggleModeBtn = modal.querySelector('[data-toggle-mode]');
  const editorModeLabel = modal.querySelector('[data-editor-mode]');
  
  let isMarkdownMode = false;

  // Initialize and set up editor with any existing content
  initializeEditor(content);

  // Set up format buttons
  setupFormatButtons();
  
  // Function to initialize the editor with content
  function initializeEditor(initialContent) {
    if (initialContent) {
      // Convert markdown to HTML for the rich editor
      richEditor.innerHTML = convertMarkdownToHtml(initialContent);
      hiddenTextField.value = initialContent;
    }
    
    // Set up event listeners for the editor
    richEditor.addEventListener('input', function() {
      const content = isMarkdownMode 
        ? richEditor.textContent 
        : convertHtmlToMarkdown(richEditor.innerHTML);
      
      hiddenTextField.value = content;
      enableSubmit();
    });
    
    // Enable code syntax highlighting for code blocks
    highlightCodeBlocks();
  }
  
  // Function to enable the submit button if content exists
  const enableSubmit = function () {
    submitBtn.disabled = !titleField.value && !hiddenTextField.value;
  }

  // Event listeners for title field
  titleField.addEventListener('keyup', enableSubmit);
  
  // Toggle between rich text and markdown modes
  toggleModeBtn.addEventListener('click', function() {
    isMarkdownMode = !isMarkdownMode;
    
    if (isMarkdownMode) {
      // Switch to markdown mode
      editorModeLabel.textContent = 'Edit Mode: Markdown';
      richEditor.classList.add('markdown-mode');
      
      // Convert the current HTML to markdown
      const markdown = convertHtmlToMarkdown(richEditor.innerHTML);
      richEditor.textContent = markdown;
    } else {
      // Switch to rich text mode
      editorModeLabel.textContent = 'Edit Mode: Rich Text';
      richEditor.classList.remove('markdown-mode');
      
      // Convert the current markdown to HTML
      const html = convertMarkdownToHtml(richEditor.textContent);
      richEditor.innerHTML = html;
      
      // Re-highlight code blocks
      highlightCodeBlocks();
    }
  });
  
  // Set up the formatting buttons functionality
  function setupFormatButtons() {
    const formatBtns = modal.querySelectorAll('[data-format-btn]');
    
    formatBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const formatType = this.getAttribute('data-format-btn');
        applyFormat(formatType);
      });
    });
  }
  
  // Apply formatting based on button clicked
  function applyFormat(formatType) {
    // Get selection
    const selection = window.getSelection();
    const selectedText = selection.toString();
    
    if (!richEditor.contains(selection.anchorNode)) {
      richEditor.focus();
      return;
    }
    
    // For markdown mode, insert markdown syntax
    if (isMarkdownMode) {
      insertMarkdownSyntax(formatType, selectedText);
      return;
    }
    
    // For rich text mode, apply HTML formatting
    switch (formatType) {
      case 'bold':
        document.execCommand('bold', false, null);
        break;
      case 'italic':
        document.execCommand('italic', false, null);
        break;
      case 'list':
        document.execCommand('insertUnorderedList', false, null);
        break;
      case 'heading':
        // Insert heading at current selection
        const headingLevel = prompt('Enter heading level (1-6):', '2');
        if (headingLevel && !isNaN(headingLevel) && headingLevel >= 1 && headingLevel <= 6) {
          document.execCommand('formatBlock', false, `h${headingLevel}`);
        }
        break;
      case 'code':
        // Wrap selection in <code> tags
        if (selectedText) {
          document.execCommand('insertHTML', false, `<code>${selectedText}</code>`);
        } else {
          document.execCommand('insertHTML', false, '<code>code</code>');
        }
        break;
      case 'codeblock':
        // Create a code block and optionally add language
        const language = prompt('Enter programming language (optional):', 'javascript');
        const codeBlockHtml = `<pre><code class="language-${language || 'plaintext'}">${selectedText || 'Your code here'}</code></pre>`;
        document.execCommand('insertHTML', false, codeBlockHtml);
        
        // Highlight the new code block
        setTimeout(highlightCodeBlocks, 10);
        break;
      case 'link':
        // Insert link
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          document.execCommand('createLink', false, url);
        }
        break;
    }
    
    // Update hidden field value
    hiddenTextField.value = convertHtmlToMarkdown(richEditor.innerHTML);
    enableSubmit();
  }
  
  // Insert markdown syntax for the chosen format
  function insertMarkdownSyntax(formatType, selectedText) { 
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    let markdownSyntax = '';
    
    switch (formatType) {
      case 'bold':
        markdownSyntax = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        markdownSyntax = `*${selectedText || 'italic text'}*`;
        break;
      case 'heading':
        const headingLevel = prompt('Enter heading level (1-6):', '2');
        if (headingLevel && !isNaN(headingLevel) && headingLevel >= 1 && headingLevel <= 6) {
          const prefix = '#'.repeat(parseInt(headingLevel));
          markdownSyntax = `${prefix} ${selectedText || 'Heading'}`;
        }
        break;
      case 'list':
        markdownSyntax = `- ${selectedText || 'List item'}`;
        break;
      case 'code':
        markdownSyntax = `\`${selectedText || 'code'}\``;
        break;
      case 'codeblock':
        const language = prompt('Enter programming language (optional):', 'javascript');
        markdownSyntax = `\`\`\`${language || ''}\n${selectedText || 'Your code here'}\n\`\`\``;
        break;
      case 'link':
        const url = prompt('Enter URL:', 'https://');
        if (url) {
          markdownSyntax = `[${selectedText || url}](${url})`;
        }
        break;
    }
    
    if (markdownSyntax) {
      // Insert the markdown syntax at the cursor position
      range.deleteContents();
      range.insertNode(document.createTextNode(markdownSyntax));
      
      // Update the hidden textarea
      hiddenTextField.value = richEditor.textContent;
      enableSubmit();
    }
  }
  
  // Convert markdown to HTML for display in rich text editor
  function convertMarkdownToHtml(markdown) {
    if (!markdown) return '';
    
    // Basic markdown to HTML conversion
    let html = markdown
      // Convert code blocks
      .replace(/```([a-z]*)\n([\s\S]*?)\n```/g, '<pre><code class="language-$1">$2</code></pre>')
      // Convert inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Convert headings
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
      // Convert bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      // Convert lists
      .replace(/^\- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
      
    return html;
  }
  
  // Convert HTML to markdown for storage
  function convertHtmlToMarkdown(html) {
    if (!html) return '';
    
    // Create a temporary element to work with the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Handle code blocks first
    Array.from(tempDiv.querySelectorAll('pre code')).forEach(codeBlock => {
      const language = codeBlock.className.replace('language-', '') || '';
      const content = codeBlock.textContent;
      const markdownCodeBlock = `\`\`\`${language}\n${content}\n\`\`\``;
      
      // Replace the <pre><code> with a placeholder
      const placeholder = document.createTextNode(markdownCodeBlock);
      codeBlock.parentNode.replaceWith(placeholder);
    });
    
    // Handle inline code
    Array.from(tempDiv.querySelectorAll('code')).forEach(code => {
      const content = code.textContent;
      const markdownCode = `\`${content}\``;
      
      // Replace the <code> with markdown
      const placeholder = document.createTextNode(markdownCode);
      code.replaceWith(placeholder);
    });
    
    // Handle headings
    for (let i = 1; i <= 6; i++) {
      Array.from(tempDiv.querySelectorAll(`h${i}`)).forEach(heading => {
        const content = heading.textContent;
        const markdownHeading = `${'#'.repeat(i)} ${content}`;
        
        // Replace the heading with markdown
        const placeholder = document.createTextNode(markdownHeading + '\n\n');
        heading.replaceWith(placeholder);
      });
    }
    
    // Handle bold text
    Array.from(tempDiv.querySelectorAll('strong, b')).forEach(bold => {
      const content = bold.textContent;
      const markdownBold = `**${content}**`;
      
      // Replace the bold with markdown
      const placeholder = document.createTextNode(markdownBold);
      bold.replaceWith(placeholder);
    });
    
    // Handle italic text
    Array.from(tempDiv.querySelectorAll('em, i')).forEach(italic => {
      const content = italic.textContent;
      const markdownItalic = `*${content}*`;
      
      // Replace the italic with markdown
      const placeholder = document.createTextNode(markdownItalic);
      italic.replaceWith(placeholder);
    });
    
    // Handle links
    Array.from(tempDiv.querySelectorAll('a')).forEach(link => {
      const content = link.textContent;
      const href = link.getAttribute('href');
      const markdownLink = `[${content}](${href})`;
      
      // Replace the link with markdown
      const placeholder = document.createTextNode(markdownLink);
      link.replaceWith(placeholder);
    });
    
    // Handle unordered lists
    Array.from(tempDiv.querySelectorAll('ul')).forEach(list => {
      const items = Array.from(list.querySelectorAll('li')).map(item => {
        return `- ${item.textContent}`;
      }).join('\n');
      
      // Replace the list with markdown
      const placeholder = document.createTextNode(items + '\n\n');
      list.replaceWith(placeholder);
    });
    
    return tempDiv.textContent.trim();
  }
  
  // Highlight code blocks in the editor
  function highlightCodeBlocks() {
    // Use prism.js or highlight.js if available, otherwise basic styling
    const codeBlocks = richEditor.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
      // Add a simple class for styling if no syntax highlighting library is available
      codeBlock.classList.add('code-highlighted');
      
      // If prism.js is available, trigger highlighting
      if (window.Prism) {
        window.Prism.highlightElement(codeBlock);
      }
    });
  }

  // Speech recognition setup for voice-to-text
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
      
      // If it's a final result, append to editor at cursor position
      if (result.isFinal) {
        if (isMarkdownMode) {
          // In markdown mode, insert text at cursor
          const selection = window.getSelection();
          if (richEditor.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            
            // Add space before new text if needed
            const spacer = (range.startOffset > 0 && 
                          selection.anchorNode.textContent[range.startOffset - 1] !== ' ' && 
                          transcript.length > 0 && transcript[0] !== ' ') ? ' ' : '';
            
            range.deleteContents();
            range.insertNode(document.createTextNode(spacer + transcript));
            
            // Move cursor to end of inserted text
            range.setStartAfter(range.endContainer);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            // If no cursor position, append to end
            richEditor.textContent += transcript;
          }
        } else {
          // In rich text mode, use execCommand
          document.execCommand('insertText', false, transcript);
        }
        
        // Update hidden field
        hiddenTextField.value = isMarkdownMode ? 
          richEditor.textContent : 
          convertHtmlToMarkdown(richEditor.innerHTML);
        
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
      const contentValue = hiddenTextField.value.trim();

      console.log('Modal values:', { // Debug log
        title: titleValue,
        content: contentValue
      });

      const noteData = {
        title: titleValue || 'Untitled',
        content: contentValue // Store markdown content
      };

      console.log('Sending note data:', noteData); // Debug log
      callback(noteData);
    });
  }

  return { open, close, onSubmit }
}

// Keep the DeleteConfirmModal unchanged
const DeleteConfirmModal = function (title) {
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