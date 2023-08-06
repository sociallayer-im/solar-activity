export const labelColors = [
    '#75D4F0',
    '#1685a9',
    '#5567ff',
    '#8080FF',
    '#cca4e3',
    '#FFC400',
    '#FF7A45',
    '#d06833',
    '#9eb636',
    '#15CB82',
    '#057748',
    '#439b82',
    '#FAC699',
    '#e73f9e',
    '#FE6CAB',
    '#FD8CE2',
    '#a98175',
]

function getUnicodeSum(str: string) {
    let unicodeArr = [];

    for (let i = 0; i < str.length; i++) {
        unicodeArr.push(str.charCodeAt(i));
    }

    return unicodeArr.reduce((a, b) => a + b, 0);
}


export const getLabelColor = (label: string) => {
    // 获取字符串label的unicode编码数组
    // 将编码数组的每一项相加， 相加的和对颜色数组的长度取余，得到颜色数组的下标
    // 返回颜色数组的下标对应的颜色
    return labelColors[label[0].charCodeAt(0) % labelColors.length]
}
