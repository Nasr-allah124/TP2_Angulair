const express = require('express');
const mongoose = require('mongoose');
const tasks = require('./routes/tasks');

const app = express();
const port = Number(process.env.PORT ?? 3000);
const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/tp2_todo';

app.use(express.json());
app.use('/tasks', tasks);
app.use((_req, res) => res.status(404).json({ message: 'Route introuvable.' }));
app.use((error, _req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Le corps JSON est invalide.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Le corps de la requête est trop volumineux.' });
  }
  console.error(error);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur.' });
});

async function start() {
  // Le serveur accepte des requêtes une fois MongoDB prêt.
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  const server = app.listen(port, '127.0.0.1', () => {
    console.log('API disponible sur http://127.0.0.1:' + server.address().port);
  });
  server.on('error', async error => {
    console.error('Impossible de démarrer le serveur.', error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
}

start().catch(error => {
  console.error('Impossible de se connecter à MongoDB.', error.message);
  process.exitCode = 1;
});
