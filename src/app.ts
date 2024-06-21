import express from "express";
import { envs } from "./config/envs";
import { StripeControlador } from "./presentation/stripe/controlador";

const stripe = require("stripe")(
  "sk_test_51MeSToEoE6drrHBc7vwpqW9fY1SsaW3DvDbYszAgGz8OBCzm2jqrFyLPahT0Fy2esYmKsOxZcj0ik6wtCwBGsUxt00HcuzPbD7"
);

(() => {
  main();
})();

function main() {
  const app = express();
  const controladorStripe = new StripeControlador();

  app.post(
    "/prueba/stripe",
    express.raw({ type: "application/json" }),
    controladorStripe.webhookHandler
  );
  app.listen(envs.PORT, () => {
    console.log(`Listening on port ${envs.PORT}`);
  });
}
