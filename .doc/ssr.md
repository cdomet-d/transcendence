# Server Side Rendering

### CSR (client side rendering)
with CSR the server sends an html file (this is mandatory regardless the rendering technique cause the browser needs an html file to create the DOM) with nothing to be rendered, only a script. \
The script is in charge of rendering. For example with our SPA, our script loads the first page by getting the current url then gets the callback function of that url which will inject html in our page. same logic when we click a button.

=> CSR is when your web pages are rendered on the browser using a js bundle.

### SSR
with SSR the server sends a ready html file for every one of your website's pages. \
Every time you navigate to another page, the browser sends an HTTP request, and the server responds with the HTML of that page.

### SSR + SPA
in order to have both we have to do a "hybrid" SSR. Only the first page will be rendered server side (fast first load) and then for every click to change pages the SPA router will handle it. the SPA only handles injecting new html, conserning specific data we'll do an http request.
