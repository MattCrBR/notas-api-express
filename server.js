const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const FILE = 'data.json';

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

function readNotes() {
  try {
    const data = fs.readFileSync(FILE);
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(FILE, JSON.stringify(notes, null, 2));
}

// GET - lista notas
app.get('/notas', (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// GET - busca nota por id
app.get('/notas/:id', (req, res) => {
  const notes = readNotes();
  const note = notes.find(n => n.id == req.params.id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: 'Nota não encontrada' });
  }
});

// POST - cria nota
app.post('/notas', (req, res) => {
  const notes = readNotes();
  const newNote = {
    id: Date.now().toString(),
    title: req.body.title,
    content: req.body.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  notes.unshift(newNote);
  saveNotes(notes);
  res.json(newNote);
});

// PUT - edita nota
app.put('/notas/:id', (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex(n => n.id == req.params.id);
  if (index >= 0) {
    notes[index].title = req.body.title;
    notes[index].content = req.body.content;
    notes[index].updatedAt = new Date().toISOString();
    saveNotes(notes);
    res.json(notes[index]);
  } else {
    res.status(404).json({ error: 'Nota não encontrada' });
  }
});

// DELETE - exclui nota
app.delete('/notas/:id', (req, res) => {
  const notes = readNotes();
  const novasNotas = notes.filter(n => n.id !== req.params.id);
  saveNotes(novasNotas);
  res.json({ mensagem: 'Nota removida' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});