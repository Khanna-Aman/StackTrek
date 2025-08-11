import { TutorialStep } from '@/types/tutorial';

export const binaryTreeTutorialSteps: TutorialStep[] = [
  {
    id: 'tree-intro',
    title: 'What is a Binary Tree?',
    description: 'Understand the structure and properties of binary trees.',
    explanation: 'A binary tree is a hierarchical data structure where each node has at most two children, referred to as the left child and right child. Binary Search Trees (BST) maintain the property that left children are smaller and right children are larger than their parent.',
    tips: [
      'Each node can have 0, 1, or 2 children',
      'The topmost node is called the root',
      'Nodes with no children are called leaves',
      'BST property enables efficient searching'
    ],
    timeComplexity: 'O(log n) average, O(n) worst',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'tree-structure',
    title: 'Tree Node Structure',
    description: 'Learn how tree nodes are implemented in code.',
    code: `// JavaScript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

// Java
class TreeNode {
    int value;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}`,
    language: 'Multiple Languages',
    explanation: 'A tree node contains three essential components: the data value and references to left and right child nodes. This simple structure enables the creation of complex hierarchical relationships.',
    tips: [
      'Initialize child pointers to null/None',
      'Consider adding a parent pointer for easier traversal',
      'Use meaningful variable names for clarity'
    ]
  },
  {
    id: 'tree-insertion',
    title: 'Inserting Nodes',
    description: 'Learn how to insert new nodes while maintaining BST property.',
    code: `function insert(root, value) {
  // Base case: create new node
  if (root === null) {
    return new TreeNode(value);
  }
  
  // Recursive insertion
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  // Ignore duplicates
  
  return root;
}

// Usage
let root = null;
root = insert(root, 50);
root = insert(root, 30);
root = insert(root, 70);
root = insert(root, 20);`,
    language: 'JavaScript',
    explanation: 'Insertion in a BST follows a simple rule: go left if the new value is smaller, go right if larger. This recursive process continues until we find an empty spot (null) where we create the new node.',
    tips: [
      'Always compare with current node value',
      'Handle the base case (empty tree) first',
      'Decide how to handle duplicate values',
      'Maintain the BST property at all times'
    ],
    timeComplexity: 'O(log n) average, O(n) worst',
    spaceComplexity: 'O(log n) recursion stack'
  },
  {
    id: 'tree-search',
    title: 'Searching for Values',
    description: 'Implement efficient search operations in binary search trees.',
    code: `function search(root, target) {
  // Base cases
  if (root === null || root.value === target) {
    return root;
  }
  
  // Search in appropriate subtree
  if (target < root.value) {
    return search(root.left, target);
  } else {
    return search(root.right, target);
  }
}

// Iterative version (more memory efficient)
function searchIterative(root, target) {
  let current = root;
  
  while (current !== null) {
    if (target === current.value) {
      return current;
    } else if (target < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  
  return null; // Not found
}`,
    language: 'JavaScript',
    explanation: 'Searching in a BST is efficient because we can eliminate half of the remaining nodes at each step by comparing the target with the current node and choosing the appropriate subtree.',
    tips: [
      'Use the BST property to guide the search direction',
      'Iterative approach uses less memory than recursive',
      'Return null/None when value is not found',
      'Consider returning the node vs just a boolean'
    ],
    timeComplexity: 'O(log n) average, O(n) worst',
    spaceComplexity: 'O(1) iterative, O(log n) recursive'
  },
  {
    id: 'tree-traversal',
    title: 'Tree Traversal Methods',
    description: 'Explore different ways to visit all nodes in a tree.',
    code: `// Inorder: Left -> Root -> Right (gives sorted order in BST)
function inorderTraversal(root, result = []) {
  if (root !== null) {
    inorderTraversal(root.left, result);
    result.push(root.value);
    inorderTraversal(root.right, result);
  }
  return result;
}

// Preorder: Root -> Left -> Right
function preorderTraversal(root, result = []) {
  if (root !== null) {
    result.push(root.value);
    preorderTraversal(root.left, result);
    preorderTraversal(root.right, result);
  }
  return result;
}

// Postorder: Left -> Right -> Root
function postorderTraversal(root, result = []) {
  if (root !== null) {
    postorderTraversal(root.left, result);
    postorderTraversal(root.right, result);
    result.push(root.value);
  }
  return result;
}`,
    language: 'JavaScript',
    explanation: 'Tree traversal refers to visiting each node exactly once. The three main depth-first traversals differ in when they process the current node relative to its children.',
    tips: [
      'Inorder traversal of BST gives sorted sequence',
      'Preorder is useful for copying/serializing trees',
      'Postorder is useful for deleting trees safely',
      'Consider iterative versions for large trees'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(h) where h is height'
  },
  {
    id: 'tree-deletion',
    title: 'Deleting Nodes',
    description: 'Learn the complex process of removing nodes while maintaining BST property.',
    code: `function deleteNode(root, value) {
  if (root === null) return null;
  
  if (value < root.value) {
    root.left = deleteNode(root.left, value);
  } else if (value > root.value) {
    root.right = deleteNode(root.right, value);
  } else {
    // Node to delete found
    
    // Case 1: No children (leaf node)
    if (root.left === null && root.right === null) {
      return null;
    }
    
    // Case 2: One child
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;
    
    // Case 3: Two children
    // Find inorder successor (smallest in right subtree)
    let successor = findMin(root.right);
    root.value = successor.value;
    root.right = deleteNode(root.right, successor.value);
  }
  
  return root;
}

function findMin(node) {
  while (node.left !== null) {
    node = node.left;
  }
  return node;
}`,
    language: 'JavaScript',
    explanation: 'Deletion is the most complex BST operation. We handle three cases: leaf nodes (just remove), nodes with one child (replace with child), and nodes with two children (replace with inorder successor).',
    tips: [
      'Handle all three deletion cases carefully',
      'Inorder successor is the smallest node in right subtree',
      'Alternative: use inorder predecessor (largest in left subtree)',
      'Test edge cases like deleting root node'
    ],
    timeComplexity: 'O(log n) average, O(n) worst',
    spaceComplexity: 'O(log n) recursion stack'
  },
  {
    id: 'tree-applications',
    title: 'Real-World Applications',
    description: 'Discover how binary trees are used in practice.',
    explanation: 'Binary trees have numerous applications: file systems use tree structures for directories, databases use B-trees for indexing, compilers use syntax trees for parsing, and decision trees are fundamental in machine learning. BSTs provide efficient searching, sorting, and range queries.',
    tips: [
      'File systems: directories and subdirectories',
      'Databases: B-trees and B+ trees for indexing',
      'Compilers: Abstract Syntax Trees (AST)',
      'Machine Learning: Decision trees and random forests',
      'Expression evaluation: Binary expression trees',
      'Huffman coding: Optimal prefix codes'
    ],
    timeComplexity: 'Varies by application',
    spaceComplexity: 'O(n) typically'
  }
];

export const binaryTreeTutorial = {
  title: 'Binary Search Trees',
  description: 'Master binary trees with step-by-step explanations and code examples.',
  steps: binaryTreeTutorialSteps
};
