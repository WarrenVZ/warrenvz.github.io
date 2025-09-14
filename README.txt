Before uploading your changes to the internet, please run the following 2 Python scripts in order:

build-rss-feed.py
build-nav-and-footers.py

"build-rss-feed.py" automatically updates your feed.xml file to contain all blog posts.

"build-nav-and-footers.py" creates a new folder called "build" in the root directory, then injects all webpages' empty <header> and <footer> tags with the custom HTML from "reusable-html-components". This way, your website doesn't need JavaScript to dynamically load your nav and footer. This script also automatically deletes the "<script src="/scripts/reusable-html-loader.js"></script>" tag from all your webpages. This JavaScript code is still useful when editing offline, but will interfere with the online compiled version of your website, so it's important to delete that tag from all pages.





Alternatively, you can use the JavaScript-equivalent scripts. They both do the same thing:
build-rss-feed.js
build-nav-and-footers.js
