# Ideas and Guidance for AI Agentic Coding

This document outlines a collection of best practices and ideas for effectively using AI agentic tools for coding tasks.

## 1. Modes of Working: Player, Coach, Owner Modes

There are three primary modes for interacting with AI agentic coding tools, each defined by the level of human involvement.

```
+-------------------------------------------------------------------------+
|                        MODES OF WORKING                                 |
+-------------------------------------------------------------------------+
|                                                                         |
|   +------------+      +-------------+      +------------------------+   |
|   |   PLAYER   |----->|    COACH    |----->|         OWNER          |   |
|   +------------+      +-------------+      +------------------------+   |
|   (Interactive)     (Semi-Interactive)      (Async / Non-Interactive)   |
|                                                                         |
+-------------------------------------------------------------------------+
```

1.  **Player Mode:** In this mode, the human is deeply involved in the process, continuously interacting with the tool. It's analogous to a player in a game who is directly responsible for executing each play. The user guides the agent step-by-step, providing constant feedback and making micro-decisions.

2.  **Coach Mode:** Here, the human acts more like a coach. Instead of running every play, the user defines the overall strategy and the "plays" (e.g., high-level plans, specifications, or workflows). The agent (the "player") is then responsible for executing that strategy with a greater degree of autonomy. Interaction is less frequent, focused on setting direction and reviewing outcomes rather than guiding every action.

3.  **Owner Mode:** This mode represents the highest level of automation, with minimal to no real-time human interaction. The human acts like a sports team owner, who hires the right coaches and staff and trusts them to manage the team and win games. In this mode, tasks are handled asynchronously and non-interactively. The user sets the ultimate goal, and the agentic system is responsible for the entire process, from planning to execution, without direct supervision.

## 2. Context Engineering

The quality of the output from an AI agent is heavily dependent on the quality of the context provided.

```
              +---------------------------------+
              |      CONTEXT ENGINEERING        |
              +---------------------------------+
                   | | | | | | | | | | | |
                   v v v v v v v v v v v v
             +-----------------------------+
             |                             |
  [data]---> |           .---.             |
             |          / o o \            |
  [code]---> |          | \_/ |            |
             |           \ - /             |
  [docs]---> |           (---)             |
             |          /-----\            |
  [user]---> |                             |
             |                             |
             +-----------------------------+
                   | | | | | | | | | | | |
                   v v v v v v v v v v v v
            +---------------------------------+
            |            AI Agent             |
            +---------------------------------+
                   | | | | | | | | | | | |
                   v v v v v v v v v v v v
            +---------------------------------+
            |      Large Language Model       |
            +---------------------------------+
```

1.  **Instructional Files (`GEMINI.md`):** Use dedicated files (like `GEMINI.md`) to provide persistent, project-specific instructions, rules, and context to the AI. This is more effective than repeating instructions in every prompt.
2.  **Hierarchical Context:** Organize instructional files hierarchically (global, project, personal). This allows for broad rules to be set at a higher level and specific overrides or additions at a lower, more local level.
3.  **Modular Imports:** Break down large instruction files into smaller, modular files and import them where needed. This improves organization and reusability of context.
4.  **Dynamic Context Selection (`@`):** Use context selection commands (like `@` commands) to dynamically bring specific files or directories into the agent's working context for a particular task.
5.  **Personas:** Define a clear persona for the AI agent within your instruction files. This helps guide its tone, style, and decision-making process to better align with your project's conventions.

## 3. Memory Management

Effectively managing the agent's memory is crucial for both cost-efficiency and continuity.

```
+-------------------------------------------------------------------------+
|                           AI MEMORY MANAGEMENT                          |
+-------------------------------------------------------------------------+
|                                                                         |
|                            +----------------+                           |
|                            |  Memory Files  |                           |
|                            | [o] [o] [o]    |                           |
|                            +----------------+                           |
|                                   |                                     |
|                 +-----------------+-----------------+                   |
|                 |                                   |                   |
|                 v                                   v                   |
|          +-----------------+             +-----------------+            |
|          |  Chat Thread 1  |             |  Chat Thread 2  |            |
|          +-----------------+             +-----------------+            |
|            ^          |                  ^           |                  |
|            |          v                  |           v                  |
|      (Checkpoint)   (Clear)        (Checkpoint)    (Clear)              |
|                                                                         |
|      +----------------------------------------------------------+       |
|      |    Token Optimization (Caching)  --> $$$                 |       |
|      +----------------------------------------------------------+       |
|                                                                         |
+-------------------------------------------------------------------------+
```

