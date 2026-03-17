
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddOptionButtonProps {
  onAdd: () => void;
  optionsCount: number;
  isFullWidth?: boolean;
  isPending: boolean;
}

const AddOptionButton: React.FC<AddOptionButtonProps> = ({ 
  onAdd, 
  optionsCount, 
  isFullWidth = false,
  isPending 
}) => {
  const { toast } = useToast();
  
  const handleAddOption = () => {
    // Only allow adding if we have less than 4 options
    if (optionsCount >= 4) {
      toast({
        title: "Limit Reached",
        description: "You can only have up to 4 chat options.",
        variant: "destructive"
      });
      return;
    }
    
    onAdd();
  };
  
  if (isFullWidth) {
    return (
      <Button
        onClick={handleAddOption}
        variant="outline"
        className="w-full py-6 border-dashed border-2 text-gray-500 hover:text-snes-primary hover:border-snes-primary"
        disabled={isPending}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Another Option
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={handleAddOption} 
      className="bg-snes-primary hover:bg-snes-dark-purple text-white" 
      disabled={optionsCount >= 4 || isPending}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Option
    </Button>
  );
};

export default AddOptionButton;
