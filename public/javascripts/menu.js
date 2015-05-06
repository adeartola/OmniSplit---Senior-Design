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
	
	$("#addNow").each(function() {
		$(this).on("click", function() {
			var add = $("#catAdd").val();
			$('#catAdd').val('');
			var count = $("#left-sortable").children().length;
			if (checkDuplicate(add, count)){
			count++;
			var content = "<li id='" + count + "' class='ui-state-default'><p>" + add + "</p></li>";
			 $("#left-sortable").append(content);
			 localStorage.listData = $("#left-sortable").html();
				}
			else 
				alert("Sorry, you cannot add duplicates!");
			location.reload();
		});
		
		
	});
	
	$("#addNow2").each(function() {
		$(this).on("click", function() {
			var add = $("#catAdd").val();
			$('#catAdd').val('');
			var count = $("#left-sortable").children().length;
			if (checkDuplicate(add, count)){
			count++;
			var content = "<li id='" + count + "' class='ui-state-default'><p>" + add + "</p></li>";
			 $("#left-sortable").append(content);
			 localStorage.listData = $("#left-sortable").html();
				}
			else 
				alert("Sorry, you cannot add duplicates!");
			location.reload();
		});
		
		
	});
	
	
	$("#left-sortable").each(function() {
		$(this).on("click", function() {
			var add = $("#catAdd").val();
			$('#catAdd').val('');
			var count = $("#left-sortable").children().length;
			if (checkDuplicate(add, count)){
			count++;
			var content = "<li id='" + count + "' class='ui-state-default'><p>" + add + "</p></li>";
			 $("#left-sortable").append(content);
			 localStorage.listData = $("#left-sortable").html();
				}
			else 
				alert("Sorry, you cannot add duplicates!");
			location.reload();
		});
		
		
	});
	
	
	$("#left-sortable").each(function () {
		$(this).html(localStorage.listData);
	});
	
	$("ul#left-sortable li").each(function() {
		$(this).children().parent().on("click", function() {
			$("ul#left-sortable li p").parent().children().css("color","black");
			$(this).children().css("color", "yellow");
			$(this).parent().children().removeClass("activeCat1");
			$(this).toggleClass("activeCat1");
			$("#activeCat").html($(".activeCat1").html());
			$("#activeCat p").css("color","black");
		});
	});
	
	function checkDuplicate(name, count){
		var i=0;
		var content= "#left-sortable li#" + count;
		for (i=0; i<count; i++){
			content= "#left-sortable li#" + (i+1);
			if ($(content).text() == name){
				return false;
			}
		}
		return true;
	}
	
	$("#removeAll").each(function() {
		$(this).on("click", function() {
			localStorage.clear();
			location.reload();
		});
	});
	
	
	

	
});


