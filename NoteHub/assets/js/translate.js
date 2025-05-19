// Language translations
const translations = {
  bulgarian: {
    // Navigation
    'Features': 'Функции',
    'Showcase': 'Демонстрация',
    'How it Works': 'Как работи',
    'Contact': 'Контакт',
    
    // Header
    'Capture Your Ideas': 'Запишете идеите си',
    'The smart way to organize your thoughts and boost productivity': 'Интелигентният начин да организирате мислите си и да повишите продуктивността',
    'Get Started Free': 'Започнете безплатно',
    'Learn More': 'Научете повече',
    
    // Features section
    'Powerful Features': 'Мощни функции',
    'Smart Notes': 'Интелигентни бележки',
    'Create, edit, and organize your notes with our intuitive interface. Supporting markdown, rich text, and code snippets.': 'Създавайте, редактирайте и организирайте вашите бележки с нашия интуитивен интерфейс. Поддържа markdown, форматиран текст и програмен код.',
    'Cloud Sync': 'Облачна синхронизация',
    'Access your notes from anywhere with seamless cloud synchronization across all your devices.': 'Достъп до вашите бележки от всяко място с безпроблемна облачна синхронизация на всички ваши устройства.',
    'Secure Storage': 'Сигурно съхранение',
    'Your notes are encrypted and safely stored in our secure servers with regular backups.': 'Вашите бележки са криптирани и безопасно съхранявани в нашите сигурни сървъри с редовни архиви.',
    'Smart Tags': 'Интелигентни тагове',
    'Organize your notes with intelligent tagging system and powerful search capabilities.': 'Организирайте бележките си с интелигентна система за тагове и мощни възможности за търсене.',
    'Theme Customization': 'Персонализиране на теми',
    'Personalize the interface with customizable themes, including font size, colors, and layout preferences.': 'Персонализирайте интерфейса с настройващи се теми, включително размер на шрифта, цветове и предпочитания за оформление.',
    'Mobile Ready': 'Готов за мобилни устройства',
    'Seamlessly adapt to any screen size for optimal usability on mobile, tablet, and desktop devices.': 'Безпроблемно адаптиране към всеки размер на екрана за оптимална използваемост на мобилни, таблети и настолни устройства.',
    
    // Showcase section
    'Experience the Future of Note-Taking': 'Изпитайте бъдещето на водене на бележки',
    'Smart Editor': 'Интелигентен редактор',
    'Organization': 'Организация',
    'Collaboration': 'Съвместна работа',
    'Intelligent Note Editor': 'Интелигентен редактор на бележки',
    'Experience writing at its finest with our advanced editor that adapts to your needs.': 'Изпитайте писането в най-добрия му вид с нашия усъвършенстван редактор, който се адаптира към вашите нужди.',
    'Rich text formatting with markdown support': 'Форматиране на богат текст с поддръжка на markdown',
    'Code syntax highlighting': 'Подчертаване на синтаксиса на кода',
    'Smart formatting suggestions': 'Интелигентни предложения за форматиране',
    'Real-time preview': 'Преглед в реално време',
    
    // How it works section
    'How It Works': 'Как работи',
    'Sign Up Instantly': 'Регистрирайте се моментално',
    'Create your free account in seconds and start taking notes right away. No credit card required.': 'Създайте безплатния си акаунт за секунди и започнете да водите бележки веднага. Не се изисква кредитна карта.',
    'Create Your First Note': 'Създайте първата си бележка',
    'Use our intuitive editor to capture your thoughts. Organize them with tags and folders.': 'Използвайте нашия интуитивен редактор, за да запишете мислите си. Организирайте ги с тагове и папки.',
    'Sync Across Devices': 'Синхронизирайте между устройства',
    'Access your notes from anywhere. Changes sync automatically across all your devices.': 'Достъп до бележките ви от всякъде. Промените се синхронизират автоматично на всички ваши устройства.',
    
    // About/Contact section
    'About Me': 'За мен',
    'Hi, I\'m Kaloyan Vasilev, the creator of NoteHub. As a software developer and productivity enthusiast, I built NoteHub to solve the challenges I faced with existing note-taking solutions.': 'Здравейте, аз съм Калоян Василев, създателят на NoteHub. Като софтуерен разработчик и ентусиаст по производителността, създадох NoteHub, за да реша предизвикателствата, с които се сблъсках при съществуващите решения за водене на бележки.',
    'Get in Touch': 'Свържете се',
    'Name': 'Име',
    'Email': 'Имейл',
    'Message': 'Съобщение',
    'Send Message': 'Изпрати съобщение',

      // Form messages
    'Please wait...': 'Моля изчакайте...',
    'Form submitted successfully': 'Формата е изпратена успешно',
    'Something went wrong!': 'Нещо се обърка!',
    
    // Form placeholders
    'Enter your name': 'Въведете вашето име',
    'Enter your email': 'Въведете вашия имейл',
    'Type your message here...': 'Въведете вашето съобщение тук...',
    
    // Footer
    'Making note-taking smarter and more productive.': 'Правим воденето на бележки по-интелигентно и продуктивно.',
    'Links': 'Връзки',
    'Legal': 'Правна информация',
    'Privacy Policy': 'Политика за поверителност',
    'Terms of Service': 'Условия за ползване',
    'Cookie Policy': 'Политика за бисквитки',
    'All rights reserved.': 'Всички права запазени.'
  }
};

