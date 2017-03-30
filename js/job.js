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
            url: "https://docs.google.com/forms/d/e/1FAIpQLSc37CcojHy91KU2tuQ1aTHBy7vw6JaWK5IqfIvSoPnDWH0cWw/formResponse",
            data: {
                "entry.1916953323": $form.find('[name="name"]').val(),
                "entry.321153308": $form.find('[name="email"]').val(),
                "entry.1961831271": "'"+$form.find('[name="phone"]').val(),
                "entry.694970312": $form.find('[name="about"]').val()

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

