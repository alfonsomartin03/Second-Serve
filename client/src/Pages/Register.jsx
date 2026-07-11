import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Building2,
  Users,
  ShieldCheck,
  UserPlus,
  Mail,
  Lock,
  Phone,
  MapPin,
  Map,
  Tag,
  HeartHandshake,
  Eye,
} from "lucide-react";
import "../styles/Register.css";

export default function Register() {
  const [accountType, setAccountType] = useState("donor");

  return (
    <main className="register-page">
      <nav className="register-nav">
        <Link to="/" className="register-logo">
          <Leaf size={28} />
          <span>Second Serve</span>
        </Link>

        <div className="register-nav-links">
          <Link to="/">How It Works</Link>
          <Link to="/">For Donors</Link>
          <Link to="/">For Recipients</Link>
          <Link to="/">Impact</Link>
          <Link to="/">About Us</Link>
        </div>

        <div className="register-nav-actions">
          <Link to="/login" className="nav-btn ghost">Log in</Link>
          <Link to="/register" className="nav-btn primary">Register</Link>
        </div>
      </nav>

      <section className="register-layout">
        <motion.aside
          className="register-info"
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="mission-pill">
            <Leaf size={15} />
            Join our mission
          </span>

          <h1>
            Create your account and <span>make an impact</span>
          </h1>

          <p>
            Whether you're a donor with surplus food or an organization feeding
            communities, we're glad to have you on board.
          </p>

          <div className="info-list">
            <InfoItem
              icon={<Users />}
              title="For Donors"
              text="Businesses and organizations with food to donate."
            />
            <InfoItem
              icon={<HeartHandshake />}
              title="For Recipients"
              text="Organizations and nonprofits serving those in need."
            />
            <InfoItem
              icon={<ShieldCheck />}
              title="Secure & Trusted"
              text="Your data is protected and used only to power our mission."
            />
          </div>

        </motion.aside>

        <motion.section
          className="register-card"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <div className="register-card-header">
            <div className="header-icon">
              <UserPlus />
            </div>
            <h2>Create Account</h2>
            <p>Choose your account type to get started.</p>
          </div>

          <div className="account-toggle">
            <button
              className={accountType === "donor" ? "selected" : ""}
              onClick={() => setAccountType("donor")}
              type="button"
            >
              <Building2 />
              <div>
                <strong>I'm a Donor</strong>
                <span>Business / Donor</span>
              </div>
            </button>

            <button
              className={accountType === "recipient" ? "selected" : ""}
              onClick={() => setAccountType("recipient")}
              type="button"
            >
              <Users />
              <div>
                <strong>I'm a Recipient</strong>
                <span>Organization / Nonprofit</span>
              </div>
            </button>
          </div>

          <form className="register-form">
            <Input icon={<Building2 />} label="Organization Name" placeholder="Enter your organization name" />
            
            <div className="form-row">
              <Input icon={<Users />} label="Contact Name" placeholder="Full name" />
              <Input icon={<Mail />} label="Email Address" placeholder="you@organization.org" />
            </div>

            <Input icon={<Lock />} label="Password" placeholder="Create a strong password" type="password" hasEye />
            <Input icon={<Lock />} label="Confirm Password" placeholder="Confirm your password" type="password" hasEye />
            <Input icon={<Phone />} label="Phone Number" placeholder="(352) 123-4567" />
            <Input icon={<MapPin />} label="Address" placeholder="Street address" />

            <div className="form-row three">
              <Input icon={<Building2 />} label="City" placeholder="City" />
              <Input icon={<Map />} label="State" placeholder="State" />
              <Input icon={<Tag />} label="ZIP Code" placeholder="ZIP Code" />
            </div>

            <label className="terms">
              <input type="checkbox" />
              <span>
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </span>
            </label>

            <button className="create-btn" type="submit">
              Create Account
            </button>

            <p className="login-text">
              Already have an account? <Link to="/login">Log in</Link>
            </p>

            <div className="safe-box">
              <ShieldCheck />
              <div>
                <strong>Your information is safe with us</strong>
                <p>
                  We use industry-standard security to protect your data and
                  ensure a trusted experience.
                </p>
              </div>
            </div>
          </form>
        </motion.section>
      </section>
    </main>
  );
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="info-item">
      <div>{icon}</div>
      <section>
        <h3>{title}</h3>
        <p>{text}</p>
      </section>
    </div>
  );
}

function Input({ icon, label, placeholder, type = "text", hasEye = false }) {
  return (
    <label className="field">
      <span>
        {label} <b>*</b>
      </span>
      <div className="input-wrap">
        {icon}
        <input type={type} placeholder={placeholder} />
        {hasEye && <Eye className="eye" size={18} />}
      </div>
    </label>
  );
}