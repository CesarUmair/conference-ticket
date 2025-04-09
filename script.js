document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  const form = document.getElementById('ticket-form');
  const formSection = document.getElementById('form-section');
  const ticketSection = document.getElementById('ticket-section');
  const uploadArea = document.getElementById('upload-area');
  const avatarInput = document.getElementById('avatar-upload');
  
  // Error messages
  const fullnameError = document.getElementById('fullname-error');
  const emailError = document.getElementById('email-error');
  const githubError = document.getElementById('github-error');
  const avatarError = document.getElementById('avatar-error');
  
  // Form inputs
  const fullnameInput = document.getElementById('fullname');
  const emailInput = document.getElementById('email');
  const githubInput = document.getElementById('github');
  
  // Ticket elements
  const ticketName = document.getElementById('ticket-name');
  const ticketEmail = document.getElementById('ticket-email');
  const ticketFullname = document.getElementById('ticket-fullname');
  const ticketEmailDisplay = document.getElementById('ticket-email-display');
  const ticketGithub = document.getElementById('ticket-github');
  const ticketAvatarImg = document.getElementById('ticket-avatar-img');
  const ticket = document.getElementById('ticket');
  
  // Default avatar
  let uploadedAvatar = null;
  let defaultAvatarSrc = ticketAvatarImg.src;

  // Add real-time validation
  fullnameInput.addEventListener('input', () => {
    validateInput(fullnameInput, fullnameError, 'Please enter your full name');
  });
  
  emailInput.addEventListener('input', () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateInput(emailInput, emailError, 'Please enter a valid email address', (value) => emailRegex.test(value.trim()));
  });
  
  githubInput.addEventListener('input', () => {
    validateInput(githubInput, githubError, 'Please enter your GitHub username');
  });

  // Function to validate input
  function validateInput(input, errorElement, errorMessage, customValidator = null) {
    const value = input.value.trim();
    const isEmpty = value === '';
    const isValid = customValidator ? customValidator(value) : !isEmpty;
    
    if (!isValid) {
      showError(errorElement, errorMessage);
      highlightInput(input);
    } else {
      clearError(errorElement);
      input.classList.remove('error');
    }
    
    return isValid;
  }

  // Handle file upload area click
  uploadArea.addEventListener('click', () => {
    avatarInput.click();
  });
  
  // Handle drag and drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
  });
  
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
      uploadArea.classList.add('highlight');
    });
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => {
      uploadArea.classList.remove('highlight');
    });
  });
  
  uploadArea.addEventListener('drop', handleDrop);
  
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
  }
  
  // Handle file input change
  avatarInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
  
  function handleFiles(files) {
    if (files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        showError(avatarError, 'Please upload a JPG or PNG image.');
        return;
      }
      
      // Validate file size (max 500KB)
      if (file.size > 500 * 1024) {
        showError(avatarError, 'Image size exceeds 500KB limit.');
        return;
      }
      
      // Clear any previous error
      clearError(avatarError);
      
      // Read file as data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedAvatar = e.target.result;
        showUploadedPreview();
      };
      reader.readAsDataURL(file);
    }
  }
  
  function showUploadedPreview() {
    // Create a preview in the upload area
    uploadArea.innerHTML = `
      <div class="preview-container">
        <img src="${uploadedAvatar}" alt="Preview" class="avatar-preview">
        <p>Image uploaded successfully!</p>
      </div>
    `;
  }
  
  // Form validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset errors
    clearAllErrors();
    
    // Validate all inputs
    const isFullnameValid = validateInput(fullnameInput, fullnameError, 'Please enter your full name');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = validateInput(
      emailInput, 
      emailError, 
      'Please enter a valid email address', 
      (value) => emailRegex.test(value.trim())
    );
    
    const isGithubValid = validateInput(githubInput, githubError, 'Please enter your GitHub username');
    
    // If form is valid, generate ticket
    if (isFullnameValid && isEmailValid && isGithubValid) {
      // Add animation class to form before hiding
      formSection.classList.add('completed');
      
      // Delay ticket generation for animation effect
      setTimeout(() => {
        generateTicket();
      }, 500);
    }
  });
  
  function showError(element, message) {
    element.textContent = message;
  }
  
  function clearError(element) {
    element.textContent = '';
  }
  
  function clearAllErrors() {
    clearError(fullnameError);
    clearError(emailError);
    clearError(githubError);
    clearError(avatarError);
    
    fullnameInput.classList.remove('error');
    emailInput.classList.remove('error');
    githubInput.classList.remove('error');
  }
  
  function highlightInput(input) {
    input.classList.add('error');
  }
  
  function generateTicket() {
    // Update ticket with form data
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const github = githubInput.value.trim();
    
    // Update ticket content
    ticketName.textContent = fullname;
    ticketEmail.textContent = email;
    ticketFullname.textContent = fullname;
    ticketGithub.textContent = '@' + github;
    
    // Set avatar if uploaded, otherwise use default
    if (uploadedAvatar) {
      ticketAvatarImg.src = uploadedAvatar;
    } else {
      ticketAvatarImg.src = defaultAvatarSrc;
    }
    
    // Generate random ticket number
    const ticketNumber = document.getElementById('ticket-number');
    const randomNum = Math.floor(Math.random() * 9000000) + 1000000;
    ticketNumber.textContent = '#' + randomNum;
    
    // Hide form and tagline, show ticket
    formSection.style.display = 'none';
    document.querySelector('.tagline').style.display = 'none';
    ticketSection.style.display = 'flex';
    
    // Create a printable version for new tab
    createPrintableTicket();
  }
  
  function createPrintableTicket() {
    // Clone the ticket
    const ticketClone = ticket.cloneNode(true);
    
    // Create a new html document for the ticket
    const ticketHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Conference Ticket</title>
        <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;500;700;800&display=swap" rel="stylesheet">
        <style>
          :root {
            --neutral-0: hsl(0, 0%, 100%);
            --neutral-300: hsl(252, 6%, 83%);
            --neutral-500: hsl(245, 15%, 58%);
            --neutral-700: hsl(245, 19%, 35%);
            --neutral-900: hsl(248, 70%, 10%);
            --orange-500: hsl(7, 88%, 67%);
            --orange-700: hsl(7, 71%, 60%);
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inconsolata', monospace;
            background-color: var(--neutral-900);
            color: var(--neutral-0);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-image: url('${window.location.href.substring(0, window.location.href.lastIndexOf('/'))}/assets/images/background-desktop.png');
            background-repeat: no-repeat;
            background-size: cover;
            background-position: center;
          }
          
          .ticket {
            width: 100%;
            max-width: 600px;
            position: relative;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            border-radius: 12px;
            overflow: hidden;
            background: linear-gradient(135deg, rgba(28, 22, 80, 0.95) 0%, rgba(20, 15, 60, 0.95) 100%);
            color: var(--neutral-0);
            margin-top: 2rem;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('${window.location.href.substring(0, window.location.href.lastIndexOf('/'))}/assets/images/pattern-ticket.svg');
            height: 280px;
            color: white;
          }
          
          .ticket-header {
            padding: 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          
          .ticket-logo {
            width: 2.5rem;
            height: 2.5rem;
          }
          
          .ticket-title {
            display: flex;
            flex-direction: column;
          }
          
          .ticket-title h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0;
          }
          
          .ticket-title p {
            color: var(--neutral-300);
            font-size: 0.9rem;
            margin: 0;
          }
          
          .ticket-body {
            display: flex;
            gap: 1.5rem;
            padding: 1.5rem;
            padding-top: 0;
            position: relative;
          }
          
          .ticket-avatar {
            width: 4rem;
            height: 4rem;
            border-radius: 0.5rem;
            overflow: hidden;
            flex-shrink: 0;
          }
          
          .ticket-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .ticket-info {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .ticket-info-item .value {
            font-size: 1.5rem;
            font-weight: 700;
          }
          
          .ticket-github {
            display: flex;
            align-items: center;
            font-size: 1.1rem;
            margin-top: 0.5rem;
          }
          
          .ticket-github img {
            width: 1rem;
            height: 1rem;
            margin-right: 0.5rem;
          }
          
          .ticket-number {
            position: absolute;
            right: 1.5rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.5rem;
            font-weight: 700;
            writing-mode: vertical-rl;
            text-orientation: sideways;
            opacity: 0.6;
            letter-spacing: 2px;
          }
          
          h1 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            text-align: center;
          }
          
          h1 span {
            color: var(--orange-500);
          }
          
          p {
            color: var(--neutral-300);
            text-align: center;
            margin-bottom: 2rem;
            font-size: 1.125rem;
          }
          
          p span {
            color: var(--orange-500);
          }
          
          /* Print button */
          .print-button {
            display: inline-block;
            margin-top: 2rem;
            padding: 0.75rem 1.5rem;
            background-color: var(--orange-500);
            color: var(--neutral-0);
            border: none;
            border-radius: 0.5rem;
            font-family: 'Inconsolata', monospace;
            font-size: 1rem;
            font-weight: 700;
            cursor: pointer;
            text-align: center;
            text-decoration: none;
          }

          .print-button:hover {
            background-color: var(--orange-700);
          }
          
          /* Media Query for print */
          @media print {
            body {
              background-color: white;
              padding: 0;
              background-image: none;
            }
            
            .ticket {
              box-shadow: none;
            }
            
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <h1>Congrats, <span>${fullnameInput.value.trim()}</span>! Your ticket is ready.</h1>
        <p>We've emailed your ticket to <span>${emailInput.value.trim()}</span> and will send updates in the run up to the event.</p>
        ${ticketClone.outerHTML}
        <button class="print-button" onclick="window.print()">Print Ticket</button>
      </body>
      </html>
    `;
    
    // Open in a new tab
    const ticketTab = window.open('', '_blank');
    ticketTab.document.write(ticketHtml);
    ticketTab.document.close();
  }
});