/*******************************************
*
*   ファイル名     ：taskService.js
*   概要           ：業務ロジックのサービス定義
*
*********************************************/

const taskModel = require('../models/taskModel');

async function getTasks(query) {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const perPage = 10;
    const { keyword, status } = query;

    const conditions = [];
    const params = [];

    if(keyword) {
        conditions.push('title LIKE ?');
        params.oush(`%${keyword}%`);
    }

    if(status) {
        if(!['todo', 'doing', 'done'].includes(status)) {
            throw new Error('statusが不正です。');
        }
        conditions.push('status = ?');
        params.push(status);
    }

    const whereClause = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const offset = (page - 1) * perPage;

    const total = await taskModel.countTasks(whereClause, params);
    const tassks = await taskModel.getTasks(whereClause, params, offset, perPage);

    return { page, perPage, total, tasks };
}

module.exports = { getTasks };