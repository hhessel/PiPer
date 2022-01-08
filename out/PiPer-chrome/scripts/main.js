var a;a||(a=!0,(()=>{// Input 0
const LOGGING_LEVEL$$module$defines = 0;
const BROWSER$$module$defines = 0;
var module$defines = {};
module$defines.BROWSER = BROWSER$$module$defines;
module$defines.LOGGING_LEVEL = LOGGING_LEVEL$$module$defines;
// Input 1
const loggingPrefix$$module$logger = "[PiPer] ";
const LoggingLevel$$module$logger = {ALL:0, TRACE:10, INFO:20, WARNING:30, ERROR:40,};
const trace$$module$logger = LoggingLevel$$module$logger.TRACE >= LOGGING_LEVEL$$module$defines ? console.trace.bind(console) : function() {
};
const info$$module$logger = LoggingLevel$$module$logger.INFO >= LOGGING_LEVEL$$module$defines ? console.info.bind(console, loggingPrefix$$module$logger) : function() {
};
const warn$$module$logger = LoggingLevel$$module$logger.WARNING >= LOGGING_LEVEL$$module$defines ? console.warn.bind(console, loggingPrefix$$module$logger) : function() {
};
const error$$module$logger = LoggingLevel$$module$logger.ERROR >= LOGGING_LEVEL$$module$defines ? console.error.bind(console, loggingPrefix$$module$logger) : function() {
};
var module$logger = {};
module$logger.LoggingLevel = LoggingLevel$$module$logger;
module$logger.error = error$$module$logger;
module$logger.info = info$$module$logger;
module$logger.trace = trace$$module$logger;
module$logger.warn = warn$$module$logger;
// Input 2
const Browser$$module$common = {UNKNOWN:0, SAFARI:1, CHROME:2,};
const getBrowser$$module$common = function() {
  if (BROWSER$$module$defines != Browser$$module$common.UNKNOWN) {
    return BROWSER$$module$defines;
  }
  if (/Safari/.test(navigator.userAgent) && /Apple/.test(navigator.vendor)) {
    return Browser$$module$common.SAFARI;
  }
  if (/Chrome/.test(navigator.userAgent) && /Google/.test(navigator.vendor)) {
    return Browser$$module$common.CHROME;
  }
  return Browser$$module$common.UNKNOWN;
};
let PiperResource$$module$common;
let currentResource$$module$common = null;
const getResource$$module$common = function() {
  return currentResource$$module$common;
};
const setResource$$module$common = function(resource) {
  currentResource$$module$common = resource;
};
const getExtensionURL$$module$common = function(path) {
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      return safari.extension.baseURI + path;
    case Browser$$module$common.CHROME:
      return chrome.runtime.getURL(path);
    case Browser$$module$common.UNKNOWN:
    default:
      return path;
  }
};
const bypassBackgroundTimerThrottling$$module$common = function() {
  if (!currentResource$$module$common.captionElement) {
    warn$$module$logger("Unnecessary bypassing of background timer throttling on page without caption support");
  }
  const request = new XMLHttpRequest();
  request.open("GET", getExtensionURL$$module$common("scripts/fix.js"));
  request.onload = function() {
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.appendChild(document.createTextNode(request.responseText));
    document.head.appendChild(script);
  };
  request.send();
};
var module$common = {};
module$common.Browser = Browser$$module$common;
module$common.bypassBackgroundTimerThrottling = bypassBackgroundTimerThrottling$$module$common;
module$common.getBrowser = getBrowser$$module$common;
module$common.getExtensionURL = getExtensionURL$$module$common;
module$common.getResource = getResource$$module$common;
module$common.setResource = setResource$$module$common;
// Input 3
const CHROME_PLAYING_PIP_ATTRIBUTE$$module$video = "data-playing-picture-in-picture";
const eventListeners$$module$video = [];
const togglePictureInPicture$$module$video = function(video) {
  const playingPictureInPicture = videoPlayingPictureInPicture$$module$video(video);
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      if (playingPictureInPicture) {
        video.webkitSetPresentationMode("inline");
      } else {
        video.webkitSetPresentationMode("picture-in-picture");
      }
      break;
    case Browser$$module$common.CHROME:
      if (playingPictureInPicture) {
        const script = document.createElement("script");
        script.textContent = "document.exitPictureInPicture()";
        document.head.appendChild(script);
        script.remove();
      } else {
        video.removeAttribute("disablepictureinpicture");
        video.requestPictureInPicture();
      }
      break;
    case Browser$$module$common.UNKNOWN:
    default:
      break;
  }
};
const addPictureInPictureEventListener$$module$video = function(listener) {
  const index = eventListeners$$module$video.indexOf(listener);
  if (index == -1) {
    eventListeners$$module$video.push(listener);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    document.addEventListener("webkitpresentationmodechanged", videoPresentationModeChanged$$module$video, {capture:true,});
  }
};
const removePictureInPictureEventListener$$module$video = function(listener) {
  const index = eventListeners$$module$video.indexOf(listener);
  if (index > -1) {
    eventListeners$$module$video.splice(index, 1);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI && eventListeners$$module$video.length == 0) {
    document.removeEventListener("webkitpresentationmodechanged", videoPresentationModeChanged$$module$video);
  }
};
const dispatchPictureInPictureEvent$$module$video = function(video) {
  const expectedVideo = getResource$$module$common().videoElement(true);
  if (video != expectedVideo) {
    return;
  }
  const isPlayingPictureInPicture = videoPlayingPictureInPicture$$module$video(video);
  if (isPlayingPictureInPicture) {
    info$$module$logger("Video entering Picture in Picture mode");
  } else {
    info$$module$logger("Video leaving Picture in Picture mode");
  }
  const eventListenersCopy = eventListeners$$module$video.slice();
  for (let listener; listener = eventListenersCopy.pop();) {
    listener(video, isPlayingPictureInPicture);
  }
};
const videoPresentationModeChanged$$module$video = function(event) {
  const video = event.target;
  dispatchPictureInPictureEvent$$module$video(video);
};
const videoPlayingPictureInPicture$$module$video = function(video) {
  switch(getBrowser$$module$common()) {
    case Browser$$module$common.SAFARI:
      return video.webkitPresentationMode == "picture-in-picture";
    case Browser$$module$common.CHROME:
      return video.hasAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video);
    case Browser$$module$common.UNKNOWN:
    default:
      return false;
  }
};
const videoDidEnterPictureInPicture$$module$video = function(event) {
  const video = event.target;
  video.setAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video, true);
  dispatchPictureInPictureEvent$$module$video(video);
  video.addEventListener("leavepictureinpicture", function(event) {
    video.removeAttribute(CHROME_PLAYING_PIP_ATTRIBUTE$$module$video);
    dispatchPictureInPictureEvent$$module$video(video);
  }, {once:true});
};
const addVideoElementListeners$$module$video = function() {
  const elements = document.getElementsByTagName("video");
  for (let index = 0, element; element = elements[index]; index++) {
    element.addEventListener("enterpictureinpicture", videoDidEnterPictureInPicture$$module$video);
  }
};
var module$video = {};
module$video.addPictureInPictureEventListener = addPictureInPictureEventListener$$module$video;
module$video.addVideoElementListeners = addVideoElementListeners$$module$video;
module$video.removePictureInPictureEventListener = removePictureInPictureEventListener$$module$video;
module$video.togglePictureInPicture = togglePictureInPicture$$module$video;
module$video.videoPlayingPictureInPicture = videoPlayingPictureInPicture$$module$video;
// Input 4
const localizations$$module$localization = {};
localizations$$module$localization["button-title"] = {"en":"Open Picture in Picture mode", "de":"Bild-in-Bild starten", "nl":"Beeld in beeld starten", "fr":"D\u00e9marrer Image dans l\u2019image",};
localizations$$module$localization["donate"] = {"en":"Donate", "de":"Spenden",};
localizations$$module$localization["donate-small"] = {"en":"Small donation",};
localizations$$module$localization["donate-medium"] = {"en":"Medium donation",};
localizations$$module$localization["donate-large"] = {"en":"Grand donation",};
localizations$$module$localization["total-donations"] = {"en":"Total donations:",};
localizations$$module$localization["donate-error"] = {"en":"In-app purchase unavailable",};
localizations$$module$localization["report-bug"] = {"en":"Report a bug", "de":"Einen Fehler melden",};
localizations$$module$localization["options"] = {"en":"Options",};
localizations$$module$localization["install-thanks"] = {"en":"Thanks for adding PiPer!",};
localizations$$module$localization["enable"] = {"en":"Enable",};
localizations$$module$localization["safari-disabled-warning"] = {"en":"Extension is currently disabled, enable in Safari preferences",};
localizations$$module$localization["chrome-flags-open"] = {"en":"Open Chrome Flags",};
localizations$$module$localization["chrome-flags-warning"] = {"en":'Before you get started you need to enable the chrome flag [emphasis]"SurfaceLayer objects for videos"[/emphasis]',};
const defaultLanguage$$module$localization = "en";
const localizedString$$module$localization = function(key, language = navigator.language.substring(0, 2)) {
  const localizationsForKey = localizations$$module$localization[key];
  if (localizationsForKey) {
    let string = localizationsForKey[language] || localizationsForKey[defaultLanguage$$module$localization];
    if (string) {
      return string;
    }
  }
  error$$module$logger(`No localized string found for key '${key}'`);
  return "";
};
const localizedStringWithReplacements$$module$localization = function(key, replacements, language) {
  let string = localizedString$$module$localization(key, language);
  for (let index = replacements.length; index--;) {
    let replacement = replacements[index];
    if (/[^-_0-9a-zA-Z\/]/.test(replacement[0])) {
      error$$module$logger(`Invalid characters used in localized string tag '${replacement[0]}'`);
    }
    const regex = new RegExp(`\\\[${replacement[0]}\\\]`, "g");
    string = string.replace(regex, replacement[1]);
  }
  return string;
};
var module$localization = {};
module$localization.localizedString = localizedString$$module$localization;
module$localization.localizedStringWithReplacements = localizedStringWithReplacements$$module$localization;
// Input 5
const TRACK_ID$$module$captions = "PiPer_track";
let track$$module$captions = null;
let captionsEnabled$$module$captions = false;
let showingCaptions$$module$captions = false;
let showingEmptyCaption$$module$captions = false;
let lastUnprocessedCaption$$module$captions = "";
const disableCaptions$$module$captions = function() {
  captionsEnabled$$module$captions = false;
  showingCaptions$$module$captions = false;
  processCaptions$$module$captions();
  removePictureInPictureEventListener$$module$video(pictureInPictureEventListener$$module$captions);
  info$$module$logger("Closed caption support disabled");
};
const enableCaptions$$module$captions = function(ignoreNowPlayingCheck) {
  if (!getResource$$module$common().captionElement) {
    return;
  }
  captionsEnabled$$module$captions = true;
  addPictureInPictureEventListener$$module$video(pictureInPictureEventListener$$module$captions);
  info$$module$logger("Closed caption support enabled");
  if (ignoreNowPlayingCheck) {
    return;
  }
  const video = getResource$$module$common().videoElement(true);
  if (!video) {
    return;
  }
  showingCaptions$$module$captions = videoPlayingPictureInPicture$$module$video(video);
  track$$module$captions = getCaptionTrack$$module$captions(video);
  processCaptions$$module$captions();
};
const shouldProcessCaptions$$module$captions = function() {
  return captionsEnabled$$module$captions && showingCaptions$$module$captions;
};
const getCaptionTrack$$module$captions = function(video) {
  const allTracks = video.textTracks;
  for (let trackId = allTracks.length; trackId--;) {
    if (allTracks[trackId].label === TRACK_ID$$module$captions) {
      info$$module$logger("Existing caption track found");
      return allTracks[trackId];
    }
  }
  info$$module$logger("Caption track created");
  return video.addTextTrack("captions", TRACK_ID$$module$captions, "en");
};
const addVideoCaptionTracks$$module$captions = function() {
  const elements = document.getElementsByTagName("video");
  for (let index = 0, element; element = elements[index]; index++) {
    getCaptionTrack$$module$captions(element);
  }
};
const pictureInPictureEventListener$$module$captions = function(video, isPlayingPictureInPicture) {
  showingCaptions$$module$captions = isPlayingPictureInPicture;
  if (showingCaptions$$module$captions) {
    track$$module$captions = getCaptionTrack$$module$captions(video);
    track$$module$captions.mode = "showing";
  }
  lastUnprocessedCaption$$module$captions = "";
  processCaptions$$module$captions();
  info$$module$logger(`Video presentation mode changed (showingCaptions: ${showingCaptions$$module$captions})`);
};
const removeCaptions$$module$captions = function(video, workaround = true) {
  while (track$$module$captions.activeCues.length) {
    track$$module$captions.removeCue(track$$module$captions.activeCues[0]);
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI && workaround && video && !showingEmptyCaption$$module$captions) {
    track$$module$captions.addCue(new VTTCue(video.currentTime, video.currentTime + 60, ""));
    showingEmptyCaption$$module$captions = true;
  }
};
const addCaption$$module$captions = function(video, caption) {
  info$$module$logger(`Showing caption '${caption}'`);
  track$$module$captions.mode = "showing";
  track$$module$captions.addCue(new VTTCue(video.currentTime, video.currentTime + 60, caption));
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    showingEmptyCaption$$module$captions = false;
  }
};
const processCaptions$$module$captions = function() {
  const captionElement = getResource$$module$common().captionElement();
  const video = getResource$$module$common().videoElement();
  if (!showingCaptions$$module$captions || !captionElement) {
    removeCaptions$$module$captions(video);
    if (captionElement) {
      captionElement.style.visibility = "";
    }
    return;
  }
  captionElement.style.visibility = "hidden";
  const unprocessedCaption = captionElement.textContent;
  if (unprocessedCaption == lastUnprocessedCaption$$module$captions) {
    return;
  }
  lastUnprocessedCaption$$module$captions = unprocessedCaption;
  removeCaptions$$module$captions(video, !unprocessedCaption);
  if (!unprocessedCaption) {
    return;
  }
  let caption = "";
  const walk = document.createTreeWalker(captionElement, NodeFilter.SHOW_TEXT, null, false);
  while (walk.nextNode()) {
    const segment = walk.currentNode.nodeValue.trim();
    if (segment) {
      const style = window.getComputedStyle(walk.currentNode.parentElement);
      if (style.fontStyle == "italic") {
        caption += `<i>${segment}</i>`;
      } else {
        if (style.textDecoration == "underline") {
          caption += `<u>${segment}</u>`;
        } else {
          caption += segment;
        }
      }
      caption += " ";
    } else {
      if (caption.charAt(caption.length - 1) != "\n") {
        caption += "\n";
      }
    }
  }
  caption = caption.trim();
  addCaption$$module$captions(video, caption);
};
var module$captions = {};
module$captions.addVideoCaptionTracks = addVideoCaptionTracks$$module$captions;
module$captions.disableCaptions = disableCaptions$$module$captions;
module$captions.enableCaptions = enableCaptions$$module$captions;
module$captions.processCaptions = processCaptions$$module$captions;
module$captions.shouldProcessCaptions = shouldProcessCaptions$$module$captions;
// Input 6
const BUTTON_ID$$module$button = "PiPer_button";
let button$$module$button = null;
const addButton$$module$button = function(parent) {
  if (!button$$module$button) {
    const buttonElementType = getResource$$module$common().buttonElementType || "button";
    button$$module$button = document.createElement(buttonElementType);
    button$$module$button.id = BUTTON_ID$$module$button;
    button$$module$button.title = localizedString$$module$localization("button-title");
    const buttonStyle = getResource$$module$common().buttonStyle;
    if (buttonStyle) {
      button$$module$button.style.cssText = buttonStyle;
    }
    const buttonClassName = getResource$$module$common().buttonClassName;
    if (buttonClassName) {
      button$$module$button.className = buttonClassName;
    }
    const image = document.createElement("img");
    image.style.width = image.style.height = "100%";
    const buttonScale = getResource$$module$common().buttonScale;
    if (buttonScale) {
      image.style.transform = `scale(${buttonScale})`;
    }
    button$$module$button.appendChild(image);
    let buttonImage = getResource$$module$common().buttonImage;
    let buttonExitImage = getResource$$module$common().buttonExitImage;
    if (!buttonImage) {
      buttonImage = "default";
      buttonExitImage = "default-exit";
    }
    const buttonImageURL = getExtensionURL$$module$common(`images/${buttonImage}.svg`);
    image.src = buttonImageURL;
    if (buttonExitImage) {
      const buttonExitImageURL = getExtensionURL$$module$common(`images/${buttonExitImage}.svg`);
      addPictureInPictureEventListener$$module$video(function(video, isPlayingPictureInPicture) {
        image.src = isPlayingPictureInPicture ? buttonExitImageURL : buttonImageURL;
      });
    }
    const buttonHoverStyle = getResource$$module$common().buttonHoverStyle;
    if (buttonHoverStyle) {
      const style = document.createElement("style");
      const css = `#${BUTTON_ID$$module$button}:hover{${buttonHoverStyle}}`;
      style.appendChild(document.createTextNode(css));
      button$$module$button.appendChild(style);
    }
    button$$module$button.addEventListener("click", function(event) {
      event.preventDefault();
      const video = getResource$$module$common().videoElement(true);
      if (!video) {
        error$$module$logger("Unable to find video");
        return;
      }
      togglePictureInPicture$$module$video(video);
    });
    info$$module$logger("Picture in Picture button created");
  }
  const referenceNode = getResource$$module$common().buttonInsertBefore ? getResource$$module$common().buttonInsertBefore(parent) : null;
  parent.insertBefore(button$$module$button, referenceNode);
};
const getButton$$module$button = function() {
  return button$$module$button;
};
const checkButton$$module$button = function() {
  return !!document.getElementById(BUTTON_ID$$module$button);
};
var module$button = {};
module$button.addButton = addButton$$module$button;
module$button.checkButton = checkButton$$module$button;
module$button.getButton = getButton$$module$button;
// Input 7
const domain$$module$resources$youtube = ["youtube", "youtu"];
const resource$$module$resources$youtube = {buttonClassName:"ytp-button", buttonDidAppear:function() {
  const button = getButton$$module$button();
  const neighbourButton = button.nextSibling;
  const title = button.title;
  const neighbourTitle = neighbourButton.title;
  button.title = "";
  button.addEventListener("mouseover", function() {
    neighbourButton.title = title;
    neighbourButton.dispatchEvent(new Event("mouseover"));
  });
  button.addEventListener("mouseout", function() {
    neighbourButton.dispatchEvent(new Event("mouseout"));
    neighbourButton.title = neighbourTitle;
  });
  bypassBackgroundTimerThrottling$$module$common();
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    const video = getResource$$module$common().videoElement();
    let captionsVisible = false;
    const navigateStart = function() {
      captionsVisible = shouldProcessCaptions$$module$captions();
      if (captionsVisible) {
        disableCaptions$$module$captions();
      }
    };
    const navigateFinish = function() {
      if (captionsVisible) {
        enableCaptions$$module$captions();
      }
    };
    window.addEventListener("spfrequest", navigateStart);
    window.addEventListener("spfdone", navigateFinish);
    window.addEventListener("yt-navigate-start", navigateStart);
    window.addEventListener("yt-navigate-finish", navigateFinish);
  }
}, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".ytp-right-controls");
}, buttonScale:0.68, captionElement:function() {
  return document.querySelector(".caption-window");
}, videoElement:function() {
  return document.querySelector("video.html5-main-video");
},};
var module$resources$youtube = {};
module$resources$youtube.domain = domain$$module$resources$youtube;
module$resources$youtube.resource = resource$$module$resources$youtube;
// Input 8
const domain$$module$resources$yeloplay = "yeloplay";
const resource$$module$resources$yeloplay = {buttonClassName:"button", buttonDidAppear:function() {
  const parent = getResource$$module$common().buttonParent();
  parent.style.width = "210px";
}, buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return document.getElementsByTagName("player-fullscreen-button")[0];
}, buttonParent:function() {
  return document.getElementsByClassName("buttons")[0];
}, buttonScale:0.8, buttonStyle:`
    margin-bottom: -10px;
    margin-left: 10px;
    width: 50px;
    cursor: pointer;
    opacity: 0.8;
    height: 40px !important;
    margin-bottom: 0px !important;
  `, videoElement:function() {
  return document.querySelector("video[src]");
},};
var module$resources$yeloplay = {};
module$resources$yeloplay.domain = domain$$module$resources$yeloplay;
module$resources$yeloplay.resource = resource$$module$resources$yeloplay;
// Input 9
const domain$$module$resources$vrv = "vrv";
const resource$$module$resources$vrv = {buttonClassName:"vjs-control vjs-button", buttonDidAppear:function() {
  const neighbourButton = getButton$$module$button().nextSibling;
  neighbourButton.addEventListener("click", function() {
    const video = getResource$$module$common().videoElement();
    if (videoPlayingPictureInPicture$$module$video(video)) {
      togglePictureInPicture$$module$video(video);
    }
  });
  bypassBackgroundTimerThrottling$$module$common();
}, buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, buttonScale:0.6, buttonStyle:`
    position: absolute;
    right: 114px;
    width: 50px;
    cursor: pointer;
    opacity: 0.6;
  `, captionElement:function() {
  return document.querySelector(".libjass-subs");
}, videoElement:function() {
  return document.getElementById("player_html5_api");
},};
var module$resources$vrv = {};
module$resources$vrv.domain = domain$$module$resources$vrv;
module$resources$vrv.resource = resource$$module$resources$vrv;
// Input 10
const domain$$module$resources$vrt = "vrt";
const resource$$module$resources$vrt = {buttonClassName:"vuplay-control", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.getElementsByClassName("vuplay-control-right")[0];
}, captionElement:function() {
  return document.querySelector(".theoplayer-texttracks");
}, buttonStyle:`
    width: 30px;
    height: 47px;
    padding: 0;
    position: relative;
    top: -9px;
    right: 8px;
  `, videoElement:function() {
  return document.querySelector('video[preload="metadata"]');
},};
var module$resources$vrt = {};
module$resources$vrt.domain = domain$$module$resources$vrt;
module$resources$vrt.resource = resource$$module$resources$vrt;
// Input 11
const domain$$module$resources$vk = "vk";
const resource$$module$resources$vk = {buttonClassName:"videoplayer_btn", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return document.querySelector("div.videoplayer_btn_fullscreen");
}, buttonStyle:`
    width: 24px;
    height: 45px;
    padding: 0 8px;
  `, buttonParent:function() {
  return document.querySelector("div.videoplayer_controls");
}, videoElement:function() {
  return document.querySelector("video.videoplayer_media_provider");
},};
var module$resources$vk = {};
module$resources$vk.domain = domain$$module$resources$vk;
module$resources$vk.resource = resource$$module$resources$vk;
// Input 12
const domain$$module$resources$viervijfzes = ["vijf", "vier", "zes"];
const resource$$module$resources$viervijfzes = {buttonClassName:"vjs-control vjs-button", buttonDidAppear:function() {
  const fullScreenButton = document.getElementsByClassName("vjs-fullscreen-control")[0];
  fullScreenButton.style.order = 10;
}, buttonParent:function() {
  return document.getElementsByClassName("vjs-control-bar")[0];
}, buttonStyle:`
    text-indent: 0! important;
    margin-left: 10px;
    order: 9;
  `, videoElement:function() {
  return document.querySelector('video[preload="metadata"]');
},};
var module$resources$viervijfzes = {};
module$resources$viervijfzes.domain = domain$$module$resources$viervijfzes;
module$resources$viervijfzes.resource = resource$$module$resources$viervijfzes;
// Input 13
const domain$$module$resources$vid = "vid";
const resource$$module$resources$vid = {buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, buttonScale:0.7, buttonStyle:`
    position: relative;
    top: -2px;
    left: 9px;
    padding: 0px;
    margin: 0px;
  `, videoElement:function() {
  return document.getElementById("video_player_html5_api");
},};
var module$resources$vid = {};
module$resources$vid.domain = domain$$module$resources$vid;
module$resources$vid.resource = resource$$module$resources$vid;
// Input 14
const domain$$module$resources$vice = "vice";
const resource$$module$resources$vice = {buttonClassName:"vp__controls__icon__popup__container", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vp__controls__icons");
}, buttonScale:0.6, buttonStyle:`top: -11px`, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$vice = {};
module$resources$vice.domain = domain$$module$resources$vice;
module$resources$vice.resource = resource$$module$resources$vice;
// Input 15
const domain$$module$resources$vevo = "vevo";
const resource$$module$resources$vevo = {buttonClassName:"player-control", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector("#control-bar .right-controls");
}, buttonScale:0.7, buttonStyle:`
    border: 0px;
    background: transparent;
  `, videoElement:function() {
  return document.getElementById("html5-player");
},};
var module$resources$vevo = {};
module$resources$vevo.domain = domain$$module$resources$vevo;
module$resources$vevo.resource = resource$$module$resources$vevo;
// Input 16
const domain$$module$resources$ustream = "ustream";
const resource$$module$resources$ustream = {buttonClassName:"component shown", buttonElementType:"div", buttonHoverStyle:`
    opacity: 1 !important;
    filter: drop-shadow(0px 0px 5px rgba(255, 255, 255, 0.5));
  `, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonScale:0.8, buttonStyle:`
    opacity: 0.7;
  `, buttonParent:function() {
  return document.getElementById("controlPanelRight");
}, videoElement:function() {
  return document.querySelector("#ViewerContainer video");
},};
var module$resources$ustream = {};
module$resources$ustream.domain = domain$$module$resources$ustream;
module$resources$ustream.resource = resource$$module$resources$ustream;
// Input 17
const domain$$module$resources$udemy = "udemy";
const resource$$module$resources$udemy = {buttonClassName:"btn", buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return document.querySelector('button[aria-label="Fullscreen"]');
}, buttonParent:function() {
  return document.querySelector('div[class^="control-bar--control-bar--"]');
}, buttonScale:0.8, buttonStyle:`
    width: 3em;
    height: 3em;
    padding: 0;
    opacity: 0.8;
  `, captionElement:function() {
  return document.querySelector('div[class^="captions-display--captions-container"]');
}, videoElement:function() {
  return document.querySelector("video.vjs-tech");
},};
var module$resources$udemy = {};
module$resources$udemy.domain = domain$$module$resources$udemy;
module$resources$udemy.resource = resource$$module$resources$udemy;
// Input 18
const domain$$module$resources$twitch = "twitch";
const resource$$module$resources$twitch = {buttonClassName:"tw-border-bottom-left-radius-medium tw-border-bottom-right-radius-medium tw-border-top-left-radius-medium tw-border-top-right-radius-medium tw-button-icon tw-button-icon--overlay tw-core-button tw-core-button--overlay tw-inline-flex tw-relative tw-tooltip-wrapper", buttonDidAppear:function() {
  const button = getButton$$module$button();
  const title = button.title;
  button.title = "";
  const tooltip = document.createElement("div");
  tooltip.className = "tw-tooltip tw-tooltip--align-right tw-tooltip--up";
  tooltip.appendChild(document.createTextNode(title));
  button.appendChild(tooltip);
  const fullscreenButton = document.querySelector("[data-a-target='player-fullscreen-button']");
  if (!fullscreenButton) {
    return;
  }
  fullscreenButton.addEventListener("click", function() {
    const video = getResource$$module$common().videoElement();
    if (videoPlayingPictureInPicture$$module$video(video)) {
      togglePictureInPicture$$module$video(video);
    }
  });
}, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".player-controls__right-control-group,.player-buttons-right");
}, buttonScale:0.8, captionElement:function() {
  return document.querySelector(".player-captions-container");
}, videoElement:function() {
  return document.querySelector("video[src]");
},};
var module$resources$twitch = {};
module$resources$twitch.domain = domain$$module$resources$twitch;
module$resources$twitch.resource = resource$$module$resources$twitch;
// Input 19
const domain$$module$resources$theonion = "theonion";
const resource$$module$resources$theonion = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-controlbar-right-group");
}, buttonStyle:`
    top: -2px;
    left: 10px;
    width: 38px;
  `, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$theonion = {};
