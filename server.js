const express = require("express");
const admin = require("firebase-admin");

const app = express();

// 🔐 Leer clave desde variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Ruta base (para probar que funciona)
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.get("/ping", (req, res) => {
  return res.status(204).end();
});

// Ruta para enviar notificación
app.get("/enviar", async (req, res) => {
  try {
    const message = {
      notification: {
        title: "💰 PrestControl",
        body: "Revisa tus cobros de hoy",
      },
      topic: "todos",
    };

    await admin.messaging().send(message);

    return res.status(204).end();
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
});

// ⚠️ IMPORTANTE: usar el puerto de Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});