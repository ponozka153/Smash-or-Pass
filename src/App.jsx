import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import loadingSVG from "./assets/loading.svg";

function App() {
  const [checkbox, setCheckbox] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [smashes, setSmashes] = useState("");
  const [passes, setPasses] = useState("");
  const [loading, setLoading] = useState(false);


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
    setLoading(true)
    var apiEndpoint = await invoke("get_random_api", {nsfw: checkbox})
    var corsProxyURL = "https://michalho.eu/proxy/?url=" //Has to use proxy protože jedno api je http takže cors se může posrat, will also be on github
    console.log(apiEndpoint)
    var apiURL = apiEndpoint[0]

    var response = await fetch(corsProxyURL + apiURL)
    response = await response.json()
    console.log(response)

    if(apiEndpoint[1] === "images[0] > url"){
      setImageURL(response.images[0].url)
      setLoading(false)
      return
    }

    setImageURL(response[apiEndpoint[1]])

    setLoading(false)
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
      <img src={imageURL} alt="Random Anime IMG"/>
        {loading ? (
          <img src={loadingSVG} className="loading"></img>
        ): (
        <div className="loading">

        </div>
          )}
      </div>

      <form
      onSubmit={(e) =>{
        e.preventDefault();
        get_image();
      }}
      >

        <button onClick={() => reacted_to_click(true)}>Smash</button>
        <input title="Will show SFW & NSFW" type="checkbox" id="nsfw" onChange={(e) => setCheckbox(e.currentTarget.checked)}/>
        <label title="Will show SFW & NSFW" htmlFor="nsfw">NSFW?</label>
        <button onClick={() => reacted_to_click(false)}>Pass</button>

        <p>Total Smashes: {smashes}</p>
        <p>Total Passes: {passes}</p>

      </form>

    </div>
  );
}

export default App;