module$resources$theonion.domain = domain$$module$resources$theonion;
module$resources$theonion.resource = resource$$module$resources$theonion;
// Input 20
const domain$$module$resources$ted = "ted";
const resource$$module$resources$ted = {buttonClassName:"z-i:0 pos:r bottom:0 hover/bg:white.7 b-r:.1 p:1 cur:p", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  const playButton = document.querySelector('[aria-controls="video1"]');
  return playButton.parentElement.parentElement;
}, buttonDidAppear:function() {
  const img = getButton$$module$button().querySelector("img");
  img.classList.add("w:2");
  img.classList.add("h:2");
}, videoElement:function() {
  return document.querySelector('video[id^="ted-player-"]');
}};
var module$resources$ted = {};
module$resources$ted.domain = domain$$module$resources$ted;
module$resources$ted.resource = resource$$module$resources$ted;
// Input 21
const domain$$module$resources$streamable = "streamable";
const resource$$module$resources$streamable = {buttonDidAppear:function() {
  const progressBar = document.getElementById("player-progress");
  const progressBarStyle = window.getComputedStyle(progressBar);
  getButton$$module$button().style.right = progressBarStyle.right;
  progressBar.style.right = parseInt(progressBarStyle.right, 10) + 40 + "px";
}, buttonElementType:"div", buttonHoverStyle:`opacity: 1 !important`, buttonParent:function() {
  return document.querySelector(".player-controls-right");
}, buttonStyle:`
    position: absolute;
    bottom: 10px;
    height: 26px;
    width: 26px;
    cursor: pointer;
    opacity: 0.9;
    filter: drop-shadow(rgba(0, 0, 0, 0.5) 0px 0px 2px);
  `, videoElement:function() {
  return document.getElementById("video-player-tag");
},};
var module$resources$streamable = {};
module$resources$streamable.domain = domain$$module$resources$streamable;
module$resources$streamable.resource = resource$$module$resources$streamable;
// Input 22
const domain$$module$resources$seznam = ["seznam", "stream"];
const resource$$module$resources$seznam = {buttonClassName:"sznp-ui-widget-box", buttonElementType:"div", buttonHoverStyle:`transform: scale(1.05)`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".sznp-ui-ctrl-panel-layout-wrapper");
}, buttonScale:0.75, buttonStyle:`cursor: pointer`, videoElement:function() {
  return document.querySelector(".sznp-ui-tech-video-wrapper video");
},};
var module$resources$seznam = {};
module$resources$seznam.domain = domain$$module$resources$seznam;
module$resources$seznam.resource = resource$$module$resources$seznam;
// Input 23
const domain$$module$resources$plex = "plex";
const resource$$module$resources$plex = {buttonDidAppear:function() {
  bypassBackgroundTimerThrottling$$module$common();
}, buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  const e = document.querySelector('div[class^="FullPlayerTopControls-topControls"]');
  return e && e.lastChild;
}, buttonScale:2, buttonStyle:`
    position: relative;
    top: -3px;
    width: 30px;
    padding: 10px;
    border: 0px;
    background: transparent;
    opacity: 0.7;
    outline: 0;
    text-shadow: 0px 0px 4px rgba(0, 0, 0, 0.45);
  `, captionElement:function() {
  return document.querySelector(".libjass-subs");
}, videoElement:function() {
  return document.querySelector('video[class^="HTMLMedia-mediaElement"]');
},};
var module$resources$plex = {};
module$resources$plex.domain = domain$$module$resources$plex;
module$resources$plex.resource = resource$$module$resources$plex;
// Input 24
const domain$$module$resources$periscope = ["periscope", "pscp"];
const resource$$module$resources$periscope = {buttonClassName:"Pill Pill--withIcon", buttonElementType:"span", buttonHoverStyle:`
    opacity: 0.8 !important;
    filter: brightness(125%) !important;
  `, buttonInsertBefore:function(parent) {
  return parent.querySelector(".ShareBroadcast").nextSibling;
}, buttonParent:function() {
  return document.querySelector(".VideoOverlayRedesign-BottomBar-Right");
}, buttonScale:0.6, buttonStyle:`
    opacity: 0.5;
    filter: brightness(200%);
  `, videoElement:function() {
  return document.querySelector(".Video video");
},};
var module$resources$periscope = {};
module$resources$periscope.domain = domain$$module$resources$periscope;
module$resources$periscope.resource = resource$$module$resources$periscope;
// Input 25
const domain$$module$resources$pbs = "pbs";
const resource$$module$resources$pbs = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset", buttonDidAppear:function() {
  const fullscreenButton = document.querySelector(".jw-icon-fullscreen");
  fullscreenButton.addEventListener("click", function() {
    const video = getResource$$module$common().videoElement();
    if (videoPlayingPictureInPicture$$module$video(video)) {
      togglePictureInPicture$$module$video(video);
    }
  });
}, buttonElementType:"div", buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-button-container");
}, buttonScale:0.6, buttonStyle:`opacity: 0.8`, videoElement:function() {
  return document.querySelector(".jw-video");
},};
var module$resources$pbs = {};
module$resources$pbs.domain = domain$$module$resources$pbs;
module$resources$pbs.resource = resource$$module$resources$pbs;
// Input 26
const domain$$module$resources$openload = ["openload", "oload"];
const resource$$module$resources$openload = {buttonClassName:"vjs-control vjs-button", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, buttonScale:0.6, buttonStyle:`
    left: 5px;
    cursor: pointer;
  `, videoElement:function() {
  return document.getElementById("olvideo_html5_api");
},};
var module$resources$openload = {};
module$resources$openload.domain = domain$$module$resources$openload;
module$resources$openload.resource = resource$$module$resources$openload;
// Input 27
const domain$$module$resources$ocs = "ocs";
const resource$$module$resources$ocs = {buttonClassName:"footer-elt fltr", buttonInsertBefore:function(parent) {
  return parent.querySelector("#togglePlay");
}, buttonParent:function() {
  return document.querySelector(".footer-block:last-child");
}, buttonScale:1.2, buttonStyle:`
    display: block;
    width: 25px;
    height: 18px;
    margin-right: 10px;
    margin-bottom: -10px;
    padding: 0px;
    border: 0px;
    background-color: transparent;
  `, videoElement:function() {
  return document.getElementById("LgyVideoPlayer");
},};
var module$resources$ocs = {};
module$resources$ocs.domain = domain$$module$resources$ocs;
module$resources$ocs.resource = resource$$module$resources$ocs;
// Input 28
const domain$$module$resources$netflix = "netflix";
const resource$$module$resources$netflix = {buttonClassName:"touchable PlayerControls--control-element nfp-button-control default-control-button", buttonHoverStyle:`transform: scale(1.2);`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector('div[style="align-items: normal; justify-content: normal;"] > [style="align-items: normal; justify-content: flex-end;"]');
}, buttonScale:1.5, buttonStyle:`min-width: 2.3em`, captionElement:function() {
  const e = getResource$$module$common().videoElement();
  return e && e.parentElement.querySelector(".player-timedtext-text-container");
}, videoElement:function() {
  return document.querySelector('video[tabindex="-1"]');
},};
var module$resources$netflix = {};
module$resources$netflix.domain = domain$$module$resources$netflix;
module$resources$netflix.resource = resource$$module$resources$netflix;
// Input 29
const domain$$module$resources$mlb = "mlb";
const resource$$module$resources$mlb = {buttonScale:0.7, buttonStyle:`
    border: 0px;
    background: transparent;
    filter: brightness(80%);
  `, buttonHoverStyle:`filter: brightness(120%) !important`, buttonParent:function() {
  return document.querySelector(".bottom-controls-right");
}, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, videoElement:function() {
  return document.querySelector(".mlbtv-media-player video");
},};
var module$resources$mlb = {};
module$resources$mlb.domain = domain$$module$resources$mlb;
module$resources$mlb.resource = resource$$module$resources$mlb;
// Input 30
const domain$$module$resources$mixer = "mixer";
const resource$$module$resources$mixer = {buttonClassName:"control", buttonElementType:"div", buttonHoverStyle:`background: rgba(255, 255, 255, 0.08)`, buttonInsertBefore:function(parent) {
  return parent.lastChild.previousSibling;
}, buttonParent:function() {
  return document.querySelector(".control-container .toolbar .right");
}, buttonScale:0.65, buttonStyle:`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    cursor: pointer;
  `, videoElement:function() {
  return document.querySelector(".control-container + video");
},};
var module$resources$mixer = {};
module$resources$mixer.domain = domain$$module$resources$mixer;
module$resources$mixer.resource = resource$$module$resources$mixer;
// Input 31
const domain$$module$resources$metacafe = "metacafe";
const resource$$module$resources$metacafe = {buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector("#player_place .tray");
}, buttonScale:0.85, videoElement:function() {
  return document.querySelector("#player_place video");
},};
var module$resources$metacafe = {};
module$resources$metacafe.domain = domain$$module$resources$metacafe;
module$resources$metacafe.resource = resource$$module$resources$metacafe;
// Input 32
const domain$$module$resources$mashable = "mashable";
const resource$$module$resources$mashable = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-controlbar-right-group");
}, buttonStyle:`
    top: -2px;
    width: 38px;
  `, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$mashable = {};
