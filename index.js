const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const extensions = require('./extensions');

const Directory = '/Users/nagi/Downloads';
const imageDirectory = '/Users/nagi/Downloads/Images';
const videoDirectory = '/Users/nagi/Downloads/Videos';
const musicDirectory = '/Users/nagi/Downloads/Music';
const SfxDirectory = '/Users/nagi/Downloads/SFX';
const documentDirectory = '/Users/nagi/Downloads/Documents';

function makeUnique(dest, name) {
	const { name: filename, ext: extension } = path.parse(name);
	let counter = 1;

	while (fs.existsSync(path.join(dest, name))) {
		name = `${filename}-${counter}${extension}`;
		counter++;
	}

	return name;
}

function moveFile(dest, entry, name) {
	if (fs.existsSync(path.join(dest, name))) {
		const uniqueName = makeUnique(dest, name);
		const oldName = path.join(dest, name);
		const newName = path.join(dest, uniqueName);
		escapeSpecialCharacters(newName);
		fs.renameSync(oldName, newName);
	}

	fs.renameSync(entry, path.join(dest, name));
}

const watcher = chokidar.watch(Directory, { persistent: true });

watcher.on('add', (entry) => {
	const name = path.basename(entry);

	checkAudioFiles(entry, name);
	checkVideoFiles(entry, name);
	checkImageFiles(entry, name);
	checkDocumentFiles(entry, name);
});

function checkAudioFiles(entry, name) {
	extensions.audioExtensions.forEach((audioExtension) => {
		if (name.toLowerCase().endsWith(audioExtension)) {
			const dest = fs.statSync(entry).size < 10000000 || name.includes('SFX') ? SfxDirectory : musicDirectory;
			moveFile(dest, entry, name);
			console.log(`Moved audio file: ${name}`);
		}
	});
}

function checkVideoFiles(entry, name) {
	extensions.videoExtensions.forEach((videoExtension) => {
		if (name.toLowerCase().endsWith(videoExtension)) {
			moveFile(videoDirectory, entry, name);
			console.log(`Moved video file: ${name}`);
		}
	});
}

function checkImageFiles(entry, name) {
	extensions.imageExtensions.forEach((imageExtension) => {
		if (name.toLowerCase().endsWith(imageExtension)) {
			moveFile(imageDirectory, entry, name);
			console.log(`Moved image file: ${name}`);
		}
	});
}

function checkDocumentFiles(entry, name) {
	extensions.documentExtensions.forEach((documentExtension) => {
		if (name.toLowerCase().endsWith(documentExtension)) {
			moveFile(documentDirectory, entry, name);
			console.log(`Moved document file: ${name}`);
		}
	});
}

function escapeSpecialCharacters(fileName) {
	const specialCharacters = /[-\/\\^$*+?.()|[\]{}]/g;

	if (specialCharacters.test(fileName)) {
		const escapedFileName = fileName.replace(specialCharacters, '\\$&');
		return escapedFileName;
	}

	return fileName;
}
