
import './App.css';
import { useEffect, useState } from 'react';


const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];
const HOURS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
];

function App() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/schedule')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.schedule)) {
          setSchedule(data.schedule.length ? data.schedule : Array(HOURS.length).fill().map(() => Array(DAYS.length).fill('')));
        } else {
          setSchedule(Array(HOURS.length).fill().map(() => Array(DAYS.length).fill('')));
        }
        setLoading(false);
      })
      .catch(() => {
        setSchedule(Array(HOURS.length).fill().map(() => Array(DAYS.length).fill('')));
        setLoading(false);
      });
  }, []);

  const handleChange = (rowIdx, colIdx, value) => {
    const newSchedule = schedule.map((row, r) =>
      row.map((cell, c) => (r === rowIdx && c === colIdx ? value : cell))
    );
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    setSaving(true);
    setError('');
    fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schedule })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) setError('שמירה נכשלה');
        setSaving(false);
      })
      .catch(() => {
        setError('שמירה נכשלה');
        setSaving(false);
      });
  };

  return (
  <div className="App" style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
  <h2>מערכת שעות</h2>
      {loading ? <div>טוען...</div> : (
  <table border="1" cellPadding="6" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr>
              <th>שעה + יום</th>
              {[...DAYS].reverse().map(day => <th key={day}>{day}</th>)}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour, rowIdx) => (
              <tr key={hour}>
                <td>{hour}</td>
                {[...DAYS].reverse().map((day, colIdx) => {
                  // הערך של יום ראשון הוא הראשון במערך
                  return (
                    <td key={day}>
                      <input
                        type="text"
                        value={schedule[rowIdx]?.[colIdx] || ''}
                        onChange={e => handleChange(rowIdx, colIdx, e.target.value)}
                        style={{ width: '100%' }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleSave} disabled={saving} style={{ marginTop: 16 }}>
        {saving ? 'שומר...' : 'שמירה'}
      </button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}

export default App;
