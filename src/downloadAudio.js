import ytdl from "ytdl-core";
import fs from "fs";
import { messageStart, messageProgress, finishDL } from "./utils/ProgressDownload.js";

export const downloadAudio = async (url, path) => {
    const info = await ytdl.getInfo(url);
    const name = info.videoDetails.title;

    messageStart();

    let audio = ytdl(url, { quality: 'highestaudio'}).on('progress', (_, downloaded, total) => {
        let audioTotal = (downloaded / total) * 100;
        let percentage = Math.round(audioTotal).toString();
        
        messageProgress(percentage, name);
        
    });
    audio.pipe(fs.createWriteStream(`${path}/${info.videoDetails.title}.mp3`)).on("close", () => {
        finishDL();
    })
}