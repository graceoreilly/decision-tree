import { useState, useEffect } from 'react';
import { supabase } from '../Unused/utils/supabase';
import TreeEditor from '../TreeEditor/TreeEditor';
import { TreeNodeType } from '../Data/treeType';

interface TreeInfo {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const TreeManager: React.FC = () => {
  const [trees, setTrees] = useState<TreeInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTree, setSelectedTree] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTreeData, setCurrentTreeData] = useState<Record<string, TreeNodeType> | null>(null);
  const [newTreeName, setNewTreeName] = useState('');
  const [showNewTreeForm, setShowNewTreeForm] = useState(false);

  useEffect(() => {
    loadTrees();
  }, []);

  const loadTrees = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('decision_trees')
        .select('id, name, created_at, updated_at')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      setTrees(data || []);
    } catch (err) {
      console.error("Error loading trees:", err);
      setError("Failed to load decision trees");
    } finally {
      setLoading(false);
    }
  };

  const loadTreeData = async (treeName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('decision_trees')
        .select('tree_data')
        .eq('name', treeName)
        .single();
      
      if (error) throw error;
      
      setCurrentTreeData(data.tree_data);
      setSelectedTree(treeName);
    } catch (err) {
      console.error("Error loading tree data:", err);
      setError(`Failed to load tree "${treeName}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTree = async () => {
    if (!selectedTree) return;
    
    if (!currentTreeData) {
      await loadTreeData(selectedTree);
    }
    
    setIsEditMode(true);
  };

  const handleNewTree = () => {
    setShowNewTreeForm(true);
  };

  const createNewTree = async () => {
    if (!newTreeName.trim()) {
      setError("Please enter a tree name");
      return;
    }
    
    setLoading(true);
    try {
      // Start with a basic tree structure
      const initialTree = {
        root: {
          id: "root",
          content: "Start Decision",
          options: [
            { text: "Option 1", nextNodeId: null, result: "Result 1" },
            { text: "Option 2", nextNodeId: null, result: "Result 2" }
          ]
        }
      };
      
      const { error } = await supabase
        .from('decision_trees')
        .insert({
          name: newTreeName.trim(),
          tree_data: initialTree
        });
      
      if (error) throw error;
      
      setShowNewTreeForm(false);
      setNewTreeName('');
      await loadTrees();
      setSelectedTree(newTreeName.trim());
      setCurrentTreeData(initialTree);
      setIsEditMode(true);
    } catch (err) {
      console.error("Error creating tree:", err);
      setError("Failed to create new tree. The name might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  const handleTreeSaved = async (updatedTreeData: Record<string, TreeNodeType>) => {
    setCurrentTreeData(updatedTreeData);
    setIsEditMode(false);
    await loadTrees();
  };

  const handleDeleteTree = async (treeName: string) => {
    if (!confirm(`Are you sure you want to delete the tree "${treeName}"?`)) {
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('decision_trees')
        .delete()
        .eq('name', treeName);
      
      if (error) throw error;
      
      if (selectedTree === treeName) {
        setSelectedTree(null);
        setCurrentTreeData(null);
      }
      
      await loadTrees();
    } catch (err) {
      console.error("Error deleting tree:", err);
      setError(`Failed to delete tree "${treeName}"`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tree-manager">
      <h2>Decision Tree Manager</h2>
      
      {error && <div className="error">{error}</div>}
      
      {isEditMode && currentTreeData && selectedTree ? (
        <TreeEditor 
          initialTreeData={currentTreeData}
          onSave={handleTreeSaved}
          onCancel={() => setIsEditMode(false)}
          treeName={selectedTree}
        />
      ) : (
        <>
          <div className="tree-manager-actions">
            <button onClick={handleNewTree}>Create New Tree</button>
          </div>
          
          {showNewTreeForm && (
            <div className="new-tree-form">
              <h3>Create New Decision Tree</h3>
              <input
                type="text"
                value={newTreeName}
                onChange={(e) => setNewTreeName(e.target.value)}
                placeholder="Enter tree name"
              />
              <div className="form-actions">
                <button onClick={() => setShowNewTreeForm(false)}>Cancel</button>
                <button onClick={createNewTree}>Create</button>
              </div>
            </div>
          )}
          
          <h3>Available Trees</h3>
          {loading ? (
            <p>Loading...</p>
          ) : trees.length === 0 ? (
            <p>No decision trees found. Create one to get started.</p>
          ) : (
            <ul className="tree-list">
              {trees.map(tree => (
                <li 
                  key={tree.id} 
                  className={`tree-item ${selectedTree === tree.name ? 'selected' : ''}`}
                >
                  <div 
                    className="tree-name" 
                    onClick={() => loadTreeData(tree.name)}
                  >
                    {tree.name}
                  </div>
                  
                  <div className="tree-info">
                    Last updated: {new Date(tree.updated_at).toLocaleString()}
                  </div>
                  
                  <div className="tree-actions">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTree(tree.name);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          {selectedTree && currentTreeData && (
            <div className="selected-tree">
              <h3>Selected Tree: {selectedTree}</h3>
              <button onClick={handleEditTree}>Edit Tree</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TreeManager;