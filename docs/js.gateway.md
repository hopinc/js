<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@onehop/js](./js.md) &gt; [Gateway](./js.gateway.md)

## Gateway interface

Gateways are used to connect services to the internet or a private network

<b>Signature:</b>

```typescript
interface Gateway 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [created\_at](./js.gateway.created_at.md) |  | [Timestamp](./js.timestamp.md) | The date this gateway was created |
|  [deployment\_id](./js.gateway.deployment_id.md) |  | [Id](./js.id.md)<!-- -->&lt;'deployment'&gt; | The deployment this gateway is associated with |
|  [domains](./js.gateway.domains.md) |  | [Domain](./js.domain.md)<!-- -->\[\] | Domains associated with this gateway |
|  [hopsh\_domain](./js.gateway.hopsh_domain.md) |  | [HopShDomain](./js.hopshdomain.md) \| null | Domain automatically assigned by Hop |
|  [id](./js.gateway.id.md) |  | [Id](./js.id.md)<!-- -->&lt;'gateway'&gt; | The ID of the gateway |
|  [internal\_domain](./js.gateway.internal_domain.md) |  | [InternalHopDomain](./js.internalhopdomain.md) \| null | Internal domain assigned by user upon gateway creation |
|  [name](./js.gateway.name.md) |  | string | The name of the gateway |
|  [target\_port](./js.gateway.target_port.md) |  | number \| null | Port the Gateway targets (Only for external gateways) |
|  [type](./js.gateway.type.md) |  | [GatewayType](./js.gatewaytype.md) | The type of the gateway |
