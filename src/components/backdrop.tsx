interface BackdropProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function Backdrop({ isOpen, toggle }: BackdropProps) {
  const handleToggle = () => {
    toggle();
  };

  return (
    <div
      onClick={handleToggle}
      className={`bg-inherit fixed transition-opacity ${
        isOpen
          ? "opacity-80 block w-screen h-screen bg-inherit"
          : "opacity-0 hidden w-0 h-0"
      }`}
    />
  );
}
