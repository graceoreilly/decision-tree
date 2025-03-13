import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from 'reactflow';

import 'reactflow/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 720, y: 40 }, data: { label: 'Anti-fungal therapy/prophylaxis' } },
  
  // Left side of tree - Suspected invasive fungal infection
  { id: '2', position: { x: 450, y: 180 }, data: { label: 'Suspected invasive fungal infection' } },
  { id: '3', position: { x: 200, y: 280 }, data: { label: 'Neonate' } },
  { id: '4', position: { x: 550, y: 280 }, data: { label: 'Older child' } },
  { id: '5', position: { x: 200, y: 380 }, data: { label: 'Candida suspected or confirmed' } },
  { id: '6', position: { x: 550, y: 380 }, data: { label: 'Immunocompromised child' } },
  { id: '7', position: { x: 750, y: 380 }, data: { label: 'No - consult ID' } },
  { id: '8', position: { x: 550, y: 480 }, data: { label: 'Yes' } },
  { id: '9', position: { x: 200, y: 480 }, data: { label: 'Candida localised disease or blood' } },
  
  // Branch from "Candida localised disease or blood"
  { id: '10', position: { x: 120, y: 580 }, data: { label: 'Yes' } },
  { id: '11', position: { x: 280, y: 580 }, data: { label: 'No' } },
  { id: '12', position: { x: 80, y: 650 }, data: { label: 'Fluconazole resistance suspected consult ID' } },
  { id: '13', position: { x: 280, y: 650 }, data: { label: 'Other candida species' } },
  { id: '14', position: { x: 280, y: 730 }, data: { label: 'Fluconazole' } },
  
  // Branch from immunocompromised child - Yes
  { id: '15', position: { x: 550, y: 580 }, data: { label: 'CNS coverage required' } },
  { id: '16', position: { x: 450, y: 680 }, data: { label: 'Yes' } },
  { id: '17', position: { x: 650, y: 680 }, data: { label: 'No' } },
  
  // Branch from "Yes" branch for CNS
  { id: '18', position: { x: 200, y: 780 }, style: { width: 250 }, data: { label: 'Candida albicans susceptible to azoles (most Candidiasis)' } },
  { id: '19', position: { x: 500, y: 780 }, data: { label: 'Cryptococcus' } },
  { id: '20', position: { x: 200, y: 880 }, data: { label: 'Fluconazole OR' } },
  { id: '21', position: { x: 500, y: 840 }, style: { width: 220 }, data: { label: 'Amphotericin B AND Flucytosine (2-week induction)' } },
  
  // Branch from "No" branch for CNS - Site of infection
  { id: '22', position: { x: 650, y: 780 }, data: { label: 'Site of infection' } },
  { id: '23', position: { x: 400, y: 900 }, data: { label: 'Pulmonary' } },
  { id: '24', position: { x: 520, y: 900 }, data: { label: 'Abdominal' } },
  { id: '25', position: { x: 640, y: 900 }, data: { label: 'Eye/sinus' } },
  { id: '26', position: { x: 760, y: 900 }, data: { label: 'Skin and soft tissue' } },
  { id: '27', position: { x: 880, y: 900 }, data: { label: 'Bone and joint' } },
  { id: '28', position: { x: 1000, y: 900 }, data: { label: 'Febrile neutropenia without source' } },
  
  // Nodes under Pulmonary
  { id: '29', position: { x: 400, y: 980 }, data: { label: 'Aspergillus suspected or confirmed' } },
  { id: '30', position: { x: 400, y: 1080 }, data: { label: 'Voriconazole' } },
  
  // Node under Febrile neutropenia
  { id: '31', position: { x: 1000, y: 980 }, data: { label: '?' } },
  
  // Right side of tree - Prophylaxis
  { id: '32', position: { x: 1000, y: 180 }, data: { label: 'Prophylaxis for invasive fungal disease' } },
  { id: '33', position: { x: 850, y: 280 }, data: { label: 'Neonate' } },
  { id: '34', position: { x: 1150, y: 280 }, data: { label: 'Older child' } },
  
  // Branch under Neonate (Prophylaxis)
  { id: '35', position: { x: 750, y: 380 }, style: { width: 280 }, data: { label: 'Refer to neonatal guidelines for prophylaxis in neonates (different risk factors to older children)' } },
  
  // Branch under Older child (Prophylaxis)
  { id: '36', position: { x: 1100, y: 380 }, data: { label: 'Immunocompromised child' } },
  { id: '37', position: { x: 1350, y: 380 }, data: { label: 'No - consult ID' } },
  { id: '38', position: { x: 1100, y: 480 }, data: { label: 'Yes' } },
  
  // Detailed text boxes in the right branch
  { id: '39', position: { x: 750, y: 480 }, style: { width: 280 }, data: { label: 'Follow American IDSA guidelines: Posaconazole for AML or MDS patients and allogeneic HSCT recipients with GVHD. Fluconazole, posaconazole, or voriconazole for allogeneic HSCT without GVHD. Posaconazole for ALL induction patients. Fluconazole for autologous HSCT recipients with mucositis. Itraconazole or voriconazole for solid organ transplant.' } },
  { id: '40', position: { x: 1100, y: 580 }, style: { width: 280 }, data: { label: 'Liposomal amphotericin B, micafungin, voriconazole and high risk neutropenic children (consider discussing)' } },
  { id: '41', position: { x: 1100, y: 680 }, data: { label: 'Fluconazole ?' } }
];

