/**
 * @depends libraries/autogrow.min.js
 * @depends libraries/materialize.min.js
 */
(function(global) {

    var $menu=false;

    $('textarea.material-input').autogrow({ horizontal: false, flickering: false});
    $(document).ready(function(){
        $('.collapsible').collapsible({
            accordion : false
        });
    });

    $(document).click(function() {
        $menu = false;
        $(".fresh-select-list").css("opacity", "");
        $(".fresh-select-list").css("visibility", "");
    });


    $('div.fresh-select').click(function (e) {
        e.stopPropagation();
        if (!$menu) {

            $menu = true;
            $(".fresh-select-list").css("opacity", "1");
            $(".fresh-select-list").css("visibility", "visible");
        } else {
            $menu = false;
            $(".fresh-select-list").css("opacity", "");
            $(".fresh-select-list").css("visibility", "");
        }
    });

    $(".fresh-select-list li").on("mouseup mousedown", function () {
        $(".fresh-select-input").val($(this).find("span").text());
        $(".fresh-select-input").parsley().validate();
    });

    $(".fresh-select-input").on("paste change keypress", function () {
        return false;
    });
})(this);
