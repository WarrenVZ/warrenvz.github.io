async function loadHTML(url, targetSelector) {
  try {
    const response = await fetch(url);
    const htmlContent = await response.text();
    const targetElement = document.querySelector(targetSelector);

    if (targetElement) {
      targetElement.innerHTML = htmlContent;



      // if (url === '/nav/nav2.html') { // Adds the hamburger functionality to nav2.html!!!
      //   addHamburgerFunctionality();
      // }





    } else {
      console.error(`No element found with the selector: ${targetSelector} to inject content from ${url}.`);
    }
  } catch (error) {
    console.error(`Failed to load content from ${url}:`, error);
  }
}




// function addHamburgerFunctionality() {
//   const hamburger = document.querySelector('.hamburger');
//   const navLinks = document.querySelector('.nav-links');

//   if (hamburger && navLinks) {
//     hamburger.addEventListener('click', () => {
//       navLinks.classList.toggle('active');
//       hamburger.classList.toggle('active');
//     });
//   }
// }






document.addEventListener('DOMContentLoaded', () => {

  loadHTML('/reusable-html-components/nav.html', 'header');
  loadHTML('/reusable-html-components/footer.html', 'footer');

});