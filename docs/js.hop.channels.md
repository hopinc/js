<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@onehop/js](./js.md) &gt; [Hop](./js.hop.md) &gt; [channels](./js.hop.channels.md)

## Hop.channels property

<b>Signature:</b>

```typescript
readonly channels: {
        create<T extends State>(type: ChannelType, id?: string | null | undefined, options?: {
            state?: T | undefined;
        } | null | undefined, project?: `project_${string}` | undefined): Promise<Channel & {
            setState<T_1 extends State>(state: SetStateAction<T_1>): Promise<void>;
            patchState<T_2 extends State>(state: SetStateAction<T_2>): Promise<void>;
            subscribeToken(token: `leap_token_${string}`): Promise<void>;
            subscribeTokens(tokens: `leap_token_${string}`[] | Set<`leap_token_${string}`>): Promise<void>;
            publishMessage(name: string, data: unknown): Promise<void>;
        }>;
        get(id: string): Promise<Channel & {
            setState<T_1 extends State>(state: SetStateAction<T_1>): Promise<void>;
            patchState<T_2 extends State>(state: SetStateAction<T_2>): Promise<void>;
            subscribeToken(token: `leap_token_${string}`): Promise<void>;
            subscribeTokens(tokens: `leap_token_${string}`[] | Set<`leap_token_${string}`>): Promise<void>;
            publishMessage(name: string, data: unknown): Promise<void>;
        }>;
        getAll(project?: `project_${string}` | undefined): Promise<(Channel & {
            setState<T_1 extends State>(state: SetStateAction<T_1>): Promise<void>;
            patchState<T_2 extends State>(state: SetStateAction<T_2>): Promise<void>;
            subscribeToken(token: `leap_token_${string}`): Promise<void>;
            subscribeTokens(tokens: `leap_token_${string}`[] | Set<`leap_token_${string}`>): Promise<void>;
            publishMessage(name: string, data: unknown): Promise<void>;
        })[]>;
        subscribeToken(channel: string | Channel, token: `leap_token_${string}`): Promise<void>;
        subscribeTokens(channel: string | Channel, tokens: `leap_token_${string}`[] | Set<`leap_token_${string}`>): Promise<void>;
        getAllTokens(channel: string | Channel): Promise<ChannelToken[]>;
        setState<T_3 extends State = State>(channel: string | Channel, state: SetStateAction<T_3>): Promise<void>;
        patchState<T_4 extends State>(channel: string | Channel, state: SetStateAction<T_4>): Promise<void>;
        publishMessage<T_5>(channel: string | Channel, event: string, data: T_5): Promise<void>;
        delete(id: string): Promise<void>;
        getStats(id: string): Promise<{
            online_count: number;
        }>;
        tokens: {
            delete(token: `leap_token_${string}`): Promise<void>;
            create(state?: State, project?: `project_${string}` | undefined): Promise<ChannelToken>;
            setState(id: `leap_token_${string}`, state: State): Promise<ChannelToken>;
            get(id: `leap_token_${string}`): Promise<ChannelToken>;
            isOnline(idOrToken: `leap_token_${string}` | ChannelToken): Promise<boolean>;
            publishDirectMessage<T_6>(token: `leap_token_${string}`, event: string, data: T_6): Promise<void>;
        };
    };
```