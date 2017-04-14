---
---

/**
 * @depends libraries/list.min.js
 */
(function(global) {

    var $monitoring = $('.filter-monitoring'),
        $navigation = $('.filter-navigation'),
        $education = $('.filter-education'),
        $ecommerce = $('.filter-ecommerce'),
        $payments = $('.filter-payments'),
        $business = $('.filter-business'),
        $media = $('.filter-media'),
        $data = $('.filter-data'),
        $all = $('.filter-all'),
        $allWorks = $('#allWorks'),
        $current = $all,
        $menu = false,
        $dd = $('#filter-dropdown');
    var works = [
        {% for work in site.data.portfolio.works %}
        {
            title: '{{ work.title }}',
            description: '{{ work.description }}',
            workcover: '{{ work.cover }}',
            workalt: '{{ work.alt }}',
            worksrcset: '{{ work.srcsetattr }}',
            worksizes: '{{ work.sizesattr }}',
            workcoverbckg: 'background-color: {{ work.mainColor }} !important',
            workbckg: 'background-color: {{ work.mainColor }} !important',
            type: '{{ work.type }}',
            workurl: '{{ work.link }}'
        }{% unless forloop.last %},{% endunless %}
        {% endfor %}
    ];
    var options = {
        valueNames: [
            'title',
            'description',
            'type',
            { attr: 'src', name: 'workcover' },
            { attr: 'alt', name: 'workalt' },
            { attr: 'srcset', name: 'worksrcset' },
            { attr: 'sizes', name: 'worksizes' },
            { attr: 'style', name: 'workbckg' },
            { attr: 'style', name: 'workcoverbckg' },
            { attr: 'href', name: 'workurl' }

        ],
        item: '<div class="col-xxs col-xs-6 col-sm-6 col-md-4 col-lg-4 no-padding cube preview-img description no-padding-m">' +
        '<a href="" class="workurl">' +
        '<div class="workcoverbckg">' +
        '<img class="img-responsive workcover worksrcset worksizes workalt" title="preview image">' +
        '<div class="cover caption absolute workbckg portfolio-h2">' +

        '<h2 class="title"></h2>' +
        '<p class="description"></p>' +
        '</div>' +
        '</div>' +
        '</a>' +
        '</div>'
    };

    var hackerList = new List('hacker-list', options, works);
    var monitoring = 0,
        navigation = 0,
        education = 0,
        ecommerce = 0,
        payments = 0,
        business = 0,
        media = 0,
        data = 0,
        all = works.length;

    $allWorks.html(all);

    var type = ['all', 'education', 'business', 'data', 'navigation', 'ecommerce', 'media', 'monitoring', 'payments'];
    var init = function () {
        hackerList.filter(function (item) {
            switch (item.values().type) {
                case 'business':
                    business++;
                    break;
                case 'education':
                    education++;
                    break;
                case 'data':
                    data++;
                    break;
                case 'navigation':
                    navigation++;
                    break;
                case 'ecommerce':
                    ecommerce++;
                    break;
                case 'media':
                    media++;
                    break;
                case 'monitoring':
                    monitoring++;
                    break;
                case 'payments':
                    payments++;
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
                case 'education':
                    education > 0
                        ? $education.siblings().html(education)
                        : $education.parent().remove();
                    break;
                case 'data':
                    data > 0
                        ? $data.siblings().html(data)
                        : $data.parent().remove();
                    break;
                case 'navigation':
                    navigation > 0
                        ? $navigation.siblings().html(navigation)
                        : $navigation.parent().remove();
                    break;
                case 'ecommerce':
                    ecommerce > 0
                        ? $ecommerce.siblings().html(ecommerce)
                        : $ecommerce.parent().remove();
                    break;
                case 'media':
                    media > 0
                        ? $media.siblings().html(media)
                        : $media.parent().remove();
                    break;
                case 'monitoring':
                    monitoring > 0
                        ? $monitoring.siblings().html(monitoring)
                        : $monitoring.parent().remove();
                    break;
                case 'payments':
                    payments > 0
                        ? $payments.siblings().html(payments)
                        : $payments.parent().remove();
                    break;
            }
        });
        window.works = hackerList;
    };
    init();

    $('#nav li').on('click', function(e) {
        var t = $(e.target);

        var $more = $("#nav li.more img.img-more");

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
                navItemMoreWidth = navItemWidth = $navItemMore.width(),
                windowWidth = $(window).width(),
                offset, navOverflowWidth;

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
                c = t.find('.work-filter').attr('class').split('filter-')[1],
                f = t.find('.work-filter').html() + ' ',
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
})(this);