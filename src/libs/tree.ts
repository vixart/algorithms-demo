// class TreeNode {
//   key: number | string;
//   value: number | string;
//   parent: TreeNode | null;
//   children: Array<TreeNode>;
//   constructor(
//     key: number | string,
//     value = key,
//     parent: TreeNode | null = null
//   ) {
//     this.key = key;
//     this.value = value;
//     this.parent = parent;
//     this.children = [];
//   }

//   get isLeaf() {
//     return this.children.length === 0;
//   }

//   get hasChildren() {
//     return !this.isLeaf;
//   }
// }

// class Tree {
//   root: TreeNode;
//   constructor(key: number | string, value = key) {
//     this.root = new TreeNode(key, value);
//   }

//   *preOrderTraversal(node = this.root): Generator<TreeNode> {
//     yield node;
//     if (node.children.length) {
//       for (let child of node.children) {
//         yield* this.preOrderTraversal(child);
//       }
//     }
//   }

//   *postOrderTraversal(node = this.root): Generator<TreeNode> {
//     if (node.children.length) {
//       for (let child of node.children) {
//         yield* this.postOrderTraversal(child);
//       }
//     }
//     yield node;
//   }

//   insert(parentNodeKey: number | string, key: number | string, value = key) {
//     for (let node of this.preOrderTraversal()) {
//       if (node.key === parentNodeKey) {
//         node.children.push(new TreeNode(key, value, node));
//         return true;
//       }
//     }
//     return false;
//   }

//   remove(key: number | string) {
//     for (let node of this.preOrderTraversal()) {
//       const filtered = node.children.filter((c) => c.key !== key);
//       if (filtered.length !== node.children.length) {
//         node.children = filtered;
//         return true;
//       }
//     }
//     return false;
//   }

//   find(key: number | string) {
//     for (let node of this.preOrderTraversal()) {
//       if (node.key === key) return node;
//     }
//     return undefined;
//   }
// }

export class Tree<T> {
  value: T;
  parent: Tree<T> | null;
  children: Array<Tree<T>>;
  constructor(value: T, parent: Tree<T> | null = null) {
    this.value = value;
    this.parent = parent;
    this.children = [];
    parent !== null && parent.children.push(this);
  }

  *postOrderTraversal(node = this.root): Generator<Tree<T>> {
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.postOrderTraversal(child);
      }
    }
    yield node;
  }

  totalNodes(): number {
    if (this.children.length === 0) {
      return 1;
    }

    let count = 0;
    for (let child of this.children) {
      count += child.totalNodes();
    }

    return count + 1;
  }

  get root(): Tree<T> {
    return this.parent !== null ? this.parent.root : this;
  }

  connected(tree: Tree<T>) {
    return this.root === tree.root;
  }

  connect(childNode: Tree<T> | T) {
    if (!(childNode instanceof Tree)) {
      childNode = new Tree(childNode, this);
    }
    if (!this.connected(childNode)) {
      const childRoot = childNode.root;
      childRoot.parent = this;
      this.children.push(childRoot);
    }
  }
}
