export const stackTutorialSteps = [
  {
    id: 'intro',
    title: 'Welcome to Stack Data Structure',
    content: `
      <p>A <strong>Stack</strong> is a linear data structure that follows the <strong>LIFO (Last In, First Out)</strong> principle.</p>
      <p>Think of it like a stack of plates - you can only add or remove plates from the top!</p>
      <ul>
        <li>🔝 <strong>Push</strong>: Add an element to the top</li>
        <li>🔽 <strong>Pop</strong>: Remove the top element</li>
        <li>👁️ <strong>Peek</strong>: View the top element without removing it</li>
      </ul>
    `,
    interactive: false,
  },
  {
    id: 'push-operation',
    title: 'Push Operation',
    content: `
      <p>The <strong>Push</strong> operation adds a new element to the top of the stack.</p>
      <p><strong>Time Complexity:</strong> O(1) - Constant time</p>
      <p><strong>Space Complexity:</strong> O(1) - No extra space needed</p>
      <p>Try pushing the value <strong>50</strong> onto the stack using the controls on the right!</p>
    `,
    code: `
// Push operation in JavaScript
function push(stack, element) {
  stack.push(element);
  return stack;
}

// Example
let myStack = [10, 20, 30];
push(myStack, 50);
console.log(myStack); // [10, 20, 30, 50]
    `,
    interactive: true,
  },
  {
    id: 'pop-operation',
    title: 'Pop Operation',
    content: `
      <p>The <strong>Pop</strong> operation removes and returns the top element from the stack.</p>
      <p><strong>Time Complexity:</strong> O(1) - Constant time</p>
      <p><strong>Space Complexity:</strong> O(1) - No extra space needed</p>
      <p>Try popping an element from the stack using the Pop button!</p>
    `,
    code: `
// Pop operation in JavaScript
function pop(stack) {
  if (stack.length === 0) {
    throw new Error("Stack underflow!");
  }
  return stack.pop();
}

// Example
let myStack = [10, 20, 30, 50];
let poppedElement = pop(myStack);
console.log(poppedElement); // 50
console.log(myStack); // [10, 20, 30]
    `,
    interactive: true,
  },
  {
    id: 'peek-operation',
    title: 'Peek Operation',
    content: `
      <p>The <strong>Peek</strong> operation returns the top element without removing it.</p>
      <p><strong>Time Complexity:</strong> O(1) - Constant time</p>
      <p><strong>Space Complexity:</strong> O(1) - No extra space needed</p>
      <p>Try peeking at the top element using the Peek button!</p>
    `,
    code: `
// Peek operation in JavaScript
function peek(stack) {
  if (stack.length === 0) {
    throw new Error("Stack is empty!");
  }
  return stack[stack.length - 1];
}

// Example
let myStack = [10, 20, 30];
let topElement = peek(myStack);
console.log(topElement); // 30
console.log(myStack); // [10, 20, 30] (unchanged)
    `,
    interactive: true,
  },
  {
    id: 'real-world-applications',
    title: 'Real-World Applications',
    content: `
      <p>Stacks are used everywhere in computer science and programming:</p>
      <ul>
        <li>🌐 <strong>Browser History</strong>: Back button functionality</li>
        <li>🔄 <strong>Function Calls</strong>: Call stack in programming languages</li>
        <li>↩️ <strong>Undo Operations</strong>: Ctrl+Z in text editors</li>
        <li>🧮 <strong>Expression Evaluation</strong>: Parsing mathematical expressions</li>
        <li>🔍 <strong>Depth-First Search</strong>: Graph traversal algorithms</li>
        <li>📝 <strong>Syntax Parsing</strong>: Checking balanced parentheses</li>
      </ul>
      <p>Understanding stacks is fundamental to many programming concepts!</p>
    `,
    interactive: false,
  },
  {
    id: 'complexity-analysis',
    title: 'Time & Space Complexity',
    content: `
      <p>Stack operations are very efficient:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
        <tr style="background-color: #f8fafc;">
          <th style="padding: 0.5rem; border: 1px solid #e2e8f0;">Operation</th>
          <th style="padding: 0.5rem; border: 1px solid #e2e8f0;">Time Complexity</th>
          <th style="padding: 0.5rem; border: 1px solid #e2e8f0;">Space Complexity</th>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">Push</td>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">O(1)</td>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">O(1)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">Pop</td>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">O(1)</td>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">O(1)</td>
        </tr>
        <tr>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">Peek</td>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">O(1)</td>
          <td style="padding: 0.5rem; border: 1px solid #e2e8f0;">O(1)</td>
        </tr>
      </table>
      <p><strong>Overall Space Complexity:</strong> O(n) where n is the number of elements</p>
    `,
    interactive: false,
  },
  {
    id: 'practice-challenge',
    title: 'Practice Challenge',
    content: `
      <p>🎯 <strong>Challenge:</strong> Create a stack with the sequence [5, 10, 15, 20]</p>
      <p>Follow these steps:</p>
      <ol>
        <li>Reset the stack to start fresh</li>
        <li>Push 5, then 10, then 15, then 20</li>
        <li>Peek to verify the top element is 20</li>
        <li>Pop once to remove 20</li>
        <li>Peek again to verify the top is now 15</li>
      </ol>
      <p>This exercise will help you understand the LIFO behavior!</p>
    `,
    interactive: true,
  },
  {
    id: 'congratulations',
    title: 'Congratulations! 🎉',
    content: `
      <p>You've successfully learned about Stack data structures!</p>
      <p><strong>Key Takeaways:</strong></p>
      <ul>
        <li>✅ Stacks follow LIFO (Last In, First Out) principle</li>
        <li>✅ All operations (Push, Pop, Peek) are O(1) time complexity</li>
        <li>✅ Stacks are used in many real-world applications</li>
        <li>✅ Understanding stacks is fundamental to programming</li>
      </ul>
      <p>Ready to explore more data structures? Try the Queue or Array visualizations next!</p>
    `,
    interactive: false,
  },
];

export const stackTutorial = {
  title: 'Stack Data Structure',
  description: 'Learn about stacks through interactive visualization and hands-on practice.',
  steps: stackTutorialSteps,
};
