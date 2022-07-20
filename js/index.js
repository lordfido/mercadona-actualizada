function CssUtils() {
  this.loadFile = (element, cssFileName) => {
    if (element && cssFileName) {
      const link = document.createElement('link');
      link.href = chrome.runtime.getURL(`/css/${cssFileName}`);
      link.rel = 'stylesheet';
      link.type = 'text/css';

      const doc = element.contentDocument;
      const appendElement = element.head
        ?? element.body
        ?? doc.head
        ?? doc.body;
  
      if (!!appendElement?.append) {
        appendElement.append(link);
      }
    }
  };
}
const cssUtils = new CssUtils();

function Utils() {
  this.getSidebarWidth = (screenWidth, frameWidth) => {
    const maxSidebarWidth = 320;
    const minDesiredContentWidth = 480;
    const minDesiredTotalWidth = (maxSidebarWidth * 2) + minDesiredContentWidth;

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
  };

  this.setAttributes = (element, attributes) => {
    if (element && attributes?.length) {
      attributes.forEach(([attr, value]) => {
        element.attributes[attr] = value;
        if (element[attr] !== undefined) {
          element[attr] = value;
        }
      });
    }
  };
};
const utils = new Utils();

function FrameUtils() {
  const frames = [
    {
      name: 'root',
      selector: 'document',
    },
    {
      name: 'sitemap',
      selector: 'frame[name="linea"]',
    },
    {
      name: 'sitemapWrapper',
      selector: 'html > frameset',
    },
    {
      name: 'sidebar',
      selector: 'frame[name="toc"]',
    },
    {
      name: 'topSearch',
      selector: 'frame[name="topbusc"]',
      parent: 'sidebar'
    },
    {
      name: 'topSearchWrapper',
      selector: 'html > frameset',
      parent: 'sidebar'
    },
    {
      name: 'menu',
      selector: 'frame[name="menu"]',
      parent: 'sidebar'
    },
    {
      name: 'menuWrapper',
      selector: 'html > frameset > frameset',
    },
    {
      name: 'mainMenu',
      selector: 'frame[name="topFrame"]',
    },
    {
      name: 'mainMenuWrapper',
      selector: 'html > frameset > #framesetGlobal > frameset',
    },
    {
      name: 'cart',
      selector: 'frame[name="rightFrame"]',
    },
    {
      name: 'cartWrapper',
      selector: 'html > frameset > #framesetGlobal > frameset > frameset',
    },
    {
      name: 'address',
      selector: 'frame[name="pedidoFrame"]',
    },
    {
      name: 'content',
      selector: 'frame[name="mainFrame"]',
    },
    {
      name: 'siemprePreciosBajos',
      selector: 'html > frameset > #framesetGlobal > frameset > frameset > frameset',
    },
  ];

  this.getFrameElements = () => frames.reduce((aggr, curr) => {
    if (!aggr[curr.name]) {
      if (curr.selector === 'document') {
        aggr[curr.name] = document;
        return aggr;
      }
        
      const parent = curr.parent ? this.getFrameContent(curr.parent) : document;
      aggr[curr.name] = (parent ?? document).querySelector(curr.selector);
      return aggr;
    }

    return aggr;
  }, {});

  this.getFramesContent = () => frames.reduce((aggr, curr) => {
    if (!aggr[curr.name]) {
      const parent = curr.parent ? this.getFrameContent(curr.parent) : document;
      aggr[curr.name] = parent.querySelector(curr.selector)?.contentDocument;
    }

    return aggr;
  }, {});

  this.getFrameElement = (name) => {
    const frameConfig = frames.find(f => f.name === name);
    const parent = frameConfig.parent ? this.getFrameContent(frameConfig.parent) : document;
    return parent.querySelector(frameConfig.selector);
  };

  this.getFrameContent = (name) => this.getFrameElement(name)?.contentDocument;

  this.setMenuWidth = (screenWidth) => {
    const frame = this.getFrameElement('menuWrapper');
    if (frame) {
      const width = utils.getSidebarWidth(screenWidth);

      utils.setAttributes(frame, [
        ['cols', `${width},*`],
        ['rows', '']
      ]);
    }
  };

  this.setCartWidth = (screenWidth) => {
    const frame = this.getFrameElement('cartWrapper');
    if (frame) {
      const width = utils.getSidebarWidth(screenWidth, frame.clientWidth);

      utils.setAttributes(frame, [
        ['cols', `*,${width}`],
        ['rows', '']
      ]);
    }
  };
}
const frameUtils = new FrameUtils();

const init = () => {
  window.addEventListener('resize', (event) => {
    frameUtils.setMenuWidth(event.target.innerWidth);
    frameUtils.setCartWidth(event.target.innerWidth);
  });
  
  if (/principal.php/.test(location.href)) {
    const {
      root,
      sitemap,
      sitemapWrapper,
      sidebar,
      topSearch,
      topSearchWrapper,
      menu,
      mainMenu,
      mainMenuWrapper,
      cart,
      address,
      content,
      siemprePreciosBajos
    } = frameUtils.getFrameElements();

    // Main document
    cssUtils.loadFile(root, 'reset.css');
    cssUtils.loadFile(root, 'index.css');
    frameUtils.setMenuWidth(window.innerWidth);
    utils.setAttributes(sitemapWrapper, [
      ['cols', ''],
      ['rows', '34,*']
    ]);

    // Sitemap
    cssUtils.loadFile(sitemap, 'reset.css');
    cssUtils.loadFile(sitemap, 'sitemap.css');
  
    // Sidebar
    cssUtils.loadFile(sidebar, 'reset.css');
    cssUtils.loadFile(sidebar, 'sidebar.css');
  
    // Top Search
    cssUtils.loadFile(topSearch, 'reset.css');
    cssUtils.loadFile(topSearch, 'topSearch.css');
    utils.setAttributes(topSearchWrapper, [
      ['cols', ''],
      ['rows', '204,*']
    ]);

    // Menu
    cssUtils.loadFile(menu, 'reset.css');
    cssUtils.loadFile(menu, 'menu.css');

    // Main menu
    cssUtils.loadFile(mainMenu, 'reset.css');
    cssUtils.loadFile(mainMenu, 'mainMenu.css');
    utils.setAttributes(mainMenuWrapper, [
      ['cols', ''],
      ['rows', '34,*']
    ]);

    // Cart
    cssUtils.loadFile(cart, 'reset.css');
    cssUtils.loadFile(cart, 'cart.css');
    frameUtils.setCartWidth(window.innerWidth);

    // Delivery Address
    cssUtils.loadFile(address, 'reset.css');
    cssUtils.loadFile(address, 'address.css');

    // Content
    const loadMainContentCss = () => {
      cssUtils.loadFile(content, 'reset.css');
      cssUtils.loadFile(content, 'mainContent.css');
    }
    content.onload = () => {
      loadMainContentCss();
    }
    loadMainContentCss();

    // Siempre Precios Bajos
    utils.setAttributes(siemprePreciosBajos, [
      ['cols', ''],
      ['rows', '34,*']
    ]);
  }

  // modcliente.php

  // formalizar.php
}

setTimeout(init, 1000);
