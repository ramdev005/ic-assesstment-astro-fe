import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from '../Textarea';

describe('Textarea Component', () => {
  it('renders with basic props', () => {
    render(<Textarea placeholder="Enter description" />);
    const textarea = screen.getByPlaceholderText('Enter description');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass('block', 'w-full', 'px-3', 'py-2');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders with label', () => {
    render(<Textarea label="Description" placeholder="Enter description" />);
    const label = screen.getByText('Description');
    const textarea = screen.getByPlaceholderText('Enter description');
    
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', textarea.id);
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
  });

  it('renders with error state', () => {
    render(
      <Textarea 
        label="Message" 
        error="Message is required" 
        placeholder="Enter message" 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Enter message');
    const errorMessage = screen.getByText('Message is required');
    
    expect(textarea).toHaveClass('border-red-300', 'text-red-900');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('renders with helper text when no error', () => {
    render(
      <Textarea 
        label="Comments" 
        helperText="Maximum 500 characters" 
        placeholder="Enter comments" 
      />
    );
    
    const helperText = screen.getByText('Maximum 500 characters');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('prioritizes error over helper text', () => {
    render(
      <Textarea 
        label="Comments" 
        error="Comments are too long" 
        helperText="Maximum 500 characters" 
        placeholder="Enter comments" 
      />
    );
    
    expect(screen.getByText('Comments are too long')).toBeInTheDocument();
    expect(screen.queryByText('Maximum 500 characters')).not.toBeInTheDocument();
  });

  it('handles custom className', () => {
    render(<Textarea className="custom-class" placeholder="Test" />);
    const textarea = screen.getByPlaceholderText('Test');
    expect(textarea).toHaveClass('custom-class');
  });

  it('handles custom id', () => {
    render(<Textarea id="custom-textarea" label="Custom Textarea" />);
    const textarea = screen.getByLabelText('Custom Textarea');
    const label = screen.getByText('Custom Textarea');
    
    expect(textarea).toHaveAttribute('id', 'custom-textarea');
    expect(label).toHaveAttribute('for', 'custom-textarea');
  });

  it('generates unique id when not provided', () => {
    render(
      <div>
        <Textarea label="Textarea 1" />
        <Textarea label="Textarea 2" />
      </div>
    );
    
    const textarea1 = screen.getByLabelText('Textarea 1');
    const textarea2 = screen.getByLabelText('Textarea 2');
    
    expect(textarea1.id).toBeTruthy();
    expect(textarea2.id).toBeTruthy();
    expect(textarea1.id).not.toBe(textarea2.id);
  });

  it('forwards HTML textarea props', () => {
    render(
      <Textarea 
        required 
        disabled 
        placeholder="Enter text" 
        rows={10}
        cols={50}
        maxLength={200}
        readOnly
      />
    );
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveAttribute('required');
    expect(textarea).toHaveAttribute('disabled');
    expect(textarea).toHaveAttribute('rows', '10');
    expect(textarea).toHaveAttribute('cols', '50');
    expect(textarea).toHaveAttribute('maxlength', '200');
    expect(textarea).toHaveAttribute('readonly');
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} placeholder="Type here" />);
    
    const textarea = screen.getByPlaceholderText('Type here');
    fireEvent.change(textarea, { target: { value: 'Hello World\nSecond line' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue('Hello World\nSecond line');
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    
    render(
      <Textarea 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        placeholder="Focus test" 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Focus test');
    
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events', () => {
    const handleKeyDown = jest.fn();
    const handleKeyUp = jest.fn();
    
    render(
      <Textarea 
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Keyboard test" 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Keyboard test');
    
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    
    fireEvent.keyUp(textarea, { key: 'Enter' });
    expect(handleKeyUp).toHaveBeenCalledTimes(1);
  });

  it('applies correct styles for different states', () => {
    const { rerender } = render(<Textarea placeholder="Normal state" />);
    let textarea = screen.getByPlaceholderText('Normal state');
    expect(textarea).toHaveClass('border-gray-300');
    expect(textarea).not.toHaveClass('border-red-300');
    
    rerender(<Textarea error="Error state" placeholder="Error state" />);
    textarea = screen.getByPlaceholderText('Error state');
    expect(textarea).toHaveClass('border-red-300');
    expect(textarea).not.toHaveClass('border-gray-300');
  });

  it('handles defaultValue prop', () => {
    render(
      <Textarea 
        defaultValue="Default content" 
        placeholder="Enter text" 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveValue('Default content');
  });

  it('handles controlled value prop', () => {
    const { rerender } = render(
      <Textarea 
        value="Initial value" 
        onChange={() => {}}
        placeholder="Enter text" 
      />
    );
    
    let textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveValue('Initial value');
    
    rerender(
      <Textarea 
        value="Updated value" 
        onChange={() => {}}
        placeholder="Enter text" 
      />
    );
    
    textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toHaveValue('Updated value');
  });

  it('handles resize behavior', () => {
    render(<Textarea placeholder="Resize test" style={{ resize: 'vertical' }} />);
    const textarea = screen.getByPlaceholderText('Resize test');
    expect(textarea).toHaveStyle({ resize: 'vertical' });
  });

  it('supports form integration', () => {
    render(
      <form data-testid="form">
        <Textarea name="description" placeholder="Form textarea" />
      </form>
    );
    
    const form = screen.getByTestId('form');
    const textarea = screen.getByPlaceholderText('Form textarea');
    
    expect(textarea).toHaveAttribute('name', 'description');
    expect(form).toContainElement(textarea);
  });

  it('handles multiline content properly', () => {
    const multilineContent = `Line 1
Line 2
Line 3`;
    
    render(
      <Textarea 
        defaultValue={multilineContent}
        placeholder="Multiline test" 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Multiline test');
    expect(textarea).toHaveValue(multilineContent);
  });

  it('maintains proper focus styles', () => {
    render(<Textarea placeholder="Focus styles test" />);
    const textarea = screen.getByPlaceholderText('Focus styles test');
    
    expect(textarea).toHaveClass(
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'focus:border-blue-500'
    );
  });

  it('handles disabled state correctly', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    const textarea = screen.getByPlaceholderText('Disabled textarea');
    
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute('disabled');
  });
});
