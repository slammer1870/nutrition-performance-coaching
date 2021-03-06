const stripe = require("stripe")(process.env.STRIPE_SK);
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async (req, res) => {
  const { checkout_session } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(checkout_session);
    if (session) {

      const message = {
        from: "hello@sammcnally.dev",
        to: "hello@sammcnally.dev",
        subject: `New checkout initiated from ${session.customer_email}`,
        text: `${session.customer_email} has just confimered their payment `,
        replyTo: session.customer_email,
      };
      await sgMail.send(message);
      
    }

    return res.status(201).json(session);
  } catch (error) {
    const message = {
        from: "hello@sammcnally.dev",
        to: "hello@sammcnally.dev",
        subject: `Confrimation falied`,
        text: `Payment confimaiton failed ${error.message}`,
        replyTo: "hello@sammcnally.dev",
      };
      await sgMail.send(message);
    return res.status(500).json({
      error: error.message,
    });
  }
};
