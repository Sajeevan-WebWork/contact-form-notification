
import { Button } from '@material-tailwind/react'
import './App.css'
import ContactForm from './Components/ContactForm'
import Dashboard from './Components/Dashboard'

function App() {

  return (
    <>

      <div className="container m-auto w-full p-10">

        <div className="grid grid-cols-3 grid-rows-1 gap-4">
          <div>
            <ContactForm></ContactForm>
          </div>
          <div className="col-span-2">
            <Dashboard></Dashboard>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
