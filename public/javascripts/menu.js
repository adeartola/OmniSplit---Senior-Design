$(document).ready(function(){
    $(".ui-sortable").each(function() {
        $(this).sortable({
            placeholder: "ui-state-highlight"
        });
        $(this).disableSelection();
    });

    $(".ui-state-default").each(function() {
        $(this).on("click", function() {
            if ($(this).parent().attr('id') == 'left-sortable' && !$(this).hasClass('sortable-active')) {
                $('#left-sortable>li').each(function() {
                    $(this).removeClass('sortable-active');
                });
                $(this).addClass('sortable-active');
            }
            else if ($(this).parent().attr('id') == 'right-sortable' && !$(this).hasClass('sortable-active')) {
                $('#right-sortable>li').each(function() {
                    $(this).removeClass('sortable-active');
                });
                $(this).addClass('sortable-active');
            }
        });

        $(this).mousedown(function() {
            $(this).css("cursor", "move");
        });
        $(this).mouseup(function() {
            $(this).css("cursor", "default");
        });
    });
	
	$("#addCat").each(function() {
		$(this).on("click", function() {
			 $("#addInfo").slideToggle();
		});
	});
	
	$("#addFood").each(function() {
		$(this).on("click", function() {
			 $("#addInfo2").slideToggle();
		});
	});
	
    $("#removeAll").each(function() {
        $(this).on("click", function() {
            localStorage.clear();
            location.reload();
        });
    });
});
