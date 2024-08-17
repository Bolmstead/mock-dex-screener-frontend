import { useContext, useEffect, useState } from "react";
import { Container, Stack } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { Link, Navigate } from "react-router-dom";
import UserContext from "../UserContext.js";
import TaskCard from "../components/TaskCard.js";

// Only accessible by a client. Displays their assigned tasks
function MyTasksPage({ coins }) {
  console.log("🚀 ~ MyTasksPage ~ coins:", coins);
  const { setAlert } = useContext(UserContext);
  const [taskComponents, setTaskComponents] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  return (
    <Container>
      <Stack gap={3} className="col-md-5 mx-auto">
        <div className="tasks-page-title">
          <h1>Tokens</h1>
        </div>
      </Stack>
    </Container>
  );
}

export default MyTasksPage;
