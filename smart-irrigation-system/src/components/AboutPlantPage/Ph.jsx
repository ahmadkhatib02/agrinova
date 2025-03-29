import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDatabase, ref, get } from "firebase/database";

const Ph = ({ plant, idealConditions }) => {
  const [phData, setPhData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetPh, setTargetPh] = useState(4); // Default target pH

  // Set the target pH based on idealConditions
  useEffect(() => {
    if (idealConditions && idealConditions.metrics && idealConditions.metrics.pHLevel) {
      setTargetPh(idealConditions.metrics.pHLevel);
    }
  }, [idealConditions]);

  // Fetch pH data from Firebase
  useEffect(() => {
    const fetchPhData = async () => {
      try {
        setLoading(true);
        const db = getDatabase();
        
        if (plant && plant.id) {
          // Adjust the path based on your database structure
          const phRef = ref(db, `plants/${plant.id}/phHistory`);
          
          const snapshot = await get(phRef);
          if (snapshot.exists()) {
            const phHistory = snapshot.val();
            
            // Convert to array format for Recharts and use the ideal target pH
            const formattedData = Object.keys(phHistory).map(date => ({
              day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
              measured: phHistory[date].measured,
              target: targetPh // Use the ideal target pH
            }));
            
            setPhData(formattedData);
          } else {
            // If no data exists, use some sample data with the ideal target pH
            setPhData(getSampleData(targetPh));
          }
        } else {
          setPhData(getSampleData(targetPh));
        }
      } catch (err) {
        console.error("Error fetching pH data:", err);
        setError("Failed to load pH data. Please try again later.");
        setPhData(getSampleData(targetPh));
      } finally {
        setLoading(false);
      }
    };

    fetchPhData();
  }, [plant, targetPh]);

  // Sample data function that uses the target pH
  const getSampleData = (target) => {
    return [
      { day: 'Mon', measured: 2, target: target },
      { day: 'Tue', measured: 5.5, target: target },
      { day: 'Wed', measured: 2, target: target },
      { day: 'Thu', measured: 8.5, target: target },
      { day: 'Fri', measured: 1.5, target: target },
      { day: 'Sat', measured: 1.5, target: target },
      { day: 'Sun', measured: 1.5, target: target }
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
            measured : {payload[0].value}
          </p>
          <p style={{ 
            margin: 0, 
            color: '#d9534f' 
          }}>
            target : {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <div>Loading pH data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="ph-graph-container" style={{ width: '100%', height: 200, marginTop: 5, marginBottom: 40 }}>
      
      <div style={{ display: 'flex', marginBottom: 5, fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 15 }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#00a86b', marginRight: 4 }}></div>
          <span>Measured pH</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#d9534f', marginRight: 4 }}></div>
          <span>Target pH</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={phData}
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
            domain={[0, 14]}
            label={{ value: 'pH Level', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10, fill: '#666' } }}
            axisLine={false}
            tickLine={false}
            fontSize={10}
            width={25}
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

export default Ph;