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
      className={`bg-black fixed top-0 transition-opacity ${
        isOpen
          ? "opacity-70 block w-screen h-screen bg-black"
          : "opacity-0 hidden w-0 h-0"
      }`}
    />
  );
}
