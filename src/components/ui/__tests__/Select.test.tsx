import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../Select';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select Component', () => {
  it('renders with basic props', () => {
    render(<Select options={mockOptions} placeholder="Select option" />);
    
    const selectButton = screen.getByRole('button');
    expect(selectButton).toBeInTheDocument();
    expect(selectButton).toHaveTextContent('Select option');
    expect(selectButton).toHaveAttribute('aria-haspopup', 'listbox');
    expect(selectButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders with label', () => {
    render(
      <Select 
        options={mockOptions} 
        label="Choose Option" 
        placeholder="Select option" 
      />
    );
    
    const label = screen.getByText('Choose Option');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'text-gray-700');
  });

  it('opens dropdown when clicked', async () => {
    render(<Select options={mockOptions} placeholder="Select option" />);
    
    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);
    
    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  it('selects option when clicked', async () => {
    const onChange = jest.fn();
    render(
      <Select 
        options={mockOptions} 
        onChange={onChange} 
        placeholder="Select option" 
      />
    );
    
    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);
    
    await waitFor(() => {
      const option1 = screen.getByText('Option 1');
      fireEvent.click(option1);
    });
    
    expect(onChange).toHaveBeenCalledWith('option1');
    expect(selectButton).toHaveTextContent('Option 1');
    expect(selectButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows selected value', () => {
    render(
      <Select 
        options={mockOptions} 
        value="option2" 
        placeholder="Select option" 
      />
    );
    
    const selectButton = screen.getByRole('button');
    expect(selectButton).toHaveTextContent('Option 2');
  });

  it('updates when value prop changes', () => {
    const { rerender } = render(
      <Select 
        options={mockOptions} 
        value="option1" 
        placeholder="Select option" 
      />
    );
    
    let selectButton = screen.getByRole('button');
    expect(selectButton).toHaveTextContent('Option 1');
    
    rerender(
      <Select 
        options={mockOptions} 
        value="option3" 
        placeholder="Select option" 
      />
    );
    
    selectButton = screen.getByRole('button');
    expect(selectButton).toHaveTextContent('Option 3');
  });

  it('handles keyboard navigation', async () => {
    render(<Select options={mockOptions} placeholder="Select option" />);
    
    const selectButton = screen.getByRole('button');
    
    // Open with Enter
    fireEvent.keyDown(selectButton, { key: 'Enter' });
    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    // Close with Escape
    fireEvent.keyDown(selectButton, { key: 'Escape' });
    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'false');
    });
    
    // Open with Space
    fireEvent.keyDown(selectButton, { key: ' ' });
    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    // Close again
    fireEvent.keyDown(selectButton, { key: 'Escape' });
    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'false');
    });
    
    // Open with Arrow Down
    fireEvent.keyDown(selectButton, { key: 'ArrowDown' });
    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('closes dropdown when clicking outside', async () => {
    render(
      <div>
        <Select options={mockOptions} placeholder="Select option" />
        <div data-testid="outside">Outside element</div>
      </div>
    );
    
    const selectButton = screen.getByRole('button');
    const outsideElement = screen.getByTestId('outside');
    
    // Open dropdown
    fireEvent.click(selectButton);
    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'true');
    });
    
    // Click outside
    fireEvent.mouseDown(outsideElement);
    await waitFor(() => {
      expect(selectButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('renders with error state', () => {
    render(
      <Select 
        options={mockOptions} 
        error="This field is required" 
        placeholder="Select option" 
      />
    );
    
    const selectButton = screen.getByRole('button');
    const errorMessage = screen.getByText('This field is required');
    
    expect(selectButton).toHaveClass('border-red-300');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('renders with helper text when no error', () => {
    render(
      <Select 
        options={mockOptions} 
        helperText="Choose wisely" 
        placeholder="Select option" 
      />
    );
    
    const helperText = screen.getByText('Choose wisely');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('prioritizes error over helper text', () => {
    render(
      <Select 
        options={mockOptions} 
        error="Error message" 
        helperText="Helper text" 
        placeholder="Select option" 
      />
    );
    
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('handles disabled state', async () => {
    const onChange = jest.fn();
    render(
      <Select 
        options={mockOptions} 
        disabled 
        onChange={onChange} 
        placeholder="Select option" 
      />
    );
    
    const selectButton = screen.getByRole('button');
    expect(selectButton).toBeDisabled();
    expect(selectButton).toHaveClass('disabled:bg-gray-50', 'disabled:text-gray-500');
    
    // Should not open when clicked
    fireEvent.click(selectButton);
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(selectButton).toHaveAttribute('aria-expanded', 'false');
    
    // Should not respond to keyboard
    fireEvent.keyDown(selectButton, { key: 'Enter' });
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(selectButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('handles custom className', () => {
    render(
      <Select 
        options={mockOptions} 
        className="custom-class" 
        placeholder="Select option" 
      />
    );
    
    const selectButton = screen.getByRole('button');
    expect(selectButton).toHaveClass('custom-class');
  });

  it('shows placeholder in dropdown when provided', async () => {
    const onChange = jest.fn();
    render(
      <Select 
        options={mockOptions} 
        placeholder="Choose one" 
        onChange={onChange} 
      />
    );
    
    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);
    
    await waitFor(() => {
      const placeholderOptions = screen.getAllByText('Choose one');
      const dropdownPlaceholder = placeholderOptions.find(el => 
        el.classList.contains('px-3') && el.classList.contains('py-2')
      );
      expect(dropdownPlaceholder).toBeInTheDocument();
      expect(dropdownPlaceholder).toHaveClass('text-gray-500');
      
      // Click placeholder to reset selection
      fireEvent.click(dropdownPlaceholder!);
    });
    
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('highlights selected option in dropdown', async () => {
    render(
      <Select 
        options={mockOptions} 
        value="option2" 
        placeholder="Select option" 
      />
    );
    
    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);
    
    await waitFor(() => {
      const allOption2Elements = screen.getAllByText('Option 2');
      const dropdownOption = allOption2Elements.find(el => 
        el.classList.contains('px-3') && el.classList.contains('py-2')
      );
      expect(dropdownOption).toHaveClass('bg-blue-100', 'text-blue-900');
    });
  });

  it('handles empty options array', () => {
    render(<Select options={[]} placeholder="No options" />);
    
    const selectButton = screen.getByRole('button');
    fireEvent.click(selectButton);
    
    // Should still open but show no options
    expect(selectButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('rotates chevron icon when opened', async () => {
    render(<Select options={mockOptions} placeholder="Select option" />);
    
    const selectButton = screen.getByRole('button');
    const chevron = selectButton.querySelector('svg');
    
    expect(chevron).not.toHaveClass('rotate-180');
    
    fireEvent.click(selectButton);
    await waitFor(() => {
      expect(chevron).toHaveClass('rotate-180');
    });
    
    fireEvent.click(selectButton);
    await waitFor(() => {
      expect(chevron).not.toHaveClass('rotate-180');
    });
  });
});
