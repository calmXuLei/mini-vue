import { track, trigger } from "./effect";
import { ReactiveFlag } from "./reactive";

// 使用缓存，优化程序
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
  return function get(target, key) {

    if (key === ReactiveFlag.IS_READONLY) {
      return isReadonly;
    } else if (key === ReactiveFlag.IS_REACTIVE) {
      return !isReadonly;
    }

    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);

    trigger(target, key);
    return res;
  }
}

export const mutableHandlers = {
  get,
  set
}

export const readonlyHandlers = {
  get: readonlyGet,
  set: function(target, key, value) {
    console.warn(`key: ${ key } set 失败，因为 target 是 readonly`, target);
    return true;
  }
}