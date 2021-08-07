import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

/**
 * @param timestampMS 毫秒值
 * @returns {string} 精确到分钟
 */
const timestamp2date = (timestampMS) => {
    const d = new Date(timestampMS),
        year = d.getFullYear(),
        month = d.getMonth() + 1,
        day = d.getDate(),
        hour = d.getHours(),
        minute = d.getMinutes();
    return year + "-" +
        (month < 10 ? "0" + month : month) + "-" +
        (day < 10 ? "0" + day : day) + " " +
        (hour < 10 ? "0" + hour : hour) + ":" +
        (minute < 10 ? "0" + minute : minute);
};

const getUuid = () => {
    return uuidv4();
};

const cloneDeep = (value) => {
    return _.cloneDeep(value)
};

const get = (object, path, defaultValue) => {
    return _.get(object, path, defaultValue);
};

const set = (object, path, value) => {
    return _.set(object, path, value);
};

const isEmpty = (value) => {
    return _.isEmpty(value);
};

export {
    timestamp2date,
    getUuid,
    cloneDeep,
    get,
    set,
    isEmpty
};