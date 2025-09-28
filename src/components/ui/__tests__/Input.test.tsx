import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders with basic props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('block', 'w-full', 'px-3', 'py-2');
  });

  it('renders with label', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    const label = screen.getByText('Username');
    const input = screen.getByPlaceholderText('Enter username');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', input.id);
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
  });

  it('renders with error state', () => {
    render(
      <Input 
        label="Email" 
        error="Email is required" 
        placeholder="Enter email" 
      />
    );
    
    const input = screen.getByPlaceholderText('Enter email');
    const errorMessage = screen.getByText('Email is required');
    
    expect(input).toHaveClass('border-red-300', 'text-red-900');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('renders with helper text when no error', () => {
    render(
      <Input 
        label="Password" 
        helperText="Must be at least 8 characters" 
        placeholder="Enter password" 
      />
    );
    
    const helperText = screen.getByText('Must be at least 8 characters');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('prioritizes error over helper text', () => {
    render(
      <Input 
        label="Password" 
        error="Password is too short" 
        helperText="Must be at least 8 characters" 
        placeholder="Enter password" 
      />
    );
    
    expect(screen.getByText('Password is too short')).toBeInTheDocument();
    expect(screen.queryByText('Must be at least 8 characters')).not.toBeInTheDocument();
  });

  it('handles custom className', () => {
    render(<Input className="custom-class" placeholder="Test" />);
    const input = screen.getByPlaceholderText('Test');
    expect(input).toHaveClass('custom-class');
  });

  it('handles custom id', () => {
    render(<Input id="custom-input" label="Custom Input" />);
    const input = screen.getByLabelText('Custom Input');
    const label = screen.getByText('Custom Input');
    
    expect(input).toHaveAttribute('id', 'custom-input');
    expect(label).toHaveAttribute('for', 'custom-input');
  });

  it('generates unique id when not provided', () => {
    render(
      <div>
        <Input label="Input 1" />
        <Input label="Input 2" />
      </div>
    );
    
    const input1 = screen.getByLabelText('Input 1');
    const input2 = screen.getByLabelText('Input 2');
    
    expect(input1.id).toBeTruthy();
    expect(input2.id).toBeTruthy();
    expect(input1.id).not.toBe(input2.id);
  });

  it('forwards HTML input props', () => {
    render(
      <Input 
        type="email" 
        required 
        disabled 
        placeholder="Enter email" 
        maxLength={50}
      />
    );
    
    const input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('disabled');
    expect(input).toHaveAttribute('maxlength', '50');
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    fireEvent.change(input, { target: { value: 'Hello World' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('Hello World');
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        placeholder="Focus test" 
      />
    );
    
    const input = screen.getByPlaceholderText('Focus test');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles for different states', () => {
    const { rerender } = render(<Input placeholder="Normal state" />);
    let input = screen.getByPlaceholderText('Normal state');
    expect(input).toHaveClass('border-gray-300');
    expect(input).not.toHaveClass('border-red-300');
    
    rerender(<Input error="Error state" placeholder="Error state" />);
    input = screen.getByPlaceholderText('Error state');
    expect(input).toHaveClass('border-red-300');
    expect(input).not.toHaveClass('border-gray-300');
  });
});
