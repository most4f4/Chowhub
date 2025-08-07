import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  return (
    <div style={{ backgroundColor: "#ffffff" }}>
      <div className="container my-5">
        <div className="row align-items-center">
          <motion.div
            className="col-lg-6 d-flex justify-content-center mb-4 mb-lg-0"
            initial={{ opacity: 0, x: -300 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src="/images/4.jpg"
              className="img-fluid shadow"
              alt="about us"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </motion.div>

          <motion.div
            className="col-lg-6 d-flex flex-column justify-content-center ps-lg-4"
            initial={{ opacity: 0, x: 350 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-uppercase fw-bold fs-1 mb-4">
              About ChowHub
            </h2>

            <p>
              Chowhub is your all-in-one solution for managing restaurant
              operations with ease.
            </p>

            <p className="mb-3">
              We help restaurant owners, managers, and staff streamline daily
              tasks, from menu updates and order tracking to inventory control
              and performance insights. Whether you're running a cozy café or a
              busy kitchen, Chowhub empowers your team with the tools to
              deliver exceptional service and stay ahead in a fast-paced industry.
            </p>

            <p className="mb-3" style={{ fontWeight: 'normal' }}>
              <span style={{ color: "#E91E63" }}>Simple.</span>{" "}
              <span style={{ color: "#4CAF50" }}>Smart.</span>{" "}
              <span style={{ color: "#2196F3" }}>Reliable.</span>{" "}
              That’s the Chowhub way.
            </p>

            <Link href="/about">
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "black",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                  boxShadow: "none",
                }}
              >
                More about us &gt;&gt;
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
