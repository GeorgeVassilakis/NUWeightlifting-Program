const { useState, useEffect } = React;

const WeightliftingProgram = () => {
  const [programType, setProgramType] = useState('rookies');
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('programs.json');
        const data = await response.json();
        setProgramData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching program data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading program...</div>
      </div>
    );
  }

  if (!programData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading program data</div>
      </div>
    );
  }

  const currentProgram = programData.programs[programType];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-700 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Northeastern University Weightlifting Club</h1>
          <p className="mt-2">Week of {programData.weekOf}</p>
          
          {/* Program Type Selection */}
          <div className="mt-4 flex gap-4">
            <button 
              className={`px-4 py-2 rounded transition-colors ${programType === 'rookies' ? 'bg-white text-red-700' : 'bg-red-600'}`}
              onClick={() => setProgramType('rookies')}
            >
              Rookies Program
            </button>
            <button 
              className={`px-4 py-2 rounded transition-colors ${programType === 'veterans' ? 'bg-white text-red-700' : 'bg-red-600'}`}
              onClick={() => setProgramType('veterans')}
            >
              Veterans Program
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Week Header */}
          <div className="border-b pb-4 mb-6">
            <div className="flex justify-between items-baseline">
              <h2 className="text-2xl font-bold">
                {currentProgram.weekNumber}
              </h2>
              <span className="text-gray-600 font-medium">
                {currentProgram.totalVolume}
              </span>
            </div>
          </div>

          {/* Notes Sections */}
          <div className="mb-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Coaches' Notes:</h3>
              <ul className="list-disc pl-6 space-y-1">
                {currentProgram.coachesNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Athlete Notes:</h3>
              <ul className="list-disc pl-6 space-y-1">
                {currentProgram.athleteNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Training Days */}
          <div className="space-y-8">
            {currentProgram.days.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-gray-50 rounded-lg p-6">
                <div className="flex justify-between items-baseline mb-4">
                  <h3 className="text-xl font-semibold text-red-700">{day.name}</h3>
                  <span className="text-gray-600">{day.volume}</span>
                </div>
                
                <div className="space-y-6">
                  {day.exercises.map((exercise, exIndex) => (
                    <div key={exIndex}>
                      <h4 className="font-bold mb-2">{exercise.name}</h4>
                      <div className="space-y-1">
                        {exercise.sets.map((set, setIndex) => (
                          <div 
                            key={setIndex} 
                            className={`${set.includes('rounds:') ? 'font-semibold mt-2' : 'ml-4'}`}
                          >
                            {set}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Change only the last line to:
window.addEventListener('load', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<WeightliftingProgram />);
});