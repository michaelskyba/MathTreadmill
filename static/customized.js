

/*
	Yes, this code is an ugly mess
	This is a small project so I didn't spend time making it clean/efficient
	As you can see, there aren't even any comments
	If this was a larger project, the code would be much more readable
*/



let started = false;
let config = document.getElementById("config").innerHTML;
let questions = get_questions(config);
config = get_config(config);
let start_time = parseInt(config.R);
let reset_time = parseInt(config.R);
let decrement = config.D;
let time_remainging;
let answer;
let interval;

let bar = document.getElementById("time_bar");

document.onkeydown = function(e)
{
	e = e || window.event;

	// When user clicks Enter
	if (e.keyCode == 13)
	{
		if (!started)
		{
			let q = document.getElementsByClassName("q");
			for (let i = 0; i < 4; i++)
			{
				q[i].style.display = "block";
			}

			start_time = reset_time;
			time_remaining = start_time;
			bar.value = time_remaining;
			bar.max = start_time * 100;

			started = true;
			interval = setInterval(main, 10);

			results = generate_question(questions);
			answer = results[1];
			document.getElementById("question").innerHTML = results[0];
			document.getElementById("answer").placeholder = results[0];
		}
		else
		{
			if (parseInt(document.getElementById("answer").value) == answer)
			{
				start_time -= decrement;

				bar.max = start_time * 100;
				time_remaining = start_time;

				results = generate_question(questions);
				answer = results[1];
				document.getElementById("question").innerHTML = results[0];
				document.getElementById("answer").placeholder = results[0]
			}
			else if (document.getElementById("answer").value != "")
			{
				time_remaining = time_remaining / 2;
			}

			document.getElementById("answer").value = "";
		}

	}
}

function main()
{
	time_remaining -= 0.01;
	bar.value = Math.round(time_remaining * 100);
	document.getElementById("time_p").innerHTML = "Time remaining: " + Math.round(time_remaining) + "s";

	if (time_remaining < 0)
	{
		clearInterval(interval);
		started = false;
		document.getElementById("question").innerHTML += " = " + answer;
		document.getElementById("time_p").innerHTML = "You ran out of time!";
		document.getElementById("answer").placeholder = "Press ENTER to try again.";
		clearInterval(interval);
	}
}


