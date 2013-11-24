

var AlarmView = function(store,app) {
	
	this.createAlarm = function(){	
		app.addAlarmToArray({
			type: $("#selectedalarmtype").val(), 
			value: app.lowAlarm = $("#thres").val(), 
			operator: $("#selectedalarmoperator").val()
		});
	}
		
	this.cancelAlarm = function(evt){
		app.removeAlarmFromArray(evt)
	}
	
	this.removeAllAlarm = function(){
		app.removeAllAlarms();
	}
		
	this.refreshAlarmsList = function(alarms){
		$("#md-alarm").find("tr:gt(0)").remove();
		if (alarms.length>0){
			var arrAlarmsTR = [];
			for (var i = 0; i<alarms.length; i++){
				v =  "<tr style='font:arial;font-size:10px'><td>" + alarms[i].type + "</td><td>" + alarms[i].operator + "</td><td>" +  parseFloat(alarms[i].value).toFixed(8);
				v += "</td><td>" +  "<input type='button' class='cancelalarmbutton' value='cancel' id='cancel_" + i + "'></td></tr>";
				arrAlarmsTR.push(v);
			}
			$('#md-alarm tr:last').after(arrAlarmsTR.join(''));
		}
	},
	
    this.initialize = function() { 
	  this.el = $('<div/>');
      this.el.on('click','#createalarm',this.createAlarm);
      this.el.on('click','.cancelalarmbutton',this.cancelAlarm);
      this.el.on('click','#removeallalarms',this.removeAllAlarm);
    }
	

 	this.render = function() {
		this.el.html(AlarmView.template());  
	    return this;
	}
	
    this.initialize();

}

AlarmView.template = Handlebars.compile($("#tpl-cexio-alarm").html());

