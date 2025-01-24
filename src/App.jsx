import { useState, useEffect, useRef } from "react";
import { CreateOrderAPI } from "./services/CreateOrderApi.js";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Handle initial load with hash in URL
    const hash = window.location.hash;
    if (hash) {
      // Remove the # from the hash
      const sectionId = hash.substring(1);
      // Add a small delay to ensure the page is fully loaded
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const sectionId = hash.substring(1);
        scrollToSection(sectionId);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      // Update URL without triggering a new hashchange event
      window.history.pushState(null, "", `#${sectionId}`);
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  // Navigation items array moved to a constant for reuse
  const navigationItems = [
    { label: "Support Our Work", id: "support" },
    { label: "Join Waitlist", id: "waitlist" },
    { label: "About Us", id: "about" },
  ];

  return (
    <header className="flex justify-between items-center px-4 py-3 md:px-8 md:py-4 bg-white shadow-md fixed w-full top-0 z-50">
      <div className="flex items-center space-x-2">
        <img
          src="/src/assets/logo.png"
          alt="Hinton Studios Logo"
          className="h-12 md:h-20 invert"
        />
      </div>
      <nav className="hidden md:flex items-center space-x-6 text-sm">
        {navigationItems.map((item) => (
          <button
            key={item.label}
            onClick={() => scrollToSection(item.id)}
            className="hover:underline transition duration-300 cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </nav>
      <button className="hidden md:block bg-[#1a1a1a] text-white px-4 py-2 rounded-md text-sm">
        Join the Waitlist
      </button>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-800 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>
      {/* Mobile Menu */}
      {isOpen && (
        <nav className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden">
          <ul className="flex flex-col space-y-2 p-4">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded transition duration-300"
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <button className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-md text-sm">
                Join the Waitlist
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [playerError, setPlayerError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initializePlayer = () => {
      if (!playerRef.current && mounted) {
        playerRef.current = new window.YT.Player("youtube-player", {
          videoId: "lSCOMas3MvM",
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: "lSCOMas3MvM",
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3,
            playsinline: 1,
          },
          events: {
            onReady: onPlayerReady,
            onError: onPlayerError,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    };

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onload = () => {
        window.onYouTubeIframeAPIReady = initializePlayer;
      };
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      initializePlayer();
    }

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        playerRef.current &&
        !isPlayerReady
      ) {
        reloadPlayer();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const onPlayerReady = (event) => {
    event.target.mute();
    setIsPlayerReady(true);
    setPlayerError(null);
  };

  const onPlayerError = (event) => {
    setPlayerError(event.data);
    setIsPlayerReady(false);
    console.error("YouTube player error:", event.data);
    reloadPlayer();
  };

  const onPlayerStateChange = (event) => {
    // If video ends (state === 0), restart it
    if (event.data === 0) {
      event.target.playVideo();
    }
  };

  const reloadPlayer = () => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    setIsPlayerReady(false);
    // Re-initialize the player
    if (window.YT && window.YT.Player) {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: "lSCOMas3MvM",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: "lSCOMas3MvM",
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onError: onPlayerError,
          onStateChange: onPlayerStateChange,
        },
      });
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-900">
      {/* Video Container with proper aspect ratio and rounded corners */}
      <div className="absolute inset-0 w-full h-full max-w-[2000px] mx-auto overflow-hidden">
        <div className="relative w-full h-full">
          <div
            id="youtube-player"
            className="absolute inset-0 w-full h-full rounded-2xl"
            style={{
              clipPath: "inset(0 0 0 0 round 1rem)", // Ensures iframe respects border radius
            }}
          ></div>
          {/* Gradient overlay for better depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-gray-900/30 rounded-2xl"></div>
        </div>
      </div>

      {/* Content Card with backdrop blur */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="backdrop-blur-xl bg-white/10 p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
          <div className="text-center text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Home of Ai Artists
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Let us teach you how to harness AI for filmmaking. We'll guide you
              through every step—from planning to release—so you can build your
              own AI-powered film from scratch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <button
                className="bg-[#fbbf24] text-black px-8 py-4 rounded-xl font-semibold 
                               transition duration-300 hover:bg-[#f9a825] hover:scale-105
                               shadow-lg hover:shadow-[#fbbf24]/20"
              >
                JOIN THE WAITLIST
              </button>
              <button
                className="bg-white/15 text-white border border-white/20 px-8 py-4 
                               rounded-xl font-semibold transition duration-300 
                               hover:bg-white/25 hover:scale-105 backdrop-blur-sm
                               shadow-lg hover:shadow-white/10"
              >
                SUPPORT THE MAHABHARATA PROJECT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mute/Unmute Button with improved styling */}
      <button
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-20 backdrop-blur-md bg-black/20 
                 hover:bg-black/30 text-white p-4 rounded-full shadow-lg 
                 transition-all duration-300 focus:outline-none border border-white/10
                 hover:scale-110"
        aria-label={isMuted ? "Unmute Video" : "Mute Video"}
      >
        {isMuted ? (
          // Muted Icon (Speaker with X)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          // Unmuted Icon (Speaker with waves)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>
    </section>
  );
};

const AboutUs = () => (
  <section id="about" className="pt-24 py-8 md:py-16 px-4 md:px-8 bg-white">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-8">
        About Us
      </h2>
      <div className="flex flex-col md:flex-row items-center md:space-x-8">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <img
            src="https://placehold.co/600x400?text=About+Us+Image"
            alt="About Us"
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2">
          <p className="text-gray-700 mb-4">
            Welcome to Hinton Studios, where innovation meets creativity. We are
            a team of passionate individuals dedicated to pushing the boundaries
            of filmmaking through cutting-edge AI technology.
          </p>
          <p className="text-gray-700 mb-4">
            Our mission is to empower creators by providing tools that simplify
            the filmmaking process, allowing you to focus on storytelling and
            bringing your vision to life. Join us on this exciting journey and
            be part of the future of filmmaking.
          </p>
          <button className="bg-[#fbbf24] text-black px-6 py-3 rounded-md font-semibold hover:bg-[#f9a825] transition-colors duration-300">
            Learn More
          </button>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-[#1a1a1a] text-white py-6 px-4 md:px-8">
    <div className="max-w-6xl mx-auto text-center">
      <p className="mb-4">
        &copy; {new Date().getFullYear()} Hinton Studios. All rights reserved.
      </p>
      <div className="flex justify-center space-x-4">
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <span>|</span>
        <a href="#" className="hover:underline">
          Terms of Service
        </a>
      </div>
    </div>
  </footer>
);

const SupportTheMahabharataProject = () => {
  const [amount, setAmount] = useState(99); // Default amount of 100

  const handleSupportClick = async () => {
    const api = new CreateOrderAPI("/api/create-order");

    try {
      const orderResponse = await api.createOrder(
        "6361247835",
        "f940daffbbf24ba4e2084246ea431823",
        amount.toString(), // Use the amount from state
        `${Math.floor(1000 + Math.random() * 9000)}`,
        window.location.origin,
        "testremark1",
        "testremark2"
      );

      if (orderResponse?.result?.payment_url) {
        window.open(orderResponse.result.payment_url, "_blank");
      } else {
        console.warn("No valid payment link received:", orderResponse);
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const handleAmountChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value > 0) {
      setAmount(value);
    }
  };

  return (
    <section
      id="support"
      className="pt-24 py-16 md:py-24 px-4 md:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="flex-1 lg:max-w-xl">
            <div className="sticky top-8">
              <span className="text-sm font-medium text-[#fbbf24] tracking-wide uppercase mb-4 block">
                Support Us
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight">
                Support The Mahabharata Project
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Support us in bringing the timeless saga to life through
                groundbreaking AI technology. Your contribution supports our
                mission to revolutionize storytelling and preserve cultural
                heritage for future generations.
              </p>

              <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contribution Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      value={amount}
                      onChange={handleAmountChange}
                      className="w-full pl-10 pr-4 py-4 text-lg rounded-xl border border-gray-200 
                               focus:outline-none focus:ring-2 focus:ring-[#fbbf24] focus:border-transparent
                               transition-all duration-200"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSupportClick}
                  className="w-full bg-[#1a1a1a] text-white px-6 py-4 rounded-xl font-medium
                           hover:bg-black transition-colors duration-200 text-lg"
                >
                  Contribute ₹{amount}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  title: "AI-Powered Visuals",
                  description: "Next-gen character design",
                  image: "/src/assets/h-1.png",
                },
                {
                  title: "Epic Storytelling",
                  description: "Ancient tales reimagined",
                  image: "/src/assets/h-5.png",
                },
                {
                  title: "Cultural Heritage",
                  description: "Preserving traditions",
                  image: "/src/assets/h-3.png",
                },
                {
                  title: "Innovation",
                  description: "Pushing boundaries",
                  image: "/src/assets/h-4.jpg",
                },
              ].map((card, index) => (
                <div
                  key={index}
                  className="group bg-gray-50 rounded-2xl overflow-hidden border border-gray-100
                           transition-all duration-300 hover:shadow-lg"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="object-cover w-full h-full transform group-hover:scale-105
                               transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-medium text-lg mb-1">{card.title}</h3>
                    <p className="text-gray-500 text-sm">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const JoinWaitlistForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Set target date to January 29th, 11am Pacific Time
    const targetDate = new Date("2024-01-29T11:00:00-08:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwCcBnwLWHTtldKZRuxC8O_JYgNE0t7SJMLszNAusHPGnVGwgXSjEQXocU4WPfPdBYw/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      const result = await response.json();

      if (result && result.result === "success") {
        alert("Thank you! You've been added to the waitlist.");
        setFormData({ firstName: "", lastName: "", email: "" });
      } else {
        alert("Oops! Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section
      id="waitlist"
      className="pt-24 py-8 md:py-16 px-4 md:px-8 bg-white"
    >
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-lg p-6 md:p-12">
        {/* Countdown Timer */}
        <div className="flex justify-center space-x-6 mb-8">
          {[
            { value: timeLeft.days, label: "Days" },
            { value: timeLeft.hours, label: "Hours" },
            { value: timeLeft.minutes, label: "Minutes" },
            { value: timeLeft.seconds, label: "Seconds" },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="bg-[#1a1a1a] text-white rounded-lg p-3 min-w-[80px]">
                <div className="text-3xl md:text-4xl font-bold">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="text-sm">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Announcement */}
        <div className="text-center mb-8">
          <p className="text-lg font-bold text-[#fbbf24] uppercase">
            Enrollment for the February session opens on January 29th at 11am
            Pacific!
          </p>
        </div>

        <h2 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          Join the Waitlist
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Fill out the form below to be first to know when the next round of
          enrollment opens.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                placeholder="First Name"
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]"
              placeholder="Email Address"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-[#fbbf24] text-black px-8 py-3 rounded-md font-semibold hover:bg-[#f9a825] transition-colors duration-300"
            >
              Join the Waitlist
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

const App = () => (
  <div className="bg-[#f8f5f0] text-gray-800 font-[Inter, sans-serif] min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      <HeroSection />
      <SupportTheMahabharataProject />
      <JoinWaitlistForm />
      <AboutUs />
    </main>
    <Footer />
  </div>
);

export default App;
