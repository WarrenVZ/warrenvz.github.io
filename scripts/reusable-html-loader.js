async function loadHTML(url, targetSelector) {
  try {
    const response = await fetch(url);
    const htmlContent = await response.text();
    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
      targetElement.innerHTML = htmlContent;
      // If your navigation has interactive elements like the hamburger button,
      // you might need to call the function to enable them here,
      // especially if it wasn't already called after loading nav.html previously.


      if (url === '/nav2.html') { // Adds the hamburger functionality to nav2.html!!!
        addHamburgerFunctionality();
      }




    } else {
      console.error(`No element found with the selector: ${targetSelector} to inject content from ${url}.`);
    }
  } catch (error) {
    console.error(`Failed to load content from ${url}:`, error);
  }
}

function addHamburgerFunctionality() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // If you're using GitHub Pages, include your repo
  // name, such as /website/nav.html. Doing this will
  // make your offline webpage not be able to fetch
  // the HTML, which is fine. You can edit out your
  // repo name while you're editing offline, but
  // remember to re-enable it!!! Also, remember the
  // if statement above that adds the hamburger
  // functionality! Add your repo name there too!
  // Alternatively, you can duplicate the code into
  // two different versions, and comment out depending
  // if you're editing offline, or uploading to live.


  // REPLACE "/website/" (YOUR REPO NAME) WITH "../../" WHEN EDITING OFFLINE
  
  loadHTML('/nav2.html', 'header');
  loadHTML('/footer.html', 'footer');



  // You can add other loadHTML calls here for your footer, sidebar, etc.
});