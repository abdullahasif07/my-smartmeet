import React, { useState, useEffect } from 'react';
import { Calendar } from '../../components/ui/calendar';
import '../../dashboard.css';


const App: React.FC = () => {
  const [name, setName] = useState('Loading...');

  useEffect(() => {
    fetch('/api/profile')
      .then((response) => response.json())
      .then((data) => setName(data.name))
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);

  return (
    <div className="flex-container">
      <div className="boxes-column">
        <div className="box small-box"></div>
        <div className="box small-box"></div>
      </div>
      <div className="box large-box">
        <div className="user-info">
          <h1>{name}</h1>
          <div className="buttons">
            <button>Settings</button>
            <button>Logout</button>
          </div>
        </div>
      </div>
      {/* Calendar component */}
      <div className="calendar-container">
        <Calendar />
      </div>
    </div>
  );
};

export default App;
