import { isReadonly, readonly } from "../reactive";

describe('readonly', () => {
  it('happy path', () => {
    // no set
    const original = {
      foo: 1,
      bar: {
        baz: 2
      }
    };
    const wrapped = readonly(original);

    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  });

  it('warn then call set', () => {
    const user = readonly({
      age: 10
    })

    console.warn = jest.fn();
    user.age = 11

    expect(console.warn).toHaveBeenCalled();
  })
});



