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
        
        {
            title: 'Play Attention',
            description: 'Play Attention is indisputably the best cognitive training system created to improve attention, behavior and cognitive function for children and adults suffering from ADHD.',
            workcover: '/img/portfolio/work_309p-350.jpg',
            workalt: 'Play Attention',
            worksrcset: '/img/portfolio/work_309p-700.jpg 700w, /img/portfolio/work_309p-450.jpg 450w, /img/portfolio/work_309p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #5d738f !important',
            workbckg: 'background-color: #5d738f !important',
            type: 'education',
            workurl: '/playattention'
        },
        
        {
            title: 'GommeHD',
            description: 'GommeHD is one of the leading Minecraft Servers with more than 1 million players throughout the world. The site delivers community news and statistics, as well as the latest updates and videos.',
            workcover: '/img/portfolio/work_5p-350.jpg',
            workalt: 'gommehd logo',
            worksrcset: '/img/portfolio/work_5p-700.jpg 700w, /img/portfolio/work_5p-450.jpg 450w, /img/portfolio/work_5p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #775441 !important',
            workbckg: 'background-color: #775441 !important',
            type: 'ecommerce',
            workurl: '/gommehd'
        },
        
        {
            title: 'Wallbreaker Dynamics',
            description: 'Wallbreaker is a start-up that provides unique services for mass-media including instant content creation and visualization of analytic results in real time.',
            workcover: '/img/portfolio/work_303p-350.jpg',
            workalt: 'Wallbreaker Dynamics platform preview',
            worksrcset: '/img/portfolio/work_303p-700.jpg 700w, /img/portfolio/work_303p-450.jpg 450w, /img/portfolio/work_303p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #747474 !important',
            workbckg: 'background-color: #747474 !important',
            type: 'media',
            workurl: '/wall-breaker'
        },
        
        {
            title: 'Nova Fabrica Ltd.',
            description: 'FloTron is a multichannel control and monitoring system for manufacturing processes that uses a hardware device connected to a series of peripheral units.',
            workcover: '/img/portfolio/work_297p-350.jpg',
            workalt: 'Flotron system preview',
            worksrcset: '/img/portfolio/work_297p-700.jpg 700w, /img/portfolio/work_297p-450.jpg 450w, /img/portfolio/work_297p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #a5a5a5 !important',
            workbckg: 'background-color: #a5a5a5 !important',
            type: 'monitoring',
            workurl: '/flotron'
        },
        
        {
            title: 'Educadio',
            description: 'Educadio is a Digital Learning Tool that provides a real-time synchronization for instant user collaboration and a wide variety of collaborative work means, including video and text chats.',
            workcover: '/img/portfolio/work_36p-350.jpg',
            workalt: '',
            worksrcset: '/img/portfolio/work_36p-700.jpg 700w, /img/portfolio/work_36p-450.jpg 450w, /img/portfolio/work_36p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #354356 !important',
            workbckg: 'background-color: #354356 !important',
            type: 'education',
            workurl: '/educadio'
        },
        
        {
            title: 'Twenty One Learning',
            description: 'Twenty One Learning is an interactive platform which main objective was to allow collaborative creation of lectures, presentations, slides and text with open access to all materials.',
            workcover: '/img/portfolio/work_291p-350.jpg',
            workalt: 'Twenty One Learning platform preview',
            worksrcset: '/img/portfolio/work_291p-700.jpg 700w, /img/portfolio/work_291p-450.jpg 450w, /img/portfolio/work_291p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #576965 !important',
            workbckg: 'background-color: #576965 !important',
            type: 'education',
            workurl: '/twenty-one-learning'
        },
        
        {
            title: 'Tassta',
            description: 'Tassta is a hardware-software solutions platform providing more effective communication for a number of industries, including Public Transportation, Construction, Courier and Emergency Services, etc.',
            workcover: '/img/portfolio/work_285p-350.jpg',
            workalt: 'Tassta platform preview',
            worksrcset: '/img/portfolio/work_285p-700.jpg 700w, /img/portfolio/work_285p-450.jpg 450w, /img/portfolio/work_285p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #6e8a6d !important',
            workbckg: 'background-color: #6e8a6d !important',
            type: 'navigation',
            workurl: '/tassta'
        },
        
        {
            title: 'Outdoor.rocks',
            description: 'Outdoor.rocks is a young, but rapidly developing project, designed for outdoor activity lovers around the world.',
            workcover: '/img/portfolio/work_276p-350.jpg',
            workalt: 'Outdoor.rocks preview',
            worksrcset: '/img/portfolio/work_276p-700.jpg 700w, /img/portfolio/work_276p-450.jpg 450w, /img/portfolio/work_276p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #65753b !important',
            workbckg: 'background-color: #65753b !important',
            type: 'navigation',
            workurl: '/outdoor'
        },
        
        {
            title: 'Data Parser',
            description: 'Data Parser is a cloud-based ETL application for unstructured data from any number of sources, including JSON files, with advanced search and data aggregation possibilities.',
            workcover: '/img/portfolio/work_251p-350.jpg',
            workalt: 'Data Parser app preview',
            worksrcset: '/img/portfolio/work_251p-700.jpg 700w, /img/portfolio/work_251p-450.jpg 450w, /img/portfolio/work_251p-350.jpg 350w',
            worksizes: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            workcoverbckg: 'background-color: #8e9bbb !important',
            workbckg: 'background-color: #8e9bbb !important',
            type: 'data',
            workurl: '/data-parser'
        }
        
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