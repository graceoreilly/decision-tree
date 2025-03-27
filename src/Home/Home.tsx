import { useState, useRef, useEffect } from "react";
import { treeData } from "../Data/treeType";
import { ChevronRight, RotateCcw, ArrowLeft } from "../IconComponents";
import Button from "../Button";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>("root");
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  //Log the current node options whenever currentNodeId changes (TO BE REMOVED - JUST FOR EDITING PURPOSES)
  useEffect(() => {
    const currentNode = treeData[currentNodeId];
    if (currentNode) {
      console.log("Current node:", currentNodeId);
      console.log("Options:", currentNode.options);
    }
  }, [currentNodeId]);

  const handleOptionClick = (nextNodeId: string | null, optionResult?: string) => {
    // Debug: Log information about the clicked option (TO BE REMOVED - JUST FOR EDITING PURPOSES)
    console.log("Option clicked:", { nextNodeId, optionResult });
    
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    // NEW APPROACH: More explicit handling with clear priority
    // First check if there's a result to display
    if (typeof optionResult === "string" && optionResult.length > 0) {
      console.log("Setting result to:", optionResult);
      setResult(optionResult);
    } 
    // If no result but we have a nextNodeId, navigate to that node
    else if (nextNodeId) {
      console.log("Navigating to node:", nextNodeId);
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(nextNodeId);
      setResult(null);
    }
    // If we reach here, something might be wrong with the data
    else {
      console.warn("Option has neither result nor nextNodeId:", { nextNodeId, optionResult });
    }
    
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const handleBackClick = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    if (history.length > 0) {
      const newHistory = [...history];
      const previousNodeId = newHistory.pop();
      setHistory(newHistory);
      setCurrentNodeId(previousNodeId || "root");
      setResult(null);
    }
    
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const handleRestart = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    
    setCurrentNodeId("root");
    setResult(null);
    setHistory([]);
    
    if (containerRef.current) {
      containerRef.current.focus();
    }
  };

  const currentNode = treeData[currentNodeId];

  // Debug: Check if currentNode exists
  if (!currentNode) {
    console.error("Current node not found:", currentNodeId);
    return <div>Error: Node not found</div>;
  }

  return (
    <div 
      className={styles.decisionTreeContainer} 
      ref={containerRef}
      tabIndex={-1}
    >
      <div className={styles.decisionTree}>
        <div className={styles.breadcrumbs}>
          <Button variant="ghost" size="sm" onClick={handleRestart} className={styles.breadcrumbButton}>
            <RotateCcw className="h-3 w-3 mr-1" />
            Start
          </Button>
          {history.map((nodeId, index) => (
            <div key={index} className={styles.breadcrumbItem}>
              <ChevronRight className="h-3 w-3 mx-1" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Blur focus
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                  
                  setCurrentNodeId(nodeId);
                  setHistory(history.slice(0, index));
                  setResult(null);
                  
                  // Move focus to container
                  if (containerRef.current) {
                    containerRef.current.focus();
                  }
                }}
                className={styles.breadcrumbButton}
              >
                {treeData[nodeId].content.length > 20
                  ? treeData[nodeId].content.substring(0, 20) + "..."
                  : treeData[nodeId].content}
              </Button>
            </div>
          ))}
          {currentNode && !result && (
            <div className={styles.breadcrumbItem}>
              <ChevronRight className="h-3 w-3 mx-1" />
              <span className={styles.currentBreadcrumb}>
                {currentNode.content.length > 20
                  ? currentNode.content.substring(0, 20) + "..."
                  : currentNode.content}
              </span>
            </div>
          )}
        </div>


        {result ? (
          <div className={styles.resultNode}>
            <h3>Recommendation:</h3>
            <p>{result}</p>
            <div className={styles.navigationButtons}>
              <Button onClick={handleBackClick} variant="outline" size="sm" className={styles.backButton}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleRestart} variant="outline" size="sm" className={styles.restartButton}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        ) : (
          <div className={styles.questionNode}>
            <h3>{currentNode.content}</h3>
            <div className={styles.options}>
              {currentNode.options.map((option, index) => (
                <button
                  key={index}
                  className={styles.optionButton}
                  onClick={() => handleOptionClick(option.nextNodeId, option.result)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  {option.text}
                </button>
              ))}
            </div>
            {history.length > 0 && (
              <Button onClick={handleBackClick} variant="outline" size="sm" className={styles.backButton}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;