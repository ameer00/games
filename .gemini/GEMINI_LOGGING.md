# Gemini Task Logging Protocol

**Objective:** To ensure task continuity, perfect recall, and robust error recovery for any multi-step operation. This protocol is designed to be followed by a Gemini agent to allow for interruptions, retries, and seamless resumption of work.

## 1. Steps Directory

All step logs must be stored in a `./steps` directory relative to the project root. If this directory does not exist, the agent must create it.

## 2. Log File Naming Convention

Each step must be logged in a new file with the following naming convention:

`step-<step_number>-<YYYY>-<MM>-<DD>-<HH>-<MM>-<SS>.log`

-   `<step_number>`: A sequential number for the steps of the current task, starting from 1.
-   `<YYYY>-<MM>-<DD>-<HH>-<MM>-<SS>`: The timestamp when the step is being logged.

**Example:** `step-1-2025-07-28-14-30-00.log`

## 3. Log File Content

Each log file must be a structured document containing the following sections:

### Task At Hand

A high-level, clear description of the overall goal. This should remain consistent across all log files for a given task.

**Example:**
```
Implement a new REST API endpoint `/api/v1/users/{id}` to retrieve user data from the database.
```

### User Request

The specific, verbatim user request that initiated the current task. This must remain consistent.

**Example:**
```
"Can you add an endpoint to get user details by their ID?"
```

### Overall Plan

A high-level, multi-step plan to accomplish the entire task. This plan should be included in every step log for context. The current step should be clearly marked.

**Example:**
```
1. Define the data model for the User object.
2. Create the database migration script to add the `users` table.
3. Implement the data access layer to query the `users` table.
4. **[Current]** Create the API controller and route for `/api/v1/users/{id}`.
5. Add unit and integration tests for the new endpoint.
6. Update the API documentation.
```

### Current Step Rationale

Explain precisely why this specific step is being taken now. What is its immediate objective and how does it fit into the `Overall Plan`?

**Example:**
```
With the data model and database access layer complete, the next logical step is to create the public-facing API controller. This will expose the underlying functionality via the specified RESTful route.
```

### Plan for this Step

A detailed, command-by-command or action-by-action plan for the actions to be taken in *this specific step only*.

**Example:**
```
1. Create a new file `src/controllers/userController.js`.
2. Add a new function `getUserById(req, res)`.
3. Implement logic to call the `findUserById` function from the data access layer.
4. Handle potential errors (e.g., user not found) and return appropriate HTTP status codes (200 for success, 404 for not found).
5. Register the new route `/api/v1/users/:id` in the main application router.
```

## 4. Agent Workflow: Execution and Resumption

### Starting a New Task

1.  Acknowledge the user's request.
2.  Formulate the `Overall Plan`.
3.  Before executing the first step, create the first log file (e.g., `step-1-...log`).
4.  Proceed with executing the `Plan for this Step`.

### Resuming from Interruption

If you are interrupted, stopped, or encounter a critical error, follow this procedure upon restart:
1.  **Check for Logs:** Execute `ls -t ./steps/` to find the most recent log file.
2.  **Load Context:** Read the latest log file (e.g., `step-N-...log`).
3.  **Parse State:** Extract the `Task At Hand`, `User Request`, `Overall Plan`, and the last attempted step.
4.  **Inform User:** Briefly inform the user you are resuming their previous task. "Resuming task: [Task At Hand]. I was on step N of the plan."
5.  **Continue:** Proceed with the *next* step in the `Overall Plan`. Create a new log file (`step-N+1-...log`) and continue execution.

## 5. Self-Correction and Error Handling

If a specific action within a step fails (e.g., a command errors out, a test fails):
1.  **Log the Failure:** Create a new log file for the retry attempt (e.g., `step-N-retry-1-...log`).
2.  **Document the Error:** In the `Current Step Rationale`, describe the error encountered in the previous attempt.
3.  **Formulate a New Plan:** In the `Plan for this Step`, detail the new approach to fix the error. This might involve debugging, modifying a previous command, or trying an alternative strategy.
4.  **Execute:** Attempt the new plan.

## 6. Task Completion

Once a task is fully completed, you can optionally create a final log file named `task-completed-YYYY-MM-DD-HH-MM-SS.md` in the `./steps` directory, summarizing the work done. This is for archival purposes.