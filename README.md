# MathTreadmill
A small web application for practicing your mental arithmetic skills.
https://github.com/michaelskyba/MathTreadmill

## made by Michael Skyba
https://github.com/michaelskyba/

In MathTreadmill, you can either train at your own pace (using "Custom" mode), or you can use "Auto" mode, which uses a pre-made path of training. It starts easy, but will get more and more difficult. The \*.4 levels are designed to be extra-difficult, so don't be discouraged if you have trouble with those.

MathTreadmill uses SQLite, Flask, CS50's python module (for easy communication with the database), and regular JavaScript


Know issues that I am too lazy to fix:
- A lot of checks are done in the front-end, so if the user knows a bit of js, they can mess things up (make their username > 15 chars, start /custom with invalid options, etc.)
- The project uses SQLite, which isn't scalable
- custom.html is very clunky, especially once you start adding multiple questions
- help.txt is difficult to understand, and /custom without help.txt is even more difficult to understand
- dark souls music is not copyright-free, so MathTreadmill might get taken down (unlikely)
- the code is sloppy and not maintainable long-term
- I didn't use "transactions" (no idea what they are) so there is a possibility of race conditions
- the commit messages are a mess
- MathTreadmill is terrible on mobile (please don't use it on mobile)
