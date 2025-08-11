import type { Meta, StoryObj } from '@storybook/react';
import { CodeEditor } from './CodeEditor';

const meta: Meta<typeof CodeEditor> = {
  title: 'Common/CodeEditor',
  component: CodeEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A syntax-highlighted code editor with execution capabilities.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    language: {
      control: { type: 'select' },
      options: ['javascript', 'typescript', 'python', 'java', 'cpp'],
      description: 'Programming language for syntax highlighting',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Whether the editor is read-only',
    },
    showLineNumbers: {
      control: { type: 'boolean' },
      description: 'Show line numbers in the editor',
    },
    height: {
      control: { type: 'text' },
      description: 'Height of the editor',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const arrayCode = `// Array Operations Example
const numbers = [1, 2, 3, 4, 5];

// Insert element at index 2
numbers.splice(2, 0, 99);
console.log('After insert:', numbers);

// Delete element at index 1
numbers.splice(1, 1);
console.log('After delete:', numbers);

// Search for element
const index = numbers.indexOf(99);
console.log('Index of 99:', index);`;

const stackCode = `// Stack Implementation
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

// Usage
const stack = new Stack();
stack.push(10);
stack.push(20);
console.log('Top:', stack.peek());
console.log('Popped:', stack.pop());`;

export const Default: Story = {
  args: {
    initialCode: arrayCode,
    language: 'javascript',
    readOnly: false,
    showLineNumbers: true,
    height: '300px',
  },
};

export const ReadOnly: Story = {
  args: {
    initialCode: stackCode,
    language: 'javascript',
    readOnly: true,
    showLineNumbers: true,
    height: '400px',
  },
};

export const Python: Story = {
  args: {
    initialCode: `# Python List Operations
numbers = [1, 2, 3, 4, 5]

# Insert element at index 2
numbers.insert(2, 99)
print(f"After insert: {numbers}")

# Delete element at index 1
del numbers[1]
print(f"After delete: {numbers}")

# Search for element
try:
    index = numbers.index(99)
    print(f"Index of 99: {index}")
except ValueError:
    print("Element not found")`,
    language: 'python',
    readOnly: false,
    showLineNumbers: true,
    height: '350px',
  },
};

export const Compact: Story = {
  args: {
    initialCode: `const arr = [1, 2, 3];
arr.push(4);
console.log(arr);`,
    language: 'javascript',
    readOnly: false,
    showLineNumbers: false,
    height: '150px',
  },
};

export const Large: Story = {
  args: {
    initialCode: stackCode,
    language: 'javascript',
    readOnly: false,
    showLineNumbers: true,
    height: '500px',
  },
};
