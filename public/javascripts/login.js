function validateForm() {
    var email = $('#email').val();
    var password = $('#password').val();
    var submitform = 'email=' + email + '&password=' + password;
    console.log(submitform);
    $.ajax({
        type: 'POST',
        url: '/api/login/',
        data: submitform,
        contentType: 'application/x-www-form-urlencoded',
        datatype: 'json',
        async: false,
        success: function (data, textStatus, xhr) {
        },
        error: function(err) {
            console.log(err);
        },
        complete: function(xhr, textStatus) {
        }
    });
}

$(document).ready(function() {
});
