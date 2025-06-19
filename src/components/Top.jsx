import Image from "next/image";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./top.module.css"; // customize this file
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
        <Link href="/login">
          <button type="button" className={`btn btn-success ${styles.Btn}`}>
            Login
          </button>
        </Link>
      </Container>
    </header>
  );
}
