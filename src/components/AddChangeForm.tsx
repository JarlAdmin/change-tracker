import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddChangeFormProps {
  onAddChange: (description: string) => void;
}

const AddChangeForm: React.FC<AddChangeFormProps> = ({ onAddChange }) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAddChange(description);
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter change description"
        className="flex-grow"
      />
      <Button type="submit">Add Change</Button>
    </form>
  );
};

export default AddChangeForm;
