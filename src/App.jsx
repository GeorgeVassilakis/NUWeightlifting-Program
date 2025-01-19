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
      {/* Header - Made sticky */}
      <header className="bg-red-700 text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">NU Weightlifting Club</h1>
          <p className="mt-1 text-sm md:text-base">Week of {programData.weekOf}</p>
          
          {/* Program Type Selection - Made more touch-friendly */}
          <div className="mt-3 flex gap-2 md:gap-4">
            <button 
              className={`flex-1 py-3 px-4 rounded-lg text-sm md:text-base transition-colors ${
                programType === 'rookies' ? 'bg-white text-red-700 font-bold' : 'bg-red-600'
              }`}
              onClick={() => setProgramType('rookies')}
            >
              Rookies Program
            </button>
            <button 
              className={`flex-1 py-3 px-4 rounded-lg text-sm md:text-base transition-colors ${
                programType === 'veterans' ? 'bg-white text-red-700 font-bold' : 'bg-red-600'
              }`}
              onClick={() => setProgramType('veterans')}
            >
              Veterans Program
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 md:px-4 py-4">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Week Header */}
          <div className="border-b p-4">
            <div className="flex justify-between items-baseline">
              <h2 className="text-xl md:text-2xl font-bold">
                {currentProgram.weekNumber}
              </h2>
              <span className="text-gray-600 font-medium text-sm md:text-base">
                {currentProgram.totalVolume}
              </span>
            </div>
          </div>

          {/* Notes Sections */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Coaches' Notes:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                {currentProgram.coachesNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-2">Athlete Notes:</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm md:text-base">
                {currentProgram.athleteNotes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Training Days */}
          <div className="space-y-4 p-4">
            {currentProgram.days.map((day, dayIndex) => (
              <div key={dayIndex} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-baseline mb-3 bg-gray-100 p-3 rounded-lg">
                  <h3 className="text-lg md:text-xl font-bold text-red-700">{day.name}</h3>
                  <span className="text-gray-600 text-sm">{day.volume}</span>
                </div>
                
                <div className="space-y-6">
                  {day.exercises.map((exercise, exIndex) => (
                    <div key={exIndex} className="border-b border-gray-200 pb-4 last:border-0">
                      <h4 className="font-bold text-base md:text-lg mb-2 text-gray-800">
                        {exercise.name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {exercise.sets.map((set, setIndex) => (
                          <div 
                            key={setIndex} 
                            className={`${
                              set.includes('rounds:') 
                                ? 'font-semibold col-span-2 md:col-span-3 bg-gray-100 p-2 rounded mt-2' 
                                : 'p-2 bg-white rounded shadow-sm'
                            } text-sm md:text-base`}
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

// Render the app
window.addEventListener('load', () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<WeightliftingProgram />);
});