// Store original texts
let originalTexts = {};
let languageState = 'english'; // Default language

// Function to capture original text content
function captureOriginalTexts() {
  // Navigation links
  document.querySelectorAll('.nav-links a:not(.lang-btn)').forEach(link => {
    originalTexts[link.textContent.trim()] = link.textContent.trim();
  });

  // Header content
  originalTexts[document.querySelector('.header-title').textContent] = document.querySelector('.header-title').textContent;
  originalTexts[document.querySelector('.header-subtitle').textContent] = document.querySelector('.header-subtitle').textContent;
  
  // CTA buttons
  document.querySelectorAll('.cta-btn').forEach(btn => {
    originalTexts[btn.textContent.trim()] = btn.textContent.trim();
  });

  // Section titles
  document.querySelectorAll('.section-title').forEach(title => {
    originalTexts[title.textContent.trim()] = title.textContent.trim();
  });

  // Feature cards
  document.querySelectorAll('.feature-card h3').forEach(heading => {
    originalTexts[heading.textContent.trim()] = heading.textContent.trim();
  });
  
  document.querySelectorAll('.feature-card p').forEach(paragraph => {
    originalTexts[paragraph.textContent.trim()] = paragraph.textContent.trim();
  });

  // Showcase tabs and content
  document.querySelectorAll('.showcase-tab').forEach(tab => {
    originalTexts[tab.textContent.trim()] = tab.textContent.trim();
  });
  
  document.querySelectorAll('.showcase-text h3').forEach(heading => {
    originalTexts[heading.textContent.trim()] = heading.textContent.trim();
  });
  
  document.querySelectorAll('.showcase-text p').forEach(paragraph => {
    originalTexts[paragraph.textContent.trim()] = paragraph.textContent.trim();
  });
  
  document.querySelectorAll('.showcase-text li').forEach(item => {
    originalTexts[item.textContent.trim()] = item.textContent.trim();
  });

  // How it works section
  document.querySelectorAll('.step h3').forEach(heading => {
    originalTexts[heading.textContent.trim()] = heading.textContent.trim();
  });
  
  document.querySelectorAll('.step p').forEach(paragraph => {
    originalTexts[paragraph.textContent.trim()] = paragraph.textContent.trim();
  });

  // About & Contact section
  originalTexts[document.querySelector('.profile-info p').textContent.trim()] = document.querySelector('.profile-info p').textContent.trim();
  
  document.querySelectorAll('.form-group label').forEach(label => {
    originalTexts[label.textContent.trim()] = label.textContent.trim();
  });
  
  originalTexts[document.querySelector('.submit-btn').textContent.trim()] = document.querySelector('.submit-btn').textContent.trim();

  // Footer
  document.querySelectorAll('.footer-section p').forEach(paragraph => {
    originalTexts[paragraph.textContent.trim()] = paragraph.textContent.trim();
  });
  
  document.querySelectorAll('.footer-section h3').forEach(heading => {
    originalTexts[heading.textContent.trim()] = heading.textContent.trim();
  });
  
  document.querySelectorAll('.footer-links li a').forEach(link => {
    originalTexts[link.textContent.trim()] = link.textContent.trim();
  });
}

