import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Second Serve</h1>
      <h3>Reducing food waste, one meal at a time.</h3>

      <p>
        Second Serve is a platform that connects food donors with
        recipients, helping usable food reach communities instead of
        ending up in landfills.
      </p>

      <Link to="/login">Get Started</Link>

      <hr />

      <h2>What is Second Serve?</h2>
      <p>
        Our platform helps businesses and organizations donate surplus
        food quickly and efficiently to those who need it most.
      </p>

      <h2>How It Works</h2>
      <ol>
        <li>Create an account as a donor or recipient.</li>
        <li>Donors post available food listings.</li>
        <li>Recipients browse and claim available food.</li>
        <li>Food is redistributed before it goes to waste.</li>
      </ol>

      <h2>Who Can Use It?</h2>
      <ul>
        <li>Restaurants</li>
        <li>Grocery Stores</li>
        <li>Food Banks</li>
        <li>Community Organizations</li>
      </ul>

      <h2>Why Second Serve?</h2>
      <ul>
        <li>Reduce food waste</li>
        <li>Support local communities</li>
        <li>Simplify food donations</li>
        <li>Promote sustainability</li>
      </ul>

    <Link to="/login">Get Started</Link>
    </div>
  );
}
