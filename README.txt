Project description: 
For university team projects, a Peer Assessment System is intended to let students
assess their teammates' performance and contributions using four main criteria:
cooperation, intellectual contribution, practical contribution, and work ethic.
In addition to encouraging accountability, the approach gives teachers and students
insightful feedback on individual and team performance.
There are two primary users: the students and instructors.
Students having the rights to see other teams and their own as well as select any 
other student from their team to rate on a scale from 1-5 on the four main criteria.
Instructors have the ability to create teams (Possibly create students) and to overview
the ratings given by the student to other students.

Authors:
Samy Mezimez 40275766
Daniel Pinto 40276779
Aninnda Kumar Datta 40298954
Dylan Moos 40296816
Karim Naja 40235546
Aymen Mefti 40299611

Sprint planning excel link:
https://liveconcordia-my.sharepoint.com/:x:/g/personal/an_datta_live_concordia_ca/ESvfvA-PWkBFgd6LmiTCUGsBnDO1w4oGn-RXZWzlCd9Wtg?e=GRJdQ9


Dependencies:
To be installed in both directory: Code/client/the_bat_boys + Code/server
npm i express axios cors nodemon bcrypt mysql jsonwebtoken dotenv react-router-dom cookie-parser express-session

express //Nodejs framework
axios //
cors //Com between client-server
bcrypt //Encryption
nodemon //Refresh server
mysql //Database
jsonwebtoken //Login authorisation
dotenv //Token for authorisation
react-router-dom //
cookie-parser 
express-session

VS Code Extensions:
REST client

How to run website:
Open 2 terminal -->
    1. Code/client/the_bat_boys
    2. Code/server
On client terminal write "npm run dev"
On server terminal write "npm start"
Open http://localhost:5173
Using request.rest, create users using POST and /users
Login with newly created users (userId, password, role)
To see created users open http://localhost:3000/users


TO DO
- Backend code need to be fixed
    - Separation into multiple files
- Add a go back button for team name selection
- Add a modify team option to add/remove students
- CSS!!!!!

.env needs to be place in gitignore and put password of personal db



