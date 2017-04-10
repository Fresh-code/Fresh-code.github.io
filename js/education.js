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
    var $eduForm = $('form.consult-form');
    $eduForm.parsley();
})(this);

