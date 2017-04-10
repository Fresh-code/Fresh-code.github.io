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

        var data = new FormData();
        data.append('text', $form.find("textarea").val());
        data.append('file', $('#file')[0].files[0]);

        $.ajax({
            method: "POST",
            url: "https://getform.org/u/470a1fb1-94b3-4094-a7d7-565f28f0c877",
            data: data,
            processData: false,
            contentType: false,
            crossDomain: true
        }).done(function(res) {
            console.log(res);
        });
        $form[0].reset();

//        setTimeout(window.location = '/', 5000);
    });
})(this);
