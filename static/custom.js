// Keeps track of the questions made "javscript questions?"
let j_questions = [];

// Keeps track of user's presets
let presets = [];
let preset_elements = document.getElementsByClassName("preset");
for (let i = 0; i < preset_elements.length; i++)
{
	presets.push(preset_elements[i].innerHTML);
}

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
	// Makes sure user entered valid values
	let valid = true;
	if (isNaN(parseInt(document.getElementById("reset_time").value))) valid = false;
	if (isNaN(parseInt(document.getElementById("decrement").value))) valid = false;
	for (let i = 0; i < j_questions.length; i++)
	{
		if (j_questions[i].type == "") valid = false;
		if (isNaN(parseInt(j_questions[i].Min1))) valid = false;
		if (isNaN(parseInt(j_questions[i].Min2))) valid = false;
		if (isNaN(parseInt(j_questions[i].Max1))) valid = false;
		if (isNaN(parseInt(j_questions[i].Max2))) valid = false;
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
			config += jq[i].Min1 + ",M1=";
			config += jq[i].Max1 + ",m2=";
			config += jq[i].Min2 + ",M2=";
			config += jq[i].Max2 + ",N=";
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
		else
		{
			// Updates "New Preset" option
			document.getElementById("np").value = new_name;
			document.getElementById("np").innerHTML = new_name;

			// Tells Python later that a new preset was made
			document.getElementById("new_preset?").value = "Yes";
		}
	}
	else
	{
		// Resets "New Preset" option
		document.getElementById("np").value = "New preset";
		document.getElementById("np").innerHTML = "New preset";
		document.getElementById("new_preset?").value = "No";

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


