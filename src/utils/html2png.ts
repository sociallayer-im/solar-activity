import html2canvas from 'html2canvas'

const saveCard = (target: HTMLDivElement, fileName: string, size: [number, number]) => {
    html2canvas(target, {
        useCORS: true, // 【重要】开启跨域配置
        scale: 1.8,
        allowTaint: true,
        width: size[0],
        height: size[1],
        backgroundColor: '#fff'
    }).then((canvas: HTMLCanvasElement) => {
        canvas.style.background = 'transparent'
        const imgData = canvas.toDataURL('image/jpeg')
        const link = document.createElement('a')
        link.download = `${fileName}.jpg`
        link.href = imgData
        link.click()
    })
        .catch(function (e: any) {
            console.error('oops, something went wrong!', e)
        })
}

export default saveCard
