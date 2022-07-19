(function() {
  const setAttributes = (element, attributes) => {
    if (element && attributes?.length) {
      attributes.forEach(([attr, value]) => {
        console.log(`[MA] Estableciendo <${attr} = ${value}> en <${element.name}>`, !element.name && element);
        
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
      console.log(`[MA] Cargando <${css}> en <${frameElement.name}>`);
      
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
      } else {
        console.log(`[MA] No se pudo cargar <${css}> en <${frameElement.name}>`);
      }
    }
  };

  const init = () => {
    console.log('[MA] Iniciada');
    
    // Main document
    loadCssfile(document, 'reset.css');
    loadCssfile(document, 'index.css');

    setAttributes(document.querySelector('html > frameset'), [
      ['cols', ''],
      ['rows', '34,*']
    ]);
    setAttributes(document.querySelector('html > frameset > frameset'), [
      ['cols', '320,*'],
      ['rows', '']
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

    const mainMenuFrame = document.querySelector('frame[name="topFrame"]');
    loadCssfile(mainMenuFrame, 'reset.css');
    loadCssfile(mainMenuFrame, 'mainMenu.css');

    setAttributes(document.querySelector('html > frameset > #framesetGlobal > frameset'), [
      ['cols', ''],
      ['rows', '34,*']
    ]);
  }

  setTimeout(init, 1000);
})()
