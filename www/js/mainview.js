
var MainView = function(store, loader) {
	
    this.initialize = function() { 
		this.el = $('<div/>');
		this.el.on('click', '#refreshf', this.refreshOrderBook);
		console.log('MainView initialize');
    }

	
 	this.refreshOrderBook = function(){
		console.log('refresh orderbook');
		store.getOrderBook(function(data){
			var arrbids = [];
			var arrasks = [];
			obj = JSON.parse(data);
	
			$.each(obj.bids, function(key, val) {
				sum = parseFloat(val[0]) * parseFloat(val[1]);
				v = "<tr style='font:arial;font-size:10px'><td>" + parseFloat(val[0]).toFixed(8) + "</td><td>" +  parseFloat(val[1]).toFixed(8) + "</td></tr>";
				arrbids.push(v);
			});
  
			$.each(obj.asks, function(key, val) {
				v = "<tr style='font:arial;font-size:10px'><td>" + parseFloat(val[0]).toFixed(8) + "<td>" + parseFloat(val[1]).toFixed(8) + "</td></tr>";
				arrasks.push(v);
			});
			
			$('#md-buy tr:last').after(arrbids.join(''));
			$('#md-sell tr:last').after(arrasks.join(''));		
			
		});
	}
	
 	this.render = function() {
		this.el.html(MainView.template());  
	    return this;
	}
	
    this.initialize();
}

MainView.template = Handlebars.compile($("#tpl-cexio-main").html());



