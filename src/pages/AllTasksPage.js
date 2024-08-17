import { useContext, useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Link, Navigate } from "react-router-dom";
import MockDexScreenerAPI from "../Api.js";
import UserContext from "../UserContext.js";
import TaskCard from "../components/TaskCard.js";

// Only Admin can view. Displays all Assignments and the Task's details
function AllTasksPage() {
  const { loggedInUser } = useContext(UserContext);
  const [assignmentComponents, setAssignmentComponents] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    async function grabAllTasks() {
      try {
        const apiResult = await MockDexScreenerAPI.getAllAssignments();

        const tempAssignmentComponents = [];
        if (apiResult.length > 0) {
          apiResult.map((assignment) => {
            const { task, _id, status, user } = assignment;
            const { username } = user;
            const { title, description } = task;

            tempAssignmentComponents.push(
              <Link
                key={_id}
                to={`/assignment/${_id}`}
                className="task-card-link"
              >
                <TaskCard
                  title={title}
                  description={description}
                  status={status}
                  clientUsername={username}
                />
              </Link>
            );
          });
        }
        setAssignmentComponents(tempAssignmentComponents);
        setLoadingTasks(false);
      } catch (err) {
        setLoadingTasks(false);
      }
    }
    grabAllTasks();
  }, []);

  if (!loggedInUser) {
    return <Navigate to="/login" replace={true} />;
  }

  if (loggedInUser.isClient) {
    return <Navigate to="/my-tasks" replace={true} />;
  }

  return (
    <Container>
      <Stack gap={3} className="col-md-5 mx-auto">
        <div className="tasks-page-title">
          <h1>All Assigned Tasks</h1>
        </div>
        <span className="instructions ">
          As an Admin, you can create and view all Tasks. To view a Client's
          response, click on a task from the list.
        </span>

        {loadingTasks ? (
          <div className="spinner-container">
            <Spinner></Spinner>
          </div>
        ) : assignmentComponents.length > 0 ? (
          assignmentComponents
        ) : (
          "No tasks created yet"
        )}
      </Stack>
    </Container>
  );
}

export default AllTasksPage;
