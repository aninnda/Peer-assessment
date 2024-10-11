import React, {useState} from "react";
import "./TeamForm.css";

interface FormData {
    teamName: string;
}

const TeamForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({teamName: ""});

    const changes = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
      };


    return (
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Please enter a name for the new team:</label><br/>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={changes}
                required
              />
            </div>
            <div>
              <br/>
            <button type="submit">Submit</button>
            </div>
          </form>
          <div className="fixed-side">
            <h2>Teams</h2>
            
            <div className="team-container">
              <h3>Team Alpha</h3>
              <ul>
              <li>Student 1</li>
              <li>Student 2</li>
              <li>Student 3</li>
              </ul>
            </div>
            <div className="team-container">
              <h3>Team Beta</h3>
              <ul>
              <li>Student A</li>
              <li>Student B</li>
              <li>Student C</li>
              </ul>
            </div>
            <div className="team-container">
              <h3>Team Gamma</h3>
              <ul>
              <li>Student X</li>
              <li>Student Y</li>
              <li>Student Z</li>
              </ul>
            </div>
          </div>
        </div>
        );
};

export default TeamForm;