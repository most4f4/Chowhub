import { apiFetch } from "@/lib/api";
import { useAtomValue } from "jotai";
import { Form, Button } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { userAtom } from "@/store/atoms";
import { checkUniqueUserName } from "@/services/checkUsername";

//to do: refactor code to make forum a component
export default function CreateEmployeeForm() {
  const router = useRouter();

  // Holds warning messages to display if something goes wrong (e.g., duplicate email)
  const [warning, setWarning] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    emergencyContact: "",
    username: "",
    role: "",
  });
  const [availableUsername, setAvailableUsername] = useState(null);
  const debouncer = useRef(null); // use debouncer to stop span ping endpoint when not needed

  const user = useAtomValue(userAtom);
  // const token = useAtomValue(tokenAtom);
  //check username validity
  useEffect(() => {
    if (!form.username) {
      setAvailableUsername(null);
      return;
    }
    clearTimeout(debouncer.current);
    debouncer.current = setTimeout(() => {
      async function check() {
        try {
          const available = await checkUniqueUserName(form.username);
          // console.log("available: ", available);
          setAvailableUsername(available);
        } catch (err) {
          console.error("Failed to check username", err);
        }
      }
      check();
    }, 500);
  }, [form.username]);
  const handleChange = (e) => {
    // const { name, value } = e.target;
    // setForm((prev) => ({ ...prev, [name]: value }));
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const form = e.currentTarget;
    //add validation

    //
    try {
      console.log({ form });
      const res = await apiFetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      toast.success(`📩 We have sent a verification email to ${form.email}`, {
        position: "top-center",
        autoClose: 5000,
      });
      console.log(res.message); // Log success message
      router.push(`/${user.restaurantUsername}/dashboard/user-management`);
    } catch (err) {
      console.log(err, "error occured while creating new employee");
      // If the API call fails, show the error message
      setWarning(err.message);
    }
  };
  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1>Create New Employee</h1>
        <>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter First Name"
                required
                name="firstName"
                value={FormData.firstName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Last Name"
                required
                name="lastName"
                value={FormData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                required
                name="email"
                value={FormData.lastName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmergencyContact">
              <Form.Label>Emergency Contact</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Emergency Contact"
                required
                name="emergencyContact"
                value={FormData.emergencyContact}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formuserName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                required
                name="username"
                value={form.username}
                onChange={handleChange}
                isInvalid={availableUsername === false}
                isValid={availableUsername === true}
              />
              {availableUsername === false && (
                <Form.Text className="text-danger">Username is already taken</Form.Text>
              )}
              {availableUsername === true && (
                <Form.Text className="text-success">Username is available</Form.Text>
              )}
            </Form.Group>

            <div key={`inline-radio`} className="mb-3">
              <Form.Check
                inline
                label="Staff"
                name="role"
                type="radio"
                id={`inline-radio-1`}
                required
                value={"staff"}
                onChange={handleChange}
              />
              <Form.Check
                inline
                label="Manager"
                name="role"
                type="radio"
                id={`inline-radio-2`}
                required
                value={"manager"}
                onChange={handleChange}
              />
            </div>

            {warning && <p className="text-danger">{warning}</p>}

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </>
      </ManagerOnly>
    </DashboardLayout>
  );
}
