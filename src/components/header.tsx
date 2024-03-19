import { Button } from "./ui/button";
import { Menu as MenuIcon } from "lucide-react";
import { ThemeToggler } from "./theme-toggler";

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
}
export default function Header({ title, toggleSidebar }: HeaderProps) {
  return (
    <>
      <div className="bg-inherit fixed top-0 right-0 left-0 lg:left-[300px]">
        <header className="w-full border-b">
          <div className="flex items-center w-full px-2 py-2">
            <div className="block lg:hidden mr-2">
              <Button variant="outline" size="icon" onClick={toggleSidebar}>
                <MenuIcon className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </div>
            <h1 className="text-lg font-bold ml-2">{title}</h1>

            <div className="ml-auto flex gap-2 mr-0">
              <ThemeToggler />
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
