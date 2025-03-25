import React, {useState} from 'react';

const HOC = () => {
    return(
        <>
        <h2>HOC</h2>
        <Counter />
        <Counter />
        </>
    )
}
const Counter =() => {
    const [counter, setCounter] = useState(0);

    return (
        <>
        <h4>{counter} </h4>
        <button onClick={()=> setCounter(counter+1)}> Update </button>

        </>
    )
}

export default HOC;