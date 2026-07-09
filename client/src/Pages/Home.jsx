import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Leaf,
  Heart,
  Users,
  PackageCheck,
  Truck,
  Store,
  ArrowRight,
  Play,
} from "lucide-react";
import "../styles/Home.css";

export default function Home() {
  return (
    <main className="home">
      <nav className="navbar">
        <div className="logo">
          <Leaf size={28} />
          <span>Second Serve</span>
        </div>

        <div className="nav-links">
          <a href="#how">How It Works</a>
          <a href="#donors">For Donors</a>
          <a href="#recipients">For Recipients</a>
          <a href="#impact">Impact</a>
        </div>

        <div className="nav-actions">
          <Link to="/login" className="btn ghost">Log In</Link>
          <Link to="/register" className="btn primary">Register</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-overlay" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            Good food <br />
            deserves a <br />
            second serve
          </h1>

          <p>
            Connecting donors with organizations that feed people, not
            landfills. Together, we can fight hunger and reduce food waste.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn primary large">I Want to Donate</Link>
            <button className="btn outline large">
              I Need Food <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      </section>

      <motion.section
        className="stats-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Stat icon={<PackageCheck />} value="12,540+" label="Meals Donated" />
        <Stat icon={<Users />} value="320+" label="Active Partners" />
        <Stat icon={<Leaf />} value="8.4 tons" label="Food Saved" />
        <Stat icon={<Heart />} value="5,200+" label="People Helped" />
      </motion.section>

      <section id="how" className="section">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="pill">Simple Process</span>
          <h2>How It Works</h2>
          <p>We make food donation simple, efficient, and impactful.</p>
        </motion.div>

        <div className="steps">
          <Step
            number="1"
            icon={<Store />}
            title="Create an Account"
            text="Sign up as a donor or recipient organization in just a few minutes."
          />
          <Step
            number="2"
            icon={<PackageCheck />}
            title="Post or Browse Listings"
            text="Donors post available food. Recipients find what they need."
          />
          <Step
            number="3"
            icon={<Truck />}
            title="Connect & Make an Impact"
            text="Coordinate pickup or delivery and help fight hunger together."
          />
        </div>
      </section>

      <motion.section
        id="impact"
        className="feature-panel"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div>
          <span className="pill">Why It Matters</span>
          <h2>Reducing waste. Feeding communities.</h2>
          <p>
            Every day, tons of good food go to waste while families go hungry.
            Second Serve bridges that gap.
          </p>

          <ul>
            <li>Reduce food waste</li>
            <li>Support your community</li>
            <li>Build stronger connections</li>
          </ul>
        </div>

        <div className="video-card">
          <button>
            <Play fill="currentColor" />
          </button>
        </div>
      </motion.section>
    </main>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="stat">
      <div className="icon">{icon}</div>
      <h3>{value}</h3>
      <p>{label}</p>
    </div>
  );
}

function Step({ number, icon, title, text }) {
  return (
    <motion.div
      className="step"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="step-icon">{icon}</div>
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </motion.div>
  );
}