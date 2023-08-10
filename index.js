const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const extensions = require('./extensions');

// specify the directory to watch
const Directory = '';

// specify the directories to move files to
const imageDirectory = '';
const videoDirectory = '';
const audioDirectory = '';
const documentDirectory = '';

function makeUnique (dir, file) {
    const { name, ext } = path.parse(file);
    let counter = 1;

    while (fs.existsSync(path.join(dir, file))) {
        file = `${ name }(${ counter })${ ext }`;
        counter++;
    }

    return file;
}

const moveFile = (sourcePath, destinationDir) => {
    const fileName = path.basename(sourcePath);
    const destinationPath = path.join(destinationDir, fileName);

    if (fs.existsSync(destinationPath)) {
        const uniqueFileName = makeUnique(destinationDir, fileName);
        const newPath = path.join(destinationDir, uniqueFileName);
        fs.renameSync(sourcePath, newPath);
        console.log(`File moved with unique name: ${ newPath }`);
    } else {
        fs.renameSync(sourcePath, destinationPath);
        console.log(`File moved: ${ destinationPath }`);
    }
};

const watcher = chokidar.watch(Directory, { persistent: true });

watcher.on('change', (file) => {
    console.log('File', file, 'has been added');

    const extension = path.extname(file).toLowerCase();

    if (extensions.imageExtensions.includes(extension)) {
        moveFile(file, imageDirectory);
    } else if (extensions.videoExtensions.includes(extension)) {
        moveFile(file, videoDirectory);
    } else if (extensions.audioExtensions.includes(extension)) {
        moveFile(file, audioDirectory);
    } else if (extensions.documentExtensions.includes(extension)) {
        moveFile(file, documentDirectory);
    } else {
        console.log('Unknown file type, not moving:', file);
    }
});
