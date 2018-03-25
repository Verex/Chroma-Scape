var InputMethod = {
    INPUT_MOUSE: 0,
    INPUT_KEYBOARD: 1
}

var InputType = {
    BTN_PRESS: 0,
    BTN_RELEASE: 1,
    MSE_MOVE: 2
}

class InputComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_INPUT, owner);

        this.events = {mouse: {}, keyboard: {}};

        // Create keyboard press groups.
        this.events.keyboard[InputType.BTN_PRESS] = {};
        this.events.keyboard[InputType.BTN_RELEASE] = {};

        // Add event listeners.
        document.addEventListener('keydown', (event) => { this.handleEvent(event); });
        document.addEventListener('keyup', (event) => { this.handleEvent(event); });
        document.addEventListener('mousedown', (event) => { this.handleEvent(event); });
        document.addEventListener('mouseup', (event) => { this.handleEvent(event); });
        document.addEventListener('mousemove', (event) => { this.handleEvent(event);});
    }

    getEventType(type) {
      switch(type) {
        case "keydown":
          return InputType.BTN_PRESS;
        case "keyup":
          return InputType.BTN_RELEASE;
        case "mousemove":
          return InputType.MSE_MOVE;
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
      }
    }

    static get CID() { return ComponentID.COMPONENT_INPUT; };
};
