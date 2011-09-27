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
		"FILE_HANDLER" :'http://localhost/food/php/fopen.php',
		"format_display" : ,
		"format_selected" : function(){
			
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
			"selectFood" : function () {
				//get random food, write to today's file. 
				var s = methods.settings;
				var data = $(this).data('foodlist');
				var blnProceed = false;
				
				//validate if selected before
				var jqxhr = $.ajax(s.FILE_HANDLER,
				{
					"data":{"action":"getlist"},
					"dataType":"json"
				});
				
				//parse datetime
				var selected = jqxhr.responseText;
				
				blnProceed = true;
				
				if ( blnProceed )
				{
					//using javascript random
					var randomnumber = Math.floor(Math.random()*(data.length));
					console.log(randomnumber);
					var query = data[randomnumber].name;
					var param = {data:query,action:"writelog"};
					
					//send simple ajax request
					$.get(s.FILE_HANDLER,param);
				}
				
				return this;
			},
			"displayFood" : function() {
				//how to display the data
				var displayCallback = function(data){
					data = $.parseJSON(data);
					var t = $(this);
					//store data.foodlist inside element
					t.data('foodlist',data.foodlist);
					$.each(data.foodlist, function(key, val){
						var output = '<div class="wrapcontainer"><p>Place Name:'+val.name+'</p></div>';
						t.append(output);
					});
				};
			
				//display today's food, with little or fluent style
				var s = methods.settings;
				$.ajax(s.FILE_HANDLER,
				{
					"data":{"action":"getlist","list" : "foodlist" },
					"context":this,
					"success":displayCallback
				});
				
				return this;
			},
			"fileversion" : "1.0"
	};
	
	//Plugin-controller
	$.fn.foodTracker = function( method ) {
		
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' + method + ' does not exist on jQuery.jbstLogin' );
		}

	};
	
})(jQuery);

