---
---

/**
 * @depends libraries/list.min.js
 */
(function(global) {


    var $conferences = $('.filter-conferences'),
        $development = $('.filter-development'),
        $management = $('.filter-management'),
        $business = $('.filter-business'),
        $front = $('.filter-front'),
        $all = $('.filter-all'),
        $current = $all,
        $menu = false,
        $dd = $('#filter-dropdown');

    var posts = [
        {% for post in site.posts %}
        {
            posttitle: '{{ post.post-title }}',
            platformtag: '{{ post.platform-tag }}',
            avatar: '{{ post.avatar }}',
            catauthor: '{{ post.categories-tag }} | {{ post.author }}',
            position: '{{ post.position }}',
            postcover: '{{ post.cover }}',
            postalt: '{{ post.alt }}',
            postsrcset: '{{ post.srcsetattr }}',
            postsize: '{{ post.sizeattr }}',
            postcoverbckg: 'background-color: {{ post.background-cover }} !important',
            postbckg: 'background-color: {{ post.background-color }} !important',
            type: '{{ post.type }}',
            nondisplay: 'display: none',
            posturl: '{{ post.url }}'
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
    ];

    var options = {
        valueNames: [
            'posttitle',
            'platformtag',
            'catauthor',
            'position',
            { attr: 'src', name: 'postcover' },
            { attr: 'alt', name: 'postalt' },
            { attr: 'srcset', name: 'postsrcset' },
            { attr: 'sizes', name: 'postsize' },
            { attr: 'style', name: 'postbckg' },
            { attr: 'style', name: 'postcoverbckg' },
            'type',
            { attr: 'href', name: 'posturl' }
        ],
        item: '<div class="col-xxs col-xs-6 col-sm-4 col-md-4 preview-img col-lg-4 no-padding post-block">' +
        '<a href="" class="posturl">' +
        '<div class="description blog postcoverbckg">' +
        '<img draggable="false" class="img-responsive postcover postsrcset postsize postalt" title="preview image">' +
        '<div class="bckg-cover postbckg"></div>'+
        '<div class="cover">' +
        '<h2 class="posttitle"></h2>' +
        '<span class="date catauthor"></span>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '</div>'
    };

    var hackerList = new List('hacker-list', options, posts);
    var conferences = 0,
        development = 0,
        management = 0,
        business = 0,
        front = 0,
        all = posts.length;

    var type = ['all', 'business', 'conferences', 'development', 'front', 'management'];
    var init = function () {
        hackerList.filter(function (item) {
            switch (item.values().type) {
                case 'business':
                    business++;
                    break;
                case 'conferences':
                    conferences++;
                    break;
                case 'development':
                    development++;
                    break;
                case 'front':
                    front++;
                    break;
                case 'management':
                    management++;
                    break;
            }
        });
        hackerList.filter();
        _.forEach(type, function(t) {
            switch (t) {
                case 'all':
                    all > 0
                        ? $all.siblings().html(all)
                        : $all.parent().remove();
                    break;
                case 'business':
                    business > 0
                        ? $business.siblings().html(business)
                        : $business.parent().remove();
                    break;
                case 'conferences':
                    conferences > 0
                        ? $conferences.siblings().html(conferences)
                        : $conferences.parent().remove();
                    break;
                case 'development':
                    development > 0
                        ? $development.siblings().html(development)
                        : $development.parent().remove();
                    break;
                case 'front':
                    front > 0
                        ? $front.siblings().html(front)
                        : $front.parent().remove();
                    break;
                case 'management':
                    management > 0
                        ? $management.siblings().html(management)
                        : $management.parent().remove();
                    break;
            }
        });
        window.posts = hackerList;
    };
    init();

    $('#nav li').on('click', function(e) {
        var t = $(e.target),
            $more = $("#nav li.more img.img-more");

        if(!t.attr('class')) return;
        if(!t.attr('class').indexOf('img-more')) return;
        if(!t.attr('class').indexOf('badge')) { t = $(t.siblings()); }

        if($menu) $more.trigger('click');

        var type = (t.attr('class').split(' ')[1]).split('filter-')[1];

        clear(t);
        clearDD(type);
        if(type == 'all') hackerList.filter();
        else {
            hackerList.filter(function(item) {
                return item.values().type == type;
            });
        }
    });

    var clear = function (el) {
        var target = el,
            sibling = $current.siblings();

        $current.removeClass('active');
        sibling.removeClass('active');
        $current = target;
        sibling = $current.siblings();
        $current.addClass('active');
        sibling.addClass('active');
    };

    var navigationResize = function() {

        if($(window).width() > 779) {
            $('#nav li.more').before($('#overflow > li'));

            var $navItemMore = $('#nav > li.more'),
                $navItems = $('#nav > li:not(.more)'),
                $nav = $('#nav'),
                navItemMoreWidth = navItemWidth = $navItemMore.width(),
                windowWidth = $(window).width(),
                navWidth = $nav.width(),
                navItemMoreLeft, offset, navOverflowWidth;

            _($navItems).forEach(function(value) { navItemWidth += $(value).width() + 24; } );

            windowWidth = $(window).width() - 42;
            navItemWidth > windowWidth - 42 ? $navItemMore.show() : $navItemMore.hide();

            while (navItemWidth > windowWidth - 42) {
                navItemWidth -= $navItems.last().width();
                $navItems.last().prependTo('#overflow');
                $navItems.splice(-1,1);
            }

            navOverflowWidth = $('#overflow').width();
            offset = navItemMoreWidth - navOverflowWidth;
            $('#overflow').css({
                'left': -350
            });
        }
    };

    window.onresize = navigationResize;
    navigationResize();

    $("#nav li.more img.img-more").click(function() {
        if (!$menu) {
            $menu = true;
            $(this).css("transform", "rotate(90deg)");
            $("#overflow").css("opacity", "1");
            $("#overflow").css("visibility", "visible");
        } else {
            $menu = false;
            $(this).css("transform","" );
            $("#overflow").css("opacity", "");
            $("#overflow").css("visibility", "");
        }
    });

    var clearDD = function(el) { $dd.val(el); };

    $(function() {
        var $nav = $('#nav').find('li:not(.more)');

        _.forEach($nav, function(r) {
            var t = $(r),
                c = t.find('.blog-filter').attr('class').split('filter-')[1],
                f = t.find('.blog-filter').html() + ' ',
                b = t.find('.badge.custom').html();

            if(c.indexOf(' ') > 0) c = c.split(' ')[0];
            $('#filter-dropdown').append('<option value="'+c+'">'+f+'('+b+')</option>');
        });

    });

    $dd.change(function (e) {
        var t = $(e.target);
        type = t.val();

        var nav = $('#nav li:not(.more)').find('.filter-'+type);

        clear(nav);
        if(!type.indexOf('all')) hackerList.filter();
        else {
            hackerList.filter(function(item) {
                return item.values().type == type;
            });
        }
    });



    $('.post-block').each(function(i,elem) {
        if(i < 6){
           $(elem).addClass('active');
        }
    });

    $("#load-more").click(function() {
        if ($(this).hasClass('disable')) return false;
        $('.post-block').filter(':hidden').each(function(i,elem) {
            if(i < 6){
                $(elem).addClass('active');
            }
        });
    });


})(this);
