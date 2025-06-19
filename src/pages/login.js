import { useSetAtom, useAtomValue } from "jotai";
import { tokenAtom, userAtom } from "@/store/atoms";
import { apiFetch } from "@/lib/api";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Top from "@/components/Top";
import { Header } from "@/components/Header";
import styles from "../pages/create-restaurant/createRes.module.css";
import { Form, Button, Container } from "react-bootstrap";
import Link from "next/link";
import { useEffect } from "react";

export default function LoginPage() {
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const router = useRouter();

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [setToken, setUser]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (token && user?.restaurantUsername) {
      router.replace(`/${user.restaurantUsername}/dashboard`);
    }
  }, [token, user, router]);

  if (token && user?.restaurantUsername) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.target));
    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const tokenToStore = res.token;
      setToken(tokenToStore);
      setUser(res.user);
      // Save to localStorage manually
      localStorage.setItem("token", tokenToStore);
      localStorage.setItem("user", JSON.stringify(res.user));
      toast.success("Logged in!");
      router.push(`/${res.user.restaurantUsername}/dashboard`);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      <Top />
      <Header title="Sign In to ChowHub" image="/images/waitress.jpg" />
      <Container className="mt-5">
        <Form
          onSubmit={handleSubmit}
          className={`bg-dark text-light p-4 rounded shadow ${styles.formWrapper}`}
        >
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control name="username" required className={styles.inputLarge} />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" required className={styles.inputLarge} />
          </Form.Group>

          <div className="d-flex align-items-center mt-3">
            <Button type="submit" className={`btn btn-success ${styles.registerBtn}`}>
              Login
            </Button>
            <Link href="/forgot-password" className="ms-3 text-white text-decoration-underline">
              <small>Forgot password?</small>
            </Link>
          </div>
        </Form>
      </Container>
    </>
  );
}
