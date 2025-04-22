// import { useState, useRef, useEffect } from "react";
// import { supabase } from "../Unused/utils/supabase";
// import { setupInitialData } from "../Unused/utils/setupInitialData";
// import { treeData as defaultTreeData, TreeNodeType } from "../Data/treeType"; 
// import { ChevronRight, RotateCcw, ArrowLeft, Edit } from "../IconComponents";
// import Button from "../Button";
// import styles from "./Home.module.css";
// import TreeEditor from "../Unused/TreeEditor/TreeEditor";

// const TREE_NAME = 'Main Decision Tree';

// const Home: React.FC = () => {
//   const [currentNodeId, setCurrentNodeId] = useState<string>("root");
//   const [result, setResult] = useState<string | null>(null);
//   const [history, setHistory] = useState<string[]>([]);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [treeData, setTreeData] = useState<Record<string, TreeNodeType>>(defaultTreeData);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Load data on mount
//   useEffect(() => {
//     const loadData = async () => {
//       setIsLoading(true);
//       try {
//         // Set up initial data if needed
//         await setupInitialData();
        
//         // Get the tree data
//         const { data, error } = await supabase
//           .from('decision_trees')
//           .select('tree_data')
//           .eq('name', TREE_NAME)
//           .single();
        
//         if (error) throw error;
        
//         // Update the tree data state
//         setTreeData(data.tree_data);
//         console.log("Loaded tree data:", data.tree_data);
        
//       } catch (err: any) {
//         console.error('Error loading tree data:', err);
//         setError('Failed to load tree data. Using default data instead.');
//         // Fall back to default data
//         setTreeData(defaultTreeData);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   // Save tree data when it's updated in edit mode
//   const saveTreeData = async (updatedData: Record<string, TreeNodeType>) => {
//     setIsLoading(true);
//     try {
//       const { error } = await supabase
//         .from('decision_trees')
//         .update({ tree_data: updatedData })
//         .eq('name', TREE_NAME);
      
//       if (error) throw error;
      
//       setTreeData(updatedData);
//       setIsEditMode(false);
//     } catch (err: any) {
//       console.error('Error saving tree data:', err);
//       setError('Failed to save changes.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Toggle edit mode
//   const toggleEditMode = () => {
//     setIsEditMode(!isEditMode);
//   };

//   // Your existing event handlers
//   const handleOptionClick = (nextNodeId: string | null, optionResult?: string) => {
//     if (document.activeElement instanceof HTMLElement) {
//       document.activeElement.blur();
//     }
    
//     if (typeof optionResult === "string" && optionResult.length > 0) {
//       setResult(optionResult);
//     } 
//     else if (nextNodeId) {
//       setHistory([...history, currentNodeId]);
//       setCurrentNodeId(nextNodeId);
//       setResult(null);
//     }
    
//     if (containerRef.current) {
//       containerRef.current.focus();
//     }
//   };

//   const handleBackClick = () => {
//     if (document.activeElement instanceof HTMLElement) {
//       document.activeElement.blur();
//     }
    
//     if (history.length > 0) {
//       const newHistory = [...history];
//       const previousNodeId = newHistory.pop();
//       setHistory(newHistory);
//       setCurrentNodeId(previousNodeId || "root");
//       setResult(null);
//     }
    
//     if (containerRef.current) {
//       containerRef.current.focus();
//     }
//   };

//   const handleRestart = () => {
//     if (document.activeElement instanceof HTMLElement) {
//       document.activeElement.blur();
//     }
    
//     setCurrentNodeId("root");
//     setResult(null);
//     setHistory([]);
    
//     if (containerRef.current) {
//       containerRef.current.focus();
//     }
//   };

//   const currentNode = treeData[currentNodeId];

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!currentNode) {
//     return <div>Error: Node not found</div>;
//   }

//   return (
//     <div className={styles.container}>
//       <div className={styles.adminToggle}>
//         <Button 
//           variant="ghost" 
//           size="sm" 
//           onClick={toggleEditMode}
//         >
//           {isEditMode ? 'Exit Edit Mode' : 'Edit Tree'}
//         </Button>
//       </div>
      
//       {isEditMode ? (
//         <TreeEditor 
//           initialTreeData={treeData} 
//           onSave={saveTreeData} 
//           onCancel={() => setIsEditMode(false)} 
//           treeName={TREE_NAME}
//         />
//       ) : (
//         <div 
//           className={styles.decisionTreeContainer} 
//           ref={containerRef}
//           tabIndex={-1}
//         >
//           {error && <div className={styles.error}>{error}</div>}
          
//           <div className={styles.decisionTree}>
//             <div className={styles.breadcrumbs}>
//               <Button variant="ghost" size="sm" onClick={handleRestart} className={styles.breadcrumbButton}>
//                 <RotateCcw className="h-3 w-3 mr-1" />
//                 Start
//               </Button>
//               {history.map((nodeId, index) => (
//                 <div key={index} className={styles.breadcrumbItem}>
//                   <ChevronRight className="h-3 w-3 mx-1" />
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       if (document.activeElement instanceof HTMLElement) {
//                         document.activeElement.blur();
//                       }
                      
//                       setCurrentNodeId(nodeId);
//                       setHistory(history.slice(0, index));
//                       setResult(null);
                      
//                       if (containerRef.current) {
//                         containerRef.current.focus();
//                       }
//                     }}
//                     className={styles.breadcrumbButton}
//                   >
//                     {treeData[nodeId].content.length > 20
//                       ? treeData[nodeId].content.substring(0, 20) + "..."
//                       : treeData[nodeId].content}
//                   </Button>
//                 </div>
//               ))}
//               {currentNode && !result && (
//                 <div className={styles.breadcrumbItem}>
//                   <ChevronRight className="h-3 w-3 mx-1" />
//                   <span className={styles.currentBreadcrumb}>
//                     {currentNode.content.length > 20
//                       ? currentNode.content.substring(0, 20) + "..."
//                       : currentNode.content}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {result ? (
//               <div className={styles.resultNode}>
//                 <h3>Recommendation:</h3>
//                 <p>{result}</p>
//                 <div className={styles.navigationButtons}>
//                   <Button onClick={handleBackClick} variant="outline" size="sm" className={styles.backButton}>
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back
//                   </Button>
//                   <Button onClick={handleRestart} variant="outline" size="sm" className={styles.restartButton}>
//                     <RotateCcw className="h-4 w-4 mr-2" />
//                     Restart
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className={styles.questionNode}>
//                 <h3>{currentNode.content}</h3>
//                 <div className={styles.options}>
//                   {currentNode.options.map((option, index) => (
//                     <button
//                       key={index}
//                       className={styles.optionButton}
//                       onClick={() => handleOptionClick(option.nextNodeId, option.result)}
//                       onMouseDown={(e) => {
//                         e.preventDefault();
//                       }}
//                     >
//                       {option.text}
//                     </button>
//                   ))}
//                 </div>
//                 {history.length > 0 && (
//                   <Button onClick={handleBackClick} variant="outline" size="sm" className={styles.backButton}>
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back
//                   </Button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;