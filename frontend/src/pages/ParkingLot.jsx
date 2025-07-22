import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Car, X } from 'lucide-react';

const ParkingLot = () => {
  const [parkingSpots, setParkingSpots] = useState({});
  const [readyStudents, setReadyStudents] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    const spots = {};

    // Top edge - 12 spots (last 4 are handicapped)
    const topSpots = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'H1', 'H2', 'H3', 'H4'];
    topSpots.forEach((spot, index) => {
      spots[spot] = {
        occupied: false,
        student: null,
        handicapped: index >= 8 // Last 4 spots are handicapped
      };
    });

    // Left edge - 20 spots
    for (let i = 1; i <= 20; i++) {
      spots[`L${i}`] = { occupied: false, student: null };
    }

    // Right edge - 19 spots
    for (let i = 1; i <= 19; i++) {
      spots[`R${i}`] = { occupied: false, student: null };
    }

    // Bottom edge - 28 spots
    for (let i = 1; i <= 28; i++) {
      spots[`B${i}`] = { occupied: false, student: null };
    }

    // Main blocks - each block has 20 spots (2 rows of 10)
    const blocks = ['B', 'C', 'D', 'E', 'F', 'G'];
    blocks.forEach(blockPrefix => {
      for (let row = 1; row <= 2; row++) {
        for (let col = 1; col <= 10; col++) {
          const spotId = `${blockPrefix}${row}-${col}`;
          spots[spotId] = { occupied: false, student: null };
        }
      }
    });

    // Add one occupied spot for demo
    spots['B1-5'] = { occupied: true, student: 'Nathan Williams' };

    setParkingSpots(spots);

    // Mock ready students
    const mockReadyStudents = [
      {
        id: 3,
        name: 'Mike Grant',
        email: 'mike.grant22@mba.edu',
        grade: '12',
        vehicleInfo: { make: 'Honda', model: 'Civic', year: '2020', color: 'Blue', plate: 'ABC123' }
      },
      {
        id: 5,
        name: 'Ben McSween',
        email: 'ben.mcsween22@mba.edu',
        grade: '12',
        vehicleInfo: { make: 'Ford', model: 'Focus', year: '2021', color: 'White', plate: 'DEF456' }
      },
      {
        id: 6,
        name: 'Luke Keller',
        email: 'luke.keller24@mba.edu',
        grade: '10',
        vehicleInfo: { make: 'Nissan', model: 'Altima', year: '2019', color: 'Gray', plate: 'GHI789' }
      }
    ];
    setReadyStudents(mockReadyStudents);
  }, []);

  const handleSpotClick = (spotId) => {
    setSelectedSpot(spotId);
    if (parkingSpots[spotId].occupied) {
      // Show student info if spot is occupied
    } else {
      // Allow assignment if spot is free
      setShowAssignModal(true);
    }
  };

  const assignStudent = () => {
    if (selectedStudent && selectedSpot) {
      setParkingSpots(prev => ({
        ...prev,
        [selectedSpot]: { ...prev[selectedSpot], occupied: true, student: selectedStudent.name }
      }));
      setReadyStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      setShowAssignModal(false);
      setSelectedStudent(null);
      setSelectedSpot(null);
    }
  };

  const ParkingSpot = ({ spotId, spot, onClick }) => {
    const baseClasses = "w-8 h-6 border-2 cursor-pointer hover:opacity-80 transition-all text-xs flex items-center justify-center font-bold";
    let colorClasses;

    if (spot.handicapped) {
      colorClasses = spot.occupied ? "bg-red-500 border-red-600 text-white" : "bg-blue-500 border-blue-600 text-white";
    } else {
      colorClasses = spot.occupied ? "bg-red-500 border-red-600 text-white" : "bg-green-500 border-green-600 text-white";
    }

    const selectedClasses = selectedSpot === spotId ? "ring-4 ring-blue-300" : "";

    const displayText = spotId.includes('-') ? spotId.split('-')[1] : spotId.replace(/[A-Z]/g, '');

    return (
      <div
        className={`${baseClasses} ${colorClasses} ${selectedClasses} ${spot.handicapped ? 'relative' : ''}`}
        onClick={() => onClick(spotId)}
        title={spot.handicapped ? `Handicapped - ${spot.occupied ? `Occupied by ${spot.student}` : 'Available'}` : (spot.occupied ? `Occupied by ${spot.student}` : `Available - ${spotId}`)}
      >
        {spot.handicapped && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-lg font-bold">H</span>
          </div>
        )}
        {!spot.handicapped && displayText}
      </div>
    );
  };

  const ParkingBlock = ({ prefix, rows, cols }) => {
    const blockSpots = [];
    for (let row = 1; row <= rows; row++) {
      const rowSpots = [];
      for (let col = 1; col <= cols; col++) {
        const spotId = `${prefix}${row}-${col}`;
        rowSpots.push(
          <ParkingSpot
            key={spotId}
            spotId={spotId}
            spot={parkingSpots[spotId] || { occupied: false, student: null }}
            onClick={handleSpotClick}
          />
        );
      }
      blockSpots.push(
        <div key={`${prefix}-row-${row}`} className="flex gap-1">
          {rowSpots}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1 p-2 bg-gray-100 rounded">
        <div className="text-xs font-bold text-center text-gray-600 mb-1">Block {prefix}</div>
        {blockSpots}
      </div>
    );
  };

  const PerimeterSpots = ({ spots, direction }) => {
    const flexClass = direction === 'vertical' ? 'flex-col' : 'flex-row';
    return (
      <div className={`flex ${flexClass} gap-1`}>
        {spots.map(spotId => (
          <ParkingSpot
            key={spotId}
            spotId={spotId}
            spot={parkingSpots[spotId] || { occupied: false, student: null }}
            onClick={handleSpotClick}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white overflow-auto"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}>
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
                Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Parking Lot Layout</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 border border-green-600"></div>
                <span className="text-sm text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 border border-blue-600"></div>
                <span className="text-sm text-gray-600">Handicapped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 border border-red-600"></div>
                <span className="text-sm text-gray-600">Occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Parking Lot Layout */}
        <div className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-4">

              {/* Complete parking lot with perimeter */}
              <div className="flex flex-col items-center gap-2">

                {/* Top edge - 12 spots (last 4 handicapped) */}
                <div className="flex gap-1 mb-2  ml-9 self-start w-fit">
                  <PerimeterSpots
                    spots={['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'H1', 'H2', 'H3', 'H4']}
                    direction="horizontal"
                  />
                </div>

                {/* Main area with left edge, blocks, and right edge */}
                <div className="flex items-start gap-10">

                  {/* Left edge - 20 spots */}
                  <div className="flex flex-col gap-1">
                    <PerimeterSpots
                      spots={Array.from({length: 20}, (_, i) => `L${i+1}`)}
                      direction="vertical"
                    />
                  </div>

                  {/* Central blocks area */}
                  <div className="flex flex-col">
                    {/* First row: B and C blocks */}
                    <div className="flex gap-20 mb-10 mt-10 ml-5 mr-5">
                      <ParkingBlock prefix="B" rows={2} cols={10} />
                      <ParkingBlock prefix="C" rows={2} cols={10} />
                    </div>

                    {/* Second row: D and E blocks */}
                    <div className="flex gap-20 mb-15, mt-10 ml-5 mr-5">
                      <ParkingBlock prefix="D" rows={2} cols={10} />
                      <ParkingBlock prefix="E" rows={2} cols={10} />
                    </div>

                    {/* Third row: F and G blocks */}
                    <div className="flex gap-20 mt-20 ml-5 mr-5">
                      <ParkingBlock prefix="F" rows={2} cols={10} />
                      <ParkingBlock prefix="G" rows={2} cols={10} />
                    </div>
                  </div>

                  {/* Right edge - 19 spots */}
                  <div className="flex flex-col gap-1">
                    <PerimeterSpots
                      spots={Array.from({length: 19}, (_, i) => `R${i+1}`)}
                      direction="vertical"
                    />
                  </div>

                </div>

                {/* Bottom edge - 28 spots */}
                <div className="flex gap-1 mt-2">
                  <PerimeterSpots
                    spots={Array.from({length: 28}, (_, i) => `B${i+1}`)}
                    direction="horizontal"
                  />
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Ready Students Sidebar */}
        <div className="w-80 p-6 pl-0">
          <div className="bg-white rounded-lg shadow-sm border h-fit">
            <div className="p-4 border-b bg-green-50">
              <h2 className="text-lg font-semibold text-green-900">Ready for Assignment</h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {readyStudents.map(student => (
                <div
                  key={student.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedStudent?.id === student.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-gray-500" />
                    <h3 className="font-medium text-gray-900">{student.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{student.email}</p>
                  <p className="text-sm text-gray-600 mb-2">Grade: {student.grade}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Car size={14} />
                    <span>{student.vehicleInfo.year} {student.vehicleInfo.make} {student.vehicleInfo.model}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {student.vehicleInfo.color} | {student.vehicleInfo.plate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Assign Parking Spot</h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Assign parking spot <strong>{selectedSpot}</strong> to:
            </p>

            {selectedStudent ? (
              <div className="p-3 border border-blue-200 rounded-lg bg-blue-50 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-blue-600" />
                  <h4 className="font-medium text-blue-900">{selectedStudent.name}</h4>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Car size={14} />
                  <span>{selectedStudent.vehicleInfo.year} {selectedStudent.vehicleInfo.make} {selectedStudent.vehicleInfo.model}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  {selectedStudent.vehicleInfo.color} | {selectedStudent.vehicleInfo.plate}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 mb-4 italic">Please select a student from the sidebar first.</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={assignStudent}
                disabled={!selectedStudent}
                className={`flex-1 py-2 px-4 rounded font-medium ${
                  selectedStudent
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Assign Spot
              </button>
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-2 px-4 rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spot Info Modal */}
      {selectedSpot && parkingSpots[selectedSpot]?.occupied && !showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Parking Spot {selectedSpot}</h3>
              <button
                onClick={() => setSelectedSpot(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-3 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-red-600" />
                <h4 className="font-medium text-red-900">{parkingSpots[selectedSpot].student}</h4>
              </div>
              <p className="text-sm text-red-700">This spot is currently occupied.</p>
              {parkingSpots[selectedSpot]?.handicapped && (
                <p className="text-sm text-blue-700 mt-1">Handicapped accessible spot</p>
              )}
            </div>

            <button
              onClick={() => setSelectedSpot(null)}
              className="w-full mt-4 py-2 px-4 rounded font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingLot;
