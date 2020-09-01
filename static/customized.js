

/*
	Yes, this code is an ugly mess
	This is a small project so I didn't spend time making it clean/efficient
	As you can see, there aren't even any comments
	If this was a larger project, the code would be much more readable
*/

/*
	preset config syntax ("questions" text):
	<question1>|<question2>|...||<setting1>|<setting2>|...|
	
	example config (one that can be used to recreate level 2.3):
	"M,m1=-14,M1=14,m2=-14,M2=14|D,m1=-14,M1=14,m2=-14,M2=14||R=25|D=0.75|"

		preset settings:
			syntax:
			<setting name>=<value>

		settings:
			R - reset time (when you run out of time)
			D - decrement (how many seconds to reduce starting time when you answer a question correctly)
			both R and D do not have to be integers

	question syntax:
	<question type>,<setting1>,<setting2>,...

		general question settings:
			m1 - min1 (minimum number when doing RNG)
			M1 - max1 (maximum number when doing RNG)
			m2 - min2
			M2 - max2
			there are two because you should be able to make questions like "{RNG(1, 20)}^{RNG(2, 4)}" instead of just "{RNG(1, 5)}^{RNG(1, 5)}"
			all of these min/max values have to be integers
			for division, you need to type in the minmax values as if it was a multiplication question, since the answer always has to be an integer

		question types:
		A - addition
		S - subtraction
			N - allow negatives (y/n)
				if no, questions like 4-5 shouldn't be generated)
		M - multiplication
		D - division
		E - exponents
		R - roots
*/

// Takes a preset configuration and outputs a question
alert(document.getElementById("config").innerHTML);
// (of the form "[<question (eg "10 + 5")>, <answer (eg 15)>]")
function get_question(config)
{
	let c_v = {
		name: "",
		value: ""
	}
	
	let questions = [{type: config[0]}]

	for (let i = 2; i < config.length; i++)
	{
		let c = config[i]
		if (c_v.value == "")
		{
			if (c == "=")
			{
				questions[questions.length-1][c_v.name] = "";
				i++;
				c_v.value += config[i];
			}
			else c_v.name += c;
		}
		else
		{
			if (c == ",")
			{
				questions[questions.length-1][c_v.name] = c_v.value;
				c_v.name = "";
				c_v.value = "";
			}
			else if (c == "|")
			{
				questions[questions.length-1][c_v.name] = c_v.value;
				c_v.name = "";
				c_v.value = "";

				if (config[i + 1] == "|") i = config.length;
				else
				{
					questions.push({type: config[i + 1]});
					i += 2;
				}
			}
			else c_v.value += c;
		}
	}

	// Gets a random question from the array of questions
	let question = questions[RNG(1, questions.length) - 1];

	// Generates the question using the settings of the chosen question
	switch(question.type)
	{
		// Addition
		case "A":
			x = RNG(parseInt(question.m1), parseInt(question.M1));
			y = RNG(parseInt(question.m2), parseInt(question.M2));

			if (RNG(1, 2) == 2) return[`${z(x)} + ${z(y)}`, x + y];
			else return[`${z(y)} + ${z(x)}`, x + y];

		// Subtraction
		case "S":
			if (question.N == "y")
			{
				x = RNG(parseInt(question.m1), parseInt(question.M1));
				y = RNG(parseInt(question.m2), parseInt(question.M2));

				if (RNG(1, 2) == 2) return[`${z(x)} - ${z(y)}`, x - y];
				else return[`${z(y)} - ${z(x)}`, y - x];
			}
			else
			{
				x = RNG(parseInt(question.m1), parseInt(question.M1));
				y = RNG(parseInt(question.m2), parseInt(question.M2));

				if (RNG(1, 2) == 2) return[`${z(x + y)} - ${z(y)}`, x];
				else return[`${z(x + y)} - ${z(x)}`, y];
			}

		// Multiplication
		case "M":
			x = RNG(parseInt(question.m1), parseInt(question.M1));
			y = RNG(parseInt(question.m2), parseInt(question.M2));

			if (RNG(1, 2) == 2) return[`${z(x)} × ${z(y)}`, x * y];
			else return[`${z(y)} × ${z(x)}`, x * y];

		// Division
		case "D":
			x = RNG(parseInt(question.m1), parseInt(question.M1));
			y = RNG(parseInt(question.m2), parseInt(question.M2));

			if (RNG(1, 2) == 2) return[`${z(x*y)} ÷ ${z(y)}`, x];
			else return[`${z(y*x)} ÷ ${z(x)}`, y];

		// Exponents
		case "E":
			x = RNG(parseInt(question.m1), parseInt(question.M1));
			y = RNG(parseInt(question.m2), parseInt(question.M2));

			return [`${z(x)}^${y}`, x**y];

		// Roots
		case "R":
			x = RNG(parseInt(question.m1), parseInt(question.M1));
			y = RNG(parseInt(question.m2), parseInt(question.M2));

			return [`what is the ${roots[x]} root of ${z(y**x)}`, y];
	}
}
// get_question("M,m1=-14,M1=14,m2=-14,M2=14|D,m1=-14,M1=14,m2=-14,M2=14||R=25|D=0.75|")

