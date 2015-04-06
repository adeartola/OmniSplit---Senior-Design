$(document).ready(function() {
    $(window).on('resize', function(e) {
        var phoneHeight = parseFloat($('#phone-left').height());
        var phoneWidth = parseFloat($('#phone-left').width());

        $('#overlay-left').css('width', 0.849 * phoneWidth);
        $('#overlay-right').css('width', 0.849 * phoneWidth);
        $('#overlay-left').css('height', 0.725 * phoneHeight);
        $('#overlay-right').css('height', 0.725 * phoneHeight);

        $('#overlay-left').css('top', $('#phone-left').position().top + parseFloat($('#phone-left').css('padding-top')) + 0.147 * phoneHeight);
        $('#overlay-right').css('top', $('#phone-right').position().top + parseFloat($('#phone-right').css('padding-top')) + 0.147 * phoneHeight);
        $('#overlay-left').css('left', $('#phone-left').position().left + 0.0731 * phoneWidth);
        $('#overlay-right').css('left', $('#phone-right').position().left + 0.0731 * phoneWidth);

        $('#overlay-left').css('margin-left', $('#phone-left').css('margin-left'));
        $('#overlay-right').css('margin-left', $('#phone-right').css('margin-left'));
    });
});

$(document).ready(function(){
    $( "#sortable" ).sortable({
        placeholder: "ui-state-highlight"
    });
    $( "#sortable" ).disableSelection();
});

$(document).ready(function(){
    $( "#sort2" ).sortable({
        placeholder: "ui-state-highlight"
    });
    $( "#sort2" ).disableSelection();
});

var sortedIDS = "meow";

$(document).ready(function(){
    $("#save").click(function(){
        var sortedIDs = $( "#sortable" ).sortable( "toArray" );
        $("#test").html(sortedIDs);
    });
});

$(document).ready(function(){
    $("#save2").click(function(){
        var sortedIDs = $( "#sort2" ).sortable( "toArray" );
        $("#test").html(sortedIDs);
    });
});

$(document).ready(function(){
    $("#test").click(function(){
        var sortedIDs = $( "#sort" ).sortable( "toArray" );
        $("#test").html(sortedIDs);
    });
});
