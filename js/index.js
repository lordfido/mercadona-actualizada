(function() {
  const setAttributes = (element, attributes) => {
    if (element && attributes?.length) {
      attributes.forEach(([attr, value]) => {
        element.attributes[attr] = value;
        if (element[attr] !== undefined) {
          element[attr] = value;
        }
      });
    }
  };

  const getCSSFile = (fileName) => chrome.runtime.getURL(fileName);
  
  const loadCssfile = (frameElement, css) => {
    if (frameElement && css) {
      const link = document.createElement('link');
      link.href = getCSSFile(`/css/${css}`);
      link.rel = 'stylesheet';
      link.type = 'text/css';

      const doc = frameElement.contentDocument;
      const appendElement = frameElement.head
        ?? frameElement.body
        ?? doc.head
        ?? doc.body;

      if (!!appendElement?.append) {
        appendElement.append(link);
      }
    }
  };

  const maxSidebarWidth = 320;
  const minDesiredContentWidth = 480;
  const minDesiredTotalWidth = (maxSidebarWidth * 2) + minDesiredContentWidth;
  const getSidebarWidth = (screenWidth, frameWidth) => {
    if (screenWidth > minDesiredTotalWidth) {
      return `${maxSidebarWidth}`;
    }

    const percentage = Math.round((maxSidebarWidth * 100) / minDesiredTotalWidth);
    if (!frameWidth) {
      return `${ percentage }%`;
    }

    const desiredSize = (screenWidth * percentage) / 100;
    const framePercentage = Math.round((desiredSize * 100) / frameWidth);
    return `${framePercentage}%`;
  }

  const setMenuWidth = (screenWidth) => {
    const width = getSidebarWidth(screenWidth);
    setAttributes(document.querySelector('html > frameset > frameset'), [
      ['cols', `${width},*`],
      ['rows', '']
    ]);
  }

  const setCartWidth = (screenWidth) => {
    const frame = document.querySelector('html > frameset > #framesetGlobal > frameset > frameset');
    const width = getSidebarWidth(screenWidth, frame.clientWidth);
    setAttributes(frame, [
      ['cols', `*,${width}`],
      ['rows', '']
    ]);
  }

  const handleScreenResize = (event) => {
    setMenuWidth(event.target.innerWidth);
    setCartWidth(event.target.innerWidth);
  }

  const init = () => {    
    // Main document
    loadCssfile(document, 'reset.css');
    loadCssfile(document, 'index.css');
    setMenuWidth(window.innerWidth);
    setAttributes(document.querySelector('html > frameset'), [
      ['cols', ''],
      ['rows', '34,*']
    ]);

    // Sitemap
    const sitemapFrame = document.querySelector('frame[name="linea"]');
    loadCssfile(sitemapFrame, 'reset.css');
    loadCssfile(sitemapFrame, 'sitemap.css');
  
    // Sidebar
    const sidebarFrame = document.querySelector('frame[name="toc"]');
    loadCssfile(sidebarFrame, 'reset.css');
    loadCssfile(sidebarFrame, 'sidebar.css');
  
    const sidebarContent = sidebarFrame?.contentDocument;
    if (sidebarContent) {
      // Top Search
      const topSearchFrame = sidebarContent.querySelector('frame[name="topbusc"]');
      loadCssfile(topSearchFrame, 'reset.css');
      loadCssfile(topSearchFrame, 'topSearch.css');
      setAttributes(sidebarContent.querySelector('html > frameset'), [
        ['cols', ''],
        ['rows', '176,*']
      ]);

      // Menu
      const menuFrame = sidebarContent.querySelector('frame[name="menu"]');
      loadCssfile(menuFrame, 'reset.css');
      loadCssfile(menuFrame, 'menu.css');
    }

    // Main menu
    const mainMenuFrame = document.querySelector('frame[name="topFrame"]');
    loadCssfile(mainMenuFrame, 'reset.css');
    loadCssfile(mainMenuFrame, 'mainMenu.css');
    setAttributes(document.querySelector('html > frameset > #framesetGlobal > frameset'), [
      ['cols', ''],
      ['rows', '34,*']
    ]);

    // Cart
    const cartFrame = document.querySelector('frame[name="rightFrame"]');
    loadCssfile(cartFrame, 'reset.css');
    loadCssfile(cartFrame, 'cart.css');
    setCartWidth(window.innerWidth);

    // Delivery Address
    const addressFrame = document.querySelector('html > frameset > #framesetGlobal > frameset > frameset > frameset > frame[name="pedidoFrame"]')
    loadCssfile(addressFrame, 'reset.css');
    loadCssfile(addressFrame, 'address.css');

    // Content

    // Siempre Precios Bajos
    setAttributes(document.querySelector('html > frameset > #framesetGlobal > frameset > frameset > frameset'), [
      ['cols', ''],
      ['rows', '34,*']
    ])

    window.addEventListener('resize', handleScreenResize);
  }

  setTimeout(init, 1000);
})()