1.  **Dedicated Memory Files:** Use specific files to store facts, user preferences, or project details that the agent should remember across sessions.
2.  **Checkpointing:** Leverage checkpointing features to save the state of your project before the agent makes changes. This allows for easy restoration if the agent's actions do not align with your intent.
3.  **Token Optimization:** Utilize features like token caching, which reuse context from previous turns to reduce the number of tokens sent to the model, thereby optimizing costs.
4.  **Chat Threads:** Maintain separate chat threads for different tasks or contexts to keep the agent's short-term memory focused and relevant.
5.  **Context Clearing (`/clear`):** Use commands like `/clear` to reset the agent's context. This is useful when switching tasks or after a discovery phase (e.g., after creating a `PLAN.md`). Clearing the context and then loading a specific file (like the plan) focuses the agent, conserves tokens, and can lead to better performance.

## 4. Safe Vibe Coding

Ensuring a safe and predictable interaction with an AI agent is essential, especially when it has access to your file system and can execute commands.

```
       +------------+             +------------+             +-------------+
       |  RESEARCH  | --YOLO ON-->|    PLAN    | --YOLO ON-->|  IMPLEMENT  |
       +------------+             +------------+             +-------------+
                                                                   |
                                                                   v
                                                         +---------------------+
                                                         | GOOD VCS PRACTICES  |
                                                         +---------------------+
                                                                   | 
                                                                   v
                                                     NEW GIT BRANCH | COMMIT OFTEN | ...
```

1.  **Have concrete stoppage points:** for example for planning phase, let the tool vibe its way to a finished plan and then stop and await further instructions. This way, you can use the tool in a "semi-interactive" manner and go from phase to phase.
2.  **Use version control best practices:** for example, always make changes in new git branch, commit often with clear commit messages and small changes (that can be rolled back).
3.  **Implement automated testing for all new code:** ensuring tests are comprehensive and cover edge cases.
4.  **Conduct thorough code reviews before merging changes.**
5.  **Maintain consistent code style and adhere to project linting rules.**

## 5. Workflows

Adopting structured workflows enhances the efficiency and reliability of AI-assisted coding.

**Workflow 1: Simple**
```
+----------+      +------+      +-----------+
| RESEARCH |----->| PLAN |----->| IMPLEMENT |
+----------+      +------+      +-----------+
```

**Workflow 2: Standard**
```
+----------+      +------+      +--------+      +-----------+      +------+
| RESEARCH |----->| PLAN |----->| REFINE |----->| IMPLEMENT |----->| TEST |
+----------+      +------+      +--------+      +-----------+      +------+
```

**Workflow 3: Comprehensive**
```
+----------+   +-----------+   +--------+   +----------+   +-----------+   +------+   +---------+   +--------+   +--------+   +--------+   +---------+
| RESEARCH |-->| PLAN/SPEC |-->| REFINE |-->| VALIDATE |-->| IMPLEMENT |-->| TEST |-->| EXECUTE |-->| COMMIT |-->| REVIEW |-->| DEPLOY |-->| MONITOR |
+----------+   +-----------+   +--------+   +----------+   +-----------+   +------+   +---------+   +--------+   +--------+   +--------+   +---------+
```

1.  **Test-Driven Development (TDD):** Have the agent write tests first, then write the code to pass those tests. This ensures the resulting code meets the requirements and is verifiable.
2.  **Specification-Driven Development:** Start by having the agent generate a detailed plan or specification. Refine and validate this plan before allowing the agent to proceed with implementation.
3.  **Standardized Multi-step Process:** Follow a consistent, multi-step process for complex tasks:
    *   Research → Plan/Spec → (Refine) → (Validate) → Implement → Test → Execute → Commit → Review → Deploy → Monitor
