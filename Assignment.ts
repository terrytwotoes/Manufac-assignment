interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

interface IEmployeeOrgApp {
  ceo: Employee;
  move(employeeID: number, supervisorID: number): void;
  undo(): void;
  redo(): void;
}

class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;
  actions: {
    type: "move";
    employeeID: number;
    oldSupervisorID: number | null;
    newSupervisorID: number;
  }[];
  currentIndex: number;

  constructor(ceo: Employee) {
    this.ceo = ceo;
    this.actions = [];
    this.currentIndex = -1;
  }

  move(employeeID: number, supervisorID: number): void {
    const employee = this.findEmployee(this.ceo, employeeID);
    const newSupervisor = this.findEmployee(this.ceo, supervisorID);

    if (employee && newSupervisor) {
      const oldSupervisor = this.findSupervisor(this.ceo, employeeID);
      if (oldSupervisor) {
        oldSupervisor.subordinates = oldSupervisor.subordinates.filter(
          (sub) => sub.uniqueId !== employeeID
        );
      }

      newSupervisor.subordinates.push(employee);

      // Save the move action for undo/redo
      this.actions.splice(this.currentIndex + 1);
      this.actions.push({
        type: "move",
        employeeID,
        oldSupervisorID: oldSupervisor ? oldSupervisor.uniqueId : null,
        newSupervisorID: newSupervisor.uniqueId,
      });

      this.currentIndex = this.actions.length - 1;
    }
  }

  undo(): void {
    if (this.currentIndex >= 0) {
      const action = this.actions[this.currentIndex];
      if (action.type === "move") {
        const employee = this.findEmployee(this.ceo, action.employeeID);
        const oldSupervisor = this.findEmployee(
          this.ceo,
          action.oldSupervisorID
        );
        const newSupervisor = this.findEmployee(
          this.ceo,
          action.newSupervisorID
        );

        if (employee && newSupervisor && oldSupervisor) {
          // Move employee back to old supervisor's subordinates
          newSupervisor.subordinates = newSupervisor.subordinates.filter(
            (sub) => sub.uniqueId !== action.employeeID
          );
          oldSupervisor.subordinates.push(employee);
        }
      }
      this.currentIndex--;
    }
  }

  redo(): void {
    if (this.currentIndex < this.actions.length - 1) {
      this.currentIndex++;
      const action = this.actions[this.currentIndex];
      if (action.type === "move") {
        // Redo the move action
        this.move(action.employeeID, action.newSupervisorID);
      }
    }
  }

  private findEmployee(
    employee: Employee,
    employeeID: number
  ): Employee | null {
    if (employee.uniqueId === employeeID) {
      return employee;
    }
    for (const sub of employee.subordinates) {
      const found = this.findEmployee(sub, employeeID);
      if (found) {
        return found;
      }
    }
    return null;
  }

  private findSupervisor(
    employee: Employee,
    subordinateID: number
  ): Employee | null {
    for (const sub of employee.subordinates) {
      if (sub.uniqueId === subordinateID) {
        return employee;
      }
      const found = this.findSupervisor(sub, subordinateID);
      if (found) {
        return found;
      }
    }
    return null;
  }
}

// Example usage
const ceo: Employee = {
  uniqueId: 1,
  name: "John Smith",
  subordinates: [
    {
      uniqueId: 2,
      name: "Margot Donald",
      subordinates: [
        {
          uniqueId: 4,
          name: "Cassandra Reynolds",
          subordinates: [
            {
              uniqueId: 5,
              name: "Mary Blue",
              subordinates: [],
            },
            {
              uniqueId: 6,
              name: "Bob Saget",
              subordinates: [],
            },
          ],
        },
      ],
    },
    {
      uniqueId: 3,
      name: "Tyler Simpson",
      subordinates: [],
    },
  ],
};

const app = new EmployeeOrgApp(ceo);

app.move(6, 2);
app.undo();
app.redo();
