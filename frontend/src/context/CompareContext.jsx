import React, { createContext, useContext, useState } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState([]);
  const { addToast } = useToast();

  const toggleCompare = (product) => {
    setCompareItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        addToast(`Removed ${product.name} from comparison`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        if (prev.length >= 4) {
          addToast('You can compare a maximum of 4 products at once.', 'warning');
          return prev;
        }
        addToast(`Added ${product.name} to comparison tray (${prev.length + 1}/4)`, 'info');
        return [...prev, product];
      }
    });
  };

  const removeFromCompare = (productId) => {
    setCompareItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isComparing = (productId) => {
    return compareItems.some(item => item.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        compareCount: compareItems.length,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isComparing
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
