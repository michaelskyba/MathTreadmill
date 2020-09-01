// Keeps track of the questions made "javscript questions?"
let j_questions = []

// Roots...
let roots = [0, "square", "cube", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]

// Help page
document.getElementById("help").onclick = function()
{
	window.location.href = "./static/help.txt";
}

// Easy to add the no questions text if we delete it
let no_questions_button = document.getElementById("no_questions");


// When the user clicks the "Start" button
document.getElementById("start").onclick = function()
{
	// Transcribe the settings into a string
	// eg. "M,m1=-14,M1=14,m2=-14,M2=14,N=|D,m1=-14,M1=14,m2=-14,M2=14,N=||R=25|D=0.75|"
	let config = "";

	// Less typing
	let jq = j_questions;
	for (let i = 0; i < jq.length; i++)
	{
		config += jq[i].type[0] + ",m1=";
		config += jq[i].Min1 + ",M1=";
		config += jq[i].Max1 + ",m2=";
		config += jq[i].Min2 + ",M2=";
		config += jq[i].Max2 + ",N=";
		config += jq[i].an + "|";
	}
	config += `|R=${document.getElementById("reset_time").value}|D=${document.getElementById("decrement").value}|`;
	console.log(config);

	// Submits the config to Python
	document.getElementById("j_questions").value = config;
	document.getElementById("custom_form").submit();
}


// When the user switches the active preset
document.getElementById("preset_dropdown").onchange = function()
{
	if (this.value == "New preset")
	{
		let new_name = prompt("Enter a name for your preset:");

		// Check if user properly entered a name
		if (!new_name) this.value = "";
		else if (new_name == "New preset")
		{
			alert("Really?");
			this.value = "";
		}
		else
		{
			// Updates "New Preset" option
			document.getElementById("np").value = new_name;
			document.getElementById("np").innerHTML = new_name;
		}
	}
	else
	{
		// Resets "New Preset" option
		document.getElementById("np").value = "New preset";
		document.getElementById("np").innerHTML = "New preset";

		// Gets the questions from the user's preset
		let questions = get_questions(this.value);

		// Remove "no questions" text if it is false
		if (questions.length != 0)
		{
			no_questions_button.remove();
		}

		// Iterates over questions and generates HTML
		for (let i = 0; i < questions.length; i++)
		{
			let question = document.createElement("div");
			question.style = "margin: 10px; padding: 10px; border: 1px solid;";
			
			let p = document.createElement("p");
			p.innerHTML = `Question No. ${i}`;

			question.appendChild(p);
			document.getElementById("questions").appendChild(question);
		}
	}
}


