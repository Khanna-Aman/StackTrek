import { CodeExample } from '@/components/code/CodeExamplesViewer';

export const arrayImplementationExamples: CodeExample[] = [
  {
    language: 'JavaScript',
    code: `class DynamicArray {
  constructor() {
    this.data = [];
    this.size = 0;
  }

  // Access element at index
  get(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('Index out of bounds');
    }
    return this.data[index];
  }

  // Set element at index
  set(index, value) {
    if (index < 0 || index >= this.size) {
      throw new Error('Index out of bounds');
    }
    this.data[index] = value;
  }

  // Add element to end
  push(value) {
    this.data[this.size] = value;
    this.size++;
  }

  // Remove element from end
  pop() {
    if (this.size === 0) {
      throw new Error('Array is empty');
    }
    const value = this.data[this.size - 1];
    this.size--;
    return value;
  }

  // Insert element at index
  insert(index, value) {
    if (index < 0 || index > this.size) {
      throw new Error('Index out of bounds');
    }
    
    // Shift elements to the right
    for (let i = this.size; i > index; i--) {
      this.data[i] = this.data[i - 1];
    }
    
    this.data[index] = value;
    this.size++;
  }

  // Remove element at index
  remove(index) {
    if (index < 0 || index >= this.size) {
      throw new Error('Index out of bounds');
    }
    
    const value = this.data[index];
    
    // Shift elements to the left
    for (let i = index; i < this.size - 1; i++) {
      this.data[i] = this.data[i + 1];
    }
    
    this.size--;
    return value;
  }

  // Get current size
  length() {
    return this.size;
  }

  // Check if array is empty
  isEmpty() {
    return this.size === 0;
  }
}`,
    description: 'Complete dynamic array implementation with all basic operations.',
    complexity: {
      time: 'O(1) access/push/pop, O(n) insert/remove',
      space: 'O(n)'
    }
  },
  {
    language: 'Python',
    code: `class DynamicArray:
    def __init__(self):
        self._data = []
        self._size = 0
    
    def __getitem__(self, index):
        """Access element at index"""
        if not 0 <= index < self._size:
            raise IndexError("Index out of bounds")
        return self._data[index]
    
    def __setitem__(self, index, value):
        """Set element at index"""
        if not 0 <= index < self._size:
            raise IndexError("Index out of bounds")
        self._data[index] = value
    
    def append(self, value):
        """Add element to end"""
        self._data.append(value)
        self._size += 1
    
    def pop(self):
        """Remove and return last element"""
        if self._size == 0:
            raise IndexError("Array is empty")
        value = self._data.pop()
        self._size -= 1
        return value
    
    def insert(self, index, value):
        """Insert element at index"""
        if not 0 <= index <= self._size:
            raise IndexError("Index out of bounds")
        self._data.insert(index, value)
        self._size += 1
    
    def remove(self, index):
        """Remove element at index"""
        if not 0 <= index < self._size:
            raise IndexError("Index out of bounds")
        value = self._data.pop(index)
        self._size -= 1
        return value
    
    def __len__(self):
        """Get current size"""
        return self._size
    
    def is_empty(self):
        """Check if array is empty"""
        return self._size == 0
    
    def __str__(self):
        """String representation"""
        return str(self._data[:self._size])`,
    description: 'Pythonic array implementation using list as underlying storage.',
    complexity: {
      time: 'O(1) access/append/pop, O(n) insert/remove',
      space: 'O(n)'
    }
  },
  {
    language: 'Java',
    code: `public class DynamicArray<T> {
    private Object[] data;
    private int size;
    private int capacity;
    
    public DynamicArray() {
        this.capacity = 10;
        this.data = new Object[capacity];
        this.size = 0;
    }
    
    // Access element at index
    @SuppressWarnings("unchecked")
    public T get(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index out of bounds");
        }
        return (T) data[index];
    }
    
    // Set element at index
    public void set(int index, T value) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index out of bounds");
        }
        data[index] = value;
    }
    
    // Add element to end
    public void add(T value) {
        if (size >= capacity) {
            resize();
        }
        data[size++] = value;
    }
    
    // Remove element from end
    @SuppressWarnings("unchecked")
    public T removeLast() {
        if (size == 0) {
            throw new RuntimeException("Array is empty");
        }
        T value = (T) data[--size];
        data[size] = null; // Help GC
        return value;
    }
    
    // Insert element at index
    public void insert(int index, T value) {
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException("Index out of bounds");
        }
        
        if (size >= capacity) {
            resize();
        }
        
        // Shift elements to the right
        for (int i = size; i > index; i--) {
            data[i] = data[i - 1];
        }
        
        data[index] = value;
        size++;
    }
    
    // Remove element at index
    @SuppressWarnings("unchecked")
    public T remove(int index) {
        if (index < 0 || index >= size) {
            throw new IndexOutOfBoundsException("Index out of bounds");
        }
        
        T value = (T) data[index];
        
        // Shift elements to the left
        for (int i = index; i < size - 1; i++) {
            data[i] = data[i + 1];
        }
        
        data[--size] = null; // Help GC
        return value;
    }
    
    // Resize array when capacity is reached
    private void resize() {
        capacity *= 2;
        Object[] newData = new Object[capacity];
        System.arraycopy(data, 0, newData, 0, size);
        data = newData;
    }
    
    public int size() {
        return size;
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
}`,
    description: 'Generic dynamic array with automatic resizing and type safety.',
    complexity: {
      time: 'O(1) amortized add, O(n) insert/remove',
      space: 'O(n)'
    }
  },
  {
    language: 'C++',
    code: `#include <stdexcept>
#include <iostream>

template<typename T>
class DynamicArray {
private:
    T* data;
    size_t size;
    size_t capacity;
    
    void resize() {
        capacity *= 2;
        T* newData = new T[capacity];
        for (size_t i = 0; i < size; i++) {
            newData[i] = data[i];
        }
        delete[] data;
        data = newData;
    }
    
public:
    DynamicArray() : size(0), capacity(10) {
        data = new T[capacity];
    }
    
    ~DynamicArray() {
        delete[] data;
    }
    
    // Copy constructor
    DynamicArray(const DynamicArray& other) 
        : size(other.size), capacity(other.capacity) {
        data = new T[capacity];
        for (size_t i = 0; i < size; i++) {
            data[i] = other.data[i];
        }
    }
    
    // Assignment operator
    DynamicArray& operator=(const DynamicArray& other) {
        if (this != &other) {
            delete[] data;
            size = other.size;
            capacity = other.capacity;
            data = new T[capacity];
            for (size_t i = 0; i < size; i++) {
                data[i] = other.data[i];
            }
        }
        return *this;
    }
    
    // Access operators
    T& operator[](size_t index) {
        if (index >= size) {
            throw std::out_of_range("Index out of bounds");
        }
        return data[index];
    }
    
    const T& operator[](size_t index) const {
        if (index >= size) {
            throw std::out_of_range("Index out of bounds");
        }
        return data[index];
    }
    
    void push_back(const T& value) {
        if (size >= capacity) {
            resize();
        }
        data[size++] = value;
    }
    
    T pop_back() {
        if (size == 0) {
            throw std::runtime_error("Array is empty");
        }
        return data[--size];
    }
    
    void insert(size_t index, const T& value) {
        if (index > size) {
            throw std::out_of_range("Index out of bounds");
        }
        
        if (size >= capacity) {
            resize();
        }
        
        for (size_t i = size; i > index; i--) {
            data[i] = data[i - 1];
        }
        
        data[index] = value;
        size++;
    }
    
    T remove(size_t index) {
        if (index >= size) {
            throw std::out_of_range("Index out of bounds");
        }
        
        T value = data[index];
        
        for (size_t i = index; i < size - 1; i++) {
            data[i] = data[i + 1];
        }
        
        size--;
        return value;
    }
    
    size_t getSize() const { return size; }
    bool isEmpty() const { return size == 0; }
};`,
    description: 'Template-based dynamic array with proper memory management and RAII.',
    complexity: {
      time: 'O(1) amortized push_back, O(n) insert/remove',
      space: 'O(n)'
    }
  }
];

export const arrayAlgorithmExamples: CodeExample[] = [
  {
    language: 'JavaScript',
    code: `// Binary Search in Sorted Array
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Not found
}

// Two Pointer Technique
function twoSum(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return [-1, -1]; // Not found
}

// Sliding Window Maximum
function maxSlidingWindow(arr, k) {
  const result = [];
  const deque = []; // Store indices
  
  for (let i = 0; i < arr.length; i++) {
    // Remove indices outside window
    while (deque.length && deque[0] <= i - k) {
      deque.shift();
    }
    
    // Remove smaller elements
    while (deque.length && arr[deque[deque.length - 1]] <= arr[i]) {
      deque.pop();
    }
    
    deque.push(i);
    
    // Add to result if window is complete
    if (i >= k - 1) {
      result.push(arr[deque[0]]);
    }
  }
  
  return result;
}`,
    description: 'Common array algorithms: binary search, two pointers, and sliding window.',
    complexity: {
      time: 'O(log n) binary search, O(n) others',
      space: 'O(1) to O(k)'
    }
  }
];
