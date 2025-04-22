import { useState } from 'react';
import { supabase } from '../utils/supabase';
import { TreeNodeType } from '../../Data/treeType';

interface EditorProps {
  initialTreeData: Record<string, TreeNodeType>;
  onSave: (treeData: Record<string, TreeNodeType>) => void;
  onCancel: () => void;
  treeName: string;
}

const TreeEditor: React.FC<EditorProps> = ({ initialTreeData, onSave, onCancel, treeName }) => {
  const [treeData, setTreeData] = useState<Record<string, TreeNodeType>>(initialTreeData);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('root');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedNode = treeData[selectedNodeId];
 
  if (!initialTreeData || Object.keys(initialTreeData).length === 0) {
    return <div>Loading tree data...</div>;
  }
  
  // Make sure 'root' exists
  if (!initialTreeData.root) {
    console.error('Tree data is missing root node:', initialTreeData);
    return <div>Error: Tree data is invalid (missing root node)</div>;
  }

  const handleNodeChange = (field: keyof TreeNodeType, value: any) => {
    setTreeData({
      ...treeData,
      [selectedNodeId]: {
        ...treeData[selectedNodeId],
        [field]: value
      }
    });
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...treeData[selectedNodeId].options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    handleNodeChange('options', newOptions);
  };

  const addOption = () => {
    const newOptions = [
      ...treeData[selectedNodeId].options, 
      { text: 'New Option', nextNodeId: null }
    ];
    handleNodeChange('options', newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = treeData[selectedNodeId].options.filter((_, i) => i !== index);
    handleNodeChange('options', newOptions);
  };

  const addNewNode = () => {
    // Generate a unique ID
    const newId = `node-${Date.now()}`;
    
    setTreeData({
      ...treeData,
      [newId]: {
        id: newId,
        content: 'New Node',
        options: []
      }
    });
  };

  const removeNode = (nodeId: string) => {
    if (nodeId === 'root') {
      setError("Cannot remove the root node");
      return;
    }

    // Create a copy without the node to remove
    const newTreeData = { ...treeData };
    delete newTreeData[nodeId];

    // Also update any references to this node
    Object.keys(newTreeData).forEach(id => {
      const node = newTreeData[id];
      node.options = node.options.map(option => {
        if (option.nextNodeId === nodeId) {
          return { ...option, nextNodeId: null };
        }
        return option;
      });
    });

    setTreeData(newTreeData);
    setSelectedNodeId('root');
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('decision_trees')
        .upsert({ 
          name: treeName, 
          tree_data: treeData 
        }, { 
          onConflict: 'name' 
        });
      
      if (error) throw error;
      
      onSave(treeData);
    } catch (err) {
      console.error("Error saving tree:", err);
      setError("Failed to save tree. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tree-editor">
      <div className="editor-sidebar">
        <h3>Nodes</h3>
        <select 
          value={selectedNodeId}
          onChange={(e) => setSelectedNodeId(e.target.value)}
          className="node-selector"
        >
          {Object.keys(treeData).map(nodeId => (
            <option key={nodeId} value={nodeId}>
              {nodeId} - {treeData[nodeId].content.substring(0, 30)}
              {treeData[nodeId].content.length > 30 ? '...' : ''}
            </option>
          ))}
        </select>
        
        <button onClick={addNewNode}>Add New Node</button>
        <button 
          onClick={() => removeNode(selectedNodeId)}
          disabled={selectedNodeId === 'root'}
        >
          Remove Selected Node
        </button>
      </div>
      
      <div className="editor-main">
        {selectedNode && (
          <>
            <h3>Edit Node: {selectedNodeId}</h3>
            
            <div className="form-group">
              <label>Content:</label>
              <textarea
                value={selectedNode.content}
                onChange={(e) => handleNodeChange('content', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label>Result (optional):</label>
              <textarea
                value={selectedNode.result || ''}
                onChange={(e) => handleNodeChange('result', e.target.value)}
                rows={3}
                placeholder="Only needed for end nodes"
              />
            </div>
            
            <h4>Options:</h4>
            {selectedNode.options.map((option, idx) => (
              <div key={idx} className="option-editor">
                <div className="form-group">
                  <label>Text:</label>
                  <input
                    type="text"
                    value={option.text || ''}
                    onChange={(e) => handleOptionChange(idx, 'text', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Next Node:</label>
                  <select
                    value={option.nextNodeId || ''}
                    onChange={(e) => handleOptionChange(
                      idx, 
                      'nextNodeId', 
                      e.target.value === '' ? null : e.target.value
                    )}
                  >
                    <option value="">None (End Node)</option>
                    {Object.keys(treeData).map(nodeId => (
                      <option key={nodeId} value={nodeId}>
                        {nodeId}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Result (if end node):</label>
                  <textarea
                    value={option.result || ''}
                    onChange={(e) => handleOptionChange(idx, 'result', e.target.value)}
                    rows={2}
                    placeholder="Only needed if Next Node is None"
                  />
                </div>
                
                <button onClick={() => removeOption(idx)}>Remove Option</button>
              </div>
            ))}
            
            <button onClick={addOption}>Add Option</button>
          </>
        )}
      </div>
      
      <div className="editor-actions">
        {error && <div className="error">{error}</div>}
        <button onClick={onCancel}>Cancel</button>
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Tree'}
        </button>
      </div>
    </div>
  );
};

export default TreeEditor;