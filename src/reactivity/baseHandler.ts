import { track, trigger } from "./effect";

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  }
}

// 程序结构的相对性
function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);

    trigger(target, key);
    return res;
  }
}

export const mutableHandlers = {
  get: createGetter(),
  set: createSetter()
}

export const readonlyHandlers = {
  get: createGetter(true),
  set: function(target, key, value) {
    return true;
  }
}