4.  **Simplified Workflow Modes:** For more straightforward tasks, a simpler workflow can be effective:
    *   Explain → Plan → Implement → Deploy
5.  **Custom Commands:** Create custom commands or scripts to encapsulate common, reusable workflows. This streamlines repetitive tasks and makes the agent more efficient.
6.  **Agentic Loop (ReAct):** Understand and leverage the agent's underlying interaction model (often a ReAct loop: Reason + Act). Providing clear goals and allowing the agent to think, act, and observe is more effective than micromanaging its every step.

## 6. Model Selection

```
+----------------+   "hey brother, how'd I do?"   +----------------+
|   GEMINI PRO   | <----------------------------> |  GEMINI FLASH  |
+----------------+                                +----------------+
```

1.  **Instruction Following over Model Quality:** A model's ability to accurately follow instructions is ultimately more critical than its intrinsic quality. High-quality, reliable results are better achieved by guiding a a model through a well-defined process rather than relying on a more powerful model to figure out a complex task on its own.
2.  **Step-by-Step Workflow:** This approach works by providing the model with a detailed, step-by-step workflow, often outlined in a prescriptive document. Instead of a single, broad request, a task is broken down into smaller, distinct stages with clear stopping points for verification. For example, when creating a new software feature, the process might be:
    *   **Generate a Plan:** The model is first instructed to analyze the requirements and produce a detailed implementation plan. The process then stops, allowing a developer to review and approve the plan.
    *   **Write Code & Tests:** With the approved plan as context, the model is then instructed to write the necessary code and corresponding unit tests. The process pauses again until all generated tests pass successfully.
    *   **Create a Pull Request:** Finally, using the context of the plan and the new code, the model is instructed to generate a pull request with a clear description for team review.
3.  **Dynamically Curated Context:** In this system, the context is dynamically curated for each specific step. The planning phase might require high-level user stories, while the coding phase is given only the approved plan and relevant existing code files. Each step's output becomes new, validated context for the next, creating a reliable chain of progress.
4.  **Control and Customizability:** While this method requires more upfront work to define the workflow, it grants teams far greater control and customizability, leading to more predictable and higher-quality outcomes.
5.  **Use Different Models for Judging:** Use different models to judge the work in the task. For example, if you use the Pro model to craft the `PLAN.md` then use the Flash model to review/judge/ideate over the `PLAN.md`. You could also use the same model to judge itself but using a different model seems more appropriate.

## 7. Measuring Software Delivery Performance (DORA 5 Key Metrics)

Measuring the impact of AI on software development is crucial. The DORA metrics provide a well-established framework for this.

```
+-------------------------------------------------------------------------+
|                             MEASURING AI                                |
+-------------------------------------------------------------------------+
|                                                                         |
|      +-----------------+              +----------------------+          |
|      |   THROUGHPUT    |              |      INSTABILITY     |          |
|      +-----------------+              +----------------------+          |
|              |                                |                         |
|   +------------------------+     +---------------------------+          |
|   | Lead Time for Changes  |     |   Change Fail Rate        |          |
|   | Deployment Frequency   |     |   Mean Time to Restore    |          |
|   +------------------------+     |   Rework Rate             |          |
|                                  +---------------------------+          |
|                                                                         |
+-------------------------------------------------------------------------+
```

1.  **Lead Time for Changes (LT):** The amount of time it takes for a change to go from committed to version control to deployed in production. This is a key throughput metric.

2.  **Deployment Frequency (DF):** The number of deployments over a given period or the time between deployments. This is another key throughput metric.

3.  **Change Fail Rate (CFR):** The ratio of deployments that require immediate intervention following a deployment. This is a key instability metric.

4.  **Mean Time to Restore (MTTR):** The time it takes to restore service after an incident. This is a key instability metric.

5.  **Rework Rate (RR):** The ratio of deployments that are unplanned but happen as a result of an incident in production. This is another key instability metric.