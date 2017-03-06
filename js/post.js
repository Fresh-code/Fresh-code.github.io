(function (global) {

    var hiddenProject = {
        "general": 0,
        "found": 0
    };
    $('.post-block').each(function (i, elem) {
        if (i < 6 + hiddenProject.general) {
            if ($(".post-name").text() != $(elem).find(".recent-post-name").text()) {
                $(elem).addClass('active');
            }
            else {
                hiddenProject.general = 1;
            }
        }
    });

    $("#load-more").click(function () {
        if ($(this).hasClass('disable')) return false;
        $('.post-block').filter(':hidden').each(function (i, elem) {
            if (i < 6 + hiddenProject.found) {
                if ($(".post-name").text() != $(elem).find(".recent-post-name").text()) {
                    $(elem).addClass('active');
                }
                else {
                    hiddenProject.found = 1;
                }
            }
        });
    });

})(this);