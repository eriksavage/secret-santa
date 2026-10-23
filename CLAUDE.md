# Project guidelines

## Naming

Prefer explicit function names that show the intent of the function over short,
generic ones. For example, `buildEligibleReceivers` rather than `buildEligible`,
and `findValidAssignment` rather than `assign`.

Define each function in its own top-level block; don't nest function
declarations inside other functions. Pass shared state as parameters instead.
