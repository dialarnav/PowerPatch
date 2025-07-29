import React, { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sun, Wind, Battery, Zap, Home, Factory, Building2, Waves, Trash2 } from "lucide-react";

export interface SimulatorComponent {
  id: string;
  type: 'solar' | 'wind' | 'battery' | 'generator' | 'load' | 'grid' | 'inverter' | 'hydro';
  name: string;
  power: number; // kW
  cost: number; // USD
  emissions: number; // kg CO2/year
  reliability: number; // 0-100%
  efficiency: number; // 0-100%
  count: number;
  position?: { x: number; y: number };
  // Advanced parameters
  capacity?: number; // for batteries (kWh)
  voltage?: number; // V
  maintenance?: number; // annual cost
  lifespan?: number; // years
  weatherResistance?: number; // 0-100%
  noiseLevel?: number; // dB
  customizable?: {
    minPower?: number;
    maxPower?: number;
    powerStep?: number;
    costPerKW?: number;
  };
}

const enhancedComponents: Omit<SimulatorComponent, 'id' | 'count' | 'position'>[] = [
  // Solar Components
  {
    type: 'solar',
    name: 'Residential Solar Panel',
    power: 0.4,
    cost: 200,
    emissions: 0,
    reliability: 85,
    efficiency: 22,
    voltage: 24,
    maintenance: 50,
    lifespan: 25,
    weatherResistance: 95,
    noiseLevel: 0,
    customizable: { minPower: 0.3, maxPower: 0.5, powerStep: 0.1, costPerKW: 500 }
  },
  {
    type: 'solar',
    name: 'Commercial Solar Array',
    power: 5,
    cost: 2500,
    emissions: 0,
    reliability: 90,
    efficiency: 25,
    voltage: 48,
    maintenance: 200,
    lifespan: 25,
    weatherResistance: 98,
    noiseLevel: 0,
    customizable: { minPower: 3, maxPower: 10, powerStep: 1, costPerKW: 500 }
  },
  {
    type: 'solar',
    name: 'Utility Scale Solar',
    power: 50,
    cost: 20000,
    emissions: 0,
    reliability: 95,
    efficiency: 28,
    voltage: 480,
    maintenance: 1000,
    lifespan: 30,
    weatherResistance: 99,
    noiseLevel: 0,
    customizable: { minPower: 25, maxPower: 100, powerStep: 5, costPerKW: 400 }
  },
  // Wind Components
  {
    type: 'wind',
    name: 'Small Wind Turbine',
    power: 2,
    cost: 3000,
    emissions: 0,
    reliability: 70,
    efficiency: 35,
    voltage: 24,
    maintenance: 300,
    lifespan: 20,
    weatherResistance: 85,
    noiseLevel: 45,
    customizable: { minPower: 1, maxPower: 5, powerStep: 0.5, costPerKW: 1500 }
  },
  {
    type: 'wind',
    name: 'Medium Wind Turbine',
    power: 10,
    cost: 12000,
    emissions: 0,
    reliability: 75,
    efficiency: 40,
    voltage: 480,
    maintenance: 800,
    lifespan: 20,
    weatherResistance: 90,
    noiseLevel: 55,
    customizable: { minPower: 5, maxPower: 20, powerStep: 1, costPerKW: 1200 }
  },
  {
    type: 'wind',
    name: 'Large Wind Turbine',
    power: 50,
    cost: 45000,
    emissions: 0,
    reliability: 80,
    efficiency: 45,
    voltage: 480,
    maintenance: 3000,
    lifespan: 25,
    weatherResistance: 95,
    noiseLevel: 65,
    customizable: { minPower: 30, maxPower: 100, powerStep: 5, costPerKW: 900 }
  },
  // Battery Components
  {
    type: 'battery',
    name: 'Lithium Home Battery',
    power: 5,
    cost: 8000,
    emissions: 0,
    reliability: 95,
    efficiency: 95,
    capacity: 13.5,
    voltage: 48,
    maintenance: 100,
    lifespan: 15,
    weatherResistance: 90,
    noiseLevel: 25,
    customizable: { minPower: 3, maxPower: 10, powerStep: 1, costPerKW: 1600 }
  },
  {
    type: 'battery',
    name: 'Commercial Battery Bank',
    power: 20,
    cost: 25000,
    emissions: 0,
    reliability: 98,
    efficiency: 92,
    capacity: 100,
    voltage: 480,
    maintenance: 500,
    lifespan: 15,
    weatherResistance: 95,
    noiseLevel: 40,
    customizable: { minPower: 10, maxPower: 50, powerStep: 5, costPerKW: 1250 }
  },
  {
    type: 'battery',
    name: 'Flow Battery System',
    power: 10,
    cost: 15000,
    emissions: 0,
    reliability: 99,
    efficiency: 85,
    capacity: 40,
    voltage: 480,
    maintenance: 800,
    lifespan: 25,
    weatherResistance: 80,
    noiseLevel: 35,
    customizable: { minPower: 5, maxPower: 25, powerStep: 2.5, costPerKW: 1500 }
  },
  // Generator Components
  {
    type: 'generator',
    name: 'Diesel Generator',
    power: 15,
    cost: 3000,
    emissions: 2400,
    reliability: 99,
    efficiency: 35,
    voltage: 240,
    maintenance: 1200,
    lifespan: 10,
    weatherResistance: 70,
    noiseLevel: 75,
    customizable: { minPower: 5, maxPower: 50, powerStep: 5, costPerKW: 200 }
  },
  {
    type: 'generator',
    name: 'Natural Gas Generator',
    power: 25,
    cost: 5000,
    emissions: 1800,
    reliability: 95,
    efficiency: 40,
    voltage: 480,
    maintenance: 1500,
    lifespan: 15,
    weatherResistance: 85,
    noiseLevel: 65,
    customizable: { minPower: 10, maxPower: 100, powerStep: 5, costPerKW: 200 }
  },
  {
    type: 'generator',
    name: 'Biogas Generator',
    power: 10,
    cost: 8000,
    emissions: 600,
    reliability: 90,
    efficiency: 38,
    voltage: 240,
    maintenance: 2000,
    lifespan: 15,
    weatherResistance: 75,
    noiseLevel: 60,
    customizable: { minPower: 5, maxPower: 30, powerStep: 2.5, costPerKW: 800 }
  },
  // Load Components
  {
    type: 'load',
    name: 'Residential Load',
    power: -5,
    cost: 0,
    emissions: 0,
    reliability: 100,
    efficiency: 100,
    voltage: 240,
    maintenance: 0,
    lifespan: 50,
    weatherResistance: 100,
    noiseLevel: 0,
    customizable: { minPower: -2, maxPower: -20, powerStep: -1, costPerKW: 0 }
  },
  {
    type: 'load',
    name: 'Commercial Load',
    power: -50,
    cost: 0,
    emissions: 0,
    reliability: 100,
    efficiency: 100,
    voltage: 480,
    maintenance: 0,
    lifespan: 50,
    weatherResistance: 100,
    noiseLevel: 0,
    customizable: { minPower: -20, maxPower: -200, powerStep: -10, costPerKW: 0 }
  },
  {
    type: 'load',
    name: 'Industrial Load',
    power: -200,
    cost: 0,
    emissions: 0,
    reliability: 100,
    efficiency: 100,
    voltage: 480,
    maintenance: 0,
    lifespan: 50,
    weatherResistance: 100,
    noiseLevel: 0,
    customizable: { minPower: -100, maxPower: -1000, powerStep: -50, costPerKW: 0 }
  },
  // Hydro Components
  {
    type: 'hydro',
    name: 'Micro Hydro System',
    power: 5,
    cost: 10000,
    emissions: 0,
    reliability: 95,
    efficiency: 85,
    voltage: 240,
    maintenance: 500,
    lifespan: 50,
    weatherResistance: 70,
    noiseLevel: 50,
    customizable: { minPower: 2, maxPower: 15, powerStep: 1, costPerKW: 2000 }
  },
  {
    type: 'hydro',
    name: 'Small Hydro Plant',
    power: 100,
    cost: 150000,
    emissions: 0,
    reliability: 98,
    efficiency: 90,
    voltage: 480,
    maintenance: 5000,
    lifespan: 75,
    weatherResistance: 85,
    noiseLevel: 70,
    customizable: { minPower: 50, maxPower: 500, powerStep: 25, costPerKW: 1500 }
  },
  // Grid Components
  {
    type: 'grid',
    name: 'Grid Connection',
    power: 0,
    cost: 5000,
    emissions: 800,
    reliability: 99,
    efficiency: 95,
    voltage: 480,
    maintenance: 200,
    lifespan: 30,
    weatherResistance: 100,
    noiseLevel: 0
  },
  // Inverter Components
  {
    type: 'inverter',
    name: 'String Inverter',
    power: 0,
    cost: 1000,
    emissions: 0,
    reliability: 95,
    efficiency: 96,
    voltage: 240,
    maintenance: 100,
    lifespan: 15,
    weatherResistance: 85,
    noiseLevel: 30,
    customizable: { minPower: 3, maxPower: 20, powerStep: 1, costPerKW: 200 }
  },
  {
    type: 'inverter',
    name: 'Central Inverter',
    power: 0,
    cost: 8000,
    emissions: 0,
    reliability: 98,
    efficiency: 98,
    voltage: 480,
    maintenance: 400,
    lifespan: 20,
    weatherResistance: 90,
    noiseLevel: 50,
    customizable: { minPower: 50, maxPower: 500, powerStep: 25, costPerKW: 160 }
  }
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'solar': return <Sun className="w-4 h-4" />;
    case 'wind': return <Wind className="w-4 h-4" />;
    case 'battery': return <Battery className="w-4 h-4" />;
    case 'generator': return <Zap className="w-4 h-4" />;
    case 'load': return <Home className="w-4 h-4" />;
    case 'hydro': return <Waves className="w-4 h-4" />;
    case 'grid': return <Factory className="w-4 h-4" />;
    case 'inverter': return <Building2 className="w-4 h-4" />;
    default: return <Zap className="w-4 h-4" />;
  }
};

