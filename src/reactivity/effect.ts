import { extend } from "../shared";

class ReactiveEffect {
  private fn;
  onStop?: () => void;
  deps = [];
  active = true;
  constructor(fn, public scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    return this.fn();
  }

  stop() {
    // 添加 active 做性能优化
    if (this.active) {
      // 清空 deps 中的effect
      cleanupEffect(this);
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });
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
  if (!activeEffect) return;
  // 反向收集 deps
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

let activeEffect;
export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  // _effect.onStop = options.onStop;
  extend(_effect, options);

  _effect.run();

  // 需要 bind this
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
  runner.effect.onStop && runner.effect.onStop();
}
