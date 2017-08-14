// 检测鼠标是否在指定dom里面
export const isMouseInDomElement = ($target, e) => {
    const w = $target.width()
    const h = $target.height()
    const {pageX, pageY} = e
    const {top: iTop, left: iLeft} = $target.offset()
    if(pageX >= iLeft && pageX <= iLeft + w && pageY >= iTop && pageY <= iTop + h) {
        return true
    }
    return false
}

// 定位目标元素, 使鼠标居中
export const centerInMouse = ($target, size, e) => {
    const {pageX, pageY} = e
    $target.css({
        display: 'block',
        left: pageX - size.width / 2 - $(window).scrollLeft(),
        top: pageY - size.height / 2 - $(window).scrollTop()
    })
}

export const sum = arr => arr.reduce((prev, cur) => prev + cur, 0)

export const range = (num, arr) => {
    const temp = arr.reduce((prev, cur, index, arr) => {
        prev.push([prev[index][1], sum(arr.slice(0, index)) + cur / 2])
        return prev
    }, [[0, 0]]).slice(1)
    return temp.findIndex(v => num >= v[0] && num < v[1])
}
