import { useState, useEffect } from 'react'

const WeightliftingProgram = () => {
  const [programType, setProgramType] = useState('rookies');
  const [programData, setProgramData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [availableWeeks, setAvailableWeeks] = useState([]);
  const [selectedDay, setSelectedDay] = useState(0);
  
  // Load maxes from localStorage if they exist
  const [maxes, setMaxes] = useState(() => {
    const savedMaxes = localStorage.getItem('liftMaxes');
    return savedMaxes ? JSON.parse(savedMaxes) : {
      snatch: '',
      cleanAndJerk: '',
      backSquat: '',
      frontSquat: ''
    };
  });

  // Save maxes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('liftMaxes', JSON.stringify(maxes));
  }, [maxes]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/NUWeightlifting-Program/programs.json');
        const data = await response.json();
        setProgramData(data);
        const weeks = Object.keys(data.weeks).sort((a, b) => b.localeCompare(a));
        setAvailableWeeks(weeks);
        setSelectedWeek(weeks[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching program data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to extract percentage from set string
  const extractPercentage = (set) => {
    const number = set.match(/^(\d+)/);
    return number ? parseInt(number[1]) : null;
  };

  // Helper function to calculate weight based on percentage and max
  const calculateWeight = (percentage, max) => {
    if (!max || !percentage) return null;
    return Math.round((percentage / 100) * max);
  };

  // Helper function to determine which max to use for an exercise
  const getRelevantMax = (exerciseName) => {
    const name = exerciseName.toLowerCase();
    if (name.includes('snatch')) return maxes.snatch;
    if (name.includes('clean') || name.includes('jerk') || name.includes('c&j') || name.includes('pc+pj')) return maxes.cleanAndJerk;
    if (name.includes('front squat')) return maxes.frontSquat;
    if (name.includes('back squat')) return maxes.backSquat;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading program...</div>
      </div>
    );
  }

  if (!programData || !selectedWeek) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error loading program data</div>
      </div>
    );
  }

  const currentProgram = programData.weeks[selectedWeek].programs[programType];
  const weekMeta = programData.weeks[selectedWeek].meta;
  const currentDay = currentProgram.days[selectedDay];

  const renderExercise = (exercise) => {
    const relevantMax = getRelevantMax(exercise.name);
    const showPercentages = ['snatch', 'clean', 'jerk', 'squat', 'c&j', 'pc+pj'].some(term => 
      exercise.name.toLowerCase().includes(term)
    );

    return (
      <div className="border-b border-gray-200 pb-4 last:border-0">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-base md:text-lg text-gray-800">
            {exercise.name}
          </h4>
          {showPercentages && (
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Max:</label>
              <input
                type="number"
                className="w-20 px-2 py-1 border rounded"
                placeholder="kg"
                value={relevantMax}
                onChange={(e) => {
                  const newMaxes = { ...maxes };
                  if (exercise.name.toLowerCase().includes('snatch')) {
                    newMaxes.snatch = e.target.value;
                  } else if (exercise.name.toLowerCase().includes('clean') || 
                           exercise.name.toLowerCase().includes('jerk') ||
                           exercise.name.toLowerCase().includes('c&j') ||
                           exercise.name.toLowerCase().includes('pc+pj')) {
                    newMaxes.cleanAndJerk = e.target.value;
                  } else if (exercise.name.toLowerCase().includes('front squat')) {
                    newMaxes.frontSquat = e.target.value;
                  } else if (exercise.name.toLowerCase().includes('back squat')) {
                    newMaxes.backSquat = e.target.value;
                  }
                  setMaxes(newMaxes);
                }}
              />
              <span className="text-sm text-gray-600">kg</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {exercise.sets.map((set, setIndex) => {
            const percentage = extractPercentage(set);
            const weight = calculateWeight(percentage, relevantMax);
            
            return (
              <div 
                key={setIndex} 
                className={`${
                  set.includes('rounds:') 
                    ? 'font-semibold col-span-2 md:col-span-3 bg-gray-100 p-2 rounded mt-2' 
                    : 'p-2 bg-white rounded shadow-sm'
                } text-sm md:text-base`}
              >
                <div className="flex justify-between items-center">
                  <span>{set}</span>
                  {weight && (
                    <span className="text-gray-600 ml-2">
                      {weight}kg
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-red-700 text-white py-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">NU Weightlifting Club</h1>
          
          <div className="mt-2">
            <select 
              value={selectedWeek}
              onChange={(e) => {
                const newSelectedWeek = e.target.value;
                // Check if we need to adjust the selected day for the new week
                if (programData) {
                  const newWeekProgram = programData.weeks[newSelectedWeek].programs[programType];
                  // If current selected day doesn't exist in new week's program, use the last day
                  if (selectedDay >= newWeekProgram.days.length) {
                    setSelectedDay(newWeekProgram.days.length - 1);
                  }
                }
                setSelectedWeek(newSelectedWeek);
              }}
              className="bg-red-600 text-white py-2 px-3 rounded-lg text-sm md:text-base w-full max-w-xs"
            >
              {availableWeeks.map((week) => (
                <option key={week} value={week}>
                  Week of {programData.weeks[week].meta.weekOf}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-2">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="bg-red-600 text-white py-2 px-3 rounded-lg text-sm md:text-base w-full max-w-xs"
            >
              {currentProgram.days.map((day, index) => (
                <option key={index} value={index}>
                  {day.name} - {day.volume}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mt-3 flex gap-2 md:gap-4">
            <button 
              className={`flex-1 py-3 px-4 rounded-lg text-sm md:text-base transition-colors ${
                programType === 'rookies' ? 'bg-white text-red-700 font-bold' : 'bg-red-600'
              }`}
              onClick={() => {
                // Check if we need to adjust the selected day
                if (programType !== 'rookies' && programData && selectedWeek) {
                  const rookiesProgram = programData.weeks[selectedWeek].programs.rookies;
                  // If current selected day doesn't exist in rookies program, use the last day
                  if (selectedDay >= rookiesProgram.days.length) {
                    setSelectedDay(rookiesProgram.days.length - 1);
                  }
                }
                setProgramType('rookies');
              }}
            >
              Rookies Program
            </button>
            <button 
              className={`flex-1 py-3 px-4 rounded-lg text-sm md:text-base transition-colors ${
                programType === 'veterans' ? 'bg-white text-red-700 font-bold' : 'bg-red-600'
              }`}
              onClick={() => {
                // Check if we need to adjust the selected day
                if (programType !== 'veterans' && programData && selectedWeek) {
                  const veteransProgram = programData.weeks[selectedWeek].programs.veterans;
                  // If current selected day doesn't exist in veterans program, use the last day
                  if (selectedDay >= veteransProgram.days.length) {
                    setSelectedDay(veteransProgram.days.length - 1);
                  }
                }
                setProgramType('veterans');
              }}
            >
              Veterans Program
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-2 md:px-4 py-4">
        <div className="bg-white rounded-lg shadow-lg">
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

          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-baseline mb-3 bg-gray-100 p-3 rounded-lg">
                <h3 className="text-lg md:text-xl font-bold text-red-700">{currentDay.name}</h3>
                <span className="text-gray-600 text-sm">{currentDay.volume}</span>
              </div>
              
              <div className="space-y-6">
                {currentDay.exercises.map((exercise, exIndex) => (
                  <div key={exIndex}>
                    {renderExercise(exercise)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeightliftingProgram