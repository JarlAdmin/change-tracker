import { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  icon: string;
}

interface Service {
  id: number;
  name: string;
  icon: string;
  category_id: number;
}

export function useCategoriesAndServices() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, servicesRes] = await Promise.all([
          axios.get('http://10.85.0.100:3001/api/categories'),
          axios.get('http://10.85.0.100:3001/api/services')
        ]);
        setCategories(categoriesRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        setError('Failed to fetch categories and services');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getServicesForCategory = (categoryId: number) => {
    return services.filter(service => service.category_id === categoryId);
  };

  return {
    categories,
    services,
    loading,
    error,
    getServicesForCategory
  };
} 