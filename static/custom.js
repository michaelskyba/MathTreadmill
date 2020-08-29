
// When the user switches the active preset
document.getElementById("preset_dropdown").onchange = function()
{
	alert(this.value)
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

		document.getElementById("np").value = new_name;
		document.getElementById("np").innerHTML = new_name;
	}
	else
	{
		document.getElementById("np").value = "New preset";
		document.getElementById("np").innerHTML = "New preset";
	}
}
