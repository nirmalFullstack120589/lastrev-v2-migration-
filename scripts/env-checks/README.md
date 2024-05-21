# Environment Checks Project

This suite of scripts is designed to streamline the setup and validation of development environments for both local development and continuous integration (CI) processes. It ensures that the necessary environment variables and configurations are correctly established, providing a solid foundation for software development and deployment.

## Project Structure

The project is organized into several key areas:

- **CI Scripts**: Scripts tailored for CI environment setup and validation.
- **Local Scripts**: Scripts for setting up and validating local development environments.
- **Utility Scripts**: Includes the main workflow orchestrator and an environment validator.

## CI Scripts

### `ci_var_check.sh`

Verifies the necessary CI environment variables are set and correct, ensuring the CI process can proceed without configuration issues.

### `ci_propagate_env.sh`

Handles the propagation of environment variables through the CI pipeline, maintaining consistent environment configurations across stages.

### `ci_pull_vars.sh`

Retrieves environment variables required for the CI process, supporting dynamic configuration based on project needs.

### `ci_install_envkey.sh`

Installs and configures EnvKey for secure management of environment secrets, ensuring sensitive information is handled safely within CI environments.

## Local Scripts

### `local_auth_check.sh`

Checks for proper authentication configurations in the local development setup, including the presence of necessary authentication files and keys.

### `local_workflow.sh`

Coordinates the local development environment setup process, guiding through the necessary steps to prepare a local environment for development activities.

### `local_setup_check.sh`

Confirms the local development environment is correctly set up for Envkey, and any prerequisites to ensure readiness for development tasks.

### `local_pull_vars.sh`

Retrieves necessary environment variables for local development, aligning the local setup with project requirements.

## Utility Scripts

### `main_workflow.sh`

Serves as the primary orchestrator for the environment setup and validation process, determining the execution context (CI or local) and initiating the appropriate workflows.

### `env_validator.js`

Performs advanced validation of environment configurations, ensuring all required environment variables are present based on the globalEnv array within the turbo.json file and not excluded within this validator script before starting the build or development process.