// Takes a preset configuration and outputs the configuration in a digestible form
// needs to return [<reset_time>, <decrement>]
function get_config(config)
{
	let c_v = {
		name: "",
		value: "",
		phase: 1
	}
	
	let settings = {}

	for (let i = 2; i < config.length; i++)
	{
		let c = config[i]
		if (c == "|" && config[i + 1] == "|")
		{
			c_v.phase = 2;
			i++;
		}
		else if (c_v.phase == 2)
		{

			if (c_v.value == "")
			{
				if (c == "=")
				{
					settings[c_v.name] = "";
					i++;
					c_v.value += config[i];
				}
				else c_v.name += c;
			}
			else
			{
				if (c == "|")
				{
					settings[c_v.name] = c_v.value;
					c_v.name = "";
					c_v.value = "";
				}
				else c_v.value += c;
			}
		}
	}

	return settings;
}

let roots = [0, "square", "cube", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]

let started = false;
let skill = 1.1;
let stats = configure(skill);
let start_time = stats[0];
let reset_time = stats[0];
let decrement = stats[1];
let condition = stats[2];
let time_remaining;
let answer;
let interval;
let status_timer = -100;
let signed_in;

bar = document.getElementById("time_bar");
document.getElementById("answer").focus()

let clicked = false;
let paused = false;
let loaded = true;
let music;
document.getElementById("music").onclick = function()
{
	if (!clicked)
	{
		clicked = true;
		music = new Audio(`static/music/${RNG(1, 6)}.mp3`)
		music.addEventListener('ended', function(){ this.src = `static/music/${RNG(1, 6)}.mp3`; this.currentTime = 0; this.play(); }, false);
		music.play()
		document.getElementById("music").value = "Turn off Dark Souls music";
	}
	else
	{
		if (!paused)
		{
			music.pause();
			music.currentTime = 0;
			paused = true;
			document.getElementById("music").value = "Dark Souls music";
		}
		else
		{
			music.src = `static/music/${RNG(1, 6)}.mp3`;
			music.play();
			paused = false;
			document.getElementById("music").value = "Turn off Dark Souls music";
		}
	}

}
if (document.getElementById("audio_input").value == "yes")
{
	clicked = true;
	loaded = false;
	document.getElementById("music").style.display = "none";
	document.getElementById("music").value = "Turn off Dark Souls music";
	music = new Audio(`static/music/${document.getElementById("song_input").value}.mp3`);
	music.currentTime = document.getElementById("time_input").value;
}

