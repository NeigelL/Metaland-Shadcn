type ControllerMap = Record<string, AbortController>

const controllerStore: ControllerMap = {}

export function getAbortController(key: string): AbortController {
    if (!controllerStore[key]) {
      controllerStore[key] = new AbortController();
    }
    return controllerStore[key];
  }
  
  export function abortAndResetController(key: string): AbortController {
    if (controllerStore[key]) {
      controllerStore[key]?.abort(); // abort current
    }
    controllerStore[key] = new AbortController(); // assign new one
    return controllerStore[key];
  }
  
  export function abortController(key: string) {
    if (controllerStore[key]) {
      controllerStore[key].abort();
      delete controllerStore[key];
    }
  }
  
  export function abortAllControllers() {
    Object.values(controllerStore).forEach((controller) => controller.abort());
    Object.keys(controllerStore).forEach((key) => delete controllerStore[key]);
  }