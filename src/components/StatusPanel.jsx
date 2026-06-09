import { Link } from "react-router";
import { Button, GlassCard, StatusDot } from "performative-ui";

const statusColors = {
  info: "#38bdf8",
  success: "#4ade80",
  warning: "#facc15",
  danger: "#fb7185"
};

export default function StatusPanel({
  tone = "info",
  title,
  children,
  actionLabel,
  actionTo,
  onAction
}) {
  const action =
    actionLabel && actionTo ? (
      <Button as={Link} to={actionTo} variant="glow">
        {actionLabel}
      </Button>
    ) : actionLabel && onAction ? (
      <Button type="button" onClick={onAction} variant="ghost">
        {actionLabel}
      </Button>
    ) : null;

  return (
    <GlassCard className={`status-panel status-panel-${tone}`}>
      <p className="status-panel-kicker">
        <StatusDot color={statusColors[tone]} /> {title}
      </p>
      {children && <p className="status-panel-copy">{children}</p>}
      {action && <div className="status-panel-action">{action}</div>}
    </GlassCard>
  );
}
