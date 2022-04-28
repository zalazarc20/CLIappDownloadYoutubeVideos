import ytdl from "ytdl-core";

// this function validates the video url and obtains qualities
export const getVideo = async url => {
    const arr = [];
    const qualitys = ['240p', '360p', '480p', '720p', '1080p'];
    const info = await ytdl.getInfo(url);

    info.formats.map(format => {
        let {qualityLabel, itag} = format;
        const allVideoQuality = qualitys.find(q => q === qualityLabel);

        if(allVideoQuality != undefined) return arr.push(`${qualityLabel} (${itag})`);
    });

    return arr;
}