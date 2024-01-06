import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Modal from "./component/modal.jsx";
import loadingSVG from "./assets/loading.svg";
import uploadSVG from "./assets/upload-main.svg"

function App() {
  const [checkbox, setCheckbox] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [smashes, setSmashes] = useState("");
  const [passes, setPasses] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [modal, setModal] = useState(false);
  const [debug, setDebug] = useState("");


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

  //for debuging 
  useEffect(() =>{ 
    setDebug(imageURL)
  }, [imageURL])

  document.onkeydown = (e) =>{
    if(e.ctrlKey && e.shiftKey && e.key == "D"){
      setDebugMode(!debugMode)
    }
  }
 //end of for debuging

  async function get_image(){
    setLoading(true)
    
    var apiEndpoint = await invoke("get_random_api", {nsfw: checkbox})
    var corsProxyURL = "https://michalho.eu/proxy/?url=" //Has to use proxy protože jedno api je http takže cors se může posrat, will also be on github
    var imageProxy =  "https://michalho.eu/proxy/image.php?url=" //Has to be used if the img src is in https://konachan.com cause for some reason Edge explorer wont render the picture in <img>, bruh
    console.log(apiEndpoint)
    var apiURL = apiEndpoint[0]

    var response;

    apiURL.includes("api.nekos.fun") || apiURL.includes("purrbot.site") ? response = await fetch(corsProxyURL + apiURL) : response = await fetch(apiURL)
    response = await response.json()
    console.log(response)

    if(apiEndpoint[1] === "images[0] > url"){
      setImageURL(response.images[0].url)
      setLoading(false)
      return
    }
    if(apiEndpoint[1] === "results[0] > url"){
      setImageURL(response.results[0].url)
      setLoading(false)
      return
    }
    if(apiEndpoint[1] === "file_url"){
      setImageURL(`https://${response["file_url"]}`)
      setLoading(false)
      return
    }
    if(response[apiEndpoint[1]].includes("https://konachan.com") || response[apiEndpoint[1]].includes("https://files.yande.re")){
      setImageURL(imageProxy + response[apiEndpoint[1]])
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

        <a onClick={() => setModal(!modal)}>
          <img src={uploadSVG} className="upload" title="Upload an Image"></img>
        </a>

      </form>
      
      {modal ? (<Modal toggleModal={() => setModal(!modal)}></Modal>) : (<></>)}

      {debugMode ? (
        <p>{debug}</p>
      ) : (<></>)}
    </div>
  );
}

export default App;