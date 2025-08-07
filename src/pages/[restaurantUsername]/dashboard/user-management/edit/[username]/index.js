import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Form, Button } from "react-bootstrap";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { userAtom } from "@/store/atoms";
import { useAtomValue } from "jotai";
import styles from "./editEmployee.module.css"; 
export default function EditEmployee() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [warning, setWarning] = useState("");
  const user = useAtomValue(userAtom);
  const [isOnlyManager, setIsOnlyManager] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    status: false,
    phone: "",
    emergencyContact: "",
  });

  useEffect(() => {
    if (router.isReady && Object.keys(router.query).length > 0) {
      const { username, fullName, email, role, userStatus, phone, emergencyContact, _id } =
        router.query;
      const [firstName, lastName] = fullName.split(" ");
      const trueFalseStatus = userStatus === "Active";
      
      setFormData({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
        status: trueFalseStatus,
        phone: phone,
        emergencyContact: emergencyContact,
      });
      setUserId(_id);
      setIsLoading(false);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    async function checkNumberOfManagers() {
      if (!formData.role) return;
      try {
        const data = await apiFetch("/restaurant");
        if (data.totalManagers > 1 && formData.role === "manager") {
          setIsOnlyManager(false);
        } else if (formData.role === "manager") {
          setIsOnlyManager(true);
        } else {
          setIsOnlyManager(false);
        }
      } catch (err) {
        console.error("Failed to check number of managers", err);
      }
    }
    checkNumberOfManagers();
  }, [formData.role]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning("");

    try {
      console.log({ formData });
      const res = await apiFetch(`/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success(`📩 We have successfully updated: ${formData.username}`, {
        position: "top-center",
        autoClose: 5000,
      });
      console.log(res.message);
      router.push(`/${user.restaurantUsername}/dashboard/user-management`);
    } catch (err) {
      console.log(err, "error occured while updating employee");
      setWarning(err.message);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <ManagerOnly>
          <h1 className="text-white">Loading User Data...</h1>
        </ManagerOnly>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ManagerOnly>
        <h1 className="text-white">Editing Data For: {formData.username}</h1>
        <Form className={styles.formWrapper} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label className={styles.employeeLabel}>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter First Name"
              required
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={styles.employeeLabel}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label className={styles.employeeLabel}>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Last Name"
              required
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={styles.employeeLabel}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label className={styles.employeeLabel}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.employeeLabel}
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label className={styles.employeeLabel}>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter Phone Number"
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={styles.employeeLabel}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmergencyContact">
            <Form.Label className={styles.employeeLabel}>Emergency Contact</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Emergency Contact"
              required
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className={styles.employeeLabel}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formuserName">
            <Form.Label className={styles.employeeLabel}>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Username"
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.employeeLabel}
              disabled // Username should not be editable
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label className={styles.employeeLabel}>Role</Form.Label>
            <div key={`inline-radio-role`} className="d-flex gap-3">
              <Form.Check
                inline
                label="Staff"
                name="role"
                type="radio"
                id={`inline-radio-1`}
                required
                value={"staff"}
                checked={formData.role === "staff"}
                onChange={handleChange}
                disabled={isOnlyManager}
              />
              <Form.Check
                inline
                label="Manager"
                name="role"
                type="radio"
                id={`inline-radio-2`}
                required
                value={"manager"}
                checked={formData.role === "manager"}
                onChange={handleChange}
              />
            </div>
            {isOnlyManager && (
              <Form.Text className="text-danger">
                This user is the only manager. We have disabled setting this user as staff.
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="custom-switch">
            <Form.Label className={styles.employeeLabel}>Active Status</Form.Label>
            <Form.Check
              type="switch"
              label=""
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
              name="status"
            />
          </Form.Group>
          
          {warning && <p className="text-danger">{warning}</p>}

          <Button type="submit" className={styles.submitButton}>
            Update
          </Button>
        </Form>
      </ManagerOnly>
    </DashboardLayout>
  );
}