const initialEdges = [
  // Connect main node to branches
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-32', source: '1', target: '32' },
  
  // Left connections - Suspected invasive fungal infection
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e4-6', source: '4', target: '6' },
  { id: 'e6-7', source: '6', target: '7' },
  { id: 'e6-8', source: '6', target: '8' },
  { id: 'e5-9', source: '5', target: '9' },
  
  // Connect from "Candida localised disease or blood"
  { id: 'e9-10', source: '9', target: '10' },
  { id: 'e9-11', source: '9', target: '11' },
  { id: 'e10-12', source: '10', target: '12' },
  { id: 'e11-13', source: '11', target: '13' },
  { id: 'e13-14', source: '13', target: '14' },
  
  // Connect immunocompromised -> Yes
  { id: 'e8-15', source: '8', target: '15' },
  { id: 'e15-16', source: '15', target: '16' },
  { id: 'e15-17', source: '15', target: '17' },
  
  // Connect under Yes for CNS
  { id: 'e16-18', source: '16', target: '18' },
  { id: 'e16-19', source: '16', target: '19' },
  { id: 'e18-20', source: '18', target: '20' },
  { id: 'e19-21', source: '19', target: '21' },
  
  // Connect under No for CNS
  { id: 'e17-22', source: '17', target: '22' },
  { id: 'e22-23', source: '22', target: '23' },
  { id: 'e22-24', source: '22', target: '24' },
  { id: 'e22-25', source: '22', target: '25' },
  { id: 'e22-26', source: '22', target: '26' },
  { id: 'e22-27', source: '22', target: '27' },
  { id: 'e22-28', source: '22', target: '28' },
  
  // Connect Pulmonary path
  { id: 'e23-29', source: '23', target: '29' },
  { id: 'e29-30', source: '29', target: '30' },
  
  // Connect Febrile neutropenia
  { id: 'e28-31', source: '28', target: '31' },
  
  // Right side - Prophylaxis connections
  { id: 'e32-33', source: '32', target: '33' },
  { id: 'e32-34', source: '32', target: '34' },
  { id: 'e33-35', source: '33', target: '35' },
  { id: 'e34-36', source: '34', target: '36' },
  { id: 'e36-37', source: '36', target: '37' },
  { id: 'e36-38', source: '36', target: '38' },
  
  // Connect the detailed boxes
  { id: 'e35-39', source: '35', target: '39' },
  { id: 'e38-40', source: '38', target: '40' },
  { id: 'e40-41', source: '40', target: '41' }
];
 
export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}