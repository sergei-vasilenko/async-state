# AsyncState

## When to use
If you have a task that updates state in the background and you might need to access the state while updating, this tool can help you.

## Methods
* `.wait<Int>`: signals the start of data refresh. The argument passes the maximum time to complete the update in milliseconds, after which the process is considered to have failed
* `.set<Any>`: allows you to set the data in the object
* `.update<Fn>`: allows you to update the data in the object. The passed callback receives existing data and should return updated data
* `.result<Any>`: signals the successful completion of the update. The argument sets the data to be retrieved from the object
* `.fail<Any>`: signals that the update failed. The argument sets the data to be retrieved from the object
* `.then<Fn><Fn>`: get data from an object. The first transmitted callback is triggered when the update is successful, the second is triggered when the update is unsuccessful.

## Usage
1. Initialize the class with default data and the maximum possible duration of the operation
```
const process = new AsyncState({ id: Date.now() }, 5000)
```

2. We inform about the start of the update using the `.wait` method
3. Set the intermediate value using the `.set` method (may be necessary if the code is accessing an object before calling the `.wait` method, but its value cannot be set during initialization)
4. We save the updated data and signal that the update is completed using the `.result` method
5. If necessary, throw an exception using the `.fail` method
```
try {
  process.wait();
  const data = await updataData();
  process.result(data);
} catch (err) {
  process.fail(err);
}

```

6. Receive data asynchronously:
```
const getData = async() => {
  try {
    const data = await process;
    return { success: true, data };
  } catch (err) {
    console.error(err)
    return { success: false, data: null, message: err.message };
  }
};
```