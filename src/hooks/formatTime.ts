export const formatTime = (dateString: string) => {
    const dateObject = new Date(dateString)
    const year = dateObject.getFullYear() + ''
    const mon = dateObject.getMonth() + 1 + ''
    const date = dateObject.getDate() + ''
    const hour = dateObject.getHours() + ''
    const min = dateObject.getMinutes() + ''
    return `${year}.${mon.padStart(2, '0')}.${date.padStart(2, '0')} ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`
}


export const formatTime2 = (dateString: string) => {
    // format like:THU, SEP 26 AT 9 PM
    const dateObject = new Date(dateString)
    const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL',
        'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    const mon = month[dateObject.getMonth()]
    const date = dateObject.getDate() + ''
    const hour = dateObject.getHours() >  12 ? dateObject.getHours() - 12 + '' : dateObject.getHours() + ''
    const min = dateObject.getMinutes() + ''
    const amOrPm = dateObject.getHours() >= 12 ? 'PM' : 'AM'
    return `${week[dateObject.getDay()]}, ${mon} ${date.padStart(2, '0')}, ${hour.padStart(2, '0')}:${min.padStart(2, '0')} `  + amOrPm
}

function useTime () {
    return formatTime2
}

export default useTime
