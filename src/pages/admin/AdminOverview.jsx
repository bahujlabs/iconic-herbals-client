import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Clock, Package, DollarSign } from "lucide-react";

// Replace with real data fetching (e.g. react-query) — mock shape shown here.
const ORDERS = [
  {
    id: "ORD-1042",
    customer: "Amara Okafor",
    date: "2026-04-22",
    total: 138,
    status: "completed",
  },
  {
    id: "ORD-1041",
    customer: "Liam Chen",
    date: "2026-04-21",
    total: 39,
    status: "pending",
  },
  {
    id: "ORD-1040",
    customer: "Sofia Martins",
    date: "2026-04-20",
    total: 108,
    status: "pending",
  },
  {
    id: "ORD-1039",
    customer: "Noah Becker",
    date: "2026-04-19",
    total: 69,
    status: "pending",
  },
];

const PRODUCT_COUNT = 2;

const STATUS_STYLES = {
  completed: "bg-primary/10 text-primary",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  processing: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  shipped: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  delivered: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
};

function StatusPill({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
        STATUS_STYLES[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

const container = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const item = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function StatCard({ icon: Icon, value, label }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-border bg-card p-6"
    >
      <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="font-display text-3xl font-bold text-foreground">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

const AdminOverview = () => {
  const navigate = useNavigate();

  const revenue = ORDERS.reduce(
    (sum, o) => (o.status === "completed" ? sum + o.total : sum),
    0,
  );
  const pending = ORDERS.filter((o) => o.status === "pending").length;

  return (
    <motion.div variants={container} initial="initial" animate="animate">
      <motion.h1 variants={item} className="font-display text-3xl font-bold text-foreground">
        Overview
      </motion.h1>
      <motion.p variants={item} className="mt-1 text-sm text-muted-foreground">
        A snapshot of your store performance.
      </motion.p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ShoppingBag} value={ORDERS.length} label="Total Orders" />
        <StatCard icon={Clock} value={pending} label="Pending" />
        <StatCard icon={Package} value={PRODUCT_COUNT} label="Products" />
        <StatCard icon={DollarSign} value={`$${revenue}`} label="Revenue" />
      </div>

      <motion.h2
        variants={item}
        className="mt-10 mb-4 font-display text-lg font-bold text-foreground"
      >
        Recent Orders
      </motion.h2>

      <motion.div
        variants={item}
        className="overflow-hidden rounded-xl border border-border bg-card"
      >
        {ORDERS.map((o, i) => (
          <button
            key={o.id}
            onClick={() => navigate("/admin/orders")}
            className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-muted ${
              i !== ORDERS.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div>
              <div className="text-sm font-semibold text-foreground">{o.id}</div>
              <div className="text-xs text-muted-foreground">
                {o.customer} · {o.date}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground">${o.total}</span>
              <StatusPill status={o.status} />
            </div>
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AdminOverview;
