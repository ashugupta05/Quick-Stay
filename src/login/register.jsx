import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async(data) => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setSuccess('Registration successful! Redirecting to login...');
      reset();
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <section className="w-100" style={{ maxWidth: '400px' }}>
        <div className="card p-4 shadow">
          <h3 className="text-center mb-4">Register</h3>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name input */}
            <div className="form-outline mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter your name"
                {...register('name', {
                  required: { value: true, message: 'Name is required' },
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
              />
              <label className="form-label">Full Name</label>
              {errors.name && (
                <div className="text-danger mt-1 text-center">
                  {errors.name.message}
                </div>
              )}
            </div>

            {/* Email input */}
            <div className="form-outline mb-4">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Enter a valid email address"
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
                placeholder="Create a password"
                {...register('password', {
                  required: { value: true, message: 'Password is required' },
                  minLength: {
                    value: 5,
                    message: 'Password must be at least 5 characters',
                  },
                  maxLength: {
                    value: 15,
                    message: 'Password must be under 15 characters',
                  },
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
                {isLoading ? 'Registering...' : 'Register'}
              </button>
              <p className="small fw-bold mt-3 mb-0">
                Already have an account?{' '}
                <a href="/login" className="link-primary">
                  Login
                </a>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Register;
