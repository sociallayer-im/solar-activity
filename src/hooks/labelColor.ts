export const labelColors = [
    '#B7D453',
    '#75D4F0',
    '#FD8CE2',
    '#8080FF',
    '#15CB82',
    '#FAC699',
    '#FE6CAB',
    '#5567ff',
    '#FFC400',
    '#FF7A45',
    '#FF5C00',
    '#e73f9e',
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

    const code = label.split('').map(item => getUnicodeSum(item)).reduce((a, b) => a + b, 0)
    return labelColors[code % labelColors.length]
}
