import React, { useEffect, useState } from "react";
import "./App.css";
import SpeachToText from "./components/SpeachToText";

export const VIDEO_FOLDER = "http://localhost:5050/";

interface Transcript {
  timestamp: number;
  text: string;
}
interface Fragment {
  start: number;
  end: number;
}
export interface Video {
  fileName: string;
  duration: number;
  creation_time: string;
  transcriptDetected: boolean;
  transcript: Transcript[];
  fragments: Fragment[];
}

function App() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    fetch(VIDEO_FOLDER)
      .then((res) => res.json())
      .then((data) => setVideos(data));
  }, []);

  return (
    <div className="App">
      <h1>witam</h1>
      <SpeachToText videos={videos} />
    </div>
  );
}

export default App;
