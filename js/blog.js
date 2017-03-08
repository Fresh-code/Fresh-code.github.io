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
        
        {
            posttitle: 'How Does Software Testing Ensure High-Quality Development?',
            platformtag: '',
            avatar: '/img/blog-post/author_0.png',
            catauthor: 'Business | Elizabeth Troyanova',
            position: 'Project manager',
            postcover: '/img/blog-post/software-testing/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/software-testing/post_c-700.jpg 700w, /img/blog-post/software-testing/post_c-450.jpg 450w, /img/blog-post/software-testing/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #616a9b !important',
            postbckg: 'background-color: #616a9b !important',
            type: 'business',
            nondisplay: 'display: none',
            posturl: '/blog/2017/01/22/software-testing/'
        },
        
        {
            posttitle: 'How to Ruin a First Impression. Things You Should Never Hear from a Software Company',
            platformtag: '',
            avatar: '/img/blog-post/author_1.png',
            catauthor: 'Business | Alex Slobozhan',
            position: 'Sales manager',
            postcover: '/img/blog-post/how-to-ruin-first-impression/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/how-to-ruin-first-impression/post_c-700.jpg 700w, /img/blog-post/how-to-ruin-first-impression/post_c-450.jpg 450w, /img/blog-post/how-to-ruin-first-impression/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #48818c !important',
            postbckg: 'background-color: #48818c !important',
            type: 'business',
            nondisplay: 'display: none',
            posturl: '/blog/2016/12/07/how-to-ruin-first-impression/'
        },
        
        {
            posttitle: 'What Is MVP and Why Every Startup Needs It?',
            platformtag: '',
            avatar: '/img/blog-post/author_0.png',
            catauthor: 'Business | Elizabeth Troyanova',
            position: 'Project manager',
            postcover: '/img/blog-post/what-is-mvp-and-why-every-startup-needs-it/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/what-is-mvp-and-why-every-startup-needs-it/post_c-700.jpg 700w, /img/blog-post/what-is-mvp-and-why-every-startup-needs-it/post_c-450.jpg 450w, /img/blog-post/what-is-mvp-and-why-every-startup-needs-it/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #679894 !important',
            postbckg: 'background-color: #679894 !important',
            type: 'business',
            nondisplay: 'display: none',
            posturl: '/blog/2016/11/30/what-is-mvp-and-why-every-startup-needs-it/'
        },
        
        {
            posttitle: 'Everything You Wanted to Know about the Time and Material Model',
            platformtag: '',
            avatar: '/img/blog-post/author_2.png',
            catauthor: 'Business | Marina Danilova',
            position: 'Sales manager',
            postcover: '/img/blog-post/everything-you-wanted-to-know/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/everything-you-wanted-to-know/post_c-700.jpg 700w, /img/blog-post/everything-you-wanted-to-know/post_c-450.jpg 450w, /img/blog-post/everything-you-wanted-to-know/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #4b4f67 !important',
            postbckg: 'background-color: #4b4f67 !important',
            type: 'business',
            nondisplay: 'display: none',
            posturl: '/blog/2016/11/21/everything-you-wanted-to-know/'
        },
        
        {
            posttitle: 'Fixed Price Model. Everything You Need to Know',
            platformtag: '',
            avatar: '/img/blog-post/author_1.png',
            catauthor: 'Business | Alex Slobozhan',
            position: 'Sales manager',
            postcover: '/img/blog-post/fixed-price-model/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/fixed-price-model/post_c-700.jpg 700w, /img/blog-post/fixed-price-model/post_c-450.jpg 450w, /img/blog-post/fixed-price-model/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #5f798b !important',
            postbckg: 'background-color: #5f798b !important',
            type: 'business',
            nondisplay: 'display: none',
            posturl: '/blog/2016/11/08/fixed-price-model/'
        },
        
        {
            posttitle: 'Engagement Models. Is Dedicated Team the Perfect One for You?',
            platformtag: '',
            avatar: '/img/blog-post/author_2.png',
            catauthor: 'Business | Marina Danilova',
            position: 'Sales manager',
            postcover: '/img/blog-post/is-dedicated-team-the-perfect-one-for-you/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/is-dedicated-team-the-perfect-one-for-you/post_c-700.jpg 700w, /img/blog-post/is-dedicated-team-the-perfect-one-for-you/post_c-450.jpg 450w, /img/blog-post/is-dedicated-team-the-perfect-one-for-you/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #32576c !important',
            postbckg: 'background-color: #32576c !important',
            type: 'business',
            nondisplay: 'display: none',
            posturl: '/blog/2016/10/17/is-dedicated-team-the-perfect-one-for-you/'
        },
        
        {
            posttitle: 'Do You Really Need Mobile App Post-Release Support or Is It an Exercise in Futility?',
            platformtag: '',
            avatar: '/img/blog-post/author_1.png',
            catauthor: 'Business | Alex Slobozhan',
            position: 'Sales manager',
            postcover: '/img/blog-post/do-you-really-need-mobile-app/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/do-you-really-need-mobile-app/post_c-700.jpg 700w, /img/blog-post/do-you-really-need-mobile-app/post_c-450.jpg 450w, /img/blog-post/do-you-really-need-mobile-app/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #666973 !important',
            postbckg: 'background-color: #666973 !important',
            type: 'business',
            nondisplay: 'display: none',
            posturl: '/blog/2016/09/21/do-you-really-need-mobile-app/'
        },
        
        {
            posttitle: '7 Improvements to UX Design That Ensure Brand Trust',
            platformtag: '',
            avatar: '/img/blog-post/author_3.png',
            catauthor: 'Front End | Stanislav Tsaplinskiy',
            position: 'UX/UI Designer',
            postcover: '/img/blog-post/7-improvements-to-ux-design-that-ensure-brand-trust/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/7-improvements-to-ux-design-that-ensure-brand-trust/post_c-700.jpg 700w, /img/blog-post/7-improvements-to-ux-design-that-ensure-brand-trust/post_c-450.jpg 450w, /img/blog-post/7-improvements-to-ux-design-that-ensure-brand-trust/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #164a77 !important',
            postbckg: 'background-color: #164a77 !important',
            type: 'front',
            nondisplay: 'display: none',
            posturl: '/blog/2016/09/14/7-improvements-to-ux-design-that-ensure-brand-trust/'
        },
        
        {
            posttitle: 'What Is Freshcode?',
            platformtag: '',
            avatar: '/img/blog-post/author_2.png',
            catauthor: 'Business | Marina Danilova',
            position: 'Sales manager',
            postcover: '/img/blog-post/what-is-freshcode/post_c-350.jpg',
            postalt: '',
            postsrcset: '/img/blog-post/what-is-freshcode/post_c-700.jpg 700w, /img/blog-post/what-is-freshcode/post_c-450.jpg 450w, /img/blog-post/what-is-freshcode/post_c-350.jpg 350w',
            postsize: '(min-width: 1500px) 700px, (max-width: 1499px) 450px, (max-width: 1000px) 350px, 700px',
            postcoverbckg: 'background-color: #0582bb !important',
            postbckg: 'background-color: #0582bb !important',
            type: 'business',
            nondisplay: 'display: none',
            posturl: '/blog/2016/09/07/what-is-freshcode/'
        }
        
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
        hidePosts();
        showPosts();
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


    function showPosts() {
        $('.post-block').each(function(i,elem) {
            if(i < 6){
                $(elem).addClass('active');
            }
        });
    }

    function hidePosts() {
        $('.post-block').each(function(i,elem) {
            $(elem).removeClass('active');
        });
    }

    $("#load-more").click(function() {
        if ($(this).hasClass('disable')) return false;
        $('.post-block').filter(':hidden').each(function(i,elem) {
            if(i < 6){
                $(elem).addClass('active');
            }
        });
    });

    showPosts();

})(this);
