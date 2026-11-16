import { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  CalendarPlus,
  Check,
  Clipboard,
  Clock,
  Flower2,
  ArrowDown,
  RotateCcw,
  Phone,
  MapPin,
  Menu,
  Music,
  Navigation as NavigationIcon,
  Pause,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "motion/react";
import type { Celebration } from "./invitation/schema";
import { timezone } from "./invitation/schema";
import { useInvitation } from "./invitation/InvitationContext";
import { getCountdownParts } from "./countdown";
import { ScratchCard } from "./ScratchCard";
import { CouplePortrait } from "./CouplePortrait";
import { InvitationOpening } from "./InvitationOpening";
import { SparkleField } from "./SparkleField";

const indiaClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: timezone,
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const navItems = [
  ["Our Wedding", "our-wedding"],
  ["Celebrations", "celebrations"],
  ["Venue", "venue"],
  ["Contact", "contact"],
] as const;

function Monogram({ className = "" }: { className?: string }) {
  const config = useInvitation();
  return (
    <span
      className={`monogram ${className}`}
      role="img"
      aria-label={`${config.display.initials.join(" and ")} wedding monogram for ${config.couple.first} and ${config.couple.second}`}
    >
      <span>{config.display.initials[0]}</span>
      <i>&amp;</i>
      <span>{config.display.initials[1]}</span>
    </span>
  );
}

function BotanicalSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`botanical-sprig ${className}`}
      viewBox="0 0 180 240"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M30 227C88 182 51 90 145 20M62 184C114 174 128 143 151 118M75 133C41 112 33 83 28 55M89 89C122 87 145 71 161 48" />
        <path
          d="M49 203C31 196 25 179 31 163C48 171 55 185 49 203ZM65 174C84 175 101 163 105 146C85 143 69 155 65 174ZM69 148C48 143 38 127 42 112C62 118 72 131 69 148ZM78 114C95 113 108 99 108 83C90 87 79 99 78 114ZM96 74C79 68 74 55 78 42C94 48 101 61 96 74ZM114 54C130 56 145 46 149 34C132 32 120 39 114 54ZM120 153C113 136 119 123 131 115C139 131 133 145 120 153ZM52 104C35 104 22 91 21 77C38 78 48 89 52 104ZM143 64C146 78 137 89 124 92C122 78 130 68 143 64Z"
          fill="currentColor"
          fillOpacity=".15"
        />
      </g>
      <g transform="translate(148 25)">
        <g fill="var(--petal)" stroke="var(--petal-line)" strokeWidth=".7">
          <ellipse cy="-10" rx="7" ry="12" />
          <ellipse cy="-10" rx="7" ry="12" transform="rotate(72)" />
          <ellipse cy="-10" rx="7" ry="12" transform="rotate(144)" />
          <ellipse cy="-10" rx="7" ry="12" transform="rotate(216)" />
          <ellipse cy="-10" rx="7" ry="12" transform="rotate(288)" />
        </g>
        <circle r="4" fill="var(--gold)" />
      </g>
      <g fill="var(--gold)">
        <circle cx="31" cy="55" r="3" />
        <circle cx="161" cy="48" r="2.5" />
        <circle cx="151" cy="118" r="3" />
      </g>
    </svg>
  );
}

