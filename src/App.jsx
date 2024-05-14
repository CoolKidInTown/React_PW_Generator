import {useRef} from 'react'
import {useCallback} from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
// import './App.css'
//CONCECPT OF MEMOIZATION IS ALSO USED HERE as in useCallback(()=>{},)

function App() {
 
  const [length, setLength] = useState(9)
  const [numberAllowed, setNumberAllowed] = useState(false)
  const [charAllowed, setCharAllowed] = useState(false)
  const [password, setPassword] = useState("")

  //ref hook for copy btn
  const passwordRef = useRef(null) //pw ka reference

//useCallback() caches the function definition b/w re renders and updates states from memoized callbacks
  const passwordGenerator = useCallback(() => { //changes cached
    let pass = "";
    let str = 
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";//data to form pw

    if(numberAllowed) str += "0123456789" //numbers cancat

    if(charAllowed) str += "!@#$%^&*_"

    for (let i = 1; i <= length; i++) {
      
        let char = Math.floor(Math.random() * str.length + 1);
        
        pass += str.charAt(char) //append 

      }

         setPassword(pass) 

  }, [length, numberAllowed, charAllowed, setPassword])
  //setPassword here is for memoization , methods ko optimize kardo

    // passwordGenerator();// react inifinite calling not valid 
    //too many re renders
    
    //COPY BTN
    const copyPasswordToClipboard = useCallback(() => {
      //selects current ref, ?. == optional select
      passwordRef.current?.select()
        
      //range of selection
      // passwordRef.current?.setSelectionRange(0,4);//substring selected

      //copy to clipboard syntax CSR vs SSR
      window.navigator.clipboard.writeText(password);

    }, [password])

    useEffect(() => {
        passwordGenerator()
      },[length, numberAllowed, 
        charAllowed], passwordGenerator)
        //dependency mai changes the re run

  return (
    <>
      <h1 className='text-4xl text-center'>Hello PW generator</h1>
      <div className='w-full max-w-md mx-auto shadow-md
        rounded-lg px-4 my-8 text-purple-900 bg-gray-450'>

          <div className='className = "flex shadow
            rounded-lg overflow-hidden mb-4"'>

            <input
              type="text"
              value={password}
              className='outline-none w-full py-1 px-3'
              placeholder='password'
              readOnly //non writeable/typeable
              ref={passwordRef} //ref hook lag gya
            ></input>
            <button 
              onClick={copyPasswordToClipboard}
              className='outline-none my-2 bg-blue-700
              text-white px-3 py-0.5 shrink-0 hover:bg-red-800'
            >Copy</button>
          
          </div>
          <div className='flex text-sm gap-x-2'>
            <div className='flex items-center gap-x-1'>
              <input
                type="range"
                min={6}
                max={50}
                value={length}
                className='cursor-pointer'
                onChange={(e) => {setLength(e.target.value)}}
                ></input>
                <label>Length: {length}
                </label>
            </div>

            <div className='flex items-center gap-x-1'>
              <input
                type="checkbox"
                defaultChecked={numberAllowed}
                onChange={() => {
                    setNumberAllowed((prev) => !prev)
                  }}
                ></input>
                  <label htmlFor='numberInput'>Numbers
                  </label>
            </div>

            <div className='flex items-center gap-x-1'>
                  <input
                    type='checkbox'
                    defaultChecked={charAllowed}
                    id='characterInput'
                    onChange={() => {
                        setCharAllowed((prev) => !prev)
                        //flipping boolean sides with event propogation callback
                    }}  
                  ></input>
                   <label htmlFor='characterInput'>Symbols
                   </label>
            </div>

          </div>
        </div>
    </>
  )
}

export default App
