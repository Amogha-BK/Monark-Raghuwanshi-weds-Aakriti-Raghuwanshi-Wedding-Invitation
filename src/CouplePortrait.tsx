import { motion, useReducedMotion } from "motion/react";
import { useInvitation } from "./invitation/InvitationContext";

export function CouplePortrait({
  className = "",
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  const config = useInvitation();
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;

  return (
    <div className={`couple-portrait ${className}`}>
      <div className="portrait-aura" aria-hidden="true" />
      <svg className="portrait-arch" viewBox="0 0 400 540" fill="none" aria-hidden="true">
        <path
          className="arch-fill"
          d="M24 518V222C24 140 116 117 161 63L200 18L239 63C284 117 376 140 376 222V518Z"
        />
        <motion.path
          d="M24 518V222C24 140 116 117 161 63L200 18L239 63C284 117 376 140 376 222V518Z"
          initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
        />
        <path
          d="M38 505V224C38 150 126 127 172 74L200 41L228 74C274 127 362 150 362 224V505Z"
          className="arch-inner-line"
        />
        <path d="M8 529H392M70 536H330" className="arch-baseline" />
        <path
          className="arch-travelling-glint"
          pathLength="1"
          d="M24 518V222C24 140 116 117 161 63L200 18L239 63C284 117 376 140 376 222V518Z"
        />
      </svg>
      <div className="portrait-plinth" aria-hidden="true" />
      <motion.div
        className="portrait-illustration"
        initial={shouldAnimate ? { opacity: 0, y: 24, scale: 0.96 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={config.media.portraitUrl}
          alt={config.media.portraitAlt}
          width="1064"
          height="1479"
          fetchPriority="high"
          decoding="async"
        />
      </motion.div>
      <span className="portrait-star portrait-star-one" aria-hidden="true">
        ✦
      </span>
      <span className="portrait-star portrait-star-two" aria-hidden="true">
        ✧
      </span>
      <span className="portrait-star portrait-star-three" aria-hidden="true">
        ✧
      </span>
    </div>
  );
}
