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

    var $form = $('form.job-form');

    $form.parsley();
    $form.submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "https://docs.google.com/a/freshcodeit.com/forms/d/e/1FAIpQLSdrwGQAfwfugg3PYPOb3VWtfajm7vCsvZazaCT0m7cL-vwcmQ/formResponse",
            data: {
                "entry.1392950239": $form.find('[name="name"]').val(),
                "entry.2131570541": $form.find('[name="email"]').val(),
                "entry.421225390": "'"+$form.find('[name="phone"]').val(),
                "entry.657556966": $form.find('[name="about"]').val(),
                "entry.1399868155": $form.find('[name="position"]').val()
            },
            dataType: "jsonp",
            crossDomain: true
        }).done(function(res) {
            console.log(res);
        });
        $form[0].reset();

//        setTimeout(window.location = '/', 5000);
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
    $(".fresh-select-list li").click(function () {
        $(".fresh-select-input").val($(this).find("span").text());
        $(".fresh-select-input").parsley().validate();

    });
})(this);
