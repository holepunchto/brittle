export const ERR_CONFIGURE_FIRST: "configuration must happen prior to registering any tests";
export function ERR_PREMATURE_END({ count, planned, invertedTop }: {
    count: any;
    planned: any;
    invertedTop: any;
}): string;
export const ERR_TEARDOWN_AFTER_END: "teardown must be called before test ends";
export function ERR_ASSERT_AFTER_END({ description }: {
    description: any;
}): string;
export function ERR_COUNT_EXCEEDS_PLAN({ count, planned }: {
    count: any;
    planned: any;
}): string;
export function ERR_COUNT_EXCEEDS_PLAN_AFTER_END({ count, planned, description }: {
    count: any;
    planned: any;
    description: any;
}): string;
export function ERR_TIMEOUT({ ms }: {
    ms: any;
}): string;
export const ERR_PLAN_POSITIVE: "plan takes a positive whole number only";
export const ERR_ASYNC_ONLY: "test functions must be async";
export class TestError extends Error {
    constructor(code: any, state: any);
    code: any;
}
export class TestTypeError extends TypeError {
    constructor(code: any, state: any);
    code: any;
}
export class PrimitiveError extends Error {
    constructor(value: any);
    primitive: any;
}
