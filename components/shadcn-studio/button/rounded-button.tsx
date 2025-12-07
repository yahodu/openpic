import { Button } from "@/components/ui/button";
import { LucideProps } from "lucide-react";
import { FC } from "react";

interface RoundedButtonProps {
  icon: FC<LucideProps>;
  onClick?: () => void;
}

const RoundedButton: FC<RoundedButtonProps> = ({ icon, onClick }) => {
  const IconComponent = icon;

  return (
    <Button
      variant="outline"
      className="h-12 rounded-full px-2.5 w-fit"
      onClick={onClick}
    >
      <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-full">
        <IconComponent />
      </span>
    </Button>
  );
};

export default RoundedButton;
