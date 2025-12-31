//@ts-ignore
import { YouTubeTranscriptApi } from 'youtube-transcript-api';

export async function extractWithYtTranscriptApi(videoId:string) {
  try {
    const ytt = new YouTubeTranscriptApi();

    const captions = await ytt.fetch(videoId);

    const text = captions.map((t : any) => t.text).join(" ");

    console.log("Transcript:", text);
    return text;
  } catch (err) {
    console.error("Error with yt-transcript-api:", err);
    return null;
  }
}

