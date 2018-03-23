var InputMethod = {
    INPUT_MOUSE: 0,
    INPUT_KEYBOARD: 1
}

var InputType = {
    BTN_PRESS: 0,
    BTN_RELEASE: 1
}

class InputComponent extends EntityComponent {
    constructor(owner) {
        super(ComponentID.COMPONENT_INPUT, owner);

        this.events = {mouse: {}, keyboard: {}};

        // Add event listeners.
        document.addEventListener('keydown', (event) => { this.handleEvent(event); });
        document.addEventListener('keyup', (event) => { this.handleEvent(event); });
        document.addEventListener('mousedown', (event) => { this.handleEvent(event); });
        document.addEventListener('mouseup', (event) => { this.handleEvent(event); });
    }

    getEventType(type) {
      switch(type) {
        case "keydown":
          return InputType.BTN_PRESS;
          break;
        case "keyup":
          return InputType.BTN_RELEASE;
          break;
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
          this.events.keyboard[target] = {type: type, callback: callback};
          break;
      }
    }

    handleEvent(event) {
      if (event instanceof KeyboardEvent) {
        if (this.events.keyboard[event.code] != undefined) {
          if (this.getEventType(event.type) == this.events.keyboard[event.code].type) {
            this.events.keyboard[event.code].callback(event);
          }
        }
      } else if (event instanceof MouseEvent) {

      }
    }

    static get CID() { return ComponentID.COMPONENT_INPUT; };
};
