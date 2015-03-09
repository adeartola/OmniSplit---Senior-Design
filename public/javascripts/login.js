$(document).ready(function() {
    $('.form-signin').submit(function(e) {
        e.preventDefault();
        e.returnValue = false;

        var submitform = $(this).serialize();
        $.ajax({
            type: 'POST',
            url: '/api/login/',
            data: submitform,
            contentType: 'application/x-www-form-urlencoded',
            datatype: 'json',
            async: false,
            success: function (data) {
            },
            error: function(err) {
                console.log(err);
            },
            complete: function() {
                this.off('submit');
                this.submit();
            }
        });
    });
});
