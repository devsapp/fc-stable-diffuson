Thanks for the time to contrribute to this project.

The followiing is a set of guidelines for contributing to this project. These are just guidelines, not rules, use your best judgment and this document is also subject to change.

Table of Contents
=================
1. Contribution Workflow
 * Styleguides
 * Git Commit Messages
 * Styleguides, general notes
 * JavaScript Styleguide
 * Python Styleguide
 * Documentation Styleguide
2. License 
3. Questions

# Contribution Workflow
* Fork the repo and create your branch from master.
* If you've added code that should be tested, add tests.
* If you've changed APIs, update the documentation.
* Ensure the test suite passes.
* Make sure your code lints.
* Issue that pull request!

# Styleguides
## Git Commit Messages
* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include [ci skip] in the commit title
* Consider starting the commit message with an applicable emoji.
* A sign-off is not required, but encouraged using the -s flag. Example: git commit -s -m "Adding a new feature"

Example commit message:
```
:rocket: Adds `launch()` method

The launch method accepts a single argument for the speed of the launch.
This method is necessary to get to the moon and fixes #76.
This commit closes issue #34

Signed-off-by: Jane Doe <Jane.doe@hotmail.com>
```

## Styleguides, general notes
The current code does not follow the below proposed styleguides everywhere. Please try to follow the styleguides as much as possible, but if you see something that is not following the styleguides, please do not change it. Commits should be atomic and only change one thing, and changing the style obfuscates the changes. The same goes for whitespace changes.

* If you change current code, please do use the styleguides, even if the code around it does not follow it.
* If you do not adhere to the styleguides, that is ok as well, but please make sure your code is readable and easy to understand.


## JavaScript Styleguide
All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/). [![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](JS%20Style%20Guide)

## Python Styleguide
Try to adhere to [PEP 8](https://www.python.org/dev/peps/pep-0008/). It is not required, but it is recommended.

## Documentation Styleguide
Use [JSDoc](http://usejsdoc.org/) syntax to document code.
Use [GitHub-flavored Markdown](https://guides.github.com/features/mastering-markdown/) syntax to format documentation.

Thank you for your interest in contributing to this project!

# License
Largely public domain, I think tagger/dbimutils,py was [MIT](https://choosealicense.com/licenses/mit/)

# Questions
If you have any questions about the repo, open an issue or contact me directly at [email](mailto:pi.co.0o.byte@gmail.com).


