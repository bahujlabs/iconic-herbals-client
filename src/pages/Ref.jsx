import { useState,useRef } from "react"

const Ref = () => {
  const [stateCount, setStateCount] = useState(0)
  const refCount = useRef(0)
  const inputRef = useRef(null)
  console.log('i rendered')
  return (
    <div className='bg-black min-h-screen flex flex-col items-center justify-center'>
        <h1  className=" p-5 text-white">UseState ve UseRef</h1>
        <h3 className="text-white text-2xl font-bold mb-3">State: {stateCount}</h3>
        <h3 className="text-white text-2xl font-bold mb-6">Ref Count: {refCount.current}</h3>
     
        <div className="flex gap-4 mb-16">
             <button
            onClick={()=>{
                refCount.current += 1
                console.log('ref updated: ', refCount.current)
                }}
                className="px-4 py-2 bg-blue-950 text-white"

            >Increase Ref</button>
            <button
            onClick={()=>setStateCount(stateCount + 1)}
            className="px-4 py-2 bg-blue-950 text-white"
            >Increase State</button>
        </div>
        <div className="space-x-4">
            <input type="text" className="outline-none border-2 border-green-200 bg-white ring-2 ring-amber-300" ref={inputRef}
            />
            <button className="px-4 py-3 bg-blue-950 text-white"
                onClick={()=>inputRef.current.focus()}
            >
                Focus Input
            </button>
        </div>
    </div>
  )
}

export default Ref