import React, { useState, useEffect, useCallback } from 'react';
import Done from './Done';

const myVar='hello'
// Usage
function Tester() {
  const { execute, pending, value, error } = useAsync(myFunction(myVar), false);

  return (
    <div>
      {value && <div>{value}</div>}
      {error && <div>{error}</div>}
      <button onClick={execute} disabled={pending}>
        {!pending ? 'Click me' : 'Loading...'}
      </button>
    </div>
  );
}

const run=(myVar: React.ReactNode)=>{
    return <Done arrivalDate={myVar}/>
}
// An async function for testing our hook.
// Will be successful 50% of the time.
const myFunction = (myVar: {} | null | undefined) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const rnd = Math.random() * 10;
      rnd >= 0
        ? resolve(run(myVar))
        : reject('Oh no there was an error 😞');
    }, 2000);
  });
};

// Hook
const useAsync = (asyncFunction:any, immediate = true) => {
  const [pending, setPending] = useState(false);
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps our function and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setPending(true);
    setValue(null);
    setError(null);
    return asyncFunction()
      .then((response: React.SetStateAction<null>) => setValue(response))
      .catch((error: React.SetStateAction<null>) => setError(error))
      .finally(() => setPending(false));
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, pending, value, error };
};

export default Tester;