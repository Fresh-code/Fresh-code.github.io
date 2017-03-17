(function (global) {

    function recentPostsWorker() {
        var postName = $(".post-name").text();
        return function () {
            var postsToShow = 0;
            $('.post-block').each(function (i, elem) {
                //if hidden, not current, index < 6
                if ((!$(elem).hasClass('active')) &&  (postName != $(elem).find(".recent-post-name").text()) && postsToShow < 6) {
                    $(elem).addClass('active');
                    postsToShow++;
                }
            });
        }
    }

    $("#load-more").click(function () {
        showMorePosts();
    });

    var showMorePosts = recentPostsWorker();
    showMorePosts();

})(this);