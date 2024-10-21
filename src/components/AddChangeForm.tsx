import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter change description"
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Change
      </button>
    </form>
  );
};

export default AddChangeForm;
