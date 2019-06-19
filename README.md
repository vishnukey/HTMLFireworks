# Fireworks

At the press of a button, causes fireworks to erupt from the bottom of the
screen.

## Idea
The idea is to create and HTML canvas that spans over the entire viewport
and then have circles animate upwards with a trail and after some period
of time delete themselves and create an explosion effect

## How To Run
Best results by running a local server in the current working directory (the one with `index.html`), for example with `php -S localhost:8000` (opens server on localhost, port 8000

## Attribution
Most of the code as retrieved from [here](https://www.w3schools.com/w3css/tryw3css_templates_blog.htm) and [here](https://www.w3schools.com/w3css/tryit.asp?filename=tryw3css_templates_blog&stacked=h) 

## TODO
- [x] Comments
- [ ] Make code readable
- [ ] Break into multiple files
- [ ] Fix GC issues, stuttering after many objects have been deleted
