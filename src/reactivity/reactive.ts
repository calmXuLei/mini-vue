import { mutableHandlers, readonlyHandlers } from "./baseHandler";


export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers)
}

// 使用函数封装，增强语义化
function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}