function MusicControl({
  canPlay,
  audio,
}: {
  canPlay: boolean;
  audio: React.RefObject<HTMLAudioElement | null>;
}) {
  const config = useInvitation();
  const userControlled = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const hasMusic = Boolean(config.optional.musicUrl);

  useEffect(() => {
    const player = audio.current;
    if (!player || !canPlay || !hasMusic) return;
    let disposed = false;
    player.volume = 0.35;

    const removeListeners = () => {
      document.removeEventListener("pointerdown", startOnInteraction, true);
      document.removeEventListener("touchend", startOnInteraction, true);
      document.removeEventListener("keydown", startOnInteraction, true);
      window.removeEventListener("pageshow", tryAutoplay);
    };
    const tryAutoplay = () => {
      if (disposed || userControlled.current) return;
      void player
        .play()
        .then(() => {
          if (!disposed) removeListeners();
        })
        .catch(() => {
          // If audible autoplay is blocked, retry on the first interaction.
        });
    };
    const startOnInteraction = (event: Event) => {
      if (userControlled.current) {
        removeListeners();
        return;
      }
      if (event.target instanceof Element && event.target.closest(".music-controls")) return;
      tryAutoplay();
    };

    document.addEventListener("pointerdown", startOnInteraction, true);
    document.addEventListener("touchend", startOnInteraction, true);
    document.addEventListener("keydown", startOnInteraction, true);
    window.addEventListener("pageshow", tryAutoplay);
    tryAutoplay();
    return () => {
      disposed = true;
      removeListeners();
    };
  }, [canPlay, hasMusic, audio]);

  const togglePlay = async () => {
    if (!audio.current || !canPlay || !hasMusic) return;
    userControlled.current = true;
    if (audio.current.paused) {
      try {
        await audio.current.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.current.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="music-controls" role="group" aria-label="Background music">
      {hasMusic && (
        <audio
          ref={audio}
          src={config.optional.musicUrl}
          preload="metadata"
          loop
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onVolumeChange={() => setMuted(Boolean(audio.current?.muted))}
          onError={() => setPlaying(false)}
        />
      )}
      <button
        type="button"
        className="icon-button focus-ring"
        onClick={togglePlay}
        disabled={!hasMusic}
        aria-label={hasMusic ? (playing ? "Pause music" : "Play music") : "Music is not configured"}
        aria-pressed={playing}
        title={playing ? "Pause music" : "Play music"}
      >
        {playing ? <Pause /> : <Music />}
      </button>
      {hasMusic && (
        <button
          type="button"
          className="icon-button focus-ring"
          onClick={() => {
            if (!audio.current) return;
            audio.current.muted = !muted;
            setMuted(!muted);
          }}
          aria-label={muted ? "Unmute music" : "Mute music"}
          aria-pressed={muted}
          title={muted ? "Unmute music" : "Mute music"}
        >
          {muted ? <VolumeX /> : <Volume2 />}
        </button>
      )}
    </div>
  );
}

function Navigation() {
  const config = useInvitation();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);
  return (
    <nav className="site-nav" aria-label="Invitation navigation">
      <motion.div
        className="reading-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <a
        className="nav-mark focus-ring"
        href="#our-wedding"
        aria-label="Home"
        onClick={() => setOpen(false)}
      >
        {config.display.initials[0]} <span>&</span> {config.display.initials[1]}
      </a>
      <div id="invitation-navigation" className={`nav-links ${open ? "nav-links-open" : ""}`}>
        {navItems.map(([label, id]) => (
          <a key={id} className="focus-ring" href={`#${id}`} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
      <button
        ref={toggle}
        className="nav-toggle focus-ring"
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="invitation-navigation"
        aria-label="Toggle navigation"
      >
        {open ? <X /> : <Menu />}
      </button>
    </nav>
  );
}

function Countdown() {
  const config = useInvitation();
  const target = Date.parse(config.countdownTarget);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    window.addEventListener("pageshow", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
      window.removeEventListener("pageshow", update);
    };
  }, []);

  if (!Number.isFinite(target)) return null;
  const remaining = getCountdownParts(target, now);
  const values = [
    ["Days", remaining.days],
    ["Hours", remaining.hours],
    ["Minutes", remaining.minutes],
    ["Seconds", remaining.seconds],
  ];
  return (
    <div>
      <p className="countdown-label">
        {remaining.complete ? "Our wedding day is here!" : "Counting down to our wedding day"}
      </p>
      <p className="countdown-target">
        <time dateTime={config.countdownTarget}>{config.display.countdownLabel}</time>
      </p>
      <div
        className="countdown"
        role="timer"
        aria-label={`Time remaining until ${config.display.countdownLabel}`}
      >
        {values.map(([label, value]) => (
          <div key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <p className="countdown-clock">
        Current time:{" "}
        <time dateTime={new Date(now).toISOString()}>{indiaClock.format(now)} IST</time>
      </p>
    </div>
  );
}

function SectionHeading({ eyebrow, children }: { eyebrow?: string; children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className="section-heading"
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && <span>{eyebrow}</span>}
      <h2>{children}</h2>
      <div className="botanical-rule" aria-hidden="true">
        <i />
        <Flower2 strokeWidth={1} />
        <i />
      </div>
    </motion.div>
  );
}

function EventLocation({ event, className }: { event: Celebration; className: string }) {
  return (
    <div className={`event-location ${className}`}>
      <span className="event-venue">{event.venue}</span>
      <span className="event-address">{event.address}</span>
      <div className="event-actions">
        <a
          className="button button-outline focus-ring"
          href={event.mapUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MapPin /> Directions
        </a>
      </div>
    </div>
  );
}

function getGoogleCalendarUrl(event: Celebration) {
  try {
    const startDate = new Date(event.start);
    const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
    const formatTime = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const dates = `${formatTime(startDate)}/${formatTime(endDate)}`;
    const calendarDates = event.timeToBeAnnounced
      ? event.start.slice(0, 10).replace(/-/g, "") +
        "/" +
        new Date(Date.parse(event.start.slice(0, 10) + "T12:00:00Z") + 86400000)
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")
      : dates;
    const title = encodeURIComponent(event.calendarTitle || event.title);
    const details = encodeURIComponent(
      `${event.title}\nVenue: ${event.venue}\nAddress: ${event.address}`,
    );
    const location = encodeURIComponent(`${event.venue}, ${event.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${calendarDates}&details=${details}&location=${location}`;
  } catch {
    return event.mapUrl;
  }
}

function EventCard({ event, index }: { event: Celebration; index: number }) {
  const config = useInvitation();
  const reducedMotion = useReducedMotion();
  const subtitle = event.title.includes(" \u2014 ") ? event.title.split(" \u2014 ")[1] : "";
  const coupleNames =
    config.couple.first.split(" ")[0] + " & " + config.couple.second.split(" ")[0];
  return (
    <motion.article
      id={event.id}
      className={"wedding-function-card reference-function-card event-" + event.id}
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.45 }}
    >
      <div className="ceremony-invitation-scene">
        <img
          className="ceremony-invitation-art"
          src={event.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          width={1024}
          height={1536}
        />
        <div className="ceremony-invitation-copy">
          <span className="ceremony-couple-label">{coupleNames}</span>
          <span className="function-card-event-badge">
            Celebration {String(index + 1).padStart(2, "0")}
          </span>
          <h3>{event.shortName}</h3>
          <p className="ceremony-traditional-subtitle">{subtitle}</p>
          <div className="ceremony-date-block">
            <time dateTime={event.timeToBeAnnounced ? event.start.slice(0, 10) : event.start}>
              {event.dateLabel}
            </time>
            <p>
              {event.timeLabel}
              {!event.timeToBeAnnounced && " IST"}
            </p>
          </div>
          {event.phereTime && <p>{event.phereTime}</p>}
        </div>
      </div>
      <div className="ceremony-invitation-footer">
        <h4>{event.venue}</h4>
        <p className="ceremony-address">{event.address}</p>
        <div className="event-actions">
          {event.mapUrl && (
            <a
              className="button button-outline focus-ring"
              href={event.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              <NavigationIcon size={18} aria-hidden="true" /> Directions
            </a>
          )}
          <a
            className="calendar-link focus-ring"
            href={getGoogleCalendarUrl(event)}
            target="_blank"
            rel="noreferrer"
            aria-label={"Add " + event.shortName + " to your calendar"}
          >
            <CalendarPlus size={18} aria-hidden="true" /> Add to calendar
          </a>
        </div>
        <p className="ceremony-blessing">{event.supportingLine}</p>
      </div>
    </motion.article>
  );
}

type RSVPData = {
  name: string;
  attendance: "yes" | "no";
  guests: string;
  celebrations: string[];
  dietary: string;
  message: string;
};

function RSVP() {
  const config = useInvitation();
  const [data, setData] = useState<RSVPData>({
    name: "",
    attendance: "yes",
    guests: "1",
    celebrations: [],
    dietary: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleCelebration = (label: string) => {
    setData((current) => ({
      ...current,
      celebrations: current.celebrations.includes(label)
        ? current.celebrations.filter((item) => item !== label)
        : [...current.celebrations, label],
    }));
  };

  const buildMessage = () => {
    const attending = data.attendance === "yes";
    const lines = [
      `RSVP for ${config.couple.first} & ${config.couple.second}`,
      "",
      `Name: ${data.name.trim()}`,
      `Attendance: ${attending ? "Joyfully attending" : "Sending our wishes"}`,
    ];
    if (attending) {
      lines.push(
        `Guests (including me): ${data.guests}`,
        `Celebrations: ${data.celebrations.join(", ")}`,
      );
      if (data.dietary.trim()) lines.push(`Dietary requirements: ${data.dietary.trim()}`);
    }
    if (data.message.trim()) lines.push(`Message: ${data.message.trim()}`);
    return lines.join("\n");
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!data.name.trim()) nextErrors.name = "Please enter your full name.";
    if (data.attendance === "yes") {
      const guests = Number(data.guests);
      if (!Number.isInteger(guests) || guests < 1)
        nextErrors.guests = "Please enter at least one guest.";
      if (!data.celebrations.length)
        nextErrors.celebrations = "Please choose at least one celebration.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setPreview(buildMessage());
    setDialogOpen(true);
  };

  const sendWhatsApp = () => {
    if (!config.optional.whatsappHostNumber) return;
    const number = String(config.optional.whatsappHostNumber).replace(/\D/g, "");
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(preview)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyMessage = async () => {
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const attending = data.attendance === "yes";
  return (
    <>
      <form className="rsvp-form" onSubmit={submit} noValidate>
        <label className="field">
          <span>
            Full name <b>*</b>
          </span>
          <input
            value={data.name}
            onChange={(event) => setData({ ...data, name: event.target.value })}
            aria-invalid={Boolean(errors.name)}
            placeholder="Your full name"
          />
          {errors.name && <small className="error">{errors.name}</small>}
        </label>
        <fieldset>
          <legend>Will you be joining us?</legend>
          <div className="choice-grid two">
            {[
              ["yes", "Joyfully attending"],
              ["no", "Sending our wishes"],
            ].map(([value, label]) => (
              <label
                key={value}
                className={`choice ${data.attendance === value ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="attendance"
                  value={value}
                  checked={data.attendance === value}
                  onChange={() =>
                    setData({
                      ...data,
                      attendance: value as "yes" | "no",
                      ...(value === "no" ? { guests: "1", celebrations: [], dietary: "" } : {}),
                    })
                  }
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <AnimatePresence initial={false}>
          {attending && (
            <motion.div
              className="attending-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="field">
                <span>Number of guests, including yourself</span>
                <input
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={data.guests}
                  onChange={(event) => setData({ ...data, guests: event.target.value })}
                  aria-invalid={Boolean(errors.guests)}
                />
                {errors.guests && <small className="error">{errors.guests}</small>}
              </label>
              <fieldset>
                <legend>Celebrations attending</legend>
                <div className="choice-grid">
                  {config.celebrations.map((event) => (
                    <label
                      className={`choice ${data.celebrations.includes(event.shortName) ? "selected" : ""}`}
                      key={event.id}
                    >
                      <input
                        type="checkbox"
                        checked={data.celebrations.includes(event.shortName)}
                        onChange={() => toggleCelebration(event.shortName)}
                      />
                      <span>{event.shortName}</span>
                      {data.celebrations.includes(event.shortName) && <Check />}
                    </label>
                  ))}
                </div>
                {errors.celebrations && <small className="error">{errors.celebrations}</small>}
              </fieldset>
              <label className="field">
                <span>
                  Dietary requirements <em>Optional</em>
                </span>
                <input
                  value={data.dietary}
                  onChange={(event) => setData({ ...data, dietary: event.target.value })}
                  placeholder="Please share any requirements"
                />
              </label>
            </motion.div>
          )}
        </AnimatePresence>
        <label className="field">
          <span>
            Message for {config.couple.first} &amp; {config.couple.second} <em>Optional</em>
          </span>
          <textarea
            rows={4}
            value={data.message}
            onChange={(event) => setData({ ...data, message: event.target.value })}
            placeholder="Leave a note for the couple"
          />
        </label>
        <button className="button button-submit focus-ring" type="submit">
          <Send /> Prepare RSVP
        </button>
        <p className="form-note">Your message opens in WhatsApp for you to review and send.</p>
      </form>

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Close className="dialog-close focus-ring">
              <X />
              <span className="sr-only">Close</span>
            </Dialog.Close>
            <Dialog.Title>Review your RSVP</Dialog.Title>
            <Dialog.Description>
              {config.optional.whatsappHostNumber
                ? "Review your message, then continue to WhatsApp. You will send it yourself."
                : "No host number is configured yet. Copy this demo message to share it manually."}
            </Dialog.Description>
            <pre>{preview}</pre>
            {config.optional.whatsappHostNumber ? (
              <button
                type="button"
                className="button button-submit focus-ring"
                onClick={sendWhatsApp}
              >
                <Send /> Continue to WhatsApp
              </button>
            ) : (
              <button
                type="button"
                className="button button-submit focus-ring"
                onClick={copyMessage}
              >
                {copied ? <Check /> : <Clipboard />}
                {copied ? "Copied" : "Copy message"}
              </button>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export default function App() {
  const config = useInvitation();
  const [opened, setOpened] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const invitationHeading = useRef<HTMLHeadingElement>(null);
  const reducedMotion = useReducedMotion();
  const weddingAudio = useRef<HTMLAudioElement>(null);
  const dissolveDuration = reducedMotion ? 0.25 : 2.2;

  useEffect(() => {
    if (revealed) {
      window.scrollTo({ top: 0, behavior: "instant" });
      invitationHeading.current?.focus({ preventScroll: true });
    }
  }, [revealed]);

  useEffect(() => {
    if (revealed) return;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    // Fixed positioning also stops background scrolling in iOS Safari.
    document.body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    return () => {
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, behavior: "instant" });
    };
  }, [revealed]);

  const handleStartOpening = () => {
    if (!weddingAudio.current) return;
    weddingAudio.current.volume = 0.35;
    void weddingAudio.current.play().catch(() => {});
  };

  const openInvitation = () => {
    if (opened) return;
    if (weddingAudio.current) {
      weddingAudio.current.volume = 0.35;
      void weddingAudio.current.play().catch(() => {
        // The music control can retry if playback is unavailable or blocked.
      });
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    setOpened(true);
  };

  const optionalDetails = Object.entries({
    Travel: config.optional.travel,
    Stay: config.optional.stay,
    Contact: config.optional.contact,
  }).filter(([, value]) => Boolean(value));

  return (
    <>
      <AnimatePresence onExitComplete={() => setRevealed(true)}>
        {!opened && (
          <InvitationOpening
            key="opening"
            onOpen={openInvitation}
            onStart={handleStartOpening}
            dissolveDuration={dissolveDuration}
          />
        )}
      </AnimatePresence>
      <motion.div
        className="invitation"
        inert={!revealed}
        aria-hidden={!revealed}
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: dissolveDuration, ease: [0.4, 0, 0.2, 1] }}
      >
        <Navigation />
        <MusicControl canPlay={opened} audio={weddingAudio} />
        <main>
          <a className="skip-to-content focus-ring" href="#celebrations">
            Skip to celebration details
          </a>
          <section
            className={`hero cinematic-hero ${opened ? "hero-is-revealed" : ""}`}
            id="our-wedding"
          >
            <SparkleField variant="hero" active={opened} />
            <div className="hero-editorial-topline">
              <span>A celebration of togetherness</span>
              <span>
                {config.city} · {config.display.wedding.monthYear}
              </span>
            </div>
            <div className="hero-editorial-grid">
              <div className="hero-portrait-column">
                <div className="hero-portrait-caption">
                  <span>Two hearts</span>
                  <i /> <span>One forever</span>
                </div>
                <CouplePortrait className="hero-couple" animate={false} />
                <p className="hero-art-caption">The beginning of our beautiful forever</p>
              </div>
              <div className="hero-inner">
                <p className="ganesh-invocation">॥ Shri Ganeshaya Namah ॥</p>
                <p className="eyebrow">Together with our families</p>
                <h1 ref={invitationHeading} tabIndex={-1}>
                  <span className="hero-name">
                    {config.couple.first.split(" ")[0]}
                    <small>{config.couple.first.split(" ").slice(1).join(" ")}</small>
                  </span>
                  <span className="hero-ampersand">&amp;</span>
                  <span className="hero-name">
                    {config.couple.second.split(" ")[0]}
                    <small>{config.couple.second.split(" ").slice(1).join(" ")}</small>
                  </span>
                </h1>
                <p className="hero-invitation-line">{config.wording.heroMessage}</p>
                <div className="hero-date">
                  <span>{config.display.wedding.weekday}</span>
                  <time dateTime={config.weddingDate}>{config.display.wedding.full}</time>
                  <span>{config.city}</span>
                </div>
                <a className="button button-solid focus-ring" href="#celebrations">
                  Explore the celebrations <ArrowDown size={18} aria-hidden="true" />
                </a>
                <p className="hero-footnote">{config.wording.heroFootnote}</p>
              </div>
            </div>
            <a className="hero-scroll-cue focus-ring" href="#invitation">
              <span>Our invitation to you</span>
              <ArrowDown size={18} aria-hidden="true" />
            </a>
          </section>

          <section
            className="family-section"
            id="invitation"
            data-monogram={config.display.initials.join(" & ")}
          >
            <BotanicalSprig className="family-sprig" />
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <SectionHeading eyebrow="With love & blessings">
                An invitation from our hearts
              </SectionHeading>
              <p className="family-memory">{config.memorialLine}</p>
              <p>{config.invitationLine}</p>
              <div className="invitation-families" aria-label="The couple and their families">
                <div>
                  <h2>{config.couple.first}</h2>
                  <p>
                    {config.couple.firstIsGroom
                      ? config.couple.groomParents
                      : config.couple.brideParents}
                  </p>
                </div>
                <span className="family-weds">weds</span>
                <div>
                  <h2>{config.couple.second}</h2>
                  {config.couple.groomGrandparents && <p>{config.couple.groomGrandparents}</p>}
                  <p>
                    {config.couple.firstIsGroom
                      ? config.couple.brideParents
                      : config.couple.groomParents}
                  </p>
                </div>
              </div>
              <p className="family-blessing">{config.blessingLine}</p>
              <div className="invitation-regards">
                <div>
                  <h3>R.S.V.P.</h3>
                  <p>{config.rsvp}</p>
                </div>
                <div>
                  <h3>With best wishes from:</h3>
                  <p>{config.wishesFrom}</p>
                </div>
              </div>
              <Monogram />
            </motion.div>
          </section>

          <section className="countdown-section" id="countdown">
            <div className="date-keepsake">
              <SectionHeading eyebrow="A little moment of joy">Save our date</SectionHeading>
              <ScratchCard />
            </div>
            <div className="countdown-panel">
              <SectionHeading eyebrow="Until we celebrate together">
                The sweetest wait
              </SectionHeading>
              <Countdown />
            </div>
          </section>

          <section className="celebrations-section" id="celebrations">
            <SparkleField variant="celebrations" active={opened} />
            <SectionHeading eyebrow={config.display.celebrationsLabel}>
              Let the celebrations begin
            </SectionHeading>
            <p className="section-intro">{config.wording.celebrationsIntro}</p>
            <div className="events">
              {config.celebrations.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          </section>

          <motion.section
            className="venue-section"
            id="venue"
            initial={reducedMotion ? false : { opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="venue-artwork"
              style={{ backgroundImage: `url("${config.media.venueArtworkUrl}")` }}
              role="img"
              aria-label="A garden wedding setting with a flower-covered mandap"
            />
            <div className="venue-content">
              <SectionHeading eyebrow="A beautiful place for a new beginning">
                Meet us here
              </SectionHeading>
              <MapPin className="venue-pin" />
              <h3>{config.venue.name}</h3>
              <p>{config.venue.address}</p>
              {config.venue.mapUrl && (
                <a
                  className="button button-solid focus-ring"
                  href={config.venue.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin /> Open in Google Maps
                </a>
              )}
            </div>
          </motion.section>

          {optionalDetails.length > 0 && (
            <section className="optional-section">
              {optionalDetails.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <p>{value}</p>
                </div>
              ))}
            </section>
          )}

          <footer id="contact">
            <div className="closing-copy">
              <Monogram />
              <SectionHeading eyebrow="We are here to help">With warm regards</SectionHeading>
              <p className="closing-message">{config.hosts}</p>
              <p>{config.homeAddress}</p>
              {config.contacts.length > 0 && (
                <div className="family-contacts">
                  <div className="contact-numbers" aria-label="Family contact numbers">
                    <span className="contact-label">Contact:</span>
                    {config.contacts.map((number) => (
                      <span key={number} className="contact-number">
                        {number.length === 10 ? (
                          <a className="focus-ring" href={`tel:+91${number}`}>
                            <Phone size={18} aria-hidden="true" /> {number}
                          </a>
                        ) : (
                          number
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="closing-rule" aria-hidden="true" />
              <p className="closing-note">{config.wording.closingNote}</p>
              <div className="closing-navigation">
                <a className="back-to-top focus-ring" href="#our-wedding">
                  Back to the invitation ↑
                </a>
                <button
                  type="button"
                  className="opening-replay focus-ring"
                  onClick={() => {
                    setRevealed(false);
                    setOpened(false);
                  }}
                >
                  <RotateCcw size={16} aria-hidden="true" /> Replay the entrance
                </button>
              </div>
            </div>
          </footer>
        </main>
      </motion.div>
    </>
  );
}
