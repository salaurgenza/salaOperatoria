import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {
    pool
}

from "./db.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================== PAZIENTI ==================
app.post("/api/pazienti", async (req, res) => {
  try {
    const { nome, cognome, codice_sanitario, data_nascita } = req.body;
    const [result] = await pool.query(
      "INSERT INTO pazienti (nome, cognome, codice_sanitario, data_nascita) VALUES (?, ?, ?, ?)",
      [nome, cognome, codice_sanitario, data_nascita]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore inserimento paziente" });
  }
});

app.get("/api/pazienti", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM pazienti");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Errore recupero pazienti" });
  }
});

// ================== INTERVENTI ==================
app.post("/api/interventi", async (req, res) => {
  try {
    const { paziente_id, specialita, durata, sala, orario_inizio, orario_fine } = req.body;
    const [result] = await pool.query(
      "INSERT INTO interventi (paziente_id, specialita, durata, sala, orario_inizio, orario_fine) VALUES (?, ?, ?, ?, ?, ?)",
      [paziente_id, specialita, durata, sala, orario_inizio, orario_fine]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore inserimento intervento" });
  }
});

app.get("/api/interventi", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.*, p.nome, p.cognome, p.codice_sanitario, p.data_nascita 
       FROM interventi i 
       JOIN pazienti p ON i.paziente_id = p.id`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Errore recupero interventi" });
  }
});

// ================== EQUIPE ==================
app.post("/api/equipe", async (req, res) => {
  try {
    const { intervento_id, chirurgo, aiuto, anestesista, strumentista, circolante } = req.body;
    const [result] = await pool.query(
      "INSERT INTO equipe (intervento_id, chirurgo, aiuto, anestesista, strumentista, circolante) VALUES (?, ?, ?, ?, ?, ?)",
      [intervento_id, chirurgo, aiuto, anestesista, strumentista, circolante]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore inserimento equipe" });
  }
});

app.get("/api/equipe/:intervento_id", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM equipe WHERE intervento_id = ?",
      [req.params.intervento_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Errore recupero equipe" });
  }
});

// ================== AVVIO SERVER ==================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
