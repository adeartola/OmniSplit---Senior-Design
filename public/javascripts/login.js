var opts = {
    lines: 11, // The number of lines to draw
    length: 0, // The length of each line
    width: 10, // The line thickness
    radius: 20, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 48, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: true, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
};

function validateForm() {
    var target = document.getElementById('spinner');
    var spinner;

    var email = $('#email').val();
    var password = $('#password').val();
    var submitform = { email: email, password: password }; 

    $.ajax({
        beforeSend: function(xhrObj){
            spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Accept","application/json");
        },
        type: 'POST',
        url: '/api/login/',
        data: JSON.stringify(submitform),
        dataType: 'json',
        error: function(err) {
            spinner.stop; //Stop the spinner
            console.log(err.responseText);
            location.reload();
        },
        success: function() {
            spinner.stop();
            window.location.href = '/';
        },
    });
}
$(document).ready(function() {
    $('.form-signin').submit(function(e) {
        e.preventDefault(); //Let validateForm() deal with refreshing page
    });
});
