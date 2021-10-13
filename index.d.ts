import { WriteStream } from "fs"

declare interface Assertions {
  is<T>(actual: T, expected: T, message?: string): Promise<boolean>
  not<T>(actual: T, expected: T, message?: string): Promise<boolean>
  alike<T>(actual: T, expected: T, message?: string): Promise<boolean>
  unlike<T>(actual: T, expected: T, message?: string): Promise<boolean>
  ok(value: unknown, message?: string): Promise<boolean>
  absent(value: unknown, message?: string): Promise<boolean>
  pass(message?: string): Promise<boolean>
  fail(message?: string): Promise<boolean>
  exception(fn: () => unknown | Promise<unknown>, message?: string): Promise<boolean>
  exception(promise: Promise<unknown>, message?: string): Promise<boolean>
  exception(fn: () => unknown | Promise<unknown>, expected: unknown, message?: string): Promise<boolean>
  exception(promise: Promise<unknown>, expected: unknown, message?: string): Promise<boolean>
  execution(fn: () => unknown | Promise<unknown>, message?: string): Promise<boolean>
  execution(promise: Promise<unknown>, message?: string): Promise<boolean>
  snapshot(actual: unknown, message?: string): Promise<boolean>
}

declare interface Utilities {
  plan(n: number, comment?: string): void
  teardown(fn: () => unknown | Promise<unknown>): void
  timeout(ms: number): void
  comment(message: string): void
  end(): Promise<Test>
}

declare interface Metadata {
  start: bigint
  description: string
  planned: number
  count: number
  error: Error | null
  ended: boolean
}

declare interface Test extends Promise<Metadata>, Assertions, Utilities, Metadata {
  test: TestFn
  skip: TestFn
  todo: TestFn
  configure(options: TestOptions): void
}

declare interface TestFn {
  (description: string, fn?: (assert: Test) => Promise<unknown>): Test
  (description: string, options: TestOptions, fn?: (assert: Test) => Promise<unknown>): Test
}

declare interface TestOptions {
  /**
   * @default 30000
   */
  timeout?: number

  /**
   * @default process.stderr
   */
  output?: WriteStream

  /**
   * @default false
   */
  skip?: boolean

  /**
   * @default false
   */
  todo?: boolean

  /**
   * @default false
   */
  bail?: boolean

  /**
   * @default undefined
   */
  concurrency?: number

  /**
   * @default false
   */
  serial?: boolean
}

declare const main: Test

export default main.test
export const skip: typeof main.skip
export const todo: typeof main.todo
export const configure: typeof main.configure
export const test: typeof main.test