// Function to translate the page to Bulgarian
function translateToBulgarian() {
  // Capture original text if not done yet
  if (Object.keys(originalTexts).length === 0) {
    captureOriginalTexts();
  }
  
  // Navigate through DOM and replace text content
  // Navigation links
  document.querySelectorAll('.nav-links a:not(.lang-btn)').forEach(link => {
    const text = link.textContent.trim();
    if (translations.bulgarian[text]) {
      link.textContent = translations.bulgarian[text];
    }
  });

  // Header content
  const headerTitle = document.querySelector('.header-title');
  if (translations.bulgarian[headerTitle.textContent.trim()]) {
    headerTitle.textContent = translations.bulgarian[headerTitle.textContent.trim()];
  }
  
  const headerSubtitle = document.querySelector('.header-subtitle');
  if (translations.bulgarian[headerSubtitle.textContent.trim()]) {
    headerSubtitle.textContent = translations.bulgarian[headerSubtitle.textContent.trim()];
  }
  
  // CTA buttons
  document.querySelectorAll('.cta-btn').forEach(btn => {
    const text = btn.textContent.trim();
    if (translations.bulgarian[text]) {
      btn.textContent = translations.bulgarian[text];
    }
  });

  // Section titles
  document.querySelectorAll('.section-title').forEach(title => {
    const text = title.textContent.trim();
    if (translations.bulgarian[text]) {
      title.textContent = translations.bulgarian[text];
    }
  });

  // Feature cards
  document.querySelectorAll('.feature-card h3').forEach(heading => {
    const text = heading.textContent.trim();
    if (translations.bulgarian[text]) {
      heading.textContent = translations.bulgarian[text];
    }
  });
  
  document.querySelectorAll('.feature-card p').forEach(paragraph => {
    const text = paragraph.textContent.trim();
    if (translations.bulgarian[text]) {
      paragraph.textContent = translations.bulgarian[text];
    }
  });

  // Showcase tabs and content
  document.querySelectorAll('.showcase-tab').forEach(tab => {
    const text = tab.textContent.trim();
    if (translations.bulgarian[text]) {
      tab.textContent = translations.bulgarian[text];
    }
  });
  
  document.querySelectorAll('.showcase-text h3').forEach(heading => {
    const text = heading.textContent.trim();
    if (translations.bulgarian[text]) {
      heading.textContent = translations.bulgarian[text];
    }
  });
  
  document.querySelectorAll('.showcase-text p').forEach(paragraph => {
    const text = paragraph.textContent.trim();
    if (translations.bulgarian[text]) {
      paragraph.textContent = translations.bulgarian[text];
    }
  });
  
  document.querySelectorAll('.showcase-text li').forEach(item => {
    const text = item.textContent.trim();
    const liText = text.substring(text.indexOf('') + 1).trim();
    if (translations.bulgarian[liText]) {
      // Preserve the icon
      const icon = item.querySelector('i');
      item.innerHTML = '';
      if (icon) {
        item.appendChild(icon);
      }
      item.appendChild(document.createTextNode(' ' + translations.bulgarian[liText]));
    }
  });

  // How it works section
  document.querySelectorAll('.step h3').forEach(heading => {
    const text = heading.textContent.trim();
    if (translations.bulgarian[text]) {
      heading.textContent = translations.bulgarian[text];
    }
  });
  
  document.querySelectorAll('.step p').forEach(paragraph => {
    const text = paragraph.textContent.trim();
    if (translations.bulgarian[text]) {
      paragraph.textContent = translations.bulgarian[text];
    }
  });

  // About & Contact section
  const profileInfo = document.querySelector('.profile-info p');
  if (translations.bulgarian[profileInfo.textContent.trim()]) {
    profileInfo.textContent = translations.bulgarian[profileInfo.textContent.trim()];
  }
  
  document.querySelectorAll('.form-group label').forEach(label => {
    const text = label.textContent.trim();
    if (translations.bulgarian[text]) {
      label.textContent = translations.bulgarian[text];
    }
  });
  
  
  const submitBtn = document.querySelector('.submit-btn');
  if (translations.bulgarian[submitBtn.textContent.trim()]) {
    submitBtn.textContent = translations.bulgarian[submitBtn.textContent.trim()];
  }

  // Footer
  document.querySelectorAll('.footer-section p').forEach(paragraph => {
    const text = paragraph.textContent.trim();
    if (translations.bulgarian[text]) {
      paragraph.textContent = translations.bulgarian[text];
    }
  });
  
  document.querySelectorAll('.footer-section h3').forEach(heading => {
    const text = heading.textContent.trim();
    if (translations.bulgarian[text]) {
      heading.textContent = translations.bulgarian[text];
    }
  });
  
  document.querySelectorAll('.footer-links li a').forEach(link => {
    const text = link.textContent.trim();
    if (translations.bulgarian[text]) {
      link.textContent = translations.bulgarian[text];
    }
  });

  // Copyright text
  const footerCopyright = document.querySelector('footer p[style="text-align: center; margin-top: 2rem;"]');
  if (footerCopyright) {
    const copyrightText = footerCopyright.textContent;
    const year = copyrightText.match(/\d{4}/)[0];
    footerCopyright.textContent = `© ${year} NoteHub. ${translations.bulgarian['All rights reserved.']}`;
  }

  // Update button text to show current language state
  document.getElementById('translate-btn').innerHTML = '<i class="fas fa-language"></i> EN';
  
  // Update language state
  languageState = 'bulgarian';
}

