// Puts the same functions in one file to reduce copy-pasting
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

// Roots...
let roots = [0, "square", "cube", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]

// Takes a config file and returns an array of questions for that config file
function get_questions(m_config)
{
	let c_v = {
		name: "",
		value: ""
	}
	
	let m_questions = [{type: m_config[0]}]

	for (let i = 2; i < m_config.length; i++)
	{
		let c = m_config[i]
		if (c_v.value == "")
		{
			if (c == "=")
			{
				m_questions[m_questions.length-1][c_v.name] = "";
				i++;
				c_v.value += m_config[i];
			}
			else c_v.name += c;
		}
		else
		{
			if (c == ",")
			{
				m_questions[m_questions.length-1][c_v.name] = c_v.value;
				c_v.name = "";
				c_v.value = "";
			}
			else if (c == "|")
			{
				m_questions[m_questions.length-1][c_v.name] = c_v.value;
				c_v.name = "";
				c_v.value = "";

				if (m_config[i + 1] == "|") i = m_config.length;
				else
				{
					m_questions.push({type: m_config[i + 1]});
					i += 2;
				}
			}
			else c_v.value += c;
		}
	}

	return m_questions;
}


// Takes a list of questions and generates a question
function generate_question(m_questions)
{
	// Gets a random question from the array of questions
	let question = m_questions[RNG(1, m_questions.length) - 1];

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


// Takes a config and returns the preset settings
function get_config(m_config)
{
	let c_v = {
		name: "",
		value: "",
		phase: 1
	}
	
	let settings = {}

	for (let i = 2; i < m_config.length; i++)
	{
		let c = m_config[i]
		if (c == "|" && m_config[i + 1] == "|")
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
					c_v.value += m_config[i];
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


// Generates random numbers
function RNG(min, max)
{
	let r = 0;
	while (r == 0)
	{
		r = (Math.floor(Math.random()*(max - min + 1)) + min);
	}
	return r;
}


// Makes a negative number a and returns "(a)", while returning positive numbers normally
function z(number)
{
	if (number < 0) return `(${number})`;
	else return number.toString();
}

