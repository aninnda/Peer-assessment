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
npm i express axios cors nodemon bcrypt mysql jsonwebtoken dotenv react-router-dom cookie-parser express-session chart.js react-chartjs-2 html2canvas

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
Create users using POST and /users
Login with newly created users (userId, password, role)
To see created users open http://localhost:3000/users

CODE REVIEW: 
We reviewed our code and ensured that the following were done well:
1. Code reviewed in manageable chunks.
2. We made sure that the coding standards were followed.
3. Readablity and Maintainability: We made sure that the code is easy to read and that the variable names are appropriate.
4. Functionality and Requirements: The code meets the requirements for the associated issues.
5. Error Handling: Our code handles unexpected case scenarios.
6. The code is secure and performs well
7. Testing: We verified that the code includes tests for new functionality or bug fixes
8. We left appropriate comments in the code.
9. We reviewed the code to make sure that there is no code duplication (refactoring).
10. All the dependencies are listed.


CODING STANDARDS:
Coding standards were clearly defined and effectively communicated to the team. 
1.Choose meaningful variable and function names. 
2.Camel case vs snake case.
3.Use of comments and whitespace effectively to improve readability.
4.Using indentation and consistent formatting. ...
5.What should be documented? ...
6.Creating reader-friendly README files to make our project easier to understand.


CODE MAINTENANCE USING ANALYSIS TOOLS:

PIPELINE:



