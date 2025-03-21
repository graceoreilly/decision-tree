import React, { useState, createContext, useContext } from 'react';

// Create context for tabs
type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Tabs Props
type TabsProps = {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
};

export const Tabs: React.FC<TabsProps> = ({ 
  defaultValue, 
  onValueChange, 
  children, 
  className = '' 
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList Props
type TabsListProps = {
  children: React.ReactNode;
  className?: string;
};

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div role="tablist" className={className}>
      {children}
    </div>
  );
};

// TabsTrigger Props
type TabsTriggerProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { value: selectedValue, onValueChange } = context;
  const isSelected = selectedValue === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isSelected}
      data-state={isSelected ? 'active' : 'inactive'}
      onClick={() => onValueChange(value)}
      className={className}
    >
      {children}
    </button>
  );
};

// TabsContent Props
type TabsContentProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { value: selectedValue } = context;
  const isSelected = selectedValue === value;

  if (!isSelected) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      data-state={isSelected ? 'active' : 'inactive'}
      className={className}
    >
      {children}
    </div>
  );
};