/**
 * @depends libraries/autogrow.min.js
 * @depends libraries/materialize.min.js
 */
(function(global) {


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
                "entry.657556966": $form.find('[name="about"]').val()
            },
            dataType: "jsonp",
            crossDomain: true
        }).done(function(res) {
            console.log(res);
        });
        $form[0].reset();

//        setTimeout(window.location = '/', 5000);
    });
})(this);
