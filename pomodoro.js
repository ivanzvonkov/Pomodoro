
var audioElement = document.createElement('audio');
var time;
var session;
var relaxSession;
var state = "done";
var t;
var soundAlert = true;
var notificationAlert = true;

//sets up timer
function setup(work){
	
	state = "work";
	
	$("#subtext").html('');
	$("#subtext").append("Reset");
			
	session = 1;
	relaxSession = 1;

	$("#text").html('');
	$("#text").append("Work Session 1");
	$("title").html('');
	$("title").append("Work Session 1");


	var minutes = Math.floor(work/60);
	var seconds = work - (minutes*60);

	if(seconds < 10){
		seconds = "0"+seconds;
	}

	$("#timer").html('');
	$("#timer").append(minutes+":"+seconds);


	var date = new Date();
	return date.getTime();
}

//counts down
function timer(work, relax, amount, startTime){


	if(state == "done"){
		clearInterval(t);
		return true;
	}


	var date = new Date();	

		//calculates time left
	if(state == "work")
		time = Math.round(work + (startTime/1000) - (date.getTime()/1000) + ((session-1)*work) + ((relaxSession-1)*relax)  );
	else if(state == "break")
		time = Math.round(relax + (startTime/1000) - (date.getTime()/1000) + ((session-1)*work) + ((relaxSession-1)*relax)  );


	//calculate minutes and seconds
	var minutes = Math.floor(time/60);
	var seconds = time - (minutes*60);
	

	//adds zero to seconds less than 0
	if(seconds < 10){
		seconds = "0"+seconds;
	}

	//updates timer
	$("#timer").html('');
	$("#timer").append(minutes+":"+seconds);

	//if time hits 0 
	if(time <= 0){

		//start break
		if(state == "work"){
			session++;
			state = "break";
			displayNotification("Break "+relaxSession);
			setTimeout(function(){
				//displayNotification("Break");
				$("#text").html('');
				$("#text").append("Break "+relaxSession);
				$("title").html('');
				$("title").append("Break "+relaxSession);
			}, 1000);
			

		//start work session
		}else{
			relaxSession++;
			state = "work";
			if(relaxSession > amount)
				displayNotification("Done");
			else
				displayNotification("Work Session "+session);
			setTimeout(function(){
				//if all sessions and breaks are done finish
				if(relaxSession > amount){
					state = "done";
					//displayNotification("Done");
					$("#text").html('');
					$("#text").append("Done");
					$("title").html('');
					$("title").append("Done");
					$("#timer").html('');
					$("#timer").append("0:00");
					return;
				}else{
					//displayNotification("Work Session " + session);
					$("#text").html('');
					$("#text").append("Work Session " + session);
					$("title").html('');
					$("title").append("Work Session " + session);
				}
			}, 1000);
		}

	}

	return true;	
}

//displays or plays notification
function displayNotification(notificationText){
	
	if(soundAlert == true)
		audioElement.play();

	if(notificationAlert == true){
		if (Notification.permission !== "granted")
    		Notification.requestPermission();
  		else {
    		var notification = new Notification(notificationText);
    	}
	}
}

//clears timer
function clearTimer(work){
	$("#subtext").html('');
	$("#subtext").append("Start");

	var minutes = Math.floor(work/60);
	var seconds = work - (minutes*60);

	if(seconds < 10){
		seconds = "0"+seconds;
	}

	$("#timer").html('');
	$("#timer").append(minutes+":"+seconds);
	clearInterval(t);
	state = "done";
}


