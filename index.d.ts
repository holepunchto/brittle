import { WriteStream } from "fs"

interface Comparator {
  <T>(actual: T, expected: T, message?: string): Promise<boolean>
  coercively: (actual: unknown, expected: unknown, message?: string) => Promise<boolean>
}

interface Exception {
  (fn: () => unknown | Promise<unknown>, message?: string): Promise<boolean>
  (promise: Promise<unknown>, message?: string): Promise<boolean>
  (fn: () => unknown | Promise<unknown>, expected: unknown, message?: string): Promise<boolean>
  (promise: Promise<unknown>, expected: unknown, message?: string): Promise<boolean>
  all: Exception;
}

interface Assertions {
  is: Comparator
  not: Comparator
  alike: Comparator
  unlike: Comparator
  ok(value: unknown, message?: string): Promise<boolean>
  absent(value: unknown, message?: string): Promise<boolean>
  pass(message?: string): Promise<boolean>
  fail(message?: string): Promise<boolean>
  exception: Exception;
  execution(fn: () => unknown | Promise<unknown>, message?: string): Promise<boolean>
  execution(promise: Promise<unknown>, message?: string): Promise<boolean>
  snapshot(actual: unknown, message?: string): Promise<boolean>
}

interface Utilities {
  plan(n: number, comment?: string): void
  teardown(fn: () => unknown | Promise<unknown>, options: TeardownOptions): void
  timeout(ms: number): void
  comment(message: string): void
  end(): Promise<Test>
}

export interface Metadata {
  index: number
  start: bigint
  description: string
  planned: number
  count: number
  passing: number
  failing: number
  error: Error | null
  time: number
  ended: boolean
}

export interface Test extends Promise<Metadata>, Assertions, Utilities, Metadata {
  test: TestFn
  skip: TestFn
  todo: TestFn
  solo: TestFn
  assert: Test
  configure(options: TestOptions): void
}

export interface TestFn extends Pick<Test, "test" | "skip" | "todo" | "solo" | "configure">{
  (description: string, fn: AssertFn): Promise<Metadata>
  (description: string, options: TestOptions, fn: AssertFn): Promise<Metadata>
  (description: string): Test
  (description: string, options: TestOptions): Test
}

export interface AssertFn {
  (assert: Test): unknown | Promise<unknown>
}


export interface TeardownOptions {
  /**
   * @default 0
   */
  order?: number
}

export interface TestOptions {
  /**
   * @default 30000
   */
  timeout?: number

  /**
   * @default 1
   */
  output?: WriteStream | number

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
   * @default 5
   */
  concurrency?: number | boolean

  /**
   * @default false
   */
  concurrent?:boolean

}

declare const main: TestFn

export default main
export const skip: typeof main.skip
export const todo: typeof main.todo
export const solo: typeof main.solo
export const configure: typeof main.configure
export const test: typeof main.test
