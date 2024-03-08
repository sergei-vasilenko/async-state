class AsyncState {
  #value;
  #maxDuration;
  #resolve = null;
  #reject = null;
  #timer = null;

  constructor(defaultValue, maxDuration = 0) {
    this.#value = Promise.resolve(defaultValue);
    this.#maxDuration = maxDuration;
  }

  then(onFulfilled, onRejected) {
    return this.#value.then(onFulfilled, onRejected);
  }

  update(callback) {
    this.#value = this.#value.then((data) => callback(data));
  }

  wait(maxDuration) {
    this.#value = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
    const duration = maxDuration || this.#maxDuration;
    if (duration > 0) {
      this.#timer = setTimeout(
        () => this.fail(new Error("Timeout has expider")),
        duration
      );
    }
  }

  result(data) {
    clearTimeout(this.#timer);
    this.#resolve(data);
  }

  fail(data) {
    clearTimeout(this.#timer);
    this.#reject(data);
  }
}

export default AsyncState;
