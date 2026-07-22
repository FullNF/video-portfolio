import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  Link2,
  Play,
  Search,
  Share2,
  Sparkles,
  X
} from "lucide-react";
import "./styles.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwDBHxi3xHRemU4xtBa_EYpqivZfypRRnxa-K6MeaNcJohYX9zanhEVLpOJwgRhVoTK/exec";

const FALLBACK_ITEMS = [
  {
    id: "demo-1",
    name: "Cinematic Reel",
    category: "SHOWREEL",
    url: "",
    thumbnail: "",
    description:
      "A cinematic selection of motion, 3D and visual storytelling."
  },
  {
    id: "demo-2",
    name: "3D World",
    category: "3D / CGI",
    url: "",
    thumbnail: "",
    description:
      "World-building, lighting and atmospheric visual design."
  },
  {
    id: "demo-3",
    name: "Motion Experiment",
    category: "MOTION",
    url: "",
    thumbnail: "",
    description:
      "Experimental motion language and digital compositions."
  }
];

function App() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [cursor, setCursor] = useState({ x: -100, y: -100 });
  const [cursorLabel, setCursorLabel] = useState("");

  /* =========================
     CUSTOM CURSOR
  ========================= */
useEffect(() => {
  document.body.style.overflow = loading ? "hidden" : "";

  return () => {
    document.body.style.overflow = "";
  };
}, [loading]);

