/*******************************************
*
*   ファイル名     ：logger.js
*   概要           ：ログ出力機能
*
*********************************************/

const fs = require('fs');
const path = require('path');

// logsフォルダ
const logDir = path.join(__dirname, '../../logs');

// ファルダなければ作成
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// ログファイル
const logFile = path.join(logDir, 'app.log');

// 共通出力関数
function writeLog(level, message, err = null) {

    const timestamp = new Date().toISOString();

    let log = `[${timestamp}] [${level}] ${message}`;

    if (err) {
        log += '\n';

        if (err.stack) {
            log += err.stack;
        } else {
            log += JSON.stringify(err);
        }
    }

    fs.appendFileSync(logFile, log);
}

// INFOログ
exports.info = (message) => {
    writeLog(`INFO`, message);
};

// ERRORログ
exports.error = (message, err) => {
    writeLog('ERROR', message, err);
};
