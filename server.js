const express = require("express");
const admin = require("firebase-admin");

const app = express();

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Respuesta limpia para probar servidor
app.get("/", (req, res) => {
  return res
    .status(200)
    .type("text/plain")
    .send("OK");
});

// Ruta limpia para mantener Render despierto
app.get("/ping", (req, res) => {
  return res
    .status(200)
    .type("text/plain")
    .send("OK");
});

// Ruta para cron-job: responde rápido y luego manda notificación
app.get("/enviar", (req, res) => {
  res
    .status(200)
    .type("text/plain")
    .send("OK");

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