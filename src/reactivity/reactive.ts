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

export function reactive(raw) {
  return new Proxy(raw, {
    get: createGetter(),
    set: createSetter()
  })

}

export function readonly(raw) {
  return new Proxy(raw, {
    get: createGetter(true),
    set(target, key, value) {
      // TODO: 报错 
      return true;
    }
  })
}