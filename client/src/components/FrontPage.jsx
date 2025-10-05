import { motion } from 'framer-motion';
import { Map, Loader } from 'lucide-react';
import GlassCard from './GlassCard';

const FrontPage = ({ selectedRoute, routes = [], className = '' }) => {
  return (
    <GlassCard className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage/10 to-accent/10">
        <div className="text-center">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Map className="w-16 h-16 text-sage mx-auto mb-4 opacity-50" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Map View</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Interactive map showing your eco-friendly routes.
            {selectedRoute && (
              <>
                <br /><br />
                <strong className="text-accent">Selected:</strong> {selectedRoute.name}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Route visualization overlay */}
      {selectedRoute && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4"
        >
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-soft">
            <div className="text-xs text-gray-600">Route Preview</div>
            <div className="text-sm font-semibold text-gray-800">{selectedRoute.name}</div>
          </div>
        </motion.div>
      )}

      {/* Loading state for map */}
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-4 left-4"
      >
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader className="w-3 h-3 animate-spin" />
          <span>Loading map data...</span>
        </div>
      </motion.div>
    </GlassCard>
  );
};

export default FrontPage;
