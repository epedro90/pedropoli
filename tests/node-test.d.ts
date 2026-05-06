declare module 'node:assert/strict' {
  const assert: {
    deepEqual(actual: unknown, expected: unknown, message?: string): void
    equal(actual: unknown, expected: unknown, message?: string): void
  }

  export default assert
}
