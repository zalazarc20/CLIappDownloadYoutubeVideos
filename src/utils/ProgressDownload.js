export const messageStart = () => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('\u001b[33m The Download will start in a few seconds');
}

export const messageProgress = (percentage, name) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`\u001b[35;1m name: ${name} \u001b[32;1m downloaded: ${percentage}% \u001b[0m`)
}

export const finishDL = () => {
    console.clear();
    console.log('\u001b[42;1m The Download Finished Successfully \u001b[0m')
}