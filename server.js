const express = require("express");
const admin = require("firebase-admin");

const app = express();

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/", (req, res) => {
  return res.status(204).end();
});

app.get("/ping", (req, res) => {
  return res.status(204).end();
});

app.head("/ping", (req, res) => {
  return res.status(204).end();
});

app.get("/enviar", (req, res) => {
  res.status(200).type("text/plain").send("OK");

  setImmediate(async () => {
    try {
      await admin.messaging().send({
        notification: {
          title: "💰 PrestControl",
          body: "Revisa tus cobros de hoy",
        },
        topic: "todos",
      });

      console.log("Notificación enviada correctamente");
    } catch (error) {
      console.error("Error enviando notificación:", error);
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});