import { fireEvent, render, screen } from '@testing-library/react';
import Footer from '@/app/components/Footer';
import Button from '@/app/components/Button';

const defaultButtonProps = {
  label: 'Click Me',
  bgColor: 'bg-black',
  fontColor: 'text-red-500',
  padding: 'p-4',
  hover: 'hover:bg-white',
  disabled: false,
  disabledConditions: '',
  outline: '',
  type: undefined,
  fullWidth: false,
};

describe('footer component', () => {
  test('renders Redcooler.net in footer', () => {
    render(<Footer />);

    const company = screen.getByText('Redcooler.net');

    expect(company).toBeInTheDocument();
  });
});

describe('button component', () => {
  it('renders a buton', () => {
    render(<Button {...defaultButtonProps} />);

    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
  });

  it('calls the onClick function when the button is clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} {...defaultButtonProps} />);

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
