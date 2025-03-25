import React, { useRef } from 'react';

function UncontrolledInput() {
  const inputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Submitted value: ${inputRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Input:
        <input type="text" ref={inputRef} placeholder='Uncontrolled' />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledInput;
