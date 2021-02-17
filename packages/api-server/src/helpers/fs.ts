import * as fs from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import * as os from 'os';

export async function existsAsync(path: string): Promise<boolean> {
	return new Promise(resolve => {
		fs.access(path, fs.constants.F_OK, err => {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
}

export async function writeLogFile(loggable: Record<string, object>): Promise<void> {
	const firstKey = Object.keys(loggable)[0];
	const date = new Date().toISOString().replace(/:/gi, '-');

	await mkdir(path.join(os.tmpdir(), 'bokari'), { recursive: true });

	return writeFile(
		path.join(os.tmpdir(), 'bokari', `bokari-${firstKey}-${date}.json`),
		JSON.stringify(loggable[firstKey]),
		{ encoding: 'utf-8' }
	);
}
