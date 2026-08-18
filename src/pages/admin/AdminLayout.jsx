import { useState } from "react";
import {
  NavLink,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Leaf,
  Users,
  BarChart3,
  UserCog,
  Boxes,
  MessagesSquare,
  MailPlus,
  Bell,
} from "lucide-react";

import { useAuthStore } from "../../store/user/authStore.js";

const STAFF_ROLES = ["admin", "staff"];

const can = (role, permission) => {
  const permissions = {
    admin: [
      "manage_orders",
      "manage_products",
      "manage_wholesalers",
      "manage_invites",
      "view_analytics",
      "manage_staff",
    ],

    staff: ["manage_orders", "manage_products"],
  };

  return permissions[role]?.includes(permission) ?? false;
};

const allNavItems = [
  {
    to: "/admin",
    label: "Overview",
    icon: LayoutDashboard,
    end: true,
    perm: null,
  },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: ShoppingBag,
    perm: "manage_orders",
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
    perm: "manage_products",
  },
  {
    to: "/admin/stock-requests",
    label: "Stock Requests",
    icon: Boxes,
    perm: "manage_products",
  },
  {
    to: "/admin/queries",
    label: "Queries",
    icon: MessagesSquare,
    perm: "manage_orders",
  },
  {
    to: "/admin/wholesalers",
    label: "Wholesalers",
    icon: Users,
    perm: "manage_wholesalers",
  },
  {
    to: "/admin/wholesaler-invites",
    label: "Invites",
    icon: MailPlus,
    perm: "manage_invites",
  },
  {
    to: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    perm: "view_analytics",
  },
  {
    to: "/admin/staff",
    label: "Staff",
    icon: UserCog,
    perm: "manage_staff",
  },
];

const NOTIFICATION_COUNT = 4;

const AdminLayout = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const navigate = useNavigate();
  const location = useLocation();

  const [notifOpen, setNotifOpen] = useState(false);

  // Not logged in
  if (!user) {
    return <Navigate to="/wholesaler" replace />;
  }

  // Logged in but not staff/admin
  if (!STAFF_ROLES.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const navItems = allNavItems.filter(
    (item) => !item.perm || can(user.role, item.perm),
  );

  const handleLogout = () => {
    logout();
    navigate("/wholesaler");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ==================== SIDEBAR ==================== */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl p-5">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background">
            <Leaf className="w-3.5 h-3.5" />
          </span>

          <span className="font-display text-lg font-bold text-foreground">
            HerbaVita Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="admin-nav-active"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  )}

                  <item.icon className="w-4 h-4 relative z-10" />

                  <span className="relative z-10">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-border pt-4 space-y-3">
          <div className="text-xs">
            <div className="text-muted-foreground">Signed in as</div>

            <div className="font-medium text-foreground truncate">
              {user.email}
            </div>

            <div className="text-muted-foreground capitalize mt-1">
              Role: {user.role}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ==================== MAIN ==================== */}
      <main className="flex-1 min-w-0">
        {/* ==================== TOP BAR ==================== */}
        <div className="flex items-center justify-between px-4 md:px-10 py-3 border-b border-border bg-card/50 backdrop-blur-xl">
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background">
              <Leaf className="w-3 h-3" />
            </span>

            <span className="font-display text-base font-bold text-foreground">
              Admin
            </span>
          </div>

          {/* Desktop Status */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              animate={{
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            Real-time updates active
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.08,
                }}
                whileTap={{
                  scale: 0.94,
                }}
                onClick={() => setNotifOpen((value) => !value)}
                className="relative text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-[19px] h-[19px]" />

                {NOTIFICATION_COUNT > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                    {NOTIFICATION_COUNT}
                  </span>
                )}
              </motion.button>

              {/* Notification dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-8 z-50 w-72 rounded-xl border border-border bg-card shadow-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm">Notifications</h3>

                    <span className="text-xs text-muted-foreground">
                      {NOTIFICATION_COUNT} new
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    No notification details available yet.
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="md:hidden text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>

        {/* ==================== MOBILE NAVIGATION ==================== */}
        <div className="md:hidden flex gap-1 overflow-x-auto px-4 py-2 border-b border-border">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`
              }
            >
              <item.icon className="w-3.5 h-3.5" />

              {item.label}
            </NavLink>
          ))}
        </div>

        {/* ==================== PAGE CONTENT ==================== */}
        <motion.div
          key={location.pathname}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="p-6 md:p-10"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
