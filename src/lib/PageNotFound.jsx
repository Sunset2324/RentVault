import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { Home, AlertTriangle, Package } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Package className="w-12 h-12 text-primary/40" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
            </div>
          </motion.div>

          {/* 404 text */}
          <div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-8xl font-extrabold text-primary/20 tracking-tighter leading-none"
            >
              404
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 space-y-2"
            >
              <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
              <p className="text-muted-foreground">
                The page{" "}
                <span className="font-medium text-foreground bg-muted px-2 py-0.5 rounded-md text-sm">
                  /{pageName}
                </span>{" "}
                does not exist or has been moved.
              </p>
            </motion.div>
          </div>

          {/* Admin note */}
          {isAuthenticated && isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-orange-800">Admin Note</p>
                  <p className="text-sm text-orange-700 mt-0.5">This page has not been implemented yet.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-full text-sm hover:bg-primary/90 transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <Link
              to={createPageUrl("ProductCatalog")}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-muted text-foreground font-medium rounded-full text-sm hover:bg-muted/80 transition-colors"
            >
              Browse Catalog
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}