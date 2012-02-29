/**
 * Food tracker
 * @version 		1.0
 * @dependencies 	jQuery 
 * @author 			sheakai
 *
 * @description Food Tracker!
 */
(function($){
	var settings = {
		"FILE_HANDLER" :'http://localhost:20100/php/fopen.php',
		"format_display" : function(data){
			//display the data out to format
			var output = '<fieldset><legend>Lunch List</legend>';
			$.each(data, function(key, val){
				output += '<div class="wrapcontainer" id="'+val.id+'">'+val.name+'</div>';
			});
			output += '</fieldset>';
			$(this).append(output);
		},
		"format_display_eatlist" : function(data){
			//display the data out to format
			var output = '<fieldset><legend>Previously on the list</legend>';
			$.each(data, function(key, val){
				output += '<div class="wrapcontainer" id="'+val.id+'">'+val.date+' - '+val.id+'</div>';
			});
			output += '</fieldset>';
			$(this).append(output);
		},
		"format_selected" : function(data){
			if($('.selected').length > 0) return;
			
			var output = '';
			output = '<p class="selected">Todays Food selection is: <b>' + data.id + '</b></p>';
			$(this).after(output);
			
			//very inefficient way to highlight the name
			var fl = $(this).data("foodlist");
			$.each(fl, function(key,val){
				if (val.name == data.id)
					$('#'+val.id).addClass("wrapcontainer-selected");
			})
		}
	};
	
	var methods = {
			"init" : function( options ){
				//meta-constructor
				if ( options ) {
					$.extend( true, settings, options );
				};
				var s = methods.settings = settings;
				s.sel = this.selector;
				//end meta
				
				//Call display food
				methods.displayFood.apply(this);
			},
			"selectFood" : function (ForceReselect) {
				//get random food, write to today's file. 
				var s = methods.settings;
				var t = $(this);
				var fl = t.data('foodlist');
				var el = t.data('eatlist');
				var blnProceed = false;
				
				//Forked code, reselection
				if (ForceReselect == true)
				{
					var randomnumber = Math.floor(Math.random()*(fl.length));
					var selected = fl[randomnumber].name;
					$('.selected').remove();
					$('.wrapcontainer-selected').removeClass('wrapcontainer-selected');
					s.format_selected.apply(this, [{"id":selected}]);
					return this;
				}
				
				//get todays date
				var d = new Date();
				var datestring = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
				//get last element in eatlist
				var objLastMeal = el[el.length -1];
				
				//check if today's date is already selected
				if (objLastMeal.date != datestring)
					blnProceed = true;
				
				if ( blnProceed )
				{
					//using javascript random
					var randomnumber = Math.floor(Math.random()*(fl.length));
					var selected = fl[randomnumber].name;
					
					el.push({"date":datestring,"id":selected});
					//use JSON2.js stringify
					var query = '{"eatlist":'+JSON.stringify(el)+'}';
					
					var param = {data:query,action:"writelog"};
					//send simple ajax request
					$.get(s.FILE_HANDLER,param);
				}
				
				//call method
				var param = el[el.length - 1];
				s.format_selected.apply(this, [param]);
				
				return this;
			},
			"displayFood" : function() {			
				//display today's food, with little or fluent style
				var s = methods.settings;
				var t = $(this);

				//how to display the data
				var displayCallback = function(data){
					data = $.parseJSON(data);
					//store data.foodlist inside element
					t.data('foodlist',data.foodlist);
					
					//call again
					s.format_display.apply( $(s.sel), [data.foodlist] );
				};
			
				//Method 1: get and store foodlist
				$.ajax(s.FILE_HANDLER,
				{
					"data":{"action":"getlist","list" : "foodlist" },
					"context":this,
					"success":displayCallback
				});
				
				//Method 2: get and store eatlist
				var jqxhr = $.ajax(s.FILE_HANDLER,
				{
					"data":{"action":"getlist"},
				}).complete(function(xhr){
					var data = $.parseJSON(xhr.responseText);
					t.data('eatlist',data.eatlist);
					
					//display eatlist
					s.format_display_eatlist.apply( $(s.sel), [data.eatlist] );
					
					methods.selectFood.apply($(s.sel));
				});
				
				return this;
			},
			"displayEat" : function(){
				
			},
			"fileversion" : "1.1"
	};
	
	//Plugin-controller
	$.fn.foodTracker = function( method ) {
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.FoodTracker' );
		}

	};
	
	$.fn.foodTracker.version = methods.fileversion;
	
})(jQuery);

