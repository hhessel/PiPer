import { getResource } from './../common.js'

export const domain = 'netflix';

export const resource = {
  buttonClassName: 'touchable PlayerControls--control-element nfp-button-control default-control-button',
  buttonHoverStyle: /** CSS */ (`transform: scale(1.2);`),
  buttonInsertBefore: function(/** Element */ parent) {
    return parent.lastChild;
  },
  buttonParent: function() {
    // return document.querySelector('[data-uia="controls-standard"]'); 
    return document.querySelector('div[style="align-items: normal; justify-content: normal;"] > [style="align-items: normal; justify-content: flex-end;"]'); 
  },
  buttonScale: 1.5,
  buttonStyle: /** CSS */ (`min-width: 2.3em`),
  captionElement: function() {
    const e = getResource().videoElement();
    return e && e.parentElement.querySelector('.player-timedtext-text-container');
  },
  videoElement: function() {
    return document.querySelector('video[tabindex="-1"]');
  },
};