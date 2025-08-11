import { TutorialStep } from '@/types/tutorial';

export const stackTutorialSteps: TutorialStep[] = [
  {
    id: 'stack-intro',
    title: 'What is a Stack?',
    description: 'Learn about the LIFO (Last In, First Out) principle and stack characteristics.',
    explanation: 'A stack is a linear data structure that follows the LIFO principle. Think of it like a stack of plates - you can only add or remove plates from the top. The last item added is the first one to be removed.',
    tips: [
      'Only the top element is accessible',
      'Perfect for undo operations and function calls',
      'Used in expression evaluation and syntax parsing',
      'Memory efficient with O(1) operations'
    ],
    timeComplexity: 'O(1) for push/pop',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'stack-operations',
    title: 'Core Stack Operations',
    description: 'Understand the fundamental operations: push, pop, peek, and isEmpty.',
    code: `class Stack {
  constructor() {
    this.items = [];
  }
  
  // Add element to top
  push(element) {
    this.items.push(element);
  }
  
  // Remove and return top element
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }
  
  // View top element without removing
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }
  
  // Check if stack is empty
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Get stack size
  size() {
    return this.items.length;
  }
}`,
    language: 'JavaScript',
    explanation: 'These five operations form the core of any stack implementation. Push adds elements, pop removes them, peek lets you look at the top without removing, isEmpty checks if the stack is empty, and size returns the number of elements.',
    tips: [
      'Always check if stack is empty before popping',
      'Peek is useful for conditional operations',
      'Push and pop are the primary operations',
      'Size helps with capacity management'
    ],
    timeComplexity: 'O(1) all operations',
    spaceComplexity: 'O(1) per operation'
  },
  {
    id: 'stack-push',
    title: 'Push Operation',
    description: 'Learn how to add elements to the top of the stack.',
    code: `// Adding elements to stack
let stack = new Stack();

stack.push(10);  // Stack: [10]
stack.push(20);  // Stack: [10, 20]
stack.push(30);  // Stack: [10, 20, 30]

console.log(stack.peek()); // 30 (top element)
console.log(stack.size()); // 3`,
    language: 'JavaScript',
    explanation: 'The push operation adds a new element to the top of the stack. In array-based implementations, this typically means adding to the end of the array. The operation is O(1) because we always know where to add the element.',
    tips: [
      'New elements always go to the top',
      'Stack grows upward in visualization',
      'No need to shift existing elements',
      'Check for stack overflow in fixed-size stacks'
    ],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'stack-pop',
    title: 'Pop Operation',
    description: 'Learn how to remove and retrieve the top element.',
    code: `let stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);

// Removing elements
let top = stack.pop();    // Returns 30, Stack: [10, 20]
let next = stack.pop();   // Returns 20, Stack: [10]

console.log(top);         // 30
console.log(next);        // 20
console.log(stack.size()); // 1

// Always check before popping
if (!stack.isEmpty()) {
  let last = stack.pop(); // Returns 10, Stack: []
}`,
    language: 'JavaScript',
    explanation: 'The pop operation removes and returns the top element. It\'s crucial to check if the stack is empty before popping to avoid errors. This operation is also O(1) since we always remove from a known position.',
    tips: [
      'Pop returns the removed element',
      'Always check isEmpty() before popping',
      'Popping from empty stack should return null/undefined',
      'Stack shrinks from the top'
    ],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'stack-applications',
    title: 'Real-World Applications',
    description: 'Discover how stacks are used in programming and computer science.',
    code: `// 1. Function Call Stack
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Each call goes on stack
}

// 2. Undo Operations
class TextEditor {
  constructor() {
    this.content = "";
    this.undoStack = new Stack();
  }
  
  type(text) {
    this.undoStack.push(this.content);
    this.content += text;
  }
  
  undo() {
    if (!this.undoStack.isEmpty()) {
      this.content = this.undoStack.pop();
    }
  }
}

// 3. Balanced Parentheses
function isBalanced(expression) {
  let stack = new Stack();
  
  for (let char of expression) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else if (char === ')' || char === ']' || char === '}') {
      if (stack.isEmpty()) return false;
      let top = stack.pop();
      if (!isMatchingPair(top, char)) return false;
    }
  }
  
  return stack.isEmpty();
}`,
    language: 'JavaScript',
    explanation: 'Stacks are everywhere in computer science! Function calls use a call stack, undo operations in applications use stacks, expression evaluation relies on stacks, and browsers use stacks for the back button functionality.',
    tips: [
      'Function calls: Each function call is pushed onto the call stack',
      'Undo/Redo: Store previous states in a stack',
      'Expression parsing: Use stacks for operator precedence',
      'Browser history: Back button uses stack-like behavior',
      'Recursion: Implemented using the call stack'
    ],
    timeComplexity: 'Varies by application',
    spaceComplexity: 'O(n) typically'
  },
  {
    id: 'stack-implementation',
    title: 'Implementation Strategies',
    description: 'Explore different ways to implement stacks.',
    code: `// Array-based implementation (most common)
class ArrayStack {
  constructor() {
    this.items = [];
  }
  
  push(element) {
    this.items.push(element);
  }
  
  pop() {
    return this.items.pop();
  }
}

// Linked List implementation
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedStack {
  constructor() {
    this.top = null;
    this.size = 0;
  }
  
  push(element) {
    let newNode = new Node(element);
    newNode.next = this.top;
    this.top = newNode;
    this.size++;
  }
  
  pop() {
    if (!this.top) return null;
    let data = this.top.data;
    this.top = this.top.next;
    this.size--;
    return data;
  }
}`,
    language: 'JavaScript',
    explanation: 'Stacks can be implemented using arrays (dynamic or fixed-size) or linked lists. Array-based implementations are simpler and more memory-efficient, while linked list implementations provide dynamic sizing without waste.',
    tips: [
      'Array implementation: Simple but may waste memory',
      'Linked list: Dynamic size but extra memory overhead',
      'Fixed arrays: Memory efficient but size limited',
      'Choose based on your specific requirements'
    ],
    timeComplexity: 'O(1) for both implementations',
    spaceComplexity: 'O(n) for storage'
  }
];

export const stackTutorial = {
  title: 'Stack Data Structure',
  description: 'Master the LIFO principle with interactive stack operations and real-world examples.',
  steps: stackTutorialSteps
};