module$resources$mashable.domain = domain$$module$resources$mashable;
module$resources$mashable.resource = resource$$module$resources$mashable;
// Input 33
const domain$$module$resources$littlethings = "littlethings";
const resource$$module$resources$littlethings = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-controlbar-right-group");
}, buttonStyle:`width: 38px`, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$littlethings = {};
module$resources$littlethings.domain = domain$$module$resources$littlethings;
module$resources$littlethings.resource = resource$$module$resources$littlethings;
// Input 34
const domain$$module$resources$hulu = "hulu";
const resource$$module$resources$hulu = {buttonDidAppear:function() {
  const button = getButton$$module$button();
  const title = button.title;
  button.title = "";
  const tooltip = document.createElement("div");
  tooltip.className = "button-tool-tips";
  tooltip.style.cssText = `
      white-space: nowrap;
      padding: 0 5px;
      right: 0;
    `;
  tooltip.textContent = title.toUpperCase();
  button.appendChild(tooltip);
  button.addEventListener("mouseover", function() {
    tooltip.style.display = "block";
  });
  button.addEventListener("mouseout", function() {
    tooltip.style.display = "none";
  });
}, buttonElementType:"div", buttonHoverStyle:`opacity: 1.0 !important`, buttonInsertBefore:function(parent) {
  return document.querySelector(".controls__view-mode-button");
}, buttonParent:function() {
  return document.querySelector("#dash-player-container .controls__menus-right");
}, buttonStyle:`
    opacity: 0.7;
    cursor: pointer;
    width: 24px;
  `, captionElement:function() {
  return document.querySelector(".closed-caption-outband");
}, videoElement:function() {
  return document.querySelector(".video-player");
},};
var module$resources$hulu = {};
module$resources$hulu.domain = domain$$module$resources$hulu;
module$resources$hulu.resource = resource$$module$resources$hulu;
// Input 35
const domain$$module$resources$giantbomb = "giantbomb";
const resource$$module$resources$giantbomb = {buttonClassName:"av-chrome-control", buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.querySelector(".js-vid-pin-wrap").nextSibling;
}, buttonParent:function() {
  return document.querySelector(".av-controls--right");
}, buttonScale:0.7, buttonStyle:`
    height: 100%;
    width: 30px;
    opacity: 1.0;
    cursor: pointer;
  `, videoElement:function() {
  return document.querySelector('video[id^="video_js-vid-player"]');
}};
var module$resources$giantbomb = {};
module$resources$giantbomb.domain = domain$$module$resources$giantbomb;
module$resources$giantbomb.resource = resource$$module$resources$giantbomb;
// Input 36
const domain$$module$resources$fubotv = "fubo";
const resource$$module$resources$fubotv = {buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".css-ja7yk7");
}, buttonScale:1.25, buttonStyle:`
    height: 24px;
    width: 25px;
    margin: 8px 10px 12px;
    cursor: pointer;
  `, videoElement:function() {
  return document.getElementById("bitmovinplayer-video-video");
},};
var module$resources$fubotv = {};
module$resources$fubotv.domain = domain$$module$resources$fubotv;
module$resources$fubotv.resource = resource$$module$resources$fubotv;
// Input 37
const domain$$module$resources$eurosportplayer = "eurosportplayer";
const resource$$module$resources$eurosportplayer = {buttonElementType:"div", buttonHoverStyle:`opacity: 1 !important`, buttonParent:function() {
  return document.querySelector(".controls-bar-right-section");
}, buttonScale:0.9, buttonStyle:`
    height: 100%;
    margin-right: 15px;
    opacity: 0.8;
    cursor: pointer;
  `, videoElement:function() {
  return document.querySelector(".video-player__screen");
},};
var module$resources$eurosportplayer = {};
module$resources$eurosportplayer.domain = domain$$module$resources$eurosportplayer;
module$resources$eurosportplayer.resource = resource$$module$resources$eurosportplayer;
// Input 38
const domain$$module$resources$espn = "espn";
const resource$$module$resources$espn = {buttonClassName:"media-icon", buttonDidAppear:function() {
  const button = getButton$$module$button();
  const title = button.title;
  button.title = "";
  const tooltip = document.createElement("div");
  tooltip.className = "control-tooltip";
  tooltip.style.cssText = `
      right: 0px;
      bottom: 35px;
      transition: bottom 0.2s ease-out;
    `;
  tooltip.textContent = title;
  button.appendChild(tooltip);
  button.addEventListener("mouseover", function() {
    button.classList.add("displaying");
    tooltip.style.bottom = "75px";
  });
  button.addEventListener("mouseout", function() {
    button.classList.remove("displaying");
    tooltip.style.bottom = "35px";
  });
}, buttonElementType:"div", buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".controls-right-horizontal");
}, buttonScale:0.7, buttonStyle:`
    width: 44px;
    height: 44px;
    order: 4;
  `, captionElement:function() {
  return document.querySelector(".text-track-display");
}, videoElement:function() {
  return document.querySelector("video.js-video-content");
},};
var module$resources$espn = {};
module$resources$espn.domain = domain$$module$resources$espn;
module$resources$espn.resource = resource$$module$resources$espn;
// Input 39
const domain$$module$resources$disneyplus = "disneyplus";
const resource$$module$resources$disneyplus = {buttonClassName:"control-icon-btn", buttonInsertBefore:function(parent) {
  return document.querySelector(".fullscreen-icon");
}, buttonParent:function() {
  return document.querySelector(".controls__right");
}, videoElement:function() {
  return document.querySelector("video[src]");
},};
var module$resources$disneyplus = {};
module$resources$disneyplus.domain = domain$$module$resources$disneyplus;
module$resources$disneyplus.resource = resource$$module$resources$disneyplus;
// Input 40
const domain$$module$resources$dazn = "dazn";
const resource$$module$resources$dazn = {buttonStyle:`
    width: 1.5rem;
    height: 1.5rem;
    color: white;
    background: transparent;
    position: relative;
    border: none;
    outline: none;
    border-radius: 0;
    cursor: pointer;
    -webkit-appearance: none;
    margin: 0.5rem;
    z-index: 1;
  `, buttonInsertBefore:function(parent) {
  const liveIndicator = document.querySelector('div[data-test-id^="PLAYER_LIVE_INDICATOR"]');
  if (liveIndicator) {
    return liveIndicator;
  }
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector('div[data-test-id^="PLAYER_BAR"]');
}, videoElement:function() {
  return document.querySelector('div[data-test-id^="PLAYER_SOLUTION"] video');
}};
var module$resources$dazn = {};
module$resources$dazn.domain = domain$$module$resources$dazn;
module$resources$dazn.resource = resource$$module$resources$dazn;
// Input 41
const domain$$module$resources$curiositystream = "curiositystream";
const resource$$module$resources$curiositystream = {buttonClassName:"vjs-control vjs-button", buttonDidAppear:function() {
  if (getBrowser$$module$common() != Browser$$module$common.SAFARI) {
    return;
  }
  const video = getResource$$module$common().videoElement();
  const videoContainer = video.parentElement;
  video.addEventListener("webkitbeginfullscreen", function() {
    const height = Math.floor(100 * video.videoHeight / video.videoWidth) + "vw";
    const maxHeight = video.videoHeight + "px";
    videoContainer.style.setProperty("height", height, "important");
    videoContainer.style.setProperty("max-height", maxHeight);
  });
  video.addEventListener("webkitendfullscreen", function() {
    videoContainer.style.removeProperty("height");
    videoContainer.style.removeProperty("max-height");
  });
}, buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  const e = document.getElementById("main-player");
  return e && e.querySelector(".vjs-control-bar");
}, buttonScale:0.7, buttonStyle:`
    opacity: 0.8;
    cursor: pointer;
  `, videoElement:function() {
  return document.getElementById("main-player_html5_api");
},};
var module$resources$curiositystream = {};
module$resources$curiositystream.domain = domain$$module$resources$curiositystream;
module$resources$curiositystream.resource = resource$$module$resources$curiositystream;
// Input 42
const domain$$module$resources$crunchyroll = "crunchyroll";
const resource$$module$resources$crunchyroll = {buttonClassName:"vjs-control vjs-button", buttonHoverStyle:`opacity: 1 !important`, buttonScale:0.6, buttonStyle:`
    position: absolute;
    right: 100px;
    opacity: 0.75;
    cursor: pointer;
  `, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, videoElement:function() {
  return document.getElementById("player_html5_api");
},};
var module$resources$crunchyroll = {};
module$resources$crunchyroll.domain = domain$$module$resources$crunchyroll;
module$resources$crunchyroll.resource = resource$$module$resources$crunchyroll;
// Input 43
const domain$$module$resources$ceskatelevize = "ceskatelevize";
const resource$$module$resources$ceskatelevize = {buttonClassName:"videoButtonShell dontHideControls cursorPointer focusableBtn", buttonElementType:"div", buttonHoverStyle:`
    filter: brightness(50%) sepia(1) hue-rotate(170deg) saturate(250%) brightness(90%);
  `, buttonInsertBefore:function(parent) {
  return document.getElementById("fullScreenShell");
}, buttonScale:1.2, buttonStyle:`
    width: 18px;
    height: 18px;
    display: inline-block;
  `, buttonParent:function() {
  return document.getElementById("videoButtons");
}, videoElement:function() {
  return document.getElementById("video");
},};
var module$resources$ceskatelevize = {};
module$resources$ceskatelevize.domain = domain$$module$resources$ceskatelevize;
module$resources$ceskatelevize.resource = resource$$module$resources$ceskatelevize;
// Input 44
const domain$$module$resources$bbc = "bbc";
const resource$$module$resources$bbc = {buttonParent:function() {
  return null;
}, captionElement:function() {
  return document.querySelector(".p_subtitlesContainer");
}, videoElement:function() {
  return document.querySelector("#mediaContainer video[src]");
},};
var module$resources$bbc = {};
module$resources$bbc.domain = domain$$module$resources$bbc;
module$resources$bbc.resource = resource$$module$resources$bbc;
// Input 45
const domain$$module$resources$apple = "apple";
const getNestedShadowRoot$$module$resources$apple = function(selectors) {
  let dom = document;
  for (const selector of selectors) {
    dom = dom.querySelector(selector);
    dom = dom && dom.shadowRoot;
    if (!dom) {
      return null;
    }
  }
  return dom;
};
const resource$$module$resources$apple = {buttonClassName:"footer__control hydrated", buttonElementType:"div", buttonHoverStyle:`opacity: 0.8 !important`, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  const internal = getNestedShadowRoot$$module$resources$apple(["apple-tv-plus-player", "amp-video-player-internal"]);
  if (!internal) {
    return;
  }
  const fullscreenButton = internal.querySelector("amp-playback-controls-full-screen");
  if (!fullscreenButton) {
    return;
  }
  return fullscreenButton.parentElement;
}, buttonStyle:`
    transition: opacity 0.15s;
    cursor: pointer;
    opacity: 0.9;
  `, videoElement:function() {
  const video = getNestedShadowRoot$$module$resources$apple(["apple-tv-plus-player", "amp-video-player-internal", "amp-video-player"]);
  if (!video) {
    return;
  }
  return video.querySelector("video");
},};
var module$resources$apple = {};
module$resources$apple.domain = domain$$module$resources$apple;
module$resources$apple.resource = resource$$module$resources$apple;
// Input 46
const domain$$module$resources$amazon = ["amazon", "primevideo"];
const resource$$module$resources$amazon = {buttonHoverStyle:`opacity: 1 !important`, buttonInsertBefore:function(parent) {
  return parent.querySelector(".fullscreenButtonWrapper");
}, buttonParent:function() {
  const e = document.getElementById("dv-web-player");
  return e && e.querySelector(".hideableTopButtons");
}, buttonStyle:`
    position: relative;
    left: 8px;
    width: 3vw;
    height: 2vw;
    min-width: 35px;
    min-height: 24px;
    border: 0px;
    padding: 0px;
    background-color: transparent;
    opacity: 0.8;
  `, captionElement:function() {
  const e = document.getElementById("dv-web-player");
  return e && e.querySelector(".captions");
}, videoElement:function() {
  const e = document.querySelector(".rendererContainer");
  return e && e.querySelector('video[width="100%"]');
},};
var module$resources$amazon = {};
module$resources$amazon.domain = domain$$module$resources$amazon;
module$resources$amazon.resource = resource$$module$resources$amazon;
// Input 47
const domain$$module$resources$aktualne = "aktualne";
const resource$$module$resources$aktualne = {buttonClassName:"jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-logo", buttonElementType:"div", buttonHoverStyle:`
    filter: brightness(50%) sepia(1) hue-rotate(311deg) saturate(550%) brightness(49%) !important;
  `, buttonInsertBefore:function(parent) {
  return parent.lastChild;
}, buttonParent:function() {
  return document.querySelector(".jw-controlbar-right-group");
}, buttonStyle:`
    width: 38px;
    filter: brightness(80%);
  `, videoElement:function() {
  return document.querySelector("video.jw-video");
},};
var module$resources$aktualne = {};
module$resources$aktualne.domain = domain$$module$resources$aktualne;
module$resources$aktualne.resource = resource$$module$resources$aktualne;
// Input 48
const domain$$module$resources$9now = "9now";
const resource$$module$resources$9now = {buttonClassName:"vjs-control vjs-button", buttonHoverStyle:`
    filter: brightness(50%) sepia(1) hue-rotate(167deg) saturate(253%) brightness(104%);
  `, buttonInsertBefore:function(parent) {
  return parent.querySelector(".vjs-fullscreen-control");
}, buttonParent:function() {
  return document.querySelector(".vjs-control-bar");
}, buttonScale:0.7, buttonStyle:`
    order: 999999;
    cursor: pointer;
    height: 44px;
    width: 40px;
  `, captionElement:function() {
  const e = getResource$$module$common().videoElement();
  return e && e.parentElement.querySelector(".vjs-text-track-display");
}, videoElement:function() {
  return document.querySelector("video.vjs-tech");
},};
var module$resources$9now = {};
module$resources$9now.domain = domain$$module$resources$9now;
module$resources$9now.resource = resource$$module$resources$9now;
// Input 49
const initialiseCaches$$module$cache = function() {
  let uniqueIdCounter = 0;
  const uniqueId = function() {
    return "PiPer_" + uniqueIdCounter++;
  };
  const cacheElementWrapper = function(elementFunction) {
    let cachedElementId = null;
    return function(bypassCache) {
      const cachedElement = cachedElementId ? document.getElementById(cachedElementId) : null;
      if (cachedElement && !bypassCache) {
        return cachedElement;
      }
      const uncachedElement = elementFunction();
      if (uncachedElement) {
        if (!uncachedElement.id) {
          uncachedElement.id = uniqueId();
        }
        cachedElementId = uncachedElement.id;
      }
      return uncachedElement;
    };
  };
  const currentResource = getResource$$module$common();
  currentResource.buttonParent = cacheElementWrapper(currentResource.buttonParent);
  currentResource.videoElement = cacheElementWrapper(currentResource.videoElement);
  if (currentResource.captionElement) {
    currentResource.captionElement = cacheElementWrapper(currentResource.captionElement);
  }
};
var module$cache = {};
module$cache.initialiseCaches = initialiseCaches$$module$cache;
// Input 50
const resources$$module$resources$index = {};
resources$$module$resources$index[domain$$module$resources$9now] = resource$$module$resources$9now;
resources$$module$resources$index[domain$$module$resources$aktualne] = resource$$module$resources$aktualne;
resources$$module$resources$index["amazon"] = resource$$module$resources$amazon;
resources$$module$resources$index[domain$$module$resources$apple] = resource$$module$resources$apple;
resources$$module$resources$index[domain$$module$resources$bbc] = resource$$module$resources$bbc;
resources$$module$resources$index[domain$$module$resources$ceskatelevize] = resource$$module$resources$ceskatelevize;
resources$$module$resources$index[domain$$module$resources$crunchyroll] = resource$$module$resources$crunchyroll;
resources$$module$resources$index[domain$$module$resources$curiositystream] = resource$$module$resources$curiositystream;
resources$$module$resources$index[domain$$module$resources$dazn] = resource$$module$resources$dazn;
resources$$module$resources$index[domain$$module$resources$disneyplus] = resource$$module$resources$disneyplus;
resources$$module$resources$index[domain$$module$resources$espn] = resource$$module$resources$espn;
resources$$module$resources$index[domain$$module$resources$eurosportplayer] = resource$$module$resources$eurosportplayer;
resources$$module$resources$index[domain$$module$resources$fubotv] = resource$$module$resources$fubotv;
resources$$module$resources$index[domain$$module$resources$giantbomb] = resource$$module$resources$giantbomb;
resources$$module$resources$index[domain$$module$resources$hulu] = resource$$module$resources$hulu;
resources$$module$resources$index[domain$$module$resources$littlethings] = resource$$module$resources$littlethings;
resources$$module$resources$index[domain$$module$resources$mashable] = resource$$module$resources$mashable;
resources$$module$resources$index[domain$$module$resources$metacafe] = resource$$module$resources$metacafe;
resources$$module$resources$index[domain$$module$resources$mixer] = resource$$module$resources$mixer;
resources$$module$resources$index[domain$$module$resources$mlb] = resource$$module$resources$mlb;
resources$$module$resources$index[domain$$module$resources$netflix] = resource$$module$resources$netflix;
resources$$module$resources$index[domain$$module$resources$ocs] = resource$$module$resources$ocs;
resources$$module$resources$index["openload"] = resource$$module$resources$openload;
resources$$module$resources$index[domain$$module$resources$pbs] = resource$$module$resources$pbs;
resources$$module$resources$index["periscope"] = resource$$module$resources$periscope;
resources$$module$resources$index[domain$$module$resources$plex] = resource$$module$resources$plex;
resources$$module$resources$index["seznam"] = resource$$module$resources$seznam;
resources$$module$resources$index[domain$$module$resources$streamable] = resource$$module$resources$streamable;
resources$$module$resources$index[domain$$module$resources$ted] = resource$$module$resources$ted;
resources$$module$resources$index[domain$$module$resources$theonion] = resource$$module$resources$theonion;
resources$$module$resources$index[domain$$module$resources$twitch] = resource$$module$resources$twitch;
resources$$module$resources$index[domain$$module$resources$udemy] = resource$$module$resources$udemy;
resources$$module$resources$index[domain$$module$resources$ustream] = resource$$module$resources$ustream;
resources$$module$resources$index[domain$$module$resources$vevo] = resource$$module$resources$vevo;
resources$$module$resources$index[domain$$module$resources$vice] = resource$$module$resources$vice;
resources$$module$resources$index[domain$$module$resources$vid] = resource$$module$resources$vid;
resources$$module$resources$index["vijf"] = resource$$module$resources$viervijfzes;
resources$$module$resources$index[domain$$module$resources$vk] = resource$$module$resources$vk;
resources$$module$resources$index[domain$$module$resources$vrt] = resource$$module$resources$vrt;
resources$$module$resources$index[domain$$module$resources$vrv] = resource$$module$resources$vrv;
resources$$module$resources$index[domain$$module$resources$yeloplay] = resource$$module$resources$yeloplay;
resources$$module$resources$index["youtube"] = resource$$module$resources$youtube;
resources$$module$resources$index["primevideo"] = resources$$module$resources$index["amazon"];
resources$$module$resources$index["oload"] = resources$$module$resources$index["openload"];
resources$$module$resources$index["pscp"] = resources$$module$resources$index["periscope"];
resources$$module$resources$index["stream"] = resources$$module$resources$index["seznam"];
resources$$module$resources$index["vier"] = resources$$module$resources$index["vijf"];
resources$$module$resources$index["zes"] = resources$$module$resources$index["vijf"];
resources$$module$resources$index["youtu"] = resources$$module$resources$index["youtube"];
var module$resources$index = {};
module$resources$index.resources = resources$$module$resources$index;
// Input 51
const mutationObserver$$module$main = function() {
  const currentResource = getResource$$module$common();
  if (shouldProcessCaptions$$module$captions()) {
    processCaptions$$module$captions();
  }
  if (getBrowser$$module$common() == Browser$$module$common.CHROME) {
    addVideoElementListeners$$module$video();
  }
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI && currentResource.captionElement) {
    addVideoCaptionTracks$$module$captions();
  }
  if (checkButton$$module$button()) {
    return;
  }
  const buttonParent = currentResource.buttonParent();
  if (buttonParent) {
    addButton$$module$button(buttonParent);
    if (currentResource.buttonDidAppear) {
      currentResource.buttonDidAppear();
    }
    info$$module$logger("Picture in Picture button added to webpage");
  }
};
const getCurrentDomainName$$module$main = function() {
  if (location.port == 32400) {
    return "plex";
  } else {
    return (location.hostname.match(/([^.]+)\.(?:com?\.)?[^.]+$/) || [])[1];
  }
};
const domainName$$module$main = getCurrentDomainName$$module$main();
if (domainName$$module$main in resources$$module$resources$index) {
  info$$module$logger(`Matched site ${domainName$$module$main} (${location})`);
  setResource$$module$common(resources$$module$resources$index[domainName$$module$main]);
  initialiseCaches$$module$cache();
  if (getBrowser$$module$common() == Browser$$module$common.SAFARI) {
    enableCaptions$$module$captions(true);
  }
  const observer = new MutationObserver(mutationObserver$$module$main);
  observer.observe(document, {childList:true, subtree:true,});
  mutationObserver$$module$main();
}
var module$main = {};
})());
//# sourceMappingURL=data:application/json;base64,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QWhCLEtBQStCSixRQUEvQixHQUFMLENBQUE7QUFDQXZOLDRCQUFBLENBQVlvTixpQ0FBQSxDQUFVTyx1QkFBVixDQUFaLENBQUE7QUFFQWhCLGdDQUFBLEVBQUE7QUFFQSxNQUFJbk4seUJBQUEsRUFBSixJQUFvQkosc0JBQVFFLENBQUFBLE1BQTVCO0FBQ0VtRyxtQ0FBQSxDQUFlLElBQWYsQ0FBQTtBQURGO0FBSUEsUUFBTW1JLFdBQVcsSUFBSUMsZ0JBQUosQ0FBcUJSLDZCQUFyQixDQUFqQjtBQUNBTyxVQUFTRSxDQUFBQSxPQUFULENBQWlCNU0sUUFBakIsRUFBMkIsQ0FDekI2TSxVQUFXLElBRGMsRUFFekJDLFFBQVMsSUFGZ0IsRUFBM0IsQ0FBQTtBQUlBWCwrQkFBQSxFQUFBO0FBZjJCO0FBbkQ3QixJQUFBL08sY0FBQSxFQUFBOzsiLAoic291cmNlcyI6WyIuL2RlZmluZXMuanMiLCIuL2xvZ2dlci5qcyIsIi4vY29tbW9uLmpzIiwiLi92aWRlby5qcyIsIi4vbG9jYWxpemF0aW9uLmpzIiwiLi9jYXB0aW9ucy5qcyIsIi4vYnV0dG9uLmpzIiwiLi9yZXNvdXJjZXMveW91dHViZS5qcyIsIi4vcmVzb3VyY2VzL3llbG9wbGF5LmpzIiwiLi9yZXNvdXJjZXMvdnJ2LmpzIiwiLi9yZXNvdXJjZXMvdnJ0LmpzIiwiLi9yZXNvdXJjZXMvdmsuanMiLCIuL3Jlc291cmNlcy92aWVydmlqZnplcy5qcyIsIi4vcmVzb3VyY2VzL3ZpZC5qcyIsIi4vcmVzb3VyY2VzL3ZpY2UuanMiLCIuL3Jlc291cmNlcy92ZXZvLmpzIiwiLi9yZXNvdXJjZXMvdXN0cmVhbS5qcyIsIi4vcmVzb3VyY2VzL3VkZW15LmpzIiwiLi9yZXNvdXJjZXMvdHdpdGNoLmpzIiwiLi9yZXNvdXJjZXMvdGhlb25pb24uanMiLCIuL3Jlc291cmNlcy90ZWQuanMiLCIuL3Jlc291cmNlcy9zdHJlYW1hYmxlLmpzIiwiLi9yZXNvdXJjZXMvc2V6bmFtLmpzIiwiLi9yZXNvdXJjZXMvcGxleC5qcyIsIi4vcmVzb3VyY2VzL3BlcmlzY29wZS5qcyIsIi4vcmVzb3VyY2VzL3Bicy5qcyIsIi4vcmVzb3VyY2VzL29wZW5sb2FkLmpzIiwiLi9yZXNvdXJjZXMvb2NzLmpzIiwiLi9yZXNvdXJjZXMvbmV0ZmxpeC5qcyIsIi4vcmVzb3VyY2VzL21sYi5qcyIsIi4vcmVzb3VyY2VzL21peGVyLmpzIiwiLi9yZXNvdXJjZXMvbWV0YWNhZmUuanMiLCIuL3Jlc291cmNlcy9tYXNoYWJsZS5qcyIsIi4vcmVzb3VyY2VzL2xpdHRsZXRoaW5ncy5qcyIsIi4vcmVzb3VyY2VzL2h1bHUuanMiLCIuL3Jlc291cmNlcy9naWFudGJvbWIuanMiLCIuL3Jlc291cmNlcy9mdWJvdHYuanMiLCIuL3Jlc291cmNlcy9ldXJvc3BvcnRwbGF5ZXIuanMiLCIuL3Jlc291cmNlcy9lc3BuLmpzIiwiLi9yZXNvdXJjZXMvZGlzbmV5cGx1cy5qcyIsIi4vcmVzb3VyY2VzL2Rhem4uanMiLCIuL3Jlc291cmNlcy9jdXJpb3NpdHlzdHJlYW0uanMiLCIuL3Jlc291cmNlcy9jcnVuY2h5cm9sbC5qcyIsIi4vcmVzb3VyY2VzL2Nlc2thdGVsZXZpemUuanMiLCIuL3Jlc291cmNlcy9iYmMuanMiLCIuL3Jlc291cmNlcy9hcHBsZS5qcyIsIi4vcmVzb3VyY2VzL2FtYXpvbi5qcyIsIi4vcmVzb3VyY2VzL2FrdHVhbG5lLmpzIiwiLi9yZXNvdXJjZXMvOW5vdy5qcyIsIi4vY2FjaGUuanMiLCIuL3Jlc291cmNlcy9pbmRleC5qcyIsIi4vbWFpbi5qcyJdLAoic291cmNlc0NvbnRlbnQiOlsiLyoqIEBkZWZpbmUge251bWJlcn0gLSBGbGFnIHVzZWQgYnkgY2xvc3VyZSBjb21waWxlciB0byBzZXQgbG9nZ2luZyBsZXZlbCAqL1xuZXhwb3J0IGNvbnN0IExPR0dJTkdfTEVWRUwgPSAwO1xuXG4vKiogQGRlZmluZSB7bnVtYmVyfSAtIEZsYWcgdXNlZCBieSBjbG9zdXJlIGNvbXBpbGVyIHRvIHRhcmdldCBzcGVjaWZpYyBicm93c2VyICovXG5leHBvcnQgY29uc3QgQlJPV1NFUiA9IDA7IiwiaW1wb3J0IHsgTE9HR0lOR19MRVZFTCB9IGZyb20gJy4vZGVmaW5lcy5qcydcblxuY29uc3QgbG9nZ2luZ1ByZWZpeCA9ICdbUGlQZXJdICc7XG5cbi8qKiBAZW51bSB7bnVtYmVyfSAtIEVudW0gZm9yIGxvZ2dpbmcgbGV2ZWwgKi9cbmV4cG9ydCBjb25zdCBMb2dnaW5nTGV2ZWwgPSB7XG4gIEFMTDogMCxcbiAgVFJBQ0U6IDEwLFxuICBJTkZPOiAyMCxcbiAgV0FSTklORzogMzAsXG4gIEVSUk9SOiA0MCxcbn07XG5cbi8qKlxuICogTG9ncyBzdGFjayB0cmFjZSB0byBjb25zb2xlXG4gKi9cbmV4cG9ydCBjb25zdCB0cmFjZSA9IChMb2dnaW5nTGV2ZWwuVFJBQ0UgPj0gTE9HR0lOR19MRVZFTCkgPyBcbiAgICBjb25zb2xlLnRyYWNlLmJpbmQoY29uc29sZSkgOiBmdW5jdGlvbigpe307XG5cbi8qKlxuICogTG9ncyBpbmZvcm1hdGlvbmFsIG1lc3NhZ2UgdG8gY29uc29sZVxuICovXG5leHBvcnQgY29uc3QgaW5mbyA9IChMb2dnaW5nTGV2ZWwuSU5GTyA+PSBMT0dHSU5HX0xFVkVMKSA/IFxuICAgIGNvbnNvbGUuaW5mby5iaW5kKGNvbnNvbGUsIGxvZ2dpbmdQcmVmaXgpIDogZnVuY3Rpb24oKXt9O1xuICAgIFxuLyoqXG4gKiBMb2dzIHdhcm5pbmcgbWVzc2FnZSB0byBjb25zb2xlXG4gKi9cbmV4cG9ydCBjb25zdCB3YXJuID0gKExvZ2dpbmdMZXZlbC5XQVJOSU5HID49IExPR0dJTkdfTEVWRUwpID8gXG4gICAgY29uc29sZS53YXJuLmJpbmQoY29uc29sZSwgbG9nZ2luZ1ByZWZpeCkgOiBmdW5jdGlvbigpe307XG4gICAgXG4vKipcbiAqIExvZ3MgZXJyb3IgbWVzc2FnZSB0byBjb25zb2xlXG4gKi9cbmV4cG9ydCBjb25zdCBlcnJvciA9IChMb2dnaW5nTGV2ZWwuRVJST1IgPj0gTE9HR0lOR19MRVZFTCkgPyBcbiAgICBjb25zb2xlLmVycm9yLmJpbmQoY29uc29sZSwgbG9nZ2luZ1ByZWZpeCkgOiBmdW5jdGlvbigpe307IiwiaW1wb3J0IHsgQlJPV1NFUiB9IGZyb20gJy4vZGVmaW5lcy5qcydcbmltcG9ydCB7IHdhcm4gfSBmcm9tICcuL2xvZ2dlci5qcydcblxuLyoqIEBlbnVtIHtudW1iZXJ9IC0gRW51bSBmb3IgYnJvd3NlciAqL1xuZXhwb3J0IGNvbnN0IEJyb3dzZXIgPSB7XG4gIFVOS05PV046IDAsXG4gIFNBRkFSSTogMSxcbiAgQ0hST01FOiAyLFxufTtcblxuLyoqXG4gKiBSZXR1cm5zIGN1cnJlbnQgd2ViIGJyb3dzZXJcbiAqXG4gKiBAcmV0dXJuIHtCcm93c2VyfSBcbiAqL1xuZXhwb3J0IGNvbnN0IGdldEJyb3dzZXIgPSBmdW5jdGlvbigpIHtcbiAgaWYgKEJST1dTRVIgIT0gQnJvd3Nlci5VTktOT1dOKSB7XG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7QnJvd3Nlcn0gKi8gKEJST1dTRVIpO1xuICB9XG4gIGlmICgvU2FmYXJpLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpICYmIC9BcHBsZS8udGVzdChuYXZpZ2F0b3IudmVuZG9yKSkge1xuICAgIHJldHVybiBCcm93c2VyLlNBRkFSSTtcbiAgfVxuICBpZiAoL0Nocm9tZS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvR29vZ2xlLy50ZXN0KG5hdmlnYXRvci52ZW5kb3IpKSB7XG4gICAgcmV0dXJuIEJyb3dzZXIuQ0hST01FO1xuICB9XG4gIHJldHVybiBCcm93c2VyLlVOS05PV047XG59O1xuXG4vKipcbiAqIEB0eXBlZGVmIHt7XG4gKiAgIGJ1dHRvbkNsYXNzTmFtZTogKHN0cmluZ3x1bmRlZmluZWQpLFxuICogICBidXR0b25EaWRBcHBlYXI6IChmdW5jdGlvbigpOnVuZGVmaW5lZHx1bmRlZmluZWQpLFxuICogICBidXR0b25FbGVtZW50VHlwZTogKHN0cmluZ3x1bmRlZmluZWQpLFxuICogICBidXR0b25FeGl0SW1hZ2U6IChzdHJpbmd8dW5kZWZpbmVkKSxcbiAqICAgYnV0dG9uSG92ZXJTdHlsZTogKHN0cmluZ3x1bmRlZmluZWQpLFxuICogICBidXR0b25JbWFnZTogKHN0cmluZ3x1bmRlZmluZWQpLFxuICogICBidXR0b25JbnNlcnRCZWZvcmU6IChmdW5jdGlvbihFbGVtZW50KTo/Tm9kZXx1bmRlZmluZWQpLFxuICogICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKGJvb2xlYW49KTo/RWxlbWVudCxcbiAqICAgYnV0dG9uU2NhbGU6IChudW1iZXJ8dW5kZWZpbmVkKSxcbiAqICAgYnV0dG9uU3R5bGU6IChzdHJpbmd8dW5kZWZpbmVkKSxcbiAqICAgY2FwdGlvbkVsZW1lbnQ6IChmdW5jdGlvbihib29sZWFuPSk6P0VsZW1lbnR8dW5kZWZpbmVkKSxcbiAqICAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbihib29sZWFuPSk6P0VsZW1lbnQsXG4gKiB9fVxuICovXG5sZXQgUGlwZXJSZXNvdXJjZTtcblxubGV0IC8qKiA/UGlwZXJSZXNvdXJjZSAqLyBjdXJyZW50UmVzb3VyY2UgPSBudWxsO1xuXG4vKipcbiAqIFJldHVybnMgdGhlIGN1cnJlbnQgcmVzb3VyY2VcbiAqXG4gKiBAcmV0dXJuIHs/UGlwZXJSZXNvdXJjZX1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldFJlc291cmNlID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjdXJyZW50UmVzb3VyY2U7XG59O1xuXG4vKipcbiAqIFNldHMgdGhlIGN1cnJlbnQgcmVzb3VyY2VcbiAqXG4gKiBAcGFyYW0gez9QaXBlclJlc291cmNlfSByZXNvdXJjZSAtIGEgcmVzb3VyY2UgdG8gc2V0IGFzIGN1cnJlbnQgcmVzb3VyY2VcbiAqL1xuZXhwb3J0IGNvbnN0IHNldFJlc291cmNlID0gZnVuY3Rpb24ocmVzb3VyY2UpIHtcbiAgY3VycmVudFJlc291cmNlID0gcmVzb3VyY2U7XG59O1xuXG4vKipcbiAqIENvbnZlcnRzIGEgcmVsYXRpdmUgcGF0aCB3aXRoaW4gYW4gZXh0ZW5zaW9uIHRvIGEgZnVsbHktcXVhbGlmaWVkIFVSTFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gYSBwYXRoIHRvIGEgcmVzb3VyY2VcbiAqIEByZXR1cm4ge3N0cmluZ30gXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRFeHRlbnNpb25VUkwgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHN3aXRjaCAoZ2V0QnJvd3NlcigpKSB7XG4gICAgY2FzZSBCcm93c2VyLlNBRkFSSTpcbiAgICAgIHJldHVybiBzYWZhcmkuZXh0ZW5zaW9uLmJhc2VVUkkgKyBwYXRoO1xuICAgIGNhc2UgQnJvd3Nlci5DSFJPTUU6XG4gICAgICByZXR1cm4gY2hyb21lLnJ1bnRpbWUuZ2V0VVJMKHBhdGgpO1xuICAgIGNhc2UgQnJvd3Nlci5VTktOT1dOOlxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gcGF0aDtcbiAgfVxufTtcblxuLyoqXG4gKiBBcHBsaWVzIGZpeCB0byBieXBhc3MgYmFja2dyb3VuZCBET00gdGltZXIgdGhyb3R0bGluZ1xuICovXG5leHBvcnQgY29uc3QgYnlwYXNzQmFja2dyb3VuZFRpbWVyVGhyb3R0bGluZyA9IGZ1bmN0aW9uKCkge1xuXG4gIC8vIElzc3VlIHdhcm5pbmcgZm9yIHVubmVjZXNzYXJ5IHVzZSBvZiBiYWNrZ3JvdW5kIHRpbWVyIHRocm90dGxpbmdcbiAgaWYgKCFjdXJyZW50UmVzb3VyY2UuY2FwdGlvbkVsZW1lbnQpIHtcbiAgICB3YXJuKCdVbm5lY2Vzc2FyeSBieXBhc3Npbmcgb2YgYmFja2dyb3VuZCB0aW1lciB0aHJvdHRsaW5nIG9uIHBhZ2Ugd2l0aG91dCBjYXB0aW9uIHN1cHBvcnQnKTtcbiAgfVxuXG4gIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmVxdWVzdC5vcGVuKCdHRVQnLCBnZXRFeHRlbnNpb25VUkwoJ3NjcmlwdHMvZml4LmpzJykpO1xuICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnbW9kdWxlJyk7XG4gICAgc2NyaXB0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJlcXVlc3QucmVzcG9uc2VUZXh0KSk7XG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICB9O1xuICByZXF1ZXN0LnNlbmQoKTtcbn07IiwiaW1wb3J0IHsgaW5mbyB9IGZyb20gJy4vbG9nZ2VyLmpzJ1xuaW1wb3J0IHsgQnJvd3NlciwgZ2V0QnJvd3NlciwgZ2V0UmVzb3VyY2UgfSBmcm9tICcuL2NvbW1vbi5qcydcblxuY29uc3QgQ0hST01FX1BMQVlJTkdfUElQX0FUVFJJQlVURSA9ICdkYXRhLXBsYXlpbmctcGljdHVyZS1pbi1waWN0dXJlJztcblxuY29uc3QgLyoqICFBcnJheTxmdW5jdGlvbihIVE1MVmlkZW9FbGVtZW50LCBib29sZWFuKT4gKi8gZXZlbnRMaXN0ZW5lcnMgPSBbXTtcblxuLyoqXG4gKiBUb2dnbGVzIHZpZGVvIFBpY3R1cmUgaW4gUGljdHVyZVxuICpcbiAqIEBwYXJhbSB7SFRNTFZpZGVvRWxlbWVudH0gdmlkZW8gLSB2aWRlbyBlbGVtZW50IHRvIHRvZ2dsZSBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZVxuICovXG5leHBvcnQgY29uc3QgdG9nZ2xlUGljdHVyZUluUGljdHVyZSA9IGZ1bmN0aW9uKHZpZGVvKSB7XG4gIGNvbnN0IHBsYXlpbmdQaWN0dXJlSW5QaWN0dXJlID0gdmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSh2aWRlbyk7XG4gIHN3aXRjaCAoZ2V0QnJvd3NlcigpKSB7XG4gICAgY2FzZSBCcm93c2VyLlNBRkFSSTpcbiAgICAgIGlmIChwbGF5aW5nUGljdHVyZUluUGljdHVyZSkge1xuICAgICAgXHR2aWRlby53ZWJraXRTZXRQcmVzZW50YXRpb25Nb2RlKCdpbmxpbmUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZpZGVvLndlYmtpdFNldFByZXNlbnRhdGlvbk1vZGUoJ3BpY3R1cmUtaW4tcGljdHVyZScpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBCcm93c2VyLkNIUk9NRTpcbiAgICAgIGlmIChwbGF5aW5nUGljdHVyZUluUGljdHVyZSkge1xuICAgICAgICAvLyBXb3JrYXJvdW5kIENocm9tZSBjb250ZW50IHNjcmlwdHMgYmVpbmcgdW5hYmxlIHRvIGNhbGwgJ2V4aXRQaWN0dXJlSW5QaWN0dXJlJyBkaXJlY3RseVxuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgc2NyaXB0LnRleHRDb250ZW50ID0gJ2RvY3VtZW50LmV4aXRQaWN0dXJlSW5QaWN0dXJlKCknO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgIHNjcmlwdC5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEZvcmNlIGVuYWJsZSBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZSBzdXBwb3J0XG4gICAgICAgIHZpZGVvLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZXBpY3R1cmVpbnBpY3R1cmUnKTtcbiAgICAgICAgXG4gICAgICAgIHZpZGVvLnJlcXVlc3RQaWN0dXJlSW5QaWN0dXJlKCk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBjYXNlIEJyb3dzZXIuVU5LTk9XTjpcbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbn07XG5cbi8qKlxuICogQWRkcyBhIFBpY3R1cmUgaW4gUGljdHVyZSBldmVudCBsaXN0ZW5lclxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oSFRNTFZpZGVvRWxlbWVudCwgYm9vbGVhbil9IGxpc3RlbmVyIC0gYW4gZXZlbnQgbGlzdGVuZXIgdG8gYWRkXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRQaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKGxpc3RlbmVyKSB7XG4gIGNvbnN0IGluZGV4ID0gZXZlbnRMaXN0ZW5lcnMuaW5kZXhPZihsaXN0ZW5lcik7XG4gIGlmIChpbmRleCA9PSAtMSkge1xuICAgIGV2ZW50TGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xuICB9XG5cbiAgaWYgKGdldEJyb3dzZXIoKSA9PSBCcm93c2VyLlNBRkFSSSkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdHByZXNlbnRhdGlvbm1vZGVjaGFuZ2VkJywgdmlkZW9QcmVzZW50YXRpb25Nb2RlQ2hhbmdlZCwge1xuICAgICAgY2FwdHVyZTogdHJ1ZSxcbiAgICB9KTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgUGljdHVyZSBpbiBQaWN0dXJlIGV2ZW50IGxpc3RlbmVyXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihIVE1MVmlkZW9FbGVtZW50LGJvb2xlYW4pfSBsaXN0ZW5lciAtIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHJlbW92ZVxuICovXG5leHBvcnQgY29uc3QgcmVtb3ZlUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihsaXN0ZW5lcikge1xuICBjb25zdCBpbmRleCA9IGV2ZW50TGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICBpZiAoaW5kZXggPiAtMSkge1xuICAgIGV2ZW50TGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gIH1cbiAgXG4gIGlmIChnZXRCcm93c2VyKCkgPT0gQnJvd3Nlci5TQUZBUkkgJiYgZXZlbnRMaXN0ZW5lcnMubGVuZ3RoID09IDApIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd3ZWJraXRwcmVzZW50YXRpb25tb2RlY2hhbmdlZCcsIHZpZGVvUHJlc2VudGF0aW9uTW9kZUNoYW5nZWQpOyAgICBcbiAgfVxufTtcblxuLyoqXG4gKiBEaXNwYXRjaGVzIGEgUGljdHVyZSBpbiBQaWN0dXJlIGV2ZW50XG4gKlxuICogQHBhcmFtIHtIVE1MVmlkZW9FbGVtZW50fSB2aWRlbyAtIHRhcmdldCB2aWRlbyBlbGVtZW50XG4gKi9cbmNvbnN0IGRpc3BhdGNoUGljdHVyZUluUGljdHVyZUV2ZW50ID0gZnVuY3Rpb24odmlkZW8pIHtcbiAgXG4gIC8vIElnbm9yZSBldmVudHMgZnJvbSBvdGhlciB2aWRlbyBlbGVtZW50cyBlLmcuIGFkdmVydHNcbiAgY29uc3QgZXhwZWN0ZWRWaWRlbyA9IGdldFJlc291cmNlKCkudmlkZW9FbGVtZW50KHRydWUpO1xuICBpZiAodmlkZW8gIT0gZXhwZWN0ZWRWaWRlbykgcmV0dXJuO1xuXG4gIGNvbnN0IGlzUGxheWluZ1BpY3R1cmVJblBpY3R1cmUgPSB2aWRlb1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlKHZpZGVvKTtcbiAgaWYgKGlzUGxheWluZ1BpY3R1cmVJblBpY3R1cmUpIHtcbiAgICBpbmZvKCdWaWRlbyBlbnRlcmluZyBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZScpO1xuICB9IGVsc2Uge1xuICAgIGluZm8oJ1ZpZGVvIGxlYXZpbmcgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUnKTtcbiAgfVxuXG4gIC8vIENhbGwgZXZlbnQgbGlzdGVuZXJzIHVzaW5nIGEgY29weSB0byBwcmV2ZW50IHBvc3NpYmxpdHkgb2YgZW5kbGVzcyBsb29waW5nXG4gIGNvbnN0IGV2ZW50TGlzdGVuZXJzQ29weSA9IGV2ZW50TGlzdGVuZXJzLnNsaWNlKCk7XG4gIGZvciAobGV0IGxpc3RlbmVyOyBsaXN0ZW5lciA9IGV2ZW50TGlzdGVuZXJzQ29weS5wb3AoKTspIHtcbiAgICBsaXN0ZW5lcih2aWRlbywgaXNQbGF5aW5nUGljdHVyZUluUGljdHVyZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBEaXNwYXRjaGVzIGEgUGljdHVyZSBpbiBQaWN0dXJlIGV2ZW50IGZvciBldmVyeSAnd2Via2l0cHJlc2VudGF0aW9ubW9kZWNoYW5nZWQnIGV2ZW50XG4gKlxuICogQHBhcmFtIHshRXZlbnR9IGV2ZW50IC0gYSB3ZWJraXRwcmVzZW50YXRpb25tb2RlY2hhbmdlZCBldmVudFxuICovXG5jb25zdCB2aWRlb1ByZXNlbnRhdGlvbk1vZGVDaGFuZ2VkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgY29uc3QgdmlkZW8gPSAgLyoqIEB0eXBlIHtIVE1MVmlkZW9FbGVtZW50fSAqLyAoZXZlbnQudGFyZ2V0KTtcbiAgZGlzcGF0Y2hQaWN0dXJlSW5QaWN0dXJlRXZlbnQodmlkZW8pO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdmlkZW8gaXMgcGxheWluZyBQaWN0dXJlIGluIFBpY3R1cmVcbiAqXG4gKiBAcGFyYW0ge0hUTUxWaWRlb0VsZW1lbnR9IHZpZGVvIC0gdmlkZW8gZWxlbWVudCB0byB0ZXN0XG4gKiBAcmV0dXJuIHtib29sZWFufSBcbiAqL1xuZXhwb3J0IGNvbnN0IHZpZGVvUGxheWluZ1BpY3R1cmVJblBpY3R1cmUgPSBmdW5jdGlvbih2aWRlbykge1xuICBzd2l0Y2ggKGdldEJyb3dzZXIoKSkge1xuICAgIGNhc2UgQnJvd3Nlci5TQUZBUkk6XG4gICAgICByZXR1cm4gdmlkZW8ud2Via2l0UHJlc2VudGF0aW9uTW9kZSA9PSAncGljdHVyZS1pbi1waWN0dXJlJztcbiAgICBjYXNlIEJyb3dzZXIuQ0hST01FOlxuICAgICAgcmV0dXJuIHZpZGVvLmhhc0F0dHJpYnV0ZShDSFJPTUVfUExBWUlOR19QSVBfQVRUUklCVVRFKTtcbiAgICBjYXNlIEJyb3dzZXIuVU5LTk9XTjpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG4vKipcbiAqIFNldHMgUGljdHVyZSBpbiBQaWN0dXJlIGF0dHJpYnV0ZSBhbmQgdG9nZ2xlcyBjYXB0aW9ucyBvbiBlbnRlcmluZyBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZVxuICpcbiAqIEBwYXJhbSB7IUV2ZW50fSBldmVudCAtIGFuIGVudGVycGljdHVyZWlucGljdHVyZSBldmVudFxuICovXG5jb25zdCB2aWRlb0RpZEVudGVyUGljdHVyZUluUGljdHVyZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnN0IHZpZGVvID0gLyoqIEB0eXBlIHtIVE1MVmlkZW9FbGVtZW50fSAqLyAoZXZlbnQudGFyZ2V0KTtcblxuICAvLyBTZXQgcGxheWluZyBpbiBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZSBhdHRyaWJ1dGUgYW5kIGRpc3BhdGNoIGV2ZW50XG4gIHZpZGVvLnNldEF0dHJpYnV0ZShDSFJPTUVfUExBWUlOR19QSVBfQVRUUklCVVRFLCB0cnVlKTtcbiAgZGlzcGF0Y2hQaWN0dXJlSW5QaWN0dXJlRXZlbnQodmlkZW8pO1xuXG4gIC8vIFJlbW92ZSBQaWN0dXJlIGluIFBpY3R1cmUgYXR0cmlidXRlIGFuZCBkaXNwYXRjaCBldmVudCBvbiBsZWF2aW5nIFBpY3R1cmUgaW4gUGljdHVyZSBtb2RlXG4gIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2xlYXZlcGljdHVyZWlucGljdHVyZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmlkZW8ucmVtb3ZlQXR0cmlidXRlKENIUk9NRV9QTEFZSU5HX1BJUF9BVFRSSUJVVEUpO1xuICAgIGRpc3BhdGNoUGljdHVyZUluUGljdHVyZUV2ZW50KHZpZGVvKTtcbiAgfSwgeyBvbmNlOiB0cnVlIH0pO1xufTtcblxuLyoqXG4gKiBBZGRzIFBpY3R1cmUgaW4gUGljdHVyZSBldmVudCBsaXN0ZW5lcnMgdG8gYWxsIHZpZGVvIGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRWaWRlb0VsZW1lbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbigpIHtcbiAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndmlkZW8nKTtcbiAgZm9yIChsZXQgaW5kZXggPSAwLCBlbGVtZW50OyBlbGVtZW50ID0gZWxlbWVudHNbaW5kZXhdOyBpbmRleCsrKSB7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdlbnRlcnBpY3R1cmVpbnBpY3R1cmUnLCB2aWRlb0RpZEVudGVyUGljdHVyZUluUGljdHVyZSk7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBlcnJvciB9IGZyb20gJy4vbG9nZ2VyLmpzJ1xuXG5jb25zdCBsb2NhbGl6YXRpb25zID0ge307XG5cbmxvY2FsaXphdGlvbnNbJ2J1dHRvbi10aXRsZSddID0ge1xuICAnZW4nOiAnT3BlbiBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZScsXG4gICdkZSc6ICdCaWxkLWluLUJpbGQgc3RhcnRlbicsXG4gICdubCc6ICdCZWVsZCBpbiBiZWVsZCBzdGFydGVuJyxcbiAgJ2ZyJzogJ0RcdTAwZTltYXJyZXIgSW1hZ2UgZGFucyBsXHUyMDE5aW1hZ2UnLFxufTtcblxubG9jYWxpemF0aW9uc1snZG9uYXRlJ10gPSB7XG4gICdlbic6ICdEb25hdGUnLFxuICAnZGUnOiAnU3BlbmRlbicsXG59O1xuXG5sb2NhbGl6YXRpb25zWydkb25hdGUtc21hbGwnXSA9IHtcbiAgJ2VuJzogJ1NtYWxsIGRvbmF0aW9uJyxcbn07XG5cbmxvY2FsaXphdGlvbnNbJ2RvbmF0ZS1tZWRpdW0nXSA9IHtcbiAgJ2VuJzogJ01lZGl1bSBkb25hdGlvbicsXG59O1xuXG5sb2NhbGl6YXRpb25zWydkb25hdGUtbGFyZ2UnXSA9IHtcbiAgJ2VuJzogJ0dyYW5kIGRvbmF0aW9uJyxcbn07XG5cbmxvY2FsaXphdGlvbnNbJ3RvdGFsLWRvbmF0aW9ucyddID0ge1xuICAnZW4nOiAnVG90YWwgZG9uYXRpb25zOicsXG59O1xuXG5sb2NhbGl6YXRpb25zWydkb25hdGUtZXJyb3InXSA9IHtcbiAgJ2VuJzogJ0luLWFwcCBwdXJjaGFzZSB1bmF2YWlsYWJsZScsXG59O1xuXG5sb2NhbGl6YXRpb25zWydyZXBvcnQtYnVnJ10gPSB7XG4gICdlbic6ICdSZXBvcnQgYSBidWcnLFxuICAnZGUnOiAnRWluZW4gRmVobGVyIG1lbGRlbicsXG59O1xuXG5sb2NhbGl6YXRpb25zWydvcHRpb25zJ10gPSB7XG4gICdlbic6ICdPcHRpb25zJyxcbn07XG5cbmxvY2FsaXphdGlvbnNbJ2luc3RhbGwtdGhhbmtzJ10gPSB7XG4gICdlbic6ICdUaGFua3MgZm9yIGFkZGluZyBQaVBlciEnLFxufTtcblxubG9jYWxpemF0aW9uc1snZW5hYmxlJ10gPSB7XG4gICdlbic6ICdFbmFibGUnLFxufTtcblxubG9jYWxpemF0aW9uc1snc2FmYXJpLWRpc2FibGVkLXdhcm5pbmcnXSA9IHtcbiAgJ2VuJzogJ0V4dGVuc2lvbiBpcyBjdXJyZW50bHkgZGlzYWJsZWQsIGVuYWJsZSBpbiBTYWZhcmkgcHJlZmVyZW5jZXMnLFxufTtcblxubG9jYWxpemF0aW9uc1snY2hyb21lLWZsYWdzLW9wZW4nXSA9IHtcbiAgJ2VuJzogJ09wZW4gQ2hyb21lIEZsYWdzJyxcbn07XG5cbmxvY2FsaXphdGlvbnNbJ2Nocm9tZS1mbGFncy13YXJuaW5nJ10gPSB7XG4gICdlbic6ICdCZWZvcmUgeW91IGdldCBzdGFydGVkIHlvdSBuZWVkIHRvIGVuYWJsZSB0aGUgY2hyb21lIGZsYWcgW2VtcGhhc2lzXVwiU3VyZmFjZUxheWVyIG9iamVjdHMgZm9yIHZpZGVvc1wiWy9lbXBoYXNpc10nLFxufTtcblxuLy8gU2V0IEVuZ2xpc2ggYXMgdGhlIGRlZmF1bHQgZmFsbGJhY2sgbGFuZ3VhZ2VcbmNvbnN0IGRlZmF1bHRMYW5ndWFnZSA9ICdlbic7XG5cbi8qKlxuICogUmV0dXJucyBhIGxvY2FsaXplZCB2ZXJzaW9uIG9mIHRoZSBzdHJpbmcgZGVzaWduYXRlZCBieSB0aGUgc3BlY2lmaWVkIGtleVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSB0aGUga2V5IGZvciBhIHN0cmluZyBcbiAqIEBwYXJhbSB7c3RyaW5nPX0gbGFuZ3VhZ2UgLSB0d28tbGV0dGVyIElTTyA2MzktMSBsYW5ndWFnZSBjb2RlXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBsb2NhbGl6ZWRTdHJpbmcgPSBmdW5jdGlvbihrZXksIGxhbmd1YWdlID0gbmF2aWdhdG9yLmxhbmd1YWdlLnN1YnN0cmluZygwLCAyKSkge1xuICBcbiAgLy8gR2V0IGFsbCBsb2NhbGl6YXRpb25zIGZvciBrZXlcbiAgY29uc3QgLyoqIE9iamVjdDxzdHJpbmcsc3RyaW5nPiAqLyBsb2NhbGl6YXRpb25zRm9yS2V5ID0gbG9jYWxpemF0aW9uc1trZXldO1xuICBpZiAobG9jYWxpemF0aW9uc0ZvcktleSkge1xuICAgIFxuICAgIC8vIEdldCB0aGUgdXNlcnMgc3BlY2lmaWMgbG9jYWxpemF0aW9uIG9yIGZhbGxiYWNrIHRvIGRlZmF1bHQgbGFuZ3VhZ2VcbiAgICBsZXQgc3RyaW5nID0gbG9jYWxpemF0aW9uc0ZvcktleVtsYW5ndWFnZV0gfHwgbG9jYWxpemF0aW9uc0ZvcktleVtkZWZhdWx0TGFuZ3VhZ2VdO1xuICAgIGlmIChzdHJpbmcpIHJldHVybiBzdHJpbmc7XG4gIH1cbiAgXG4gIGVycm9yKGBObyBsb2NhbGl6ZWQgc3RyaW5nIGZvdW5kIGZvciBrZXkgJyR7a2V5fSdgKTtcbiAgcmV0dXJuICcnO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGEgbG9jYWxpemVkIHZlcnNpb24gb2YgdGhlIHN0cmluZyBkZXNpZ25hdGVkIGJ5IHRoZSBzcGVjaWZpZWQga2V5IHdpdGggdGFncyByZXBsYWNlZFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSB0aGUga2V5IGZvciBhIHN0cmluZyBcbiAqIEBwYXJhbSB7QXJyYXk8QXJyYXk8c3RyaW5nPj59IHJlcGxhY2VtZW50cyAtIGFuIGFycmF5IG9mIGFycmF5cyBjb250YWluaW5nIHBhaXJzIG9mIHRhZ3MgYW5kIHRoZWlyIHJlcGxhY2VtZW50XG4gKiBAcGFyYW0ge3N0cmluZz19IGxhbmd1YWdlIC0gdHdvLWxldHRlciBJU08gNjM5LTEgbGFuZ3VhZ2UgY29kZVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgbG9jYWxpemVkU3RyaW5nV2l0aFJlcGxhY2VtZW50cyA9IGZ1bmN0aW9uKGtleSwgcmVwbGFjZW1lbnRzLCBsYW5ndWFnZSkge1xuICBcbiAgbGV0IHN0cmluZyA9IGxvY2FsaXplZFN0cmluZyhrZXksIGxhbmd1YWdlKTtcbiAgXG4gIC8vIFJlcGxhY2UgdGFncyBvZiB0aGUgZm9ybSBbWFhYXSB3aXRoIGRpcmVjdGVkIHJlcGxhY2VtZW50cyBpZiBuZWVkZWRcbiAgZm9yIChsZXQgaW5kZXggPSByZXBsYWNlbWVudHMubGVuZ3RoOyBpbmRleC0tOyApIHtcbiAgICBsZXQgcmVwbGFjZW1lbnQgPSByZXBsYWNlbWVudHNbaW5kZXhdO1xuICAgIFxuICAgIC8vIEVuc3VyZSB0YWdzIGRvIG5vdCBjb250YWluIHNwZWNpYWwgY2hhcmFjdGVycyAodGhpcyBnZXRzIG9wdGltaXNlZCBhd2F5IGFzIG9wcG9zZWQgdG8gZXNjYXBpbmcgdGhlIHRhZ3Mgd2l0aCB0aGUgYXNzb2NpYXRlZCBwZXJmb3JtYW5jZSBjb3N0KVxuICAgIGlmICgvW14tXzAtOWEtekEtWlxcL10vLnRlc3QocmVwbGFjZW1lbnRbMF0pKSB7XG4gICAgICBlcnJvcihgSW52YWxpZCBjaGFyYWN0ZXJzIHVzZWQgaW4gbG9jYWxpemVkIHN0cmluZyB0YWcgJyR7cmVwbGFjZW1lbnRbMF19J2ApO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCByZWdleCA9IG5ldyBSZWdFeHAoYFxcXFxcXFske3JlcGxhY2VtZW50WzBdfVxcXFxcXF1gLCAnZycpO1xuICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJlZ2V4LCByZXBsYWNlbWVudFsxXSk7XG4gIH1cblxuICByZXR1cm4gc3RyaW5nO1xufTtcbiIsImltcG9ydCB7IGluZm8gfSBmcm9tICcuL2xvZ2dlci5qcydcbmltcG9ydCB7IEJyb3dzZXIsIGdldEJyb3dzZXIsIGdldFJlc291cmNlIH0gZnJvbSAnLi9jb21tb24uanMnXG5pbXBvcnQgeyB2aWRlb1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlLCBhZGRQaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lciwgcmVtb3ZlUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL3ZpZGVvLmpzJ1xuXG5jb25zdCBUUkFDS19JRCA9ICdQaVBlcl90cmFjayc7XG5cbmxldCAvKiogP1RleHRUcmFjayAqLyB0cmFjayA9IG51bGw7XG5sZXQgLyoqIGJvb2xlYW4gKi8gY2FwdGlvbnNFbmFibGVkID0gZmFsc2U7XG5sZXQgLyoqIGJvb2xlYW4gKi8gc2hvd2luZ0NhcHRpb25zID0gZmFsc2U7XG5sZXQgLyoqIGJvb2xlYW4gKi8gc2hvd2luZ0VtcHR5Q2FwdGlvbiA9IGZhbHNlO1xubGV0IC8qKiBzdHJpbmcgKi8gbGFzdFVucHJvY2Vzc2VkQ2FwdGlvbiA9ICcnO1xuXG4vKipcbiAqIERpc2FibGUgY2xvc2VkIGNhcHRpb24gc3VwcG9ydCBpbiBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZVxuICovXG5leHBvcnQgY29uc3QgZGlzYWJsZUNhcHRpb25zID0gZnVuY3Rpb24oKSB7XG4gIGNhcHRpb25zRW5hYmxlZCA9IGZhbHNlO1xuICBzaG93aW5nQ2FwdGlvbnMgPSBmYWxzZTtcbiAgcHJvY2Vzc0NhcHRpb25zKCk7XG4gIHJlbW92ZVBpY3R1cmVJblBpY3R1cmVFdmVudExpc3RlbmVyKHBpY3R1cmVJblBpY3R1cmVFdmVudExpc3RlbmVyKTtcblxuICBpbmZvKCdDbG9zZWQgY2FwdGlvbiBzdXBwb3J0IGRpc2FibGVkJyk7XG59O1xuXG4vKipcbiAqIEVuYWJsZSBjbG9zZWQgY2FwdGlvbiBzdXBwb3J0IGluIFBpY3R1cmUgaW4gUGljdHVyZSBtb2RlXG4gKlxuICogQHBhcmFtIHtib29sZWFuPX0gaWdub3JlTm93UGxheWluZ0NoZWNrIC0gYXNzdW1lcyB2aWRlbyBpc24ndCBhbHJlYWR5IHBsYXlpbmcgUGljdHVyZSBpbiBQaWN0dXJlXG4gKi9cbmV4cG9ydCBjb25zdCBlbmFibGVDYXB0aW9ucyA9IGZ1bmN0aW9uKGlnbm9yZU5vd1BsYXlpbmdDaGVjaykgeyAgXG5cbiAgaWYgKCFnZXRSZXNvdXJjZSgpLmNhcHRpb25FbGVtZW50KSByZXR1cm47XG5cbiAgY2FwdGlvbnNFbmFibGVkID0gdHJ1ZTtcbiAgYWRkUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIocGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIpO1xuICBcbiAgaW5mbygnQ2xvc2VkIGNhcHRpb24gc3VwcG9ydCBlbmFibGVkJyk7XG5cbiAgaWYgKGlnbm9yZU5vd1BsYXlpbmdDaGVjaykgcmV0dXJuO1xuXG4gIGNvbnN0IHZpZGVvID0gLyoqIEB0eXBlIHs/SFRNTFZpZGVvRWxlbWVudH0gKi8gKGdldFJlc291cmNlKCkudmlkZW9FbGVtZW50KHRydWUpKTtcbiAgaWYgKCF2aWRlbykgcmV0dXJuO1xuICBzaG93aW5nQ2FwdGlvbnMgPSB2aWRlb1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlKHZpZGVvKTtcbiAgdHJhY2sgPSBnZXRDYXB0aW9uVHJhY2sodmlkZW8pO1xuICBwcm9jZXNzQ2FwdGlvbnMoKTtcbn07XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgcHJvY2Vzc2luZyBjbG9zZWQgY2FwdGlvbnMgaXMgcmVxdWlyZWRcbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgY29uc3Qgc2hvdWxkUHJvY2Vzc0NhcHRpb25zID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBjYXB0aW9uc0VuYWJsZWQgJiYgc2hvd2luZ0NhcHRpb25zO1xufTtcblxuLyoqXG4gKiBHZXRzIGNhcHRpb24gdHJhY2sgZm9yIHZpZGVvIChjcmVhdGVzIG9yIHJldHVybnMgZXhpc3RpbmcgdHJhY2sgYXMgbmVlZGVkKVxuICpcbiAqIEBwYXJhbSB7SFRNTFZpZGVvRWxlbWVudH0gdmlkZW8gLSB2aWRlbyBlbGVtZW50IHRoYXQgd2lsbCBkaXNwbGF5IGNhcHRpb25zXG4gKiBAcmV0dXJuIHtUZXh0VHJhY2t9XG4gKi9cbmNvbnN0IGdldENhcHRpb25UcmFjayA9IGZ1bmN0aW9uKHZpZGVvKSB7XG5cbiAgLy8gRmluZCBleGlzdGluZyBjYXB0aW9uIHRyYWNrXG4gIGNvbnN0IGFsbFRyYWNrcyA9IHZpZGVvLnRleHRUcmFja3M7XG4gIGZvciAobGV0IHRyYWNrSWQgPSBhbGxUcmFja3MubGVuZ3RoOyB0cmFja0lkLS07KSB7XG4gICAgaWYgKGFsbFRyYWNrc1t0cmFja0lkXS5sYWJlbCA9PT0gVFJBQ0tfSUQpIHtcbiAgICAgIGluZm8oJ0V4aXN0aW5nIGNhcHRpb24gdHJhY2sgZm91bmQnKTtcbiAgICAgIHJldHVybiBhbGxUcmFja3NbdHJhY2tJZF07XG4gICAgfVxuICB9XG5cbiAgLy8gT3RoZXJ3aXNlIGNyZWF0ZSBuZXcgY2FwdGlvbiB0cmFja1xuICBpbmZvKCdDYXB0aW9uIHRyYWNrIGNyZWF0ZWQnKTtcbiAgcmV0dXJuIHZpZGVvLmFkZFRleHRUcmFjaygnY2FwdGlvbnMnLCBUUkFDS19JRCwgJ2VuJyk7XG59O1xuXG4vKipcbiAqIEFkZHMgY2FwdGlvbiB0cmFja3MgdG8gYWxsIHZpZGVvIGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRWaWRlb0NhcHRpb25UcmFja3MgPSBmdW5jdGlvbigpIHtcbiAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgndmlkZW8nKTtcbiAgZm9yIChsZXQgaW5kZXggPSAwLCBlbGVtZW50OyBlbGVtZW50ID0gZWxlbWVudHNbaW5kZXhdOyBpbmRleCsrKSB7XG4gICAgZ2V0Q2FwdGlvblRyYWNrKC8qKiBAdHlwZSB7P0hUTUxWaWRlb0VsZW1lbnR9ICovIChlbGVtZW50KSk7XG4gIH1cbn07XG5cbi8qKlxuICogVG9nZ2xlcyBjYXB0aW9ucyB3aGVuIHZpZGVvIGVudGVycyBvciBleGl0cyBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZVxuICpcbiAqIEBwYXJhbSB7SFRNTFZpZGVvRWxlbWVudH0gdmlkZW8gLSB0YXJnZXQgdmlkZW8gZWxlbWVudFxuICogQHBhcmFtIHtib29sZWFufSBpc1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlIC0gdHJ1ZSBpZiB2aWRlbyBwbGF5aW5nIFBpY3R1cmUgaW4gUGljdHVyZVxuICovXG5jb25zdCBwaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKHZpZGVvLCBpc1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlKSB7XG4gIFxuICAvLyBUb2dnbGUgZGlzcGxheSBvZiB0aGUgY2FwdGlvbnMgYW5kIHByZXBhcmUgdmlkZW8gaWYgbmVlZGVkXG4gIHNob3dpbmdDYXB0aW9ucyA9IGlzUGxheWluZ1BpY3R1cmVJblBpY3R1cmU7XG4gIGlmIChzaG93aW5nQ2FwdGlvbnMpIHtcbiAgICB0cmFjayA9IGdldENhcHRpb25UcmFjayh2aWRlbyk7XG4gICAgdHJhY2subW9kZSA9ICdzaG93aW5nJztcbiAgfVxuICBsYXN0VW5wcm9jZXNzZWRDYXB0aW9uID0gJyc7XG4gIHByb2Nlc3NDYXB0aW9ucygpO1xuXG4gIGluZm8oYFZpZGVvIHByZXNlbnRhdGlvbiBtb2RlIGNoYW5nZWQgKHNob3dpbmdDYXB0aW9uczogJHtzaG93aW5nQ2FwdGlvbnN9KWApO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIHZpc2libGUgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUgY2FwdGlvbnNcbiAqXG4gKiBAcGFyYW0ge0hUTUxWaWRlb0VsZW1lbnR9IHZpZGVvIC0gdmlkZW8gZWxlbWVudCBzaG93aW5nIGNhcHRpb25zXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSB3b3JrYXJvdW5kIC0gYXBwbHkgU2FmYXJpIGJ1ZyB3b3JrYXJvdW5kXG4gKi9cbmNvbnN0IHJlbW92ZUNhcHRpb25zID0gZnVuY3Rpb24odmlkZW8sIHdvcmthcm91bmQgPSB0cnVlKSB7XG5cbiAgd2hpbGUgKHRyYWNrLmFjdGl2ZUN1ZXMubGVuZ3RoKSB7XG4gICAgdHJhY2sucmVtb3ZlQ3VlKHRyYWNrLmFjdGl2ZUN1ZXNbMF0pO1xuICB9XG5cbiAgLy8gV29ya2Fyb3VuZCBTYWZhcmkgYnVnOyAncmVtb3ZlQ3VlJyBkb2Vzbid0IGltbWVkaWF0ZWx5IHJlbW92ZSBjYXB0aW9ucyBzaG93biBpbiBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZVxuICBpZiAoZ2V0QnJvd3NlcigpID09IEJyb3dzZXIuU0FGQVJJICYmIHdvcmthcm91bmQgJiYgdmlkZW8gJiYgIXNob3dpbmdFbXB0eUNhcHRpb24pIHtcbiAgICB0cmFjay5hZGRDdWUobmV3IFZUVEN1ZSh2aWRlby5jdXJyZW50VGltZSwgdmlkZW8uY3VycmVudFRpbWUgKyA2MCwgJycpKTtcbiAgICBzaG93aW5nRW1wdHlDYXB0aW9uID0gdHJ1ZTtcbiAgfVxufTtcblxuLyoqXG4gKiBEaXNwbGF5cyBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZSBjYXB0aW9uXG4gKlxuICogQHBhcmFtIHtIVE1MVmlkZW9FbGVtZW50fSB2aWRlbyAtIHZpZGVvIGVsZW1lbnQgc2hvd2luZyBjYXB0aW9uc1xuICogQHBhcmFtIHtzdHJpbmd9IGNhcHRpb24gLSBhIGNhcHRpb24gdG8gZGlzcGxheVxuICovXG5jb25zdCBhZGRDYXB0aW9uID0gZnVuY3Rpb24odmlkZW8sIGNhcHRpb24pIHtcblxuICBpbmZvKGBTaG93aW5nIGNhcHRpb24gJyR7Y2FwdGlvbn0nYCk7XG4gIHRyYWNrLm1vZGUgPSAnc2hvd2luZyc7XG4gIHRyYWNrLmFkZEN1ZShuZXcgVlRUQ3VlKHZpZGVvLmN1cnJlbnRUaW1lLCB2aWRlby5jdXJyZW50VGltZSArIDYwLCBjYXB0aW9uKSk7XG5cbiAgaWYgKGdldEJyb3dzZXIoKSA9PSBCcm93c2VyLlNBRkFSSSkge1xuICAgIHNob3dpbmdFbXB0eUNhcHRpb24gPSBmYWxzZTtcbiAgfVxufTtcblxuLyoqXG4gKiBVcGRhdGVzIHZpc2libGUgY2FwdGlvbnNcbiAqL1xuZXhwb3J0IGNvbnN0IHByb2Nlc3NDYXB0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXG4gIC8vIEdldCBoYW5kbGVzIHRvIGNhcHRpb24gYW5kIHZpZGVvIGVsZW1lbnRzXG4gIGNvbnN0IGNhcHRpb25FbGVtZW50ID0gZ2V0UmVzb3VyY2UoKS5jYXB0aW9uRWxlbWVudCgpO1xuICBjb25zdCB2aWRlbyA9IC8qKiBAdHlwZSB7P0hUTUxWaWRlb0VsZW1lbnR9ICovIChnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCgpKTtcbiAgXG4gIC8vIFJlbW92ZSBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZSBjYXB0aW9ucyBhbmQgc2hvdyBuYXRpdmUgY2FwdGlvbnMgaWYgbm8gbG9uZ2VyIHNob3dpbmcgY2FwdGlvbnMgb3IgZW5jb3VudGVyZWQgYW4gZXJyb3JcbiAgaWYgKCFzaG93aW5nQ2FwdGlvbnMgfHwgIWNhcHRpb25FbGVtZW50KSB7XG4gICAgcmVtb3ZlQ2FwdGlvbnModmlkZW8pO1xuICAgIGlmIChjYXB0aW9uRWxlbWVudCkgY2FwdGlvbkVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIE90aGVyd2lzZSBlbnN1cmUgbmF0aXZlIGNhcHRpb25zIHJlbWFpbiBoaWRkZW5cbiAgY2FwdGlvbkVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuXG4gIC8vIENoZWNrIGlmIGEgbmV3IG5hdGl2ZSBjYXB0aW9uIG5lZWRzIHRvIGJlIHByb2Nlc3NlZFxuICBjb25zdCB1bnByb2Nlc3NlZENhcHRpb24gPSBjYXB0aW9uRWxlbWVudC50ZXh0Q29udGVudDtcbiAgaWYgKHVucHJvY2Vzc2VkQ2FwdGlvbiA9PSBsYXN0VW5wcm9jZXNzZWRDYXB0aW9uKSByZXR1cm47XG4gIGxhc3RVbnByb2Nlc3NlZENhcHRpb24gPSB1bnByb2Nlc3NlZENhcHRpb247XG4gIFxuICAvLyBSZW1vdmUgb2xkIGNhcHRpb25zIGFuZCBhcHBseSBTYWZhcmkgYnVnIGZpeCBpZiBjYXB0aW9uIGhhcyBubyBjb250ZW50IGFzIG90aGVyd2lzZSBjYXVzZXMgZmxpY2tlclxuICByZW1vdmVDYXB0aW9ucyh2aWRlbywgIXVucHJvY2Vzc2VkQ2FwdGlvbik7XG5cbiAgLy8gUGVyZm9ybWFuY2Ugb3B0aW1pc2F0aW9uIC0gZWFybHkgZXhpdCBpZiBjYXB0aW9uIGhhcyBubyBjb250ZW50XG4gIGlmICghdW5wcm9jZXNzZWRDYXB0aW9uKSByZXR1cm47XG5cbiAgLy8gU2hvdyBjb3JyZWN0bHkgc3BhY2VkIGFuZCBmb3JtYXR0ZWQgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUgY2FwdGlvblxuICBsZXQgY2FwdGlvbiA9ICcnO1xuICBjb25zdCB3YWxrID0gZG9jdW1lbnQuY3JlYXRlVHJlZVdhbGtlcihjYXB0aW9uRWxlbWVudCwgTm9kZUZpbHRlci5TSE9XX1RFWFQsIG51bGwsIGZhbHNlKTtcbiAgd2hpbGUgKHdhbGsubmV4dE5vZGUoKSkge1xuICAgIGNvbnN0IHNlZ21lbnQgPSB3YWxrLmN1cnJlbnROb2RlLm5vZGVWYWx1ZS50cmltKCk7XG4gICAgaWYgKHNlZ21lbnQpIHtcbiAgICAgIGNvbnN0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUod2Fsay5jdXJyZW50Tm9kZS5wYXJlbnRFbGVtZW50KTtcbiAgICAgIGlmIChzdHlsZS5mb250U3R5bGUgPT0gJ2l0YWxpYycpIHtcbiAgICAgICAgY2FwdGlvbiArPSBgPGk+JHtzZWdtZW50fTwvaT5gO1xuICAgICAgfSBlbHNlIGlmIChzdHlsZS50ZXh0RGVjb3JhdGlvbiA9PSAndW5kZXJsaW5lJykge1xuICAgICAgICBjYXB0aW9uICs9IGA8dT4ke3NlZ21lbnR9PC91PmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYXB0aW9uICs9IHNlZ21lbnQ7XG4gICAgICB9XG4gICAgICBjYXB0aW9uICs9ICcgJztcbiAgICB9IGVsc2UgaWYgKGNhcHRpb24uY2hhckF0KGNhcHRpb24ubGVuZ3RoIC0gMSkgIT0gJ1xcbicpIHtcbiAgICAgIGNhcHRpb24gKz0gJ1xcbic7XG4gICAgfVxuICB9XG4gIGNhcHRpb24gPSBjYXB0aW9uLnRyaW0oKTtcbiAgYWRkQ2FwdGlvbih2aWRlbywgY2FwdGlvbik7XG59OyIsImltcG9ydCB7IGluZm8sIGVycm9yIH0gZnJvbSAnLi9sb2dnZXIuanMnXG5pbXBvcnQgeyBnZXRSZXNvdXJjZSwgZ2V0RXh0ZW5zaW9uVVJMIH0gZnJvbSAnLi9jb21tb24uanMnXG5pbXBvcnQgeyB0b2dnbGVQaWN0dXJlSW5QaWN0dXJlLCBhZGRQaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lciB9IGZyb20gJy4vdmlkZW8uanMnXG5pbXBvcnQgeyBsb2NhbGl6ZWRTdHJpbmcgfSBmcm9tICcuL2xvY2FsaXphdGlvbi5qcydcblxuY29uc3QgQlVUVE9OX0lEID0gJ1BpUGVyX2J1dHRvbic7XG5cbmxldCAvKiogP0hUTUxFbGVtZW50ICovIGJ1dHRvbiA9IG51bGw7XG5cbi8qKlxuICogSW5qZWN0cyBQaWN0dXJlIGluIFBpY3R1cmUgYnV0dG9uIGludG8gd2VicGFnZVxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gcGFyZW50IC0gRWxlbWVudCBidXR0b24gd2lsbCBiZSBpbnNlcnRlZCBpbnRvXG4gKi9cbmV4cG9ydCBjb25zdCBhZGRCdXR0b24gPSBmdW5jdGlvbihwYXJlbnQpIHtcblxuICAvLyBDcmVhdGUgYnV0dG9uIGlmIG5lZWRlZFxuICBpZiAoIWJ1dHRvbikge1xuICAgIGNvbnN0IGJ1dHRvbkVsZW1lbnRUeXBlID0gZ2V0UmVzb3VyY2UoKS5idXR0b25FbGVtZW50VHlwZSB8fCAnYnV0dG9uJztcbiAgICBidXR0b24gPSAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqLyAoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChidXR0b25FbGVtZW50VHlwZSkpO1xuXG4gICAgLy8gU2V0IGJ1dHRvbiBwcm9wZXJ0aWVzXG4gICAgYnV0dG9uLmlkID0gQlVUVE9OX0lEO1xuICAgIGJ1dHRvbi50aXRsZSA9IGxvY2FsaXplZFN0cmluZygnYnV0dG9uLXRpdGxlJyk7XG4gICAgY29uc3QgYnV0dG9uU3R5bGUgPSBnZXRSZXNvdXJjZSgpLmJ1dHRvblN0eWxlO1xuICAgIGlmIChidXR0b25TdHlsZSkgYnV0dG9uLnN0eWxlLmNzc1RleHQgPSBidXR0b25TdHlsZTtcbiAgICBjb25zdCBidXR0b25DbGFzc05hbWUgPSBnZXRSZXNvdXJjZSgpLmJ1dHRvbkNsYXNzTmFtZTtcbiAgICBpZiAoYnV0dG9uQ2xhc3NOYW1lKSBidXR0b24uY2xhc3NOYW1lID0gYnV0dG9uQ2xhc3NOYW1lO1xuXG4gICAgLy8gQWRkIHNjYWxlZCBpbWFnZSB0byBidXR0b25cbiAgICBjb25zdCBpbWFnZSA9IC8qKiBAdHlwZSB7SFRNTEltYWdlRWxlbWVudH0gKi8gKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpKTtcbiAgICBpbWFnZS5zdHlsZS53aWR0aCA9IGltYWdlLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICBjb25zdCBidXR0b25TY2FsZSA9IGdldFJlc291cmNlKCkuYnV0dG9uU2NhbGU7XG4gICAgaWYgKGJ1dHRvblNjYWxlKSBpbWFnZS5zdHlsZS50cmFuc2Zvcm0gPSBgc2NhbGUoJHtidXR0b25TY2FsZX0pYDtcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQoaW1hZ2UpO1xuXG4gICAgLy8gU2V0IGltYWdlIHBhdGhzXG4gICAgbGV0IGJ1dHRvbkltYWdlID0gZ2V0UmVzb3VyY2UoKS5idXR0b25JbWFnZTtcbiAgICBsZXQgYnV0dG9uRXhpdEltYWdlID0gZ2V0UmVzb3VyY2UoKS5idXR0b25FeGl0SW1hZ2U7XG4gICAgaWYgKCFidXR0b25JbWFnZSkge1xuICAgICAgYnV0dG9uSW1hZ2UgPSAnZGVmYXVsdCc7XG4gICAgICBidXR0b25FeGl0SW1hZ2UgPSAnZGVmYXVsdC1leGl0JztcbiAgICB9XG4gICAgY29uc3QgYnV0dG9uSW1hZ2VVUkwgPSBnZXRFeHRlbnNpb25VUkwoYGltYWdlcy8ke2J1dHRvbkltYWdlfS5zdmdgKTtcbiAgICBpbWFnZS5zcmMgPSBidXR0b25JbWFnZVVSTDtcbiAgICBpZiAoYnV0dG9uRXhpdEltYWdlKSB7XG4gICAgICBjb25zdCBidXR0b25FeGl0SW1hZ2VVUkwgPSBnZXRFeHRlbnNpb25VUkwoYGltYWdlcy8ke2J1dHRvbkV4aXRJbWFnZX0uc3ZnYCk7XG4gICAgICBhZGRQaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lcihmdW5jdGlvbih2aWRlbywgaXNQbGF5aW5nUGljdHVyZUluUGljdHVyZSkge1xuICAgICAgICBpbWFnZS5zcmMgPSAoaXNQbGF5aW5nUGljdHVyZUluUGljdHVyZSkgPyBidXR0b25FeGl0SW1hZ2VVUkwgOiBidXR0b25JbWFnZVVSTDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIEFkZCBob3ZlciBzdHlsZSB0byBidXR0b24gKGEgbmVzdGVkIHN0eWxlc2hlZXQgaXMgdXNlZCB0byBhdm9pZCB0cmFja2luZyBhbm90aGVyIGVsZW1lbnQpXG4gICAgY29uc3QgYnV0dG9uSG92ZXJTdHlsZSA9IGdldFJlc291cmNlKCkuYnV0dG9uSG92ZXJTdHlsZTtcbiAgICBpZiAoYnV0dG9uSG92ZXJTdHlsZSkge1xuICAgICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgICAgY29uc3QgY3NzID0gYCMke0JVVFRPTl9JRH06aG92ZXJ7JHtidXR0b25Ib3ZlclN0eWxlfX1gO1xuICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gICAgICBidXR0b24uYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cblxuICAgIC8vIFRvZ2dsZSBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZSB3aGVuIGJ1dHRvbiBpcyBjbGlja2VkXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIC8vIEdldCB0aGUgdmlkZW8gZWxlbWVudCBhbmQgYnlwYXNzIGNhY2hpbmcgdG8gYWNjb21vZGF0ZSBmb3IgdGhlIHVuZGVybHlpbmcgdmlkZW8gY2hhbmdpbmcgKGUuZy4gcHJlLXJvbGwgYWR2ZXJ0cykgXG4gICAgICBjb25zdCB2aWRlbyA9IC8qKiBAdHlwZSB7P0hUTUxWaWRlb0VsZW1lbnR9ICovIChnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCh0cnVlKSk7XG4gICAgICBpZiAoIXZpZGVvKSB7XG4gICAgICAgIGVycm9yKCdVbmFibGUgdG8gZmluZCB2aWRlbycpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRvZ2dsZVBpY3R1cmVJblBpY3R1cmUodmlkZW8pO1xuICAgIH0pO1xuXG4gICAgaW5mbygnUGljdHVyZSBpbiBQaWN0dXJlIGJ1dHRvbiBjcmVhdGVkJyk7XG4gIH1cblxuICAvLyBJbmplY3QgYnV0dG9uIGludG8gY29ycmVjdCBwbGFjZVxuICBjb25zdCByZWZlcmVuY2VOb2RlID0gZ2V0UmVzb3VyY2UoKS5idXR0b25JbnNlcnRCZWZvcmUgPyBnZXRSZXNvdXJjZSgpLmJ1dHRvbkluc2VydEJlZm9yZShwYXJlbnQpIDogbnVsbDtcbiAgcGFyZW50Lmluc2VydEJlZm9yZShidXR0b24sIHJlZmVyZW5jZU5vZGUpO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBQaWN0dXJlIGluIFBpY3R1cmUgYnV0dG9uIGVsZW1lbnRcbiAqXG4gKiBAcmV0dXJuIHs/SFRNTEVsZW1lbnR9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIGJ1dHRvbjtcbn07XG5cbi8qKlxuICogQ2hlY2tzIGlmIFBpY3R1cmUgaW4gUGljdHVyZSBidXR0b24gaXMgaW5qZWN0ZWQgaW50byBwYWdlXG4gKlxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IGNoZWNrQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAhIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKEJVVFRPTl9JRCk7XG59O1xuIiwiaW1wb3J0IHsgQnJvd3NlciwgZ2V0QnJvd3NlciwgZ2V0UmVzb3VyY2UsIGJ5cGFzc0JhY2tncm91bmRUaW1lclRocm90dGxpbmcgfSBmcm9tICcuLy4uL2NvbW1vbi5qcydcbmltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuaW1wb3J0IHsgZW5hYmxlQ2FwdGlvbnMsIGRpc2FibGVDYXB0aW9ucywgc2hvdWxkUHJvY2Vzc0NhcHRpb25zIH0gZnJvbSAnLi8uLi9jYXB0aW9ucy5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9IFsneW91dHViZScsICd5b3V0dSddO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3l0cC1idXR0b24nLFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGJ1dHRvbiA9IGdldEJ1dHRvbigpO1xuICAgIGNvbnN0IG5laWdoYm91ckJ1dHRvbiA9IC8qKiBAdHlwZSB7P0hUTUxFbGVtZW50fSAqLyAoYnV0dG9uLm5leHRTaWJsaW5nKTtcbiAgICBjb25zdCAvKiogc3RyaW5nICovIHRpdGxlID0gYnV0dG9uLnRpdGxlO1xuICAgIGNvbnN0IC8qKiBzdHJpbmcgKi8gbmVpZ2hib3VyVGl0bGUgPSBuZWlnaGJvdXJCdXR0b24udGl0bGU7XG4gICAgYnV0dG9uLnRpdGxlID0gJyc7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgbmVpZ2hib3VyQnV0dG9uLnRpdGxlID0gdGl0bGU7XG4gICAgICBuZWlnaGJvdXJCdXR0b24uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ21vdXNlb3ZlcicpKTtcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIG5laWdoYm91ckJ1dHRvbi5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudCgnbW91c2VvdXQnKSk7XG4gICAgICBuZWlnaGJvdXJCdXR0b24udGl0bGUgPSBuZWlnaGJvdXJUaXRsZTtcbiAgICB9KTtcbiAgICBieXBhc3NCYWNrZ3JvdW5kVGltZXJUaHJvdHRsaW5nKCk7XG5cbiAgICAvLyBXb3JrYXJvdW5kIFNhZmFyaSBidWc7IG9sZCBjYXB0aW9ucyBwZXJzaXN0IGluIFBpY3R1cmUgaW4gUGljdHVyZSBtb2RlIHdoZW4gTWVkaWFTb3VyY2UgYnVmZmVycyBjaGFuZ2VcbiAgICBpZiAoZ2V0QnJvd3NlcigpID09IEJyb3dzZXIuU0FGQVJJKSB7XG4gICAgICBjb25zdCB2aWRlbyA9IC8qKiBAdHlwZSB7P0hUTUxWaWRlb0VsZW1lbnR9ICovIChnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCgpKTtcbiAgICAgIGxldCBjYXB0aW9uc1Zpc2libGUgPSBmYWxzZTtcbiAgICAgIGNvbnN0IG5hdmlnYXRlU3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY2FwdGlvbnNWaXNpYmxlID0gc2hvdWxkUHJvY2Vzc0NhcHRpb25zKCk7XG4gICAgICAgIGlmIChjYXB0aW9uc1Zpc2libGUpIGRpc2FibGVDYXB0aW9ucygpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IG5hdmlnYXRlRmluaXNoID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChjYXB0aW9uc1Zpc2libGUpIGVuYWJsZUNhcHRpb25zKCk7XG4gICAgICB9O1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3NwZnJlcXVlc3QnLCBuYXZpZ2F0ZVN0YXJ0KTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzcGZkb25lJywgbmF2aWdhdGVGaW5pc2gpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3l0LW5hdmlnYXRlLXN0YXJ0JywgbmF2aWdhdGVTdGFydCk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigneXQtbmF2aWdhdGUtZmluaXNoJywgbmF2aWdhdGVGaW5pc2gpO1xuICAgIH1cbiAgfSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnl0cC1yaWdodC1jb250cm9scycpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC42OCxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2FwdGlvbi13aW5kb3cnKTtcbiAgfSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW8uaHRtbDUtbWFpbi12aWRlbycpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRSZXNvdXJjZSB9IGZyb20gJy4vLi4vY29tbW9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ3llbG9wbGF5JztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdidXR0b24nLFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHBhcmVudCA9IGdldFJlc291cmNlKCkuYnV0dG9uUGFyZW50KCk7XG4gICAgcGFyZW50LnN0eWxlLndpZHRoID0gJzIxMHB4JztcbiAgfSxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYG9wYWNpdHk6IDEgIWltcG9ydGFudGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgncGxheWVyLWZ1bGxzY3JlZW4tYnV0dG9uJylbMF07XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2J1dHRvbnMnKVswXTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuOCxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBtYXJnaW4tYm90dG9tOiAtMTBweDtcbiAgICBtYXJnaW4tbGVmdDogMTBweDtcbiAgICB3aWR0aDogNTBweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgb3BhY2l0eTogMC44O1xuICAgIGhlaWdodDogNDBweCAhaW1wb3J0YW50O1xuICAgIG1hcmdpbi1ib3R0b206IDBweCAhaW1wb3J0YW50O1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW9bc3JjXScpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRSZXNvdXJjZSwgYnlwYXNzQmFja2dyb3VuZFRpbWVyVGhyb3R0bGluZyB9IGZyb20gJy4vLi4vY29tbW9uLmpzJ1xuaW1wb3J0IHsgZ2V0QnV0dG9uIH0gZnJvbSAnLi8uLi9idXR0b24uanMnXG5pbXBvcnQgeyB2aWRlb1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlLCB0b2dnbGVQaWN0dXJlSW5QaWN0dXJlIH0gZnJvbSAnLi8uLi92aWRlby5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICd2cnYnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3Zqcy1jb250cm9sIHZqcy1idXR0b24nLFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG5laWdoYm91ckJ1dHRvbiA9IGdldEJ1dHRvbigpLm5leHRTaWJsaW5nO1xuICAgIG5laWdoYm91ckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdmlkZW8gPSAvKiogQHR5cGUgez9IVE1MVmlkZW9FbGVtZW50fSAqLyAoZ2V0UmVzb3VyY2UoKS52aWRlb0VsZW1lbnQoKSk7XG4gICAgICBpZiAodmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSh2aWRlbykpIHRvZ2dsZVBpY3R1cmVJblBpY3R1cmUodmlkZW8pO1xuICAgIH0pO1xuICAgIGJ5cGFzc0JhY2tncm91bmRUaW1lclRocm90dGxpbmcoKTtcbiAgfSxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYG9wYWNpdHk6IDEgIWltcG9ydGFudGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmpzLWNvbnRyb2wtYmFyJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjYsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAxMTRweDtcbiAgICB3aWR0aDogNTBweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgb3BhY2l0eTogMC42O1xuICBgKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGliamFzcy1zdWJzJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXJfaHRtbDVfYXBpJyk7XG4gIH0sXG59O1xuIiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICd2cnQnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3Z1cGxheS1jb250cm9sJyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndnVwbGF5LWNvbnRyb2wtcmlnaHQnKVswXTtcbiAgfSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGhlb3BsYXllci10ZXh0dHJhY2tzJyk7XG4gIH0sXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgd2lkdGg6IDMwcHg7XG4gICAgaGVpZ2h0OiA0N3B4O1xuICAgIHBhZGRpbmc6IDA7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHRvcDogLTlweDtcbiAgICByaWdodDogOHB4O1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW9bcHJlbG9hZD1cIm1ldGFkYXRhXCJdJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAndmsnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3ZpZGVvcGxheWVyX2J0bicsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LnZpZGVvcGxheWVyX2J0bl9mdWxsc2NyZWVuJyk7XG4gIH0sXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgd2lkdGg6IDI0cHg7XG4gICAgaGVpZ2h0OiA0NXB4O1xuICAgIHBhZGRpbmc6IDAgOHB4O1xuICBgKSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2LnZpZGVvcGxheWVyX2NvbnRyb2xzJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvLnZpZGVvcGxheWVyX21lZGlhX3Byb3ZpZGVyJyk7XG4gIH0sXG59OyIsImltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gWyd2aWpmJywgJ3ZpZXInLCAnemVzJ107XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAndmpzLWNvbnRyb2wgdmpzLWJ1dHRvbicsXG4gIGJ1dHRvbkRpZEFwcGVhcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gTW92ZSBmdWxsc2NyZWVuIGJ1dHRvbiB0byB0aGUgcmlnaHQgc28gdGhlIHBpcCBidXR0b24gYXBwZWFycyBsZWZ0IG9mIGl0XG4gICAgY29uc3QgZnVsbFNjcmVlbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Zqcy1mdWxsc2NyZWVuLWNvbnRyb2wnKVswXTtcbiAgICBmdWxsU2NyZWVuQnV0dG9uLnN0eWxlLm9yZGVyID0gMTA7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Zqcy1jb250cm9sLWJhcicpWzBdO1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHRleHQtaW5kZW50OiAwISBpbXBvcnRhbnQ7XG4gICAgbWFyZ2luLWxlZnQ6IDEwcHg7XG4gICAgb3JkZXI6IDk7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlb1twcmVsb2FkPVwibWV0YWRhdGFcIl0nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICd2aWQnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52anMtY29udHJvbC1iYXInKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuNyxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgdG9wOiAtMnB4O1xuICAgIGxlZnQ6IDlweDtcbiAgICBwYWRkaW5nOiAwcHg7XG4gICAgbWFyZ2luOiAwcHg7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW9fcGxheWVyX2h0bWw1X2FwaScpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ3ZpY2UnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3ZwX19jb250cm9sc19faWNvbl9fcG9wdXBfX2NvbnRhaW5lcicsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZwX19jb250cm9sc19faWNvbnMnKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuNixcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGB0b3A6IC0xMXB4YCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvLmp3LXZpZGVvJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAndmV2byc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAncGxheWVyLWNvbnRyb2wnLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udHJvbC1iYXIgLnJpZ2h0LWNvbnRyb2xzJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjcsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgYm9yZGVyOiAwcHg7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaHRtbDUtcGxheWVyJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAndXN0cmVhbSc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnY29tcG9uZW50IHNob3duJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgb3BhY2l0eTogMSAhaW1wb3J0YW50O1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3coMHB4IDBweCA1cHggcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjUpKTtcbiAgYCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjgsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgb3BhY2l0eTogMC43O1xuICBgKSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NvbnRyb2xQYW5lbFJpZ2h0Jyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNWaWV3ZXJDb250YWluZXIgdmlkZW8nKTtcbiAgfSxcbn07IiwiaW1wb3J0IHsgZ2V0QnV0dG9uIH0gZnJvbSAnLi8uLi9idXR0b24uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAndWRlbXknO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2J0bicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uW2FyaWEtbGFiZWw9XCJGdWxsc2NyZWVuXCJdJyk7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdltjbGFzc149XCJjb250cm9sLWJhci0tY29udHJvbC1iYXItLVwiXScpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC44LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHdpZHRoOiAzZW07XG4gICAgaGVpZ2h0OiAzZW07XG4gICAgcGFkZGluZzogMDtcbiAgICBvcGFjaXR5OiAwLjg7XG4gIGApLFxuICBjYXB0aW9uRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdltjbGFzc149XCJjYXB0aW9ucy1kaXNwbGF5LS1jYXB0aW9ucy1jb250YWluZXJcIl0nKTtcbiAgfSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW8udmpzLXRlY2gnKTtcbiAgfSxcbn07IiwiaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tICcuLy4uL2NvbW1vbi5qcydcbmltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuaW1wb3J0IHsgdmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSwgdG9nZ2xlUGljdHVyZUluUGljdHVyZSB9IGZyb20gJy4vLi4vdmlkZW8uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAndHdpdGNoJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd0dy1ib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzLW1lZGl1bSB0dy1ib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLXRvcC1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJ1dHRvbi1pY29uIHR3LWJ1dHRvbi1pY29uLS1vdmVybGF5IHR3LWNvcmUtYnV0dG9uIHR3LWNvcmUtYnV0dG9uLS1vdmVybGF5IHR3LWlubGluZS1mbGV4IHR3LXJlbGF0aXZlIHR3LXRvb2x0aXAtd3JhcHBlcicsXG4gIGJ1dHRvbkRpZEFwcGVhcjogZnVuY3Rpb24oKSB7XG4gICAgLy8gQWRkIHRvb2x0aXBcbiAgICBjb25zdCBidXR0b24gPSBnZXRCdXR0b24oKTtcbiAgICBjb25zdCB0aXRsZSA9IGJ1dHRvbi50aXRsZTtcbiAgICBidXR0b24udGl0bGUgPSAnJztcbiAgICBjb25zdCB0b29sdGlwID0gLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi8gKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICd0dy10b29sdGlwIHR3LXRvb2x0aXAtLWFsaWduLXJpZ2h0IHR3LXRvb2x0aXAtLXVwJztcbiAgICB0b29sdGlwLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRpdGxlKSk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHRvb2x0aXApO1xuICAgIFxuICAgIC8vIEZpeCBpc3N1ZXMgd2l0aCBmdWxsc2NyZWVuIHdoZW4gYWN0aXZhdGVkIHdoaWxlIHZpZGVvIHBsYXlpbmcgUGljdHVyZS1pbi1QaWN0dXJlXG4gICAgY29uc3QgZnVsbHNjcmVlbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1hLXRhcmdldD0ncGxheWVyLWZ1bGxzY3JlZW4tYnV0dG9uJ11cIik7XG4gICAgaWYgKCFmdWxsc2NyZWVuQnV0dG9uKSByZXR1cm47XG4gICAgZnVsbHNjcmVlbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdmlkZW8gPSAvKiogQHR5cGUgez9IVE1MVmlkZW9FbGVtZW50fSAqLyAoZ2V0UmVzb3VyY2UoKS52aWRlb0VsZW1lbnQoKSk7XG4gICAgICBpZiAodmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSh2aWRlbykpIHRvZ2dsZVBpY3R1cmVJblBpY3R1cmUodmlkZW8pO1xuICAgIH0pO1xuICB9LFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWNvbnRyb2xzX19yaWdodC1jb250cm9sLWdyb3VwLC5wbGF5ZXItYnV0dG9ucy1yaWdodCcpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC44LFxuICBjYXB0aW9uRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY2FwdGlvbnMtY29udGFpbmVyJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvW3NyY10nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICd0aGVvbmlvbic7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnanctaWNvbiBqdy1pY29uLWlubGluZSBqdy1idXR0b24tY29sb3IganctcmVzZXQganctaWNvbi1sb2dvJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanctY29udHJvbGJhci1yaWdodC1ncm91cCcpO1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHRvcDogLTJweDtcbiAgICBsZWZ0OiAxMHB4O1xuICAgIHdpZHRoOiAzOHB4O1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW8uanctdmlkZW8nKTtcbiAgfSxcbn07IiwiaW1wb3J0IHsgZ2V0QnV0dG9uIH0gZnJvbSAnLi8uLi9idXR0b24uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAndGVkJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd6LWk6MCBwb3M6ciBib3R0b206MCBob3Zlci9iZzp3aGl0ZS43IGItcjouMSBwOjEgY3VyOnAnLFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcGxheUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1thcmlhLWNvbnRyb2xzPVwidmlkZW8xXCJdJyk7XG4gICAgcmV0dXJuIHBsYXlCdXR0b24ucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICB9LFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGltZyA9IGdldEJ1dHRvbigpLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xuICAgIGltZy5jbGFzc0xpc3QuYWRkKCd3OjInKTtcbiAgICBpbWcuY2xhc3NMaXN0LmFkZCgnaDoyJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvW2lkXj1cInRlZC1wbGF5ZXItXCJdJyk7XG4gIH1cbn07IiwiaW1wb3J0IHsgZ2V0QnV0dG9uIH0gZnJvbSAnLi8uLi9idXR0b24uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAnc3RyZWFtYWJsZSc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uRGlkQXBwZWFyOiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwbGF5ZXItcHJvZ3Jlc3MnKTtcbiAgICBjb25zdCBwcm9ncmVzc0JhclN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUocHJvZ3Jlc3NCYXIpO1xuICAgIGdldEJ1dHRvbigpLnN0eWxlLnJpZ2h0ID0gcHJvZ3Jlc3NCYXJTdHlsZS5yaWdodDtcbiAgICBwcm9ncmVzc0Jhci5zdHlsZS5yaWdodCA9IChwYXJzZUludChwcm9ncmVzc0JhclN0eWxlLnJpZ2h0LCAxMCkgKyA0MCkgKyAncHgnO1xuICB9LFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1jb250cm9scy1yaWdodCcpO1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBib3R0b206IDEwcHg7XG4gICAgaGVpZ2h0OiAyNnB4O1xuICAgIHdpZHRoOiAyNnB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBvcGFjaXR5OiAwLjk7XG4gICAgZmlsdGVyOiBkcm9wLXNoYWRvdyhyZ2JhKDAsIDAsIDAsIDAuNSkgMHB4IDBweCAycHgpO1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvLXBsYXllci10YWcnKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9IFsnc2V6bmFtJywgJ3N0cmVhbSddO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3N6bnAtdWktd2lkZ2V0LWJveCcsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYHRyYW5zZm9ybTogc2NhbGUoMS4wNSlgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN6bnAtdWktY3RybC1wYW5lbC1sYXlvdXQtd3JhcHBlcicpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC43NSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBjdXJzb3I6IHBvaW50ZXJgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnN6bnAtdWktdGVjaC12aWRlby13cmFwcGVyIHZpZGVvJyk7XG4gIH0sXG59OyIsImltcG9ydCB7IGJ5cGFzc0JhY2tncm91bmRUaW1lclRocm90dGxpbmcgfSBmcm9tICcuLy4uL2NvbW1vbi5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdwbGV4JztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGJ5cGFzc0JhY2tncm91bmRUaW1lclRocm90dGxpbmcoKTtcbiAgfSxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYG9wYWNpdHk6IDEgIWltcG9ydGFudGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbY2xhc3NePVwiRnVsbFBsYXllclRvcENvbnRyb2xzLXRvcENvbnRyb2xzXCJdJyk7XG4gICAgcmV0dXJuIC8qKiBAdHlwZSB7P0VsZW1lbnR9ICovIChlICYmIGUubGFzdENoaWxkKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDIsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHRvcDogLTNweDtcbiAgICB3aWR0aDogMzBweDtcbiAgICBwYWRkaW5nOiAxMHB4O1xuICAgIGJvcmRlcjogMHB4O1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIG9wYWNpdHk6IDAuNztcbiAgICBvdXRsaW5lOiAwO1xuICAgIHRleHQtc2hhZG93OiAwcHggMHB4IDRweCByZ2JhKDAsIDAsIDAsIDAuNDUpO1xuICBgKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubGliamFzcy1zdWJzJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvW2NsYXNzXj1cIkhUTUxNZWRpYS1tZWRpYUVsZW1lbnRcIl0nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9IFsncGVyaXNjb3BlJywgJ3BzY3AnXTtcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdQaWxsIFBpbGwtLXdpdGhJY29uJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdzcGFuJyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIG9wYWNpdHk6IDAuOCAhaW1wb3J0YW50O1xuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygxMjUlKSAhaW1wb3J0YW50O1xuICBgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5TaGFyZUJyb2FkY2FzdCcpLm5leHRTaWJsaW5nO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuVmlkZW9PdmVybGF5UmVkZXNpZ24tQm90dG9tQmFyLVJpZ2h0Jyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjYsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgb3BhY2l0eTogMC41O1xuICAgIGZpbHRlcjogYnJpZ2h0bmVzcygyMDAlKTtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5WaWRlbyB2aWRlbycpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRSZXNvdXJjZSB9IGZyb20gJy4vLi4vY29tbW9uLmpzJ1xuaW1wb3J0IHsgdmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSwgdG9nZ2xlUGljdHVyZUluUGljdHVyZSB9IGZyb20gJy4vLi4vdmlkZW8uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAncGJzJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdqdy1pY29uIGp3LWljb24taW5saW5lIGp3LWJ1dHRvbi1jb2xvciBqdy1yZXNldCcsXG4gIGJ1dHRvbkRpZEFwcGVhcjogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZnVsbHNjcmVlbkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qdy1pY29uLWZ1bGxzY3JlZW4nKTtcbiAgICBmdWxsc2NyZWVuQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB2aWRlbyA9IC8qKiBAdHlwZSB7P0hUTUxWaWRlb0VsZW1lbnR9ICovIChnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCgpKTtcbiAgICAgIGlmICh2aWRlb1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlKHZpZGVvKSkgdG9nZ2xlUGljdHVyZUluUGljdHVyZSh2aWRlbyk7XG4gICAgfSk7XG4gIH0sXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYG9wYWNpdHk6IDEgIWltcG9ydGFudGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanctYnV0dG9uLWNvbnRhaW5lcicpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC42LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYG9wYWNpdHk6IDAuOGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanctdmlkZW8nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9IFsnb3BlbmxvYWQnLCAnb2xvYWQnXTtcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd2anMtY29udHJvbCB2anMtYnV0dG9uJyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZqcy1jb250cm9sLWJhcicpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC42LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIGxlZnQ6IDVweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnb2x2aWRlb19odG1sNV9hcGknKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdvY3MnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2Zvb3Rlci1lbHQgZmx0cicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcjdG9nZ2xlUGxheScpO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZm9vdGVyLWJsb2NrOmxhc3QtY2hpbGQnKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDEuMixcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICB3aWR0aDogMjVweDtcbiAgICBoZWlnaHQ6IDE4cHg7XG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICAgIG1hcmdpbi1ib3R0b206IC0xMHB4O1xuICAgIHBhZGRpbmc6IDBweDtcbiAgICBib3JkZXI6IDBweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdMZ3lWaWRlb1BsYXllcicpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRSZXNvdXJjZSB9IGZyb20gJy4vLi4vY29tbW9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ25ldGZsaXgnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3RvdWNoYWJsZSBQbGF5ZXJDb250cm9scy0tY29udHJvbC1lbGVtZW50IG5mcC1idXR0b24tY29udHJvbCBkZWZhdWx0LWNvbnRyb2wtYnV0dG9uJyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYHRyYW5zZm9ybTogc2NhbGUoMS4yKTtgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICAvLyByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdWlhPVwiY29udHJvbHMtc3RhbmRhcmRcIl0nKTsgXG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdltzdHlsZT1cImFsaWduLWl0ZW1zOiBub3JtYWw7IGp1c3RpZnktY29udGVudDogbm9ybWFsO1wiXSA+IFtzdHlsZT1cImFsaWduLWl0ZW1zOiBub3JtYWw7IGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XCJdJyk7IFxuICB9LFxuICBidXR0b25TY2FsZTogMS41LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYG1pbi13aWR0aDogMi4zZW1gKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGUgPSBnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCgpO1xuICAgIHJldHVybiBlICYmIGUucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLXRpbWVkdGV4dC10ZXh0LWNvbnRhaW5lcicpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlb1t0YWJpbmRleD1cIi0xXCJdJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnbWxiJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25TY2FsZTogMC43LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIGJvcmRlcjogMHB4O1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgIGZpbHRlcjogYnJpZ2h0bmVzcyg4MCUpO1xuICBgKSxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYGZpbHRlcjogYnJpZ2h0bmVzcygxMjAlKSAhaW1wb3J0YW50YCksXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib3R0b20tY29udHJvbHMtcmlnaHQnKTtcbiAgfSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1sYnR2LW1lZGlhLXBsYXllciB2aWRlbycpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ21peGVyJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdjb250cm9sJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA4KWApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkLnByZXZpb3VzU2libGluZztcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2wtY29udGFpbmVyIC50b29sYmFyIC5yaWdodCcpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC42NSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICB3aWR0aDogMzZweDtcbiAgICBoZWlnaHQ6IDM2cHg7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sLWNvbnRhaW5lciArIHZpZGVvJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnbWV0YWNhZmUnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllcl9wbGFjZSAudHJheScpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC44NSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3BsYXllcl9wbGFjZSB2aWRlbycpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ21hc2hhYmxlJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdqdy1pY29uIGp3LWljb24taW5saW5lIGp3LWJ1dHRvbi1jb2xvciBqdy1yZXNldCBqdy1pY29uLWxvZ28nLFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qdy1jb250cm9sYmFyLXJpZ2h0LWdyb3VwJyk7XG4gIH0sXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgdG9wOiAtMnB4O1xuICAgIHdpZHRoOiAzOHB4O1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW8uanctdmlkZW8nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdsaXR0bGV0aGluZ3MnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2p3LWljb24ganctaWNvbi1pbmxpbmUganctYnV0dG9uLWNvbG9yIGp3LXJlc2V0IGp3LWljb24tbG9nbycsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmp3LWNvbnRyb2xiYXItcmlnaHQtZ3JvdXAnKTtcbiAgfSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGB3aWR0aDogMzhweGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlby5qdy12aWRlbycpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRCdXR0b24gfSBmcm9tICcuLy4uL2J1dHRvbi5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdodWx1JztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIFxuICAgIC8vIEdldCBsb2NhbGl6ZWQgYnV0dG9uIHRpdGxlIGFuZCBoaWRlIGRlZmF1bHQgdG9vbHRpcFxuICAgIGNvbnN0IGJ1dHRvbiA9IGdldEJ1dHRvbigpO1xuICAgIGNvbnN0IC8qKiBzdHJpbmcgKi8gdGl0bGUgPSBidXR0b24udGl0bGU7XG4gICAgYnV0dG9uLnRpdGxlID0gJyc7XG4gICAgXG4gICAgLy8gQ3JlYXRlIHN0eWxpemVkIHRvb2x0aXAgYW5kIGFkZCB0byBET01cbiAgICBjb25zdCB0b29sdGlwID0gLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi8gKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICdidXR0b24tdG9vbC10aXBzJztcbiAgICB0b29sdGlwLnN0eWxlLmNzc1RleHQgPSAvKiogQ1NTICovIChgXG4gICAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgICAgcGFkZGluZzogMCA1cHg7XG4gICAgICByaWdodDogMDtcbiAgICBgKTtcbiAgICB0b29sdGlwLnRleHRDb250ZW50ID0gdGl0bGUudG9VcHBlckNhc2UoKTtcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG4gICAgXG4gICAgLy8gRGlzcGxheSBzdHlsaXplZCB0b29sdGlwIG9uIG1vdXNlb3ZlclxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgIHRvb2x0aXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfSk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24oKSB7XG4gICAgICB0b29sdGlwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSk7XG4gIH0sXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYG9wYWNpdHk6IDEuMCAhaW1wb3J0YW50YCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9sc19fdmlldy1tb2RlLWJ1dHRvbicpO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZGFzaC1wbGF5ZXItY29udGFpbmVyIC5jb250cm9sc19fbWVudXMtcmlnaHQnKTtcbiAgfSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBvcGFjaXR5OiAwLjc7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHdpZHRoOiAyNHB4O1xuICBgKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY2xvc2VkLWNhcHRpb24tb3V0YmFuZCcpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmlkZW8tcGxheWVyJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnZ2lhbnRib21iJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdhdi1jaHJvbWUtY29udHJvbCcsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy12aWQtcGluLXdyYXAnKS5uZXh0U2libGluZztcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmF2LWNvbnRyb2xzLS1yaWdodCcpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC43LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIGhlaWdodDogMTAwJTtcbiAgICB3aWR0aDogMzBweDtcbiAgICBvcGFjaXR5OiAxLjA7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW9baWRePVwidmlkZW9fanMtdmlkLXBsYXllclwiXScpO1xuICB9XG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnZnVibyc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY3NzLWphN3lrNycpO1xuICB9LFxuICBidXR0b25TY2FsZTogMS4yNSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBoZWlnaHQ6IDI0cHg7XG4gICAgd2lkdGg6IDI1cHg7XG4gICAgbWFyZ2luOiA4cHggMTBweCAxMnB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiaXRtb3ZpbnBsYXllci12aWRlby12aWRlbycpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ2V1cm9zcG9ydHBsYXllcic7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgb3BhY2l0eTogMSAhaW1wb3J0YW50YCksXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9scy1iYXItcmlnaHQtc2VjdGlvbicpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC45LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIGhlaWdodDogMTAwJTtcbiAgICBtYXJnaW4tcmlnaHQ6IDE1cHg7XG4gICAgb3BhY2l0eTogMC44O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlby1wbGF5ZXJfX3NjcmVlbicpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRCdXR0b24gfSBmcm9tICcuLy4uL2J1dHRvbi5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdlc3BuJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdtZWRpYS1pY29uJyxcbiAgYnV0dG9uRGlkQXBwZWFyOiBmdW5jdGlvbigpIHtcbiAgICAvLyBHZXQgbG9jYWxpemVkIGJ1dHRvbiB0aXRsZSBhbmQgaGlkZSBkZWZhdWx0IHRvb2x0aXBcbiAgICBjb25zdCBidXR0b24gPSBnZXRCdXR0b24oKTtcbiAgICBjb25zdCAvKiogc3RyaW5nICovIHRpdGxlID0gYnV0dG9uLnRpdGxlO1xuICAgIGJ1dHRvbi50aXRsZSA9ICcnO1xuXG4gICAgLy8gQ3JlYXRlIHN0eWxpemVkIHRvb2x0aXAgYW5kIGFkZCB0byBET01cbiAgICBjb25zdCB0b29sdGlwID0gLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi8gKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICB0b29sdGlwLmNsYXNzTmFtZSA9ICdjb250cm9sLXRvb2x0aXAnO1xuICAgIHRvb2x0aXAuc3R5bGUuY3NzVGV4dCA9IC8qKiBDU1MgKi8gKGBcbiAgICAgIHJpZ2h0OiAwcHg7XG4gICAgICBib3R0b206IDM1cHg7XG4gICAgICB0cmFuc2l0aW9uOiBib3R0b20gMC4ycyBlYXNlLW91dDtcbiAgICBgKTtcbiAgICB0b29sdGlwLnRleHRDb250ZW50ID0gdGl0bGU7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHRvb2x0aXApO1xuXG4gICAgLy8gRGlzcGxheSBzdHlsaXplZCB0b29sdGlwIG9uIG1vdXNlb3ZlclxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5aW5nJyk7XG4gICAgICB0b29sdGlwLnN0eWxlLmJvdHRvbSA9ICc3NXB4JztcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdkaXNwbGF5aW5nJyk7XG4gICAgICB0b29sdGlwLnN0eWxlLmJvdHRvbSA9ICczNXB4JztcbiAgICB9KTtcbiAgfSxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHMtcmlnaHQtaG9yaXpvbnRhbCcpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC43LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHdpZHRoOiA0NHB4O1xuICAgIGhlaWdodDogNDRweDtcbiAgICBvcmRlcjogNDtcbiAgYCksXG4gIGNhcHRpb25FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRleHQtdHJhY2stZGlzcGxheScpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlby5qcy12aWRlby1jb250ZW50Jyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnZGlzbmV5cGx1cyc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnY29udHJvbC1pY29uLWJ0bicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsc2NyZWVuLWljb24nKTtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX19yaWdodCcpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlb1tzcmNdJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnZGF6bic7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uU3R5bGU6IChgXG4gICAgd2lkdGg6IDEuNXJlbTtcbiAgICBoZWlnaHQ6IDEuNXJlbTtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBvdXRsaW5lOiBub25lO1xuICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcbiAgICBtYXJnaW46IDAuNXJlbTtcbiAgICB6LWluZGV4OiAxO1xuICBgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgXHQvLyBUaGUgTGl2ZSBpbmRpY2F0b3IgbWlnaHQgbW92ZS9jb3ZlciB0aGUgUGlQIGJ1dHRvbiwganVzdCBwbGFjZSB0aGUgUGlQIGJ1dHRvbiBiZWZvcmUgaXRcbiAgXHRjb25zdCBsaXZlSW5kaWNhdG9yID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2RhdGEtdGVzdC1pZF49XCJQTEFZRVJfTElWRV9JTkRJQ0FUT1JcIl0nKTtcbiAgXHRpZiAobGl2ZUluZGljYXRvcikge1xuICAgICAgcmV0dXJuIGxpdmVJbmRpY2F0b3I7XG4gIFx0fVxuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbZGF0YS10ZXN0LWlkXj1cIlBMQVlFUl9CQVJcIl0nKTtcdFxuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbZGF0YS10ZXN0LWlkXj1cIlBMQVlFUl9TT0xVVElPTlwiXSB2aWRlbycpO1xuICB9XG59O1xuXG5cbiIsImltcG9ydCB7IEJyb3dzZXIsIGdldEJyb3dzZXIsIGdldFJlc291cmNlIH0gZnJvbSAnLi8uLi9jb21tb24uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAnY3VyaW9zaXR5c3RyZWFtJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd2anMtY29udHJvbCB2anMtYnV0dG9uJyxcbiAgYnV0dG9uRGlkQXBwZWFyOiBmdW5jdGlvbigpIHtcbiAgICBpZiAoZ2V0QnJvd3NlcigpICE9IEJyb3dzZXIuU0FGQVJJKSByZXR1cm47XG4gICAgY29uc3QgdmlkZW8gPSAvKiogQHR5cGUgez9IVE1MVmlkZW9FbGVtZW50fSAqLyAoZ2V0UmVzb3VyY2UoKS52aWRlb0VsZW1lbnQoKSk7XG4gICAgY29uc3QgdmlkZW9Db250YWluZXIgPSB2aWRlby5wYXJlbnRFbGVtZW50O1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGJlZ2luZnVsbHNjcmVlbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5mbG9vcigxMDAgKiB2aWRlby52aWRlb0hlaWdodCAvIHZpZGVvLnZpZGVvV2lkdGgpICsgJ3Z3JztcbiAgICAgIGNvbnN0IG1heEhlaWdodCA9IHZpZGVvLnZpZGVvSGVpZ2h0ICsgJ3B4JztcbiAgICAgIHZpZGVvQ29udGFpbmVyLnN0eWxlLnNldFByb3BlcnR5KCdoZWlnaHQnLCBoZWlnaHQsICdpbXBvcnRhbnQnKTtcbiAgICAgIHZpZGVvQ29udGFpbmVyLnN0eWxlLnNldFByb3BlcnR5KCdtYXgtaGVpZ2h0JywgbWF4SGVpZ2h0KTtcbiAgICB9KTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRlbmRmdWxsc2NyZWVuJywgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlb0NvbnRhaW5lci5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnaGVpZ2h0Jyk7XG4gICAgICB2aWRlb0NvbnRhaW5lci5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnbWF4LWhlaWdodCcpO1xuICAgIH0pO1xuICB9LFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgb3BhY2l0eTogMSAhaW1wb3J0YW50YCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLXBsYXllcicpO1xuICAgIHJldHVybiBlICYmIGUucXVlcnlTZWxlY3RvcignLnZqcy1jb250cm9sLWJhcicpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC43LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIG9wYWNpdHk6IDAuODtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbi1wbGF5ZXJfaHRtbDVfYXBpJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnY3J1bmNoeXJvbGwnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3Zqcy1jb250cm9sIHZqcy1idXR0b24nLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgb3BhY2l0eTogMSAhaW1wb3J0YW50YCksXG4gIGJ1dHRvblNjYWxlOiAwLjYsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAxMDBweDtcbiAgICBvcGFjaXR5OiAwLjc1O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgYCksXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52anMtY29udHJvbC1iYXInKTtcbiAgfSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllcl9odG1sNV9hcGknKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdjZXNrYXRlbGV2aXplJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd2aWRlb0J1dHRvblNoZWxsIGRvbnRIaWRlQ29udHJvbHMgY3Vyc29yUG9pbnRlciBmb2N1c2FibGVCdG4nLFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBmaWx0ZXI6IGJyaWdodG5lc3MoNTAlKSBzZXBpYSgxKSBodWUtcm90YXRlKDE3MGRlZykgc2F0dXJhdGUoMjUwJSkgYnJpZ2h0bmVzcyg5MCUpO1xuICBgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Z1bGxTY3JlZW5TaGVsbCcpO1xuICB9LFxuICBidXR0b25TY2FsZTogMS4yLFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHdpZHRoOiAxOHB4O1xuICAgIGhlaWdodDogMThweDtcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGApLFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmlkZW9CdXR0b25zJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlbycpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ2JiYyc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucF9zdWJ0aXRsZXNDb250YWluZXInKTtcbiAgfSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI21lZGlhQ29udGFpbmVyIHZpZGVvW3NyY10nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdhcHBsZSc7XG5cbi8qKlxuICogUmV0dXJucyBuZXN0ZWQgc2hhZG93IHJvb3RcbiAqXG4gKiBAcGFyYW0geyFBcnJheTxzdHJpbmc+fSBzZWxlY3RvcnNcbiAqIEByZXR1cm4gez9TaGFkb3dSb290fVxuICovXG5jb25zdCBnZXROZXN0ZWRTaGFkb3dSb290ID0gZnVuY3Rpb24oc2VsZWN0b3JzKSB7XG4gIGxldCBkb20gPSBkb2N1bWVudDtcbiAgZm9yIChjb25zdCBzZWxlY3RvciBvZiBzZWxlY3RvcnMpIHtcbiAgICBkb20gPSAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqLyAoZG9tLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpKTtcbiAgICBkb20gPSBkb20gJiYgZG9tLnNoYWRvd1Jvb3Q7XG4gICAgaWYgKCFkb20pIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiAvKiogQHR5cGUge1NoYWRvd1Jvb3R9ICovIChkb20pO1xufVxuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2Zvb3Rlcl9fY29udHJvbCBoeWRyYXRlZCcsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYG9wYWNpdHk6IDAuOCAhaW1wb3J0YW50YCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgaW50ZXJuYWwgPSBnZXROZXN0ZWRTaGFkb3dSb290KFtcImFwcGxlLXR2LXBsdXMtcGxheWVyXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbXAtdmlkZW8tcGxheWVyLWludGVybmFsXCJdKTtcbiAgICBpZiAoIWludGVybmFsKSByZXR1cm47XG4gICAgY29uc3QgZnVsbHNjcmVlbkJ1dHRvbiA9IGludGVybmFsLnF1ZXJ5U2VsZWN0b3IoXCJhbXAtcGxheWJhY2stY29udHJvbHMtZnVsbC1zY3JlZW5cIik7XG4gICAgaWYgKCFmdWxsc2NyZWVuQnV0dG9uKSByZXR1cm47XG4gICAgcmV0dXJuIGZ1bGxzY3JlZW5CdXR0b24ucGFyZW50RWxlbWVudDtcbiAgfSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMTVzO1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBvcGFjaXR5OiAwLjk7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHZpZGVvID0gZ2V0TmVzdGVkU2hhZG93Um9vdChbXCJhcHBsZS10di1wbHVzLXBsYXllclwiLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW1wLXZpZGVvLXBsYXllci1pbnRlcm5hbFwiLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYW1wLXZpZGVvLXBsYXllclwiXSk7XG4gICAgaWYgKCF2aWRlbykgcmV0dXJuO1xuICAgIHJldHVybiB2aWRlby5xdWVyeVNlbGVjdG9yKCd2aWRlbycpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gWydhbWF6b24nLCAncHJpbWV2aWRlbyddO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5mdWxsc2NyZWVuQnV0dG9uV3JhcHBlcicpO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHYtd2ViLXBsYXllcicpO1xuICAgIHJldHVybiBlICYmIGUucXVlcnlTZWxlY3RvcignLmhpZGVhYmxlVG9wQnV0dG9ucycpO1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBsZWZ0OiA4cHg7XG4gICAgd2lkdGg6IDN2dztcbiAgICBoZWlnaHQ6IDJ2dztcbiAgICBtaW4td2lkdGg6IDM1cHg7XG4gICAgbWluLWhlaWdodDogMjRweDtcbiAgICBib3JkZXI6IDBweDtcbiAgICBwYWRkaW5nOiAwcHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgb3BhY2l0eTogMC44O1xuICBgKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHYtd2ViLXBsYXllcicpO1xuICAgIHJldHVybiBlICYmIGUucXVlcnlTZWxlY3RvcignLmNhcHRpb25zJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZW5kZXJlckNvbnRhaW5lcicpO1xuICAgIHJldHVybiBlICYmIGUucXVlcnlTZWxlY3RvcigndmlkZW9bd2lkdGg9XCIxMDAlXCJdJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnYWt0dWFsbmUnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2p3LWljb24ganctaWNvbi1pbmxpbmUganctYnV0dG9uLWNvbG9yIGp3LXJlc2V0IGp3LWljb24tbG9nbycsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcyg1MCUpIHNlcGlhKDEpIGh1ZS1yb3RhdGUoMzExZGVnKSBzYXR1cmF0ZSg1NTAlKSBicmlnaHRuZXNzKDQ5JSkgIWltcG9ydGFudDtcbiAgYCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qdy1jb250cm9sYmFyLXJpZ2h0LWdyb3VwJyk7XG4gIH0sXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgd2lkdGg6IDM4cHg7XG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDgwJSk7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlby5qdy12aWRlbycpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRSZXNvdXJjZSB9IGZyb20gJy4vLi4vY29tbW9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJzlub3cnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3Zqcy1jb250cm9sIHZqcy1idXR0b24nLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDUwJSkgc2VwaWEoMSkgaHVlLXJvdGF0ZSgxNjdkZWcpIHNhdHVyYXRlKDI1MyUpIGJyaWdodG5lc3MoMTA0JSk7XG4gIGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvcignLnZqcy1mdWxsc2NyZWVuLWNvbnRyb2wnKTtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZqcy1jb250cm9sLWJhcicpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC43LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIG9yZGVyOiA5OTk5OTk7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIGhlaWdodDogNDRweDtcbiAgICB3aWR0aDogNDBweDtcbiAgYCksXG4gIGNhcHRpb25FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBlID0gZ2V0UmVzb3VyY2UoKS52aWRlb0VsZW1lbnQoKTtcbiAgICByZXR1cm4gZSAmJiBlLnBhcmVudEVsZW1lbnQucXVlcnlTZWxlY3RvcignLnZqcy10ZXh0LXRyYWNrLWRpc3BsYXknKTtcbiAgfSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW8udmpzLXRlY2gnKTtcbiAgfSxcbn07IiwiaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tICcuL2NvbW1vbi5qcydcblxuLyoqXG4gKiBJbml0aWFsaXNlcyBjYWNoaW5nIGZvciBidXR0b24sIHZpZGVvLCBhbmQgY2FwdGlvbiBlbGVtZW50c1xuICovXG5leHBvcnQgY29uc3QgaW5pdGlhbGlzZUNhY2hlcyA9IGZ1bmN0aW9uKCkge1xuXG4gIC8vIFJldHVybiBhIHVuaXF1ZSBpZFxuICBsZXQgdW5pcXVlSWRDb3VudGVyID0gMDtcbiAgY29uc3QgLyoqIGZ1bmN0aW9uKCk6c3RyaW5nICovIHVuaXF1ZUlkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICdQaVBlcl8nICsgdW5pcXVlSWRDb3VudGVyKys7XG4gIH07XG5cbiAgLyoqXG4gICAqIFdyYXBzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIGVsZW1lbnQgdG8gcHJvdmlkZSBmYXN0ZXIgbG9va3VwcyBieSBpZFxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGJvb2xlYW49KTo/RWxlbWVudH0gZWxlbWVudEZ1bmN0aW9uXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9uKGJvb2xlYW49KTo/RWxlbWVudH0gXG4gICAqL1xuICBjb25zdCBjYWNoZUVsZW1lbnRXcmFwcGVyID0gZnVuY3Rpb24oZWxlbWVudEZ1bmN0aW9uKSB7XG4gICAgbGV0IC8qKiA/c3RyaW5nICovIGNhY2hlZEVsZW1lbnRJZCA9IG51bGw7XG5cbiAgICByZXR1cm4gLyoqIGZ1bmN0aW9uKCk6P0VsZW1lbnQgKi8gZnVuY3Rpb24oLyoqIGJvb2xlYW49ICovIGJ5cGFzc0NhY2hlKSB7XG5cbiAgICAgIC8vIFJldHVybiBlbGVtZW50IGJ5IGlkIGlmIHBvc3NpYmxlXG4gICAgICBjb25zdCBjYWNoZWRFbGVtZW50ID0gY2FjaGVkRWxlbWVudElkID8gXG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY2FjaGVkRWxlbWVudElkKSA6IG51bGw7XG4gICAgICBpZiAoY2FjaGVkRWxlbWVudCAmJiAhYnlwYXNzQ2FjaGUpIHJldHVybiBjYWNoZWRFbGVtZW50O1xuXG4gICAgICAvLyBDYWxsIHRoZSB1bmRlcmx5aW5nIGZ1bmN0aW9uIHRvIGdldCB0aGUgZWxlbWVudFxuICAgICAgY29uc3QgdW5jYWNoZWRFbGVtZW50ID0gZWxlbWVudEZ1bmN0aW9uKCk7XG4gICAgICBpZiAodW5jYWNoZWRFbGVtZW50KSB7XG5cbiAgICAgICAgLy8gU2F2ZSB0aGUgbmF0aXZlIGlkIG90aGVyd2lzZSBhc3NpZ24gYSB1bmlxdWUgaWRcbiAgICAgICAgaWYgKCF1bmNhY2hlZEVsZW1lbnQuaWQpIHVuY2FjaGVkRWxlbWVudC5pZCA9IHVuaXF1ZUlkKCk7XG4gICAgICAgIGNhY2hlZEVsZW1lbnRJZCA9IHVuY2FjaGVkRWxlbWVudC5pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmNhY2hlZEVsZW1lbnQ7XG4gICAgfTtcbiAgfTtcblxuICAvLyBXcmFwIHRoZSBidXR0b24sIHZpZGVvLCBhbmQgY2FwdGlvbiBlbGVtZW50c1xuICBjb25zdCBjdXJyZW50UmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgpO1xuICBjdXJyZW50UmVzb3VyY2UuYnV0dG9uUGFyZW50ID0gY2FjaGVFbGVtZW50V3JhcHBlcihjdXJyZW50UmVzb3VyY2UuYnV0dG9uUGFyZW50KTtcbiAgY3VycmVudFJlc291cmNlLnZpZGVvRWxlbWVudCA9IGNhY2hlRWxlbWVudFdyYXBwZXIoY3VycmVudFJlc291cmNlLnZpZGVvRWxlbWVudCk7XG4gIGlmIChjdXJyZW50UmVzb3VyY2UuY2FwdGlvbkVsZW1lbnQpIHtcbiAgICBjdXJyZW50UmVzb3VyY2UuY2FwdGlvbkVsZW1lbnQgPSBjYWNoZUVsZW1lbnRXcmFwcGVyKGN1cnJlbnRSZXNvdXJjZS5jYXB0aW9uRWxlbWVudCk7XG4gIH1cbn07IiwiLyoqIEF1dG8tZ2VuZXJhdGVkIGZpbGUgKiovXG5cbmltcG9ydCAqIGFzIHIxIGZyb20gXCIuLzlub3cuanNcIjtcbmltcG9ydCAqIGFzIHIyIGZyb20gXCIuL2FrdHVhbG5lLmpzXCI7XG5pbXBvcnQgKiBhcyByMyBmcm9tIFwiLi9hbWF6b24uanNcIjtcbmltcG9ydCAqIGFzIHI0IGZyb20gXCIuL2FwcGxlLmpzXCI7XG5pbXBvcnQgKiBhcyByNSBmcm9tIFwiLi9iYmMuanNcIjtcbmltcG9ydCAqIGFzIHI2IGZyb20gXCIuL2Nlc2thdGVsZXZpemUuanNcIjtcbmltcG9ydCAqIGFzIHI3IGZyb20gXCIuL2NydW5jaHlyb2xsLmpzXCI7XG5pbXBvcnQgKiBhcyByOCBmcm9tIFwiLi9jdXJpb3NpdHlzdHJlYW0uanNcIjtcbmltcG9ydCAqIGFzIHI5IGZyb20gXCIuL2Rhem4uanNcIjtcbmltcG9ydCAqIGFzIHIxMCBmcm9tIFwiLi9kaXNuZXlwbHVzLmpzXCI7XG5pbXBvcnQgKiBhcyByMTEgZnJvbSBcIi4vZXNwbi5qc1wiO1xuaW1wb3J0ICogYXMgcjEyIGZyb20gXCIuL2V1cm9zcG9ydHBsYXllci5qc1wiO1xuaW1wb3J0ICogYXMgcjEzIGZyb20gXCIuL2Z1Ym90di5qc1wiO1xuaW1wb3J0ICogYXMgcjE0IGZyb20gXCIuL2dpYW50Ym9tYi5qc1wiO1xuaW1wb3J0ICogYXMgcjE1IGZyb20gXCIuL2h1bHUuanNcIjtcbmltcG9ydCAqIGFzIHIxNiBmcm9tIFwiLi9saXR0bGV0aGluZ3MuanNcIjtcbmltcG9ydCAqIGFzIHIxNyBmcm9tIFwiLi9tYXNoYWJsZS5qc1wiO1xuaW1wb3J0ICogYXMgcjE4IGZyb20gXCIuL21ldGFjYWZlLmpzXCI7XG5pbXBvcnQgKiBhcyByMTkgZnJvbSBcIi4vbWl4ZXIuanNcIjtcbmltcG9ydCAqIGFzIHIyMCBmcm9tIFwiLi9tbGIuanNcIjtcbmltcG9ydCAqIGFzIHIyMSBmcm9tIFwiLi9uZXRmbGl4LmpzXCI7XG5pbXBvcnQgKiBhcyByMjIgZnJvbSBcIi4vb2NzLmpzXCI7XG5pbXBvcnQgKiBhcyByMjMgZnJvbSBcIi4vb3BlbmxvYWQuanNcIjtcbmltcG9ydCAqIGFzIHIyNCBmcm9tIFwiLi9wYnMuanNcIjtcbmltcG9ydCAqIGFzIHIyNSBmcm9tIFwiLi9wZXJpc2NvcGUuanNcIjtcbmltcG9ydCAqIGFzIHIyNiBmcm9tIFwiLi9wbGV4LmpzXCI7XG5pbXBvcnQgKiBhcyByMjcgZnJvbSBcIi4vc2V6bmFtLmpzXCI7XG5pbXBvcnQgKiBhcyByMjggZnJvbSBcIi4vc3RyZWFtYWJsZS5qc1wiO1xuaW1wb3J0ICogYXMgcjI5IGZyb20gXCIuL3RlZC5qc1wiO1xuaW1wb3J0ICogYXMgcjMwIGZyb20gXCIuL3RoZW9uaW9uLmpzXCI7XG5pbXBvcnQgKiBhcyByMzEgZnJvbSBcIi4vdHdpdGNoLmpzXCI7XG5pbXBvcnQgKiBhcyByMzIgZnJvbSBcIi4vdWRlbXkuanNcIjtcbmltcG9ydCAqIGFzIHIzMyBmcm9tIFwiLi91c3RyZWFtLmpzXCI7XG5pbXBvcnQgKiBhcyByMzQgZnJvbSBcIi4vdmV2by5qc1wiO1xuaW1wb3J0ICogYXMgcjM1IGZyb20gXCIuL3ZpY2UuanNcIjtcbmltcG9ydCAqIGFzIHIzNiBmcm9tIFwiLi92aWQuanNcIjtcbmltcG9ydCAqIGFzIHIzNyBmcm9tIFwiLi92aWVydmlqZnplcy5qc1wiO1xuaW1wb3J0ICogYXMgcjM4IGZyb20gXCIuL3ZrLmpzXCI7XG5pbXBvcnQgKiBhcyByMzkgZnJvbSBcIi4vdnJ0LmpzXCI7XG5pbXBvcnQgKiBhcyByNDAgZnJvbSBcIi4vdnJ2LmpzXCI7XG5pbXBvcnQgKiBhcyByNDEgZnJvbSBcIi4veWVsb3BsYXkuanNcIjtcbmltcG9ydCAqIGFzIHI0MiBmcm9tIFwiLi95b3V0dWJlLmpzXCI7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZXMgPSB7fTtcblxucmVzb3VyY2VzW3IxLmRvbWFpbl0gPSByMS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMi5kb21haW5dID0gcjIucmVzb3VyY2U7XG5yZXNvdXJjZXNbJ2FtYXpvbiddID0gcjMucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjQuZG9tYWluXSA9IHI0LnJlc291cmNlO1xucmVzb3VyY2VzW3I1LmRvbWFpbl0gPSByNS5yZXNvdXJjZTtcbnJlc291cmNlc1tyNi5kb21haW5dID0gcjYucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjcuZG9tYWluXSA9IHI3LnJlc291cmNlO1xucmVzb3VyY2VzW3I4LmRvbWFpbl0gPSByOC5yZXNvdXJjZTtcbnJlc291cmNlc1tyOS5kb21haW5dID0gcjkucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjEwLmRvbWFpbl0gPSByMTAucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjExLmRvbWFpbl0gPSByMTEucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjEyLmRvbWFpbl0gPSByMTIucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjEzLmRvbWFpbl0gPSByMTMucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjE0LmRvbWFpbl0gPSByMTQucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjE1LmRvbWFpbl0gPSByMTUucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjE2LmRvbWFpbl0gPSByMTYucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjE3LmRvbWFpbl0gPSByMTcucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjE4LmRvbWFpbl0gPSByMTgucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjE5LmRvbWFpbl0gPSByMTkucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjIwLmRvbWFpbl0gPSByMjAucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjIxLmRvbWFpbl0gPSByMjEucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjIyLmRvbWFpbl0gPSByMjIucmVzb3VyY2U7XG5yZXNvdXJjZXNbJ29wZW5sb2FkJ10gPSByMjMucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjI0LmRvbWFpbl0gPSByMjQucmVzb3VyY2U7XG5yZXNvdXJjZXNbJ3BlcmlzY29wZSddID0gcjI1LnJlc291cmNlO1xucmVzb3VyY2VzW3IyNi5kb21haW5dID0gcjI2LnJlc291cmNlO1xucmVzb3VyY2VzWydzZXpuYW0nXSA9IHIyNy5yZXNvdXJjZTtcbnJlc291cmNlc1tyMjguZG9tYWluXSA9IHIyOC5yZXNvdXJjZTtcbnJlc291cmNlc1tyMjkuZG9tYWluXSA9IHIyOS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMzAuZG9tYWluXSA9IHIzMC5yZXNvdXJjZTtcbnJlc291cmNlc1tyMzEuZG9tYWluXSA9IHIzMS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMzIuZG9tYWluXSA9IHIzMi5yZXNvdXJjZTtcbnJlc291cmNlc1tyMzMuZG9tYWluXSA9IHIzMy5yZXNvdXJjZTtcbnJlc291cmNlc1tyMzQuZG9tYWluXSA9IHIzNC5yZXNvdXJjZTtcbnJlc291cmNlc1tyMzUuZG9tYWluXSA9IHIzNS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMzYuZG9tYWluXSA9IHIzNi5yZXNvdXJjZTtcbnJlc291cmNlc1sndmlqZiddID0gcjM3LnJlc291cmNlO1xucmVzb3VyY2VzW3IzOC5kb21haW5dID0gcjM4LnJlc291cmNlO1xucmVzb3VyY2VzW3IzOS5kb21haW5dID0gcjM5LnJlc291cmNlO1xucmVzb3VyY2VzW3I0MC5kb21haW5dID0gcjQwLnJlc291cmNlO1xucmVzb3VyY2VzW3I0MS5kb21haW5dID0gcjQxLnJlc291cmNlO1xucmVzb3VyY2VzWyd5b3V0dWJlJ10gPSByNDIucmVzb3VyY2U7XG5cbnJlc291cmNlc1sncHJpbWV2aWRlbyddID0gcmVzb3VyY2VzWydhbWF6b24nXTtcbnJlc291cmNlc1snb2xvYWQnXSA9IHJlc291cmNlc1snb3BlbmxvYWQnXTtcbnJlc291cmNlc1sncHNjcCddID0gcmVzb3VyY2VzWydwZXJpc2NvcGUnXTtcbnJlc291cmNlc1snc3RyZWFtJ10gPSByZXNvdXJjZXNbJ3Nlem5hbSddO1xucmVzb3VyY2VzWyd2aWVyJ10gPSByZXNvdXJjZXNbJ3ZpamYnXTtcbnJlc291cmNlc1snemVzJ10gPSByZXNvdXJjZXNbJ3ZpamYnXTtcbnJlc291cmNlc1sneW91dHUnXSA9IHJlc291cmNlc1sneW91dHViZSddO1xuIiwiaW1wb3J0IHsgaW5mbyB9IGZyb20gJy4vbG9nZ2VyLmpzJ1xuaW1wb3J0IHsgQnJvd3NlciwgZ2V0QnJvd3NlciwgZ2V0UmVzb3VyY2UsIHNldFJlc291cmNlIH0gZnJvbSAnLi9jb21tb24uanMnXG5pbXBvcnQgeyBhZGRWaWRlb0VsZW1lbnRMaXN0ZW5lcnMgfSBmcm9tICcuL3ZpZGVvLmpzJ1xuaW1wb3J0IHsgcmVzb3VyY2VzIH0gZnJvbSAnLi9yZXNvdXJjZXMvaW5kZXguanMnO1xuaW1wb3J0IHsgY2hlY2tCdXR0b24sIGFkZEJ1dHRvbiB9IGZyb20gJy4vYnV0dG9uLmpzJ1xuaW1wb3J0IHsgc2hvdWxkUHJvY2Vzc0NhcHRpb25zLCBlbmFibGVDYXB0aW9ucywgcHJvY2Vzc0NhcHRpb25zLCBhZGRWaWRlb0NhcHRpb25UcmFja3MgfSBmcm9tICcuL2NhcHRpb25zLmpzJ1xuaW1wb3J0IHsgaW5pdGlhbGlzZUNhY2hlcyB9IGZyb20gJy4vY2FjaGUuanMnXG5cbi8qKlxuICogVHJhY2tzIGluamVjdGVkIGJ1dHRvbiBhbmQgY2FwdGlvbnNcbiAqL1xuY29uc3QgbXV0YXRpb25PYnNlcnZlciA9IGZ1bmN0aW9uKCkge1xuICBjb25zdCBjdXJyZW50UmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgpO1xuXG4gIC8vIFByb2Nlc3MgdmlkZW8gY2FwdGlvbnMgaWYgbmVlZGVkXG4gIGlmIChzaG91bGRQcm9jZXNzQ2FwdGlvbnMoKSkgcHJvY2Vzc0NhcHRpb25zKCk7XG5cbiAgLy8gV29ya2Fyb3VuZCBDaHJvbWUncyBsYWNrIG9mIGFuIGVudGVyaW5nIFBpY3R1cmUgaW4gUGljdHVyZSBtb2RlIGV2ZW50IGJ5IG1vbml0b3JpbmcgYWxsIHZpZGVvIGVsZW1lbnRzXG4gIGlmIChnZXRCcm93c2VyKCkgPT0gQnJvd3Nlci5DSFJPTUUpIGFkZFZpZGVvRWxlbWVudExpc3RlbmVycygpO1xuXG4gIC8vIFdvcmthcm91bmQgU2FmYXJpIGJ1ZzsgY2FwdGlvbnMgYXJlIG5vdCBkaXNwbGF5ZWQgaWYgdGhlIHRyYWNrIGlzIGFkZGVkIGFmdGVyIHRoZSB2aWRlbyBoYXMgbG9hZGVkXG4gIGlmIChnZXRCcm93c2VyKCkgPT0gQnJvd3Nlci5TQUZBUkkgJiYgY3VycmVudFJlc291cmNlLmNhcHRpb25FbGVtZW50KSBhZGRWaWRlb0NhcHRpb25UcmFja3MoKTtcblxuICAvLyBUcnkgYWRkaW5nIHRoZSBidXR0b24gdG8gdGhlIHBhZ2UgaWYgbmVlZGVkXG4gIGlmIChjaGVja0J1dHRvbigpKSByZXR1cm47XG4gIGNvbnN0IGJ1dHRvblBhcmVudCA9IGN1cnJlbnRSZXNvdXJjZS5idXR0b25QYXJlbnQoKTtcbiAgaWYgKGJ1dHRvblBhcmVudCkge1xuICAgIGFkZEJ1dHRvbihidXR0b25QYXJlbnQpO1xuICAgIGlmIChjdXJyZW50UmVzb3VyY2UuYnV0dG9uRGlkQXBwZWFyKSBjdXJyZW50UmVzb3VyY2UuYnV0dG9uRGlkQXBwZWFyKCk7XG4gICAgaW5mbygnUGljdHVyZSBpbiBQaWN0dXJlIGJ1dHRvbiBhZGRlZCB0byB3ZWJwYWdlJyk7XG4gIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZmlyc3Qgbm9uLXB1YmxpYyBzdWJkb21haW4gZnJvbSB0aGUgY3VycmVudCBkb21haW4gbmFtZVxuICpcbiAqIEByZXR1cm4ge3N0cmluZ3x1bmRlZmluZWR9XG4gKi9cbmNvbnN0IGdldEN1cnJlbnREb21haW5OYW1lID0gZnVuY3Rpb24oKSB7XG5cbiAgLy8gU3BlY2lhbCBjYXNlIGZvciBsb2NhbCBQbGV4IE1lZGlhIFNlcnZlciBhY2Nlc3MgdGhhdCBhbHdheXMgdXNlcyBwb3J0IDMyNDAwXG4gIGlmIChsb2NhdGlvbi5wb3J0ID09IDMyNDAwKSB7XG4gICAgcmV0dXJuICdwbGV4JztcbiAgfSBlbHNlIHtcbiAgICAvLyBSZW1vdmUgc3ViZG9tYWluIGFuZCBwdWJsaWMgc3VmZml4IChmYXIgZnJvbSBjb21wcmVoZW5zaXZlIGFzIG9ubHkgcmVtb3ZlcyAuWCBhbmQgLmNvLlkpXG4gICAgcmV0dXJuIChsb2NhdGlvbi5ob3N0bmFtZS5tYXRjaCgvKFteLl0rKVxcLig/OmNvbT9cXC4pP1teLl0rJC8pIHx8IFtdKVsxXTtcbiAgfVxufTtcblxuY29uc3QgZG9tYWluTmFtZSA9IGdldEN1cnJlbnREb21haW5OYW1lKCk7XG5cbmlmIChkb21haW5OYW1lIGluIHJlc291cmNlcykge1xuICBpbmZvKGBNYXRjaGVkIHNpdGUgJHtkb21haW5OYW1lfSAoJHtsb2NhdGlvbn0pYCk7XG4gIHNldFJlc291cmNlKHJlc291cmNlc1tkb21haW5OYW1lXSk7XG5cbiAgaW5pdGlhbGlzZUNhY2hlcygpO1xuXG4gIGlmIChnZXRCcm93c2VyKCkgPT0gQnJvd3Nlci5TQUZBUkkpIHtcbiAgICBlbmFibGVDYXB0aW9ucyh0cnVlKTtcbiAgfVxuXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb25PYnNlcnZlcik7XG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgfSk7XG4gIG11dGF0aW9uT2JzZXJ2ZXIoKTtcbn1cbiJdLAoibmFtZXMiOlsiTE9HR0lOR19MRVZFTCIsIkJST1dTRVIiLCIkanNjb21wJHRtcCRleHBvcnRzJG1vZHVsZSRuYW1lIiwibG9nZ2luZ1ByZWZpeCIsIkxvZ2dpbmdMZXZlbCIsIkFMTCIsIlRSQUNFIiwiSU5GTyIsIldBUk5JTkciLCJFUlJPUiIsInRyYWNlIiwiY29uc29sZSIsImJpbmQiLCJpbmZvIiwid2FybiIsImVycm9yIiwiQnJvd3NlciIsIlVOS05PV04iLCJTQUZBUkkiLCJDSFJPTUUiLCJnZXRCcm93c2VyIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInZlbmRvciIsIlBpcGVyUmVzb3VyY2UiLCJjdXJyZW50UmVzb3VyY2UiLCJnZXRSZXNvdXJjZSIsInNldFJlc291cmNlIiwicmVzb3VyY2UiLCJnZXRFeHRlbnNpb25VUkwiLCJwYXRoIiwic2FmYXJpIiwiZXh0ZW5zaW9uIiwiYmFzZVVSSSIsImNocm9tZSIsInJ1bnRpbWUiLCJnZXRVUkwiLCJieXBhc3NCYWNrZ3JvdW5kVGltZXJUaHJvdHRsaW5nIiwiY2FwdGlvbkVsZW1lbnQiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwib25sb2FkIiwicmVxdWVzdC5vbmxvYWQiLCJzY3JpcHQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVRleHROb2RlIiwicmVzcG9uc2VUZXh0IiwiaGVhZCIsInNlbmQiLCJDSFJPTUVfUExBWUlOR19QSVBfQVRUUklCVVRFIiwiZXZlbnRMaXN0ZW5lcnMiLCJ0b2dnbGVQaWN0dXJlSW5QaWN0dXJlIiwidmlkZW8iLCJwbGF5aW5nUGljdHVyZUluUGljdHVyZSIsInZpZGVvUGxheWluZ1BpY3R1cmVJblBpY3R1cmUiLCJ3ZWJraXRTZXRQcmVzZW50YXRpb25Nb2RlIiwidGV4dENvbnRlbnQiLCJyZW1vdmUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJyZXF1ZXN0UGljdHVyZUluUGljdHVyZSIsImFkZFBpY3R1cmVJblBpY3R1cmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXIiLCJpbmRleCIsImluZGV4T2YiLCJwdXNoIiwiYWRkRXZlbnRMaXN0ZW5lciIsInZpZGVvUHJlc2VudGF0aW9uTW9kZUNoYW5nZWQiLCJjYXB0dXJlIiwicmVtb3ZlUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIiLCJzcGxpY2UiLCJsZW5ndGgiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGlzcGF0Y2hQaWN0dXJlSW5QaWN0dXJlRXZlbnQiLCJleHBlY3RlZFZpZGVvIiwidmlkZW9FbGVtZW50IiwiaXNQbGF5aW5nUGljdHVyZUluUGljdHVyZSIsImV2ZW50TGlzdGVuZXJzQ29weSIsInNsaWNlIiwicG9wIiwiZXZlbnQiLCJ0YXJnZXQiLCJ3ZWJraXRQcmVzZW50YXRpb25Nb2RlIiwiaGFzQXR0cmlidXRlIiwidmlkZW9EaWRFbnRlclBpY3R1cmVJblBpY3R1cmUiLCJvbmNlIiwiYWRkVmlkZW9FbGVtZW50TGlzdGVuZXJzIiwiZWxlbWVudHMiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImVsZW1lbnQiLCJsb2NhbGl6YXRpb25zIiwiZGVmYXVsdExhbmd1YWdlIiwibG9jYWxpemVkU3RyaW5nIiwia2V5IiwibGFuZ3VhZ2UiLCJzdWJzdHJpbmciLCJsb2NhbGl6YXRpb25zRm9yS2V5Iiwic3RyaW5nIiwibG9jYWxpemVkU3RyaW5nV2l0aFJlcGxhY2VtZW50cyIsInJlcGxhY2VtZW50cyIsInJlcGxhY2VtZW50IiwicmVnZXgiLCJSZWdFeHAiLCJyZXBsYWNlIiwiVFJBQ0tfSUQiLCJ0cmFjayIsImNhcHRpb25zRW5hYmxlZCIsInNob3dpbmdDYXB0aW9ucyIsInNob3dpbmdFbXB0eUNhcHRpb24iLCJsYXN0VW5wcm9jZXNzZWRDYXB0aW9uIiwiZGlzYWJsZUNhcHRpb25zIiwicHJvY2Vzc0NhcHRpb25zIiwicGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIiLCJlbmFibGVDYXB0aW9ucyIsImlnbm9yZU5vd1BsYXlpbmdDaGVjayIsImdldENhcHRpb25UcmFjayIsInNob3VsZFByb2Nlc3NDYXB0aW9ucyIsImFsbFRyYWNrcyIsInRleHRUcmFja3MiLCJ0cmFja0lkIiwibGFiZWwiLCJhZGRUZXh0VHJhY2siLCJhZGRWaWRlb0NhcHRpb25UcmFja3MiLCJtb2RlIiwicmVtb3ZlQ2FwdGlvbnMiLCJ3b3JrYXJvdW5kIiwiYWN0aXZlQ3VlcyIsInJlbW92ZUN1ZSIsImFkZEN1ZSIsIlZUVEN1ZSIsImN1cnJlbnRUaW1lIiwiYWRkQ2FwdGlvbiIsImNhcHRpb24iLCJzdHlsZSIsInZpc2liaWxpdHkiLCJ1bnByb2Nlc3NlZENhcHRpb24iLCJ3YWxrIiwiY3JlYXRlVHJlZVdhbGtlciIsIk5vZGVGaWx0ZXIiLCJTSE9XX1RFWFQiLCJuZXh0Tm9kZSIsInNlZ21lbnQiLCJjdXJyZW50Tm9kZSIsIm5vZGVWYWx1ZSIsInRyaW0iLCJ3aW5kb3ciLCJnZXRDb21wdXRlZFN0eWxlIiwicGFyZW50RWxlbWVudCIsImZvbnRTdHlsZSIsInRleHREZWNvcmF0aW9uIiwiY2hhckF0IiwiQlVUVE9OX0lEIiwiYnV0dG9uIiwiYWRkQnV0dG9uIiwicGFyZW50IiwiYnV0dG9uRWxlbWVudFR5cGUiLCJpZCIsInRpdGxlIiwiYnV0dG9uU3R5bGUiLCJjc3NUZXh0IiwiYnV0dG9uQ2xhc3NOYW1lIiwiY2xhc3NOYW1lIiwiaW1hZ2UiLCJ3aWR0aCIsImhlaWdodCIsImJ1dHRvblNjYWxlIiwidHJhbnNmb3JtIiwiYnV0dG9uSW1hZ2UiLCJidXR0b25FeGl0SW1hZ2UiLCJidXR0b25JbWFnZVVSTCIsInNyYyIsImJ1dHRvbkV4aXRJbWFnZVVSTCIsImJ1dHRvbkhvdmVyU3R5bGUiLCJjc3MiLCJwcmV2ZW50RGVmYXVsdCIsInJlZmVyZW5jZU5vZGUiLCJidXR0b25JbnNlcnRCZWZvcmUiLCJpbnNlcnRCZWZvcmUiLCJnZXRCdXR0b24iLCJjaGVja0J1dHRvbiIsImdldEVsZW1lbnRCeUlkIiwiZG9tYWluIiwiYnV0dG9uRGlkQXBwZWFyIiwibmVpZ2hib3VyQnV0dG9uIiwibmV4dFNpYmxpbmciLCJuZWlnaGJvdXJUaXRsZSIsImRpc3BhdGNoRXZlbnQiLCJFdmVudCIsImNhcHRpb25zVmlzaWJsZSIsIm5hdmlnYXRlU3RhcnQiLCJuYXZpZ2F0ZUZpbmlzaCIsImxhc3RDaGlsZCIsImJ1dHRvblBhcmVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiZnVsbFNjcmVlbkJ1dHRvbiIsIm9yZGVyIiwidG9vbHRpcCIsImZ1bGxzY3JlZW5CdXR0b24iLCJwbGF5QnV0dG9uIiwiaW1nIiwiY2xhc3NMaXN0IiwiYWRkIiwicHJvZ3Jlc3NCYXIiLCJwcm9ncmVzc0JhclN0eWxlIiwicmlnaHQiLCJwYXJzZUludCIsImUiLCJwcmV2aW91c1NpYmxpbmciLCJ0b1VwcGVyQ2FzZSIsImRpc3BsYXkiLCJib3R0b20iLCJsaXZlSW5kaWNhdG9yIiwidmlkZW9Db250YWluZXIiLCJNYXRoIiwiZmxvb3IiLCJ2aWRlb0hlaWdodCIsInZpZGVvV2lkdGgiLCJtYXhIZWlnaHQiLCJzZXRQcm9wZXJ0eSIsInJlbW92ZVByb3BlcnR5IiwiZ2V0TmVzdGVkU2hhZG93Um9vdCIsInNlbGVjdG9ycyIsImRvbSIsInNlbGVjdG9yIiwic2hhZG93Um9vdCIsImludGVybmFsIiwiaW5pdGlhbGlzZUNhY2hlcyIsInVuaXF1ZUlkQ291bnRlciIsInVuaXF1ZUlkIiwiY2FjaGVFbGVtZW50V3JhcHBlciIsImVsZW1lbnRGdW5jdGlvbiIsImNhY2hlZEVsZW1lbnRJZCIsImJ5cGFzc0NhY2hlIiwiY2FjaGVkRWxlbWVudCIsInVuY2FjaGVkRWxlbWVudCIsInJlc291cmNlcyIsIm11dGF0aW9uT2JzZXJ2ZXIiLCJnZXRDdXJyZW50RG9tYWluTmFtZSIsImxvY2F0aW9uIiwicG9ydCIsImhvc3RuYW1lIiwibWF0Y2giLCJkb21haW5OYW1lIiwib2JzZXJ2ZXIiLCJNdXRhdGlvbk9ic2VydmVyIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiXQp9Cg==
