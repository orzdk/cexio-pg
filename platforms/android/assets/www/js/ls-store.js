
var LocalStorageStore = function(successCallback, errorCallback) {

	$.ajaxSetup({ cache: false });
	
	var server = "http://orz.dk:3009";
	//var server = "http://cexiomobiledev-orzdkcexiocorsproxy.jit.su";
	
	var API_TICKER = server + "/getTicker";
	var API_ORDERBOOK = server + "/getOrderBook";
	var API_ACCOUNT_BALANCE = server + "/getAccountBalance";
	var API_OPEN_ORDERS = server + "/getOpenOrders";
	var API_CANCEL_ORDER = server + "/getCancelOrder";
	var API_PLACE_ORDER = server + "/getPlaceOrder";
	
	var NONCE = "";
	
	// ----------- REST
	
	this.signature = function(API_USER, API_KEY, API_SECRET, cb){
		var NONCE = new Date().getTime();
		var message = NONCE + API_USER + API_KEY;
		var hmac2 = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, API_SECRET);
		hmac2.update(message);
		var hash = hmac2.finalize();
		cb({hmac: hash.toString(), nonce: NONCE});
	}
	
	this.clickNonce = function(){
		NONCE = new Date().getTime();
	}
	
	this.getOrderBook = function(callback){
		$.ajax({
		    type: 'GET',
		    url: API_ORDERBOOK,
			dataType: "jsonp",
			contentType: "application/json",
		    success: function(json) {
	           callback(json);
		    },
		    error: function(e) {
		       console.log(e.message);
		    }
		});
	}	
	
	this.getOpenOrders = function(data,callback){
		$.ajax({
		    type: 'POST',
		    url: API_OPEN_ORDERS,
			data: data,
			dataType: "jsonp",
			contentType: "application/json",
		    success: function(json) {
	           callback(json);
		    },
		    error: function(e) {
		       console.log(e.message);
		    }
		});
	}
	
	this.getCancelOrder = function(data,callback){
		$.ajax({
		    type: 'POST',
		    url: API_CANCEL_ORDER,
			data: data,
			dataType: "jsonp",
			contentType: "application/json",
		    success: function(json) {
	           callback(json);
		    },
		    error: function(e) {
		       console.log(e.message);
		    }
		});
	}	
	
	this.getBalance = function(data,callback){
		$.ajax({
		    type: 'POST',
		    url: API_ACCOUNT_BALANCE,
			data: data,
			dataType: "jsonp",
			contentType: "application/json",
		    success: function(json) {
	           callback(json);
		    },
		    error: function(e) {
		       console.log(e.message);
		    }
		});
	}
	
	this.getTicker = function(callback){
		$.ajax({
		    type: 'GET',
		    url: API_TICKER,
			dataType: "jsonp",
			contentType: "application/json",
		    success: function(json) {
	           callback(json);
		    },
		    error: function(e) {
		       console.log(e.message);
		    }
		});
	}
	
	// ----------- LOCAL DB 
	
	this.getAPIKeys = function(pin, callback){
		var sql = "SELECT * FROM R325647432";
		var db = window.openDatabase("Database", "1.0", "CEX01", 15000);
		db.transaction(function(tx){
			tx.executeSql (sql, undefined, 
			function (tx, result){
				if (result.rows.length)	{
					rowobj = JSON.parse(Aes.Ctr.decrypt(result.rows.item(0).userdata,pin,256));
					callback(rowobj);
				} else {
					callback({});
				}	
			});
		});
	}
	
	this.saveAPIKeys = function(user, apikey, apisecret, pin, callback){
		var userdata = Aes.Ctr.encrypt(JSON.stringify({user: user, apikey:apikey, apisecret:apisecret}),pin,256);
		var db = window.openDatabase("Database", "1.0", "CEX01", 200000);
		db.transaction(function(tx){
			tx.executeSql("DROP TABLE IF EXISTS R325647432");
			tx.executeSql("CREATE TABLE R325647432 (id unique, userdata)");
			var sql = "INSERT INTO R325647432 (id, userdata) VALUES (1,?)";
			tx.executeSql(sql, [userdata], function(){
				callback(true);
			}, function(err){
				callback(false);
			});
		});
	}
	
	this.getAlarms = function(callback){
		var sql = "SELECT * FROM R325647431";
		var db = window.openDatabase("Database", "1.0", "CEX01", 15000);
		db.transaction(function(tx){
			tx.executeSql (sql, undefined, 
			function (tx, result){
				if (result.rows.length)	{
					rowobj = JSON.parse(result.rows.item(0).userdata);
					callback(rowobj);
			  } else {
				callback({});
			  }
			});
		});
	}
	
	this.persistAlarms= function(alarms, callback){		
		var db = window.openDatabase("Database", "1.0", "CEX01", 200000);
		console.log('persisting');
		console.log(alarms);
		db.transaction(function(tx){
			tx.executeSql("DROP TABLE IF EXISTS R325647431");
			tx.executeSql("CREATE TABLE R325647431 (id unique, userdata)");
			var sql = "INSERT INTO R325647431 (id, userdata) VALUES (1,?)";
			console.log('persisting');
			console.log(alarms);
			tx.executeSql(sql, [JSON.stringify(alarms)], function(){
				callback(true);
			}, function(err){
				callback(false);
			});
		});
	}
	
	this.clearAlarms= function(callback){		
		var db = window.openDatabase("Database", "1.0", "CEX01", 200000);
		db.transaction(function(tx){
			
			tx.executeSql("DROP TABLE IF EXISTS R325647431");
			tx.executeSql("CREATE TABLE R325647431 (id unique, userdata)");
			var sql = "INSERT INTO R325647431 (id, userdata) VALUES (1,?)";
			tx.executeSql(sql, ["[]"], function(){
				callback(true);
			}, function(err){
				callback(false);
			});
		});
	}
	
	// ----------- Deferred callback - don't remeber why
	
    var callLater = function(callback, data) {
         if (callback) {
             setTimeout(function() {
                 callback(data);
             });
         }
     }

     callLater(successCallback);

}
