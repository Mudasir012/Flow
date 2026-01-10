class HistoryManager {
  constructor(maxEntries = 200) {
    this.maxEntries = maxEntries;
    this.stack = [];
    this.index = -1; // points to current snapshot
  }

  push(snapshot) {
    // Deep clone snapshot to avoid accidental mutations
    const copy = JSON.parse(JSON.stringify(snapshot));

    // If we're not at the top of the stack, drop redo entries
    if (this.index < this.stack.length - 1) {
      this.stack = this.stack.slice(0, this.index + 1);
    }

    this.stack.push(copy);
    if (this.stack.length > this.maxEntries) this.stack.shift();
    this.index = this.stack.length - 1;
  }

  canUndo() {
    return this.index > 0;
  }

  canRedo() {
    return this.index < this.stack.length - 1;
  }

  undo() {
    if (!this.canUndo()) return null;
    this.index -= 1;
    return JSON.parse(JSON.stringify(this.stack[this.index]));
  }

  redo() {
    if (!this.canRedo()) return null;
    this.index += 1;
    return JSON.parse(JSON.stringify(this.stack[this.index]));
  }

  clear() {
    this.stack = [];
    this.index = -1;
  }

  getCurrent() {
    if (this.index === -1) return null;
    return JSON.parse(JSON.stringify(this.stack[this.index]));
  }
}

export default HistoryManager;
