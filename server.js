const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const DATA_FILE = path.join(__dirname, 'schedule.json');

app.use(cors());
app.use(express.json());

// שירות קבצי build של ריאקט
app.use(express.static(path.join(__dirname, 'client', 'build')));

// טען מערכת שעות
app.get('/api/schedule', (req, res) => {
  fs.readFile(DATA_FILE, 'utf8', (err, data) => {
    if (err) {
      // אם אין קובץ, החזר מערכת ריקה
      return res.json({ schedule: [] });
    }
    res.json({ schedule: JSON.parse(data) });
  });
});

// שמור מערכת שעות
app.post('/api/schedule', (req, res) => {
  const schedule = req.body.schedule;
  fs.writeFile(DATA_FILE, JSON.stringify(schedule, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'שמירה נכשלה' });
    }
    res.json({ success: true });
  });
});

// כל נתיב שאינו מתחיל ב-/api יחזיר את index.html של ריאקט
app.get(/^((?!\/api).)*$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
