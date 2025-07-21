import React, { useState } from 'react';

// Import your components (in real app, these would be separate files)
const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', grade: '' });

  // Mock data - in real app, this would come from your MongoDB
  React.useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@school.edu',
        grade: '12',
        status: 'not-started',
        forms: {
          driverLicense: null,
          insurance: null,
          vehicleRegistration: null,
          parentPermission: null
        },
        vehicleInfo: null,
        parkingSpot: null
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@school.edu',
        grade: '11',
        status: 'in-progress',
        forms: {
          driverLicense: 'uploaded',
          insurance: 'uploaded',
          vehicleRegistration: null,
          parentPermission: null
        },
        vehicleInfo: null,
        parkingSpot: null
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@school.edu',
        grade: '12',
        status: 'ready',
        forms: {
          driverLicense: 'uploaded',
          insurance: 'uploaded',
          vehicleRegistration: 'uploaded',
          parentPermission: 'uploaded'
        },
        vehicleInfo: { make: 'Honda', model: 'Civic', year: '2020', color: 'Blue', plate: 'ABC123' },
        parkingSpot: null
      },
      {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.williams@school.edu',
        grade: '11',
        status: 'assigned',
        forms: {
          driverLicense: 'uploaded',
          insurance: 'uploaded',
          vehicleRegistration: 'uploaded',
          parentPermission: 'uploaded'
        },
        vehicleInfo: { make: 'Toyota', model: 'Camry', year: '2019', color: 'Red', plate: 'XYZ789' },
        parkingSpot: 'A15'
      }
    ];
    setStudents(mockStudents);
  }, []);

  const addStudent = () => {
    if (newStudent.name && newStudent.email && newStudent.grade) {
      const student = {
        id: Date.now(),
        ...newStudent,
        status: 'not-started',
        forms: {
          driverLicense: null,
          insurance: null,
          vehicleRegistration: null,
          parentPermission: null
        },
        vehicleInfo: null,
        parkingSpot: null
      };
      setStudents([...students, student]);
      setNewStudent({ name: '', email: '', grade: '' });
      setShowAddStudent(false);
    }
  };

  const handleFileUpload = (studentId, formType) => {
    setStudents(students.map(student => {
      if (student.id === studentId) {
        const updatedForms = { ...student.forms, [formType]: 'uploaded' };
        const allFormsComplete = Object.values(updatedForms).every(form => form === 'uploaded');
        return {
          ...student,
          forms: updatedForms,
          status: allFormsComplete ? 'ready' : 'in-progress'
        };
      }
      return student;
    }));
  };

  const getFormLabel = (formKey) => {
    const labels = {
      driverLicense: "Driver's License",
      insurance: "Insurance Card",
      vehicleRegistration: "Vehicle Registration",
      parentPermission: "Parent Permission"
    };
    return labels[formKey];
  };

  const StudentCard = ({ student }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="font-medium text-gray-900">{student.name}</h3>
          </div>
          {student.status === 'in-progress' && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              {expanded ? 'Hide' : 'Show'} Details
            </button>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-2">{student.email}</p>
        <p className="text-sm text-gray-600 mb-3">Grade: {student.grade}</p>

        {student.status === 'assigned' && (
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
              </svg>
              <span className="font-medium text-green-800">Parking Spot: {student.parkingSpot}</span>
            </div>
            <div className="text-sm text-green-700">
              <p>{student.vehicleInfo.year} {student.vehicleInfo.make} {student.vehicleInfo.model}</p>
              <p>Color: {student.vehicleInfo.color} | Plate: {student.vehicleInfo.plate}</p>
            </div>
          </div>
        )}

        {student.status === 'ready' && student.vehicleInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
              </svg>
              <span className="font-medium text-blue-800">Vehicle Info</span>
            </div>
            <div className="text-sm text-blue-700">
              <p>{student.vehicleInfo.year} {student.vehicleInfo.make} {student.vehicleInfo.model}</p>
              <p>Color: {student.vehicleInfo.color} | Plate: {student.vehicleInfo.plate}</p>
            </div>
          </div>
        )}

        {(student.status === 'in-progress' && expanded) && (
          <div className="space-y-2">
            {Object.entries(student.forms).map(([formKey, status]) => (
              <div key={formKey} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center gap-2">
                  {status === 'uploaded' ? (
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                  <span className="text-sm">{getFormLabel(formKey)}</span>
                </div>
                {status !== 'uploaded' && (
                  <button
                    onClick={() => handleFileUpload(student.id, formKey)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Student Parking Management</h1>
            <button
              onClick={() => window.parkingApp.setCurrentPage('parking-lot')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
              </svg>
              View Parking Lot
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Not Started / In Progress Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Students Submitting Forms</h2>
                  <button
                    onClick={() => setShowAddStudent(true)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Student
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {showAddStudent && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-blue-900 mb-3">Add New Student</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Student Name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Grade"
                        value={newStudent.grade}
                        onChange={(e) => setNewStudent({...newStudent, grade: e.target.value})}
                        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={addStudent}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Add Student
                        </button>
                        <button
                          onClick={() => setShowAddStudent(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {students.filter(s => s.status === 'not-started' || s.status === 'in-progress').map(student => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            </div>
          </div>

          {/* Ready for Assignment Column */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-green-50">
                <h2 className="text-lg font-semibold text-green-900">Ready for Assignment</h2>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {students.filter(s => s.status === 'ready').map(student => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            </div>
          </div>

          {/* Assigned Column */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-blue-50">
                <h2 className="text-lg font-semibold text-blue-900">Assigned Spots</h2>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {students.filter(s => s.status === 'assigned').map(student => (
                  <StudentCard key={student.id} student={student} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ParkingLot = () => {
  const [parkingSpots, setParkingSpots] = useState({});
  const [readyStudents, setReadyStudents] = useState([]);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  React.useEffect(() => {
    const spots = {};

    const topSpots = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18'];
    topSpots.forEach(spot => {
      spots[spot] = { occupied: spot === 'A15', student: spot === 'A15' ? 'Sarah Williams' : null };
    });

    const blocks = [
      { prefix: 'B', rows: 3, cols: 8 },
      { prefix: 'C', rows: 3, cols: 8 },
      { prefix: 'D', rows: 3, cols: 8 },
      { prefix: 'E', rows: 3, cols: 8 },
      { prefix: 'F', rows: 3, cols: 8 },
      { prefix: 'G', rows: 3, cols: 8 }
    ];

    blocks.forEach(block => {
      for (let row = 1; row <= block.rows; row++) {
        for (let col = 1; col <= block.cols; col++) {
          const spotId = `${block.prefix}${row}-${col}`;
          spots[spotId] = { occupied: false, student: null };
        }
      }
    });

    const bottomSpots = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16'];
    bottomSpots.forEach(spot => {
      spots[spot] = { occupied: false, student: null };
    });

    setParkingSpots(spots);

    const mockReadyStudents = [
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@school.edu',
        grade: '12',
        vehicleInfo: { make: 'Honda', model: 'Civic', year: '2020', color: 'Blue', plate: 'ABC123' }
      },
      {
        id: 5,
        name: 'Emily Davis',
        email: 'emily.davis@school.edu',
        grade: '11',
        vehicleInfo: { make: 'Ford', model: 'Focus', year: '2021', color: 'White', plate: 'DEF456' }
      },
      {
        id: 6,
        name: 'Chris Wilson',
        email: 'chris.wilson@school.edu',
        grade: '12',
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
        [selectedSpot]: { occupied: true, student: selectedStudent.name }
      }));
      setReadyStudents(prev => prev.filter(s => s.id !== selectedStudent.id));
      setShowAssignModal(false);
      setSelectedStudent(null);
      setSelectedSpot(null);
    }
  };

  const ParkingSpot = ({ spotId, spot, onClick }) => {
    const baseClasses = "w-8 h-6 border-2 cursor-pointer hover:opacity-80 transition-all text-xs flex items-center justify-center font-bold";
    const colorClasses = spot.occupied ? "bg-red-500 border-red-600 text-white" : "bg-green-500 border-green-600 text-white";
    const selectedClasses = selectedSpot === spotId ? "ring-4 ring-blue-300" : "";

    return (
      <div
        className={`${baseClasses} ${colorClasses} ${selectedClasses}`}
        onClick={() => onClick(spotId)}
        title={spot.occupied ? `Occupied by ${spot.student}` : `Available - ${spotId}`}
      >
        {spotId.includes('-') ? spotId.split('-')[1] : spotId.slice(1)}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.parkingApp.setCurrentPage('dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
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
                <div className="w-4 h-4 bg-red-500 border border-red-600"></div>
                <span className="text-sm text-gray-600">Occupied</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        <div className="flex-1 p-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="flex gap-1">
                  {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A11', 'A12', 'A13', 'A14', 'A15', 'A16', 'A17', 'A18'].map(spotId => (
                    <ParkingSpot
                      key={spotId}
                      spotId={spotId}
                      spot={parkingSpots[spotId] || { occupied: false, student: null }}
                      onClick={handleSpotClick}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center gap-4">
                  <ParkingBlock prefix="B" rows={3} cols={8} />
                  <ParkingBlock prefix="C" rows={3} cols={8} />
                  <ParkingBlock prefix="D" rows={3} cols={8} />
                </div>
                <div className="flex justify-center gap-4">
                  <ParkingBlock prefix="E" rows={3} cols={8} />
                  <ParkingBlock prefix="F" rows={3} cols={8} />
                  <ParkingBlock prefix="G" rows={3} cols={8} />
                </div>
              </div>

              <div className="flex justify-center">
                <div className="flex gap-1">
                  {['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16'].map(spotId => (
                    <ParkingSpot
                      key={spotId}
                      spotId={spotId}
                      spot={parkingSpots[spotId] || { occupied: false, student: null }}
                      onClick={handleSpotClick}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 p-6 pl-0">
          <div className="bg-white rounded-lg shadow-sm border h-fit">
            <div className="p-4 border-b bg-green-50">
              <h2 className="text-lg font-semibold text-green-900">Ready for Assignment</h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {readyStudents.map(student => (
                <div
                  key={student.id}
