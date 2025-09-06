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

When a new change is being requested from an issue, create a new Git branch with the name <date as in YY-MM-DD>-issue-<issueNumber>. Once the plan is completed, create a pull request in the repo.
If the task does not have an associated issue number, then create a branch in the form of <date in YY-MM-YY>-<planName>.

# Game Requirements

For each game, make sure it has a working scoreboard. A START, STOP, PAUSE/RESUME, and DIFFICULTY buttons or dropdowns. After the game is finished, always display a positive motivational message.

# Responsive Game Design Guidelines

To ensure games utilize maximum browser space without causing scrolling, adhere to the following principles:

1.  **Dynamic Canvas Sizing:** Implement JavaScript logic to dynamically adjust the game canvas dimensions based on the available viewport size. This typically involves listening to `window.resize` events.
2.  **Aspect Ratio Preservation:** Always maintain the game's intended aspect ratio during scaling to prevent distortion. Calculate the appropriate width or height based on the aspect ratio and the limiting dimension (width or height) of the viewport.
3.  **CSS for Centering and Layout:** Utilize CSS (preferably TailwindCSS utilities) to center the game canvas within the browser window and manage overall page layout. Use flexbox or grid properties for responsive positioning.
4.  **Viewport Meta Tag:** Ensure the `index.html` includes the following meta tag in the `<head>` section for proper responsiveness across devices:
    ```html
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ```
    (Note: This is already included in the Tetris `index.html`, but should be a general guideline.)

**Example Implementation Snippet (JavaScript for PixiJS):**

```javascript
function resizeCanvas() {
    const gameWidth = 640; // Desired game width (e.g., original width * 2)
    const gameHeight = 1280; // Desired game height (e.g., original height * 2)
    const aspectRatio = gameWidth / gameHeight;

    let newWidth;
    let newHeight;

    if (window.innerWidth / window.innerHeight < aspectRatio) {
        newWidth = window.innerWidth;
        newHeight = newWidth / aspectRatio;
    } else {
        newHeight = window.innerHeight;
        newWidth = newHeight * aspectRatio;
    }

    app.renderer.resize(newWidth, newHeight);
    // If using a stage, scale the stage to fit the new renderer size
    // app.stage.scale.x = newWidth / gameWidth;
    // app.stage.scale.y = newHeight / gameHeight;
}

// Initial resize
resizeCanvas();

// Listen for window resize events
window.addEventListener('resize', resizeCanvas);
```

# Default Game Technologies

If the language, framework, and other details are not specified, use the following:

-   All web-based games must be built using HTML, CSS, and JavaScript.
-   Use DaisyUI for a modern look and feel. Always design a modern look and feel. Always use CDN. Get more details here:
@.llms/daisyui-llms.txt
@.llms/tailwindcss-llms.txt
-   Use PixiJS framework. Always use the CDN option, more details here: 
@.llms/pixijs-llms.txt
-   If the server is not specified, always use Node.js.

# Game Execution

-   If the port is not specified, run the game on port 8080.
-   If there is another process running on port 8080, ask the user whether to kill the process.

# Server Execution

At the end of any implementation that involves a web server, you must:

1.  **Start the server:** Use the appropriate command to run the server in the background (e.g., `node server.js &` or `npm start &`).
2.  **Verify the server is running:**
    -   Check the server's output for any error messages.
    -   Use a command like `curl` to make a request to the server and verify it returns a successful response (e.g., HTTP status code 200).
3.  **Keep the server running:** Do not stop the server unless explicitly instructed to do so. This allows the user to test and interact with the implemented feature.
4.  **Provide the server URL:** Inform the user of the URL where they can access the running application (e.g., `http://localhost:8080`).