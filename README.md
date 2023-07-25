# Buerli/glowbuzzer example project

This project integrates the Buerli React library with the glowbuzzer framework.

Once the application is running you can load different STEP files. Once a model is loaded you can select objects in the model and
build a robot program to follow the selected path. The robot program can then be executed, as it would run on an actual robot.

## Getting started

1. Download and run GBC on Linux with the following command. See [Getting Started](https://glowbuzzer.com/get-started/simulation) on the glowbuzzer site for more information.

    ```bash
    gbc
    ```

2. Run the Buerli classcad server on port 8081. For full information, consult the Buerli documentation. 


3. Install node packages and run vite dev server (or use npm/yarn):

    ```bash
    pnpm install
    pnpm run dev
    ```

