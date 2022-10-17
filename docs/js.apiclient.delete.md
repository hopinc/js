<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@onehop/js](./js.md) &gt; [APIClient](./js.apiclient.md) &gt; [delete](./js.apiclient.delete.md)

## APIClient.delete() method

<b>Signature:</b>

```typescript
delete<Path extends Extract<Endpoints, {
        method: 'DELETE';
    }>['path']>(path: Path, body: Extract<Endpoints, {
        path: Path;
        method: 'DELETE';
    }>['body'], query: Query<Path>, init?: RequestInit): Promise<(Extract<Endpoint<"DELETE", "/v1/users/@me/pats/:pat_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/projects/:project_id/tokens/:project_token_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/projects/@this/tokens/:project_token_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/projects/:project_id/secrets/:secret_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/projects/@this/secrets/:secret_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/channels/:channel_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/channels/tokens/:token", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/registry/images/:image", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/ignite/deployments/:deployment_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/ignite/containers/:container_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }> | Extract<Endpoint<"DELETE", "/v1/pipe/rooms/:room_id", void, undefined>, {
        path: Path;
        method: 'DELETE';
    }>)["res"]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  path | Path |  |
|  body | Extract&lt;[Endpoints](./js.endpoints.md)<!-- -->, { path: Path; method: 'DELETE'; }&gt;\['body'\] |  |
|  query | [Query](./js.query.md)<!-- -->&lt;Path&gt; |  |
|  init | RequestInit | <i>(Optional)</i> |

<b>Returns:</b>

Promise&lt;(Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/users/@me/pats/:pat\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/projects/:project\_id/tokens/:project\_token\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/projects/@this/tokens/:project\_token\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/projects/:project\_id/secrets/:secret\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/projects/@this/secrets/:secret\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/channels/:channel\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/channels/tokens/:token", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/registry/images/:image", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/ignite/deployments/:deployment\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/ignite/containers/:container\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt; \| Extract&lt;[Endpoint](./js.endpoint.md)<!-- -->&lt;"DELETE", "/v1/pipe/rooms/:room\_id", void, undefined&gt;, { path: Path; method: 'DELETE'; }&gt;)\["res"\]&gt;
