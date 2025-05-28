import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async(data) => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      // Store user data or token if needed
      localStorage.setItem('user', JSON.stringify(result));
      
      // Redirect to properties page
      navigate('/properties');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <section className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card p-4 shadow">
          <h3 className="text-center mb-4">Login</h3>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email input */}
            <div className="form-outline mb-4">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter your email"
                {...register('email', {
                  required: { value: true, message: 'Email is required' },
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email format',
                  },
                })}
              />
              <label className="form-label">Email address</label>
              {errors.email && (
                <div className="text-danger mt-1 text-center">
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password input */}
            <div className="form-outline mb-3">
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter your password"
                {...register('password', {
                  required: { value: true, message: 'Password is required' },
                })}
              />
              <label className="form-label">Password</label>
              {errors.password && (
                <div className="text-danger mt-1 text-center">
                  {errors.password.message}
                </div>
              )}
            </div>

            <div className="text-center mt-4 pt-2">
              <button 
                type="submit" 
                className="btn btn-success btn-lg w-100"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <p className="small fw-bold mt-3 mb-0">
                Don't have an account?{' '}
                <a href="/register" className="link-primary">
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
