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
			 $("#addInfo").slideDown();
		});
		
	});
	
	$("#addNow").each(function() {
		$(this).on("click", function() {
			var add = $("#catAdd").val();
			var count = $("#left-sortable").children().length;
			count++;
			var content = "<li id='" + count + "' class='ui-state-default'><p>" + add + "</p></li>";
			 $("#left-sortable").append(content);
			 localStorage.listData = $("#left-sortable").html();
		});
		
	});
	
	$("#left-sortable").each(function () {
		$(this).html(localStorage.listData);
	});
	
	$("ul#left-sortable li").each(function() {
		$(this).on("click", function() {
			$("ul#left-sortable li p").children().css("color","black");
			$(this).children().css("color", "yellow");
		});
	});
	
	
	
});


