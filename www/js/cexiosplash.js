
var CexIoSplash = function(store) {
	
    this.initialize = function() { 
	  this.el = $('<div/>');
      console.log('CexIoSplash initialize');
    };
 	
 	this.render = function() {
		this.el.html(CexIoSplash.template());
	    return this;
	};
	
    this.initialize();

}

CexIoSplash.template = Handlebars.compile($("#tpl-cexio-splash").html());

