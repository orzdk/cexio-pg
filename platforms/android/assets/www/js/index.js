function noop(){}

function getText( obj ) {
    return obj.textContent ? obj.textContent : obj.innerText;
}

var operators = {
    '>=': function(a, b) { return a >= b },
    '<=': function(a, b) { return a <= b },
};

var app = {
	
	alarmView: null,
	
	addAlarmToArray : function(alarm){	
		app.store.getAlarms(function(alres){
			alres.push(alarm);	
			app.store.persistAlarms(alres, function(){
				alarmView.refreshAlarmsList(alres);
			});
		});
	},
	
	removeAlarmFromArray : function(evt){
		var pos = parseInt(evt.target.id.replace('cancel_','')); 
		app.store.getAlarms(function(alres){
			alres.splice(pos, 1);	
			app.store.persistAlarms(alres, function(){
				alarmView.refreshAlarmsList(alres);
			});
		});
	},
	
	removeAllAlarms: function(){
		app.store.clearAlarms(function(){
			alarmView.refreshAlarmsList({});
		});
	},
	
	route: function() {
		var hash = window.location.hash;
		
		if (!hash) {
			$('#cexiopagecontainer').html(new CexIoSplash(this.store).render().el);
			return;
		}
		
		if (hash.match(app.mainUrl)) {
			$('#cexiopagecontainer').html(new MainView(this.store).render().el);
			return;
		}		
		
		if (hash.match(app.setupUrl)) {
			$('#cexiopagecontainer').html(new SetupView(this.store).render().el);
			return;
		}		
		
		if (hash.match(app.pinUrl)) {
			$('#cexiopagecontainer').html(new PinView(this.store).render().el);
			return;
		}		
		
		if (hash.match(app.openordersUrl)) {
			$('#cexiopagecontainer').html(new OpenOrdersView(this.store).render().el);
			return;
		}		
		
		if (hash.match(app.alarmUrl)) {
			alarmView = new AlarmView(this.store, this);
			
			$('#cexiopagecontainer').html(alarmView.render().el);
			
			$("#selectable").selectable({
				selected: function(event, ui) { 
					var a = getText(ui.selected.childNodes[0]);
					$(".tickertextbox").attr('style', 'background-color:#ffffff!important');
					$("#ticker" + a).attr('style', 'background:#0898A6!important');
					$("#ticker" + a).css({'zindex':999999});
					$("#ticker" + a).css({'position':'relative'});
					$("#ticker" + a).css({'width':'200px'});
					$("#selectedalarmtype").val(a);
				}				
			});			
			
			$("#selectable2").selectable({
				selected: function( event, ui ) { 
					var a = getText(ui.selected.childNodes[0]);
					$("#selectedalarmoperator").val(a);
				}				
			});
			
			app.store.getAlarms(function(alarms){
				alarmView.refreshAlarmsList(alarms);
			});
			
			return;
		}
				
	},
	
    bindEvents: function() {
		$(window).on('hashchange', $.proxy(this.route, this));	
		
		// Bring box forward
		$(".tickertextbox").click(function(evt){
			$(evt.target).blur()
			$(".tickertextbox").attr('style', 'background-color:#ffffff!important');
			$(evt.target).attr('style', 'background-color:#FECA40!important');
			$(evt.target).css({'zindex':999999});
			$(evt.target).css({'position':'relative'});
			$(evt.target).css({'width':'400px'});		
		});		
		
		// No cursor in the exchrate boxes
		$(".tickertextbox").focus(function(evt){
			$(evt.target).blur()
		});
		
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
		//alert('Cordova ready');
		//alert('Your phone uid = ' + device.uuid);
        //app.receivedEvent('deviceready');
    },
	
	checkAlarms: function(ticker){
		//her skal phonegap i brug  (notifications - skulle virke både i android og ios)
		app.store.getAlarms(function(alarms){
			console.log('alarms');
			console.log(alarms);
			for(var i=0; i<alarms.length; i++){
				alarmType = alarms[i].type;
				alarmValue = alarms[i].value;
				operator = alarms[i].operator;
				tickerValue = ticker[alarms[i].type];
				console.log('type : ' + alarmType + ", value: " + alarmValue + ", op: " + operator + ", tickervalue: " + tickerValue);
				if ( operators[operator](tickerValue,alarmValue) ) {
					console.log('ALARM!!!!');
				} else {
					console.log("No alarm");
				}
			}
		});
	},
	
	getTickerValues: function(store){
		
		var pin = "4411";
		
		store.getTicker(function(data){
			obj = JSON.parse(data);
			$("#tickerlast").val("Ls " + parseFloat(obj.last.replace(',','.')).toFixed(7).substring(1));
			$("#tickerlow").val("L " + parseFloat(obj.low.replace(',','.')).toFixed(7).substring(1));
			$("#tickerhigh").val("H " + parseFloat(obj.high.replace(',','.')).toFixed(7).substring(1));
			$("#tickerbid").val("B " + parseFloat(obj.bid.replace(',','.')).toFixed(7).substring(1));
			$("#tickerask").val("A " + parseFloat(obj.ask.replace(',','.')).toFixed(7).substring(1));
			app.checkAlarms(obj);
		});
		
		store.getAPIKeys(pin, function(keys){
			store.signature(keys.user, keys.apikey, keys.apisecret, function(sig){
				var data = {key: keys.apikey, nonce: sig.nonce, signature: sig.hmac};		
				store.getBalance(data, function(r){
					if ( r.indexOf("<") == -1 ) {
						obj = JSON.parse(r);
						if (obj.GHS) $("#balanceghs").val("ghs: " + parseFloat(obj.GHS.available.replace(',','.')).toFixed(7).substring(1));
						if (obj.BTC) $("#balancebtc").val("BTC : " + parseFloat(obj.BTC.available.replace(',','.')).toFixed(7).substring(1));
					}
				});
			});
		});
		
	},
	
	initialize: function() {
	
		var self = this;
		this.mainUrl = /^#main/;
		this.setupUrl = /^#setup/;
		this.pinUrl = /^#pin/;
		this.openordersUrl = /^#openorders/;
		this.alarmUrl = /^#alarm/;
		var that = this;
		
        this.bindEvents();
		this.store = new LocalStorageStore(function() {
			setInterval(function(){ app.getTickerValues(that.store)}, 8000);
			self.route();
	    });
		
    }

};

app.initialize();			