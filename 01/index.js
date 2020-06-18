const elBox = document.querySelector("#box");

// Pure function that returns the next state,
// given the current state and sent event
// function transition(state, event) {
//   switch (state) {
//     case "INACTIVE":
//       switch (event) {
//         case "CLICK":
//           return "ACTIVE";
//         default:
//           return state;
//       }
//     case "ACTIVE":
//       switch (event) {
//         case "CLICK":
//           return "INACTIVE";
//         default:
//           return state;
//       }
//     default:
//       return state;
//   }
// }

const machine = {
  initial: "inactive",
  states: {
    inactive: {
      on: {
        CLICK: "active",
      },
    },
    active: {
      on: {
        CLICK: "inactive",
      },
    },
  },
};

const transition = (state, event) => machine.states[state].on?.[event] || state;

// Keep track of your current state
let currentState = machine.initial;

function send(event) {
  currentState = transition(currentState, event);
  elBox.dataset.state = currentState;
}

elBox.dataset.state = machine.initial;

elBox.addEventListener("click", () => {
  send("CLICK");
});
