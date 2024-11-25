import React, { useState, useEffect, useMemo } from 'react';
import TopBar from '../../components/TopBar';
import { useAuth } from '../../context/AuthContext';
import { message } from 'antd';
import MenuItemModal from '../../components/MenuItemModal';
import { Modal } from 'antd';

interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string | File;
  isAvailable: boolean;
}

interface MenuCategory {
  _id: string;
  name: string;
}

const MenuManagement: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { fetchWithAuth } = useAuth();
  const [newItem, setNewItem] = useState<MenuItem>({
    _id: '',
    name: '',
    description: '',
    price: 0.0,
    category: '',
    image: '',
    isAvailable: true
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/menu`);
        if (!response.ok) throw new Error('Failed to fetch menu data');
        const data = await response.json();
        setMenuItems(data.items);
      } catch (error) {
        message.error('Error fetching menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setMenuCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      message.error('Failed to fetch categories');
    }
  };

  const filteredItems = useMemo(() => {
    if (!menuItems) return [];
    
    // 首先獲取過濾後的項目
    const filtered = activeCategory === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.category._id === activeCategory);

    // 按照 _id 排序
    return filtered.sort((a, b) => a._id.localeCompare(b._id));
  }, [menuItems, activeCategory]);

  
  const handleAddItem = async () => {
    try {
      if (!newItem.name || !newItem.price || !newItem.category || !newItem.image) {
        message.error('Please fill in all required fields and upload an image');
        return;
      }
      
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('description', newItem.description || '');
      formData.append('price', newItem.price.toString());
      formData.append('category', newItem.category);
      formData.append('isAvailable', newItem.isAvailable.toString());
      
      if (newItem.image instanceof File) {
        formData.append('image', newItem.image);
      } else {
        message.error('Please upload an image');
        return;
      }

      const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/menu`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item');
      }

      const addedItem = await response.json();
      setMenuItems(prev => [...prev, addedItem]);
      setIsModalOpen(false);
      setNewItem({
        id: '',
        name: '',
        description: '',
        price: 0.0,
        category: '',
        image: '',
        isAvailable: true
      });
      message.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      message.error(error instanceof Error ? error.message : 'Failed to add item');
    }
  };
  
  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetchWithAuth(`${import.meta.env.VITE_BACKEND_URL}/menu/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete item');

      setMenuItems(prev => prev.filter(item => item.id !== id));
      message.success('Item deleted successfully');
    } catch (error) {
      message.error('Failed to delete item');
    }
  };
  
  const getImageUrl = (imagePath: string | File): string => {
    if (!imagePath) return '';
    if (imagePath instanceof File) {
      return URL.createObjectURL(imagePath);
    }
    const normalizedPath = imagePath.replace(/\\/g, '/');
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
    return `${import.meta.env.VITE_BACKEND_ASSET_URL}/${cleanPath}`;
  };
  
  const handleEditItem = async (updatedItem: MenuItem) => {
    try {
      
      const itemId = updatedItem._id || updatedItem.id;
      
      if (!itemId) {
        message.error('Invalid item ID');
        return;
      }
      
      const formData = new FormData();
      formData.append('name', updatedItem.name);
      formData.append('description', updatedItem.description || '');
      formData.append('price', updatedItem.price.toString());
      formData.append('category', updatedItem.category._id || updatedItem.category);
      formData.append('isAvailable', updatedItem.isAvailable.toString());
      
      if (updatedItem.image instanceof File) {
        formData.append('image', updatedItem.image);
      }
      
      const response = await fetchWithAuth(
        `${import.meta.env.VITE_BACKEND_URL}/menu/${itemId}`,
        {
          method: 'PUT',
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error updating item:', errorData);
        throw new Error(errorData.message || 'Failed to update item');
      }
      
      const updatedData = await response.json();

      const categoryObj = menuCategories.find(cat => 
        cat._id === (updatedData.category._id || updatedData.category)
      );

      const completeUpdatedData = {
        ...updatedData,
        category: categoryObj ? {
          _id: categoryObj._id,
          name: categoryObj.name
        } : updatedData.category
      };
      
      setMenuItems(prev => 
        prev.map(item => item._id === itemId ? completeUpdatedData : item)
      );
      
      setIsEditModalOpen(false);
      setEditingItem(null);
      message.success('Item updated successfully');
    } catch (error) {
      console.error('Failed to update item:', error);
      message.error(error instanceof Error ? error.message : 'Failed to update item');
    }
  };
  
  
  const handleEditClick = (item: MenuItem) => {
    setEditingItem({
      ...item,
      category: typeof item.category === 'string' ? item.category : item.category._id
    });
    setIsEditModalOpen(true);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size cannot exceed 5MB');
      }

      if (editingItem) {
        setEditingItem(prev => ({
          ...prev!,
          image: file
        }));
      } else {
        setNewItem(prev => ({
          ...prev,
          image: file
        }));
      }

      return URL.createObjectURL(file);
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Image processing failed');
      throw error;
    }
  };
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 overflow-x-auto">
                <button
                  key="all"
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${
                    activeCategory === 'all'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </button>
                {menuCategories.map((category) => (
                  <button
                    key={category._id}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      activeCategory === category._id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    onClick={() => setActiveCategory(category._id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Add New Item
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-12 w-12">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name} 
                          className="h-full w-full object-cover rounded-md"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddItem}
        item={newItem}
        setItem={setNewItem}
        title="Add New Menu Item"
        submitButtonText="Add Item"
        categories={menuCategories.filter(cat => cat._id !== 'all')}
        onImageUpload={handleImageUpload}
      />

      {editingItem && (
        <MenuItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          onSubmit={() => {
            handleEditItem(editingItem);
          }}
          item={editingItem}
          setItem={setEditingItem}
          title="Edit Menu Item"
          submitButtonText="Save Changes"
          categories={menuCategories.filter(cat => cat._id !== 'all')}
        />
      )}

      

      
    </div>
  );
};

export default MenuManagement;