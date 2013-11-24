
var SetupView = function(store) {
					
	function saveKeys(){
		var user = $("#username").val(),
		apikey = $("#apikey").val(),
		apisecret = $("#apisecret").val(),
		pin = $("#pincode").val();
	
		store.saveAPIKeys(user, apikey, apisecret, pin, function(){
			$("#pincode").val("Saved ok");
		});
	}
		
    this.initialize = function() { 
	  this.el = $('<div/>');
	  this.el.on("click", "#savekeys", saveKeys);
      console.log('SetupView initialize');
    };
 	
 	this.render = function() {
		this.el.html(SetupView.template());
	    return this;
	};
	
    this.initialize();

}

SetupView.template = Handlebars.compile($("#tpl-cexio-setup").html());

