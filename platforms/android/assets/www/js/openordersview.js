
var OpenOrdersView = function(store) {
	var pin = "4411";
	
    this.initialize = function() { 
	  this.el = $('<div/>');
	  this.el.on('click', '#refreshown', this.refreshOwnOrders);
	  this.el.on('click', '.cancelbutton', this.cancelOrder);
      console.log('OpenOrdersView initialize');
    };
 			
	this.refreshOwnOrders = function(){
		store.getAPIKeys(pin,function(keys){
			console.log(keys);
			store.signature(keys.user, keys.apikey, keys.apisecret, function(sig){
				var data = {key: keys.apikey, nonce: sig.nonce, signature: sig.hmac};		
				store.getOpenOrders(data, function(orders){
					oobj = JSON.parse(orders);
					arrOpenOrders = [];
					for (var i = 0; i<oobj.length; i++){
						console.log(oobj[i]);
						v = "<tr style='font:arial;font-size:10px'><td>" + oobj[i].type + "</td><td>" +  parseFloat(oobj[i].price).toFixed(8) + "</td><td>" +  parseFloat(oobj[i].amount).toFixed(8) + "</td><td>" +  parseFloat(oobj[i].pending).toFixed(8);
						v+= "</td><td>" + "<input type='button' class='cancelbutton' value='cancel' id='cancel_" + oobj[i].id + "'></td></tr>";
						arrOpenOrders.push(v);
					}
					$('#md-own tr:last').after(arrOpenOrders.join(''));
				});
			});
		});
	}
	
	this.cancelOrder = function(evt){
		var orderid = evt.target.id.replace('cancel_','')
		store.getKeys(function(keys){
			store.signature(keys.user, keys.apikey, keys.apisecret, function(sig){
				var data = {key: keys.apikey, nonce: sig.nonce, signature: sig.hmac, id: orderid};		
				store.getCancelOrder(data, function(r){
					console.log('Order cancelled');
					console.log(r);
				});
			});
		});
		
	}
	
 	this.render = function() {
		this.el.html(OpenOrdersView.template());
	    return this;
	};
	
    this.initialize();

}

OpenOrdersView.template = Handlebars.compile($("#tpl-cexio-openorders").html());

