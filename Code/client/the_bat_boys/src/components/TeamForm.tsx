import React, {useState} from "react";
import Navbar from "./Navbar";
import "./TeamForm.css";

interface FormData {
    teamName: string;
    selectedStudents: string[];
}

const students = ["Student 1", "Student 2", "Student 3"];

const TeamForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ teamName: "", selectedStudents: [] });
    const [teams, setTeams] = useState<FormData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1); // Step 1: Team Name, Step 2: Select Students

    // Open or close the modal
    const toggleModal = () => {
      setIsModalOpen(!isModalOpen);
      setStep(1);
      setFormData({ teamName: "", selectedStudents: [] });
    }

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
                : prevData.selectedStudents.filter(student => student !== value)
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTeams([...teams, formData]);
        setFormData({ teamName: "", selectedStudents: [] }); // Reset form data
        toggleModal(); // Close modal
    };

    // Go to the next step
    const nextStep = () => {
        if (step === 1 && formData.teamName) {
          setStep(2);  
        }
    };

    const prevStep = () => {
        if (step === 2) {
          setStep(1);  
        }
      };

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
                                  <label>Team Name:</label><br />
                                  <input
                                      type="text"
                                      name="teamName"
                                      value={formData.teamName}
                                      onChange={handleChange}
                                      required
                                  />
                                  <br />
                                  <button type="button" onClick={nextStep} disabled={!formData.teamName}>
                                      Next
                                  </button>
                              </div>
                          )}

                          {/* Step 2: Student list with checkboxes */}
                          {step === 2 && (
                              <div>
                                  <label>Select Students:</label><br />
                                  {students.map((student, index) => (
                                      <div key={index}>
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
                                  <br />
                                  <button type="button" onClick={prevStep}>Back</button>
                                  <button type="submit">Create Team</button>
                              </div>
                          )}
                      </form>
                  </div>
              </div>
          )}

          {/* Dynamically show the created teams */}
          <div className="team-list">
              <h2>Teams</h2>
              {teams.map((team, index) => (
                  <div className="team-container" key={index}>
                      <h3>{team.teamName}</h3>
                      <ul>
                          {team.selectedStudents.map((student, idx) => (
                              <li key={idx}>{student}</li>
                          ))}
                      </ul>
                  </div>
              ))}
          </div>
      </div>
  );
};

export default TeamForm;