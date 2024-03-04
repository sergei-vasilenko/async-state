class AsyncState {
  #value;
  #resolve = null;
  #reject = null;

  constructor(defaultValue) {
    this.#value = Promise.resolve(defaultValue);
  }

  then(onFulfilled, onRejected) {
    return this.#value.then(onFulfilled, onRejected);
  }

  set(callback) {
    this.#value.then((data) => callback(data));
  }

  wait() {
    this.#value = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  result(data) {
    this.#resolve(data);
  }

  fail(data) {
    this.#reject(data);
  }
}

export default AsyncState;
