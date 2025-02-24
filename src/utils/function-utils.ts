type Callback = (...args: any[]) => void;

interface DebounceAndThrottle {
  <T extends Callback>(callback: T, wait?: number): T & { flush: () => void; cancel: () => void };
}

export const debounce: DebounceAndThrottle = (callback, wait = 0) => {
  let debounceTimer: NodeJS.Timeout;
  let triggerArgs: any[];
  let triggerThis: any;

  function trigger(this: any, ...args: any[]) {
    triggerArgs = args;
    triggerThis = this;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      callback.apply(triggerThis, triggerArgs);
    }, wait);
  }

  trigger.cancel = () => clearTimeout(debounceTimer);
  trigger.flush = () => {
    clearTimeout(debounceTimer);
    callback.apply(triggerThis, triggerArgs);
  };

  return trigger as typeof callback & { flush: () => void; cancel: () => void };
};

export const throttle: DebounceAndThrottle = (callback, wait = 0) => {
  let throttleTimer: NodeJS.Timeout | null = null;
  let triggerArgs: any[];
  let triggerThis: any;

  function trigger(this: any, ...args: any[]) {
    triggerArgs = args;
    triggerThis = this;
    if (throttleTimer) return;
    throttleTimer = setTimeout(() => {
      callback.apply(triggerThis, triggerArgs);
      throttleTimer = null;
    }, wait);
  }

  trigger.cancel = () => {
    if (throttleTimer) clearTimeout(throttleTimer);
    throttleTimer = null;
  };
  
  trigger.flush = () => {
    if (throttleTimer) {
      clearTimeout(throttleTimer);
      callback.apply(triggerThis, triggerArgs);
      throttleTimer = null;
    }
  };

  return trigger as typeof callback & { flush: () => void; cancel: () => void };
};
