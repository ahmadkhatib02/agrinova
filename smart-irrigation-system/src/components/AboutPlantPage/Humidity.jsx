import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDatabase, ref, get } from "firebase/database";

const Humidity = ({ plant, idealConditions }) => {
  const [humidityData, setHumidityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetHumidity, setTargetHumidity] = useState(50); // Default target humidity

  // Set the target humidity based on idealConditions
  useEffect(() => {
    if (idealConditions && idealConditions.metrics && idealConditions.metrics.humidity) {
      setTargetHumidity(idealConditions.metrics.humidity);
    }
  }, [idealConditions]);

  // Fetch humidity data from Firebase
  useEffect(() => {
    const fetchHumidityData = async () => {
      try {
        setLoading(true);
        const db = getDatabase();
        
        if (plant && plant.id) {
          // Adjust the path based on your database structure
          const humidityRef = ref(db, `plants/${plant.id}/humidityHistory`);
          
          const snapshot = await get(humidityRef);
          if (snapshot.exists()) {
            const humidityHistory = snapshot.val();
            
            // Convert to array format for Recharts and use the ideal target humidity
            const formattedData = Object.keys(humidityHistory).map(date => ({
              day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
              measured: humidityHistory[date].measured,
              target: targetHumidity // Use the ideal target humidity
            }));
            
            setHumidityData(formattedData);
          } else {
            // If no data exists, use some sample data with the ideal target humidity
            setHumidityData(getSampleData(targetHumidity));
          }
        } else {
          setHumidityData(getSampleData(targetHumidity));
        }
      } catch (err) {
        console.error("Error fetching humidity data:", err);
        setError("Failed to load humidity data. Please try again later.");
        setHumidityData(getSampleData(targetHumidity));
      } finally {
        setLoading(false);
      }
    };

    fetchHumidityData();
  }, [plant, targetHumidity]);

  // Sample data function that uses the target humidity
  const getSampleData = (target) => {
    return [
      { day: 'Mon', measured: 42, target: target },
      { day: 'Tue', measured: 55, target: target },
      { day: 'Wed', measured: 48, target: target },
      { day: 'Thu', measured: 60, target: target },
      { day: 'Fri', measured: 52, target: target },
      { day: 'Sat', measured: 45, target: target },
      { day: 'Sun', measured: 50, target: target }
    ];
  };

  // Custom tooltip to style the hovering information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '8px', 
          borderRadius: '4px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0',
          fontSize: '0.8rem'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
          <p style={{ 
            margin: 0, 
            color: '#00a86b' 
          }}>
            measured : {payload[0].value}%
          </p>
          <p style={{ 
            margin: 0, 
            color: '#d9534f' 
          }}>
            target : {payload[1].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div>Loading humidity data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="humidity-graph-container" style={{ width: '100%', height: 200, marginTop: 5, marginBottom: 40 }}>
      
      <div style={{ display: 'flex', marginBottom: 5, fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 15 }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#00a86b', marginRight: 4 }}></div>
          <span>Measured Humidity</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#d9534f', marginRight: 4 }}></div>
          <span>Target Humidity</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={humidityData}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
          <XAxis 
            dataKey="day" 
            axisLine={true}
            tickLine={false}
            fontSize={10}
            tick={{ fill: '#666' }}
          />
          <YAxis 
            domain={[0, 100]}
            label={{ value: 'Humidity %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10, fill: '#666' } }}
            axisLine={false}
            tickLine={false}
            fontSize={10}
            width={30}
            tick={{ fill: '#666' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="measured" 
            stroke="#00a86b" 
            strokeWidth={2}
            dot={{ r: 4, fill: "#00a86b", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#00a86b", stroke: "#fff" }}
            isAnimationActive={true}
          />
          <Line 
            type="monotone" 
            dataKey="target" 
            stroke="#d9534f" 
            strokeWidth={1.5}
            dot={false}
            strokeDasharray="5 5"
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Humidity;