const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 luego pondremos la clave aquí
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

app.get("/enviar", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("tokens").get();

    const tokens = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.token) {
        tokens.push(data.token);
      }
    });

    const message = {
      notification: {
        title: "💰 Cobro pendiente",
        body: "Tienes clientes que deben pagar hoy",
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    res.send(`Enviadas: ${response.successCount}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error");
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});