useEffect(() => {
  const disableContextMenu = (e) => {
    e.preventDefault();
  };

  const disableShortcuts = (e) => {
    const k = e.key.toUpperCase();

    if (k === "F12") {
      e.preventDefault();
    }

    if (
      e.ctrlKey &&
      e.shiftKey &&
      (k === "I" || k === "J" || k === "C")
    ) {
      e.preventDefault();
    }

    if (e.ctrlKey && k === "U") {
      e.preventDefault();
    }

    if (e.ctrlKey && k === "S") {
      e.preventDefault();
    }
  };

  document.addEventListener(
    "contextmenu",
    disableContextMenu
  );

  document.addEventListener(
    "keydown",
    disableShortcuts
  );

  return () => {
    document.removeEventListener(
      "contextmenu",
      disableContextMenu
    );

    document.removeEventListener(
      "keydown",
      disableShortcuts
    );
  };
}, []);
  useEffect(() => {
    const move = (e) => {
      setCursor({
        x: e.clientX,
        y: e.clientY
      });
    };

    

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  /* =========================
     LOAD DRIVE DATA
     MINIMUM 4 SECOND LOADER
  ========================= */

  useEffect(() => {
    const load = async () => {
      const startTime = Date.now();

      try {
        if (!API_URL) {
          throw new Error("No API URL configured");
        }

        const response = await fetch(API_URL);
        const data = await response.json();

        setItems(
          Array.isArray(data)
            ? data
            : data.files || []
        );
      } catch (error) {
        console.error("Failed to load portfolio:", error);
        setItems(FALLBACK_ITEMS);
      }

      /*
        Keep loader visible for at least 4 seconds.
        If API takes longer than 4 seconds,
        loader waits until API finishes.
      */

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 4000 - elapsed);

      setTimeout(() => {
        setLoading(false);
      }, remaining);
    };

    load();
  }, []);

  /* =========================
     FILTER PROJECTS
  ========================= */

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();

    return items.filter((item) =>
      !q ||
      `${item.name} ${item.category} ${item.description || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  /* =========================
     TOAST
  ========================= */

  const notify = (text) => {
    setToast(text);

    window.clearTimeout(window.__toast);

    window.__toast = window.setTimeout(() => {
      setToast("");
    }, 2200);
  };

  /* =========================
     SHARE PROJECT
  ========================= */

  const share = async (item) => {
    const url = `${window.location.origin}${window.location.pathname}?project=${encodeURIComponent(
      item.id
    )}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: item.name,
          text: `Check out ${item.name}`,
          url
        });
      } catch {}
    } else {
      await navigator.clipboard?.writeText(url);
      notify("Project link copied");
    }
  };

  /* =========================
     OPEN PROJECT FROM URL
  ========================= */

  useEffect(() => {
    const id = new URLSearchParams(
      window.location.search
    ).get("project");

    if (id && items.length) {
      const found = items.find(
        (x) => String(x.id) === id
      );

      if (found) {
        setActive(found);
      }
    }
  }, [items]);

  return (
    <>
      {/* =========================
          LOADING SCREEN
      ========================= */}

      {loading && (
        <div className="loader-screen">
          <div className="loader-content">

            <div className="loader-logo">
              LOADING <span>PORTFOLIO</span>
            </div>

            <div className="loader-line">
              <div className="loader-progress" />
            </div>

            <div className="loader-status">
              <span>SYNCING SELECTED WORK</span>
              
            </div>

          </div>
        </div>
      )}

      {/* =========================
          MAIN WEBSITE
      ========================= */}

      <div className="app">

        <div className="noise" />

        <div className="ambient ambient-a" />
        <div className="ambient ambient-b" />
        <div className="ambient ambient-c" />

        {/* CUSTOM CURSOR */}

        <div
          className="custom-cursor"
          style={{
            transform: `translate3d(${cursor.x}px, ${cursor.y}px, 0)`
          }}
        >
          <span>{cursorLabel}</span>
        </div>

        <main id="top">

          {/* =========================
              WORK SECTION
          ========================= */}

          <section
            id="work"
            className="work-section"
          >

            <div className="hero">

              <div>

                <div className="eyebrow">
                  01 / SELECTED WORK
                </div>

                <h1>
                  THE{" "}
                  <span>
                    <em>VIDEO PORTFOLIO</em>
                  </span>
                </h1>

              </div>

              <div className="heading-side">

                <span>
                  {loading
                    ? "SYNCING..."
                    : `${filtered.length} PROJECTS`}
                </span>

                <div className="search-box">

                  <Search size={15} />

                  <input
                    value={query}
                    onChange={(e) =>
                      setQuery(e.target.value)
                    }
                    placeholder="Search work..."
                  />

                </div>

              </div>

            </div>

            {/* CATEGORY FILTER */}

            <div className="filter-row">

              <span className="filter-active">
                ALL WORK
              </span>

            </div>

            {/* PROJECT GRID */}

            <div className="project-grid">

              {filtered.map((item, index) => (

                <ProjectCard
                  key={item.id || index}
                  item={item}
                  index={index}
                  onOpen={() => setActive(item)}
                  onShare={() => share(item)}
                  setCursorLabel={setCursorLabel}
                />

              ))}

            </div>

          </section>

          {/* =========================
              CONTACT SECTION
          ========================= */}

          <section
            id="contact"
            className="contact-section"
          >

            <div className="contact-glow" />

            <div className="eyebrow">
              02 / START SOMETHING
            </div>

            <h2>
              WANT YOUR
              <br />
              <em>VIDEO LIKE THIS?</em>
            </h2>

            <a
              className="contact-btn"
              href="https://wa.me/916396128337?text=Hi%2C%20I%20saw%20your%20portfolio%20and%20I%20would%20like%20to%20discuss%20a%20video%20project."
              target="_blank"
              rel="noreferrer"
            >
              LET'S TALK
              <ArrowUpRight size={18} />
            </a>

          </section>

        </main>

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="footer">

          <span>
            © 2026 YOUWE GROUP
          </span>

          <span>
            BUILT BY AYUSH SINGH
            <Sparkles size={13} />
          </span>

          <span>
            INDIA / WORLDWIDE
          </span>

        </footer>

        {/* =========================
            VIDEO MODAL
        ========================= */}

        {active && (

          <VideoModal
            item={active}
            onClose={() => setActive(null)}
            onShare={() => share(active)}
            notify={notify}
          />

        )}

        {/* =========================
            TOAST
        ========================= */}

        {toast && (

          <div className="toast">

            <Link2 size={15} />

            {toast}

          </div>

        )}

      </div>
    </>
  );
}


