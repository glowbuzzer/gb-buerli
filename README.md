# Buerli/glowbuzzer example project

This project brings together the flexibility of the glowbuzzer framework and the power of the Buerli React library, to provide an enriched development environment for robotics applications.

## Getting started

1. Download and run GBC on Linux with the following command. See [Getting Started](https://glowbuzzer.com/get-started/simulation) on the glowbuzzer site for more information.

    ```bash
    gbc
    ```

2. Run the Buerli classcad server on port 8081. For full information, consult the Buerli documentation. 


3. Install node packages and run vite dev server (you can also use npm/yarn):

    ```bash
    pnpm install
    pnpm start
    ```

## Working with the application

On launching the application, you can import a variety of STEP files for processing. Once a model is loaded, you can interactively select different types of geometry, depending on the path you want to create.

## Building and executing the robot program

Once you have created a detailed robot program following the defined path, you are able to execute this program. It uses the glowbuzzer robot in simulation mode, giving you a high degree of confidence in the validity of the programmed path and the actions defined. With a physical robot connected you can run the program on real hardware. This application can form the basis of your custom machine application.
