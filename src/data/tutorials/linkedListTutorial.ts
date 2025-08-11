import { TutorialStep } from '@/types/tutorial';

export const linkedListTutorialSteps: TutorialStep[] = [
  {
    id: 'linkedlist-intro',
    title: 'What is a Linked List?',
    description: 'Learn about dynamic data structures and node-based storage.',
    explanation: 'A linked list is a linear data structure where elements are stored in nodes. Each node contains data and a reference (or link) to the next node in the sequence. Unlike arrays, linked lists don\'t store elements in contiguous memory locations.',
    tips: [
      'Elements are stored in nodes scattered throughout memory',
      'Each node contains data and a pointer to the next node',
      'Dynamic size - can grow or shrink during runtime',
      'No random access - must traverse from head to reach elements'
    ],
    timeComplexity: 'O(n) for search, O(1) for insertion/deletion at head',
    spaceComplexity: 'O(n)'
  },
  {
    id: 'linkedlist-structure',
    title: 'Node Structure',
    description: 'Understanding the building blocks of linked lists.',
    code: `// Node structure in JavaScript
class ListNode {
  constructor(data) {
    this.data = data;     // Store the actual value
    this.next = null;     // Pointer to next node
  }
}

// Creating nodes
let node1 = new ListNode(10);
let node2 = new ListNode(20);
let node3 = new ListNode(30);

// Linking nodes
node1.next = node2;
node2.next = node3;
node3.next = null;  // Last node points to null`,
    language: 'JavaScript',
    explanation: 'Each node in a linked list contains two parts: the data field (stores the actual value) and the next field (stores reference to the next node). The last node\'s next field points to null, indicating the end of the list.',
    tips: [
      'Data field: stores the actual information',
      'Next field: stores memory address of next node',
      'Head pointer: points to the first node',
      'Tail pointer: points to the last node (optional)'
    ],
    timeComplexity: 'O(1) for node creation',
    spaceComplexity: 'O(1) per node'
  },
  {
    id: 'linkedlist-insertion',
    title: 'Insertion Operations',
    description: 'Learn how to add elements to a linked list.',
    code: `// Insert at beginning (head)
function insertAtHead(head, data) {
  let newNode = new ListNode(data);
  newNode.next = head;
  return newNode;  // New head
}

// Insert at end (tail)
function insertAtTail(head, data) {
  let newNode = new ListNode(data);
  
  if (!head) return newNode;
  
  let current = head;
  while (current.next) {
    current = current.next;
  }
  current.next = newNode;
  return head;
}

// Insert at specific position
function insertAtPosition(head, data, position) {
  if (position === 0) {
    return insertAtHead(head, data);
  }
  
  let newNode = new ListNode(data);
  let current = head;
  
  for (let i = 0; i < position - 1 && current; i++) {
    current = current.next;
  }
  
  if (current) {
    newNode.next = current.next;
    current.next = newNode;
  }
  
  return head;
}`,
    language: 'JavaScript',
    explanation: 'Insertion in linked lists can happen at three positions: beginning (head), end (tail), or at a specific position. Each has different time complexities and implementation strategies.',
    tips: [
      'Head insertion: O(1) - just update head pointer',
      'Tail insertion: O(n) - must traverse to end',
      'Position insertion: O(n) - traverse to position',
      'Always check for null pointers to avoid errors'
    ],
    timeComplexity: 'O(1) at head, O(n) at tail/position',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'linkedlist-deletion',
    title: 'Deletion Operations',
    description: 'Learn how to remove elements from a linked list.',
    code: `// Delete from beginning
function deleteHead(head) {
  if (!head) return null;
  return head.next;
}

// Delete from end
function deleteTail(head) {
  if (!head) return null;
  if (!head.next) return null;
  
  let current = head;
  while (current.next.next) {
    current = current.next;
  }
  current.next = null;
  return head;
}

// Delete by value
function deleteByValue(head, value) {
  if (!head) return null;
  
  if (head.data === value) {
    return head.next;
  }
  
  let current = head;
  while (current.next && current.next.data !== value) {
    current = current.next;
  }
  
  if (current.next) {
    current.next = current.next.next;
  }
  
  return head;
}`,
    language: 'JavaScript',
    explanation: 'Deletion involves updating pointers to skip over the node to be deleted. The key is to maintain the link between the previous and next nodes while removing the target node.',
    tips: [
      'Head deletion: O(1) - update head pointer',
      'Tail deletion: O(n) - find second-to-last node',
      'Value deletion: O(n) - search then delete',
      'Handle edge cases: empty list, single node'
    ],
    timeComplexity: 'O(1) at head, O(n) at tail/by value',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'linkedlist-traversal',
    title: 'Traversal and Search',
    description: 'Learn how to navigate through linked lists.',
    code: `// Basic traversal
function printList(head) {
  let current = head;
  let result = [];
  
  while (current) {
    result.push(current.data);
    current = current.next;
  }
  
  return result.join(' -> ') + ' -> null';
}

// Search for a value
function search(head, target) {
  let current = head;
  let position = 0;
  
  while (current) {
    if (current.data === target) {
      return position;
    }
    current = current.next;
    position++;
  }
  
  return -1; // Not found
}

// Get length of list
function getLength(head) {
  let count = 0;
  let current = head;
  
  while (current) {
    count++;
    current = current.next;
  }
  
  return count;
}`,
    language: 'JavaScript',
    explanation: 'Traversal is the process of visiting each node in the linked list sequentially. Since we can\'t directly access elements by index, we must follow the next pointers from the head to reach any element.',
    tips: [
      'Always start from head node',
      'Use a current pointer to track position',
      'Check for null to avoid infinite loops',
      'Linear traversal: must visit nodes in sequence'
    ],
    timeComplexity: 'O(n) for traversal and search',
    spaceComplexity: 'O(1)'
  },
  {
    id: 'linkedlist-applications',
    title: 'Real-World Applications',
    description: 'Discover where linked lists are used in practice.',
    code: `// Music Playlist Implementation
class Song {
  constructor(title, artist) {
    this.title = title;
    this.artist = artist;
    this.next = null;
  }
}

class Playlist {
  constructor() {
    this.head = null;
    this.current = null;
  }
  
  addSong(title, artist) {
    let newSong = new Song(title, artist);
    if (!this.head) {
      this.head = newSong;
      this.current = newSong;
    } else {
      let temp = this.head;
      while (temp.next) {
        temp = temp.next;
      }
      temp.next = newSong;
    }
  }
  
  playNext() {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current;
    }
    return null;
  }
  
  playPrevious() {
    if (this.current === this.head) return null;
    
    let temp = this.head;
    while (temp.next !== this.current) {
      temp = temp.next;
    }
    this.current = temp;
    return this.current;
  }
}`,
    language: 'JavaScript',
    explanation: 'Linked lists are perfect for scenarios where you need dynamic sizing and frequent insertions/deletions. They\'re used in music playlists, browser history, undo functionality, and implementing other data structures.',
    tips: [
      'Music playlists: Easy to add/remove songs',
      'Browser history: Navigate back and forward',
      'Undo operations: Stack of previous states',
      'Memory management: Dynamic allocation',
      'Implementation of stacks and queues'
    ],
    timeComplexity: 'Varies by operation',
    spaceComplexity: 'O(n) for n elements'
  }
];

export const linkedListTutorial = {
  title: 'Linked List Data Structure',
  description: 'Master dynamic data structures with node-based storage and pointer manipulation.',
  steps: linkedListTutorialSteps
};
