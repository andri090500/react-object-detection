import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";
import * as cocoModel from "@tensorflow-models/coco-ssd";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [model, setModel] = useState();
  const [objectName, setObjectName] = useState("");
  const [objectScore, setObjectScore] = useState("");

  async function loadModel() {
    try {
      const dataset = await cocoModel.load();
      setModel(dataset);
      console.log("dataset ready...");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  async function predict() {
    const detection = await model.detect(
      document.getElementById("sourceVideo")
    );
    if (detection.length > 0) {
      detection.map((result, i) => {
        setObjectName(result.class);
        setObjectScore(result.score);
      });
    }
  }

  const videoOption = {
    width: 720,
    height: 480,
    facingMode: "environment",
  };
  return (
    <div className="App">
      <h1>Object Detection With Coco Model</h1>
      <div>
        <button onClick={() => predict()}>Tebak Objek</button>
      </div>
      <h3>Objek Deteksi : {objectName ? objectName.toString() : ""}</h3>
      <h3>Akurasi Deteksi : {objectScore ? objectScore.toString() : ""}</h3>
      <Webcam id="sourceVideo" audio={false} videoConstraints={videoOption} />
    </div>
  );
}

export default App;
