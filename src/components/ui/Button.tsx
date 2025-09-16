import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500',
    secondary: 'bg-pink-300 hover:bg-pink-400 text-amber-900 focus:ring-pink-300',
    outline: 'border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white focus:ring-amber-500',
    ghost: 'text-amber-600 hover:bg-amber-50 focus:ring-amber-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};