# Reflex Rule Designer for Felicity LIMS

A visual workflow designer for creating and managing reflex testing rules in Felicity LIMS. Built with Vue 3, Vue Flow, and Pinia.

## Overview

Reflex testing in clinical laboratories involves automatically triggering additional tests based on the results of initial tests. This designer provides a visual, drag-and-drop interface for configuring complex reflex rules without writing code.

## Features

- **Visual Workflow Design**: Drag-and-drop interface for creating reflex rules
- **Custom Node Types**: Specialized nodes for each component of a reflex rule
- **Connection Validation**: Smart connection rules prevent invalid workflows
- **Real-time Validation**: Visual feedback on flow validity
- **Export/Import**: Save and load rule configurations as JSON

## Node Types

### 1. Trigger Node ⚡
The entry point for a reflex rule. Defines which analyses trigger the reflex when verified.

- **Properties**:
  - `analyses`: List of triggering analyses
  - `level`: Reflex level (for cascading reflexes)

### 2. Brain Node 🧠
The decision-making container that groups conditions and actions.

- **Properties**:
  - `description`: Describes the decision logic
  - `priority`: Evaluation order when multiple brains exist

### 3. Condition Node ❓
Defines evaluation criteria. Multiple criteria within a condition use AND logic. Multiple conditions use OR logic.

- **Properties**:
  - `description`: Describes the condition
  - `criteria`: List of criteria (analysis, operator, value)
  - `priority`: Evaluation order

### 4. Action Node ▶️
Container for actions to execute when conditions are met.

- **Properties**:
  - `description`: Describes the actions
  - `priority`: Execution order

### 5. Addition Node ➕
Adds new analysis results for further testing.

- **Properties**:
  - `analysis_uid`: Analysis to add
  - `count`: Number of instances to create

### 6. Final Node ✅
Sets a final result value and auto-verifies.

- **Properties**:
  - `analysis_uid`: Analysis to finalize
  - `value`: Final result value

## Connection Rules

The designer enforces valid connections between node types:

```
Trigger → Brain
Brain → Condition
Condition → Action
Action → Addition | Final
```

## Data Flow Logic

### Condition Evaluation
- **Within a Condition**: All criteria must be met (AND logic)
- **Between Conditions**: At least one condition must be met (OR logic)

### Action Execution
When conditions are satisfied:
1. Addition actions create new analysis results
2. Final actions set values and verify results
3. Original results are hidden from reports

## Project Structure

```
reflex-designer/
├── src/
│   ├── components/
│   │   ├── nodes/           # Custom Vue Flow nodes
│   │   │   ├── BaseNode.vue
│   │   │   ├── TriggerNode.vue
│   │   │   ├── BrainNode.vue
│   │   │   ├── ConditionNode.vue
│   │   │   ├── ActionNode.vue
│   │   │   ├── AdditionNode.vue
│   │   │   └── FinalNode.vue
│   │   ├── FlowCanvas.vue   # Main flow editor
│   │   ├── NodesSidebar.vue # Draggable node palette
│   │   ├── NodeEditor.vue   # Node property editor
│   │   └── RuleHeader.vue   # Top header with rule metadata
│   ├── stores/
│   │   └── reflexDesigner.ts # Pinia state management
│   ├── types/
│   │   ├── reflex.ts        # Backend entity types
│   │   └── flow.ts          # Vue Flow node types
│   ├── utils/
│   │   └── flowUtils.ts     # Validation and helper functions
│   ├── App.vue
│   └── main.ts
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Creating a Rule

1. **Set Rule Metadata**: Click on the title to set the rule name and description
2. **Add Trigger**: Drag a Trigger node to the canvas and select triggering analyses
3. **Add Brain**: Drag a Brain node and connect it to the Trigger
4. **Add Condition**: Drag Condition nodes and connect to Brain, add criteria
5. **Add Actions**: Drag Action node and connect to Condition
6. **Add Results**: Connect Addition or Final nodes to Action

### Editing Nodes

Click any node to open the property editor panel. Make changes and click "Save Changes".

### Exporting Rules

Click the "Export" button to download the rule configuration as JSON. This can be imported into the backend or saved for later.

## Backend Integration

The designer generates a structure compatible with the SQLAlchemy entities:

```typescript
interface ReflexRule {
  name: string;
  description: string;
  is_active: boolean;
  priority: number;
  reflex_actions: ReflexAction[];
}
```

### API Endpoints (Suggested)

```
POST   /api/reflex-rules          # Create rule
GET    /api/reflex-rules/:id      # Get rule
PUT    /api/reflex-rules/:id      # Update rule
DELETE /api/reflex-rules/:id      # Delete rule
GET    /api/analyses              # List available analyses
GET    /api/sample-types          # List sample types
```

## Entity Modifications

Suggested modifications to existing entities:

### ReflexBrain
```python
# Add position data for visual layout
position_x = Column(Integer, default=0)
position_y = Column(Integer, default=0)
```

### ReflexAction
```python
# Add position data for visual layout
position_x = Column(Integer, default=0)
position_y = Column(Integer, default=0)
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Del` / `Backspace` | Delete selected node |
| `Scroll` | Zoom in/out |
| `Click + Drag` | Pan canvas |
| `Escape` | Close editor panel |

## Technologies

- **Vue 3**: Frontend framework
- **Vue Flow**: Flow-based diagram library
- **Pinia**: State management
- **TypeScript**: Type safety
- **Vite**: Build tool

## License

MIT License - See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Support

For issues or questions, please open a GitHub issue or contact the Felicity LIMS team.
