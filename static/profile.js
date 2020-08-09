
document.getElementById("username").onclick = function()
{
	let username = prompt("Type in your new username:");
	if (!username == false)
	{
		if (username.length < 16)
		{
		document.getElementById("one").value = username;
		document.getElementById("type").value = "username";
		document.getElementById("hidden_form").submit();
		}
		else document.getElementById('status').innerHTML = "Your username cannot be longer than 15 characters";
	}
}

document.getElementById("password").onclick = function()
{
	let old = prompt("Type in your OLD password:");
	if (!old == false)
	{
		let new1 = prompt("Type in your new password:");
		if (!new1 == false)
		{
			if (old != new1)
			{
				let new2 = prompt("Type in your new password (again):");
				if (!new2 == false)
				{
					if (new2 == new1)
					{
						document.getElementById("one").value = old;
						document.getElementById("two").value = new1;
						document.getElementById("three").value = new2;
						document.getElementById("type").value = "password";
						document.getElementById("hidden_form").submit();
					}
					else document.getElementById("status").innerHTML = "'new password' and 'new password (again)' must match";
				}
			}
			else document.getElementById("status").innerHTML = "You can't change your password to your existing password";
		}
	}
}
