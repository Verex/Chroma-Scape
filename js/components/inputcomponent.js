var InputMethod = {
    INPUT_MOUSE: 0,
    INPUT_KEYBOARD: 1,
    INPUT_GAMEPAD: 2,
};

var InputType = {
    BTN_PRESS: 0,
    BTN_RELEASE: 1,
    MSE_MOVE: 2,
    MSE_PRESS: 3,
    MSE_RELEASE: 4,
};

var MouseClick = {
  LEFT_CLICK: 0,
  RIGHT_CLICK: 1
};

class InputComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_INPUT, owner);

        this.events = {mouse: {}, keyboard: {}};

        // Create keyboard press groups.
        this.events.keyboard[InputType.BTN_PRESS] = {};
        this.events.keyboard[InputType.BTN_RELEASE] = {};

        // Create gamepad
        this.controllers = {};

        // Set current gamepad controller.
        this.gamepad = -1;

        // Add event listeners.
        window.addEventListener('keydown', (event) => { this.handleEvent(event); });
        window.addEventListener('keyup', (event) => { this.handleEvent(event); });
        window.addEventListener('mousedown', (event) => { this.handleEvent(event); });
        window.addEventListener('mouseup', (event) => { this.handleEvent(event); });
        window.addEventListener('mousemove', (event) => { this.handleEvent(event);});

        // Add gamepad connected event handlers.
        if ('GamepadEvent' in window) {
          window.addEventListener('gamepadconnected', (event) => { this.handleEvent(event);});
          window.addEventListener('gamepaddisconnected', (event) => { this.handleEvent(event);});
        } else if ('WebKitGamepadEvent' in window) {
          window.addEventListener('webkitgamepadconnected', (event) => { this.handleEvent(event);});
          window.addEventListener('webkitgamepaddisconnected', (event) => { this.handleEvent(event);});
        }
    }

    getEventType(type) {
      switch(type) {
        case "keydown":
          return InputType.BTN_PRESS;
        case "keyup":
          return InputType.BTN_RELEASE;
        case "mousemove":
          return InputType.MSE_MOVE;
        case "mousedown":
          return InputType.MSE_PRESS;
        case "mouseup":
          return InputType.MSE_RELEASE;
        default:
          return undefined;
      }
    }

    registerEvent(method, type, target, callback) {
      switch(method) {
        case InputMethod.INPUT_MOUSE:
          this.events.mouse[type] = {callback: callback};
          break;
        case InputMethod.INPUT_KEYBOARD:
          if (this.events.keyboard[type][target] == undefined) {
            this.events.keyboard[type][target] = {};
          }
          this.events.keyboard[type][target] = {callback: callback};
          break;
      }
    }

    registerKeyboardEvent(key, pressCallback = null, releaseCallback = null) {
      // Assign callback for press event if needed.
      if (pressCallback != null) {
        this.registerEvent(InputMethod.INPUT_KEYBOARD, InputType.BTN_PRESS, key, pressCallback);
      }

      // Assign callback for release event if needed.
      if (releaseCallback != null) {
        this.registerEvent(InputMethod.INPUT_KEYBOARD, InputType.BTN_RELEASE, key, releaseCallback);
      }
    }

    get hasGamepad() {
      return this.gamepad != -1;
    }

    gpAxis(axis) {
      if (!this.hasGamepad) return 0;
      return this.controllers[this.gamepad].axes[axis];
    }

    gpButton(button) {
      if (!this.hasGamepad) return false;
      return this.controllers[this.gamepad].buttons[button];
    }

    handleEvent(event) {
      if (event instanceof KeyboardEvent) {
        if (this.events.keyboard[this.getEventType(event.type)][event.code] != undefined) {
            this.events.keyboard[this.getEventType(event.type)][event.code].callback(event);
        }
      } else if (event instanceof MouseEvent) {
        var e = this.events.mouse[this.getEventType(event.type)];
        if(e !== undefined) {
          e.callback(event);
        }
      } else if (event instanceof GamepadEvent) {
        if (event.type == "gamepadconnected") {
          this.controllers[event.gamepad.index] = event.gamepad;
          this.gamepad = event.gamepad.index;
        } else {
          delete this.controllers[event.gamepad.index];
          this.gamepad = -1;
        }
        console.log(event);
      }
    }

    updateGamepads() {
      var gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          this.controllers[gamepads[i].index] = gamepads[i];
          this.gamepad = gamepads[i].index;
        }
      }
    }

    static get CID() { return ComponentID.COMPONENT_INPUT; };
};
