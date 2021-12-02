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
  return document.querySelector(".PlayerControlsNeo__button-control-row");
}, buttonScale:0.7, buttonStyle:`min-width: 2.3em`, captionElement:function() {
  const e = getResource$$module$common().videoElement();
  return e && e.parentElement.querySelector(".player-timedtext");
}, videoElement:function() {
  return document.querySelector(".VideoContainer video");
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
//# sourceMappingURL=data:application/json;base64,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QixLQUErQkosUUFBL0IsR0FBTCxDQUFBO0FBQ0F2Tiw0QkFBQSxDQUFZb04saUNBQUEsQ0FBVU8sdUJBQVYsQ0FBWixDQUFBO0FBRUFoQixnQ0FBQSxFQUFBO0FBRUEsTUFBSW5OLHlCQUFBLEVBQUosSUFBb0JKLHNCQUFRRSxDQUFBQSxNQUE1QjtBQUNFbUcsbUNBQUEsQ0FBZSxJQUFmLENBQUE7QUFERjtBQUlBLFFBQU1tSSxXQUFXLElBQUlDLGdCQUFKLENBQXFCUiw2QkFBckIsQ0FBakI7QUFDQU8sVUFBU0UsQ0FBQUEsT0FBVCxDQUFpQjVNLFFBQWpCLEVBQTJCLENBQ3pCNk0sVUFBVyxJQURjLEVBRXpCQyxRQUFTLElBRmdCLEVBQTNCLENBQUE7QUFJQVgsK0JBQUEsRUFBQTtBQWYyQjtBQW5EN0IsSUFBQS9PLGNBQUEsRUFBQTs7IiwKInNvdXJjZXMiOlsiLi9kZWZpbmVzLmpzIiwiLi9sb2dnZXIuanMiLCIuL2NvbW1vbi5qcyIsIi4vdmlkZW8uanMiLCIuL2xvY2FsaXphdGlvbi5qcyIsIi4vY2FwdGlvbnMuanMiLCIuL2J1dHRvbi5qcyIsIi4vcmVzb3VyY2VzL3lvdXR1YmUuanMiLCIuL3Jlc291cmNlcy95ZWxvcGxheS5qcyIsIi4vcmVzb3VyY2VzL3Zydi5qcyIsIi4vcmVzb3VyY2VzL3ZydC5qcyIsIi4vcmVzb3VyY2VzL3ZrLmpzIiwiLi9yZXNvdXJjZXMvdmllcnZpamZ6ZXMuanMiLCIuL3Jlc291cmNlcy92aWQuanMiLCIuL3Jlc291cmNlcy92aWNlLmpzIiwiLi9yZXNvdXJjZXMvdmV2by5qcyIsIi4vcmVzb3VyY2VzL3VzdHJlYW0uanMiLCIuL3Jlc291cmNlcy91ZGVteS5qcyIsIi4vcmVzb3VyY2VzL3R3aXRjaC5qcyIsIi4vcmVzb3VyY2VzL3RoZW9uaW9uLmpzIiwiLi9yZXNvdXJjZXMvdGVkLmpzIiwiLi9yZXNvdXJjZXMvc3RyZWFtYWJsZS5qcyIsIi4vcmVzb3VyY2VzL3Nlem5hbS5qcyIsIi4vcmVzb3VyY2VzL3BsZXguanMiLCIuL3Jlc291cmNlcy9wZXJpc2NvcGUuanMiLCIuL3Jlc291cmNlcy9wYnMuanMiLCIuL3Jlc291cmNlcy9vcGVubG9hZC5qcyIsIi4vcmVzb3VyY2VzL29jcy5qcyIsIi4vcmVzb3VyY2VzL25ldGZsaXguanMiLCIuL3Jlc291cmNlcy9tbGIuanMiLCIuL3Jlc291cmNlcy9taXhlci5qcyIsIi4vcmVzb3VyY2VzL21ldGFjYWZlLmpzIiwiLi9yZXNvdXJjZXMvbWFzaGFibGUuanMiLCIuL3Jlc291cmNlcy9saXR0bGV0aGluZ3MuanMiLCIuL3Jlc291cmNlcy9odWx1LmpzIiwiLi9yZXNvdXJjZXMvZ2lhbnRib21iLmpzIiwiLi9yZXNvdXJjZXMvZnVib3R2LmpzIiwiLi9yZXNvdXJjZXMvZXVyb3Nwb3J0cGxheWVyLmpzIiwiLi9yZXNvdXJjZXMvZXNwbi5qcyIsIi4vcmVzb3VyY2VzL2Rpc25leXBsdXMuanMiLCIuL3Jlc291cmNlcy9kYXpuLmpzIiwiLi9yZXNvdXJjZXMvY3VyaW9zaXR5c3RyZWFtLmpzIiwiLi9yZXNvdXJjZXMvY3J1bmNoeXJvbGwuanMiLCIuL3Jlc291cmNlcy9jZXNrYXRlbGV2aXplLmpzIiwiLi9yZXNvdXJjZXMvYmJjLmpzIiwiLi9yZXNvdXJjZXMvYXBwbGUuanMiLCIuL3Jlc291cmNlcy9hbWF6b24uanMiLCIuL3Jlc291cmNlcy9ha3R1YWxuZS5qcyIsIi4vcmVzb3VyY2VzLzlub3cuanMiLCIuL2NhY2hlLmpzIiwiLi9yZXNvdXJjZXMvaW5kZXguanMiLCIuL21haW4uanMiXSwKInNvdXJjZXNDb250ZW50IjpbIi8qKiBAZGVmaW5lIHtudW1iZXJ9IC0gRmxhZyB1c2VkIGJ5IGNsb3N1cmUgY29tcGlsZXIgdG8gc2V0IGxvZ2dpbmcgbGV2ZWwgKi9cbmV4cG9ydCBjb25zdCBMT0dHSU5HX0xFVkVMID0gMDtcblxuLyoqIEBkZWZpbmUge251bWJlcn0gLSBGbGFnIHVzZWQgYnkgY2xvc3VyZSBjb21waWxlciB0byB0YXJnZXQgc3BlY2lmaWMgYnJvd3NlciAqL1xuZXhwb3J0IGNvbnN0IEJST1dTRVIgPSAwOyIsImltcG9ydCB7IExPR0dJTkdfTEVWRUwgfSBmcm9tICcuL2RlZmluZXMuanMnXG5cbmNvbnN0IGxvZ2dpbmdQcmVmaXggPSAnW1BpUGVyXSAnO1xuXG4vKiogQGVudW0ge251bWJlcn0gLSBFbnVtIGZvciBsb2dnaW5nIGxldmVsICovXG5leHBvcnQgY29uc3QgTG9nZ2luZ0xldmVsID0ge1xuICBBTEw6IDAsXG4gIFRSQUNFOiAxMCxcbiAgSU5GTzogMjAsXG4gIFdBUk5JTkc6IDMwLFxuICBFUlJPUjogNDAsXG59O1xuXG4vKipcbiAqIExvZ3Mgc3RhY2sgdHJhY2UgdG8gY29uc29sZVxuICovXG5leHBvcnQgY29uc3QgdHJhY2UgPSAoTG9nZ2luZ0xldmVsLlRSQUNFID49IExPR0dJTkdfTEVWRUwpID8gXG4gICAgY29uc29sZS50cmFjZS5iaW5kKGNvbnNvbGUpIDogZnVuY3Rpb24oKXt9O1xuXG4vKipcbiAqIExvZ3MgaW5mb3JtYXRpb25hbCBtZXNzYWdlIHRvIGNvbnNvbGVcbiAqL1xuZXhwb3J0IGNvbnN0IGluZm8gPSAoTG9nZ2luZ0xldmVsLklORk8gPj0gTE9HR0lOR19MRVZFTCkgPyBcbiAgICBjb25zb2xlLmluZm8uYmluZChjb25zb2xlLCBsb2dnaW5nUHJlZml4KSA6IGZ1bmN0aW9uKCl7fTtcbiAgICBcbi8qKlxuICogTG9ncyB3YXJuaW5nIG1lc3NhZ2UgdG8gY29uc29sZVxuICovXG5leHBvcnQgY29uc3Qgd2FybiA9IChMb2dnaW5nTGV2ZWwuV0FSTklORyA+PSBMT0dHSU5HX0xFVkVMKSA/IFxuICAgIGNvbnNvbGUud2Fybi5iaW5kKGNvbnNvbGUsIGxvZ2dpbmdQcmVmaXgpIDogZnVuY3Rpb24oKXt9O1xuICAgIFxuLyoqXG4gKiBMb2dzIGVycm9yIG1lc3NhZ2UgdG8gY29uc29sZVxuICovXG5leHBvcnQgY29uc3QgZXJyb3IgPSAoTG9nZ2luZ0xldmVsLkVSUk9SID49IExPR0dJTkdfTEVWRUwpID8gXG4gICAgY29uc29sZS5lcnJvci5iaW5kKGNvbnNvbGUsIGxvZ2dpbmdQcmVmaXgpIDogZnVuY3Rpb24oKXt9OyIsImltcG9ydCB7IEJST1dTRVIgfSBmcm9tICcuL2RlZmluZXMuanMnXG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnLi9sb2dnZXIuanMnXG5cbi8qKiBAZW51bSB7bnVtYmVyfSAtIEVudW0gZm9yIGJyb3dzZXIgKi9cbmV4cG9ydCBjb25zdCBCcm93c2VyID0ge1xuICBVTktOT1dOOiAwLFxuICBTQUZBUkk6IDEsXG4gIENIUk9NRTogMixcbn07XG5cbi8qKlxuICogUmV0dXJucyBjdXJyZW50IHdlYiBicm93c2VyXG4gKlxuICogQHJldHVybiB7QnJvd3Nlcn0gXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRCcm93c2VyID0gZnVuY3Rpb24oKSB7XG4gIGlmIChCUk9XU0VSICE9IEJyb3dzZXIuVU5LTk9XTikge1xuICAgIHJldHVybiAvKiogQHR5cGUge0Jyb3dzZXJ9ICovIChCUk9XU0VSKTtcbiAgfVxuICBpZiAoL1NhZmFyaS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvQXBwbGUvLnRlc3QobmF2aWdhdG9yLnZlbmRvcikpIHtcbiAgICByZXR1cm4gQnJvd3Nlci5TQUZBUkk7XG4gIH1cbiAgaWYgKC9DaHJvbWUvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0dvb2dsZS8udGVzdChuYXZpZ2F0b3IudmVuZG9yKSkge1xuICAgIHJldHVybiBCcm93c2VyLkNIUk9NRTtcbiAgfVxuICByZXR1cm4gQnJvd3Nlci5VTktOT1dOO1xufTtcblxuLyoqXG4gKiBAdHlwZWRlZiB7e1xuICogICBidXR0b25DbGFzc05hbWU6IChzdHJpbmd8dW5kZWZpbmVkKSxcbiAqICAgYnV0dG9uRGlkQXBwZWFyOiAoZnVuY3Rpb24oKTp1bmRlZmluZWR8dW5kZWZpbmVkKSxcbiAqICAgYnV0dG9uRWxlbWVudFR5cGU6IChzdHJpbmd8dW5kZWZpbmVkKSxcbiAqICAgYnV0dG9uRXhpdEltYWdlOiAoc3RyaW5nfHVuZGVmaW5lZCksXG4gKiAgIGJ1dHRvbkhvdmVyU3R5bGU6IChzdHJpbmd8dW5kZWZpbmVkKSxcbiAqICAgYnV0dG9uSW1hZ2U6IChzdHJpbmd8dW5kZWZpbmVkKSxcbiAqICAgYnV0dG9uSW5zZXJ0QmVmb3JlOiAoZnVuY3Rpb24oRWxlbWVudCk6P05vZGV8dW5kZWZpbmVkKSxcbiAqICAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbihib29sZWFuPSk6P0VsZW1lbnQsXG4gKiAgIGJ1dHRvblNjYWxlOiAobnVtYmVyfHVuZGVmaW5lZCksXG4gKiAgIGJ1dHRvblN0eWxlOiAoc3RyaW5nfHVuZGVmaW5lZCksXG4gKiAgIGNhcHRpb25FbGVtZW50OiAoZnVuY3Rpb24oYm9vbGVhbj0pOj9FbGVtZW50fHVuZGVmaW5lZCksXG4gKiAgIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oYm9vbGVhbj0pOj9FbGVtZW50LFxuICogfX1cbiAqL1xubGV0IFBpcGVyUmVzb3VyY2U7XG5cbmxldCAvKiogP1BpcGVyUmVzb3VyY2UgKi8gY3VycmVudFJlc291cmNlID0gbnVsbDtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjdXJyZW50IHJlc291cmNlXG4gKlxuICogQHJldHVybiB7P1BpcGVyUmVzb3VyY2V9XG4gKi9cbmV4cG9ydCBjb25zdCBnZXRSZXNvdXJjZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY3VycmVudFJlc291cmNlO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBjdXJyZW50IHJlc291cmNlXG4gKlxuICogQHBhcmFtIHs/UGlwZXJSZXNvdXJjZX0gcmVzb3VyY2UgLSBhIHJlc291cmNlIHRvIHNldCBhcyBjdXJyZW50IHJlc291cmNlXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRSZXNvdXJjZSA9IGZ1bmN0aW9uKHJlc291cmNlKSB7XG4gIGN1cnJlbnRSZXNvdXJjZSA9IHJlc291cmNlO1xufTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIHJlbGF0aXZlIHBhdGggd2l0aGluIGFuIGV4dGVuc2lvbiB0byBhIGZ1bGx5LXF1YWxpZmllZCBVUkxcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIGEgcGF0aCB0byBhIHJlc291cmNlXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFxuICovXG5leHBvcnQgY29uc3QgZ2V0RXh0ZW5zaW9uVVJMID0gZnVuY3Rpb24ocGF0aCkge1xuICBzd2l0Y2ggKGdldEJyb3dzZXIoKSkge1xuICAgIGNhc2UgQnJvd3Nlci5TQUZBUkk6XG4gICAgICByZXR1cm4gc2FmYXJpLmV4dGVuc2lvbi5iYXNlVVJJICsgcGF0aDtcbiAgICBjYXNlIEJyb3dzZXIuQ0hST01FOlxuICAgICAgcmV0dXJuIGNocm9tZS5ydW50aW1lLmdldFVSTChwYXRoKTtcbiAgICBjYXNlIEJyb3dzZXIuVU5LTk9XTjpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHBhdGg7XG4gIH1cbn07XG5cbi8qKlxuICogQXBwbGllcyBmaXggdG8gYnlwYXNzIGJhY2tncm91bmQgRE9NIHRpbWVyIHRocm90dGxpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IGJ5cGFzc0JhY2tncm91bmRUaW1lclRocm90dGxpbmcgPSBmdW5jdGlvbigpIHtcblxuICAvLyBJc3N1ZSB3YXJuaW5nIGZvciB1bm5lY2Vzc2FyeSB1c2Ugb2YgYmFja2dyb3VuZCB0aW1lciB0aHJvdHRsaW5nXG4gIGlmICghY3VycmVudFJlc291cmNlLmNhcHRpb25FbGVtZW50KSB7XG4gICAgd2FybignVW5uZWNlc3NhcnkgYnlwYXNzaW5nIG9mIGJhY2tncm91bmQgdGltZXIgdGhyb3R0bGluZyBvbiBwYWdlIHdpdGhvdXQgY2FwdGlvbiBzdXBwb3J0Jyk7XG4gIH1cblxuICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHJlcXVlc3Qub3BlbignR0VUJywgZ2V0RXh0ZW5zaW9uVVJMKCdzY3JpcHRzL2ZpeC5qcycpKTtcbiAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICBzY3JpcHQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ21vZHVsZScpO1xuICAgIHNjcmlwdC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCkpO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgfTtcbiAgcmVxdWVzdC5zZW5kKCk7XG59OyIsImltcG9ydCB7IGluZm8gfSBmcm9tICcuL2xvZ2dlci5qcydcbmltcG9ydCB7IEJyb3dzZXIsIGdldEJyb3dzZXIsIGdldFJlc291cmNlIH0gZnJvbSAnLi9jb21tb24uanMnXG5cbmNvbnN0IENIUk9NRV9QTEFZSU5HX1BJUF9BVFRSSUJVVEUgPSAnZGF0YS1wbGF5aW5nLXBpY3R1cmUtaW4tcGljdHVyZSc7XG5cbmNvbnN0IC8qKiAhQXJyYXk8ZnVuY3Rpb24oSFRNTFZpZGVvRWxlbWVudCwgYm9vbGVhbik+ICovIGV2ZW50TGlzdGVuZXJzID0gW107XG5cbi8qKlxuICogVG9nZ2xlcyB2aWRlbyBQaWN0dXJlIGluIFBpY3R1cmVcbiAqXG4gKiBAcGFyYW0ge0hUTUxWaWRlb0VsZW1lbnR9IHZpZGVvIC0gdmlkZW8gZWxlbWVudCB0byB0b2dnbGUgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGVcbiAqL1xuZXhwb3J0IGNvbnN0IHRvZ2dsZVBpY3R1cmVJblBpY3R1cmUgPSBmdW5jdGlvbih2aWRlbykge1xuICBjb25zdCBwbGF5aW5nUGljdHVyZUluUGljdHVyZSA9IHZpZGVvUGxheWluZ1BpY3R1cmVJblBpY3R1cmUodmlkZW8pO1xuICBzd2l0Y2ggKGdldEJyb3dzZXIoKSkge1xuICAgIGNhc2UgQnJvd3Nlci5TQUZBUkk6XG4gICAgICBpZiAocGxheWluZ1BpY3R1cmVJblBpY3R1cmUpIHtcbiAgICAgIFx0dmlkZW8ud2Via2l0U2V0UHJlc2VudGF0aW9uTW9kZSgnaW5saW5lJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2aWRlby53ZWJraXRTZXRQcmVzZW50YXRpb25Nb2RlKCdwaWN0dXJlLWluLXBpY3R1cmUnKTtcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgQnJvd3Nlci5DSFJPTUU6XG4gICAgICBpZiAocGxheWluZ1BpY3R1cmVJblBpY3R1cmUpIHtcbiAgICAgICAgLy8gV29ya2Fyb3VuZCBDaHJvbWUgY29udGVudCBzY3JpcHRzIGJlaW5nIHVuYWJsZSB0byBjYWxsICdleGl0UGljdHVyZUluUGljdHVyZScgZGlyZWN0bHlcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIHNjcmlwdC50ZXh0Q29udGVudCA9ICdkb2N1bWVudC5leGl0UGljdHVyZUluUGljdHVyZSgpJztcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgICAgICBzY3JpcHQucmVtb3ZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBGb3JjZSBlbmFibGUgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUgc3VwcG9ydFxuICAgICAgICB2aWRlby5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVwaWN0dXJlaW5waWN0dXJlJyk7XG4gICAgICAgIFxuICAgICAgICB2aWRlby5yZXF1ZXN0UGljdHVyZUluUGljdHVyZSgpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSBCcm93c2VyLlVOS05PV046XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG59O1xuXG4vKipcbiAqIEFkZHMgYSBQaWN0dXJlIGluIFBpY3R1cmUgZXZlbnQgbGlzdGVuZXJcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKEhUTUxWaWRlb0VsZW1lbnQsIGJvb2xlYW4pfSBsaXN0ZW5lciAtIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGFkZFxuICovXG5leHBvcnQgY29uc3QgYWRkUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbihsaXN0ZW5lcikge1xuICBjb25zdCBpbmRleCA9IGV2ZW50TGlzdGVuZXJzLmluZGV4T2YobGlzdGVuZXIpO1xuICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICBldmVudExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgfVxuXG4gIGlmIChnZXRCcm93c2VyKCkgPT0gQnJvd3Nlci5TQUZBUkkpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd3ZWJraXRwcmVzZW50YXRpb25tb2RlY2hhbmdlZCcsIHZpZGVvUHJlc2VudGF0aW9uTW9kZUNoYW5nZWQsIHtcbiAgICAgIGNhcHR1cmU6IHRydWUsXG4gICAgfSk7XG4gIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIFBpY3R1cmUgaW4gUGljdHVyZSBldmVudCBsaXN0ZW5lclxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oSFRNTFZpZGVvRWxlbWVudCxib29sZWFuKX0gbGlzdGVuZXIgLSBhbiBldmVudCBsaXN0ZW5lciB0byByZW1vdmVcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbW92ZVBpY3R1cmVJblBpY3R1cmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24obGlzdGVuZXIpIHtcbiAgY29uc3QgaW5kZXggPSBldmVudExpc3RlbmVycy5pbmRleE9mKGxpc3RlbmVyKTtcbiAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICBldmVudExpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG4gIFxuICBpZiAoZ2V0QnJvd3NlcigpID09IEJyb3dzZXIuU0FGQVJJICYmIGV2ZW50TGlzdGVuZXJzLmxlbmd0aCA9PSAwKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignd2Via2l0cHJlc2VudGF0aW9ubW9kZWNoYW5nZWQnLCB2aWRlb1ByZXNlbnRhdGlvbk1vZGVDaGFuZ2VkKTsgICAgXG4gIH1cbn07XG5cbi8qKlxuICogRGlzcGF0Y2hlcyBhIFBpY3R1cmUgaW4gUGljdHVyZSBldmVudFxuICpcbiAqIEBwYXJhbSB7SFRNTFZpZGVvRWxlbWVudH0gdmlkZW8gLSB0YXJnZXQgdmlkZW8gZWxlbWVudFxuICovXG5jb25zdCBkaXNwYXRjaFBpY3R1cmVJblBpY3R1cmVFdmVudCA9IGZ1bmN0aW9uKHZpZGVvKSB7XG4gIFxuICAvLyBJZ25vcmUgZXZlbnRzIGZyb20gb3RoZXIgdmlkZW8gZWxlbWVudHMgZS5nLiBhZHZlcnRzXG4gIGNvbnN0IGV4cGVjdGVkVmlkZW8gPSBnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCh0cnVlKTtcbiAgaWYgKHZpZGVvICE9IGV4cGVjdGVkVmlkZW8pIHJldHVybjtcblxuICBjb25zdCBpc1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlID0gdmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSh2aWRlbyk7XG4gIGlmIChpc1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlKSB7XG4gICAgaW5mbygnVmlkZW8gZW50ZXJpbmcgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUnKTtcbiAgfSBlbHNlIHtcbiAgICBpbmZvKCdWaWRlbyBsZWF2aW5nIFBpY3R1cmUgaW4gUGljdHVyZSBtb2RlJyk7XG4gIH1cblxuICAvLyBDYWxsIGV2ZW50IGxpc3RlbmVycyB1c2luZyBhIGNvcHkgdG8gcHJldmVudCBwb3NzaWJsaXR5IG9mIGVuZGxlc3MgbG9vcGluZ1xuICBjb25zdCBldmVudExpc3RlbmVyc0NvcHkgPSBldmVudExpc3RlbmVycy5zbGljZSgpO1xuICBmb3IgKGxldCBsaXN0ZW5lcjsgbGlzdGVuZXIgPSBldmVudExpc3RlbmVyc0NvcHkucG9wKCk7KSB7XG4gICAgbGlzdGVuZXIodmlkZW8sIGlzUGxheWluZ1BpY3R1cmVJblBpY3R1cmUpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2hlcyBhIFBpY3R1cmUgaW4gUGljdHVyZSBldmVudCBmb3IgZXZlcnkgJ3dlYmtpdHByZXNlbnRhdGlvbm1vZGVjaGFuZ2VkJyBldmVudFxuICpcbiAqIEBwYXJhbSB7IUV2ZW50fSBldmVudCAtIGEgd2Via2l0cHJlc2VudGF0aW9ubW9kZWNoYW5nZWQgZXZlbnRcbiAqL1xuY29uc3QgdmlkZW9QcmVzZW50YXRpb25Nb2RlQ2hhbmdlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnN0IHZpZGVvID0gIC8qKiBAdHlwZSB7SFRNTFZpZGVvRWxlbWVudH0gKi8gKGV2ZW50LnRhcmdldCk7XG4gIGRpc3BhdGNoUGljdHVyZUluUGljdHVyZUV2ZW50KHZpZGVvKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHZpZGVvIGlzIHBsYXlpbmcgUGljdHVyZSBpbiBQaWN0dXJlXG4gKlxuICogQHBhcmFtIHtIVE1MVmlkZW9FbGVtZW50fSB2aWRlbyAtIHZpZGVvIGVsZW1lbnQgdG8gdGVzdFxuICogQHJldHVybiB7Ym9vbGVhbn0gXG4gKi9cbmV4cG9ydCBjb25zdCB2aWRlb1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlID0gZnVuY3Rpb24odmlkZW8pIHtcbiAgc3dpdGNoIChnZXRCcm93c2VyKCkpIHtcbiAgICBjYXNlIEJyb3dzZXIuU0FGQVJJOlxuICAgICAgcmV0dXJuIHZpZGVvLndlYmtpdFByZXNlbnRhdGlvbk1vZGUgPT0gJ3BpY3R1cmUtaW4tcGljdHVyZSc7XG4gICAgY2FzZSBCcm93c2VyLkNIUk9NRTpcbiAgICAgIHJldHVybiB2aWRlby5oYXNBdHRyaWJ1dGUoQ0hST01FX1BMQVlJTkdfUElQX0FUVFJJQlVURSk7XG4gICAgY2FzZSBCcm93c2VyLlVOS05PV046XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuLyoqXG4gKiBTZXRzIFBpY3R1cmUgaW4gUGljdHVyZSBhdHRyaWJ1dGUgYW5kIHRvZ2dsZXMgY2FwdGlvbnMgb24gZW50ZXJpbmcgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGVcbiAqXG4gKiBAcGFyYW0geyFFdmVudH0gZXZlbnQgLSBhbiBlbnRlcnBpY3R1cmVpbnBpY3R1cmUgZXZlbnRcbiAqL1xuY29uc3QgdmlkZW9EaWRFbnRlclBpY3R1cmVJblBpY3R1cmUgPSBmdW5jdGlvbihldmVudCkge1xuICBjb25zdCB2aWRlbyA9IC8qKiBAdHlwZSB7SFRNTFZpZGVvRWxlbWVudH0gKi8gKGV2ZW50LnRhcmdldCk7XG5cbiAgLy8gU2V0IHBsYXlpbmcgaW4gUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUgYXR0cmlidXRlIGFuZCBkaXNwYXRjaCBldmVudFxuICB2aWRlby5zZXRBdHRyaWJ1dGUoQ0hST01FX1BMQVlJTkdfUElQX0FUVFJJQlVURSwgdHJ1ZSk7XG4gIGRpc3BhdGNoUGljdHVyZUluUGljdHVyZUV2ZW50KHZpZGVvKTtcblxuICAvLyBSZW1vdmUgUGljdHVyZSBpbiBQaWN0dXJlIGF0dHJpYnV0ZSBhbmQgZGlzcGF0Y2ggZXZlbnQgb24gbGVhdmluZyBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZVxuICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdsZWF2ZXBpY3R1cmVpbnBpY3R1cmUnLCBmdW5jdGlvbihldmVudCkge1xuICAgIHZpZGVvLnJlbW92ZUF0dHJpYnV0ZShDSFJPTUVfUExBWUlOR19QSVBfQVRUUklCVVRFKTtcbiAgICBkaXNwYXRjaFBpY3R1cmVJblBpY3R1cmVFdmVudCh2aWRlbyk7XG4gIH0sIHsgb25jZTogdHJ1ZSB9KTtcbn07XG5cbi8qKlxuICogQWRkcyBQaWN0dXJlIGluIFBpY3R1cmUgZXZlbnQgbGlzdGVuZXJzIHRvIGFsbCB2aWRlbyBlbGVtZW50c1xuICovXG5leHBvcnQgY29uc3QgYWRkVmlkZW9FbGVtZW50TGlzdGVuZXJzID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3ZpZGVvJyk7XG4gIGZvciAobGV0IGluZGV4ID0gMCwgZWxlbWVudDsgZWxlbWVudCA9IGVsZW1lbnRzW2luZGV4XTsgaW5kZXgrKykge1xuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZW50ZXJwaWN0dXJlaW5waWN0dXJlJywgdmlkZW9EaWRFbnRlclBpY3R1cmVJblBpY3R1cmUpO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgZXJyb3IgfSBmcm9tICcuL2xvZ2dlci5qcydcblxuY29uc3QgbG9jYWxpemF0aW9ucyA9IHt9O1xuXG5sb2NhbGl6YXRpb25zWydidXR0b24tdGl0bGUnXSA9IHtcbiAgJ2VuJzogJ09wZW4gUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUnLFxuICAnZGUnOiAnQmlsZC1pbi1CaWxkIHN0YXJ0ZW4nLFxuICAnbmwnOiAnQmVlbGQgaW4gYmVlbGQgc3RhcnRlbicsXG4gICdmcic6ICdEXHUwMGU5bWFycmVyIEltYWdlIGRhbnMgbFx1MjAxOWltYWdlJyxcbn07XG5cbmxvY2FsaXphdGlvbnNbJ2RvbmF0ZSddID0ge1xuICAnZW4nOiAnRG9uYXRlJyxcbiAgJ2RlJzogJ1NwZW5kZW4nLFxufTtcblxubG9jYWxpemF0aW9uc1snZG9uYXRlLXNtYWxsJ10gPSB7XG4gICdlbic6ICdTbWFsbCBkb25hdGlvbicsXG59O1xuXG5sb2NhbGl6YXRpb25zWydkb25hdGUtbWVkaXVtJ10gPSB7XG4gICdlbic6ICdNZWRpdW0gZG9uYXRpb24nLFxufTtcblxubG9jYWxpemF0aW9uc1snZG9uYXRlLWxhcmdlJ10gPSB7XG4gICdlbic6ICdHcmFuZCBkb25hdGlvbicsXG59O1xuXG5sb2NhbGl6YXRpb25zWyd0b3RhbC1kb25hdGlvbnMnXSA9IHtcbiAgJ2VuJzogJ1RvdGFsIGRvbmF0aW9uczonLFxufTtcblxubG9jYWxpemF0aW9uc1snZG9uYXRlLWVycm9yJ10gPSB7XG4gICdlbic6ICdJbi1hcHAgcHVyY2hhc2UgdW5hdmFpbGFibGUnLFxufTtcblxubG9jYWxpemF0aW9uc1sncmVwb3J0LWJ1ZyddID0ge1xuICAnZW4nOiAnUmVwb3J0IGEgYnVnJyxcbiAgJ2RlJzogJ0VpbmVuIEZlaGxlciBtZWxkZW4nLFxufTtcblxubG9jYWxpemF0aW9uc1snb3B0aW9ucyddID0ge1xuICAnZW4nOiAnT3B0aW9ucycsXG59O1xuXG5sb2NhbGl6YXRpb25zWydpbnN0YWxsLXRoYW5rcyddID0ge1xuICAnZW4nOiAnVGhhbmtzIGZvciBhZGRpbmcgUGlQZXIhJyxcbn07XG5cbmxvY2FsaXphdGlvbnNbJ2VuYWJsZSddID0ge1xuICAnZW4nOiAnRW5hYmxlJyxcbn07XG5cbmxvY2FsaXphdGlvbnNbJ3NhZmFyaS1kaXNhYmxlZC13YXJuaW5nJ10gPSB7XG4gICdlbic6ICdFeHRlbnNpb24gaXMgY3VycmVudGx5IGRpc2FibGVkLCBlbmFibGUgaW4gU2FmYXJpIHByZWZlcmVuY2VzJyxcbn07XG5cbmxvY2FsaXphdGlvbnNbJ2Nocm9tZS1mbGFncy1vcGVuJ10gPSB7XG4gICdlbic6ICdPcGVuIENocm9tZSBGbGFncycsXG59O1xuXG5sb2NhbGl6YXRpb25zWydjaHJvbWUtZmxhZ3Mtd2FybmluZyddID0ge1xuICAnZW4nOiAnQmVmb3JlIHlvdSBnZXQgc3RhcnRlZCB5b3UgbmVlZCB0byBlbmFibGUgdGhlIGNocm9tZSBmbGFnIFtlbXBoYXNpc11cIlN1cmZhY2VMYXllciBvYmplY3RzIGZvciB2aWRlb3NcIlsvZW1waGFzaXNdJyxcbn07XG5cbi8vIFNldCBFbmdsaXNoIGFzIHRoZSBkZWZhdWx0IGZhbGxiYWNrIGxhbmd1YWdlXG5jb25zdCBkZWZhdWx0TGFuZ3VhZ2UgPSAnZW4nO1xuXG4vKipcbiAqIFJldHVybnMgYSBsb2NhbGl6ZWQgdmVyc2lvbiBvZiB0aGUgc3RyaW5nIGRlc2lnbmF0ZWQgYnkgdGhlIHNwZWNpZmllZCBrZXlcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gdGhlIGtleSBmb3IgYSBzdHJpbmcgXG4gKiBAcGFyYW0ge3N0cmluZz19IGxhbmd1YWdlIC0gdHdvLWxldHRlciBJU08gNjM5LTEgbGFuZ3VhZ2UgY29kZVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgY29uc3QgbG9jYWxpemVkU3RyaW5nID0gZnVuY3Rpb24oa2V5LCBsYW5ndWFnZSA9IG5hdmlnYXRvci5sYW5ndWFnZS5zdWJzdHJpbmcoMCwgMikpIHtcbiAgXG4gIC8vIEdldCBhbGwgbG9jYWxpemF0aW9ucyBmb3Iga2V5XG4gIGNvbnN0IC8qKiBPYmplY3Q8c3RyaW5nLHN0cmluZz4gKi8gbG9jYWxpemF0aW9uc0ZvcktleSA9IGxvY2FsaXphdGlvbnNba2V5XTtcbiAgaWYgKGxvY2FsaXphdGlvbnNGb3JLZXkpIHtcbiAgICBcbiAgICAvLyBHZXQgdGhlIHVzZXJzIHNwZWNpZmljIGxvY2FsaXphdGlvbiBvciBmYWxsYmFjayB0byBkZWZhdWx0IGxhbmd1YWdlXG4gICAgbGV0IHN0cmluZyA9IGxvY2FsaXphdGlvbnNGb3JLZXlbbGFuZ3VhZ2VdIHx8IGxvY2FsaXphdGlvbnNGb3JLZXlbZGVmYXVsdExhbmd1YWdlXTtcbiAgICBpZiAoc3RyaW5nKSByZXR1cm4gc3RyaW5nO1xuICB9XG4gIFxuICBlcnJvcihgTm8gbG9jYWxpemVkIHN0cmluZyBmb3VuZCBmb3Iga2V5ICcke2tleX0nYCk7XG4gIHJldHVybiAnJztcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIGxvY2FsaXplZCB2ZXJzaW9uIG9mIHRoZSBzdHJpbmcgZGVzaWduYXRlZCBieSB0aGUgc3BlY2lmaWVkIGtleSB3aXRoIHRhZ3MgcmVwbGFjZWRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gdGhlIGtleSBmb3IgYSBzdHJpbmcgXG4gKiBAcGFyYW0ge0FycmF5PEFycmF5PHN0cmluZz4+fSByZXBsYWNlbWVudHMgLSBhbiBhcnJheSBvZiBhcnJheXMgY29udGFpbmluZyBwYWlycyBvZiB0YWdzIGFuZCB0aGVpciByZXBsYWNlbWVudFxuICogQHBhcmFtIHtzdHJpbmc9fSBsYW5ndWFnZSAtIHR3by1sZXR0ZXIgSVNPIDYzOS0xIGxhbmd1YWdlIGNvZGVcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGNvbnN0IGxvY2FsaXplZFN0cmluZ1dpdGhSZXBsYWNlbWVudHMgPSBmdW5jdGlvbihrZXksIHJlcGxhY2VtZW50cywgbGFuZ3VhZ2UpIHtcbiAgXG4gIGxldCBzdHJpbmcgPSBsb2NhbGl6ZWRTdHJpbmcoa2V5LCBsYW5ndWFnZSk7XG4gIFxuICAvLyBSZXBsYWNlIHRhZ3Mgb2YgdGhlIGZvcm0gW1hYWF0gd2l0aCBkaXJlY3RlZCByZXBsYWNlbWVudHMgaWYgbmVlZGVkXG4gIGZvciAobGV0IGluZGV4ID0gcmVwbGFjZW1lbnRzLmxlbmd0aDsgaW5kZXgtLTsgKSB7XG4gICAgbGV0IHJlcGxhY2VtZW50ID0gcmVwbGFjZW1lbnRzW2luZGV4XTtcbiAgICBcbiAgICAvLyBFbnN1cmUgdGFncyBkbyBub3QgY29udGFpbiBzcGVjaWFsIGNoYXJhY3RlcnMgKHRoaXMgZ2V0cyBvcHRpbWlzZWQgYXdheSBhcyBvcHBvc2VkIHRvIGVzY2FwaW5nIHRoZSB0YWdzIHdpdGggdGhlIGFzc29jaWF0ZWQgcGVyZm9ybWFuY2UgY29zdClcbiAgICBpZiAoL1teLV8wLTlhLXpBLVpcXC9dLy50ZXN0KHJlcGxhY2VtZW50WzBdKSkge1xuICAgICAgZXJyb3IoYEludmFsaWQgY2hhcmFjdGVycyB1c2VkIGluIGxvY2FsaXplZCBzdHJpbmcgdGFnICcke3JlcGxhY2VtZW50WzBdfSdgKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgcmVnZXggPSBuZXcgUmVnRXhwKGBcXFxcXFxbJHtyZXBsYWNlbWVudFswXX1cXFxcXFxdYCwgJ2cnKTtcbiAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShyZWdleCwgcmVwbGFjZW1lbnRbMV0pO1xuICB9XG5cbiAgcmV0dXJuIHN0cmluZztcbn07XG4iLCJpbXBvcnQgeyBpbmZvIH0gZnJvbSAnLi9sb2dnZXIuanMnXG5pbXBvcnQgeyBCcm93c2VyLCBnZXRCcm93c2VyLCBnZXRSZXNvdXJjZSB9IGZyb20gJy4vY29tbW9uLmpzJ1xuaW1wb3J0IHsgdmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSwgYWRkUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIsIHJlbW92ZVBpY3R1cmVJblBpY3R1cmVFdmVudExpc3RlbmVyIH0gZnJvbSAnLi92aWRlby5qcydcblxuY29uc3QgVFJBQ0tfSUQgPSAnUGlQZXJfdHJhY2snO1xuXG5sZXQgLyoqID9UZXh0VHJhY2sgKi8gdHJhY2sgPSBudWxsO1xubGV0IC8qKiBib29sZWFuICovIGNhcHRpb25zRW5hYmxlZCA9IGZhbHNlO1xubGV0IC8qKiBib29sZWFuICovIHNob3dpbmdDYXB0aW9ucyA9IGZhbHNlO1xubGV0IC8qKiBib29sZWFuICovIHNob3dpbmdFbXB0eUNhcHRpb24gPSBmYWxzZTtcbmxldCAvKiogc3RyaW5nICovIGxhc3RVbnByb2Nlc3NlZENhcHRpb24gPSAnJztcblxuLyoqXG4gKiBEaXNhYmxlIGNsb3NlZCBjYXB0aW9uIHN1cHBvcnQgaW4gUGljdHVyZSBpbiBQaWN0dXJlIG1vZGVcbiAqL1xuZXhwb3J0IGNvbnN0IGRpc2FibGVDYXB0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICBjYXB0aW9uc0VuYWJsZWQgPSBmYWxzZTtcbiAgc2hvd2luZ0NhcHRpb25zID0gZmFsc2U7XG4gIHByb2Nlc3NDYXB0aW9ucygpO1xuICByZW1vdmVQaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lcihwaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lcik7XG5cbiAgaW5mbygnQ2xvc2VkIGNhcHRpb24gc3VwcG9ydCBkaXNhYmxlZCcpO1xufTtcblxuLyoqXG4gKiBFbmFibGUgY2xvc2VkIGNhcHRpb24gc3VwcG9ydCBpbiBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZVxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbj19IGlnbm9yZU5vd1BsYXlpbmdDaGVjayAtIGFzc3VtZXMgdmlkZW8gaXNuJ3QgYWxyZWFkeSBwbGF5aW5nIFBpY3R1cmUgaW4gUGljdHVyZVxuICovXG5leHBvcnQgY29uc3QgZW5hYmxlQ2FwdGlvbnMgPSBmdW5jdGlvbihpZ25vcmVOb3dQbGF5aW5nQ2hlY2spIHsgIFxuXG4gIGlmICghZ2V0UmVzb3VyY2UoKS5jYXB0aW9uRWxlbWVudCkgcmV0dXJuO1xuXG4gIGNhcHRpb25zRW5hYmxlZCA9IHRydWU7XG4gIGFkZFBpY3R1cmVJblBpY3R1cmVFdmVudExpc3RlbmVyKHBpY3R1cmVJblBpY3R1cmVFdmVudExpc3RlbmVyKTtcbiAgXG4gIGluZm8oJ0Nsb3NlZCBjYXB0aW9uIHN1cHBvcnQgZW5hYmxlZCcpO1xuXG4gIGlmIChpZ25vcmVOb3dQbGF5aW5nQ2hlY2spIHJldHVybjtcblxuICBjb25zdCB2aWRlbyA9IC8qKiBAdHlwZSB7P0hUTUxWaWRlb0VsZW1lbnR9ICovIChnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCh0cnVlKSk7XG4gIGlmICghdmlkZW8pIHJldHVybjtcbiAgc2hvd2luZ0NhcHRpb25zID0gdmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSh2aWRlbyk7XG4gIHRyYWNrID0gZ2V0Q2FwdGlvblRyYWNrKHZpZGVvKTtcbiAgcHJvY2Vzc0NhcHRpb25zKCk7XG59O1xuXG4vKipcbiAqIENoZWNrcyB3aGV0aGVyIHByb2Nlc3NpbmcgY2xvc2VkIGNhcHRpb25zIGlzIHJlcXVpcmVkXG4gKlxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGNvbnN0IHNob3VsZFByb2Nlc3NDYXB0aW9ucyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gY2FwdGlvbnNFbmFibGVkICYmIHNob3dpbmdDYXB0aW9ucztcbn07XG5cbi8qKlxuICogR2V0cyBjYXB0aW9uIHRyYWNrIGZvciB2aWRlbyAoY3JlYXRlcyBvciByZXR1cm5zIGV4aXN0aW5nIHRyYWNrIGFzIG5lZWRlZClcbiAqXG4gKiBAcGFyYW0ge0hUTUxWaWRlb0VsZW1lbnR9IHZpZGVvIC0gdmlkZW8gZWxlbWVudCB0aGF0IHdpbGwgZGlzcGxheSBjYXB0aW9uc1xuICogQHJldHVybiB7VGV4dFRyYWNrfVxuICovXG5jb25zdCBnZXRDYXB0aW9uVHJhY2sgPSBmdW5jdGlvbih2aWRlbykge1xuXG4gIC8vIEZpbmQgZXhpc3RpbmcgY2FwdGlvbiB0cmFja1xuICBjb25zdCBhbGxUcmFja3MgPSB2aWRlby50ZXh0VHJhY2tzO1xuICBmb3IgKGxldCB0cmFja0lkID0gYWxsVHJhY2tzLmxlbmd0aDsgdHJhY2tJZC0tOykge1xuICAgIGlmIChhbGxUcmFja3NbdHJhY2tJZF0ubGFiZWwgPT09IFRSQUNLX0lEKSB7XG4gICAgICBpbmZvKCdFeGlzdGluZyBjYXB0aW9uIHRyYWNrIGZvdW5kJyk7XG4gICAgICByZXR1cm4gYWxsVHJhY2tzW3RyYWNrSWRdO1xuICAgIH1cbiAgfVxuXG4gIC8vIE90aGVyd2lzZSBjcmVhdGUgbmV3IGNhcHRpb24gdHJhY2tcbiAgaW5mbygnQ2FwdGlvbiB0cmFjayBjcmVhdGVkJyk7XG4gIHJldHVybiB2aWRlby5hZGRUZXh0VHJhY2soJ2NhcHRpb25zJywgVFJBQ0tfSUQsICdlbicpO1xufTtcblxuLyoqXG4gKiBBZGRzIGNhcHRpb24gdHJhY2tzIHRvIGFsbCB2aWRlbyBlbGVtZW50c1xuICovXG5leHBvcnQgY29uc3QgYWRkVmlkZW9DYXB0aW9uVHJhY2tzID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3ZpZGVvJyk7XG4gIGZvciAobGV0IGluZGV4ID0gMCwgZWxlbWVudDsgZWxlbWVudCA9IGVsZW1lbnRzW2luZGV4XTsgaW5kZXgrKykge1xuICAgIGdldENhcHRpb25UcmFjaygvKiogQHR5cGUgez9IVE1MVmlkZW9FbGVtZW50fSAqLyAoZWxlbWVudCkpO1xuICB9XG59O1xuXG4vKipcbiAqIFRvZ2dsZXMgY2FwdGlvbnMgd2hlbiB2aWRlbyBlbnRlcnMgb3IgZXhpdHMgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGVcbiAqXG4gKiBAcGFyYW0ge0hUTUxWaWRlb0VsZW1lbnR9IHZpZGVvIC0gdGFyZ2V0IHZpZGVvIGVsZW1lbnRcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNQbGF5aW5nUGljdHVyZUluUGljdHVyZSAtIHRydWUgaWYgdmlkZW8gcGxheWluZyBQaWN0dXJlIGluIFBpY3R1cmVcbiAqL1xuY29uc3QgcGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbih2aWRlbywgaXNQbGF5aW5nUGljdHVyZUluUGljdHVyZSkge1xuICBcbiAgLy8gVG9nZ2xlIGRpc3BsYXkgb2YgdGhlIGNhcHRpb25zIGFuZCBwcmVwYXJlIHZpZGVvIGlmIG5lZWRlZFxuICBzaG93aW5nQ2FwdGlvbnMgPSBpc1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlO1xuICBpZiAoc2hvd2luZ0NhcHRpb25zKSB7XG4gICAgdHJhY2sgPSBnZXRDYXB0aW9uVHJhY2sodmlkZW8pO1xuICAgIHRyYWNrLm1vZGUgPSAnc2hvd2luZyc7XG4gIH1cbiAgbGFzdFVucHJvY2Vzc2VkQ2FwdGlvbiA9ICcnO1xuICBwcm9jZXNzQ2FwdGlvbnMoKTtcblxuICBpbmZvKGBWaWRlbyBwcmVzZW50YXRpb24gbW9kZSBjaGFuZ2VkIChzaG93aW5nQ2FwdGlvbnM6ICR7c2hvd2luZ0NhcHRpb25zfSlgKTtcbn07XG5cbi8qKlxuICogUmVtb3ZlcyB2aXNpYmxlIFBpY3R1cmUgaW4gUGljdHVyZSBtb2RlIGNhcHRpb25zXG4gKlxuICogQHBhcmFtIHtIVE1MVmlkZW9FbGVtZW50fSB2aWRlbyAtIHZpZGVvIGVsZW1lbnQgc2hvd2luZyBjYXB0aW9uc1xuICogQHBhcmFtIHtib29sZWFuPX0gd29ya2Fyb3VuZCAtIGFwcGx5IFNhZmFyaSBidWcgd29ya2Fyb3VuZFxuICovXG5jb25zdCByZW1vdmVDYXB0aW9ucyA9IGZ1bmN0aW9uKHZpZGVvLCB3b3JrYXJvdW5kID0gdHJ1ZSkge1xuXG4gIHdoaWxlICh0cmFjay5hY3RpdmVDdWVzLmxlbmd0aCkge1xuICAgIHRyYWNrLnJlbW92ZUN1ZSh0cmFjay5hY3RpdmVDdWVzWzBdKTtcbiAgfVxuXG4gIC8vIFdvcmthcm91bmQgU2FmYXJpIGJ1ZzsgJ3JlbW92ZUN1ZScgZG9lc24ndCBpbW1lZGlhdGVseSByZW1vdmUgY2FwdGlvbnMgc2hvd24gaW4gUGljdHVyZSBpbiBQaWN0dXJlIG1vZGVcbiAgaWYgKGdldEJyb3dzZXIoKSA9PSBCcm93c2VyLlNBRkFSSSAmJiB3b3JrYXJvdW5kICYmIHZpZGVvICYmICFzaG93aW5nRW1wdHlDYXB0aW9uKSB7XG4gICAgdHJhY2suYWRkQ3VlKG5ldyBWVFRDdWUodmlkZW8uY3VycmVudFRpbWUsIHZpZGVvLmN1cnJlbnRUaW1lICsgNjAsICcnKSk7XG4gICAgc2hvd2luZ0VtcHR5Q2FwdGlvbiA9IHRydWU7XG4gIH1cbn07XG5cbi8qKlxuICogRGlzcGxheXMgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUgY2FwdGlvblxuICpcbiAqIEBwYXJhbSB7SFRNTFZpZGVvRWxlbWVudH0gdmlkZW8gLSB2aWRlbyBlbGVtZW50IHNob3dpbmcgY2FwdGlvbnNcbiAqIEBwYXJhbSB7c3RyaW5nfSBjYXB0aW9uIC0gYSBjYXB0aW9uIHRvIGRpc3BsYXlcbiAqL1xuY29uc3QgYWRkQ2FwdGlvbiA9IGZ1bmN0aW9uKHZpZGVvLCBjYXB0aW9uKSB7XG5cbiAgaW5mbyhgU2hvd2luZyBjYXB0aW9uICcke2NhcHRpb259J2ApO1xuICB0cmFjay5tb2RlID0gJ3Nob3dpbmcnO1xuICB0cmFjay5hZGRDdWUobmV3IFZUVEN1ZSh2aWRlby5jdXJyZW50VGltZSwgdmlkZW8uY3VycmVudFRpbWUgKyA2MCwgY2FwdGlvbikpO1xuXG4gIGlmIChnZXRCcm93c2VyKCkgPT0gQnJvd3Nlci5TQUZBUkkpIHtcbiAgICBzaG93aW5nRW1wdHlDYXB0aW9uID0gZmFsc2U7XG4gIH1cbn07XG5cbi8qKlxuICogVXBkYXRlcyB2aXNpYmxlIGNhcHRpb25zXG4gKi9cbmV4cG9ydCBjb25zdCBwcm9jZXNzQ2FwdGlvbnMgPSBmdW5jdGlvbigpIHtcblxuICAvLyBHZXQgaGFuZGxlcyB0byBjYXB0aW9uIGFuZCB2aWRlbyBlbGVtZW50c1xuICBjb25zdCBjYXB0aW9uRWxlbWVudCA9IGdldFJlc291cmNlKCkuY2FwdGlvbkVsZW1lbnQoKTtcbiAgY29uc3QgdmlkZW8gPSAvKiogQHR5cGUgez9IVE1MVmlkZW9FbGVtZW50fSAqLyAoZ2V0UmVzb3VyY2UoKS52aWRlb0VsZW1lbnQoKSk7XG4gIFxuICAvLyBSZW1vdmUgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUgY2FwdGlvbnMgYW5kIHNob3cgbmF0aXZlIGNhcHRpb25zIGlmIG5vIGxvbmdlciBzaG93aW5nIGNhcHRpb25zIG9yIGVuY291bnRlcmVkIGFuIGVycm9yXG4gIGlmICghc2hvd2luZ0NhcHRpb25zIHx8ICFjYXB0aW9uRWxlbWVudCkge1xuICAgIHJlbW92ZUNhcHRpb25zKHZpZGVvKTtcbiAgICBpZiAoY2FwdGlvbkVsZW1lbnQpIGNhcHRpb25FbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBPdGhlcndpc2UgZW5zdXJlIG5hdGl2ZSBjYXB0aW9ucyByZW1haW4gaGlkZGVuXG4gIGNhcHRpb25FbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcblxuICAvLyBDaGVjayBpZiBhIG5ldyBuYXRpdmUgY2FwdGlvbiBuZWVkcyB0byBiZSBwcm9jZXNzZWRcbiAgY29uc3QgdW5wcm9jZXNzZWRDYXB0aW9uID0gY2FwdGlvbkVsZW1lbnQudGV4dENvbnRlbnQ7XG4gIGlmICh1bnByb2Nlc3NlZENhcHRpb24gPT0gbGFzdFVucHJvY2Vzc2VkQ2FwdGlvbikgcmV0dXJuO1xuICBsYXN0VW5wcm9jZXNzZWRDYXB0aW9uID0gdW5wcm9jZXNzZWRDYXB0aW9uO1xuICBcbiAgLy8gUmVtb3ZlIG9sZCBjYXB0aW9ucyBhbmQgYXBwbHkgU2FmYXJpIGJ1ZyBmaXggaWYgY2FwdGlvbiBoYXMgbm8gY29udGVudCBhcyBvdGhlcndpc2UgY2F1c2VzIGZsaWNrZXJcbiAgcmVtb3ZlQ2FwdGlvbnModmlkZW8sICF1bnByb2Nlc3NlZENhcHRpb24pO1xuXG4gIC8vIFBlcmZvcm1hbmNlIG9wdGltaXNhdGlvbiAtIGVhcmx5IGV4aXQgaWYgY2FwdGlvbiBoYXMgbm8gY29udGVudFxuICBpZiAoIXVucHJvY2Vzc2VkQ2FwdGlvbikgcmV0dXJuO1xuXG4gIC8vIFNob3cgY29ycmVjdGx5IHNwYWNlZCBhbmQgZm9ybWF0dGVkIFBpY3R1cmUgaW4gUGljdHVyZSBtb2RlIGNhcHRpb25cbiAgbGV0IGNhcHRpb24gPSAnJztcbiAgY29uc3Qgd2FsayA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoY2FwdGlvbkVsZW1lbnQsIE5vZGVGaWx0ZXIuU0hPV19URVhULCBudWxsLCBmYWxzZSk7XG4gIHdoaWxlICh3YWxrLm5leHROb2RlKCkpIHtcbiAgICBjb25zdCBzZWdtZW50ID0gd2Fsay5jdXJyZW50Tm9kZS5ub2RlVmFsdWUudHJpbSgpO1xuICAgIGlmIChzZWdtZW50KSB7XG4gICAgICBjb25zdCBzdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHdhbGsuY3VycmVudE5vZGUucGFyZW50RWxlbWVudCk7XG4gICAgICBpZiAoc3R5bGUuZm9udFN0eWxlID09ICdpdGFsaWMnKSB7XG4gICAgICAgIGNhcHRpb24gKz0gYDxpPiR7c2VnbWVudH08L2k+YDtcbiAgICAgIH0gZWxzZSBpZiAoc3R5bGUudGV4dERlY29yYXRpb24gPT0gJ3VuZGVybGluZScpIHtcbiAgICAgICAgY2FwdGlvbiArPSBgPHU+JHtzZWdtZW50fTwvdT5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FwdGlvbiArPSBzZWdtZW50O1xuICAgICAgfVxuICAgICAgY2FwdGlvbiArPSAnICc7XG4gICAgfSBlbHNlIGlmIChjYXB0aW9uLmNoYXJBdChjYXB0aW9uLmxlbmd0aCAtIDEpICE9ICdcXG4nKSB7XG4gICAgICBjYXB0aW9uICs9ICdcXG4nO1xuICAgIH1cbiAgfVxuICBjYXB0aW9uID0gY2FwdGlvbi50cmltKCk7XG4gIGFkZENhcHRpb24odmlkZW8sIGNhcHRpb24pO1xufTsiLCJpbXBvcnQgeyBpbmZvLCBlcnJvciB9IGZyb20gJy4vbG9nZ2VyLmpzJ1xuaW1wb3J0IHsgZ2V0UmVzb3VyY2UsIGdldEV4dGVuc2lvblVSTCB9IGZyb20gJy4vY29tbW9uLmpzJ1xuaW1wb3J0IHsgdG9nZ2xlUGljdHVyZUluUGljdHVyZSwgYWRkUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL3ZpZGVvLmpzJ1xuaW1wb3J0IHsgbG9jYWxpemVkU3RyaW5nIH0gZnJvbSAnLi9sb2NhbGl6YXRpb24uanMnXG5cbmNvbnN0IEJVVFRPTl9JRCA9ICdQaVBlcl9idXR0b24nO1xuXG5sZXQgLyoqID9IVE1MRWxlbWVudCAqLyBidXR0b24gPSBudWxsO1xuXG4vKipcbiAqIEluamVjdHMgUGljdHVyZSBpbiBQaWN0dXJlIGJ1dHRvbiBpbnRvIHdlYnBhZ2VcbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IHBhcmVudCAtIEVsZW1lbnQgYnV0dG9uIHdpbGwgYmUgaW5zZXJ0ZWQgaW50b1xuICovXG5leHBvcnQgY29uc3QgYWRkQnV0dG9uID0gZnVuY3Rpb24ocGFyZW50KSB7XG5cbiAgLy8gQ3JlYXRlIGJ1dHRvbiBpZiBuZWVkZWRcbiAgaWYgKCFidXR0b24pIHtcbiAgICBjb25zdCBidXR0b25FbGVtZW50VHlwZSA9IGdldFJlc291cmNlKCkuYnV0dG9uRWxlbWVudFR5cGUgfHwgJ2J1dHRvbic7XG4gICAgYnV0dG9uID0gLyoqIEB0eXBlIHtIVE1MRWxlbWVudH0gKi8gKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYnV0dG9uRWxlbWVudFR5cGUpKTtcblxuICAgIC8vIFNldCBidXR0b24gcHJvcGVydGllc1xuICAgIGJ1dHRvbi5pZCA9IEJVVFRPTl9JRDtcbiAgICBidXR0b24udGl0bGUgPSBsb2NhbGl6ZWRTdHJpbmcoJ2J1dHRvbi10aXRsZScpO1xuICAgIGNvbnN0IGJ1dHRvblN0eWxlID0gZ2V0UmVzb3VyY2UoKS5idXR0b25TdHlsZTtcbiAgICBpZiAoYnV0dG9uU3R5bGUpIGJ1dHRvbi5zdHlsZS5jc3NUZXh0ID0gYnV0dG9uU3R5bGU7XG4gICAgY29uc3QgYnV0dG9uQ2xhc3NOYW1lID0gZ2V0UmVzb3VyY2UoKS5idXR0b25DbGFzc05hbWU7XG4gICAgaWYgKGJ1dHRvbkNsYXNzTmFtZSkgYnV0dG9uLmNsYXNzTmFtZSA9IGJ1dHRvbkNsYXNzTmFtZTtcblxuICAgIC8vIEFkZCBzY2FsZWQgaW1hZ2UgdG8gYnV0dG9uXG4gICAgY29uc3QgaW1hZ2UgPSAvKiogQHR5cGUge0hUTUxJbWFnZUVsZW1lbnR9ICovIChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKSk7XG4gICAgaW1hZ2Uuc3R5bGUud2lkdGggPSBpbWFnZS5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgY29uc3QgYnV0dG9uU2NhbGUgPSBnZXRSZXNvdXJjZSgpLmJ1dHRvblNjYWxlO1xuICAgIGlmIChidXR0b25TY2FsZSkgaW1hZ2Uuc3R5bGUudHJhbnNmb3JtID0gYHNjYWxlKCR7YnV0dG9uU2NhbGV9KWA7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKGltYWdlKTtcblxuICAgIC8vIFNldCBpbWFnZSBwYXRoc1xuICAgIGxldCBidXR0b25JbWFnZSA9IGdldFJlc291cmNlKCkuYnV0dG9uSW1hZ2U7XG4gICAgbGV0IGJ1dHRvbkV4aXRJbWFnZSA9IGdldFJlc291cmNlKCkuYnV0dG9uRXhpdEltYWdlO1xuICAgIGlmICghYnV0dG9uSW1hZ2UpIHtcbiAgICAgIGJ1dHRvbkltYWdlID0gJ2RlZmF1bHQnO1xuICAgICAgYnV0dG9uRXhpdEltYWdlID0gJ2RlZmF1bHQtZXhpdCc7XG4gICAgfVxuICAgIGNvbnN0IGJ1dHRvbkltYWdlVVJMID0gZ2V0RXh0ZW5zaW9uVVJMKGBpbWFnZXMvJHtidXR0b25JbWFnZX0uc3ZnYCk7XG4gICAgaW1hZ2Uuc3JjID0gYnV0dG9uSW1hZ2VVUkw7XG4gICAgaWYgKGJ1dHRvbkV4aXRJbWFnZSkge1xuICAgICAgY29uc3QgYnV0dG9uRXhpdEltYWdlVVJMID0gZ2V0RXh0ZW5zaW9uVVJMKGBpbWFnZXMvJHtidXR0b25FeGl0SW1hZ2V9LnN2Z2ApO1xuICAgICAgYWRkUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIoZnVuY3Rpb24odmlkZW8sIGlzUGxheWluZ1BpY3R1cmVJblBpY3R1cmUpIHtcbiAgICAgICAgaW1hZ2Uuc3JjID0gKGlzUGxheWluZ1BpY3R1cmVJblBpY3R1cmUpID8gYnV0dG9uRXhpdEltYWdlVVJMIDogYnV0dG9uSW1hZ2VVUkw7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBBZGQgaG92ZXIgc3R5bGUgdG8gYnV0dG9uIChhIG5lc3RlZCBzdHlsZXNoZWV0IGlzIHVzZWQgdG8gYXZvaWQgdHJhY2tpbmcgYW5vdGhlciBlbGVtZW50KVxuICAgIGNvbnN0IGJ1dHRvbkhvdmVyU3R5bGUgPSBnZXRSZXNvdXJjZSgpLmJ1dHRvbkhvdmVyU3R5bGU7XG4gICAgaWYgKGJ1dHRvbkhvdmVyU3R5bGUpIHtcbiAgICAgIGNvbnN0IHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgICAgIGNvbnN0IGNzcyA9IGAjJHtCVVRUT05fSUR9OmhvdmVyeyR7YnV0dG9uSG92ZXJTdHlsZX19YDtcbiAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICAgICAgYnV0dG9uLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG5cbiAgICAvLyBUb2dnbGUgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUgd2hlbiBidXR0b24gaXMgY2xpY2tlZFxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAvLyBHZXQgdGhlIHZpZGVvIGVsZW1lbnQgYW5kIGJ5cGFzcyBjYWNoaW5nIHRvIGFjY29tb2RhdGUgZm9yIHRoZSB1bmRlcmx5aW5nIHZpZGVvIGNoYW5naW5nIChlLmcuIHByZS1yb2xsIGFkdmVydHMpIFxuICAgICAgY29uc3QgdmlkZW8gPSAvKiogQHR5cGUgez9IVE1MVmlkZW9FbGVtZW50fSAqLyAoZ2V0UmVzb3VyY2UoKS52aWRlb0VsZW1lbnQodHJ1ZSkpO1xuICAgICAgaWYgKCF2aWRlbykge1xuICAgICAgICBlcnJvcignVW5hYmxlIHRvIGZpbmQgdmlkZW8nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0b2dnbGVQaWN0dXJlSW5QaWN0dXJlKHZpZGVvKTtcbiAgICB9KTtcblxuICAgIGluZm8oJ1BpY3R1cmUgaW4gUGljdHVyZSBidXR0b24gY3JlYXRlZCcpO1xuICB9XG5cbiAgLy8gSW5qZWN0IGJ1dHRvbiBpbnRvIGNvcnJlY3QgcGxhY2VcbiAgY29uc3QgcmVmZXJlbmNlTm9kZSA9IGdldFJlc291cmNlKCkuYnV0dG9uSW5zZXJ0QmVmb3JlID8gZ2V0UmVzb3VyY2UoKS5idXR0b25JbnNlcnRCZWZvcmUocGFyZW50KSA6IG51bGw7XG4gIHBhcmVudC5pbnNlcnRCZWZvcmUoYnV0dG9uLCByZWZlcmVuY2VOb2RlKTtcbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgUGljdHVyZSBpbiBQaWN0dXJlIGJ1dHRvbiBlbGVtZW50XG4gKlxuICogQHJldHVybiB7P0hUTUxFbGVtZW50fVxuICovXG5leHBvcnQgY29uc3QgZ2V0QnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBidXR0b247XG59O1xuXG4vKipcbiAqIENoZWNrcyBpZiBQaWN0dXJlIGluIFBpY3R1cmUgYnV0dG9uIGlzIGluamVjdGVkIGludG8gcGFnZVxuICpcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBjb25zdCBjaGVja0J1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gISFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChCVVRUT05fSUQpO1xufTtcbiIsImltcG9ydCB7IEJyb3dzZXIsIGdldEJyb3dzZXIsIGdldFJlc291cmNlLCBieXBhc3NCYWNrZ3JvdW5kVGltZXJUaHJvdHRsaW5nIH0gZnJvbSAnLi8uLi9jb21tb24uanMnXG5pbXBvcnQgeyBnZXRCdXR0b24gfSBmcm9tICcuLy4uL2J1dHRvbi5qcydcbmltcG9ydCB7IGVuYWJsZUNhcHRpb25zLCBkaXNhYmxlQ2FwdGlvbnMsIHNob3VsZFByb2Nlc3NDYXB0aW9ucyB9IGZyb20gJy4vLi4vY2FwdGlvbnMuanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSBbJ3lvdXR1YmUnLCAneW91dHUnXTtcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd5dHAtYnV0dG9uJyxcbiAgYnV0dG9uRGlkQXBwZWFyOiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBidXR0b24gPSBnZXRCdXR0b24oKTtcbiAgICBjb25zdCBuZWlnaGJvdXJCdXR0b24gPSAvKiogQHR5cGUgez9IVE1MRWxlbWVudH0gKi8gKGJ1dHRvbi5uZXh0U2libGluZyk7XG4gICAgY29uc3QgLyoqIHN0cmluZyAqLyB0aXRsZSA9IGJ1dHRvbi50aXRsZTtcbiAgICBjb25zdCAvKiogc3RyaW5nICovIG5laWdoYm91clRpdGxlID0gbmVpZ2hib3VyQnV0dG9uLnRpdGxlO1xuICAgIGJ1dHRvbi50aXRsZSA9ICcnO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbigpIHtcbiAgICAgIG5laWdoYm91ckJ1dHRvbi50aXRsZSA9IHRpdGxlO1xuICAgICAgbmVpZ2hib3VyQnV0dG9uLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KCdtb3VzZW92ZXInKSk7XG4gICAgfSk7XG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24oKSB7XG4gICAgICBuZWlnaGJvdXJCdXR0b24uZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoJ21vdXNlb3V0JykpO1xuICAgICAgbmVpZ2hib3VyQnV0dG9uLnRpdGxlID0gbmVpZ2hib3VyVGl0bGU7XG4gICAgfSk7XG4gICAgYnlwYXNzQmFja2dyb3VuZFRpbWVyVGhyb3R0bGluZygpO1xuXG4gICAgLy8gV29ya2Fyb3VuZCBTYWZhcmkgYnVnOyBvbGQgY2FwdGlvbnMgcGVyc2lzdCBpbiBQaWN0dXJlIGluIFBpY3R1cmUgbW9kZSB3aGVuIE1lZGlhU291cmNlIGJ1ZmZlcnMgY2hhbmdlXG4gICAgaWYgKGdldEJyb3dzZXIoKSA9PSBCcm93c2VyLlNBRkFSSSkge1xuICAgICAgY29uc3QgdmlkZW8gPSAvKiogQHR5cGUgez9IVE1MVmlkZW9FbGVtZW50fSAqLyAoZ2V0UmVzb3VyY2UoKS52aWRlb0VsZW1lbnQoKSk7XG4gICAgICBsZXQgY2FwdGlvbnNWaXNpYmxlID0gZmFsc2U7XG4gICAgICBjb25zdCBuYXZpZ2F0ZVN0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNhcHRpb25zVmlzaWJsZSA9IHNob3VsZFByb2Nlc3NDYXB0aW9ucygpO1xuICAgICAgICBpZiAoY2FwdGlvbnNWaXNpYmxlKSBkaXNhYmxlQ2FwdGlvbnMoKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBuYXZpZ2F0ZUZpbmlzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoY2FwdGlvbnNWaXNpYmxlKSBlbmFibGVDYXB0aW9ucygpO1xuICAgICAgfTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzcGZyZXF1ZXN0JywgbmF2aWdhdGVTdGFydCk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc3BmZG9uZScsIG5hdmlnYXRlRmluaXNoKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd5dC1uYXZpZ2F0ZS1zdGFydCcsIG5hdmlnYXRlU3RhcnQpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3l0LW5hdmlnYXRlLWZpbmlzaCcsIG5hdmlnYXRlRmluaXNoKTtcbiAgICB9XG4gIH0sXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy55dHAtcmlnaHQtY29udHJvbHMnKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuNjgsXG4gIGNhcHRpb25FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcHRpb24td2luZG93Jyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvLmh0bWw1LW1haW4tdmlkZW8nKTtcbiAgfSxcbn07IiwiaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tICcuLy4uL2NvbW1vbi5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICd5ZWxvcGxheSc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnYnV0dG9uJyxcbiAgYnV0dG9uRGlkQXBwZWFyOiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBwYXJlbnQgPSBnZXRSZXNvdXJjZSgpLmJ1dHRvblBhcmVudCgpO1xuICAgIHBhcmVudC5zdHlsZS53aWR0aCA9ICcyMTBweCc7XG4gIH0sXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BsYXllci1mdWxsc2NyZWVuLWJ1dHRvbicpWzBdO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdidXR0b25zJylbMF07XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjgsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgbWFyZ2luLWJvdHRvbTogLTEwcHg7XG4gICAgbWFyZ2luLWxlZnQ6IDEwcHg7XG4gICAgd2lkdGg6IDUwcHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIG9wYWNpdHk6IDAuODtcbiAgICBoZWlnaHQ6IDQwcHggIWltcG9ydGFudDtcbiAgICBtYXJnaW4tYm90dG9tOiAwcHggIWltcG9ydGFudDtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvW3NyY10nKTtcbiAgfSxcbn07IiwiaW1wb3J0IHsgZ2V0UmVzb3VyY2UsIGJ5cGFzc0JhY2tncm91bmRUaW1lclRocm90dGxpbmcgfSBmcm9tICcuLy4uL2NvbW1vbi5qcydcbmltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuaW1wb3J0IHsgdmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSwgdG9nZ2xlUGljdHVyZUluUGljdHVyZSB9IGZyb20gJy4vLi4vdmlkZW8uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAndnJ2JztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd2anMtY29udHJvbCB2anMtYnV0dG9uJyxcbiAgYnV0dG9uRGlkQXBwZWFyOiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBuZWlnaGJvdXJCdXR0b24gPSBnZXRCdXR0b24oKS5uZXh0U2libGluZztcbiAgICBuZWlnaGJvdXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHZpZGVvID0gLyoqIEB0eXBlIHs/SFRNTFZpZGVvRWxlbWVudH0gKi8gKGdldFJlc291cmNlKCkudmlkZW9FbGVtZW50KCkpO1xuICAgICAgaWYgKHZpZGVvUGxheWluZ1BpY3R1cmVJblBpY3R1cmUodmlkZW8pKSB0b2dnbGVQaWN0dXJlSW5QaWN0dXJlKHZpZGVvKTtcbiAgICB9KTtcbiAgICBieXBhc3NCYWNrZ3JvdW5kVGltZXJUaHJvdHRsaW5nKCk7XG4gIH0sXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZqcy1jb250cm9sLWJhcicpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC42LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICByaWdodDogMTE0cHg7XG4gICAgd2lkdGg6IDUwcHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIG9wYWNpdHk6IDAuNjtcbiAgYCksXG4gIGNhcHRpb25FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpYmphc3Mtc3VicycpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyX2h0bWw1X2FwaScpO1xuICB9LFxufTtcbiIsImV4cG9ydCBjb25zdCBkb21haW4gPSAndnJ0JztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd2dXBsYXktY29udHJvbCcsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Z1cGxheS1jb250cm9sLXJpZ2h0JylbMF07XG4gIH0sXG4gIGNhcHRpb25FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRoZW9wbGF5ZXItdGV4dHRyYWNrcycpO1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHdpZHRoOiAzMHB4O1xuICAgIGhlaWdodDogNDdweDtcbiAgICBwYWRkaW5nOiAwO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB0b3A6IC05cHg7XG4gICAgcmlnaHQ6IDhweDtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvW3ByZWxvYWQ9XCJtZXRhZGF0YVwiXScpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ3ZrJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd2aWRlb3BsYXllcl9idG4nLFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi52aWRlb3BsYXllcl9idG5fZnVsbHNjcmVlbicpO1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHdpZHRoOiAyNHB4O1xuICAgIGhlaWdodDogNDVweDtcbiAgICBwYWRkaW5nOiAwIDhweDtcbiAgYCksXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi52aWRlb3BsYXllcl9jb250cm9scycpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlby52aWRlb3BsYXllcl9tZWRpYV9wcm92aWRlcicpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRCdXR0b24gfSBmcm9tICcuLy4uL2J1dHRvbi5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9IFsndmlqZicsICd2aWVyJywgJ3plcyddO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3Zqcy1jb250cm9sIHZqcy1idXR0b24nLFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIC8vIE1vdmUgZnVsbHNjcmVlbiBidXR0b24gdG8gdGhlIHJpZ2h0IHNvIHRoZSBwaXAgYnV0dG9uIGFwcGVhcnMgbGVmdCBvZiBpdFxuICAgIGNvbnN0IGZ1bGxTY3JlZW5CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2anMtZnVsbHNjcmVlbi1jb250cm9sJylbMF07XG4gICAgZnVsbFNjcmVlbkJ1dHRvbi5zdHlsZS5vcmRlciA9IDEwO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd2anMtY29udHJvbC1iYXInKVswXTtcbiAgfSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICB0ZXh0LWluZGVudDogMCEgaW1wb3J0YW50O1xuICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICAgIG9yZGVyOiA5O1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndmlkZW9bcHJlbG9hZD1cIm1ldGFkYXRhXCJdJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAndmlkJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmpzLWNvbnRyb2wtYmFyJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjcsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIHRvcDogLTJweDtcbiAgICBsZWZ0OiA5cHg7XG4gICAgcGFkZGluZzogMHB4O1xuICAgIG1hcmdpbjogMHB4O1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvX3BsYXllcl9odG1sNV9hcGknKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICd2aWNlJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd2cF9fY29udHJvbHNfX2ljb25fX3BvcHVwX19jb250YWluZXInLFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52cF9fY29udHJvbHNfX2ljb25zJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjYsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgdG9wOiAtMTFweGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlby5qdy12aWRlbycpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ3Zldm8nO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3BsYXllci1jb250cm9sJyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRyb2wtYmFyIC5yaWdodC1jb250cm9scycpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC43LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIGJvcmRlcjogMHB4O1xuICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2h0bWw1LXBsYXllcicpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ3VzdHJlYW0nO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2NvbXBvbmVudCBzaG93bicsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIG9wYWNpdHk6IDEgIWltcG9ydGFudDtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggNXB4IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC41KSk7XG4gIGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25TY2FsZTogMC44LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIG9wYWNpdHk6IDAuNztcbiAgYCksXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250cm9sUGFuZWxSaWdodCcpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjVmlld2VyQ29udGFpbmVyIHZpZGVvJyk7XG4gIH0sXG59OyIsImltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ3VkZW15JztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdidG4nLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgb3BhY2l0eTogMSAhaW1wb3J0YW50YCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvblthcmlhLWxhYmVsPVwiRnVsbHNjcmVlblwiXScpO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbY2xhc3NePVwiY29udHJvbC1iYXItLWNvbnRyb2wtYmFyLS1cIl0nKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuOCxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICB3aWR0aDogM2VtO1xuICAgIGhlaWdodDogM2VtO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgb3BhY2l0eTogMC44O1xuICBgKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbY2xhc3NePVwiY2FwdGlvbnMtZGlzcGxheS0tY2FwdGlvbnMtY29udGFpbmVyXCJdJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvLnZqcy10ZWNoJyk7XG4gIH0sXG59OyIsImltcG9ydCB7IGdldFJlc291cmNlIH0gZnJvbSAnLi8uLi9jb21tb24uanMnXG5pbXBvcnQgeyBnZXRCdXR0b24gfSBmcm9tICcuLy4uL2J1dHRvbi5qcydcbmltcG9ydCB7IHZpZGVvUGxheWluZ1BpY3R1cmVJblBpY3R1cmUsIHRvZ2dsZVBpY3R1cmVJblBpY3R1cmUgfSBmcm9tICcuLy4uL3ZpZGVvLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ3R3aXRjaCc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAndHctYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1cy1tZWRpdW0gdHctYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci10b3AtbGVmdC1yYWRpdXMtbWVkaXVtIHR3LWJvcmRlci10b3AtcmlnaHQtcmFkaXVzLW1lZGl1bSB0dy1idXR0b24taWNvbiB0dy1idXR0b24taWNvbi0tb3ZlcmxheSB0dy1jb3JlLWJ1dHRvbiB0dy1jb3JlLWJ1dHRvbi0tb3ZlcmxheSB0dy1pbmxpbmUtZmxleCB0dy1yZWxhdGl2ZSB0dy10b29sdGlwLXdyYXBwZXInLFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIC8vIEFkZCB0b29sdGlwXG4gICAgY29uc3QgYnV0dG9uID0gZ2V0QnV0dG9uKCk7XG4gICAgY29uc3QgdGl0bGUgPSBidXR0b24udGl0bGU7XG4gICAgYnV0dG9uLnRpdGxlID0gJyc7XG4gICAgY29uc3QgdG9vbHRpcCA9IC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovIChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSk7XG4gICAgdG9vbHRpcC5jbGFzc05hbWUgPSAndHctdG9vbHRpcCB0dy10b29sdGlwLS1hbGlnbi1yaWdodCB0dy10b29sdGlwLS11cCc7XG4gICAgdG9vbHRpcC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aXRsZSkpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZCh0b29sdGlwKTtcbiAgICBcbiAgICAvLyBGaXggaXNzdWVzIHdpdGggZnVsbHNjcmVlbiB3aGVuIGFjdGl2YXRlZCB3aGlsZSB2aWRlbyBwbGF5aW5nIFBpY3R1cmUtaW4tUGljdHVyZVxuICAgIGNvbnN0IGZ1bGxzY3JlZW5CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtYS10YXJnZXQ9J3BsYXllci1mdWxsc2NyZWVuLWJ1dHRvbiddXCIpO1xuICAgIGlmICghZnVsbHNjcmVlbkJ1dHRvbikgcmV0dXJuO1xuICAgIGZ1bGxzY3JlZW5CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHZpZGVvID0gLyoqIEB0eXBlIHs/SFRNTFZpZGVvRWxlbWVudH0gKi8gKGdldFJlc291cmNlKCkudmlkZW9FbGVtZW50KCkpO1xuICAgICAgaWYgKHZpZGVvUGxheWluZ1BpY3R1cmVJblBpY3R1cmUodmlkZW8pKSB0b2dnbGVQaWN0dXJlSW5QaWN0dXJlKHZpZGVvKTtcbiAgICB9KTtcbiAgfSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBsYXllci1jb250cm9sc19fcmlnaHQtY29udHJvbC1ncm91cCwucGxheWVyLWJ1dHRvbnMtcmlnaHQnKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuOCxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLWNhcHRpb25zLWNvbnRhaW5lcicpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlb1tzcmNdJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAndGhlb25pb24nO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2p3LWljb24ganctaWNvbi1pbmxpbmUganctYnV0dG9uLWNvbG9yIGp3LXJlc2V0IGp3LWljb24tbG9nbycsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmp3LWNvbnRyb2xiYXItcmlnaHQtZ3JvdXAnKTtcbiAgfSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICB0b3A6IC0ycHg7XG4gICAgbGVmdDogMTBweDtcbiAgICB3aWR0aDogMzhweDtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvLmp3LXZpZGVvJyk7XG4gIH0sXG59OyIsImltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ3RlZCc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnei1pOjAgcG9zOnIgYm90dG9tOjAgaG92ZXIvYmc6d2hpdGUuNyBiLXI6LjEgcDoxIGN1cjpwJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHBsYXlCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbYXJpYS1jb250cm9scz1cInZpZGVvMVwiXScpO1xuICAgIHJldHVybiBwbGF5QnV0dG9uLnBhcmVudEVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgfSxcbiAgYnV0dG9uRGlkQXBwZWFyOiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBpbWcgPSBnZXRCdXR0b24oKS5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcbiAgICBpbWcuY2xhc3NMaXN0LmFkZCgndzoyJyk7XG4gICAgaW1nLmNsYXNzTGlzdC5hZGQoJ2g6MicpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlb1tpZF49XCJ0ZWQtcGxheWVyLVwiXScpO1xuICB9XG59OyIsImltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ3N0cmVhbWFibGUnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkRpZEFwcGVhcjogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyLXByb2dyZXNzJyk7XG4gICAgY29uc3QgcHJvZ3Jlc3NCYXJTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHByb2dyZXNzQmFyKTtcbiAgICBnZXRCdXR0b24oKS5zdHlsZS5yaWdodCA9IHByb2dyZXNzQmFyU3R5bGUucmlnaHQ7XG4gICAgcHJvZ3Jlc3NCYXIuc3R5bGUucmlnaHQgPSAocGFyc2VJbnQocHJvZ3Jlc3NCYXJTdHlsZS5yaWdodCwgMTApICsgNDApICsgJ3B4JztcbiAgfSxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgb3BhY2l0eTogMSAhaW1wb3J0YW50YCksXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wbGF5ZXItY29udHJvbHMtcmlnaHQnKTtcbiAgfSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgYm90dG9tOiAxMHB4O1xuICAgIGhlaWdodDogMjZweDtcbiAgICB3aWR0aDogMjZweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgb3BhY2l0eTogMC45O1xuICAgIGZpbHRlcjogZHJvcC1zaGFkb3cocmdiYSgwLCAwLCAwLCAwLjUpIDBweCAwcHggMnB4KTtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlby1wbGF5ZXItdGFnJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSBbJ3Nlem5hbScsICdzdHJlYW0nXTtcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdzem5wLXVpLXdpZGdldC1ib3gnLFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGB0cmFuc2Zvcm06IHNjYWxlKDEuMDUpYCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zem5wLXVpLWN0cmwtcGFuZWwtbGF5b3V0LXdyYXBwZXInKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuNzUsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgY3Vyc29yOiBwb2ludGVyYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zem5wLXVpLXRlY2gtdmlkZW8td3JhcHBlciB2aWRlbycpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBieXBhc3NCYWNrZ3JvdW5kVGltZXJUaHJvdHRsaW5nIH0gZnJvbSAnLi8uLi9jb21tb24uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAncGxleCc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uRGlkQXBwZWFyOiBmdW5jdGlvbigpIHtcbiAgICBieXBhc3NCYWNrZ3JvdW5kVGltZXJUaHJvdHRsaW5nKCk7XG4gIH0sXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignZGl2W2NsYXNzXj1cIkZ1bGxQbGF5ZXJUb3BDb250cm9scy10b3BDb250cm9sc1wiXScpO1xuICAgIHJldHVybiAvKiogQHR5cGUgez9FbGVtZW50fSAqLyAoZSAmJiBlLmxhc3RDaGlsZCk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAyLFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB0b3A6IC0zcHg7XG4gICAgd2lkdGg6IDMwcHg7XG4gICAgcGFkZGluZzogMTBweDtcbiAgICBib3JkZXI6IDBweDtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICBvcGFjaXR5OiAwLjc7XG4gICAgb3V0bGluZTogMDtcbiAgICB0ZXh0LXNoYWRvdzogMHB4IDBweCA0cHggcmdiYSgwLCAwLCAwLCAwLjQ1KTtcbiAgYCksXG4gIGNhcHRpb25FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmxpYmphc3Mtc3VicycpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlb1tjbGFzc149XCJIVE1MTWVkaWEtbWVkaWFFbGVtZW50XCJdJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSBbJ3BlcmlzY29wZScsICdwc2NwJ107XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnUGlsbCBQaWxsLS13aXRoSWNvbicsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnc3BhbicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBvcGFjaXR5OiAwLjggIWltcG9ydGFudDtcbiAgICBmaWx0ZXI6IGJyaWdodG5lc3MoMTI1JSkgIWltcG9ydGFudDtcbiAgYCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcuU2hhcmVCcm9hZGNhc3QnKS5uZXh0U2libGluZztcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLlZpZGVvT3ZlcmxheVJlZGVzaWduLUJvdHRvbUJhci1SaWdodCcpO1xuICB9LFxuICBidXR0b25TY2FsZTogMC42LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBmaWx0ZXI6IGJyaWdodG5lc3MoMjAwJSk7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuVmlkZW8gdmlkZW8nKTtcbiAgfSxcbn07IiwiaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tICcuLy4uL2NvbW1vbi5qcydcbmltcG9ydCB7IHZpZGVvUGxheWluZ1BpY3R1cmVJblBpY3R1cmUsIHRvZ2dsZVBpY3R1cmVJblBpY3R1cmUgfSBmcm9tICcuLy4uL3ZpZGVvLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ3Bicyc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnanctaWNvbiBqdy1pY29uLWlubGluZSBqdy1idXR0b24tY29sb3IganctcmVzZXQnLFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGZ1bGxzY3JlZW5CdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanctaWNvbi1mdWxsc2NyZWVuJyk7XG4gICAgZnVsbHNjcmVlbkJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdmlkZW8gPSAvKiogQHR5cGUgez9IVE1MVmlkZW9FbGVtZW50fSAqLyAoZ2V0UmVzb3VyY2UoKS52aWRlb0VsZW1lbnQoKSk7XG4gICAgICBpZiAodmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSh2aWRlbykpIHRvZ2dsZVBpY3R1cmVJblBpY3R1cmUodmlkZW8pO1xuICAgIH0pO1xuICB9LFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmp3LWJ1dHRvbi1jb250YWluZXInKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuNixcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAwLjhgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmp3LXZpZGVvJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSBbJ29wZW5sb2FkJywgJ29sb2FkJ107XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAndmpzLWNvbnRyb2wgdmpzLWJ1dHRvbicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52anMtY29udHJvbC1iYXInKTtcbiAgfSxcbiAgYnV0dG9uU2NhbGU6IDAuNixcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBsZWZ0OiA1cHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ29sdmlkZW9faHRtbDVfYXBpJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnb2NzJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdmb290ZXItZWx0IGZsdHInLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvcignI3RvZ2dsZVBsYXknKTtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZvb3Rlci1ibG9jazpsYXN0LWNoaWxkJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAxLjIsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgd2lkdGg6IDI1cHg7XG4gICAgaGVpZ2h0OiAxOHB4O1xuICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICBtYXJnaW4tYm90dG9tOiAtMTBweDtcbiAgICBwYWRkaW5nOiAwcHg7XG4gICAgYm9yZGVyOiAwcHg7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnTGd5VmlkZW9QbGF5ZXInKTtcbiAgfSxcbn07IiwiaW1wb3J0IHsgZ2V0UmVzb3VyY2UgfSBmcm9tICcuLy4uL2NvbW1vbi5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICduZXRmbGl4JztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICd0b3VjaGFibGUgUGxheWVyQ29udHJvbHMtLWNvbnRyb2wtZWxlbWVudCBuZnAtYnV0dG9uLWNvbnRyb2wgZGVmYXVsdC1jb250cm9sLWJ1dHRvbicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGB0cmFuc2Zvcm06IHNjYWxlKDEuMik7YCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5QbGF5ZXJDb250cm9sc05lb19fYnV0dG9uLWNvbnRyb2wtcm93Jyk7IFxuICB9LFxuICBidXR0b25TY2FsZTogMC43LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYG1pbi13aWR0aDogMi4zZW1gKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGUgPSBnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCgpO1xuICAgIHJldHVybiBlICYmIGUucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGxheWVyLXRpbWVkdGV4dCcpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuVmlkZW9Db250YWluZXIgdmlkZW8nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdtbGInO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvblNjYWxlOiAwLjcsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgYm9yZGVyOiAwcHg7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDgwJSk7XG4gIGApLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgZmlsdGVyOiBicmlnaHRuZXNzKDEyMCUpICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmJvdHRvbS1jb250cm9scy1yaWdodCcpO1xuICB9LFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWxidHYtbWVkaWEtcGxheWVyIHZpZGVvJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnbWl4ZXInO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2NvbnRyb2wnLFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDgpYCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQucHJldmlvdXNTaWJsaW5nO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbC1jb250YWluZXIgLnRvb2xiYXIgLnJpZ2h0Jyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjY1LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHdpZHRoOiAzNnB4O1xuICAgIGhlaWdodDogMzZweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2wtY29udGFpbmVyICsgdmlkZW8nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdtZXRhY2FmZSc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyX3BsYWNlIC50cmF5Jyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjg1LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcGxheWVyX3BsYWNlIHZpZGVvJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnbWFzaGFibGUnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2p3LWljb24ganctaWNvbi1pbmxpbmUganctYnV0dG9uLWNvbG9yIGp3LXJlc2V0IGp3LWljb24tbG9nbycsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmp3LWNvbnRyb2xiYXItcmlnaHQtZ3JvdXAnKTtcbiAgfSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICB0b3A6IC0ycHg7XG4gICAgd2lkdGg6IDM4cHg7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlby5qdy12aWRlbycpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ2xpdHRsZXRoaW5ncyc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnanctaWNvbiBqdy1pY29uLWlubGluZSBqdy1idXR0b24tY29sb3IganctcmVzZXQganctaWNvbi1sb2dvJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQubGFzdENoaWxkO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanctY29udHJvbGJhci1yaWdodC1ncm91cCcpO1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYHdpZHRoOiAzOHB4YCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvLmp3LXZpZGVvJyk7XG4gIH0sXG59OyIsImltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ2h1bHUnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkRpZEFwcGVhcjogZnVuY3Rpb24oKSB7XG4gICAgXG4gICAgLy8gR2V0IGxvY2FsaXplZCBidXR0b24gdGl0bGUgYW5kIGhpZGUgZGVmYXVsdCB0b29sdGlwXG4gICAgY29uc3QgYnV0dG9uID0gZ2V0QnV0dG9uKCk7XG4gICAgY29uc3QgLyoqIHN0cmluZyAqLyB0aXRsZSA9IGJ1dHRvbi50aXRsZTtcbiAgICBidXR0b24udGl0bGUgPSAnJztcbiAgICBcbiAgICAvLyBDcmVhdGUgc3R5bGl6ZWQgdG9vbHRpcCBhbmQgYWRkIHRvIERPTVxuICAgIGNvbnN0IHRvb2x0aXAgPSAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqLyAoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgIHRvb2x0aXAuY2xhc3NOYW1lID0gJ2J1dHRvbi10b29sLXRpcHMnO1xuICAgIHRvb2x0aXAuc3R5bGUuY3NzVGV4dCA9IC8qKiBDU1MgKi8gKGBcbiAgICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XG4gICAgICBwYWRkaW5nOiAwIDVweDtcbiAgICAgIHJpZ2h0OiAwO1xuICAgIGApO1xuICAgIHRvb2x0aXAudGV4dENvbnRlbnQgPSB0aXRsZS50b1VwcGVyQ2FzZSgpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZCh0b29sdGlwKTtcbiAgICBcbiAgICAvLyBEaXNwbGF5IHN0eWxpemVkIHRvb2x0aXAgb24gbW91c2VvdmVyXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgdG9vbHRpcC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB9KTtcbiAgICBidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICAgIHRvb2x0aXAuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9KTtcbiAgfSxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgb3BhY2l0eTogMS4wICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzX192aWV3LW1vZGUtYnV0dG9uJyk7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNkYXNoLXBsYXllci1jb250YWluZXIgLmNvbnRyb2xzX19tZW51cy1yaWdodCcpO1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIG9wYWNpdHk6IDAuNztcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgd2lkdGg6IDI0cHg7XG4gIGApLFxuICBjYXB0aW9uRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG9zZWQtY2FwdGlvbi1vdXRiYW5kJyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy52aWRlby1wbGF5ZXInKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdnaWFudGJvbWInO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ2F2LWNocm9tZS1jb250cm9sJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvcignLmpzLXZpZC1waW4td3JhcCcpLm5leHRTaWJsaW5nO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXYtY29udHJvbHMtLXJpZ2h0Jyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjcsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIHdpZHRoOiAzMHB4O1xuICAgIG9wYWNpdHk6IDEuMDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gIGApLFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlb1tpZF49XCJ2aWRlb19qcy12aWQtcGxheWVyXCJdJyk7XG4gIH1cbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdmdWJvJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jc3MtamE3eWs3Jyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAxLjI1LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIGhlaWdodDogMjRweDtcbiAgICB3aWR0aDogMjVweDtcbiAgICBtYXJnaW46IDhweCAxMHB4IDEycHg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JpdG1vdmlucGxheWVyLXZpZGVvLXZpZGVvJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnZXVyb3Nwb3J0cGxheWVyJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzLWJhci1yaWdodC1zZWN0aW9uJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjksXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIG1hcmdpbi1yaWdodDogMTVweDtcbiAgICBvcGFjaXR5OiAwLjg7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICBgKSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZpZGVvLXBsYXllcl9fc2NyZWVuJyk7XG4gIH0sXG59OyIsImltcG9ydCB7IGdldEJ1dHRvbiB9IGZyb20gJy4vLi4vYnV0dG9uLmpzJ1xuXG5leHBvcnQgY29uc3QgZG9tYWluID0gJ2VzcG4nO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ21lZGlhLWljb24nLFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIC8vIEdldCBsb2NhbGl6ZWQgYnV0dG9uIHRpdGxlIGFuZCBoaWRlIGRlZmF1bHQgdG9vbHRpcFxuICAgIGNvbnN0IGJ1dHRvbiA9IGdldEJ1dHRvbigpO1xuICAgIGNvbnN0IC8qKiBzdHJpbmcgKi8gdGl0bGUgPSBidXR0b24udGl0bGU7XG4gICAgYnV0dG9uLnRpdGxlID0gJyc7XG5cbiAgICAvLyBDcmVhdGUgc3R5bGl6ZWQgdG9vbHRpcCBhbmQgYWRkIHRvIERPTVxuICAgIGNvbnN0IHRvb2x0aXAgPSAvKiogQHR5cGUge0hUTUxFbGVtZW50fSAqLyAoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgIHRvb2x0aXAuY2xhc3NOYW1lID0gJ2NvbnRyb2wtdG9vbHRpcCc7XG4gICAgdG9vbHRpcC5zdHlsZS5jc3NUZXh0ID0gLyoqIENTUyAqLyAoYFxuICAgICAgcmlnaHQ6IDBweDtcbiAgICAgIGJvdHRvbTogMzVweDtcbiAgICAgIHRyYW5zaXRpb246IGJvdHRvbSAwLjJzIGVhc2Utb3V0O1xuICAgIGApO1xuICAgIHRvb2x0aXAudGV4dENvbnRlbnQgPSB0aXRsZTtcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQodG9vbHRpcCk7XG5cbiAgICAvLyBEaXNwbGF5IHN0eWxpemVkIHRvb2x0aXAgb24gbW91c2VvdmVyXG4gICAgYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXlpbmcnKTtcbiAgICAgIHRvb2x0aXAuc3R5bGUuYm90dG9tID0gJzc1cHgnO1xuICAgIH0pO1xuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc3BsYXlpbmcnKTtcbiAgICAgIHRvb2x0aXAuc3R5bGUuYm90dG9tID0gJzM1cHgnO1xuICAgIH0pO1xuICB9LFxuICBidXR0b25FbGVtZW50VHlwZTogJ2RpdicsXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9scy1yaWdodC1ob3Jpem9udGFsJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjcsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgd2lkdGg6IDQ0cHg7XG4gICAgaGVpZ2h0OiA0NHB4O1xuICAgIG9yZGVyOiA0O1xuICBgKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGV4dC10cmFjay1kaXNwbGF5Jyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvLmpzLXZpZGVvLWNvbnRlbnQnKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdkaXNuZXlwbHVzJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25DbGFzc05hbWU6ICdjb250cm9sLWljb24tYnRuJyxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZ1bGxzY3JlZW4taWNvbicpO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29udHJvbHNfX3JpZ2h0Jyk7XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvW3NyY10nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdkYXpuJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25TdHlsZTogKGBcbiAgICB3aWR0aDogMS41cmVtO1xuICAgIGhlaWdodDogMS41cmVtO1xuICAgIGNvbG9yOiB3aGl0ZTtcbiAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBub25lO1xuICAgIG1hcmdpbjogMC41cmVtO1xuICAgIHotaW5kZXg6IDE7XG4gIGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICBcdC8vIFRoZSBMaXZlIGluZGljYXRvciBtaWdodCBtb3ZlL2NvdmVyIHRoZSBQaVAgYnV0dG9uLCBqdXN0IHBsYWNlIHRoZSBQaVAgYnV0dG9uIGJlZm9yZSBpdFxuICBcdGNvbnN0IGxpdmVJbmRpY2F0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdkaXZbZGF0YS10ZXN0LWlkXj1cIlBMQVlFUl9MSVZFX0lORElDQVRPUlwiXScpO1xuICBcdGlmIChsaXZlSW5kaWNhdG9yKSB7XG4gICAgICByZXR1cm4gbGl2ZUluZGljYXRvcjtcbiAgXHR9XG4gICAgcmV0dXJuIHBhcmVudC5sYXN0Q2hpbGQ7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdltkYXRhLXRlc3QtaWRePVwiUExBWUVSX0JBUlwiXScpO1x0XG4gIH0sXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2RpdltkYXRhLXRlc3QtaWRePVwiUExBWUVSX1NPTFVUSU9OXCJdIHZpZGVvJyk7XG4gIH1cbn07XG5cblxuIiwiaW1wb3J0IHsgQnJvd3NlciwgZ2V0QnJvd3NlciwgZ2V0UmVzb3VyY2UgfSBmcm9tICcuLy4uL2NvbW1vbi5qcydcblxuZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdjdXJpb3NpdHlzdHJlYW0nO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3Zqcy1jb250cm9sIHZqcy1idXR0b24nLFxuICBidXR0b25EaWRBcHBlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGlmIChnZXRCcm93c2VyKCkgIT0gQnJvd3Nlci5TQUZBUkkpIHJldHVybjtcbiAgICBjb25zdCB2aWRlbyA9IC8qKiBAdHlwZSB7P0hUTUxWaWRlb0VsZW1lbnR9ICovIChnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCgpKTtcbiAgICBjb25zdCB2aWRlb0NvbnRhaW5lciA9IHZpZGVvLnBhcmVudEVsZW1lbnQ7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0YmVnaW5mdWxsc2NyZWVuJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBoZWlnaHQgPSBNYXRoLmZsb29yKDEwMCAqIHZpZGVvLnZpZGVvSGVpZ2h0IC8gdmlkZW8udmlkZW9XaWR0aCkgKyAndncnO1xuICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gdmlkZW8udmlkZW9IZWlnaHQgKyAncHgnO1xuICAgICAgdmlkZW9Db250YWluZXIuc3R5bGUuc2V0UHJvcGVydHkoJ2hlaWdodCcsIGhlaWdodCwgJ2ltcG9ydGFudCcpO1xuICAgICAgdmlkZW9Db250YWluZXIuc3R5bGUuc2V0UHJvcGVydHkoJ21heC1oZWlnaHQnLCBtYXhIZWlnaHQpO1xuICAgIH0pO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ3dlYmtpdGVuZGZ1bGxzY3JlZW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvQ29udGFpbmVyLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdoZWlnaHQnKTtcbiAgICAgIHZpZGVvQ29udGFpbmVyLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdtYXgtaGVpZ2h0Jyk7XG4gICAgfSk7XG4gIH0sXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4tcGxheWVyJyk7XG4gICAgcmV0dXJuIGUgJiYgZS5xdWVyeVNlbGVjdG9yKCcudmpzLWNvbnRyb2wtYmFyJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjcsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgb3BhY2l0eTogMC44O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLXBsYXllcl9odG1sNV9hcGknKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdjcnVuY2h5cm9sbCc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAndmpzLWNvbnRyb2wgdmpzLWJ1dHRvbicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBvcGFjaXR5OiAxICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uU2NhbGU6IDAuNixcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgcmlnaHQ6IDEwMHB4O1xuICAgIG9wYWNpdHk6IDAuNzU7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICBgKSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZqcy1jb250cm9sLWJhcicpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGxheWVyX2h0bWw1X2FwaScpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ2Nlc2thdGVsZXZpemUnO1xuXG5leHBvcnQgY29uc3QgcmVzb3VyY2UgPSB7XG4gIGJ1dHRvbkNsYXNzTmFtZTogJ3ZpZGVvQnV0dG9uU2hlbGwgZG9udEhpZGVDb250cm9scyBjdXJzb3JQb2ludGVyIGZvY3VzYWJsZUJ0bicsXG4gIGJ1dHRvbkVsZW1lbnRUeXBlOiAnZGl2JyxcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIGZpbHRlcjogYnJpZ2h0bmVzcyg1MCUpIHNlcGlhKDEpIGh1ZS1yb3RhdGUoMTcwZGVnKSBzYXR1cmF0ZSgyNTAlKSBicmlnaHRuZXNzKDkwJSk7XG4gIGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnVsbFNjcmVlblNoZWxsJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAxLjIsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgd2lkdGg6IDE4cHg7XG4gICAgaGVpZ2h0OiAxOHB4O1xuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgYCksXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2aWRlb0J1dHRvbnMnKTtcbiAgfSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZpZGVvJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSAnYmJjJztcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlID0ge1xuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBjYXB0aW9uRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wX3N1YnRpdGxlc0NvbnRhaW5lcicpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWVkaWFDb250YWluZXIgdmlkZW9bc3JjXScpO1xuICB9LFxufTsiLCJleHBvcnQgY29uc3QgZG9tYWluID0gJ2FwcGxlJztcblxuLyoqXG4gKiBSZXR1cm5zIG5lc3RlZCBzaGFkb3cgcm9vdFxuICpcbiAqIEBwYXJhbSB7IUFycmF5PHN0cmluZz59IHNlbGVjdG9yc1xuICogQHJldHVybiB7P1NoYWRvd1Jvb3R9XG4gKi9cbmNvbnN0IGdldE5lc3RlZFNoYWRvd1Jvb3QgPSBmdW5jdGlvbihzZWxlY3RvcnMpIHtcbiAgbGV0IGRvbSA9IGRvY3VtZW50O1xuICBmb3IgKGNvbnN0IHNlbGVjdG9yIG9mIHNlbGVjdG9ycykge1xuICAgIGRvbSA9IC8qKiBAdHlwZSB7SFRNTEVsZW1lbnR9ICovIChkb20ucXVlcnlTZWxlY3RvcihzZWxlY3RvcikpO1xuICAgIGRvbSA9IGRvbSAmJiBkb20uc2hhZG93Um9vdDtcbiAgICBpZiAoIWRvbSkgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIC8qKiBAdHlwZSB7U2hhZG93Um9vdH0gKi8gKGRvbSk7XG59XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnZm9vdGVyX19jb250cm9sIGh5ZHJhdGVkJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgb3BhY2l0eTogMC44ICFpbXBvcnRhbnRgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBpbnRlcm5hbCA9IGdldE5lc3RlZFNoYWRvd1Jvb3QoW1wiYXBwbGUtdHYtcGx1cy1wbGF5ZXJcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFtcC12aWRlby1wbGF5ZXItaW50ZXJuYWxcIl0pO1xuICAgIGlmICghaW50ZXJuYWwpIHJldHVybjtcbiAgICBjb25zdCBmdWxsc2NyZWVuQnV0dG9uID0gaW50ZXJuYWwucXVlcnlTZWxlY3RvcihcImFtcC1wbGF5YmFjay1jb250cm9scy1mdWxsLXNjcmVlblwiKTtcbiAgICBpZiAoIWZ1bGxzY3JlZW5CdXR0b24pIHJldHVybjtcbiAgICByZXR1cm4gZnVsbHNjcmVlbkJ1dHRvbi5wYXJlbnRFbGVtZW50O1xuICB9LFxuICBidXR0b25TdHlsZTogLyoqIENTUyAqLyAoYFxuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4xNXM7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIG9wYWNpdHk6IDAuOTtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdmlkZW8gPSBnZXROZXN0ZWRTaGFkb3dSb290KFtcImFwcGxlLXR2LXBsdXMtcGxheWVyXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbXAtdmlkZW8tcGxheWVyLWludGVybmFsXCIsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbXAtdmlkZW8tcGxheWVyXCJdKTtcbiAgICBpZiAoIXZpZGVvKSByZXR1cm47XG4gICAgcmV0dXJuIHZpZGVvLnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvJyk7XG4gIH0sXG59OyIsImV4cG9ydCBjb25zdCBkb21haW4gPSBbJ2FtYXpvbicsICdwcmltZXZpZGVvJ107XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uSG92ZXJTdHlsZTogLyoqIENTUyAqLyAoYG9wYWNpdHk6IDEgIWltcG9ydGFudGApLFxuICBidXR0b25JbnNlcnRCZWZvcmU6IGZ1bmN0aW9uKC8qKiBFbGVtZW50ICovIHBhcmVudCkge1xuICAgIHJldHVybiBwYXJlbnQucXVlcnlTZWxlY3RvcignLmZ1bGxzY3JlZW5CdXR0b25XcmFwcGVyJyk7XG4gIH0sXG4gIGJ1dHRvblBhcmVudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkdi13ZWItcGxheWVyJyk7XG4gICAgcmV0dXJuIGUgJiYgZS5xdWVyeVNlbGVjdG9yKCcuaGlkZWFibGVUb3BCdXR0b25zJyk7XG4gIH0sXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGxlZnQ6IDhweDtcbiAgICB3aWR0aDogM3Z3O1xuICAgIGhlaWdodDogMnZ3O1xuICAgIG1pbi13aWR0aDogMzVweDtcbiAgICBtaW4taGVpZ2h0OiAyNHB4O1xuICAgIGJvcmRlcjogMHB4O1xuICAgIHBhZGRpbmc6IDBweDtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICBvcGFjaXR5OiAwLjg7XG4gIGApLFxuICBjYXB0aW9uRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkdi13ZWItcGxheWVyJyk7XG4gICAgcmV0dXJuIGUgJiYgZS5xdWVyeVNlbGVjdG9yKCcuY2FwdGlvbnMnKTtcbiAgfSxcbiAgdmlkZW9FbGVtZW50OiBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlbmRlcmVyQ29udGFpbmVyJyk7XG4gICAgcmV0dXJuIGUgJiYgZS5xdWVyeVNlbGVjdG9yKCd2aWRlb1t3aWR0aD1cIjEwMCVcIl0nKTtcbiAgfSxcbn07IiwiZXhwb3J0IGNvbnN0IGRvbWFpbiA9ICdha3R1YWxuZSc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAnanctaWNvbiBqdy1pY29uLWlubGluZSBqdy1idXR0b24tY29sb3IganctcmVzZXQganctaWNvbi1sb2dvJyxcbiAgYnV0dG9uRWxlbWVudFR5cGU6ICdkaXYnLFxuICBidXR0b25Ib3ZlclN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgZmlsdGVyOiBicmlnaHRuZXNzKDUwJSkgc2VwaWEoMSkgaHVlLXJvdGF0ZSgzMTFkZWcpIHNhdHVyYXRlKDU1MCUpIGJyaWdodG5lc3MoNDklKSAhaW1wb3J0YW50O1xuICBgKSxcbiAgYnV0dG9uSW5zZXJ0QmVmb3JlOiBmdW5jdGlvbigvKiogRWxlbWVudCAqLyBwYXJlbnQpIHtcbiAgICByZXR1cm4gcGFyZW50Lmxhc3RDaGlsZDtcbiAgfSxcbiAgYnV0dG9uUGFyZW50OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmp3LWNvbnRyb2xiYXItcmlnaHQtZ3JvdXAnKTtcbiAgfSxcbiAgYnV0dG9uU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICB3aWR0aDogMzhweDtcbiAgICBmaWx0ZXI6IGJyaWdodG5lc3MoODAlKTtcbiAgYCksXG4gIHZpZGVvRWxlbWVudDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3ZpZGVvLmp3LXZpZGVvJyk7XG4gIH0sXG59OyIsImltcG9ydCB7IGdldFJlc291cmNlIH0gZnJvbSAnLi8uLi9jb21tb24uanMnXG5cbmV4cG9ydCBjb25zdCBkb21haW4gPSAnOW5vdyc7XG5cbmV4cG9ydCBjb25zdCByZXNvdXJjZSA9IHtcbiAgYnV0dG9uQ2xhc3NOYW1lOiAndmpzLWNvbnRyb2wgdmpzLWJ1dHRvbicsXG4gIGJ1dHRvbkhvdmVyU3R5bGU6IC8qKiBDU1MgKi8gKGBcbiAgICBmaWx0ZXI6IGJyaWdodG5lc3MoNTAlKSBzZXBpYSgxKSBodWUtcm90YXRlKDE2N2RlZykgc2F0dXJhdGUoMjUzJSkgYnJpZ2h0bmVzcygxMDQlKTtcbiAgYCksXG4gIGJ1dHRvbkluc2VydEJlZm9yZTogZnVuY3Rpb24oLyoqIEVsZW1lbnQgKi8gcGFyZW50KSB7XG4gICAgcmV0dXJuIHBhcmVudC5xdWVyeVNlbGVjdG9yKCcudmpzLWZ1bGxzY3JlZW4tY29udHJvbCcpO1xuICB9LFxuICBidXR0b25QYXJlbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudmpzLWNvbnRyb2wtYmFyJyk7XG4gIH0sXG4gIGJ1dHRvblNjYWxlOiAwLjcsXG4gIGJ1dHRvblN0eWxlOiAvKiogQ1NTICovIChgXG4gICAgb3JkZXI6IDk5OTk5OTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgaGVpZ2h0OiA0NHB4O1xuICAgIHdpZHRoOiA0MHB4O1xuICBgKSxcbiAgY2FwdGlvbkVsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGUgPSBnZXRSZXNvdXJjZSgpLnZpZGVvRWxlbWVudCgpO1xuICAgIHJldHVybiBlICYmIGUucGFyZW50RWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudmpzLXRleHQtdHJhY2stZGlzcGxheScpO1xuICB9LFxuICB2aWRlb0VsZW1lbnQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd2aWRlby52anMtdGVjaCcpO1xuICB9LFxufTsiLCJpbXBvcnQgeyBnZXRSZXNvdXJjZSB9IGZyb20gJy4vY29tbW9uLmpzJ1xuXG4vKipcbiAqIEluaXRpYWxpc2VzIGNhY2hpbmcgZm9yIGJ1dHRvbiwgdmlkZW8sIGFuZCBjYXB0aW9uIGVsZW1lbnRzXG4gKi9cbmV4cG9ydCBjb25zdCBpbml0aWFsaXNlQ2FjaGVzID0gZnVuY3Rpb24oKSB7XG5cbiAgLy8gUmV0dXJuIGEgdW5pcXVlIGlkXG4gIGxldCB1bmlxdWVJZENvdW50ZXIgPSAwO1xuICBjb25zdCAvKiogZnVuY3Rpb24oKTpzdHJpbmcgKi8gdW5pcXVlSWQgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJ1BpUGVyXycgKyB1bmlxdWVJZENvdW50ZXIrKztcbiAgfTtcblxuICAvKipcbiAgICogV3JhcHMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gZWxlbWVudCB0byBwcm92aWRlIGZhc3RlciBsb29rdXBzIGJ5IGlkXG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oYm9vbGVhbj0pOj9FbGVtZW50fSBlbGVtZW50RnVuY3Rpb25cbiAgICogQHJldHVybiB7ZnVuY3Rpb24oYm9vbGVhbj0pOj9FbGVtZW50fSBcbiAgICovXG4gIGNvbnN0IGNhY2hlRWxlbWVudFdyYXBwZXIgPSBmdW5jdGlvbihlbGVtZW50RnVuY3Rpb24pIHtcbiAgICBsZXQgLyoqID9zdHJpbmcgKi8gY2FjaGVkRWxlbWVudElkID0gbnVsbDtcblxuICAgIHJldHVybiAvKiogZnVuY3Rpb24oKTo/RWxlbWVudCAqLyBmdW5jdGlvbigvKiogYm9vbGVhbj0gKi8gYnlwYXNzQ2FjaGUpIHtcblxuICAgICAgLy8gUmV0dXJuIGVsZW1lbnQgYnkgaWQgaWYgcG9zc2libGVcbiAgICAgIGNvbnN0IGNhY2hlZEVsZW1lbnQgPSBjYWNoZWRFbGVtZW50SWQgPyBcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjYWNoZWRFbGVtZW50SWQpIDogbnVsbDtcbiAgICAgIGlmIChjYWNoZWRFbGVtZW50ICYmICFieXBhc3NDYWNoZSkgcmV0dXJuIGNhY2hlZEVsZW1lbnQ7XG5cbiAgICAgIC8vIENhbGwgdGhlIHVuZGVybHlpbmcgZnVuY3Rpb24gdG8gZ2V0IHRoZSBlbGVtZW50XG4gICAgICBjb25zdCB1bmNhY2hlZEVsZW1lbnQgPSBlbGVtZW50RnVuY3Rpb24oKTtcbiAgICAgIGlmICh1bmNhY2hlZEVsZW1lbnQpIHtcblxuICAgICAgICAvLyBTYXZlIHRoZSBuYXRpdmUgaWQgb3RoZXJ3aXNlIGFzc2lnbiBhIHVuaXF1ZSBpZFxuICAgICAgICBpZiAoIXVuY2FjaGVkRWxlbWVudC5pZCkgdW5jYWNoZWRFbGVtZW50LmlkID0gdW5pcXVlSWQoKTtcbiAgICAgICAgY2FjaGVkRWxlbWVudElkID0gdW5jYWNoZWRFbGVtZW50LmlkO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVuY2FjaGVkRWxlbWVudDtcbiAgICB9O1xuICB9O1xuXG4gIC8vIFdyYXAgdGhlIGJ1dHRvbiwgdmlkZW8sIGFuZCBjYXB0aW9uIGVsZW1lbnRzXG4gIGNvbnN0IGN1cnJlbnRSZXNvdXJjZSA9IGdldFJlc291cmNlKCk7XG4gIGN1cnJlbnRSZXNvdXJjZS5idXR0b25QYXJlbnQgPSBjYWNoZUVsZW1lbnRXcmFwcGVyKGN1cnJlbnRSZXNvdXJjZS5idXR0b25QYXJlbnQpO1xuICBjdXJyZW50UmVzb3VyY2UudmlkZW9FbGVtZW50ID0gY2FjaGVFbGVtZW50V3JhcHBlcihjdXJyZW50UmVzb3VyY2UudmlkZW9FbGVtZW50KTtcbiAgaWYgKGN1cnJlbnRSZXNvdXJjZS5jYXB0aW9uRWxlbWVudCkge1xuICAgIGN1cnJlbnRSZXNvdXJjZS5jYXB0aW9uRWxlbWVudCA9IGNhY2hlRWxlbWVudFdyYXBwZXIoY3VycmVudFJlc291cmNlLmNhcHRpb25FbGVtZW50KTtcbiAgfVxufTsiLCIvKiogQXV0by1nZW5lcmF0ZWQgZmlsZSAqKi9cblxuaW1wb3J0ICogYXMgcjEgZnJvbSBcIi4vOW5vdy5qc1wiO1xuaW1wb3J0ICogYXMgcjIgZnJvbSBcIi4vYWt0dWFsbmUuanNcIjtcbmltcG9ydCAqIGFzIHIzIGZyb20gXCIuL2FtYXpvbi5qc1wiO1xuaW1wb3J0ICogYXMgcjQgZnJvbSBcIi4vYXBwbGUuanNcIjtcbmltcG9ydCAqIGFzIHI1IGZyb20gXCIuL2JiYy5qc1wiO1xuaW1wb3J0ICogYXMgcjYgZnJvbSBcIi4vY2Vza2F0ZWxldml6ZS5qc1wiO1xuaW1wb3J0ICogYXMgcjcgZnJvbSBcIi4vY3J1bmNoeXJvbGwuanNcIjtcbmltcG9ydCAqIGFzIHI4IGZyb20gXCIuL2N1cmlvc2l0eXN0cmVhbS5qc1wiO1xuaW1wb3J0ICogYXMgcjkgZnJvbSBcIi4vZGF6bi5qc1wiO1xuaW1wb3J0ICogYXMgcjEwIGZyb20gXCIuL2Rpc25leXBsdXMuanNcIjtcbmltcG9ydCAqIGFzIHIxMSBmcm9tIFwiLi9lc3BuLmpzXCI7XG5pbXBvcnQgKiBhcyByMTIgZnJvbSBcIi4vZXVyb3Nwb3J0cGxheWVyLmpzXCI7XG5pbXBvcnQgKiBhcyByMTMgZnJvbSBcIi4vZnVib3R2LmpzXCI7XG5pbXBvcnQgKiBhcyByMTQgZnJvbSBcIi4vZ2lhbnRib21iLmpzXCI7XG5pbXBvcnQgKiBhcyByMTUgZnJvbSBcIi4vaHVsdS5qc1wiO1xuaW1wb3J0ICogYXMgcjE2IGZyb20gXCIuL2xpdHRsZXRoaW5ncy5qc1wiO1xuaW1wb3J0ICogYXMgcjE3IGZyb20gXCIuL21hc2hhYmxlLmpzXCI7XG5pbXBvcnQgKiBhcyByMTggZnJvbSBcIi4vbWV0YWNhZmUuanNcIjtcbmltcG9ydCAqIGFzIHIxOSBmcm9tIFwiLi9taXhlci5qc1wiO1xuaW1wb3J0ICogYXMgcjIwIGZyb20gXCIuL21sYi5qc1wiO1xuaW1wb3J0ICogYXMgcjIxIGZyb20gXCIuL25ldGZsaXguanNcIjtcbmltcG9ydCAqIGFzIHIyMiBmcm9tIFwiLi9vY3MuanNcIjtcbmltcG9ydCAqIGFzIHIyMyBmcm9tIFwiLi9vcGVubG9hZC5qc1wiO1xuaW1wb3J0ICogYXMgcjI0IGZyb20gXCIuL3Bicy5qc1wiO1xuaW1wb3J0ICogYXMgcjI1IGZyb20gXCIuL3BlcmlzY29wZS5qc1wiO1xuaW1wb3J0ICogYXMgcjI2IGZyb20gXCIuL3BsZXguanNcIjtcbmltcG9ydCAqIGFzIHIyNyBmcm9tIFwiLi9zZXpuYW0uanNcIjtcbmltcG9ydCAqIGFzIHIyOCBmcm9tIFwiLi9zdHJlYW1hYmxlLmpzXCI7XG5pbXBvcnQgKiBhcyByMjkgZnJvbSBcIi4vdGVkLmpzXCI7XG5pbXBvcnQgKiBhcyByMzAgZnJvbSBcIi4vdGhlb25pb24uanNcIjtcbmltcG9ydCAqIGFzIHIzMSBmcm9tIFwiLi90d2l0Y2guanNcIjtcbmltcG9ydCAqIGFzIHIzMiBmcm9tIFwiLi91ZGVteS5qc1wiO1xuaW1wb3J0ICogYXMgcjMzIGZyb20gXCIuL3VzdHJlYW0uanNcIjtcbmltcG9ydCAqIGFzIHIzNCBmcm9tIFwiLi92ZXZvLmpzXCI7XG5pbXBvcnQgKiBhcyByMzUgZnJvbSBcIi4vdmljZS5qc1wiO1xuaW1wb3J0ICogYXMgcjM2IGZyb20gXCIuL3ZpZC5qc1wiO1xuaW1wb3J0ICogYXMgcjM3IGZyb20gXCIuL3ZpZXJ2aWpmemVzLmpzXCI7XG5pbXBvcnQgKiBhcyByMzggZnJvbSBcIi4vdmsuanNcIjtcbmltcG9ydCAqIGFzIHIzOSBmcm9tIFwiLi92cnQuanNcIjtcbmltcG9ydCAqIGFzIHI0MCBmcm9tIFwiLi92cnYuanNcIjtcbmltcG9ydCAqIGFzIHI0MSBmcm9tIFwiLi95ZWxvcGxheS5qc1wiO1xuaW1wb3J0ICogYXMgcjQyIGZyb20gXCIuL3lvdXR1YmUuanNcIjtcblxuZXhwb3J0IGNvbnN0IHJlc291cmNlcyA9IHt9O1xuXG5yZXNvdXJjZXNbcjEuZG9tYWluXSA9IHIxLnJlc291cmNlO1xucmVzb3VyY2VzW3IyLmRvbWFpbl0gPSByMi5yZXNvdXJjZTtcbnJlc291cmNlc1snYW1hem9uJ10gPSByMy5yZXNvdXJjZTtcbnJlc291cmNlc1tyNC5kb21haW5dID0gcjQucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjUuZG9tYWluXSA9IHI1LnJlc291cmNlO1xucmVzb3VyY2VzW3I2LmRvbWFpbl0gPSByNi5yZXNvdXJjZTtcbnJlc291cmNlc1tyNy5kb21haW5dID0gcjcucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjguZG9tYWluXSA9IHI4LnJlc291cmNlO1xucmVzb3VyY2VzW3I5LmRvbWFpbl0gPSByOS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTAuZG9tYWluXSA9IHIxMC5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTEuZG9tYWluXSA9IHIxMS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTIuZG9tYWluXSA9IHIxMi5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTMuZG9tYWluXSA9IHIxMy5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTQuZG9tYWluXSA9IHIxNC5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTUuZG9tYWluXSA9IHIxNS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTYuZG9tYWluXSA9IHIxNi5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTcuZG9tYWluXSA9IHIxNy5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTguZG9tYWluXSA9IHIxOC5yZXNvdXJjZTtcbnJlc291cmNlc1tyMTkuZG9tYWluXSA9IHIxOS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMjAuZG9tYWluXSA9IHIyMC5yZXNvdXJjZTtcbnJlc291cmNlc1tyMjEuZG9tYWluXSA9IHIyMS5yZXNvdXJjZTtcbnJlc291cmNlc1tyMjIuZG9tYWluXSA9IHIyMi5yZXNvdXJjZTtcbnJlc291cmNlc1snb3BlbmxvYWQnXSA9IHIyMy5yZXNvdXJjZTtcbnJlc291cmNlc1tyMjQuZG9tYWluXSA9IHIyNC5yZXNvdXJjZTtcbnJlc291cmNlc1sncGVyaXNjb3BlJ10gPSByMjUucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjI2LmRvbWFpbl0gPSByMjYucmVzb3VyY2U7XG5yZXNvdXJjZXNbJ3Nlem5hbSddID0gcjI3LnJlc291cmNlO1xucmVzb3VyY2VzW3IyOC5kb21haW5dID0gcjI4LnJlc291cmNlO1xucmVzb3VyY2VzW3IyOS5kb21haW5dID0gcjI5LnJlc291cmNlO1xucmVzb3VyY2VzW3IzMC5kb21haW5dID0gcjMwLnJlc291cmNlO1xucmVzb3VyY2VzW3IzMS5kb21haW5dID0gcjMxLnJlc291cmNlO1xucmVzb3VyY2VzW3IzMi5kb21haW5dID0gcjMyLnJlc291cmNlO1xucmVzb3VyY2VzW3IzMy5kb21haW5dID0gcjMzLnJlc291cmNlO1xucmVzb3VyY2VzW3IzNC5kb21haW5dID0gcjM0LnJlc291cmNlO1xucmVzb3VyY2VzW3IzNS5kb21haW5dID0gcjM1LnJlc291cmNlO1xucmVzb3VyY2VzW3IzNi5kb21haW5dID0gcjM2LnJlc291cmNlO1xucmVzb3VyY2VzWyd2aWpmJ10gPSByMzcucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjM4LmRvbWFpbl0gPSByMzgucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjM5LmRvbWFpbl0gPSByMzkucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjQwLmRvbWFpbl0gPSByNDAucmVzb3VyY2U7XG5yZXNvdXJjZXNbcjQxLmRvbWFpbl0gPSByNDEucmVzb3VyY2U7XG5yZXNvdXJjZXNbJ3lvdXR1YmUnXSA9IHI0Mi5yZXNvdXJjZTtcblxucmVzb3VyY2VzWydwcmltZXZpZGVvJ10gPSByZXNvdXJjZXNbJ2FtYXpvbiddO1xucmVzb3VyY2VzWydvbG9hZCddID0gcmVzb3VyY2VzWydvcGVubG9hZCddO1xucmVzb3VyY2VzWydwc2NwJ10gPSByZXNvdXJjZXNbJ3BlcmlzY29wZSddO1xucmVzb3VyY2VzWydzdHJlYW0nXSA9IHJlc291cmNlc1snc2V6bmFtJ107XG5yZXNvdXJjZXNbJ3ZpZXInXSA9IHJlc291cmNlc1sndmlqZiddO1xucmVzb3VyY2VzWyd6ZXMnXSA9IHJlc291cmNlc1sndmlqZiddO1xucmVzb3VyY2VzWyd5b3V0dSddID0gcmVzb3VyY2VzWyd5b3V0dWJlJ107XG4iLCJpbXBvcnQgeyBpbmZvIH0gZnJvbSAnLi9sb2dnZXIuanMnXG5pbXBvcnQgeyBCcm93c2VyLCBnZXRCcm93c2VyLCBnZXRSZXNvdXJjZSwgc2V0UmVzb3VyY2UgfSBmcm9tICcuL2NvbW1vbi5qcydcbmltcG9ydCB7IGFkZFZpZGVvRWxlbWVudExpc3RlbmVycyB9IGZyb20gJy4vdmlkZW8uanMnXG5pbXBvcnQgeyByZXNvdXJjZXMgfSBmcm9tICcuL3Jlc291cmNlcy9pbmRleC5qcyc7XG5pbXBvcnQgeyBjaGVja0J1dHRvbiwgYWRkQnV0dG9uIH0gZnJvbSAnLi9idXR0b24uanMnXG5pbXBvcnQgeyBzaG91bGRQcm9jZXNzQ2FwdGlvbnMsIGVuYWJsZUNhcHRpb25zLCBwcm9jZXNzQ2FwdGlvbnMsIGFkZFZpZGVvQ2FwdGlvblRyYWNrcyB9IGZyb20gJy4vY2FwdGlvbnMuanMnXG5pbXBvcnQgeyBpbml0aWFsaXNlQ2FjaGVzIH0gZnJvbSAnLi9jYWNoZS5qcydcblxuLyoqXG4gKiBUcmFja3MgaW5qZWN0ZWQgYnV0dG9uIGFuZCBjYXB0aW9uc1xuICovXG5jb25zdCBtdXRhdGlvbk9ic2VydmVyID0gZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGN1cnJlbnRSZXNvdXJjZSA9IGdldFJlc291cmNlKCk7XG5cbiAgLy8gUHJvY2VzcyB2aWRlbyBjYXB0aW9ucyBpZiBuZWVkZWRcbiAgaWYgKHNob3VsZFByb2Nlc3NDYXB0aW9ucygpKSBwcm9jZXNzQ2FwdGlvbnMoKTtcblxuICAvLyBXb3JrYXJvdW5kIENocm9tZSdzIGxhY2sgb2YgYW4gZW50ZXJpbmcgUGljdHVyZSBpbiBQaWN0dXJlIG1vZGUgZXZlbnQgYnkgbW9uaXRvcmluZyBhbGwgdmlkZW8gZWxlbWVudHNcbiAgaWYgKGdldEJyb3dzZXIoKSA9PSBCcm93c2VyLkNIUk9NRSkgYWRkVmlkZW9FbGVtZW50TGlzdGVuZXJzKCk7XG5cbiAgLy8gV29ya2Fyb3VuZCBTYWZhcmkgYnVnOyBjYXB0aW9ucyBhcmUgbm90IGRpc3BsYXllZCBpZiB0aGUgdHJhY2sgaXMgYWRkZWQgYWZ0ZXIgdGhlIHZpZGVvIGhhcyBsb2FkZWRcbiAgaWYgKGdldEJyb3dzZXIoKSA9PSBCcm93c2VyLlNBRkFSSSAmJiBjdXJyZW50UmVzb3VyY2UuY2FwdGlvbkVsZW1lbnQpIGFkZFZpZGVvQ2FwdGlvblRyYWNrcygpO1xuXG4gIC8vIFRyeSBhZGRpbmcgdGhlIGJ1dHRvbiB0byB0aGUgcGFnZSBpZiBuZWVkZWRcbiAgaWYgKGNoZWNrQnV0dG9uKCkpIHJldHVybjtcbiAgY29uc3QgYnV0dG9uUGFyZW50ID0gY3VycmVudFJlc291cmNlLmJ1dHRvblBhcmVudCgpO1xuICBpZiAoYnV0dG9uUGFyZW50KSB7XG4gICAgYWRkQnV0dG9uKGJ1dHRvblBhcmVudCk7XG4gICAgaWYgKGN1cnJlbnRSZXNvdXJjZS5idXR0b25EaWRBcHBlYXIpIGN1cnJlbnRSZXNvdXJjZS5idXR0b25EaWRBcHBlYXIoKTtcbiAgICBpbmZvKCdQaWN0dXJlIGluIFBpY3R1cmUgYnV0dG9uIGFkZGVkIHRvIHdlYnBhZ2UnKTtcbiAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBub24tcHVibGljIHN1YmRvbWFpbiBmcm9tIHRoZSBjdXJyZW50IGRvbWFpbiBuYW1lXG4gKlxuICogQHJldHVybiB7c3RyaW5nfHVuZGVmaW5lZH1cbiAqL1xuY29uc3QgZ2V0Q3VycmVudERvbWFpbk5hbWUgPSBmdW5jdGlvbigpIHtcblxuICAvLyBTcGVjaWFsIGNhc2UgZm9yIGxvY2FsIFBsZXggTWVkaWEgU2VydmVyIGFjY2VzcyB0aGF0IGFsd2F5cyB1c2VzIHBvcnQgMzI0MDBcbiAgaWYgKGxvY2F0aW9uLnBvcnQgPT0gMzI0MDApIHtcbiAgICByZXR1cm4gJ3BsZXgnO1xuICB9IGVsc2Uge1xuICAgIC8vIFJlbW92ZSBzdWJkb21haW4gYW5kIHB1YmxpYyBzdWZmaXggKGZhciBmcm9tIGNvbXByZWhlbnNpdmUgYXMgb25seSByZW1vdmVzIC5YIGFuZCAuY28uWSlcbiAgICByZXR1cm4gKGxvY2F0aW9uLmhvc3RuYW1lLm1hdGNoKC8oW14uXSspXFwuKD86Y29tP1xcLik/W14uXSskLykgfHwgW10pWzFdO1xuICB9XG59O1xuXG5jb25zdCBkb21haW5OYW1lID0gZ2V0Q3VycmVudERvbWFpbk5hbWUoKTtcblxuaWYgKGRvbWFpbk5hbWUgaW4gcmVzb3VyY2VzKSB7XG4gIGluZm8oYE1hdGNoZWQgc2l0ZSAke2RvbWFpbk5hbWV9ICgke2xvY2F0aW9ufSlgKTtcbiAgc2V0UmVzb3VyY2UocmVzb3VyY2VzW2RvbWFpbk5hbWVdKTtcblxuICBpbml0aWFsaXNlQ2FjaGVzKCk7XG5cbiAgaWYgKGdldEJyb3dzZXIoKSA9PSBCcm93c2VyLlNBRkFSSSkge1xuICAgIGVuYWJsZUNhcHRpb25zKHRydWUpO1xuICB9XG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbk9ic2VydmVyKTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCwge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICB9KTtcbiAgbXV0YXRpb25PYnNlcnZlcigpO1xufVxuIl0sCiJuYW1lcyI6WyJMT0dHSU5HX0xFVkVMIiwiQlJPV1NFUiIsIiRqc2NvbXAkdG1wJGV4cG9ydHMkbW9kdWxlJG5hbWUiLCJsb2dnaW5nUHJlZml4IiwiTG9nZ2luZ0xldmVsIiwiQUxMIiwiVFJBQ0UiLCJJTkZPIiwiV0FSTklORyIsIkVSUk9SIiwidHJhY2UiLCJjb25zb2xlIiwiYmluZCIsImluZm8iLCJ3YXJuIiwiZXJyb3IiLCJCcm93c2VyIiwiVU5LTk9XTiIsIlNBRkFSSSIsIkNIUk9NRSIsImdldEJyb3dzZXIiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidmVuZG9yIiwiUGlwZXJSZXNvdXJjZSIsImN1cnJlbnRSZXNvdXJjZSIsImdldFJlc291cmNlIiwic2V0UmVzb3VyY2UiLCJyZXNvdXJjZSIsImdldEV4dGVuc2lvblVSTCIsInBhdGgiLCJzYWZhcmkiLCJleHRlbnNpb24iLCJiYXNlVVJJIiwiY2hyb21lIiwicnVudGltZSIsImdldFVSTCIsImJ5cGFzc0JhY2tncm91bmRUaW1lclRocm90dGxpbmciLCJjYXB0aW9uRWxlbWVudCIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvbmxvYWQiLCJyZXF1ZXN0Lm9ubG9hZCIsInNjcmlwdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZSIsImFwcGVuZENoaWxkIiwiY3JlYXRlVGV4dE5vZGUiLCJyZXNwb25zZVRleHQiLCJoZWFkIiwic2VuZCIsIkNIUk9NRV9QTEFZSU5HX1BJUF9BVFRSSUJVVEUiLCJldmVudExpc3RlbmVycyIsInRvZ2dsZVBpY3R1cmVJblBpY3R1cmUiLCJ2aWRlbyIsInBsYXlpbmdQaWN0dXJlSW5QaWN0dXJlIiwidmlkZW9QbGF5aW5nUGljdHVyZUluUGljdHVyZSIsIndlYmtpdFNldFByZXNlbnRhdGlvbk1vZGUiLCJ0ZXh0Q29udGVudCIsInJlbW92ZSIsInJlbW92ZUF0dHJpYnV0ZSIsInJlcXVlc3RQaWN0dXJlSW5QaWN0dXJlIiwiYWRkUGljdHVyZUluUGljdHVyZUV2ZW50TGlzdGVuZXIiLCJsaXN0ZW5lciIsImluZGV4IiwiaW5kZXhPZiIsInB1c2giLCJhZGRFdmVudExpc3RlbmVyIiwidmlkZW9QcmVzZW50YXRpb25Nb2RlQ2hhbmdlZCIsImNhcHR1cmUiLCJyZW1vdmVQaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lciIsInNwbGljZSIsImxlbmd0aCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXNwYXRjaFBpY3R1cmVJblBpY3R1cmVFdmVudCIsImV4cGVjdGVkVmlkZW8iLCJ2aWRlb0VsZW1lbnQiLCJpc1BsYXlpbmdQaWN0dXJlSW5QaWN0dXJlIiwiZXZlbnRMaXN0ZW5lcnNDb3B5Iiwic2xpY2UiLCJwb3AiLCJldmVudCIsInRhcmdldCIsIndlYmtpdFByZXNlbnRhdGlvbk1vZGUiLCJoYXNBdHRyaWJ1dGUiLCJ2aWRlb0RpZEVudGVyUGljdHVyZUluUGljdHVyZSIsIm9uY2UiLCJhZGRWaWRlb0VsZW1lbnRMaXN0ZW5lcnMiLCJlbGVtZW50cyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiZWxlbWVudCIsImxvY2FsaXphdGlvbnMiLCJkZWZhdWx0TGFuZ3VhZ2UiLCJsb2NhbGl6ZWRTdHJpbmciLCJrZXkiLCJsYW5ndWFnZSIsInN1YnN0cmluZyIsImxvY2FsaXphdGlvbnNGb3JLZXkiLCJzdHJpbmciLCJsb2NhbGl6ZWRTdHJpbmdXaXRoUmVwbGFjZW1lbnRzIiwicmVwbGFjZW1lbnRzIiwicmVwbGFjZW1lbnQiLCJyZWdleCIsIlJlZ0V4cCIsInJlcGxhY2UiLCJUUkFDS19JRCIsInRyYWNrIiwiY2FwdGlvbnNFbmFibGVkIiwic2hvd2luZ0NhcHRpb25zIiwic2hvd2luZ0VtcHR5Q2FwdGlvbiIsImxhc3RVbnByb2Nlc3NlZENhcHRpb24iLCJkaXNhYmxlQ2FwdGlvbnMiLCJwcm9jZXNzQ2FwdGlvbnMiLCJwaWN0dXJlSW5QaWN0dXJlRXZlbnRMaXN0ZW5lciIsImVuYWJsZUNhcHRpb25zIiwiaWdub3JlTm93UGxheWluZ0NoZWNrIiwiZ2V0Q2FwdGlvblRyYWNrIiwic2hvdWxkUHJvY2Vzc0NhcHRpb25zIiwiYWxsVHJhY2tzIiwidGV4dFRyYWNrcyIsInRyYWNrSWQiLCJsYWJlbCIsImFkZFRleHRUcmFjayIsImFkZFZpZGVvQ2FwdGlvblRyYWNrcyIsIm1vZGUiLCJyZW1vdmVDYXB0aW9ucyIsIndvcmthcm91bmQiLCJhY3RpdmVDdWVzIiwicmVtb3ZlQ3VlIiwiYWRkQ3VlIiwiVlRUQ3VlIiwiY3VycmVudFRpbWUiLCJhZGRDYXB0aW9uIiwiY2FwdGlvbiIsInN0eWxlIiwidmlzaWJpbGl0eSIsInVucHJvY2Vzc2VkQ2FwdGlvbiIsIndhbGsiLCJjcmVhdGVUcmVlV2Fsa2VyIiwiTm9kZUZpbHRlciIsIlNIT1dfVEVYVCIsIm5leHROb2RlIiwic2VnbWVudCIsImN1cnJlbnROb2RlIiwibm9kZVZhbHVlIiwidHJpbSIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJwYXJlbnRFbGVtZW50IiwiZm9udFN0eWxlIiwidGV4dERlY29yYXRpb24iLCJjaGFyQXQiLCJCVVRUT05fSUQiLCJidXR0b24iLCJhZGRCdXR0b24iLCJwYXJlbnQiLCJidXR0b25FbGVtZW50VHlwZSIsImlkIiwidGl0bGUiLCJidXR0b25TdHlsZSIsImNzc1RleHQiLCJidXR0b25DbGFzc05hbWUiLCJjbGFzc05hbWUiLCJpbWFnZSIsIndpZHRoIiwiaGVpZ2h0IiwiYnV0dG9uU2NhbGUiLCJ0cmFuc2Zvcm0iLCJidXR0b25JbWFnZSIsImJ1dHRvbkV4aXRJbWFnZSIsImJ1dHRvbkltYWdlVVJMIiwic3JjIiwiYnV0dG9uRXhpdEltYWdlVVJMIiwiYnV0dG9uSG92ZXJTdHlsZSIsImNzcyIsInByZXZlbnREZWZhdWx0IiwicmVmZXJlbmNlTm9kZSIsImJ1dHRvbkluc2VydEJlZm9yZSIsImluc2VydEJlZm9yZSIsImdldEJ1dHRvbiIsImNoZWNrQnV0dG9uIiwiZ2V0RWxlbWVudEJ5SWQiLCJkb21haW4iLCJidXR0b25EaWRBcHBlYXIiLCJuZWlnaGJvdXJCdXR0b24iLCJuZXh0U2libGluZyIsIm5laWdoYm91clRpdGxlIiwiZGlzcGF0Y2hFdmVudCIsIkV2ZW50IiwiY2FwdGlvbnNWaXNpYmxlIiwibmF2aWdhdGVTdGFydCIsIm5hdmlnYXRlRmluaXNoIiwibGFzdENoaWxkIiwiYnV0dG9uUGFyZW50IiwicXVlcnlTZWxlY3RvciIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJmdWxsU2NyZWVuQnV0dG9uIiwib3JkZXIiLCJ0b29sdGlwIiwiZnVsbHNjcmVlbkJ1dHRvbiIsInBsYXlCdXR0b24iLCJpbWciLCJjbGFzc0xpc3QiLCJhZGQiLCJwcm9ncmVzc0JhciIsInByb2dyZXNzQmFyU3R5bGUiLCJyaWdodCIsInBhcnNlSW50IiwiZSIsInByZXZpb3VzU2libGluZyIsInRvVXBwZXJDYXNlIiwiZGlzcGxheSIsImJvdHRvbSIsImxpdmVJbmRpY2F0b3IiLCJ2aWRlb0NvbnRhaW5lciIsIk1hdGgiLCJmbG9vciIsInZpZGVvSGVpZ2h0IiwidmlkZW9XaWR0aCIsIm1heEhlaWdodCIsInNldFByb3BlcnR5IiwicmVtb3ZlUHJvcGVydHkiLCJnZXROZXN0ZWRTaGFkb3dSb290Iiwic2VsZWN0b3JzIiwiZG9tIiwic2VsZWN0b3IiLCJzaGFkb3dSb290IiwiaW50ZXJuYWwiLCJpbml0aWFsaXNlQ2FjaGVzIiwidW5pcXVlSWRDb3VudGVyIiwidW5pcXVlSWQiLCJjYWNoZUVsZW1lbnRXcmFwcGVyIiwiZWxlbWVudEZ1bmN0aW9uIiwiY2FjaGVkRWxlbWVudElkIiwiYnlwYXNzQ2FjaGUiLCJjYWNoZWRFbGVtZW50IiwidW5jYWNoZWRFbGVtZW50IiwicmVzb3VyY2VzIiwibXV0YXRpb25PYnNlcnZlciIsImdldEN1cnJlbnREb21haW5OYW1lIiwibG9jYXRpb24iLCJwb3J0IiwiaG9zdG5hbWUiLCJtYXRjaCIsImRvbWFpbk5hbWUiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSJdCn0K
