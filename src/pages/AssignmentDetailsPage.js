import { useContext, useEffect, useState } from "react";
import { Container, Spinner, Stack } from "react-bootstrap";
import { Link, Navigate, useParams } from "react-router-dom";
import MockDexScreenerAPI from "../Api.js";
import UserContext from "../UserContext.js";
import TaskCard from "../components/TaskCard.js";

function AssignmentDetailsPage() {
  const { loggedInUser } = useContext(UserContext);
  const params = useParams();

  const [assignment, setAssignment] = useState(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [fileURLs, setFileURLs] = useState([]);
  const [filesLoaded, setFilesLoaded] = useState(false);

  const [triggerAssignmentUpdate, setTriggerAssignmentUpdate] = useState(true);


  function updateAssignment() {
    setTriggerAssignmentUpdate(!triggerAssignmentUpdate);
  }

  if (loadingTask) {
    return (
      <Container>
        <Spinner></Spinner>
      </Container>
    );
  }
  return (
    <Container>
      <Stack gap={3} className="col-md-5 mx-auto">
        <div className="tasks-page-title">
          <h1>Task Details</h1>
        </div>
        <TaskCard
          className="detailed-task-card"
          title={assignment.task.title}
          description={assignment.task.description}
          clientUsername={assignment.user.username}
          status={assignment.status}
        />

        {fileURLs.length > 0 && (
          <div>
            <h3>{assignment.user.username}'s Files:</h3>
          </div>
        )}
        {fileURLs.map((obj, index) => {
          return (
            <Link
              className="file-link"
              target="_blank"
              rel="noopener noreferrer"
              to={obj.url}
              key={obj.url}
            >
              <i className="bi bi-file-earmark attachment-icon"></i>
              <span className="form-label"> File # {index + 1}</span>
            </Link>
          );
        })}
      </Stack>
    </Container>
  );
}

export default AssignmentDetailsPage;
