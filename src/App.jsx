import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

function App() {
  const [checkbox, setCheckbox] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [smashes, setSmashes] = useState("");
  const [passes, setPasses] = useState("");

  useEffect(() =>{
    const storedSmashes = localStorage.getItem("smashes")
    const storedPasses = localStorage.getItem("passes")


    setSmashes(Number(storedSmashes) || 0)
    setPasses(Number(storedPasses) || 0)

    get_image()
  }, []) //[] = run only once on component load nebo tak něco

  useEffect(() =>{
    localStorage.setItem("smashes", smashes)
    localStorage.setItem("passes", passes)
  }, [smashes, passes]) //run on smashes||passes change

  async function get_image(){
    var apiURL = await invoke("get_random_api", {nsfw: checkbox})
    var response = await fetch(apiURL)

    response = await response.json()
    console.log(response)
    setImageURL(response.url)
  }

  async function reacted_to_click(smash){
    if(smash){
      console.log("smash")
      
      setSmashes((beforeSmashes) => beforeSmashes + 1 )
    } else {
      console.log("pass")

      setPasses((beforePasses) => beforePasses + 1 )
    }
  }

  return (
    <div className="container">
      <h1>Welcome to Smash or Pass! :3</h1>

      <div>
        <img src={imageURL}/>
      </div>

      <form
      onSubmit={(e) =>{
        e.preventDefault();
        get_image();
      }}
      >

        <button onClick={() => reacted_to_click(true)}>Smash</button>
        <input type="checkbox" id="nsfw" onChange={(e) => setCheckbox(e.currentTarget.checked)}/>
        <label htmlFor="nsfw">NSFW?</label>
        <button onClick={() => reacted_to_click(false)}>Pass</button>

        <p>Total Smashes: {smashes}</p>
        <p>Total Passes: {passes}</p>

      </form>

    </div>
  );
}

export default App;