// When you click the + button
document.getElementById("add_question").onclick = function()
{
	// Adds another question to j_questions
	j_questions.push({type: "", Min1: "", Max1: "", Min2: "", Max2: "", an: ""});

	// Creates the question element
	let question = document.createElement("div");
	question.className = "question";
	question.style = "background-color: rgba(0, 0, 0, 0.05); grid-gap: 10px; display: grid; grid-template-rows: auto 1fr 1fr; border: 1px solid;";

	// Gets existing questions, for creating the right question name and removing the "no questions" text
	let questions = document.getElementsByClassName("question");
	let id = questions.length;

	// Creates wrapper for Question number and quesion type
	let div = document.createElement("div");
	div.style = "display: grid; grid-template-columns: auto auto; grid-gap: 10px; align-items: center;";
	question.appendChild(div);

	// Question name
	let p = document.createElement("p");
	p.innerHTML = `-— Question No. ${id+1}`;
	p.style.paddingLeft = "10px";
	div.appendChild(p);

	if (questions.length == 0)
	{
		// Removes "no questions" text, since you added a question, thus making the amount of qusetions > 0
		no_questions_button.remove();
		question.style.marginTop = "10px";
	}

	// Adds question type dropdown (Addition, multiplication, exponents, etc.)
	// Actual dropdown
	let dropdown = document.createElement("select");
	dropdown.style = "margin-right: 10px; align-self: center; justify-self: end; grid-column: 2;";
	dropdown.onchange = function()
	{
		j_questions[id].type = this.value;
		if (this.value == "Subtraction")
		{
			document.getElementById(`AN_${id + 1}`).disabled = false;
		}
		else
		{
			document.getElementById(`AN_${id + 1}`).disabled = true;
			document.getElementById(`AN_${id + 1}`).value = "";
			j_questions[id].an = "";
		}
	}

	
	// Adds options
	let option = document.createElement("option");
	option.innerHTML = "Select a type...";
	option.value = "";
	option.selected = true;
	option.disabled = true;
	dropdown.appendChild(option);
	let types = ["Addition", "Subtraction", "Multiplication", "Division", "Exponents", "Roots"]
	for (let i = 0; i < 6; i++)
	{
		option = document.createElement("option");
		option.innerHTML = types[i];
		option.value = types[i];
		dropdown.appendChild(option);
	}
	div.appendChild(dropdown);

	// Settings div
	div = document.createElement("div");
	div.style = "display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 10px; align-items: center;";
	question.appendChild(div);

	// Min and max settings
	let settings = ["Min1", "Max1", "Min2", "Max2"];
	for (let i = 0; i < 4; i++)
	{
		let input = document.createElement("input");
		input.type = "text";
		input.style = "width: 40px; text-align: center; justify-self: center;"
		input.placeholder = settings[i];
		input.onkeyup = function()
		{
			j_questions[id][settings[i]] = this.value;
		}

		div.appendChild(input);
	}

	// Wrapper for bottom layer
	div = document.createElement("div");
	div.style = "display: grid; grid-template-columns: 1fr 1fr; align-items: center;";
	question.appendChild(div);

	// 'Allow negatives?' dropdown
	dropdown = document.createElement("select");
	dropdown.style = "margin: 8px; width: 170px; text-align: center;";
	dropdown.id = `AN_${id+1}`;
	dropdown.disabled = true;
	dropdown.onchange = function()
	{
		if (this.value == "Yes") j_questions[id].an = "y";
		else j_questions[id].an = "n";
	}
	let settings2 = ["Yes", "No"];
	option = document.createElement("option");
	option.innerHTML = "AN (Sub)?";
	option.disabled = true;
	option.selected = true;
	option.value = "";
	dropdown.appendChild(option);
	for (let i = 0; i < 2; i++)
	{
		option = document.createElement("option");
		option.innerHTML = settings2[i];
		option.value = settings2[i];
		dropdown.appendChild(option);
	}
	div.appendChild(dropdown);

	// Sample question button
	input = document.createElement("input");
	input.type = "button";
	input.style = "justify-self: end; margin: 8px; width: 170px;"
	input.value = "Sample question";
	input.onclick = function()
	{
		// Makes sure user entered values into the question settings
		let valid = true;
		let c = j_questions[id];
		if (c.type == "") valid = false;
		if (c.Min1 == "") valid = false;
		if (c.Min2 == "") valid = false;
		if (c.Max1 == "") valid = false;
		if (c.Max2 == "") valid = false;
		if (c.type == "Subtraction" && c.an == "") valid = false;

		if (valid)
		{
			let result = generate_question([{N: c.an, type: c.type[0], m1: c.Min1, M1: c.Max1, m2: c.Min2, M2: c.Max2}]);
			alert(`${result[0]} = ${result[1]}`);
		}
		else alert("Invalid options set");
	}
	div.appendChild(input);

	// Finally adds the question into the page
	document.getElementById("questions").appendChild(question);
}


function get_questions(config)
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

	return questions;
}


function generate_question(questions)
{
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

			return [`what is the ${roots[y - 1]} root of ${z(x**y)}`, x];
	}
}


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


function RNG(min, max)
{
	let r = 0;
	while (r == 0)
	{
		r = (Math.floor(Math.random()*(max - min + 1)) + min);
	}
	return r;
}


function z(number)
{
	if (number < 0) return `(${number})`
	else return number.toString();
}

