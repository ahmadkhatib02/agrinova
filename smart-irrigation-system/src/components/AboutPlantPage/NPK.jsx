import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDatabase, ref, get } from "firebase/database";

const NPK = ({ plant, idealConditions }) => {
  const [nitrogenData, setNitrogenData] = useState([]);
  const [phosphorusData, setPhosphorusData] = useState([]);
  const [potassiumData, setPotassiumData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState('nitrogen'); // Default active chart
  const [targetNPK, setTargetNPK] = useState({
    nitrogen: 10,
    phosphorus: 10,
    potassium: 10
  });

  // Set the target NPK values based on idealConditions
  useEffect(() => {
    if (idealConditions && idealConditions.metrics && idealConditions.metrics.nutrients) {
      const { nitrogen, phosphorus, potassium } = idealConditions.metrics.nutrients;
      setTargetNPK({
        nitrogen: nitrogen || 10,
        phosphorus: phosphorus || 10,
        potassium: potassium || 10
      });
    }
  }, [idealConditions]);

  // Fetch NPK data from Firebase
  useEffect(() => {
    const fetchNPKData = async () => {
      try {
        setLoading(true);
        const db = getDatabase();
        
        if (plant && plant.id) {
          // Try to fetch history data
          const npkRef = ref(db, `plants/${plant.id}/npkHistory`);
          
          const snapshot = await get(npkRef);
          if (snapshot.exists()) {
            const npkHistory = snapshot.val();
            
            // Process each nutrient's history
            processNutrientHistory(npkHistory, targetNPK);
          } else {
            // If no data exists, use sample data
            useSampleData(targetNPK);
          }
        } else {
          useSampleData(targetNPK);
        }
      } catch (err) {
        console.error("Error fetching NPK data:", err);
        setError("Failed to load NPK data. Please try again later.");
        useSampleData(targetNPK);
      } finally {
        setLoading(false);
      }
    };

    fetchNPKData();
  }, [plant, targetNPK]);

  // Process nutrient history from database
  const processNutrientHistory = (history, targets) => {
    // For each nutrient, format the data for the charts
    const nitrogenValues = Object.keys(history).map(date => ({
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      measured: history[date].nitrogen,
      target: targets.nitrogen
    }));
    
    const phosphorusValues = Object.keys(history).map(date => ({
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      measured: history[date].phosphorus,
      target: targets.phosphorus
    }));
    
    const potassiumValues = Object.keys(history).map(date => ({
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      measured: history[date].potassium,
      target: targets.potassium
    }));
    
    setNitrogenData(nitrogenValues);
    setPhosphorusData(phosphorusValues);
    setPotassiumData(potassiumValues);
  };

  // Use sample data when no history is available
  const useSampleData = (targets) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Generate sample data for each nutrient
    const nitrogenValues = days.map(day => ({
      day,
      measured: Math.floor(Math.random() * 5) + 5, // Random value between 5-10
      target: targets.nitrogen
    }));
    
    const phosphorusValues = days.map(day => ({
      day,
      measured: Math.floor(Math.random() * 6) + 3, // Random value between 3-9
      target: targets.phosphorus
    }));
    
    const potassiumValues = days.map(day => ({
      day,
      measured: Math.floor(Math.random() * 7) + 4, // Random value between 4-11
      target: targets.potassium
    }));
    
    // Set the data for each nutrient
    setNitrogenData(nitrogenValues);
    setPhosphorusData(phosphorusValues);
    setPotassiumData(potassiumValues);
  };

  // Custom tooltip for the charts
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

  // Render the current active chart
  const renderChart = () => {
    let chartData;
    let title;
    
    switch(activeChart) {
      case 'phosphorus':
        chartData = phosphorusData;
        title = 'Phosphorus (P)';
        break;
      case 'potassium':
        chartData = potassiumData;
        title = 'Potassium (K)';
        break;
      default: // nitrogen
        chartData = nitrogenData;
        title = 'Nitrogen (N)';
    }
    
    return (
      <>
        <h3 style={{ fontSize: '1rem', margin: '5px 0', textAlign: 'center' }}>{title}</h3>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart
            data={chartData}
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
              domain={[0, 20]} 
              label={{ value: '%', position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 10, fill: '#666' } }}
              axisLine={false}
              tickLine={false}
              fontSize={10}
              width={20}
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
      </>
    );
  };

  if (loading) return <div>Loading NPK data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="npk-graph-container" style={{ width: '100%', marginTop: 5, marginBottom: 40 }}>
      {/* Legend */}
      <div style={{ display: 'flex', marginBottom: 5, fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: 15 }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#00a86b', marginRight: 4 }}></div>
          <span>Measured</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 12, height: 12, backgroundColor: '#d9534f', marginRight: 4 }}></div>
          <span>Target</span>
        </div>
      </div>
      
      {/* NPK Navigation Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <button 
          onClick={() => setActiveChart('nitrogen')}
          style={{
            padding: '4px 8px',
            fontSize: '0.8rem',
            backgroundColor: activeChart === 'nitrogen' ? '#00a86b' : '#FEFEFE',
            color: activeChart === 'nitrogen' ? '#98D8C2' : '#666',
            border: '1px solid #D2D1D',
            borderRadius: '22px',
            marginRight: '5px',
            cursor: 'pointer',  

          }}
        >
          Nitrogen
        </button>
        <button 
          onClick={() => setActiveChart('phosphorus')}
          style={{
            padding: '4px 8px',
            fontSize: '0.8rem',
            backgroundColor: activeChart === 'phosphorus' ? '#00a86b' : '#FEFEFE',
            color: activeChart === 'phosphorus' ? '#98D8C2' : '#666',
            border: '1px solid #D2D1D',
            borderRadius: '22px',
            marginRight: '5px',
            cursor: 'pointer', 
          }}
        >
          Phosphorus
        </button>
        <button 
          onClick={() => setActiveChart('potassium')}
          style={{
            padding: '4px 8px',
            fontSize: '0.8rem',
            backgroundColor: activeChart === 'potassium' ? '#00a86b' : '#FEFEFE',
            color: activeChart === 'potassium' ? '#98D8C2' : '#666',
            border: '1px solid #D2D1D',
            borderRadius: '22px',
            marginRight: '5px',
            cursor: 'pointer', 
          }}
        >
          Potassium
        </button>
      </div>
      
      {/* Active Chart */}
      <div style={{ border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default NPK;