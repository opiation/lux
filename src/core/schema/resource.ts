import { z } from "zod";

export function reference<
  TypeName extends z.ZodTypeAny,
  Id extends z.ZodTypeAny,
>(resourceType: ResourceSchema<TypeName, Id>) {
  return z
    .string()
    .trim()
    .refine((value): value is `${z.infer<TypeName>}/${z.infer<Id>}` => {
      const [typeName, id] = value.split("/");
      return (
        resourceType.shape.typeName.safeParse(typeName).success &&
        resourceType.shape.id.safeParse(id).success
      );
    });
}

export function referenceTo<TypeName extends string, Id extends string>(
  res: Resource<TypeName, Id>
): `${TypeName}/${Id}` {
  return `${res.typeName}/${res.id}`;
}

export function resource<
  const TypeName extends string = string,
  IDType extends z.ZodTypeAny = z.ZodString,
>(typeName: TypeName, id: IDType) {
  return z
    .object({
      /**
       * A unique identifier within the scope of all resources of this type
       */
      id: id
        .readonly()
        .describe(
          `A unique identifier within the scope of all ${typeName} resources`
        ),

      /**
       * The string name of the type of resources this is.
       */
      typeName: z
        .literal(typeName)
        .readonly()
        .describe(
          `The name for this type of resource, in this case ${typeName}`
        ),
    })
    .passthrough();
}

export type ResourceSchema<
  TypeName extends z.ZodTypeAny = z.ZodTypeAny,
  ID extends z.ZodTypeAny = z.ZodTypeAny,
> = z.ZodObject<
  {
    id: z.ZodReadonly<ID>;
    typeName: z.ZodReadonly<TypeName>;
  },
  "passthrough",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>;

export interface Resource<
  TypeName extends string = string,
  ID extends string = string,
> {
  readonly id: ID;
  readonly typeName: TypeName;
}
