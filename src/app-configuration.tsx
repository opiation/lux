import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  FormEvent,
  ReactNode,
  createContext,
  useCallback,
  useState,
} from "react";
import { z } from "zod";

let schema = z.object({
  /**
   * The address of the server that we should connect to.
   */
  serverURL: z
    .string()
    .trim()
    .url()
    .describe("The address of the server that we should connect to"),
});

export interface AppConfiguration extends z.infer<typeof schema> {}

const localDevelopment = Object.freeze({
  serverURL: "http://localhost:3000",
} as const satisfies AppConfiguration);

const zod = schema.default(localDevelopment);

const Context = createContext<AppConfiguration>(localDevelopment);
Context.displayName = "AppConfiguration";

type ProviderProps = {
  children?: ReactNode | ((config: AppConfiguration) => ReactNode);
  value?:
    | AppConfiguration
    | ((defaultConfig: AppConfiguration) => Promise<AppConfiguration>);
};

function ProviderWithManualFallback(props: ProviderProps) {
  const [manualConfiguration, setManualConfiguration] =
    useState<AppConfiguration>();

  const configuration = useQuery({
    enabled: typeof props.value === "function" && !manualConfiguration,
    queryFn() {
      if (typeof props.value !== "function")
        throw "Configuration must be a function";

      return props.value(AppConfiguration.default());
    },
    queryKey: ["configuration", props.value, !!manualConfiguration],
  });

  if (typeof props.value !== "function") {
    const config =
      manualConfiguration ?? props.value ?? AppConfiguration.default();
    return (
      <Context.Provider value={config}>
        {typeof props.children === "function"
          ? props.children(config)
          : props.children}
      </Context.Provider>
    );
  }

  switch (configuration.status) {
    case "error":
      return (
        <>
          <Text>
            Error fetching app configuration: {configuration.error.message}
          </Text>
          <Text>Use the following form to enter an alternative:</Text>
          <AppConfiguration.Form onSubmit={setManualConfiguration} />
        </>
      );

    case "pending":
      return (
        <Stack>
          <Spinner />
          <Text>Loading application configuration...</Text>
        </Stack>
      );

    case "success":
      return (
        <Context.Provider value={configuration.data}>
          {typeof props.children === "function"
            ? props.children(manualConfiguration ?? configuration.data)
            : props.children}
        </Context.Provider>
      );
  }
}

export const AppConfiguration = {
  Context,
  Form,
  Provider: Context.Provider,
  ProviderWithManualFallback,
  create(
    partialConfig?:
      | Partial<AppConfiguration>
      | ((defaultConfig: AppConfiguration) => AppConfiguration),
  ): AppConfiguration {
    if (typeof partialConfig === "function") {
      return partialConfig(AppConfiguration.default());
    } else {
      return {
        ...AppConfiguration.default(),
        ...partialConfig,
      };
    }
  },
  default() {
    return localDevelopment;
  },
  parse: zod.safeParse,
  expect: zod.parse,
};

type FormProps = {
  onSubmit?(config: AppConfiguration): void;
};

function Form(props: FormProps) {
  const submitConfiguration = useCallback(
    (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      const formData = new FormData(evt.currentTarget);

      const configValidation = AppConfiguration.parse({
        serverURL: formData.get("serverURL"),
      });

      if (configValidation.success) {
        return props.onSubmit?.(configValidation.data);
      } else {
        console.warn(
          `Submitted configuration was invalid: `,
          configValidation.error,
        );
      }

      if (typeof props.onSubmit !== "function") {
        console.warn(
          `Nothing to do with submitted configuration. Consider providing an onSubmit handler`,
        );
      }
    },
    [props.onSubmit],
  );

  return (
    <form onSubmit={submitConfiguration}>
      <FormControl>
        <FormLabel>Server URL</FormLabel>
        <Input
          name="serverURL"
          placeholder="https://my-server.example.com"
          type="url"
        />
        {schema.shape.serverURL.description && (
          <FormHelperText>{schema.shape.serverURL.description}</FormHelperText>
        )}
      </FormControl>
    </form>
  );
}
