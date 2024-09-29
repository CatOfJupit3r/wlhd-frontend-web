// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
type MergeTypes<TypesArray extends any[], Res = {}> = TypesArray extends [infer Head, ...infer Rem]
    ? MergeTypes<Rem, Res & Head>
    : Res

export type OneOf<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TypesArray extends any[],
    Res = never,
    AllProperties = MergeTypes<TypesArray>,
> = TypesArray extends [infer Head, ...infer Rem]
    ? OneOf<Rem, Res | OnlyFirst<Head, AllProperties>, AllProperties>
    : Res

type OnlyFirst<F, S> = F & { [Key in keyof Omit<S, keyof F>]?: never }
