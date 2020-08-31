// Help page
document.getElementById("help").onclick = function()
{
	window.location.href = "./static/help.txt";
}

// Easy to add the no questions text if we delete it
let no_questions_button = document.getElementById("no_questions");

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

		// Updates "New Preset" option
		document.getElementById("np").value = new_name;
		document.getElementById("np").innerHTML = new_name;
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
	// Creates the question element
	let question = document.createElement("div");
	question.className = "question";
	question.style = "background-color: rgba(0, 0, 0, 0.05); display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto 1fr; border: 1px solid;";

	// Gets existing questions, for creating the right question name and removing the "no questions" text
	let questions = document.getElementsByClassName("question");

	// Question name
	let p = document.createElement("p");
	p.innerHTML = `-— Question No. ${questions.length + 1}`;
	p.style.paddingLeft = "10px";
	question.appendChild(p);

	if (questions.length == 0)
	{
		// Removes "no questions" text, since you added a question, thus making the amount of qusetions > 0
		no_questions_button.remove();
		question.style.marginTop = "10px";
	}

	// Adds question type dropdown (Addition, multiplication, exponents, etc.)
	//  wrapper
	let div = document.createElement("div");
	div.style = "display: grid; grid-template-columns: 1fr auto; grid-gap: 10px; align-items: center;";
	question.appendChild(div);

	// "Type:" text
	p = document.createElement("p");
	p.innerHTML = "Type:";
	p.style = "grid-column: 1; justify-self: end;";
	// div.appendChild(p);

	// Actual dropdown
	let dropdown = document.createElement("select");
	dropdown.style = "margin-right: 10px; place-self: center; grid-column: 2;";
	
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

			return [`what is the ${roots[x]} root of ${z(y**x)}`, y];
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
