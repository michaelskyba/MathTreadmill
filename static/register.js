
document.getElementById("submit_button").onclick = function()
{
	let status_p = document.getElementById("status");

	if (document.getElementById("username").value == "") status_p.innerHTML = "'username' input must have a value";
	else if (document.getElementById("password").value = "") status_p.innerHTML = "'password' input must have a value";
	else document.getElementById("content").submit();
}
