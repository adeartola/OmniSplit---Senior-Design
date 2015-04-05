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
