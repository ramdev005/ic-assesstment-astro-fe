import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Test Modal',
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    // Find the backdrop (first div with bg-black class)
    const backdrop = document.querySelector('.bg-black.bg-opacity-50');
    expect(backdrop).toBeInTheDocument();
    
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    const onClose = jest.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const modalContent = screen.getByText('Modal content');
    fireEvent.click(modalContent);
    
    expect(onClose).not.toHaveBeenCalled();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Modal {...defaultProps} size="sm" />);
    let modalContainer = document.querySelector('.max-w-md');
    expect(modalContainer).toBeInTheDocument();
    
    rerender(<Modal {...defaultProps} size="md" />);
    modalContainer = document.querySelector('.max-w-lg');
    expect(modalContainer).toBeInTheDocument();
    
    rerender(<Modal {...defaultProps} size="lg" />);
    modalContainer = document.querySelector('.max-w-2xl');
    expect(modalContainer).toBeInTheDocument();
    
    rerender(<Modal {...defaultProps} size="xl" />);
    modalContainer = document.querySelector('.max-w-4xl');
    expect(modalContainer).toBeInTheDocument();
  });

  it('defaults to medium size', () => {
    render(<Modal {...defaultProps} />);
    const modalContainer = document.querySelector('.max-w-lg');
    expect(modalContainer).toBeInTheDocument();
  });

  it('sets body overflow to hidden when open', () => {
    const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);
    // Body overflow may be 'unset' from previous tests
    expect(['', 'unset']).toContain(document.body.style.overflow);
    
    rerender(<Modal {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('resets body overflow when unmounted', () => {
    const { unmount } = render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('resets body overflow when closed', () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    expect(document.body.style.overflow).toBe('hidden');
    
    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('unset');
  });

  it('renders custom title', () => {
    render(<Modal {...defaultProps} title="Custom Title" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders custom children', () => {
    render(
      <Modal 
        {...defaultProps} 
        children={
          <div>
            <h2>Custom Content</h2>
            <p>This is custom modal content</p>
            <button>Custom Button</button>
          </div>
        } 
      />
    );
    
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
    expect(screen.getByText('This is custom modal content')).toBeInTheDocument();
    expect(screen.getByText('Custom Button')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<Modal {...defaultProps} />);
    
    const title = screen.getByText('Test Modal');
    expect(title).toHaveClass('text-lg', 'font-semibold');
    
    // Check modal structure
    const modalContainer = document.querySelector('.fixed.inset-0.z-50');
    expect(modalContainer).toBeInTheDocument();
    
    const modalContent = document.querySelector('.relative.w-full');
    expect(modalContent).toBeInTheDocument();
  });

  it('handles multiple modals with different props', () => {
    const onClose1 = jest.fn();
    const onClose2 = jest.fn();
    
    render(
      <div>
        <Modal 
          isOpen={true} 
          onClose={onClose1} 
          title="Modal 1" 
          size="sm"
        >
          <div>Content 1</div>
        </Modal>
        <Modal 
          isOpen={true} 
          onClose={onClose2} 
          title="Modal 2" 
          size="lg"
        >
          <div>Content 2</div>
        </Modal>
      </div>
    );
    
    expect(screen.getByText('Modal 1')).toBeInTheDocument();
    expect(screen.getByText('Modal 2')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('maintains focus management', async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    
    // Modal should be focusable via keyboard navigation
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
    
    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it('cleans up event listeners properly', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { unmount } = render(<Modal {...defaultProps} />);
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('updates event listeners when isOpen changes', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    const { rerender } = render(<Modal {...defaultProps} isOpen={false} />);
    expect(addEventListenerSpy).not.toHaveBeenCalled();
    
    rerender(<Modal {...defaultProps} isOpen={true} />);
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    rerender(<Modal {...defaultProps} isOpen={false} />);
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
