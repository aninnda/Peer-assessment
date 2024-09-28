import ListGroup from "./components/ListGroup";
import Navbar from "./components/Navbar";
import TeamForm from "./components/InstructorTeamForm"


const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <TeamForm />    
    </div>
  );
}

export default App;