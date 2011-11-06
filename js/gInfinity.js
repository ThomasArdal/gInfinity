$(document).ready(function () {
    if (document.location.href.indexOf('://www.google.') == -1) return;
    var loadcounter = 0;
    alreadyloading = false;
    $(window).scroll(function () {
        var rso = $('#rso');
        if (!rso) return;
        if (($(window).scrollTop() + $(window).height()) >= ($('body').height() * 0.9)) {
            if (alreadyloading == false) {
                alreadyloading = true;
                var td = $('td[class=cur]');
                var href = $(td.siblings().get(loadcounter + 1)).find('a:first-child').attr('href');
                var parts = window.location.href.split('/');
                if (parts.length < 3) return;
                $.get(href, function (data) {
                    var toAppend = $(data).find('#rso').html();
                    rso.append(toAppend);
                    alreadyloading = false;
                    loadcounter++;
                });
            }
        }
    });
});