// Function to restore original English text
function translateToEnglish() {
  // Navigation links
  document.querySelectorAll('.nav-links a:not(.lang-btn)').forEach(link => {
    const bulgText = link.textContent.trim();
    // Find the original English text
    for (const [engText, bulText] of Object.entries(translations.bulgarian)) {
      if (bulText === bulgText) {
        link.textContent = engText;
        break;
      }
    }
  });

  // For each element with translated text, restore the original
  for (const [originalText, element] of Object.entries(originalTexts)) {
    // Find all elements containing the translated text
    const translatedText = translations.bulgarian[originalText];
    if (translatedText) {
      document.querySelectorAll('h1, h2, h3, p, a:not(.lang-btn), label, button, .showcase-tab, .step-number').forEach(el => {
        if (el.textContent.trim() === translatedText) {
          el.textContent = originalText;
        }
      });
    }
  }

  // Update button text to show current language state
  document.getElementById('translate-btn').innerHTML = '<i class="fas fa-language"></i> БГ';
  
  // Update language state
  languageState = 'english';
}

// Event listener for the translate button
document.addEventListener('DOMContentLoaded', function() {
  const translateBtn = document.getElementById('translate-btn');
  
  translateBtn.addEventListener('click', function(e) {
    e.preventDefault();
    
    if (languageState === 'english') {
      translateToBulgarian();
    } else {
      translateToEnglish();
    }
  });
});