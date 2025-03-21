import {resolve} from "node:path";
import * as fs from "node:fs";

const dirname = resolve('.')
const fileFrom = resolve(dirname, '.env.example');
const fileTo = resolve(dirname, '.env');

const resetStyles = '\x1b[0m';
const boldText = '\x1b[1m';
const redText = '\x1b[31m';
const greenBg = '\x1b[42m';
const redBg = '\x1b[41m';

if ( fs.existsSync(fileTo) ) {
    console.log(greenBg + boldText, 'Env уже существует!' + resetStyles);
} else {
    fs.copyFile(fileFrom, fileTo, (err) => {
        if (err) {
            console.error(redText + boldText, 'Env ошибка копирования:', redBg + err + resetStyles);
        } else {
            console.log(greenBg + boldText, 'Env успешно скопирован!' + resetStyles);
        }
    });
}