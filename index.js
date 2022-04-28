import { program } from "commander";
import inquirer from "inquirer";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { getVideo } from "./src/getVideo.js";
import { convertVideo } from "./src/convertVideo.js";
import { downloadAudio } from "./src/downloadAudio.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const {prompt} = inquirer;

// functions
const stepOne = async () => {
    const answers = await prompt([
        {
            type: 'input',
            message: 'Please, paste youtube link',
            name: 'youtubeLink'
        }
    ]);

    return answers.youtubeLink;
}

const stepTwo = async url => {
    const val = await prompt([
        {
            type: 'list',
            message: 'Select one Quality',
            name: 'quality',
            choices: await getVideo(url)
        }
    ])

    const FORMAT_VAL = parseInt(val.quality.slice(6, -1));

    return FORMAT_VAL;
}

// commands
program.command('video').action(async () => {
    const url = await stepOne();
    const itag = await stepTwo(url);
    
    await convertVideo({
        url: url,
        itag: itag,
        directoryDownload: `${__dirname}/videos`
    })
})

program.command('audio').action(async () => {
    // create function for download song
    const url = await stepOne();
    await downloadAudio(url);
})



program.parse(process.argv);
