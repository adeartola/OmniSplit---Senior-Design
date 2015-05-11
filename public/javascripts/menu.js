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
			$.ajax({
			type: 'POST',
			url: 'api/addCat',
			data: {name : add},
			beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
			complete: function() {
				spinner.stop();
			}
			});
				
			}
			else 
				alert("Sorry, you cannot add duplicates!");
		});
		
		
	});
	
	$("#addNow2").each(function() {
		$(this).on("click", function() {
			var price = $("#foodPrice").val();
			var name = $("#foodName").val();
			var description = $("#foodDesc").val();
			var active = $("activeCat").text();
			
			
			
			$('#catAdd').val('');
			var count = $("#left-sortable").children().length;
			if (1){
			count++;
			$.ajax({
			type: 'POST',
			url: 'api/addItem',
			data: {name : name, price: price, description: description, active: active},
			beforeSend: function(xhrObj){
                var target = document.getElementById('spinner');
                spinner = new Spinner(opts).spin(target); //Start spinner before ajax request
            },
			complete: function() {
				spinner.stop();
			}
			});
				
			}
			else 
				alert("Sorry, you cannot add duplicates!");
		});
		
	});
	
	
	
	
	
	
	$("ul#left-sortable li").each( function() {
		$(this).children().parent().on("click", function() {
			alert("clicked");
		});
	});
	
	function checkDuplicate(name, count){
		var i=0;
		var content= "#left-sortable li#" + count;
		for (i=0; i<count; i++){
			content= "#left-sortable li#" + (i);
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


