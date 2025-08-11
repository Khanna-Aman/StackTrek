import { Challenge } from '@/components/challenges/ChallengeSystem';

export const challenges: Challenge[] = [
  // Array Challenges
  {
    id: 'array-reverse',
    title: 'Reverse an Array',
    description: 'Implement a function to reverse an array in-place without using built-in methods.',
    difficulty: 'easy',
    category: 'array',
    timeLimit: 300, // 5 minutes
    xpReward: 50,
    instructions: [
      'Create a function called reverseArray that takes an array as input',
      'Reverse the array in-place (modify the original array)',
      'Do not use built-in methods like reverse()',
      'Use two pointers approach for optimal solution',
      'Return the modified array'
    ],
    initialCode: `function reverseArray(arr) {
  // Your code here
  
  return arr;
}`,
    testCases: [
      {
        input: [1, 2, 3, 4, 5],
        expectedOutput: [5, 4, 3, 2, 1],
        description: 'Reverse [1,2,3,4,5] to [5,4,3,2,1]'
      },
      {
        input: ['a', 'b', 'c'],
        expectedOutput: ['c', 'b', 'a'],
        description: 'Reverse string array'
      },
      {
        input: [42],
        expectedOutput: [42],
        description: 'Single element array'
      }
    ],
    hints: [
      'Use two pointers: one at start, one at end',
      'Swap elements and move pointers toward center',
      'Stop when pointers meet in the middle'
    ]
  },
  {
    id: 'array-two-sum',
    title: 'Two Sum Problem',
    description: 'Find two numbers in an array that add up to a target sum.',
    difficulty: 'medium',
    category: 'array',
    timeLimit: 600, // 10 minutes
    xpReward: 100,
    instructions: [
      'Create a function called twoSum that takes an array and target number',
      'Find two numbers that add up to the target',
      'Return the indices of the two numbers',
      'Assume there is exactly one solution',
      'You cannot use the same element twice'
    ],
    initialCode: `function twoSum(nums, target) {
  // Your code here
  
  return [];
}`,
    testCases: [
      {
        input: { nums: [2, 7, 11, 15], target: 9 },
        expectedOutput: [0, 1],
        description: 'nums[0] + nums[1] = 2 + 7 = 9'
      },
      {
        input: { nums: [3, 2, 4], target: 6 },
        expectedOutput: [1, 2],
        description: 'nums[1] + nums[2] = 2 + 4 = 6'
      }
    ],
    hints: [
      'Use a hash map to store seen numbers',
      'For each number, check if target - number exists',
      'Time complexity should be O(n)'
    ]
  },

  // Stack Challenges
  {
    id: 'stack-balanced-parentheses',
    title: 'Balanced Parentheses',
    description: 'Check if parentheses in a string are balanced using a stack.',
    difficulty: 'easy',
    category: 'stack',
    timeLimit: 480, // 8 minutes
    xpReward: 75,
    instructions: [
      'Create a function called isBalanced that takes a string',
      'Check if parentheses (), brackets [], and braces {} are balanced',
      'Use a stack data structure',
      'Return true if balanced, false otherwise',
      'Ignore non-bracket characters'
    ],
    initialCode: `function isBalanced(str) {
  // Your code here
  
  return false;
}`,
    testCases: [
      {
        input: '()',
        expectedOutput: true,
        description: 'Simple balanced parentheses'
      },
      {
        input: '()[]{}',
        expectedOutput: true,
        description: 'Multiple balanced brackets'
      },
      {
        input: '([{}])',
        expectedOutput: true,
        description: 'Nested balanced brackets'
      },
      {
        input: '([)]',
        expectedOutput: false,
        description: 'Incorrectly nested brackets'
      }
    ],
    hints: [
      'Push opening brackets onto stack',
      'Pop and check matching for closing brackets',
      'Stack should be empty at the end'
    ]
  },

  // Queue Challenges
  {
    id: 'queue-first-non-repeating',
    title: 'First Non-Repeating Character',
    description: 'Find the first non-repeating character in a stream using a queue.',
    difficulty: 'medium',
    category: 'queue',
    timeLimit: 720, // 12 minutes
    xpReward: 125,
    instructions: [
      'Create a function that processes a stream of characters',
      'Return the first non-repeating character at each step',
      'Use a queue to maintain order of characters',
      'Use a frequency map to track character counts',
      'Return -1 if no non-repeating character exists'
    ],
    initialCode: `function firstNonRepeating(stream) {
  // Your code here
  
  return [];
}`,
    testCases: [
      {
        input: 'abcabc',
        expectedOutput: ['a', 'a', 'a', 'b', 'c', -1],
        description: 'Stream processing example'
      }
    ],
    hints: [
      'Use queue to maintain insertion order',
      'Use map to count character frequencies',
      'Remove characters from queue front if they repeat'
    ]
  },

  // Tree Challenges
  {
    id: 'tree-max-depth',
    title: 'Maximum Depth of Binary Tree',
    description: 'Find the maximum depth (height) of a binary tree.',
    difficulty: 'easy',
    category: 'tree',
    timeLimit: 420, // 7 minutes
    xpReward: 80,
    instructions: [
      'Create a function called maxDepth that takes a tree root',
      'Calculate the maximum depth of the binary tree',
      'Depth is the number of nodes from root to deepest leaf',
      'Use recursive approach',
      'Handle empty tree case'
    ],
    initialCode: `function maxDepth(root) {
  // Your code here
  
  return 0;
}`,
    testCases: [
      {
        input: 'Tree: [3,9,20,null,null,15,7]',
        expectedOutput: 3,
        description: 'Tree with depth 3'
      },
      {
        input: 'Tree: [1,null,2]',
        expectedOutput: 2,
        description: 'Skewed tree'
      }
    ],
    hints: [
      'Base case: null node has depth 0',
      'Recursive case: 1 + max(left_depth, right_depth)',
      'Think about the tree structure'
    ]
  },

  // Sorting Challenges
  {
    id: 'sorting-bubble-sort',
    title: 'Implement Bubble Sort',
    description: 'Implement the bubble sort algorithm with optimization.',
    difficulty: 'easy',
    category: 'sorting',
    timeLimit: 600, // 10 minutes
    xpReward: 90,
    instructions: [
      'Implement bubble sort algorithm',
      'Add optimization to stop early if array becomes sorted',
      'Sort the array in ascending order',
      'Use the swapping technique',
      'Track if any swaps were made in each pass'
    ],
    initialCode: `function bubbleSort(arr) {
  // Your code here
  
  return arr;
}`,
    testCases: [
      {
        input: [64, 34, 25, 12, 22, 11, 90],
        expectedOutput: [11, 12, 22, 25, 34, 64, 90],
        description: 'Sort random array'
      },
      {
        input: [5, 1, 4, 2, 8],
        expectedOutput: [1, 2, 4, 5, 8],
        description: 'Sort small array'
      }
    ],
    hints: [
      'Compare adjacent elements and swap if needed',
      'Use nested loops for multiple passes',
      'Optimize with early termination flag'
    ]
  },

  // Graph Challenges
  {
    id: 'graph-bfs',
    title: 'Breadth-First Search',
    description: 'Implement BFS traversal for a graph using a queue.',
    difficulty: 'medium',
    category: 'graph',
    timeLimit: 900, // 15 minutes
    xpReward: 150,
    instructions: [
      'Implement BFS traversal starting from a given node',
      'Use a queue to maintain the order of exploration',
      'Keep track of visited nodes to avoid cycles',
      'Return the order of nodes visited',
      'Handle disconnected components'
    ],
    initialCode: `function bfs(graph, startNode) {
  // Your code here
  
  return [];
}`,
    testCases: [
      {
        input: { graph: [[1,2],[0,3],[0,3],[1,2]], start: 0 },
        expectedOutput: [0, 1, 2, 3],
        description: 'BFS from node 0'
      }
    ],
    hints: [
      'Use queue for level-by-level exploration',
      'Mark nodes as visited when adding to queue',
      'Process neighbors of current node'
    ]
  },

  // Advanced Challenges
  {
    id: 'advanced-lru-cache',
    title: 'LRU Cache Implementation',
    description: 'Implement a Least Recently Used (LRU) cache with O(1) operations.',
    difficulty: 'hard',
    category: 'array',
    timeLimit: 1200, // 20 minutes
    xpReward: 200,
    instructions: [
      'Implement LRU cache with get and put operations',
      'Both operations should be O(1) time complexity',
      'Use doubly linked list and hash map',
      'When capacity is reached, remove least recently used item',
      'Update item position on access'
    ],
    initialCode: `class LRUCache {
  constructor(capacity) {
    // Your code here
  }
  
  get(key) {
    // Your code here
  }
  
  put(key, value) {
    // Your code here
  }
}`,
    testCases: [
      {
        input: 'Operations: put(1,1), put(2,2), get(1), put(3,3), get(2)',
        expectedOutput: [null, null, 1, null, -1],
        description: 'LRU cache operations'
      }
    ],
    hints: [
      'Combine hash map with doubly linked list',
      'Hash map provides O(1) access',
      'Linked list maintains LRU order'
    ]
  }
];

export const getChallengesByCategory = (category: string) => {
  return challenges.filter(challenge => challenge.category === category);
};

export const getChallengesByDifficulty = (difficulty: string) => {
  return challenges.filter(challenge => challenge.difficulty === difficulty);
};

export const getChallengeById = (id: string) => {
  return challenges.find(challenge => challenge.id === id);
};
