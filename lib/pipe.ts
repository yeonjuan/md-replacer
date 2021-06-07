class Pipe<PipeFunc extends (arg: any) => any> {
  private pipes: PipeFunc[] = [];

  public push(pipe: PipeFunc): void {
    this.pipes.push(pipe);
  }

  public pipeline() {
    return (input: Parameters<PipeFunc>[0]) => {
      let output = input;
      for (const func of this.pipes) {
        output = func(output);
      }
      return output;
    };
  }
}

export = Pipe;
