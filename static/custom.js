
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
			document.getElementById("no_questions").remove();
		}

		// Temporarily removes the + button to make it easier to generate questions
		let plus = document.getElementById("add_button");
		plus.remove();

		// Iterates over questions and generates HTML
		for (let i = 0; i < questions.length; i++)
		{
			let question = document.createElement("div");
			question.style = "margin: 10px; padding: 10px; border: 1px solid;";
			
			let p = document.createElement("p");
			p.innerHTML = `Question #${i}`;

			question.appendChild(p);
			document.getElementById("questions").appendChild(question);
		}

		// Adds back the + button
		document.getElementById("questions").appendChild(plus);
	}
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
