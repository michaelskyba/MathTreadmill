
function submit_form()
{
	let status_p = document.getElementById("status");
	if (document.getElementById("username").value == "") status_p.innerHTML = "'username' input must have a value";
	else if (document.getElementById("password").value == "") status_p.innerHTML = "'password' input must have a value";
	else document.getElementById("content").submit();
}


document.getElementById("submit_button").onclick = function()
{
	submit_form();
}


document.onkeydown = function(e)
{
	e = e || window.event;

	// When user clicks Enter, submit the form (UX)
	if (e.keyCode == 13) submit_form();
}

