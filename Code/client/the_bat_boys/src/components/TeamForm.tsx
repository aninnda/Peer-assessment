import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./TeamForm.css";
import axios from "axios";

interface FormData {
  team_name: string;
  selectedStudents: string[];
}

interface Team {
  team_name: string;
  members: string[];
}


const TeamForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ team_name: "", selectedStudents: [] });
  const [teams, setTeams] = useState<Team[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Team Name, Step 2: Select Students
  const [role, setRole] = useState<string | null>(null);
  const [students, setStudents] = useState<string[]>([]);

  // Fetch the user's role
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await axios.get("http://localhost:3000/session", { withCredentials: true });
        setRole(response.data.role);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
    fetchRole();
  }, []);
  
  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();
        const filteredData = data.filter((user: { role: string }) => user.role === 'student');
        setStudents(filteredData.map((user: { username: string }) => user.username)); 
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:3000/teams', { withCredentials: true });
            if (Array.isArray(response.data)) {
              setTeams(response.data);
            } else {
              setTeams([]);
            }
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };
    fetchTeams();
  }, []);

  const assignedStudents = teams.flatMap((team) => team.members);
  const availableStudents = students.filter(student => !assignedStudents.includes(student));
  
  const handleCreateTeam = async () => {
    try {
      await axios.post('http://localhost:3000/teams', {
        teamName:formData.team_name,
        selectedStudents: formData.selectedStudents,
      }, { withCredentials: true });

      // Refresh teams after creating a new team
      const response = await axios.get('http://localhost:3000/teams', { withCredentials: true });
        setTeams(response.data);
        setFormData({ team_name: "", selectedStudents: [] });
      } catch (error) {
        console.error('Error creating team:', error);
      } 
  };

  // Open or close the modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setStep(1);
    setFormData({ team_name: "", selectedStudents: [] });
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle student checkbox changes
  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      selectedStudents: checked
        ? [...prevData.selectedStudents, value]
        : prevData.selectedStudents.filter((student) => student !== value),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreateTeam();
    toggleModal();
  };

  // Go to the next step
  const nextStep = () => {
    if (step === 1 && formData.team_name) {
      setStep(2);
    }
  };

  const prevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };


  if (role !== 'instructor' && role !== 'student') {
    return (
      <div>
        <Navbar />
        You are not authorized to view this page.
      </div>
      )
    }

  if (role === 'student') {
    return (
      <div>
        <Navbar />
        <div className="team-list">
        <h2>Teams</h2>
        {teams && teams.length > 0 ? (
          teams.map((team, index) => (
            <div className="team-container" key={index}>
              <h3>{team.team_name}</h3>
              <ul>
                {team.members.map((member, idx) => (
                  <li key={idx}>{member}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No teams available.</p>
        )}
        </div>
      </div>
      
    );
  }

  if (role === 'instructor') {
    return (
      <div>
        <Navbar />
        <button onClick={toggleModal}>Create New Team</button>
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div>
                    <label>Team Name:</label>
                    <input
                      type="text"
                      name="team_name"
                      value={formData.team_name}
                      onChange={handleChange}
                      required
                    />
                    <button type="button" onClick={nextStep} disabled={!formData.team_name}>
                      Next
                    </button>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <label>Select Students:</label>
                    <div className="student-list">
                      {availableStudents.map((student, index) => (
                        <div className="student-item" key={index}>
                          <input
                            type="checkbox"
                            id={student}
                            value={student}
                            checked={formData.selectedStudents.includes(student)}
                            onChange={handleStudentChange}
                          />
                          <label htmlFor={student}>{student}</label>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={prevStep}>Back</button>
                    <button type="submit" disabled={formData.selectedStudents.length === 0}>
                      Create Team
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
        <div className="team-list">
          <h2>Teams</h2>
          {teams && teams.length > 0 ? (
            teams.map((team, index) => (
              <div className="team-container" key={index}>
                <h3>{team.team_name}</h3>
                <ul>
                  {team.members.map((member, idx) => (
                    <li key={idx}>{member}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No teams available.</p>
          )}
        </div>
      </div>
    );
  };
};

export default TeamForm;