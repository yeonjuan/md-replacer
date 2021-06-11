class Stack<Type> {
  private elements: Type[] = [];

  public static create<Type>() {
    return new Stack<Type>();
  }

  public isEmpty() {
    return this.elements.length <= 0;
  }

  public push(elem: Type) {
    this.elements.push(elem);
  }

  public pop() {
    return this.elements.pop();
  }

  public top() {
    return this.elements[this.elements.length - 1];
  }
}

export = Stack.create;
