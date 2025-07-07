import { motion } from 'framer-motion';

const Loading = ({ type = 'dashboard' }) => {
  const shimmer = {
    initial: { opacity: 0.5 },
    animate: { opacity: 1 },
    transition: { duration: 1, repeat: Infinity, repeatType: 'reverse' }
  };

  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-surface rounded-xl p-6 premium-shadow"
              {...shimmer}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Area */}
        <motion.div
          className="bg-surface rounded-xl p-6 premium-shadow"
          {...shimmer}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-40"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="h-80 bg-gray-200 rounded-lg"></div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          className="bg-surface rounded-xl p-6 premium-shadow"
          {...shimmer}
        >
          <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (type === 'transactions') {
    return (
      <div className="space-y-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-surface rounded-xl p-4 premium-shadow flex items-center space-x-4"
            {...shimmer}
          >
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="text-right">
              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <motion.div
        className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};

export default Loading;