import { useEffect, useState } from "react";

const HeroSummary = () => {
  const summaries = [
    "Share your business to online community",
    "Update your old website to modern Technologies",
    "Optimize your website to reach the world",
    "Get modern UI/UX for your system",
    "Get secure APIs for your web application",
    "Get professional Logo for your company",
    
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // fade out
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % summaries.length);
        setFade(true); // fade in next
      }, 600); // match CSS transition duration
    }, 7000); // 4 seconds per summary
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className={`lead mb-4 ${fade ? "fade-slide-in" : "fade-slide-out"}`}
      style={{ 
        minHeight: "60px",   // prevents jump when text changes
        fontSize: "2rem",  // increased font size
        fontWeight: 600      // semi-bold for more visibility
      }}
    >
      {summaries[index]}
    </p>
  );
};

export default HeroSummary;
