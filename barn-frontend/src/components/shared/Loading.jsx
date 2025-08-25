import React from 'react';

/**
 * Minimalistic Loading Component
 * Implements Nielsen's Heuristic 1: Visibility of System Status
 * Features clean, simple design with subtle animations
 */

const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  progress = null, 
  showPercentage = false,
  variant = 'default', // 'default', 'dots', 'bar'
  color = 'gray' // 'gray', 'blue', 'green', 'white', 'maritime'
}) => {

  const sizeClasses = {
    small: { container: 'w-6 h-6', text: 'text-sm' },
    medium: { container: 'w-8 h-8', text: 'text-base' },
    large: { container: 'w-12 h-12', text: 'text-lg' }
  };

  const colorClasses = {
    gray: {
      primary: 'border-gray-300',
      accent: 'border-gray-900',
      text: 'text-gray-700',
      progress: 'bg-gray-900'
    },
    blue: {
      primary: 'border-blue-200',
      accent: 'border-blue-600',
      text: 'text-blue-600',
      progress: 'bg-blue-600'
    },
    green: {
      primary: 'border-green-200',
      accent: 'border-green-600',
      text: 'text-green-600',
      progress: 'bg-green-600'
    },
    white: {
      primary: 'border-white/30',
      accent: 'border-white',
      text: 'text-white',
      progress: 'bg-white'
    },
    maritime: {
      primary: 'border-cyan-200',
      accent: 'border-cyan-400',
      text: 'text-white',
      progress: 'bg-cyan-400'
    }
  };

  const currentColor = colorClasses[color] || colorClasses.gray; // Fallback to gray if color is invalid
  const currentSize = sizeClasses[size] || sizeClasses.medium; // Fallback to medium if size is invalid

  const renderDefaultLoader = () => (
    <div className="relative">
      <div className={`${currentSize.container} relative`}>
        {progress !== null ? (
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className={currentColor.primary}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={currentColor.accent}
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              style={{ transition: 'stroke-dasharray 0.3s ease' }}
            />
          </svg>
        ) : (
          <div className={`w-full h-full border-2 ${currentColor.primary} border-t-transparent rounded-full animate-spin`} />
        )}
        
        {progress !== null && showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xs font-medium ${currentColor.text}`}>
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );

  const renderDotsLoader = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`w-2 h-2 ${currentColor.progress} rounded-full animate-bounce`}
          style={{
            animationDelay: `${index * 0.15}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  const renderBarLoader = () => (
    <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={`h-full ${currentColor.progress} rounded-full transition-all duration-300 ease-out`}
        style={{ 
          width: progress !== null ? `${progress}%` : '100%',
          animation: progress === null ? 'loading-bar 1.5s ease-in-out infinite' : 'none'
        }}
      />
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots': return renderDotsLoader();
      case 'bar': return renderBarLoader();
      default: return renderDefaultLoader();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4" role="status" aria-live="polite">
      {renderLoader()}
      
      {text && (
        <div className="text-center space-y-2">
          <p className={`${currentSize.text} font-medium ${currentColor.text}`}>
            {text}
          </p>
          {progress !== null && !showPercentage && variant !== 'bar' && (
            <div className="flex items-center justify-center space-x-2">
              <div className="h-1 w-16 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${currentColor.progress} transition-all duration-300 ease-out rounded-full`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Minimalistic full-screen loading overlay
export const LoadingOverlay = ({ 
  text = 'Loading...', 
  progress = null, 
  variant = 'default',
  color = 'gray',
  onClose = null
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="loading-title">
      {/* Simple backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Content container */}
      <div className="relative z-10 p-8 bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
        <h2 id="loading-title" className="sr-only">Loading content</h2>
        <Loading 
          size="large" 
          text={text} 
          progress={progress} 
          showPercentage={true}
          variant={variant}
          color={color}
        />
      </div>
    </div>
  );
};

// Simple inline loading spinner
export const InlineLoading = ({ 
  text = '', 
  ariaLabel = 'Loading',
  variant = 'default',
  color = 'gray',
  size = 'small'
}) => {
  return (
    <div className="flex items-center space-x-2" role="status" aria-label={ariaLabel}>
      <Loading size={size} text="" variant={variant} color={color} />
      {text && (
        <span className="text-sm font-medium text-gray-600">
          {text}
        </span>
      )}
    </div>
  );
};

// Simple skeleton loading component
export const SkeletonLoader = ({ 
  lines = 3, 
  showAvatar = false, 
  className = '' 
}) => {
  return (
    <div className={`animate-pulse space-y-3 ${className}`} role="status" aria-label="Loading content">
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`h-3 bg-gray-200 rounded ${
              index === lines - 1 ? 'w-2/3' : 'w-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Simple pulse loading indicator for buttons
export const PulseLoader = ({ size = 'medium', color = 'white' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5', 
    large: 'w-6 h-6'
  };

  const colorClasses = {
    white: 'border-white',
    blue: 'border-blue-500',
    gray: 'border-gray-500'
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`} 
      role="status" 
      aria-label="Processing"
    />
  );
};

export default Loading;