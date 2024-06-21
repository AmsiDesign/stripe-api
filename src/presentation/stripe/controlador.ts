import { Request, Response, response } from "express";
import { request } from "http";
import { prisma } from "../../config/prisma";

const stripe = require("stripe")(
  "sk_test_51MeSToEoE6drrHBc7vwpqW9fY1SsaW3DvDbYszAgGz8OBCzm2jqrFyLPahT0Fy2esYmKsOxZcj0ik6wtCwBGsUxt00HcuzPbD7"
);

const express = require("express");

export class StripeControlador {
  constructor() {}

  webhookHandler = (req: Request, res: Response) => {
    const endpointSecret = "whsec_mUMSALmtLCf5BNx4aIsCBScLAzFeVhxO";
    const sig = req.headers["stripe-signature"];
    const payload = req.body;
    let evento;

    try {
      evento = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
      response.status(400).send(`Webhook Error: No conectado`);
      return;
    }

    switch (evento.type) {
      case "customer.created":
        const emailStripe = evento.data.object.email;
        const userIdP = evento.data.object.id;
        //Escribir en la base de datos

        const usuario = prisma.usuario.update({
          where: { email: emailStripe },
          data: { stripeID: userIdP },
        });
        if (!usuario) throw "El usuario no existe";
        break;

      case "customer.subscription.created":
        const userId = evento.data.object.customer;
        const status = evento.data.object.plan.active;

        console.log(status);
        // Escribir en la base de datos
        const subs = prisma.usuario.update({
          where: { id: userId },
          data: { statusSubs: status },
        });

        break;
    }

    res.json({ message: "webhook ha sido recibido con exito" });
  };
}
