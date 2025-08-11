import { TutorialStep } from '@/types/tutorial';

export const arrayTutorialSteps: TutorialStep[] = [
  {
    id: 'array-intro',
    title: 'What is an Array?',
    description: 'Learn the fundamentals of arrays and their characteristics.',
    explanation: 'An array is a collection of elements stored in contiguous memory locations. Each element can be accessed directly using its index, making arrays perfect for scenarios where you need fast random access to data.',
    tips: [
      'Arrays have fixed size in many programming languages',
      'Index starts from 0 in most programming languages',
      'All elements in an array are of the same data type'
    ],
    timeComplexity: 'O(1) access',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'array-creation',
    title: 'Creating Arrays',
    description: 'Learn different ways to create and initialize arrays.',
    code: `// JavaScript
let numbers = [1, 2, 3, 4, 5];
let fruits = new Array('apple', 'banana', 'orange');
let empty = new Array(10); // Array with 10 undefined elements

// Python
numbers = [1, 2, 3, 4, 5]
fruits = ['apple', 'banana', 'orange']
empty = [None] * 10

// Java
int[] numbers = {1, 2, 3, 4, 5};
String[] fruits = new String[]{"apple", "banana", "orange"};
int[] empty = new int[10];`,
    language: 'Multiple Languages',
    explanation: 'Arrays can be created in various ways depending on the programming language. You can initialize them with values, create empty arrays of a specific size, or use built-in constructors.',
    tips: [
      'Initialize arrays with known values when possible',
      'Consider the initial size to avoid frequent resizing',
      'Use meaningful variable names for better code readability'
    ]
  },
  {
    id: 'array-access',
    title: 'Accessing Elements',
    description: 'Learn how to read and write array elements using indices.',
    code: `// Accessing elements
let arr = [10, 20, 30, 40, 50];

// Reading elements
console.log(arr[0]);    // 10 (first element)
console.log(arr[2]);    // 30 (third element)
console.log(arr[4]);    // 50 (last element)

// Writing elements
arr[1] = 25;           // Change second element
arr[arr.length - 1] = 55; // Change last element

console.log(arr);      // [10, 25, 30, 40, 55]`,
    language: 'JavaScript',
    explanation: 'Array elements are accessed using square bracket notation with the index. Remember that indices start from 0, so the first element is at index 0, second at index 1, and so on.',
    tips: [
      'Always check if index is within array bounds',
      'Use arr.length - 1 to access the last element',
      'Negative indices are not valid in most languages'
    ],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'array-insertion',
    title: 'Inserting Elements',
    description: 'Learn different methods to add elements to arrays.',
    code: `let arr = [1, 2, 3];

// Add to end (most efficient)
arr.push(4);           // [1, 2, 3, 4]

// Add to beginning (requires shifting)
arr.unshift(0);        // [0, 1, 2, 3, 4]

// Insert at specific position
arr.splice(2, 0, 1.5); // [0, 1, 1.5, 2, 3, 4]

// Using spread operator
arr = [...arr, 5, 6];  // [0, 1, 1.5, 2, 3, 4, 5, 6]`,
    language: 'JavaScript',
    explanation: 'There are several ways to insert elements into arrays. Adding to the end is most efficient, while inserting at the beginning or middle requires shifting existing elements.',
    tips: [
      'push() is fastest for adding to the end',
      'unshift() and splice() are slower due to element shifting',
      'Consider using data structures like linked lists for frequent insertions'
    ],
    timeComplexity: 'O(1) end, O(n) beginning/middle',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'array-deletion',
    title: 'Deleting Elements',
    description: 'Learn how to remove elements from arrays efficiently.',
    code: `let arr = [1, 2, 3, 4, 5];

// Remove from end (most efficient)
let last = arr.pop();     // Returns 5, arr = [1, 2, 3, 4]

// Remove from beginning (requires shifting)
let first = arr.shift();  // Returns 1, arr = [2, 3, 4]

// Remove from specific position
arr.splice(1, 1);         // Remove 1 element at index 1
                          // arr = [2, 4]

// Remove multiple elements
arr.splice(0, 2);         // Remove 2 elements from index 0
                          // arr = []`,
    language: 'JavaScript',
    explanation: 'Removing elements from arrays can be done in various ways. Removing from the end is most efficient, while removing from the beginning or middle requires shifting remaining elements.',
    tips: [
      'pop() is fastest for removing from the end',
      'shift() and splice() are slower due to element shifting',
      'Always handle the case when array might be empty'
    ],
    timeComplexity: 'O(1) end, O(n) beginning/middle',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'array-searching',
    title: 'Searching in Arrays',
    description: 'Learn different techniques to find elements in arrays.',
    code: `let arr = [10, 25, 30, 40, 55];

// Linear search
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Return index if found
    }
  }
  return -1; // Not found
}

// Using built-in methods
let index = arr.indexOf(30);     // Returns 2
let exists = arr.includes(40);   // Returns true
let found = arr.find(x => x > 35); // Returns 40

console.log(linearSearch(arr, 30)); // 2
console.log(index);                  // 2
console.log(exists);                 // true`,
    language: 'JavaScript',
    explanation: 'Searching in arrays can be done using linear search (checking each element) or using built-in methods. For sorted arrays, binary search is more efficient.',
    tips: [
      'Use indexOf() for simple value searches',
      'Use find() for complex condition searches',
      'Consider binary search for sorted arrays'
    ],
    timeComplexity: 'O(n) linear, O(log n) binary',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'array-common-operations',
    title: 'Common Array Operations',
    description: 'Explore frequently used array operations and methods.',
    code: `let numbers = [1, 2, 3, 4, 5];

// Iteration
numbers.forEach(num => console.log(num));

// Transformation
let doubled = numbers.map(num => num * 2);
// [2, 4, 6, 8, 10]

// Filtering
let evens = numbers.filter(num => num % 2 === 0);
// [2, 4]

// Reduction
let sum = numbers.reduce((acc, num) => acc + num, 0);
// 15

// Sorting
let unsorted = [3, 1, 4, 1, 5];
unsorted.sort((a, b) => a - b); // [1, 1, 3, 4, 5]

// Reversing
let reversed = [...numbers].reverse(); // [5, 4, 3, 2, 1]`,
    language: 'JavaScript',
    explanation: 'Modern programming languages provide many built-in methods for common array operations like iteration, transformation, filtering, and sorting. These methods make code more readable and often more efficient.',
    tips: [
      'Use map() for transforming all elements',
      'Use filter() for selecting elements based on conditions',
      'Use reduce() for aggregating values',
      'Many array methods return new arrays (immutable operations)'
    ],
    timeComplexity: 'Varies by operation',
    spaceComplexity: 'O(n) for most operations'
  }
];

export const arrayTutorial = {
  title: 'Array Fundamentals',
  description: 'Master the basics of arrays with interactive examples and explanations.',
  steps: arrayTutorialSteps
};
