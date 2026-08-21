"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowUpRight,
  Building2,
  Check,
  CircleAlert,
  Eye,
  Filter,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  RefreshCcw,
  RotateCcw,
  Search,
  ShieldBan,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Trash2,
  UserRound,
  UserRoundCheck,
  X,
} from "lucide-react";

import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import {
  managedRestaurants,
  type ManagedRestaurant,
  type MembershipStatus,
  type RestaurantPlan,
  type RestaurantStatus,
} from "@/data/dashboard-restaurants";
import {
  DEFAULT_RESTAURANT_REGISTRY_SNAPSHOT,
  getRestaurantRegistrySnapshot,
  getServerRestaurantRegistrySnapshot,
  parseRestaurantRegistry,
  saveRestaurantRegistry,
  subscribeRestaurantRegistry,
} from "@/lib/dashboard/restaurant-registry";
import { cn } from "@/lib/utils/cn";
import { ease } from "@/lib/utils/motion";
import { routes } from "@/lib/utils/routes";

type StatusFilter = "all" | RestaurantStatus;
type MembershipFilter = "all" | MembershipStatus;
type CityFilter = "all" | ManagedRestaurant["city"];
type SortOption = "recent" | "name" | "onboarding";
type DrawerState = { mode: "view" | "edit"; restaurantId: string } | null;

const statusMeta: Record<
  RestaurantStatus,
  { label: string; className: string; dot: string }
> = {
  active: {
    label: "Active",
    className: "bg-success-soft text-success",
    dot: "bg-success",
  },
  inactive: {
    label: "Inactive",
    className: "bg-muted text-muted-foreground",
    dot: "bg-muted-foreground",
  },
  blocked: {
    label: "Blocked",
    className: "bg-danger-soft text-danger",
    dot: "bg-danger",
  },
  pending: {
    label: "Pending onboarding",
    className: "bg-warning-soft text-warning",
    dot: "bg-warning",
  },
};

const membershipMeta: Record<
  MembershipStatus,
  { label: string; className: string }
> = {
  active: { label: "Active plan", className: "bg-success-soft text-success" },
  expiring: { label: "Expiring soon", className: "bg-warning-soft text-warning" },
  expired: { label: "Expired", className: "bg-danger-soft text-danger" },
  not_started: { label: "Not started", className: "bg-muted text-muted-foreground" },
};

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(value: string | null): string {
  return value ? dateFormatter.format(new Date(value)) : "Not scheduled";
}

function formatLastActive(value: string | null): string {
  return value ? dateTimeFormatter.format(new Date(value)) : "Awaiting launch";
}

function getToggleExplanation(restaurant: ManagedRestaurant): string | null {
  if (restaurant.status === "blocked") return "Unblock this restaurant before activating it.";
  if (restaurant.status === "pending" || restaurant.onboardingProgress < 100) {
    return "Complete onboarding before activating this restaurant.";
  }
  if (restaurant.status === "inactive" && restaurant.membership === "expired") {
    return "Renew the membership before activating this restaurant.";
  }
  return null;
}

function normalizeUnblockedStatus(
  status: Exclude<RestaurantStatus, "blocked">,
  onboardingProgress: number,
  membership: MembershipStatus,
): Exclude<RestaurantStatus, "blocked"> {
  if (onboardingProgress < 100) return "pending";
  if (status === "pending") return "inactive";
  if (status === "active" && membership === "expired") return "inactive";
  return status;
}

function IconAction({
  label,
  tone = "default",
  children,
  onClick,
}: {
  label: string;
  tone?: "default" | "warning" | "danger" | "success";
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-control border transition-[transform,border-color,background-color,color] hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        tone === "default" &&
          "border-border bg-card text-muted-foreground hover:border-primary/35 hover:bg-primary-soft hover:text-primary-strong",
        tone === "warning" &&
          "border-warning/20 bg-warning-soft text-warning hover:border-warning/45",
        tone === "danger" &&
          "border-danger/20 bg-danger-soft text-danger hover:border-danger/45",
        tone === "success" &&
          "border-success/20 bg-success-soft text-success hover:border-success/45",
      )}
    >
      {children}
    </button>
  );
}

