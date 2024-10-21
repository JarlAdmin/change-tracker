import React, { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Change } from '../types/change';

interface AddChangeFormProps {
  onAddChange: (change: Omit<Change, 'id' | 'date'>) => void;
}

const AddChangeForm: React.FC<AddChangeFormProps> = ({ onAddChange }) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim() && category.trim() && service.trim() && username.trim()) {
      onAddChange({ description, category, service, username });
      setDescription('');
      setCategory('');
      setService('');
      setUsername('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
      <Input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter change details"
      />
      <Input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />
      <Input
        type="text"
        value={service}
        onChange={(e) => setService(e.target.value)}
        placeholder="Enter service"
      />
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
      />
      <Button type="submit">Add Change</Button>
    </form>
  );
};

export default AddChangeForm;
