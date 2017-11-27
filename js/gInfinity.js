// Variables
var codes = new Array(8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39,
                      40, 45, 46, 91, 92, 93, 112, 113, 114, 115, 116, 117, 118,
                      119, 120, 121, 122, 123, 144, 145);

reg = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

function getIndex(input) {
    var index = -1, i = 0, found = false;
    while (i < input.form.length && index == -1)
        if (input.form[i] == input) index = i;
        else i++;
    return index;
}

// Listen for scroll and do infinite scroll in Google search results.
function execute() {
    alreadyloading = false;
    var nextAnchor = $('#pnnext');
    if (!nextAnchor) return;
    var href = nextAnchor.attr('href');
    var nextPage = 2;
    var previousUrl;
    $(window).scroll(function () {
        var rso = $('#rso');
        if (!rso) return;
        if (($(window).scrollTop() + $(window).height()) >= ($('body').height() * 0.9)) {
            if (alreadyloading == false) {
                alreadyloading = true;
                var parts = window.location.href.split('/');
                if (parts.length < 3) {
                    alreadyloading = false;
                    return;
                }

                if (href) {
                    rso.append($('<img/>').attr('src', chrome.runtime.getURL('images/progress.gif')).attr('id', 'ginfinity-progress').attr('style', 'margin-bottom: 20px;'));
                    $.get(href, function (data) {
                        if (document.location.href != previousUrl) {
                            nextPage = 2; // reset
                        } else {
                            nextPage++;
                        }

                        previousUrl = document.location.href;
                        var jData = $(data);
                        var toAppend = jData.find('#rso').html();
                        nextAnchor = jData.find('#pnnext');
                        if (!nextAnchor) {
                            href = null;
                        } else {
                            href = nextAnchor.attr('href');
                        }

                        // Insert preview in all results
                        while (toAppend.indexOf('</h3><div class="s">') != -1) {
                            toAppend = toAppend.replace('</h3><div class="s">', '</h3><div class="vspib" aria-label="Result details" role="button" tabindex="0"><div class="vspii"><div class="vspiic"></div></div></div><div class="s">');
                        }

                        /// Show potential video thumbs
                        var scripts = new Array();
                        $.each($(toAppend).find('img[id^="vidthumb"],img[id^="imgthumb"],img[id^="leftthumb"]'), function (i, v) {
                            var random = Math.floor(Math.random() * 1000000000);
                            var id = $(this).attr('id');
                            toAppend = toAppend.replace('id="' + id, 'id="' + random);
                            jData.filter('script').each(function (e, v) {
                                var html = $(v).html();
                                if (html != null && html.indexOf("(function(x){x&&(x.src='data:image/jpeg;base64") != -1 && html.indexOf(id) != -1) {
                                    scripts.push(html.replace(id, random));
                                }
                            });
                        });

                        var colors = ["007D08", "D62408", "1645AE"];
                        var pageHeader = '<span style="text-shadow:1px 1px 2px #000;font-weight:bold;font-size:x-large;"><span style="color:#1645AE;">P</span><span style="color:#D62408;">a</span><span style="color:#EFBA00;">g</span><span style="color:#1645AE;">e</span> ';
                        $.each(nextPage.toString().split(""), function (i, v) {
                            pageHeader = pageHeader + '<span style="color:#' + colors[i] + ';">' + v + '</span>';
                        });
                        pageHeader = pageHeader + '</span>';

                        $('#ginfinity-progress').remove();
                        rso.append($('<li></li>').attr('class', 'g').html(pageHeader));
                        rso.append(toAppend);

                        $.each(scripts, function (i, v) {
                            eval(v);
                        });

                        alreadyloading = false;
                    });
                } else {
                    alreadyloading = false;
                }
            }
        }
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var elements = getElementsByXPath(document, request.xpath);
    if (elements && elements.length > 0) {
        $(elements[0]).focus();
    }
    sendResponse();
});

// Send xpath info about selected input field when clicking the context menu.

chrome.runtime.sendMessage({ method: "getLocalStorage", key: "enable_focus" }, function (response) {
    if (response.data == "true") {
        document.addEventListener("contextmenu", function (event) {
            if ($(event.target).is(':input')) {
                var xpath = getElementXPath(event.target);
                if (!xpath || xpath == '') {
                    return;
                }

                chrome.runtime.sendMessage({ xpath: xpath, method: "setXPath" }, function (response) { });
            }
        });
    }
});

$(document).ready(function () {
    if (document.location.href.indexOf('://www.google.') != -1) {
        chrome.runtime.sendMessage({ method: "getLocalStorage", key: "enable_infinite_scroll" }, function (response) {
            if (response.data == "true") {
                // Wait for Google to load the page
                setTimeout('execute()', 1000);
            }
        });
    }

    chrome.runtime.sendMessage({ method: "getLocalStorage", key: "enable_focus" }, function (response) {
        if (response.data == "true") {
            chrome.runtime.sendMessage({ method: "setFocus" }, function (response) {
            });
        }
    });

    // Assign keyup listener if tabs feature enabled.

    chrome.runtime.sendMessage({ method: "getLocalStorage", key: "enable_tabs" }, function (response) {
        if (response.data == "true") {
            document.onkeyup = function (event) {
                if ($.inArray(event.keyCode, codes) == -1) {
                    if ($(event.target).is('input')) {
                        if (event.target.maxLength > 0) {
                            if (event.target.value.length >= event.target.maxLength) {
                                var index = (getIndex(event.target) + 1);
                                var mod = index % event.target.form.length;
                                var ctrl = event.target.form[mod];
                                ctrl.focus();
                            }
                        }
                    }
                }
            }
        }
    });

    chrome.runtime.sendMessage({ method: "getLocalStorage", key: "enable_ping" }, function (response) {
        if (response.data == "true") {
            $('input').blur(function () {
                var input = this;
                var val = $(input).val();
                if (val && val != null && val.match(reg)) {
                    $.ajax(val).fail(function () {
                        $(input).css('background', '#FFDDDD');
                    }).done(function () {
                        $(input).css('background', '#DCFBD1');
                    });
                }
            });
        }
    });
});
