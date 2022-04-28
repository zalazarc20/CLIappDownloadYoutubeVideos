import ytdl from "ytdl-core";
import ffmpeg from "ffmpeg-static";
import ffmMT from "ffmetadata";
import path from "path";
import cp from "child_process";
import { messageStart, messageProgress, finishDL } from "./utils/ProgressDownload.js";

/* 
This code does not belong to me. 
THE CREATOR of this masterpiece is ===> https://www.npmjs.com/package/yt-converter
sorry for my English, I used the translator to write this.
*/

ffmMT.setFfmpegPath(ffmpeg);

export const convertVideo = async (options) => {
    try {
        let {url, itag, directoryDownload} = options;
        const info = await ytdl.getInfo(url);
        const name = info.videoDetails.title;
        const tracker = {
            audio: {
                total: null,
                downloaded: null
            },
            video: {
                total: null,
                downloaded: null
            }
        }
        const format = info.formats.find((fm) => fm.itag === itag)
        const audio = ytdl(url, {
            filter: "audioonly"
        }).on("progress", (_, downloaded, total) => {
            tracker.audio = { downloaded, total }
        })
        const video = ytdl(url, {
            filter: "videoonly",
            quality: format.itag
        }).on("progress", (_, downloaded, total) => {
            tracker.video = { downloaded, total }
        })
        const pathname = path.resolve(process.cwd(), directoryDownload, `${name}.mp4`);

        const ffmpegProcess = cp.spawn(ffmpeg, [
            "-loglevel", "8", "-hide_banner",
            "-progress", "pipe:3",
            "-i", "pipe:4",
            "-i", "pipe:5",
            "-map", "0:a",
            "-map", "1:v",
            "-c:v", "copy",
            `${pathname}`,
        ], {
            windowsHide: true,
            stdio: [
                /* Standard: stdin, stdout, stderr */
                "inherit", "inherit", "inherit",
                /* Custom: pipe:3, pipe:4, pipe:5 */
                "pipe", "pipe", "pipe"
            ],
        });

        messageStart();

        ffmpegProcess.stdio[3].on("data", () => {
            const videoTotal = (tracker.video.downloaded / tracker.video.total) * 100
            const audioTotal = (tracker.audio.downloaded / tracker.audio.total) * 100
            const percentage = Math.round((videoTotal + audioTotal) / 2).toString()
            messageProgress(percentage, name)
        })

        ffmpegProcess.on("close", () => {
            finishDL()
        })

        audio.pipe(ffmpegProcess.stdio[4])
        video.pipe(ffmpegProcess.stdio[5])
    } catch (error) {
        console.log(error)
    }
}