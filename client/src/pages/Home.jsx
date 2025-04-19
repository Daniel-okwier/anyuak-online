import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="homepage">
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="title-highlight">Ignite Curiosity</span>
          <br />
          Unleash the Scientist Within!
        </h1>
        
        <p className="hero-subtitle">
          Welcome to our innovative learning platform where science comes alive. 
          Access interactive courses, hands-on experiments, and personalized 
          learning paths.
        </p>
        
        <Link to="/courses" className="cta-button">
          Begin Your Learning Journey
          <span className="button-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}

export default Home;