function RestaurantActions({
  restaurant,
  onEdit,
  onToggleBlock,
  onDelete,
}: {
  restaurant: ManagedRestaurant;
  onEdit: () => void;
  onToggleBlock: () => void;
  onDelete: () => void;
}) {
  const blocked = restaurant.status === "blocked";
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Actions for ${restaurant.name}`}>
      <Link
        href={routes.dashboardRestaurant(restaurant.id)}
        aria-label={`Open full details for ${restaurant.name}`}
        title={`Open full details for ${restaurant.name}`}
        className="grid size-10 shrink-0 place-items-center rounded-control border border-border bg-card text-muted-foreground transition-[transform,border-color,background-color,color] hover:-translate-y-0.5 hover:border-primary/35 hover:bg-primary-soft hover:text-primary-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Eye className="size-4" aria-hidden="true" />
      </Link>
      <IconAction label={`Edit ${restaurant.name}`} onClick={onEdit}>
        <PencilLine className="size-4" aria-hidden="true" />
      </IconAction>
      <IconAction
        label={`${blocked ? "Unblock" : "Block"} ${restaurant.name}`}
        tone={blocked ? "success" : "warning"}
        onClick={onToggleBlock}
      >
        {blocked ? (
          <ShieldCheck className="size-4" aria-hidden="true" />
        ) : (
          <ShieldBan className="size-4" aria-hidden="true" />
        )}
      </IconAction>
      <IconAction label={`Delete ${restaurant.name}`} tone="danger" onClick={onDelete}>
        <Trash2 className="size-4" aria-hidden="true" />
      </IconAction>
    </div>
  );
}

function StatusControl({
  restaurant,
  onToggle,
}: {
  restaurant: ManagedRestaurant;
  onToggle: () => void;
}) {
  const active = restaurant.status === "active";
  const explanation = getToggleExplanation(restaurant);
  const disabled = Boolean(explanation);
  const meta = statusMeta[restaurant.status];
  const label = disabled
    ? `${restaurant.name}: ${meta.label}. ${explanation}`
    : `${active ? "Deactivate" : "Activate"} ${restaurant.name}`;

  return (
    <div className="min-w-[6.75rem]">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-pill px-2.5 py-1 text-[0.625rem] font-bold",
          meta.className,
        )}
      >
        <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden="true" />
        {meta.label}
      </span>
      <div className="mt-2 flex h-6 items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={active}
          aria-label={label}
          title={label}
          disabled={disabled}
          onClick={onToggle}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-pill border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45",
            active ? "border-success bg-success" : "border-border bg-muted",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-0.5 left-0.5 size-4.5 rounded-full bg-card shadow-soft transition-transform",
              active ? "translate-x-[1.375rem]" : "translate-x-0",
            )}
          />
        </button>
        <span className="w-5 text-left text-[0.6875rem] font-semibold text-muted-foreground">
          {active ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
}

function MembershipCell({ restaurant }: { restaurant: ManagedRestaurant }) {
  const meta = membershipMeta[restaurant.membership];
  return (
    <div>
      <span className={cn("inline-flex rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", meta.className)}>
        {meta.label}
      </span>
      <p className="mt-2 text-[0.6875rem] text-muted-foreground">
        {restaurant.membershipExpiresAt
          ? `${restaurant.membership === "expired" ? "Expired" : restaurant.membership === "expiring" ? "Ends" : "Renews"} ${formatDate(restaurant.membershipExpiresAt)}`
          : restaurant.plan}
      </p>
    </div>
  );
}

function OnboardingCell({ restaurant }: { restaurant: ManagedRestaurant }) {
  const complete = restaurant.onboardingProgress === 100;
  return (
    <div className="min-w-28">
      <div className="flex items-center justify-between gap-3 text-[0.6875rem]">
        <span className="font-semibold text-foreground">{complete ? "Complete" : "In progress"}</span>
        <span className="font-bold text-muted-foreground tabular-nums">
          {restaurant.onboardingProgress}%
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-muted">
        <motion.span
          className={cn("block h-full rounded-pill", complete ? "bg-success" : "bg-warning")}
          initial={false}
          animate={{ width: `${restaurant.onboardingProgress}%` }}
          transition={{ duration: 0.35, ease }}
        />
      </div>
    </div>
  );
}

function PerformanceCell({ restaurant }: { restaurant: ManagedRestaurant }) {
  return (
    <div className="space-y-1 text-[0.6875rem] text-muted-foreground">
      <p className="flex items-center gap-1.5">
        <Star className="size-3 fill-star text-star" aria-hidden="true" />
        <strong className="font-bold text-foreground tabular-nums">
          {restaurant.rating ? restaurant.rating.toFixed(1) : "New"}
        </strong>
        <span>rating</span>
      </p>
      <p className="tabular-nums">
        <strong className="font-bold text-foreground">
          {restaurant.ordersThisMonth.toLocaleString("en-IN")}
        </strong>{" "}
        orders · {restaurant.outletCount} {restaurant.outletCount === 1 ? "outlet" : "outlets"}
      </p>
    </div>
  );
}

function RestaurantIdentity({ restaurant }: { restaurant: ManagedRestaurant }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative grid size-11 shrink-0 place-items-center rounded-control bg-ink text-xs font-extrabold text-ink-foreground shadow-soft">
        {getInitials(restaurant.name)}
        <span
          className={cn(
            "absolute -right-1 -bottom-1 size-3 rounded-full border-2 border-card",
            statusMeta[restaurant.status].dot,
          )}
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0">
        <Link
          href={routes.dashboardRestaurant(restaurant.id)}
          className="group/name flex max-w-full items-center gap-1 text-sm font-bold text-foreground outline-none transition-colors hover:text-primary-strong focus-visible:text-primary-strong focus-visible:underline"
        >
          <span className="truncate">{restaurant.name}</span>
          <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/name:opacity-100 group-focus-visible/name:opacity-100" aria-hidden="true" />
        </Link>
        <span className="mt-0.5 flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
          <MapPin className="size-3 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {restaurant.locality}, {restaurant.city}
          </span>
        </span>
      </span>
    </div>
  );
}

function SelectFilter({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label htmlFor={id} className="block min-w-0 w-full">
      <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </span>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-control border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MiniBars({ values, tone }: { values: number[]; tone: string }) {
  const max = Math.max(...values);
  return (
    <span className="flex h-8 items-end gap-1" aria-hidden="true">
      {values.map((value, index) => (
        <motion.span
          key={`${value}-${index}`}
          className={cn("w-1.5 rounded-t-sm", tone)}
          initial={{ height: 4 }}
          whileInView={{ height: `${Math.max(18, (value / max) * 100)}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: index * 0.035 }}
        />
      ))}
    </span>
  );
}