/* =====================================================
   PROJECT CARD
===================================================== */

function ProjectCard({
  item,
  index,
  onOpen,
  onShare,
  setCursorLabel
}) {

  const ref = useRef(null);

  const [tilt, setTilt] = useState({
    x: 0,
    y: 0
  });

  const move = (e) => {

    const r =
      ref.current.getBoundingClientRect();

    const x =
      ((e.clientX - r.left) / r.width - 0.5) * 8;

    const y =
      ((e.clientY - r.top) / r.height - 0.5) * -8;

    setTilt({
      x,
      y
    });

  };

  return (

    <article
      ref={ref}
      className={`project-card card-${index % 5}`}
      style={{
        transform: `
          perspective(1000px)
          rotateX(${tilt.y}deg)
          rotateY(${tilt.x}deg)
        `
      }}
      onMouseMove={move}
      onMouseLeave={() =>
        setTilt({
          x: 0,
          y: 0
        })
      }
      onMouseEnter={() =>
        setCursorLabel("OPEN")
      }
    >

      <div
        className="card-media"
        style={{
          backgroundImage: item.thumbnail
            ? `url("${item.thumbnail}")`
            : undefined
        }}
      >

        {!item.thumbnail && (

          <div className="media-placeholder">
            <Play size={28} />
          </div>

        )}

        <div className="media-shade" />

        <div className="card-top">

          <span>
            {String(index + 1).padStart(2, "0")}
          </span>

          <span>
            {item.category || "SELECTED WORK"}
          </span>

        </div>

        <button
          className="play-button"
          onClick={onOpen}
        >

          <Play
            fill="currentColor"
            size={18}
          />

        </button>

        <div className="card-bottom">

          <div>

            <h3>
              {item.name}
            </h3>

            <p>
              {item.description ||
                "Visual experience / selected work"}
            </p>

          </div>

          <button
            className="share-icon"
            onClick={(e) => {

              e.stopPropagation();

              onShare();

            }}
          >

            <Share2 size={16} />

          </button>

        </div>

      </div>

    </article>

  );
}


/* =====================================================
   VIDEO MODAL
===================================================== */

function VideoModal({
  item,
  onClose,
  onShare,
  notify
}) {

  useEffect(() => {

    document.body.style.overflow = "hidden";

    const key = (e) => {

      if (e.key === "Escape") {
        onClose();
      }

    };

    window.addEventListener(
      "keydown",
      key
    );

    return () => {

      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        key
      );

    };

  }, [onClose]);

  return (

    <div
      className="modal"
      onMouseDown={(e) => {

        if (
          e.target === e.currentTarget
        ) {
          onClose();
        }

      }}
    >

      <div className="modal-backdrop" />

      <div className="modal-content">

        <div className="modal-header">

          <div>

            <span className="eyebrow">
              {item.category ||
                "SELECTED WORK"}
            </span>

            <h2>
              {item.name}
            </h2>

          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >

            <X size={22} />

          </button>

        </div>

        <div className="player">

          {item.previewUrl ? (

            <iframe
              src={item.previewUrl}
              title={item.name}
              allow="autoplay; fullscreen"
              allowFullScreen
            />

          ) : (

            <div className="empty-player">

              <Play size={42} />

              <p>
                Connect your Google Drive API
                to play this project.
              </p>

            </div>

          )}

        </div>

        <div className="modal-footer">

          <p>
            {item.description ||
              "A selected visual experience from the archive."}
          </p>

          <button
            className="share-btn"
            onClick={onShare}
          >

            <Share2 size={16} />

            SHARE PROJECT

          </button>

        </div>

      </div>

    </div>

  );
}


createRoot(
  document.getElementById("root")
).render(
  <App />
);