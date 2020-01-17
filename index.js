#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const path = require('path');
//Method 2
// const lstat = util.promisify(fs.lstat);

//method 3
const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();

//-----------global - don't need to require
fs.readdir(targetDir, async (err, filenames) => {
	if (err) {
		console.log(err);
	}
	const statPromises = filenames.map((filename) => {
		return lstat(path.join(targetDir, filename));
	});

	const allStats = await Promise.all(statPromises);

	for (let stats of allStats) {
		const index = allStats.indexOf(stats);
		if (stats.isFile()) {
			console.log(filenames[index]);
		} else {
			console.log(chalk.redBright.bold.underline(filenames[index]));
		}
	}

	//-----for methods 1,2,3--------
	// for (let filename of filenames) {
	// 	try {
	// 		const stats = await lstat(filename);

	// 		console.log(filename, stats.isFile());
	// 	} catch (err) {
	// 		console.log(err);
	// 	}
	// }
	//----------------

	//BAD CODE HERE!!!
	// for (let filename of filenames) {
	// 	fs.lstat(filename, (err, stats) => {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 		console.log(filename, stats.isFile());
	// 	});
	// }
	// //BAD CODE DONE!

	//---callback solution
	// const allStats = Array(filenames.length).fill(null);
	// for (let filename of filenames) {
	// 	const index = filenames.indexOf(filename);

	// 	fs.lstat(filename, (err, stats) => {
	// 		if (err) {
	// 			console.log(err);
	// 		}
	// 		allStats[index] = stats;

	// 		const ready = allStats.every((stats) => {
	// 			return stats;
	// 		});
	// 		if (ready) {
	// 			allStats.forEach((stats, index) => {
	// 				console.log(filenames[index], stats.isFile());
	// 			});
	// 		}
	// 	});
	// }
	//------------------------
});

//Method 1
// const lstat = (filename) => {
// 	return new Promise((resolve, reject) => {
// 		fs.lstat(filename, (err, stats) => {
// 			if (err) {
// 				reject(err);
// 			}
// 			resolve(stats);
// 		});
// 	});
// };
