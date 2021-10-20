import axios from "axios";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Video, VIDEO_FOLDER } from "../App";

type MyTranscript = {
  timestamp: number;
  text: string;
};

interface Props {
  videos: Video[];
}
const SpeachToText = (props: Props) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [myTranscript, setMyTranscript] = useState<MyTranscript[] | []>([]);
  const [current, setCurrent] = useState(0);
  const [timestamp, setTimestamp] = useState(0);
  // const [text, setText] = useState("");
  const [allText, setAllText] = useState("");

  const [playing, setPlaying] = useState(false);
  const video = props.videos[current];

  //   if (!browserSupportsSpeechRecognition) {
  //     return <span>Browser doesn't support speech recognition.</span>;
  //   }

  const handleStart = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "pl-PL", //https://cloud.google.com/speech-to-text/docs/languages
    });
  };

  const handleVideoEnded = () => {
    const dataToSend = { fileName: video.fileName, transcript: myTranscript };
    axios.post(VIDEO_FOLDER + "transcript/", dataToSend);
    resetTranscript();
    setMyTranscript([]);
    setTimeout(() => {
      if (current === props.videos.length - 1) return;
      setCurrent((p) => p + 1);
      document.location.reload();
    }, 3000);
  };

  const handleTimestampUpdate = (e: any) => {
    if (!listening) handleStart();
    const delay = 2;
    const time = Math.floor(e.target.currentTime);
    if (timestamp === time) return;
    if (time - delay < 0) return;

    const newText = transcript.slice(allText.length);

    setTimestamp(time);
    setAllText(transcript);
    setMyTranscript((prevData) => {
      const newData = [...prevData, { text: newText, timestamp: time - delay }];
      return newData;
    });
  };

  if (!video) return null;

  return (
    <div>
      <video
        width={"900px"}
        controls
        autoPlay
        onPlaying={() => console.log("playing")}
        onEnded={handleVideoEnded}
        onTimeUpdate={handleTimestampUpdate}
        src={VIDEO_FOLDER + video.fileName}
      ></video>

      <div style={{ width: "900px" }}>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button onClick={handleStart}>Start</button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>

        {myTranscript.map(({ timestamp, text }) => (
          <p>
            {timestamp} {text}
          </p>
        ))}
        {/* <pre>{JSON.stringify(myTranscript, null, 2)}</pre> */}
      </div>
    </div>
  );
};
export default SpeachToText;
