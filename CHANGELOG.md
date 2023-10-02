# @onehop/js

## 1.38.0

### Minor Changes

- cfb6a43: Webhook permissions

## 1.37.2

### Patch Changes

- 9da7785: Fix event IDs

## 1.37.1

### Patch Changes

- 6d3d170: Removes unused/duplicated webhook events + sorts them in a consistent manner

## 1.37.0

### Minor Changes

- 0065422: Adds webhook ID to ID_PREFIXES

## 1.36.1

### Patch Changes

- 1c305d4: cast webhook's POSSIBLE_EVENTS to a const
- 08ba517: Remove unknown event

## 1.36.0

### Minor Changes

- 6bd39a0: Implement possible webhook events

## 1.35.0

### Minor Changes

- c9e568e: Allow user to fetch manifests and delete images with non-ptk authentication

## 1.34.0

### Minor Changes

- e75ae82: Add back "info" and "error" for backwards compatibility

## 1.33.0

### Minor Changes

- 6abb7ae: Changes Container log levels to be the correct value ("info" -> "stdout" "error" -> "stderr")

## 1.32.0

### Minor Changes

- fd32709: Adds dockerfile to BuildSettings interface

## 1.31.1

### Patch Changes

- 4dca717: Added support for unsubscribing a token from a channel

## 1.31.0

### Minor Changes

- 90d790e: - Export all SDK functions under `sdks` namespace

## 1.30.0

### Minor Changes

- e065176: Convert to ts 5, export more symbols, deprecate some others

### Patch Changes

- 4b6e668: Converted to .ts imports, added some byte helper fns (from hop-go)
- abb1326: Properly JSDoc all symbols

## 1.29.0

### Minor Changes

- 5d3df5b: Adds memory_usage_bytes to container's metrics object

## 1.28.1

### Patch Changes

- e2f461e: Add volume max size in bytes (500gb)

## 1.28.0

### Minor Changes

- b785f89: Adds type SelfUser for references to your authorized user. + adds missing types to that specified user (mfa_enabled, admin, webauthn, and totp)

## 1.27.1

### Patch Changes

- debaf7f: Add ignite zod schemas

## 1.27.0

### Minor Changes

- 2a88749: Adds created_at to health check

## 1.26.2

### Patch Changes

- f9985bf: allow partial metadata

## 1.26.1

### Patch Changes

- e118440: patch deployment metadata

## 1.26.0

### Minor Changes

- c82036c: add created_at and change started_at for build types

## 1.25.0

### Minor Changes

- 1530a06: Adds BuildState, DomainState, and BuildMethod to be exported

## 1.24.0

### Minor Changes

- 67d2aeb: Fixes cmd to be undefined or string array

## 1.23.0

### Minor Changes

- b7b1f90: Fix deployment config type

## 1.22.7

### Patch Changes

- 3eb75f5: validation_failure is nullable, but not optional
- 8238fa5: updates to build environment

## 1.22.6

### Patch Changes

- 1ca6d81: build validation fields
- b2d01d0: optional unit in preset form range type

## 1.22.5

### Patch Changes

- 9e7ccb4: export buildenv
- 9323685: fix type export

## 1.22.4

### Patch Changes

- 21fa991: add range input type to preset form schema

## 1.22.3

### Patch Changes

- bf4e706: Add API.Ignite.BuildEnvironment type

## 1.22.2

### Patch Changes

- 6c7c726: add optional description to preset form schema fields

## 1.22.1

### Patch Changes

- 43dff2b: Add max_length and validator to preset form schema input field

## 1.22.0

### Minor Changes

- 2e8a02b: PR changes from https://github.com/tomheaton (thank you!)

## 1.21.1

### Patch Changes

- 2dcd012: Added preset form schema (to ask questions before a preset is deployed, e.g. postgres username)

## 1.21.0

### Minor Changes

- 0d8804d: Add session ID to ID Prefixes

## 1.20.1

### Patch Changes

- 2a64d7b: Bump

## 1.20.0

### Minor Changes

- 527b63b: Fix build settings type

## 1.19.0

### Minor Changes

- 1e0145e: Add build_settings and build_cache_enabled to deployment

## 1.18.0

### Minor Changes

- 93fe56b: Add overrides to container object

## 1.17.0

### Minor Changes

- b74b4a8: Add .cmd to deployment config

## 1.16.0

### Minor Changes

- ad2859c: Add acknowledge boolean to rollout

## 1.15.0

### Minor Changes

- 3bfed18: Add domain redirect object

## 1.14.0

### Minor Changes

- 78427ad: Remove deployment.latest_build

## 1.13.4

### Patch Changes

- 646d66d: Added ProjectSecret#in_use_by

## 1.13.3

### Patch Changes

- 491ddfa: Deprecate Deployment.active\_{build,rollout}

## 1.13.2

### Patch Changes

- 485dc82: Bump dependencies

## 1.13.1

### Patch Changes

- 72816cf: Added missing domain routes

## 1.13.0

### Minor Changes

- 71cc8cf: Add tunnel deployment permission node, add read gateways permission to manage deployments group

## 1.12.1

### Patch Changes

- ba14e92: Fix rollout type for init_container_id

## 1.12.0

### Minor Changes

- 40b4d96: deprecation warning for active_rollout in favor for latest_rollout, new fields for rollout including init_container_id, health_check_failed, and last_updated_at.

## 1.11.1

### Patch Changes

- e82c25f: add mfa_enabled field to Project Member type

## 1.11.0

### Minor Changes

- af1fe38: Add permission node for ssh'ing into containers

## 1.10.6

### Patch Changes

- f73fa21: Made container_port_mappings type in DeploymentMetaData better with a more explicit key in the KV

## 1.10.5

### Patch Changes

- cc4a86c: Add volume to QuotaUsage and DefaultQuotas

## 1.10.4

### Patch Changes

- 1761ce6: Added support for hop.ignite.healthChecks.update

## 1.10.3

### Patch Changes

- f5c258a: Add metadata to deployment

## 1.10.2

### Patch Changes

- 7fd062e: chore(deps): update dependency tsx to v3.11.0

## 1.10.1

### Patch Changes

- 2c9faf5: Add hopsh_domain_enabled to gateway type

## 1.10.0

### Minor Changes

- b5837ae: Update API for creating a gateway
- 9a6c73e: Deprecate old ignite SDK properties

## 1.9.14

### Patch Changes

- 771fbeb: Added support for fetching deployment storage stats

## 1.9.13

### Patch Changes

- d8cd9b3: Force version bump

## 1.9.11

### Patch Changes

- 7882842: added container metrics

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
