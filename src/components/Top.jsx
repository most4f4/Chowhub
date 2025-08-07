import Image from "next/image";
import { Container } from "react-bootstrap";
import styles from "./top.module.css";
import Link from "next/link";

export default function Header() {
  return (
    <header className={`fixed-top shadow bg-white ${styles.header}`}>
      <Container className="d-flex justify-content-between align-items-center">
        {/* Left: Logo */}
        <div>
          <Image src="/images/logo1.png" width={100} height={80} alt="ChowHub Logo" />
        </div>

        {/* Center: Navigation */}
        <nav className={`${styles.nav} text-center mx-auto`}>
          <a href="/" className={styles.navLink}>
            Home
          </a>
          <a href="/about" className={styles.navLink}>
            About Us
          </a>
          <a href="/contact" className={styles.navLink}>
            Contact Us
          </a>
        </nav>

        {/* Right: Register and Login Buttons */}
        <div className="d-flex align-items-center gap-3">
          <Link href="/create-restaurant">
            <button type="button" className={`btn btn-success ${styles.Btn}`}>
              Register
            </button>
          </Link>

          <Link href="/login">
            <button type="button" className={styles.loginBtn}>
              Login
            </button>
          </Link>
        </div>
      </Container>
    </header>
  );
}
