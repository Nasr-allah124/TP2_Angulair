const express = require('express');
const mongoose = require('mongoose');
const Task = require('../models/task');

const router = express.Router();

router.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: 'Identifiant de tâche invalide.' });
  }
  next();
});

// Accepte le titre, la description et le statut lors d'une mise à jour.
function validateTask(req, res, next) {
  const { title, description, completed } = req.body ?? {};
  if ((req.method === 'POST' || title !== undefined) &&
      (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ message: 'Le titre est obligatoire.' });
  }
  if (description !== undefined && typeof description !== 'string') {
    return res.status(400).json({ message: 'La description doit être un texte.' });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ message: 'Le statut doit être un booléen.' });
  }
  if (title === undefined && description === undefined && completed === undefined) {
    return res.status(400).json({ message: 'Indiquez un titre, une description ou un statut.' });
  }
  res.locals.task = {
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description.trim() }),
    ...(completed !== undefined && { completed })
  };
  next();
}

router.get('/', async (_req, res) => {
  res.json(await Task.find().sort({ _id: 1 }));
});

router.post('/', validateTask, async (_req, res) => {
  res.status(201).json(await Task.create(res.locals.task));
});

router.put('/:id', validateTask, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, { $set: res.locals.task }, {
    returnDocument: 'after',
    runValidators: true
  });
  if (!task) return res.status(404).json({ message: 'Tâche introuvable.' });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Tâche introuvable.' });
  res.sendStatus(204);
});

module.exports = router;
