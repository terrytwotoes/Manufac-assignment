# Employee Organization App

This is a TypeScript application that manages an employee organizational structure.

## Setup

1. Install TypeScript globally:

   ```sh
   npm install -g typescript


## Cloning and installing dependencies

  ```sh
  git clone https://github.com/terrytwotoes/Manufac-assignment.git
  cd employee-organization-app
  npm install
 ```

## Running Typescript code:

  ```sh
  tsc Assignment.ts
  node Assignment.js
```
## Usage

1. Follow the prompts to perform actions within the organizational structure.
2. Use undo and redo to revert and replay actions.

  ```typescript
  // Create CEO and employee data
const ceo: Employee = {
    // ... CEO data ...
};

const app = new EmployeeOrgApp(ceo);

// Perform actions
app.move(2, 1);
app.move(3, 1);
app.undo();
app.redo();

// Display the updated organization structure
