const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3000;
const dataFilePath = 'ingredients.json';

app.use(bodyParser.json());
app.use(cors());
if (!fs.existsSync(dataFilePath)) {
    try {
      fs.writeFileSync(dataFilePath, '[]');
      console.log('Plik ingredients.json został utworzony');
    } catch (error) {
      console.error('Błąd tworzenia pliku ingredients.json:', error);
    }
  }
// Endpoint do dodawania nowych składników
app.post('/ingredients', (req, res) => {
  const { name, kcal, protein, fat, carbohydrates } = req.body;

  // Wczytaj istniejące składniki z pliku JSON
  let ingredients = [];
  try {
    const data = fs.readFileSync(dataFilePath);
    ingredients = JSON.parse(data);
  } catch (error) {
    console.error('Błąd odczytu pliku JSON:', error);
    return res.status(500).json({ error: 'Błąd serwera' });
  }

  // Dodaj nowy składnik
  const newIngredient = { name, kcal, protein, fat, carbohydrates };
  ingredients.push(newIngredient);

  // Zapisz zaktualizowane dane w pliku JSON
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(ingredients));
    res.status(201).json({ message: 'Składnik został dodany' });
  } catch (error) {
    console.error('Błąd zapisu do pliku JSON:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Endpoint do pobierania wszystkich składników
app.get('/ingredients', (req, res) => {
  // Wczytaj składniki z pliku JSON
  let ingredients = [];
  try {
    const data = fs.readFileSync(dataFilePath);
    ingredients = JSON.parse(data);
    res.json(ingredients);
  } catch (error) {
    console.error('Błąd odczytu pliku JSON:', error);
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

// Uruchomienie serwera
app.listen(PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});
