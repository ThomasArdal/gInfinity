///////// BOOTSTRAP ////////

function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({ url: "options.html" });
}
install_notice();

if (!localStorage["enable_focus"]) localStorage["enable_focus"] = "true"
if (!localStorage["enable_infinite_scroll"]) localStorage["enable_infinite_scroll"] = "true"
if (!localStorage["enable_links"]) localStorage["enable_links"] = "true"
if (!localStorage["enable_tabs"]) localStorage["enable_tabs"] = "false"
if (!localStorage["enable_ping"]) localStorage["enable_ping"] = "false"

function globalEval(src, callback) {
  if (window.execScript) {window.execScript(src);if (callback){callback();} return;} 
  var fn = function() {window.eval.call(window,src);
  if (callback){callback();}};fn();
}

//////// FOCUS ////////////

var xpath;

// Set focus on element in xpath.
function focusThis() {
    return function (info, tab) {
        if (!xpath) {
            return;
        }

        try {
            localStorage['focus_' + info.pageUrl] = xpath;
        } catch (e) {
            console.log(e);
            if (e == QUOTA_EXCEEDED_ERR) {
                var notification = webkitNotifications.createNotification(
                    'images/infen_logo_48x48.png',
                    'Whoops!',  // notification title
                    'Quota exceeded. Try unfocusing some sites to free up space.'
                );
                notification.show();
            }
        }
    };
}

// Remote focus for the current url.
function unfocusThis() {
    return function (info, tab) {
        localStorage.removeItem('focus_' + info.pageUrl);
    }
}

function setFocus(url) {
    var elementXpath = localStorage['focus_' + url];
    if (!elementXpath) {
		return;
    }

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, { xpath: elementXpath }, function(response) { });
    });
}

var focusId = chrome.contextMenus.create({ "title": "Focus", "type": "normal", "contexts": ["editable"], "onclick": focusThis() });
var unfocusId = chrome.contextMenus.create({ "title": "Unfocus", "type": "normal", "contexts": ["editable"], "onclick": unfocusThis() });

////////// SHARED //////////////

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "setFocus") {
        chrome.tabs.getSelected(null, function (tab) {
            setFocus(tab.url);
        });
    } else if (request.method == "setXPath") {
        xpath = request.xpath;
    } else if (request.method == "getLocalStorage") {
        sendResponse({ data: localStorage[request.key] });
    } else {
        sendResponse({});
    }
});