function DialogSurface({
  role = "dialog",
  labelId,
  onClose,
  side = false,
  children,
}: {
  role?: "dialog" | "alertdialog";
  labelId: string;
  onClose: () => void;
  side?: boolean;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]',
    );
    if (!focusables?.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <motion.div
      className={cn(
        "fixed inset-0 z-70 flex p-3 sm:p-5",
        side ? "justify-end" : "items-center justify-center",
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 -z-10 cursor-default bg-ink/50 backdrop-blur-sm"
      />
      <motion.div
        ref={panelRef}
        role={role}
        aria-modal="true"
        aria-labelledby={labelId}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, x: side ? 24 : 0, y: side ? 0 : 12, scale: side ? 1 : 0.98 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: side ? 18 : 0, y: side ? 0 : 8, scale: side ? 1 : 0.99 }}
        transition={{ duration: 0.24, ease }}
        className={cn(
          "overflow-hidden rounded-panel border border-border bg-card shadow-lift",
          side
            ? "h-full max-h-[calc(100dvh-1.5rem)] w-full max-w-xl sm:max-h-[calc(100dvh-2.5rem)]"
            : "w-full max-w-md",
        )}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function RestaurantDrawer({
  restaurant,
  mode,
  onClose,
  onSave,
}: {
  restaurant: ManagedRestaurant;
  mode: "view" | "edit";
  onClose: () => void;
  onSave: (restaurant: ManagedRestaurant) => void;
}) {
  const [draft, setDraft] = useState(restaurant);
  const titleId = `restaurant-${mode}-title`;

  function update<K extends keyof ManagedRestaurant>(key: K, value: ManagedRestaurant[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const progress = Math.min(100, Math.max(0, Number(draft.onboardingProgress)));
    let status = draft.status;
    let statusBeforeBlock = draft.statusBeforeBlock;
    if (status === "blocked") {
      statusBeforeBlock = normalizeUnblockedStatus(
        statusBeforeBlock ?? "inactive",
        progress,
        draft.membership,
      );
    } else {
      status = normalizeUnblockedStatus(status, progress, draft.membership);
    }
    onSave({ ...draft, onboardingProgress: progress, status, statusBeforeBlock });
  }

  return (
    <DialogSurface labelId={titleId} onClose={onClose} side>
      <div className="flex h-full flex-col">
        <div className="flex items-start gap-4 border-b border-border px-5 py-5 sm:px-6">
          <span className="grid size-11 shrink-0 place-items-center rounded-control bg-ink text-sm font-extrabold text-ink-foreground">
            {getInitials(restaurant.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.625rem] font-bold tracking-[0.13em] text-primary-strong uppercase">
              {mode === "edit" ? "Edit account" : "Restaurant profile"}
            </p>
            <h2 id={titleId} className="mt-1 truncate text-xl font-extrabold text-foreground">
              {restaurant.name}
            </h2>
          </div>
          <button
            type="button"
            autoFocus={mode === "view"}
            onClick={onClose}
            aria-label="Close restaurant panel"
            className="grid size-10 shrink-0 place-items-center rounded-control text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {mode === "view" ? (
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            <div className="flex flex-wrap gap-2">
              <span className={cn("rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", statusMeta[restaurant.status].className)}>
                {statusMeta[restaurant.status].label}
              </span>
              <span className={cn("rounded-pill px-2.5 py-1 text-[0.625rem] font-bold", membershipMeta[restaurant.membership].className)}>
                {membershipMeta[restaurant.membership].label}
              </span>
            </div>

            <section aria-labelledby="identity-title" className="mt-6 rounded-card border border-border p-4">
              <h3 id="identity-title" className="text-xs font-extrabold tracking-wide text-foreground uppercase">Identity & owner</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <DetailRow icon={MapPin} label="Location" value={`${restaurant.locality}, ${restaurant.city}`} />
                <DetailRow icon={UserRound} label="Owner" value={restaurant.ownerName} />
                <DetailRow icon={Mail} label="Email" value={restaurant.email} />
                <DetailRow icon={Phone} label="Phone" value={restaurant.phone} />
              </dl>
            </section>

            <section aria-labelledby="account-title" className="mt-4 rounded-card border border-border p-4">
              <h3 id="account-title" className="text-xs font-extrabold tracking-wide text-foreground uppercase">Account health</h3>
              <dl className="mt-4 grid grid-cols-2 gap-4">
                <StatDetail label="Plan" value={restaurant.plan} />
                <StatDetail label="Plan renewal" value={formatDate(restaurant.membershipExpiresAt)} />
                <StatDetail label="Joined" value={formatDate(restaurant.joinedAt)} />
                <StatDetail label="Last active" value={formatLastActive(restaurant.lastActiveAt)} />
              </dl>
              <div className="mt-5 border-t border-border pt-4">
                <OnboardingCell restaurant={restaurant} />
              </div>
            </section>

            <section aria-labelledby="performance-title" className="mt-4 rounded-card bg-ink p-5 text-ink-foreground">
              <h3 id="performance-title" className="text-xs font-extrabold tracking-wide uppercase">This month</h3>
              <dl className="mt-4 grid grid-cols-3 gap-3">
                <DarkStat label="Orders" value={restaurant.ordersThisMonth.toLocaleString("en-IN")} />
                <DarkStat label="Rating" value={restaurant.rating ? restaurant.rating.toFixed(1) : "New"} />
                <DarkStat label="Outlets" value={String(restaurant.outletCount)} />
              </dl>
            </section>
          </div>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Restaurant name" value={draft.name} onChange={(value) => update("name", value)} required autoFocus />
                <TextField label="Owner name" value={draft.ownerName} onChange={(value) => update("ownerName", value)} required />
                <TextField label="Email" type="email" value={draft.email} onChange={(value) => update("email", value)} required />
                <TextField label="Phone" type="tel" value={draft.phone} onChange={(value) => update("phone", value)} required />
                <TextField label="Locality" value={draft.locality} onChange={(value) => update("locality", value)} required />
                <EditSelect
                  label="City"
                  value={draft.city}
                  onChange={(value) => update("city", value as ManagedRestaurant["city"])}
                  options={["Delhi", "Gurugram", "Noida"]}
                />
                <EditSelect
                  label="Plan"
                  value={draft.plan}
                  onChange={(value) => update("plan", value as RestaurantPlan)}
                  options={["Restaurant Pro", "Digital Presence", "QR Starter"]}
                />
                <EditSelect
                  label="Membership"
                  value={draft.membership}
                  onChange={(value) => {
                    const nextMembership = value as MembershipStatus;
                    setDraft((current) => ({
                      ...current,
                      membership: nextMembership,
                      membershipExpiresAt:
                        nextMembership === current.membership
                          ? current.membershipExpiresAt
                          : null,
                    }));
                  }}
                  options={["active", "expiring", "expired", "not_started"]}
                  labelForValue={(value) => membershipMeta[value as MembershipStatus].label}
                />
                <TextField
                  label="Membership date"
                  type="date"
                  value={draft.membershipExpiresAt ?? ""}
                  onChange={(value) => update("membershipExpiresAt", value || null)}
                  required={draft.membership !== "not_started"}
                />
                <div>
                  <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">Outlets</span>
                  <div className="flex h-11 items-center justify-between rounded-control border border-border bg-muted/55 px-3 text-sm font-semibold text-foreground">
                    <span>{draft.outletCount}</span>
                    <span className="text-[0.625rem] text-muted-foreground">Network synced</span>
                  </div>
                </div>
                <TextField
                  label="Onboarding progress"
                  type="number"
                  min={0}
                  max={100}
                  value={String(draft.onboardingProgress)}
                  onChange={(value) => update("onboardingProgress", Number(value))}
                  required
                  suffix="%"
                />
              </div>
              <div className="rounded-card bg-primary-soft p-4 text-xs leading-relaxed text-primary-strong">
                Progress below 100% moves the restaurant into pending onboarding. Completing onboarding leaves it inactive until you activate it from the list.
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">
              <button type="button" onClick={onClose} className="h-10 rounded-pill border border-border px-4 text-sm font-bold text-muted-foreground hover:text-foreground">
                Cancel
              </button>
              <button type="submit" className="inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-4 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
                <Check className="size-4" aria-hidden="true" /> Save changes
              </button>
            </div>
          </form>
        )}
      </div>
    </DialogSurface>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1.75rem_1fr] gap-2.5">
      <Icon className="mt-0.5 size-4 text-primary-strong" aria-hidden="true" />
      <div>
        <dt className="text-[0.625rem] font-bold tracking-wide text-muted-foreground uppercase">{label}</dt>
        <dd className="mt-0.5 break-words font-semibold text-foreground">{value}</dd>
      </div>
    </div>
  );
}

function StatDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.625rem] font-bold tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-sm font-bold text-foreground">{value}</dd>
    </div>
  );
}

function DarkStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.625rem] font-bold tracking-wide text-ink-muted uppercase">{label}</dt>
      <dd className="mt-1 text-xl font-extrabold tabular-nums">{value}</dd>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required,
  autoFocus,
  min,
  max,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel" | "number" | "date";
  required?: boolean;
  autoFocus?: boolean;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">{label}</span>
      <span className="relative block">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          autoFocus={autoFocus}
          min={min}
          max={max}
          className="h-11 w-full rounded-control border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        {suffix ? <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-muted-foreground">{suffix}</span> : null}
      </span>
    </label>
  );
}

function EditSelect({
  label,
  value,
  onChange,
  options,
  labelForValue = (item) => item,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  labelForValue?: (value: string) => string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-control border border-border bg-card px-3 text-sm font-semibold text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        {options.map((option) => <option key={option} value={option}>{labelForValue(option)}</option>)}
      </select>
    </label>
  );
}

export function RestaurantManagement() {
  const snapshot = useSyncExternalStore(
    subscribeRestaurantRegistry,
    getRestaurantRegistrySnapshot,
    getServerRestaurantRegistrySnapshot,
  );
  const records = useMemo(() => parseRestaurantRegistry(snapshot), [snapshot]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [membership, setMembership] = useState<MembershipFilter>("all");
  const [city, setCity] = useState<CityFilter>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const previousFocus = useRef<HTMLElement | null>(null);
  const registryHeadingRef = useRef<HTMLHeadingElement>(null);

  const selectedRestaurant = drawer
    ? records.find((restaurant) => restaurant.id === drawer.restaurantId) ?? null
    : null;
  const deleteTarget = deleteTargetId
    ? records.find((restaurant) => restaurant.id === deleteTargetId) ?? null
    : null;
  const modalOpen = Boolean(drawer || deleteTargetId);

  useEffect(() => {
    if (!modalOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen && previousFocus.current) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [modalOpen]);

  const metrics = useMemo(() => {
    const active = records.filter((record) => record.status === "active").length;
    const expired = records.filter((record) => record.membership === "expired").length;
    const pending = records.filter((record) => record.onboardingProgress < 100).length;
    return { total: records.length, active, expired, pending };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    const result = records.filter((restaurant) => {
      const searchable = [
        restaurant.name,
        restaurant.ownerName,
        restaurant.email,
        restaurant.locality,
        restaurant.city,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!query || searchable.includes(query)) &&
        (status === "all" ||
          (status === "pending"
            ? restaurant.onboardingProgress < 100
            : restaurant.status === status)) &&
        (membership === "all" || restaurant.membership === membership) &&
        (city === "all" || restaurant.city === city)
      );
    });

    return result.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "onboarding") return a.onboardingProgress - b.onboardingProgress;
      const aTime = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
      const bTime = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [city, membership, records, search, sort, status]);

  const filtersActive = Boolean(
    search || status !== "all" || membership !== "all" || city !== "all" || sort !== "recent",
  );
  const activeRate = metrics.total ? Math.round((metrics.active / metrics.total) * 100) : 0;
  const onboardingAverage = metrics.total
    ? Math.round(records.reduce((total, item) => total + item.onboardingProgress, 0) / metrics.total)
    : 0;
  const renewalsAtRisk = records.filter((item) => item.membership === "expiring" || item.membership === "expired").length;
  const registryChanged = snapshot !== DEFAULT_RESTAURANT_REGISTRY_SNAPSHOT;

  function rememberFocus() {
    previousFocus.current = document.activeElement as HTMLElement | null;
  }

  function openDrawer(mode: "view" | "edit", restaurantId: string) {
    rememberFocus();
    setDrawer({ mode, restaurantId });
  }

  function openDelete(restaurantId: string) {
    rememberFocus();
    setDeleteTargetId(restaurantId);
  }

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setMembership("all");
    setCity("all");
    setSort("recent");
  }

  function applyMetricFilter(metric: "total" | "active" | "expired" | "pending") {
    setSearch("");
    setCity("all");
    setSort("recent");
    setStatus(metric === "active" ? "active" : metric === "pending" ? "pending" : "all");
    setMembership(metric === "expired" ? "expired" : "all");
  }

  function updateRestaurant(updated: ManagedRestaurant) {
    saveRestaurantRegistry(records.map((item) => (item.id === updated.id ? updated : item)));
    setDrawer(null);
    setAnnouncement(`${updated.name} was updated.`);
  }

  function toggleActive(restaurant: ManagedRestaurant) {
    if (getToggleExplanation(restaurant)) return;
    const nextStatus: RestaurantStatus = restaurant.status === "active" ? "inactive" : "active";
    saveRestaurantRegistry(records.map((item) => item.id === restaurant.id ? { ...item, status: nextStatus } : item));
    setAnnouncement(`${restaurant.name} is now ${nextStatus}.`);
  }

  function toggleBlock(restaurant: ManagedRestaurant) {
    const blocked = restaurant.status === "blocked";
    saveRestaurantRegistry(
      records.map((item) => {
        if (item.id !== restaurant.id) return item;
        if (blocked) {
          const restoredStatus = normalizeUnblockedStatus(
            item.statusBeforeBlock ?? "inactive",
            item.onboardingProgress,
            item.membership,
          );
          return { ...item, status: restoredStatus, statusBeforeBlock: undefined };
        }
        const statusBeforeBlock = item.status === "blocked" ? "inactive" : item.status;
        return { ...item, statusBeforeBlock, status: "blocked" };
      }),
    );
    setAnnouncement(`${restaurant.name} was ${blocked ? "unblocked" : "blocked"}.`);
  }

  function deleteRestaurant() {
    if (!deleteTarget) return;
    saveRestaurantRegistry(records.filter((item) => item.id !== deleteTarget.id));
    previousFocus.current = null;
    setDeleteTargetId(null);
    setAnnouncement(`${deleteTarget.name} was deleted from this browser's demo registry.`);
    window.requestAnimationFrame(() => registryHeadingRef.current?.focus());
  }

  function restoreDemo() {
    saveRestaurantRegistry(managedRestaurants);
    resetFilters();
    setDrawer(null);
    setDeleteTargetId(null);
    setAnnouncement("The demo restaurant registry was restored.");
  }

  const cardData = [
    {
      id: "total" as const,
      label: "Total restaurants",
      value: metrics.total,
      note: "Across 3 launch cities",
      icon: Building2,
      iconClass: "bg-primary-soft text-primary-strong",
      barClass: "bg-primary",
      values: [6, 7, 7, 8, 9, 10, 12],
      pressed: !search && city === "all" && status === "all" && membership === "all",
    },
    {
      id: "active" as const,
      label: "Active restaurants",
      value: metrics.active,
      note: `${activeRate}% of the network`,
      icon: Activity,
      iconClass: "bg-success-soft text-success",
      barClass: "bg-success",
      values: [3, 4, 4, 5, 6, 6, 7],
      pressed: !search && city === "all" && status === "active" && membership === "all",
    },
    {
      id: "expired" as const,
      label: "Expired memberships",
      value: metrics.expired,
      note: "Renewal action required",
      icon: CircleAlert,
      iconClass: "bg-danger-soft text-danger",
      barClass: "bg-danger",
      values: [1, 1, 2, 2, 3, 2, 2],
      pressed: !search && city === "all" && membership === "expired" && status === "all",
    },
    {
      id: "pending" as const,
      label: "Pending onboarding",
      value: metrics.pending,
      note: `${metrics.pending} profiles need attention`,
      icon: UserRoundCheck,
      iconClass: "bg-warning-soft text-warning",
      barClass: "bg-warning",
      values: [4, 3, 4, 3, 2, 3, 2],
      pressed: !search && city === "all" && status === "pending" && membership === "all",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[100rem]">
      <Reveal as="header" className="relative isolate overflow-hidden rounded-panel bg-ink px-5 py-7 text-ink-foreground shadow-lift sm:px-7 sm:py-8 lg:px-9">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(70%_100%_at_85%_10%,rgb(var(--primary-rgb)/0.42),transparent_70%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-[-4rem] -z-10 size-80 rounded-full border border-white/8" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 right-2 -z-10 size-56 rounded-full border border-white/8" />
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.55fr)]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[0.6875rem] font-bold tracking-[0.11em] text-[var(--accent)] uppercase">
                <Sparkles className="size-3.5" aria-hidden="true" /> Restaurant operations
              </span>
              <AnimatedBadge tone="success" pulse>Live registry</AnimatedBadge>
            </div>
            <h1 className="mt-5 max-w-3xl text-3xl leading-[1.04] font-extrabold tracking-[-0.05em] sm:text-4xl lg:text-5xl">
              Every restaurant. <span className="font-display font-normal text-[var(--accent)] italic">One control room.</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-muted sm:text-base">
              Monitor membership and onboarding health, then manage account access from one focused operations workspace.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-card border border-white/10 bg-white/[0.055] p-3 backdrop-blur-sm sm:p-4">
            <HeroStat label="Active rate" value={`${activeRate}%`} />
            <HeroStat label="Onboarded" value={`${onboardingAverage}%`} />
            <HeroStat label="At risk" value={String(renewalsAtRisk)} />
            <div aria-hidden="true" className="col-span-3 mt-1 flex h-7 items-center gap-1 overflow-hidden rounded-control bg-white/[0.035] px-2">
              {records.map((restaurant, index) => (
                <motion.span
                  key={restaurant.id}
                  className={cn("h-2 flex-1 rounded-pill", statusMeta[restaurant.status].dot)}
                  initial={{ opacity: 0.25, scaleX: 0.4 }}
                  animate={{ opacity: [0.45, 1, 0.45], scaleX: 1 }}
                  transition={{ duration: 2.4, delay: index * 0.08, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <RevealGroup className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" stagger={0.05}>
        {cardData.map((item) => {
          const Icon = item.icon;
          return (
            <RevealItem key={item.id}>
              <SpotlightCard className={cn("h-full", item.pressed && "border-primary/35 ring-2 ring-primary/10")}>
                <button
                  type="button"
                  onClick={() => applyMetricFilter(item.id)}
                  aria-pressed={item.pressed}
                  className="flex h-full w-full items-start gap-4 p-5 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-primary sm:p-6"
                >
                  <span className={cn("grid size-11 shrink-0 place-items-center rounded-control", item.iconClass)}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">{item.label}</span>
                    <span className="mt-2 flex items-end justify-between gap-3">
                      <strong className="text-3xl font-extrabold tracking-[-0.05em] text-foreground tabular-nums">{item.value}</strong>
                      <MiniBars values={item.values} tone={item.barClass} />
                    </span>
                    <span className="mt-2 block text-xs font-semibold text-muted-foreground">{item.note}</span>
                  </span>
                </button>
              </SpotlightCard>
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Reveal as="section" className="mt-5 rounded-panel border border-border bg-card p-4 shadow-card sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:items-end 2xl:grid-cols-[minmax(15rem,1.5fr)_minmax(8.5rem,0.9fr)_minmax(9.5rem,1fr)_minmax(7.5rem,0.8fr)_minmax(9rem,1fr)_auto]">
          <label className="min-w-0 sm:col-span-2 xl:col-span-1">
            <span className="mb-1.5 block text-[0.625rem] font-bold tracking-[0.12em] text-muted-foreground uppercase">Search registry</span>
            <span className="relative block">
              <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Restaurant, owner, email or locality"
                className="h-11 w-full rounded-control border border-border bg-card pr-3 pl-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </span>
          </label>

          <SelectFilter id="restaurant-status" label="Account" value={status} onChange={(value) => setStatus(value as StatusFilter)} options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "blocked", label: "Blocked" },
            { value: "pending", label: "Pending onboarding" },
          ]} />
          <SelectFilter id="restaurant-membership" label="Membership" value={membership} onChange={(value) => setMembership(value as MembershipFilter)} options={[
            { value: "all", label: "All memberships" },
            { value: "active", label: "Active" },
            { value: "expiring", label: "Expiring" },
            { value: "expired", label: "Expired" },
            { value: "not_started", label: "Not started" },
          ]} />
          <SelectFilter id="restaurant-city" label="City" value={city} onChange={(value) => setCity(value as CityFilter)} options={[
            { value: "all", label: "All cities" },
            { value: "Delhi", label: "Delhi" },
            { value: "Gurugram", label: "Gurugram" },
            { value: "Noida", label: "Noida" },
          ]} />
          <SelectFilter id="restaurant-sort" label="Sort" value={sort} onChange={(value) => setSort(value as SortOption)} options={[
            { value: "recent", label: "Recent activity" },
            { value: "name", label: "Name A–Z" },
            { value: "onboarding", label: "Onboarding progress" },
          ]} />

          <button
            type="button"
            onClick={resetFilters}
            disabled={!filtersActive}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-pill border border-border px-4 text-sm font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-40 sm:col-span-2 sm:w-auto sm:justify-self-end xl:col-span-1 xl:w-full xl:justify-self-stretch"
          >
            <RotateCcw className="size-4" aria-hidden="true" /> Reset
          </button>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p aria-live="polite" className="flex items-center gap-2">
            <Filter className="size-3.5" aria-hidden="true" />
            Showing <strong className="font-bold text-foreground tabular-nums">{filteredRecords.length}</strong> of {records.length} restaurants
          </p>
          <button
            type="button"
            onClick={restoreDemo}
            disabled={!registryChanged}
            className="inline-flex items-center gap-1.5 font-bold text-primary-strong hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline sm:ml-auto"
          >
            <RefreshCcw className="size-3.5" aria-hidden="true" /> Restore demo data
          </button>
        </div>
      </Reveal>

      <Reveal as="section" className="mt-5 overflow-hidden rounded-panel border border-border bg-card shadow-card">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.13em] text-primary-strong uppercase">Restaurant directory</p>
            <h2 ref={registryHeadingRef} tabIndex={-1} className="mt-1.5 text-xl font-extrabold text-foreground focus:outline-none">Manage every account</h2>
            <p className="mt-1 text-xs text-muted-foreground">Changes stay in this browser and update the overview instantly.</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-pill bg-success-soft px-3 py-1.5 text-xs font-bold text-success">
            <span className="size-2 rounded-full bg-success" aria-hidden="true" />
            {metrics.active} restaurants active
          </div>
        </div>

        {filteredRecords.length ? (
          <>
            <div className="grid divide-y divide-border xl:grid-cols-2 xl:gap-3 xl:divide-y-0 xl:p-3 2xl:hidden">
              {filteredRecords.map((restaurant) => (
                <article key={restaurant.id} className="p-5 xl:rounded-card xl:border xl:border-border">
                  <RestaurantIdentity restaurant={restaurant} />
                  <div className="mt-4 grid gap-4 rounded-card bg-muted/55 p-4 sm:grid-cols-2">
                    <StatusControl restaurant={restaurant} onToggle={() => toggleActive(restaurant)} />
                    <MembershipCell restaurant={restaurant} />
                    <div className="border-t border-border pt-3 sm:col-span-2"><OnboardingCell restaurant={restaurant} /></div>
                  </div>
                  <div className="mt-4"><PerformanceCell restaurant={restaurant} /></div>
                  <div className="mt-4 overflow-x-auto pb-1">
                    <RestaurantActions
                      restaurant={restaurant}
                      onEdit={() => openDrawer("edit", restaurant.id)}
                      onToggleBlock={() => toggleBlock(restaurant)}
                      onDelete={() => openDelete(restaurant.id)}
                    />
                  </div>
                </article>
              ))}
            </div>

            <div
              role="region"
              aria-label="Restaurant management table. Scroll horizontally to view every column."
              tabIndex={0}
              className="hidden overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary 2xl:block"
            >
              <table className="w-full min-w-[76rem] table-fixed border-collapse text-left">
                <caption className="sr-only">Restaurant accounts with owner, status, membership, onboarding, performance and management actions</caption>
                <colgroup>
                  <col className="w-[16%]" />
                  <col className="w-[13%]" />
                  <col className="w-[13%]" />
                  <col className="w-[12%]" />
                  <col className="w-[13%]" />
                  <col className="w-[15%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr className="bg-muted/55 text-[0.625rem] font-bold tracking-[0.11em] text-muted-foreground uppercase">
                    <th scope="col" className="px-5 py-3.5 sm:pl-6">Restaurant</th>
                    <th scope="col" className="px-3 py-3.5">Owner & contact</th>
                    <th scope="col" className="px-3 py-3.5">Account</th>
                    <th scope="col" className="px-3 py-3.5">Membership</th>
                    <th scope="col" className="px-3 py-3.5">Onboarding</th>
                    <th scope="col" className="px-3 py-3.5">Performance</th>
                    <th scope="col" className="sticky right-0 z-10 border-l border-border/60 bg-muted px-3 py-3.5 pr-5 shadow-[-12px_0_20px_-22px_rgb(0_0_0/0.5)] sm:pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((restaurant) => (
                    <motion.tr
                      layout="position"
                      key={restaurant.id}
                      className="group border-t border-border/80 transition-colors hover:bg-primary-soft/35"
                    >
                      <th scope="row" className="px-5 py-4 align-middle font-normal sm:pl-6"><RestaurantIdentity restaurant={restaurant} /></th>
                      <td className="px-3 py-4 align-middle">
                        <p className="text-sm font-bold text-foreground">{restaurant.ownerName}</p>
                        <p className="mt-1 max-w-48 truncate text-[0.6875rem] text-muted-foreground">{restaurant.email}</p>
                      </td>
                      <td className="px-3 py-4 align-middle"><StatusControl restaurant={restaurant} onToggle={() => toggleActive(restaurant)} /></td>
                      <td className="px-3 py-4 align-middle"><MembershipCell restaurant={restaurant} /></td>
                      <td className="px-3 py-4 align-middle"><OnboardingCell restaurant={restaurant} /></td>
                      <td className="px-3 py-4 align-middle"><PerformanceCell restaurant={restaurant} /></td>
                      <td className="sticky right-0 z-[1] border-l border-border/60 bg-card px-3 py-4 pr-5 align-middle shadow-[-12px_0_20px_-22px_rgb(0_0_0/0.5)] transition-colors group-hover:bg-primary-soft/35 sm:pr-6">
                        <RestaurantActions
                          restaurant={restaurant}
                          onEdit={() => openDrawer("edit", restaurant.id)}
                          onToggleBlock={() => toggleBlock(restaurant)}
                          onDelete={() => openDelete(restaurant.id)}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="grid min-h-80 place-items-center px-6 text-center">
            <div>
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary-strong">
                <Store className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-foreground">No restaurants found</h3>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">Try a different search or clear the filters to restore the complete directory.</p>
              <button type="button" onClick={resetFilters} className="mt-4 inline-flex h-10 items-center gap-2 rounded-pill bg-primary px-4 text-sm font-bold text-primary-foreground">
                <RotateCcw className="size-4" aria-hidden="true" /> Reset filters
              </button>
            </div>
          </div>
        )}
      </Reveal>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>

      <AnimatePresence>
        {drawer && selectedRestaurant ? (
          <RestaurantDrawer
            key={`${drawer.mode}-${selectedRestaurant.id}`}
            restaurant={selectedRestaurant}
            mode={drawer.mode}
            onClose={() => setDrawer(null)}
            onSave={updateRestaurant}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget ? (
          <DialogSurface role="alertdialog" labelId="delete-restaurant-title" onClose={() => setDeleteTargetId(null)}>
            <div className="p-5 sm:p-6">
              <span className="grid size-12 place-items-center rounded-full bg-danger-soft text-danger">
                <Trash2 className="size-5" aria-hidden="true" />
              </span>
              <h2 id="delete-restaurant-title" className="mt-5 text-xl font-extrabold text-foreground">Delete {deleteTarget.name}?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                This removes the restaurant from this browser&rsquo;s demo registry. You can restore the original demo data later.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  autoFocus
                  onClick={() => setDeleteTargetId(null)}
                  className="h-10 rounded-pill border border-border px-4 text-sm font-bold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={deleteRestaurant}
                  className="inline-flex h-10 items-center gap-2 rounded-pill bg-danger px-4 text-sm font-bold text-background transition-transform hover:-translate-y-0.5"
                >
                  <Trash2 className="size-4" aria-hidden="true" /> Delete restaurant
                </button>
              </div>
            </div>
          </DialogSurface>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.5625rem] font-bold tracking-[0.12em] text-ink-muted uppercase">{label}</p>
      <p className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-ink-foreground tabular-nums">{value}</p>
    </div>
  );
}