document.getElementById("load").onclick = function()
{
	alert("Save codes are used to save your progress in /auto without making an account")
	let code = prompt("Enter your code now:")
	if (!code == false)
	{
		if (["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3", "2.4", "3.1", "3.2", "3.3", "3.4", "4.1", "4.2", "4.3", "4.4", "5.1", "5.2", "5.3", "5.4", "S"].indexOf(atob(code)) != -1)
		{
			document.getElementById("save_code").innerHTML = code; 
			if (atob(code) == "S") skill = "S";
			else skill = parseFloat(atob(code));
			stats = configure(skill);
			start_time = stats[0];
			reset_time = stats[0];
			decrement = stats[1];
			condition = stats[2];

			let q = document.getElementsByClassName("q");
			for (let i = 0; i < 4; i++)
			{
				q[i].style.display = "block";
			}

			started = true;
			interval = setInterval(main, 10);

			time_remaining = start_time;
			bar.value = time_remaining;
			bar.max = start_time * 100;

			results = generate_question(skill);
			answer = results[1];
			document.getElementById("question").innerHTML = results[0];
			document.getElementById("answer").placeholder = results[0];
		}
		else
		{
			alert("That's an invalid code...")
			alert("Are you trying to break the app?")
			alert("Trying to cheat?")
			alert("Either way, you should be ashamed of yourself")
		}
	}
}

let skill_p = document.getElementsByClassName("skill");
if (skill_p.length == 1)
{
	skill = parseFloat(skill_p[0].innerHTML);
	signed_in = true;

	stats = configure(skill);
	start_time = stats[0];
	reset_time = stats[0];
	decrement = stats[1];
	condition = stats[2];

	if (document.getElementById("status").innerHTML != "")
	{
		status_timer = 1000;

		let q = document.getElementsByClassName("q");
		for (let i = 0; i < 4; i++)
		{
			q[i].style.display = "block";
		}
		started = true;
		interval = setInterval(main, 10);

		if (skill == "S")
		{
			start_time += 5;
			if (start_time > 45) start_time = 45;
		}
		else start_time = reset_time;
		time_remaining = start_time;
		bar.value = time_remaining;
		bar.max = start_time * 100;

		results = generate_question(skill);
		answer = results[1];
		document.getElementById("question").innerHTML = results[0];
		document.getElementById("answer").placeholder = results[0];
	}
}
else
{
	signed_in = false;
	document.getElementById("save_code").innerHTML = btoa("1.1") 
}
if (skill != 1.1 && skill != 2.2) document.getElementById("tip").innerHTML = "Submitting an incorrect answer will make you lose time"

