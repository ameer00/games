# Game Folder Structure

When creating a new game, please adhere to the following folder structure:

1.  Create a new folder in the root directory of this repository.
2.  The name of the folder should be the name of the game (e.g., "tetris", "snake").
3.  All files related to that game should be placed inside this new folder.

## Example

If you are creating a game called "tetris", you should create a new folder named `tetris` in the root of this repository. All the files for the "tetris" game will be located inside the `/tetris/` directory.

# GitHub Repository

When pulling issues from a project or repository, always use the following repository:

[https://github.com/ameer00/games](https://github.com/ameer00/games)

# Workflow

When a new change is being requested from an issue, create a new Git branch with the name issue-<issueNumber>. Once the plan is completed, create a pull request in the repo.

# Game Requirements

For each game, always have a working scoreboard. A start, stop and pause button. If applicable, a difficulty selection option.

# Default Game Technologies

If the language, framework, and other details are not specified, use the following:

-   All web-based games must be built using HTML, CSS, and JavaScript.
-   Use TailwindCSS for a modern look and feel. Always design a modern look and feel. Use TailwindCSS CDN details here: `https://tailwindcss.com/docs/installation/play-cdn`. More details on TailwindCSS at
@tailwindcss-llms.md
-   Use PixiJS framework. Get the `llms-full.txt` file from `https://pixijs.com/llms-full.txt`.
-   If the server is not specified, always use Node.js.

# Game Execution

-   If the port is not specified, run the game on port 8080.
-   If there is another process running on port 8080, ask the user whether to kill the process.
