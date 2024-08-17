import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import MockDexScreenerAPI from "../Api.js";
import UserContext from "../UserContext.js";
const animatedComponents = makeAnimated();

function CreateTaskPage() {
  const { loggedInUser, setAlert, btnLoading, setBtnLoading } =
    useContext(UserContext);
  const [allClients, setAllClients] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incompleteForm, setIncompleteForm] = useState(true);

  const [selectedClients, setSelectedClients] = useState([]);

  useEffect(() => {
    async function grabAllClients() {
      const apiResult = await MockDexScreenerAPI.getAllClients();

      if (apiResult.clients) {
        const tempClients = [];
        for (let item of apiResult.clients) {
          tempClients.push({
            value: item.username,
            label: item.username,
            color: "#0052CC",
          });
        }
        setAllClients(tempClients);
      } else {
        setAllClients(null);
      }
    }
    grabAllClients();
  }, []);

  // Disable Create Task Button if form isn't complete
  useEffect(() => {
    if (
      title.length > 0 &&
      description.length > 0 &&
      selectedClients.length > 0
    ) {
      setIncompleteForm(false);
    } else {
      setIncompleteForm(true);
    }
  }, [title, description, selectedClients]);

  const createTask = async () => {
    try {
      setBtnLoading(true);
      const assignedClientUsernames = [];
      for (let obj of selectedClients) {
        assignedClientUsernames.push(obj.value);
      }
      const apiObject = {
        title,
        description,
        assignedClientUsernames,
        status: "To Do",
      };

      await MockDexScreenerAPI.createTask(apiObject);
      setBtnLoading(false);
      setTitle("");
      setDescription("");
      setSelectedClients([]);
      setAlert({ type: "success", message: "Task was created and assigned" });
    } catch (err) {
      setBtnLoading(false);

      setAlert({ type: "error", message: err });
    }
  };

  return (
    <Form className="create-task-form">
      <h1 className="page-title">Create Task</h1>{" "}
      <Form.Group className="mb-3" controlId="createTaskForm">
        <Form.Label>Title</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Form.Label>Assign to:</Form.Label>
        <Select
          options={allClients}
          isMulti
          components={animatedComponents}
          onChange={(selection) => setSelectedClients(selection)}
          styles={{
            option: (provided, state) => ({
              ...provided,
              color: "black",
            }),
          }}
        />
      </Form.Group>
      <Button
        variant="primary"
        type="button"
        className="my-4 px-5"
        disabled={incompleteForm || btnLoading}
        onClick={!btnLoading ? createTask : null}
      >
        {btnLoading ? "Creating..." : "Create"}
      </Button>
    </Form>
  );
}

export default CreateTaskPage;
