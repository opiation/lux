import OpenIdConnectProvider from "oidc-provider";

import { ServerConfig } from "./server-config.js";

/**
 * Start the OIDC server.
 *
 * @param {ServerConfig} [config]
 */
function main(config) {
  config = config
    ? { ...ServerConfig.defaults(), ...config }
    : ServerConfig.defaults();

  const oidc = new OpenIdConnectProvider(`http://localhost:${config.port}`, {
    // ... configuration
    clientBasedCORS(_ctx, origin) {
      return origin.includes("localhost");
    },
    clients: [
      {
        client_id: "lux-frontend",
        client_secret: "asdf",
        application_type: "web",
        redirect_uris: ["http://localhost:5173/"],
        token_endpoint_auth_method: "none",
      },
    ],
    async findAccount(_ctx, sub, _token) {
      return {
        accountId: sub,
        async claims(use, scope) {
          console.log(`findAccount claims: ${use} ${scope}`);
          return {
            sub,
            email: "asdf@example.com",
          };
        },
      };
    },
    ttl: {
      AccessToken: 60 * 60, // 1 hour in seconds
      AuthorizationCode: 10 * 60, // 10 minutes in seconds
      BackchannelAuthenticationRequest: 60, // 1 minute in seconds
      ClientCredentials: 60 * 60, // 1 hour in seconds
      DeviceCode: 10 * 60, // 10 minutes in seconds
      Grant: 60 * 60, // 1 hour in seconds
      IdToken: 60 * 60, // 1 hour in seconds
      Interaction: 10 * 60, // 10 minutes in seconds
      RefreshToken: 60 * 60 * 24 * 30, // 30 days in seconds
      Session: 60 * 60, // 1 hour in seconds
    },
  });

  oidc.listen(config.port, () => {
    console.log(`Server listening on at https://localhost:${config.port} 🚀`);
  });
}

main();
