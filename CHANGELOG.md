# @onehop/js

## 1.9.10

### Patch Changes

- 1c0ad0b: Add target container count to deployment type

## 1.9.9

### Patch Changes

- 9ca2fc1: Add entrypoint to deployment config

## 1.9.8

### Patch Changes

- a148382: fix types

## 1.9.7

### Patch Changes

- 8f8c907: Fix RolloutState enum

## 1.9.6

### Patch Changes

- 1fd1c1c: Add build state to Build type

## 1.9.5

### Patch Changes

- 0295c80: update build type

## 1.9.4

### Patch Changes

- 4919c95: Added build to rollout object for if the rollout was triggered by a build

## 1.9.3

### Patch Changes

- 4fb4b76: dep bump

## 1.9.2

### Patch Changes

- fe85c73: fix importing @onehop/js in Node in ESM environments (conditional exports)

## 1.9.1

### Patch Changes

- 202868e: Added type `DeploymentRollout` and `DeploymentBuild` to types. Added `active_build` and `active_rollout` to deployment type

## 1.9.0

### Minor Changes

- d10ca23: Add rollout ID to ID prefixes

## 1.8.3

### Patch Changes

- 38f7c55: add patching deployments

## 1.8.2

### Patch Changes

- a8a82bd: Added volume config to creating a deployment

## 1.8.1

### Patch Changes

- c53642c: Added stateful RuntimeType

## 1.8.0

### Minor Changes

- cd3d4c2: Updated container log level type (deprecating `stderr` in favor for `error`)

## 1.7.0

### Minor Changes

- dcd458c: Make await import('https') only run on node using conditional export

## 1.6.5

### Patch Changes

- 5a892c2: Rename hop-js to js (changed on GitHub)

## 1.6.4

### Patch Changes

- 9fee236: Added jsdoc to container metadata

## 1.6.3

### Patch Changes

- 8923323: bump to 1.6.1

## 1.1.0

### Minor Changes

- 93a72b7: Export zod utils using esm exports in package.json
- 5aff9ed: Added container.metadata.last_exit_code
- 8cffa3f: Added .restart_policy enum to DeploymentConfig

### Patch Changes

- e224d8f: Fix getting a deployment by name

## 1.4.1

### Patch Changes

- b13ce04: Getting a by name changed signature
