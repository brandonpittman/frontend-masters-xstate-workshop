import { createMachine, assign, interpret } from "xstate";

const elBox = document.querySelector("#box");
const elBody = document.body;

const resetPosition = (c, e) =>
  assign({
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  });

const machine = createMachine({
  id: "boxMachine",
  initial: "idle",
  context: {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
  },
  states: {
    idle: {
      on: {
        mousedown: {
          actions: assign({
            px: (c, e) => e.clientX,
            py: (c, e) => e.clientY,
          }),
          target: "dragging",
        },
      },
    },
    dragging: {
      on: {
        "keyup.escape": {
          target: "idle",
          actions: resetPosition,
        },
        mousemove: {
          actions: assign({
            dx: (c, e) => e.clientX - c.px,
            dy: (c, e) => e.clientY - c.py,
          }),
        },
        mouseup: {
          actions: assign({
            x: (c, e) => c.x + c.dx,
            y: (c, e) => c.y + c.dy,
            px: 0,
            py: 0,
            dx: 0,
            dy: 0,
          }),
          target: "idle",
        },
      },
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);

    elBox.dataset.state = state.value;

    elBox.style.setProperty("--dx", state.context.dx);
    elBox.style.setProperty("--dy", state.context.dy);
    elBox.style.setProperty("--x", state.context.x);
    elBox.style.setProperty("--y", state.context.y);
  }
});

service.start();

elBox.addEventListener("mousedown", service.send);
elBody.addEventListener("mousemove", service.send);
elBody.addEventListener("mouseup", service.send);
elBody.addEventListener("keyup", (e) => {
  if (e.key == "Escape") service.send("keyup.escape");
});
// Add event listeners for:
// - mousedown on elBox
// - mousemove on elBody
// - mouseup on elBody
