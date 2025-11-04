export class Mutex {
  private chain: Promise<void> = Promise.resolve();
  async runExclusive<T>(task: () => Promise<T>): Promise<T> {
    const next = this.chain.then(task, task);
    this.chain = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }
}
