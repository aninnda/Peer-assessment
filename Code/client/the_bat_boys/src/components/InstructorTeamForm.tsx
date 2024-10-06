import React, {useState} from "react";
import "./InstTeamFormCSS.css";

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
      ); 
    
};

export default TeamForm;