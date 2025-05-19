const greeting = function () {
  const currentHour = new Date().getHours();
  
  const greetings = 
  currentHour < 12 ? 'Morning' :
  currentHour < 18 ? 'Afternoon' :
  currentHour < 24 ? 'Evening' :
  'Morning'
  return `Good ${greetings}`;
}


const getDate = function () {
  const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date(),
  currentDay = currentDate.getDate(),
  currentMonth = Months[currentDate.getMonth()],
  currentYear = currentDate.getFullYear();
  
  return `${currentMonth} ${currentDay}, ${currentYear}`;
}
/**
 * Converts a timestamp in milliseconds to a human-readable relative time string.
 * 
 * @param {number} milliseconds - The timestamp in milliseconds to convert
 * @returns {string} A string representing the relative time (e.g., "Just now", "5 min ago", "3 hours ago", "2 days ago").
 */
const getRelativeTime = function (milliseconds) {
  // If the timestamp is from the future, use current time instead
  const now = new Date().getTime();
  const timestamp = milliseconds > now ? now : milliseconds;

  const minute = Math.floor((now - timestamp) / 1000 / 60);
  const hour = Math.floor(minute / 60);
  const day = Math.floor(hour / 24);

  return minute < 1 ? "Just now" : 
         minute < 60 ? `${minute} min ago` : 
         hour < 24 ? `${hour} hour ago` : 
         `${day} day ago`;
}

// make note book field content editable and focus

export const makeElemEditable = function (element) {
  element.setAttribute('contenteditable', 'true');
  element.focus();
};

// generating id for the notebooks

function generateID () {
  return new Date().getTime().toString()
}

// active new created notebook and deactive previous one
let lastActiveNavItem;

const activeNoteBook = function () {
  lastActiveNavItem?.classList.remove('active');
  this.classList.add('active'); //this: navItem
  lastActiveNavItem = this;
}

/**
 * Finds a notebook in database by its ID.
 * 
 * @param {Object} db - the database containing the notebooks.
 * @param {string} notebookId - The ID of the notebook to find.
 * @returns {Object | undefined} the found notebook object or undefined if not found.
 * 
 */

const findNotebook = function (db, notebookId){
  return db.notebooks.find(notebook => notebook.id === notebookId);
}

/**
 * Finds the index of a notebook in an array of notebooks based on its ID.
 * 
 * @param {Object} db - the object containing an array of notebooks.
 * @param {String} notebookId - the id of the notebook to find.
 * @returns {number} the index of the found notebook, or -1 if not 
 * found.
 */

const findNotebookIndex = function (db, notebookId) {
  return db.notebooks.findIndex(item => item.id === notebookId);
}

/**
 * Finds a specific note by its ID within a database of notebooks and their notes.
 * 
 * @param {Object} db - The database containing notebooks and notes.
 * @param {string} noteId - The ID of the note to find.
 * @returns {Object | undefined} The found note object, or undefined if not found.
 */

const findNote = (db, noteId) => {
  let note;
  for (const notebook of db.notebooks) {
    note = notebook.notes.find(note => note.id === noteId);
    if (note) break;
  }
  return note;
}

const findNoteIndex = function (notebook, noteId) {
  return notebook.notes.findIndex(note => note.id === noteId);
}

/**
 * Converts markdown syntax to HTML
 * 
 * @param {string} text - The markdown text to convert
 * @returns {string} - The HTML representation of the markdown text
 */
const markdownToHtml = function(text) {
  if (!text) return '';
  
  // Convert bold: **text** to <strong>text</strong>
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic: *text* or _text_ to <em>text</em>
  html = html.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
  
  // Convert lists: - item to <li>item</li>
  html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
  
  // Wrap lists in <ul> tags
  if (html.includes('<li>')) {
    html = html.replace(/(<li>.*?<\/li>)+/gs, '<ul>$&</ul>');
  }
  
  // Convert links: [text](url) to <a href="url">text</a>
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // Convert headings: ### text to <h3>text</h3>
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
  
  // Convert paragraphs: add <p> for text blocks
  html = html.replace(/^(?!<[uh]|<li|<p|<h|<a)(.*?)$/gm, '<p>$1</p>');
  
  return html;
}


export {
  greeting,
  getDate,
  generateID,
  activeNoteBook,
  findNotebook,
  findNotebookIndex,
  getRelativeTime,
  findNote,
  findNoteIndex,
  markdownToHtml
}