document.onkeydown = function (e)
{  
	if (!loaded)
	{
		music.play();
		document.getElementById("music").style.display = "block";
		loaded = true;
	}

	e = e || window.event;
	if (e.keyCode == 13)
	{
		if (!started)
		{
			let q = document.getElementsByClassName("q");
			for (let i = 0; i < 4; i++)
			{
				q[i].style.display = "block";
			}
			started = true;
			interval = setInterval(main, 10);

			if (skill == "S")
			{
				start_time += 5;
				if (start_time > 45) start_time = 45;
			}
			else start_time = reset_time;
			time_remaining = start_time;
			bar.value = time_remaining;
			bar.max = start_time * 100;

			results = generate_question(skill);
			answer = results[1];
			document.getElementById("question").innerHTML = results[0];
			document.getElementById("answer").placeholder = results[0];
		}
		else
		{
			if (parseInt(document.getElementById("answer").value) == answer)
			{
				start_time -= decrement;
				if (start_time < condition)
				{
					if ([1.4, 2.4, 3.4, 4.4, 5.4].indexOf(skill) != -1) skill += 0.7
					else skill += 0.1

					skill = Math.round(skill * 10)/10;

					if (signed_in)
					{
						document.getElementById("skill_input").value = skill;

						if (clicked && !paused)
						{
							document.getElementById("audio_input").value = "yes";
							document.getElementById("song_input").value = music.src;
							document.getElementById("time_input").value = music.currentTime;
						}
						document.getElementById("skill_form").submit();
					}
					else
					{
						stats = configure(skill);
						start_time = stats[0];
						reset_time = stats[0];
						decrement = stats[1];
						condition = stats[2];

						document.getElementById("status").innerHTML = `Congratulations, your skill has been raised to ${skill}!`;
						status_timer = 1000;
						document.getElementById("save_code").innerHTML = btoa(skill.toString());

						bar.max = start_time * 100;
						time_remaining = start_time;

						results = generate_question(skill);
						answer = results[1];
						document.getElementById("question").innerHTML = results[0];
						document.getElementById("answer").placeholder = results[0];
					}

					if (skill != 1.2) document.getElementById("tip").innerHTML = "Submitting an incorrect answer will make you lose time"
				}
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
	if (status_timer != -100)
	{
		status_timer -= 1;
		if (status_timer < 1)
		{
			document.getElementById("status").innerHTML = "";
			status_timer = -100;
		}
	}
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

function configure(skill)
{
	switch(skill)
	{
		case 1.1:
			return [20, 1, 15];

		case 1.2:
			return [20, 0.5, 14];

		case 1.3:
			return [20, 0.25, 13];

		case 1.4:
			return [25, 0.25, 10];

		case 2.1:
			return [20, 0.5, 15];

		case 2.2:
			return [20, 1, 15];

		case 2.3:
			return [25, 0.75, 13];

		case 2.4:
			return [45, 1, 10];

		case 3.1:
			return [18, 0.5, 10];

		case 3.2:
			return [18, 0.25, 13];

		case 3.3:
			return [30, 1, 10];

		case 3.4:
			return [30, 1, 10];

		case 4.1:
			return [20, 0.5, 10];

		case 4.2:
			return [25, 0.75, 10];

		case 4.3:
			return [30, 1, 10];

		case 4.4:
			return [45, 1.25, 15];

		case 5.1:
			return [30, 1, 10];

		case 5.2:
			return [30, 1, 10];

		case 5.3:
			return [40, 1, 10];

		case 5.4:
			return [45, 0.75, 10];

		case "S":
			return [45, 0.75, -1];
	}
}

function z(number)
{
	if (number < 0) return `(${number})`
	else return number.toString();
}

function generate_question(skill)
{
	let x;
	let y;
	let n;

	switch(skill)
	{
		case 1.1:
			x = RNG(0, 10);
			y = RNG(0, 10);
			if (RNG(1, 2) == 1) return [`${x} + ${y}`, x + y];
			return [`${x + y} - ${y}`, x];

		case 1.2:
			x = RNG(0, 20);
			y = RNG(0, 20);
			if (RNG(1, 2) == 1) return [`${x} + ${y}`, x + y];
			return [`${x + y} - ${y}`, x];

		case 1.3:
			x = RNG(-15, 15)
			y = RNG(-15, 15)
			if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x + y];
			return [`${z(x + y)} - ${z(y)}`, x];

		case 1.4:
			x = RNG(-50, 50)
			y = RNG(-50, 50)
			if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x + y];
			return [`${z(x + y)} - ${z(y)}`, x];

		case 2.1:
			x = RNG(2, 10)
			y = RNG(2, 10)
			if (RNG(1, 2) == 1) return [`${x} × ${y}`, x*y]
			return [`${x * y} ÷ ${y}`, x]

		case 2.2:
			x = RNG(-10, 10)
			y = RNG(-10, 10)
			if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
			return [`${z(x * y)} ÷ ${z(y)}`, x]

		case 2.3:
			x = RNG(-14, 14)
			y = RNG(-14, 14)
			if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
			return [`${z(x * y)} ÷ ${z(y)}`, x]

		case 2.4:
			x = RNG(-20, 20)
			y = RNG(-20, 20)
			if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
			return [`${z(x * y)} ÷ ${z(y)}`, x]

		case 3.1:
			if (RNG(1, 2) == 1)
			{
				x = RNG(-14, 14);
				y = RNG(-14, 14);
				if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
				return [`${z(x * y)} ÷ ${z(y)}`, x]
			}
			x = RNG(-25, 25)
			y = RNG(-25, 25)
			if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x + y];
			return [`${z(x + y)} - ${z(y)}`, x];

		case 3.2:
			if (RNG(1, 2) == 1)
			{
				x = RNG(-16, 16);
				y = RNG(-16, 16);
				if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
				return [`${z(x * y)} ÷ ${z(y)}`, x]
			}
			x = RNG(-35, 35)
			y = RNG(-35, 35)
			if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x + y];
			return [`${z(x + y)} - ${z(y)}`, x];

		case 3.3:
			if (RNG(1, 2) == 1)
			{
				x = RNG(-20, 20);
				y = RNG(-20, 20);
				if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
				return [`${z(x * y)} ÷ ${z(y)}`, x]
			}
			x = RNG(-50, 50)
			y = RNG(-50, 50)
			if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x + y];
			return [`${z(x + y)} - ${z(y)}`, x];

		case 3.4:
			if (RNG(1, 2) == 1)
			{
				x = RNG(-20, 20);
				y = RNG(-20, 20);
				if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
				return [`${z(x * y)} ÷ ${z(y)}`, x]
			}
			x = RNG(-100, 100)
			y = RNG(-100, 100)
			if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x + y];
			return [`${z(x + y)} - ${z(y)}`, x];

		case 4.1:
			x = RNG(2, 10)
			if (RNG(1, 2) == 1) return [`${x}^2`, x**2]
			return [`square root of ${x**2}`, x]

		case 4.2:
			if (RNG(1, 2) == 1)
			{
				x = RNG(2, 15)
				if (RNG(1, 2) == 1) return [`${x}^2`, x**2]
				return [`square root of ${x**2}`, x]
			}
			x = RNG(2, 10)
			if (RNG(1, 2) == 1) return [`${x}^3`, x**3]
			return [`cube root of ${x**3}`, x]

		case 4.3:
			if (RNG(1, 2) == 1)
			{
				x = RNG(2, 20)
				if (RNG(1, 2) == 1) return [`${x}^2`, x**2]
				return [`square root of ${x**2}`, x]
			}
			x = RNG(2, 15)
			if (RNG(1, 2) == 1) return [`${x}^3`, x**3]
			return [`cube root of ${x**3}`, x]

		case 4.4:
			let n = RNG(1, 4);
			if (n == 1)
			{
				x = RNG(2, 8);
				if (RNG(1, 2) == 1) return [`2^${x}`, 2**x]
				return [`${roots[x]} root of ${2**x}`, 2]
			}
			if (n == 2)
			{
				x = RNG(2, 4);
				if (RNG(1, 2) == 1) return [`3^${x}`, 3**x]
				return [`${roots[x]} root of ${3**x}`, 3]
			}
			if (n == 3)
			{
				x = RNG(4, 20);
				if (RNG(1, 2) == 1) return [`${x}^2`, x**2]
				return [`square root of ${x**2}`, x]
			}
			x = RNG(4, 20);
			if (RNG(1, 2) == 1) return [`${x}^3`, x**3]
			return [`cube root of ${x**3}`, x]


		case 5.1:
			n = RNG(1, 3)
			if (n == 1)
			{
				x = RNG(-35, 35)
				y = RNG(-35, 35)
				if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x+y]
				return [`${z(x+y)} - ${z(y)}`, x]
			}
			if (n == 2)
			{
				x = RNG(-15, 15)
				y = RNG(-15, 15)
				if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
				return [`${z(x*y)} ÷ ${z(y)}`, x]
			}
			x = RNG(2, 20)
			y = RNG(2, 3)
			if (RNG(1, 2) == 1) return [`${x}^${y}`, x**y]
			return [`${roots[y]} root of ${x**y}`, x]

		case 5.2:
			n = RNG(1, 3)
			if (n == 1)
			{
				x = RNG(-50, 50)
				y = RNG(-50, 50)
				if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x+y]
				return [`${z(x+y)} - ${z(y)}`, x]
			}
			if (n == 2)
			{
				x = RNG(-20, 20)
				y = RNG(-20, 20)
				if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
				return [`${z(x*y)} ÷ ${z(y)}`, x]
			}
			x = RNG(2, 20)
			y = RNG(2, 3)
			if (RNG(1, 2) == 1) return [`${x}^${y}`, x**y]
			return [`${roots[y]} root of ${x**y}`, x]

		case 5.3:
			n = RNG(1, 3)
			if (n == 1)
			{
				x = RNG(-150, 150)
				y = RNG(-150, 150)
				if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x+y]
				return [`${z(x+y)} - ${z(y)}`, x]
			}
			if (n == 2)
			{
				x = RNG(-25, 25)
				y = RNG(-25, 25)
				if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
				return [`${z(x*y)} ÷ ${z(y)}`, x]
			}
			n = RNG(1, 3)
			if (n == 1)
			{
				x = RNG(2, 10)
				if (RNG(1, 2) == 1) return [`2^${x}`, 2**x]
				else return [`${roots[x]} root of ${2**x}`, 2]
			}
			if (n == 2)
			{
				x = RNG(2, 8)
				if (RNG(1, 2) == 1) return [`3^${x}`, 3**x]
				return [`${roots[x]} root of ${3**x}`, 3]
			}
			x = RNG(4, 20)
			y = RNG(2, 3)
			if (RNG(1, 2) == 1) return [`${x}^${y}`, x**y]
			return [`${roots[y]} root of ${x**y}`, x]

		default:
			n = RNG(1, 3)
			if (n == 1)
			{
				x = RNG(-500, 500)
				y = RNG(-500, 500)
				if (RNG(1, 2) == 1) return [`${z(x)} + ${z(y)}`, x+y]
				return [`${z(x+y)} - ${z(y)}`, x]
			}
			if (n == 2)
			{
				x = RNG(-30, 30)
				y = RNG(-30, 30)
				if (RNG(1, 2) == 1) return [`${z(x)} × ${z(y)}`, x*y]
				return [`${z(x*y)} ÷ ${z(y)}`, x]
			}
			n = RNG(1, 6)
			if (n == 1)
			{
				x = RNG(2, 12)
				if (RNG(1, 2) == 1) return [`2^${x}`, 2**x]
				else return [`${roots[x]} root of ${2**x}`, 2]
			}
			if (n == 2)
			{
				x = RNG(2, 10)
				if (RNG(1, 2) == 1) return [`3^${x}`, 3**x]
				return [`${roots[x]} root of ${3**x}`, 3]
			}
			if (n == 3)
			{
				x = RNG(2, 8)
				if (RNG(1, 2) == 1) return [`4^${x}`, 4**x]
				return [`${roots[x]} root of ${4**x}`, 4]
			}
			if (n == 4)
			{
				x = RNG(2, 6)
				if (RNG(1, 2) == 1) return [`5^${x}`, 5**x]
				return [`${roots[x]} root of ${5**x}`, 5]
			}
			if (n == 5)
			{
				x = RNG(6, 20)
				y = RNG(2, 4)
				if (RNG(1, 2) == 1) return [`${x}^${y}`, x**y]
				return [`${roots[y]} root of ${x**y}`, x]
			}
			if (n == 6)
			{
				x = RNG(21, 25)
				y = RNG(2, 3)
				if (RNG(1, 2) == 1) return [`${x}^${y}`, x**y]
				return [`${roots[y]} root of ${x**y}`, x]
			}
			x = RNG(26, 30)
			if (RNG(1, 2) == 1) return [`${x}^2`, x**2]
			return [`square root of ${x**2}`, x]
	}
}

function RNG(min, max)
{
	let r = 0;
	while (r == 0)
	{
		r = (Math.floor(Math.random()*(max - min + 1)) + min);
	}
	return r;
}
