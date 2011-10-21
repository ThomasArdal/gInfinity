//TODO: support more than 10 pages
$(document).ready(function () {
    var loadcounter = 0;
    alreadyloading = false;
    $(window).scroll(function () {
        var rso = $('#rso');
        if (!rso) return;
        //alert(($(window).scrollTop() + $(window).height()) >= ($('body').height() * 0.9));
        if (($(window).scrollTop() + $(window).height()) >= ($('body').height() * 0.9)) {
            if (alreadyloading == false) {
                alreadyloading = true;
                var td = $('td[class=cur]');
                var href = $(td.siblings().get(loadcounter + 1)).find('a:first-child').attr('href');
                $.get('https://www.google.com' + href, function (data) {
                    var toAppend = $(data).find('#rso').html();
                    rso.append(toAppend);
                    alreadyloading = false;
                    loadcounter++;
                });
            }
        }
    });
});