const getColorForType = (type: string) => {
  switch (type) {
    case 'solar': return 'text-yellow-500 border-yellow-200 bg-yellow-50';
    case 'wind': return 'text-blue-500 border-blue-200 bg-blue-50';
    case 'battery': return 'text-green-500 border-green-200 bg-green-50';
    case 'generator': return 'text-orange-500 border-orange-200 bg-orange-50';
    case 'load': return 'text-purple-500 border-purple-200 bg-purple-50';
    case 'hydro': return 'text-cyan-500 border-cyan-200 bg-cyan-50';
    case 'grid': return 'text-gray-500 border-gray-200 bg-gray-50';
    case 'inverter': return 'text-indigo-500 border-indigo-200 bg-indigo-50';
    default: return 'text-gray-500 border-gray-200 bg-gray-50';
  }
};

interface ComponentNodeData {
  component: SimulatorComponent;
  onUpdate: (component: SimulatorComponent) => void;
  onDelete: (id: string) => void;
}

const ComponentNode = ({ data }: { data: ComponentNodeData }) => {
  const { component, onUpdate, onDelete } = data;
  
  return (
    <Card className={`w-48 ${getColorForType(component.type)} border-2`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIconForType(component.type)}
            <CardTitle className="text-sm">{component.name}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(component.id)}
            className="h-6 w-6 p-0 hover:bg-red-100"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Power:</span>
            <span className="font-medium">{component.power}kW</span>
          </div>
          <div className="flex justify-between">
            <span>Cost:</span>
            <span className="font-medium">${component.cost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Efficiency:</span>
            <span className="font-medium">{component.efficiency}%</span>
          </div>
          <div className="flex justify-between">
            <span>Reliability:</span>
            <span className="font-medium">{component.reliability}%</span>
          </div>
          {component.capacity && (
            <div className="flex justify-between">
              <span>Capacity:</span>
              <span className="font-medium">{component.capacity}kWh</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const nodeTypes: NodeTypes = {
  component: ComponentNode,
};

interface SimulatorCanvasProps {
  selectedComponents: SimulatorComponent[];
  onComponentsChange: (components: SimulatorComponent[]) => void;
  onComponentAdd: (component: Omit<SimulatorComponent, 'id' | 'count' | 'position'>) => void;
}

export const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  selectedComponents,
  onComponentsChange,
  onComponentAdd
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onComponentUpdate = useCallback((updatedComponent: SimulatorComponent) => {
    const updatedComponents = selectedComponents.map(comp =>
      comp.id === updatedComponent.id ? updatedComponent : comp
    );
    onComponentsChange(updatedComponents);
  }, [selectedComponents, onComponentsChange]);

  const onComponentDelete = useCallback((id: string) => {
    const updatedComponents = selectedComponents.filter(comp => comp.id !== id);
    onComponentsChange(updatedComponents);
    setNodes(nodes => nodes.filter(node => node.id !== id));
  }, [selectedComponents, onComponentsChange, setNodes]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const componentTemplate = enhancedComponents.find(comp => comp.name === type);
      if (!componentTemplate) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newComponent: SimulatorComponent = {
        ...componentTemplate,
        id: Math.random().toString(36).substr(2, 9),
        count: 1,
        position
      };

      const newNode: Node = {
        id: newComponent.id,
        type: 'component',
        position,
        data: {
          component: newComponent,
          onUpdate: onComponentUpdate,
          onDelete: onComponentDelete
        },
      };

      setNodes((nodes) => nodes.concat(newNode));
      onComponentsChange([...selectedComponents, newComponent]);
    },
    [reactFlowInstance, selectedComponents, onComponentsChange, onComponentUpdate, onComponentDelete]
  );

  return (
    <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
      {/* Component Library */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Enhanced Component Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 overflow-y-auto max-h-[500px]">
            {enhancedComponents.map((component, index) => (
              <Card
                key={index}
                className={`cursor-grab hover:shadow-md transition-all border ${getColorForType(component.type)}`}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', component.name);
                  event.dataTransfer.effectAllowed = 'move';
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {getIconForType(component.type)}
                    <div>
                      <h4 className="font-medium text-sm">{component.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {component.power !== 0 ? `${component.power}kW` : 'System'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div>Cost: ${component.cost.toLocaleString()}</div>
                    <div>Eff: {component.efficiency}%</div>
                    <div>Rel: {component.reliability}%</div>
                    {component.noiseLevel !== undefined && (
                      <div>Noise: {component.noiseLevel}dB</div>
                    )}
                  </div>
                  {component.customizable && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Customizable
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Canvas */}
      <div className="lg:col-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Microgrid Design Canvas</CardTitle>
            <p className="text-sm text-muted-foreground">
              Drag components from the library to design your microgrid system
            </p>
          </CardHeader>
          <CardContent className="p-0 h-[500px]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50"
            >
              <Controls />
              <MiniMap nodeStrokeColor="#374151" nodeColor="#9CA3AF" nodeBorderRadius={8} />
              <Background gap={20} size={1} />
            </ReactFlow>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { enhancedComponents };