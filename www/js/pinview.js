
var PinView = function(store) {
	
	var nextnum = 0;	
	
    this.initialize = function() { 
	  this.el = $('<div/>');
	  this.el.on('click', '.phonekey', this.phonekeyClick);
      console.log('PinView initialize');
    };
 	
	function savePin(){
		console.log('savepin');
	}
	
	function checkPin(){
		console.log('checkpin');
	}
	
	this.phonekeyClick = function(evt){
		if (nextnum++ > 2){
			savePin();
		} else {
			$('#pinchar' + nextnum).val(evt.target.value);
		}
	}
	
 	this.render = function() {
		this.el.html(PinView.template());
	    return this;
	};
	
    this.initialize();

}

PinView.template = Handlebars.compile($("#tpl-cexio-pin").html());

