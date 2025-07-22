import React, { useState, useEffect } from 'react';
import { Plus, Upload, Car, FileText, CheckCircle, AlertCircle, User } from 'lucide-react';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', email: '', grade: '' });

  // Mock data - in real app, this would come from your MongoDB
  useEffect(() => {
    const mockStudents = [
      {
        id: 1,
        name: 'Sam Elasy',
        email: 'sam.elasy22@mba.edu',
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
        name: 'Reid Smith',
        email: 'reid.smith22@mba.edu',
        grade: '12',
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
        name: 'Mike Grant',
        email: 'mike.grant22@mba.edu',
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
        name: 'Nathan Williams',
        email: 'nathan.williams24@mba.edu',
        grade: '10',
        status: 'assigned',
        forms: {
          driverLicense: 'uploaded',
          insurance: 'uploaded',
          vehicleRegistration: 'uploaded',
          parentPermission: 'uploaded'
        },
        vehicleInfo: { make: 'Toyota', model: 'Camry', year: '2019', color: 'Red', plate: 'XYZ789' },
        parkingSpot: 'A15'
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
    // In real app, this would handle file upload
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
            <User size={16} className="text-gray-500" />
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
              <Car size={16} className="text-green-600" />
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
              <Car size={16} className="text-blue-600" />
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
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <AlertCircle size={16} className="text-orange-500" />
                  )}
                  <span className="text-sm">{getFormLabel(formKey)}</span>
                </div>
                {status !== 'uploaded' && (
                  <button
                    onClick={() => handleFileUpload(student.id, formKey)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 flex items-center gap-1"
                  >
                    <Upload size={12} />
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

  const columnTitles = {
    'not-started': 'Not Started',
    'in-progress': 'In Progress',
    'ready': 'Ready for Assignment',
    'assigned': 'Assigned'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Student Parking Management</h1>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Car size={16} />
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
                    <Plus size={14} />
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

export default Dashboard;
