<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@onehop/js](./js.md) &gt; [Container](./js.container.md)

## Container interface

<b>Signature:</b>

```typescript
interface Container 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [created\_at](./js.container.created_at.md) |  | [Timestamp](./js.timestamp.md) | The time this container was created |
|  [deployment\_id](./js.container.deployment_id.md) |  | [Id](./js.id.md)<!-- -->&lt;'deployment'&gt; | The ID of the deployment this container is associated with |
|  [id](./js.container.id.md) |  | [Id](./js.id.md)<!-- -->&lt;'container'&gt; | The ID of the container |
|  [internal\_ip](./js.container.internal_ip.md) |  | string | The internal IP of the container |
|  [metadata](./js.container.metadata.md) |  | { last\_exit\_code?: number; } | Information about the container |
|  [region](./js.container.region.md) |  | [Regions](./js.regions.md) | The region this container runs in |
|  [state](./js.container.state.md) |  | [ContainerState](./js.containerstate.md) | The state this container is in |
|  [type](./js.container.type.md) |  | [RuntimeType](./js.runtimetype.md) | The type of this container |
|  [uptime](./js.container.uptime.md) |  | { last\_start: [Timestamp](./js.timestamp.md)<!-- -->; } | Information about uptime/downtime for this container |
|  [volume](./js.container.volume.md) |  | [VolumeDefinition](./js.volumedefinition.md) \| null | The volume definition for this container |
