import { Aurora, EyebrowPill, GradientText, StickyBanner } from "performative-ui";

export default function PageHero({
  banner,
  eyebrow,
  statusColor,
  title,
  subtitle,
  children,
  ambient = true
}) {
  return (
    <section className={`page-hero ${ambient ? "page-hero-ambient" : "page-hero-quiet"}`}>
      {ambient && <Aurora className="page-hero-aurora" blur={72} />}

      <div className="page-hero-content">
        {banner && <StickyBanner>{banner}</StickyBanner>}
        {eyebrow && <EyebrowPill statusColor={statusColor}>{eyebrow}</EyebrowPill>}
        <h1 className="page-hero-title">
          <GradientText as="span">{title}</GradientText>
        </h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
