// Keeps track of the questions made in current preset "javscript questions?"
let j_questions = [];

// Keeps track of user's presets
let presets = [];
let preset_elements = document.getElementsByClassName("preset");
for (let i = 0; i < preset_elements.length; i++)
{
	presets.push(preset_elements[i].innerHTML);
}

// Easy to add the no questions text if we delete it
let no_questions_text = document.getElementById("no_questions");


// Help page
document.getElementById("help").onclick = function()
{
	window.location.href = "./static/help.txt";
}


// When the user clicks the "Start" button
document.getElementById("start").onclick = function()
{
	// Makes sure user entered valid values
	let valid = true;
	if (isNaN(parseInt(document.getElementById("reset_time").value))) valid = false;
	if (isNaN(parseInt(document.getElementById("decrement").value))) valid = false;
	if (j_questions.length == 0) valid = false;
	for (let i = 0; i < j_questions.length; i++)
	{
		if (j_questions[i].type == "") valid = false;
		if (isNaN(parseInt(j_questions[i].m1))) valid = false;
		if (isNaN(parseInt(j_questions[i].M2))) valid = false;
		if (isNaN(parseInt(j_questions[i].M1))) valid = false;
		if (isNaN(parseInt(j_questions[i].m2))) valid = false;
		if (parseInt(j_questions[i].m1) > parseInt(j_questions[i].M1)) valid = false;
		if (parseInt(j_questions[i].m2) > parseInt(j_questions[i].M2)) valid = false;
		if (j_questions[i].type == "Subtraction" && j_questions[i].an == "") valid = false;
	}
	
	if (valid)
	{

		// Transcribe the settings into a string
		// eg. "M,m1=-14,M1=14,m2=-14,M2=14,N=|D,m1=-14,M1=14,m2=-14,M2=14,N=||R=25|D=0.75|"
		let config = "";

		// Less typing
		let jq = j_questions;
		for (let i = 0; i < jq.length; i++)
		{
			config += jq[i].type[0] + ",m1=";
			config += jq[i].m1 + ",M1=";
			config += jq[i].M1 + ",m2=";
			config += jq[i].m2 + ",M2=";
			config += jq[i].M2 + ",N=";
			if (jq[i].an == "") jq[i].an = " ";
			config += jq[i].an + "|";
		}
		config += `|R=${document.getElementById("reset_time").value}|D=${document.getElementById("decrement").value}|`;

		// Submits the config to Python
		document.getElementById("j_questions").value = config;
		document.getElementById("custom_form").submit();
	}
	else alert("Invalid options set");
}


// Resets on-screen questions
function reset_questions()
{

	let h_questions = document.getElementsByClassName("question");
	for (let i = 0; i < h_questions.length; i++)
	{
		h_questions[0].remove();
	}

	j_questions = []
}


// When the user switches the active preset
document.getElementById("preset_dropdown").onchange = function()
{
	if (this.value == "New preset")
	{
		let new_name = prompt("Enter a name for your preset:");

		// Check if user properly entered a name
		if (!new_name) this.value = "";
		else if (new_name == "New preset" || presets.indexOf(new_name) != -1)
		{
			alert("Really?");
			this.value = "";
		}
		else if (!isNaN(new_name))
		{
			alert("Your preset name cannot be a number");
			alert("If you really want a number, type it out, like 'five' instead of '5'");
			this.value = "";
		}
		else
		{
			// Updates "New Preset" option
			document.getElementById("np").value = new_name;
			document.getElementById("np").innerHTML = new_name;

			// Tells Python later that a new preset was made
			document.getElementById("new_preset?").value = "Yes";

			// Reset questions
			reset_questions();

			// Tells flask the name of the preset
			document.getElementById("preset_name").value = new_name;

			// Resets config
			document.getElementById("decrement").value = "";
			document.getElementById("reset_time").value = "";

			// Put back the "no questions" text
			document.getElementById("questions").appendChild(no_questions_text);
		}
	}
	else
	{
		// Resets "New Preset" option
		document.getElementById("np").value = "New preset";
		document.getElementById("np").innerHTML = "New preset";
		document.getElementById("new_preset?").value = "No";

		// Reset questions
		reset_questions();

		// Gets the questions from the user's preset
		j_questions = get_questions(this.value);

		// Updates config
		let temp_config = get_config(this.value);
		document.getElementById("decrement").value = temp_config.D;
		document.getElementById("reset_time").value = temp_config.R

		// Tells flask the name of the preset
		document.getElementById("preset_name").value = this.options[this.selectedIndex].innerHTML;

		// Remove "no questions" text since it is false: you cannot make an empty preset
		no_questions_text.remove();

		// Generate html
		for (let i = 0; i < j_questions.length; i++)
		{
			create_question(j_questions[i]);
		}
	}
}


// Creates a question
function create_question(cq_question)
{
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
		no_questions_text.remove();
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
		if (cq_question.type == types[i][0]) option.selected = true;
		dropdown.appendChild(option);
	}
	div.appendChild(dropdown);

	// Settings div
	div = document.createElement("div");
	div.style = "display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 10px; align-items: center;";
	question.appendChild(div);

	// Min and max settings
	let settings = ["m1", "M1", "m2", "M2"];
	for (let i = 0; i < 4; i++)
	{
		let input = document.createElement("input");
		input.type = "text";
		input.style = "width: 40px; text-align: center; justify-self: center;"
		input.placeholder = settings[i];
		input.value = cq_question[settings[i]];
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
		j_questions[id].an = this.value;
	}
	let settings2 = ["y", "n"];
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
		if (cq_question.N == settings2[i]) option.selected = true;
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
		if (c.m1 == "") valid = false;
		if (c.m2 == "") valid = false;
		if (c.M1 == "") valid = false;
		if (c.M2 == "") valid = false;
		if (c.type == "Subtraction" && c.an == "") valid = false;

		if (valid)
		{
			let result = generate_question([{N: c.an, type: c.type[0], m1: c.m1, M1: c.M1, m2: c.m2, M2: c.M2}]);
			alert(`${result[0]} = ${result[1]}`);
		}
		else alert("Invalid options set");
	}
	div.appendChild(input);

	// Finally adds the question into the page
	document.getElementById("questions").appendChild(question);
}

// When you click the + button
document.getElementById("add_question").onclick = function()
{
	// Adds another question to j_questions
	j_questions.push({type: "", m1: "", M1: "", m2: "", M2: "", N: ""});

	create_question({type: "", m1: "", M1: "", m2: "", M2: "", N: ""});
}


// Allows users to delete stuf0
document.onkeydown = function(e)
{
	e = e || window.event;

	// When user clicks d
	if (e.keyCode == 68)
	{
		let answer = prompt("What do you want to delete? Type a preset name or a question number");

		// User wants to delete a question
		if (!isNaN(answer))
		{
			if (j_questions.length + 1 > parseInt(answer) && parseInt(answer) > 0)
			{
				// Delete that question
				j_questions.splice(parseInt(answer) - 1, 1);

				// Redraw all the questions
				let h_questions = document.getElementsByClassName("question");
				let length = h_questions.length;
				for (let i = 0; i < length; i++)
				{
					h_questions[0].remove();
				}

				// Generate html
				for (let i = 0; i < j_questions.length; i++)
				{
					create_question(j_questions[i]);
				}

				if (j_questions.length == 0) document.getElementById("questions").appendChild(no_questions_text);
			}
		}

		// Users wants to delete a preset
		else if (presets.indexOf(answer) != -1 && "Sign in to save presets!")
		{
			document.getElementById("delete_preset").value = answer;
			document.getElementById("custom_form").submit();
		}
	}
}