$(document).ready(function(){
	
	
	audioElement.setAttribute('src', 'pluck.mp3');

	var pomodoroAmount = 4;
	var tempPomodoroAmount = 4;
	var work = 1500;
	var tempWork = 1500;
	var relax = 300;
	var tempRelax = 300;
	var text = "";
	var settingsOn = false;
	var colorBlack = true;
	var i = 0;
	var img_url = "https://source.unsplash.com/random/"+ $(window).width() +"x" +$(window).height();
	document.body.style.backgroundImage = "url('"+img_url+"')";

	$("#subtext").hide();
	
	$("#settings").hide();

	$(window).load(function(){
			$("#fade").fadeOut('slow');
			$(".fluid-contained").fadeIn('slow');
			$('#reset_timer').hide()
			Notification.requestPermission();
	});

	//when work slider is moved
	$('#work_slider').slider({

		formatter: function(value) {
			$("#reset_timer").show();
			$("#work_label").html('');
			$("#work_label").append("Work: <strong>"+value+"</strong>");
			tempWork = value*60;
			return null;
		}
	});

	//when break slider is moved
	$('#break_slider').slider({
		formatter: function(value) {
			$("#reset_timer").show();
			$("#break_label").html('');
			$("#break_label").append("Break: <strong>"+value+"</strong>");
			tempRelax = value*60;
			return null;
		}
	});

	//when amount slider is moved
	$('#amount_slider').slider({
		formatter: function(value) {
			$("#reset_timer").show();
			$("#amount_label").html('');
			$("#amount_label").append("Amount: <strong>"+value+"</strong>");
			tempPomodoroAmount = value;
			return null;
		}
	});

	//change background color of main button
	$('#toggle-color').change(function(){
		if(colorBlack == true){
			//change to white not hovered
			$("#main").css("background-color", "rgba(255,255,255,0.3)");
			colorBlack = false;
		}else{
			//change to black not hovered
			$("#main").css("background-color", "rgba(0,0,0,0.5)");
			colorBlack = true;
		}
	});

	//turns notifications on and off
	$("#notification_checkbox").change(function(){
		if(notificationAlert == true){
			notificationAlert = false;
		}else{
			if (Notification.permission !== "granted")
    			Notification.requestPermission();
			notificationAlert = true;
			displayNotification("Here's a Notification");
		}
	});

	//turn sounds on and off
	$("#sound_checkbox").change(function(){
		console.log("soundAlert is " + soundAlert)
		if(soundAlert == true)
			soundAlert = false;
		else{
			audioElement.play();
			soundAlert = true;
		}
	});
	
	//toggle to change background
	$("#change_background").click(function(){
		i++;
		$("#fade").fadeIn(200);
		$("body").css("background-image", "url('https://source.unsplash.com/random/"+i+30+"')");
		$("#fade").fadeOut(800);
		console.log("loaded");	
	});

	//reset timer after settings are changed
	$('#reset_timer').click(function(){
		work = tempWork;
		relax = tempRelax
		pomodoroAmount = tempPomodoroAmount;
		settingsOn = false;
		$("#settings").fadeOut(200);
		clearTimer(work);
	});

	//close button
	$('#close-button').click(function(){
		settingsOn = false;
		$("#settings").fadeOut(200);
	});

	//cog click
	$("#cog_wrapper").click(function(){
		
		
		if(settingsOn == false){
			settingsOn = true;
			$("#settings").fadeIn(200);
		}else{
			settingsOn = false;
			$("#settings").fadeOut(200);
		}
	});

	//main button hover
	$('#main').hover(function () {
    	
		//hover on
    	if(colorBlack == true)
  			$(this).css("background-color","rgba(0,0,0,0.6)");
  		else
  			$(this).css("background-color","rgba(255,255,255,0.6)");

    	$("#subtext").show();

    	$("#text").hide();},

    	//hover off
    	function () {
    	
    	if(colorBlack == true)
  			$(this).css("background-color","rgba(0,0,0,0.5)");
  		else
  			$(this).css("background-color","rgba(255,255,255,0.3)");

    	$("#subtext").hide();
    	$("#text").show();
	});

	//main button click
	$("#main").click(function(){
		
		if(state == "done"){
			
			var startTime = setup(work);

			t = setInterval(function(){timer(work, relax, pomodoroAmount, startTime)}, 1000);

		}else{
			clearTimer(work);
		}	
	});


});