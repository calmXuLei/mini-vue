class ReactiveEffect {
  private fn;

  constructor(fn) {
    this.fn = fn;
  }

  run () {
    activeEffect = this;
    return this.fn();
  }
}

const targetMap = new Map();
export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }
  dep.add(activeEffect);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    effect.run();
  }
}

let activeEffect;
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);

  _effect.run();

  // 需要 bind this
  return _effect.run.bind(_effect);
}