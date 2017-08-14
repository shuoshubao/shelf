import 'bootstrap/dist/css/bootstrap.min.css'
import './index.less'
import {isMouseInDomElement, centerInMouse, range} from './util'

window.$ = $

// 货架信息
// const SHELF_INFO = {
window.SHELF_INFO = {
    width: 10,
    height: [3, 4, 5, 6, 9]
}
// column: 每一行存放的商品列表
SHELF_INFO.row = SHELF_INFO.height.map(() => [])

// 字段列表
const FIELD_LIST = [
    {field: 'id', text: '商品ID'},
    {field: 'name', text: '商品名称'},
    {field: 'width', text: '宽'},
    {field: 'height', text: '高'}
]

// 货物列表
// const SHELF_LIST = [
window.SHELF_LIST = [
    {
        id: '114810',
        name: '汇源梨汁饮料(PET)',
        width: 2,
        height: 5
    },
    {
        id: '221556',
        name: '汇源橙汁饮料',
        width: 1,
        height: 3
    },
    {
        id: '289407',
        name: '汇源奇异王果猕猴桃汁',
        width: 1,
        height: 3
    },
    {
        id: '326217',
        name: '汇源山楂汁',
        width: 2,
        height: 4
    },
    {
        id: '690438',
        name: '大湖100%橙汁',
        width: 2,
        height: 6
    },
    {
        id: '006648',
        name: '汇源100%橙汁%橙汁',
        width: 2,
        height: 6
    }
]

const colors = ['001F3F', '0074D9', '7FDBFF', '39CCCC', '3D9970', '2ECC40', '01FF70', 'FFDC00', 'FF851B', 'FF4136', 'F012BE', 'B10DC9', '85144B', 'FFFFFF', 'AAAAAA', 'DDDDDD', '111111'].map(v => `#${v.toLocaleLowerCase()}`)

SHELF_LIST.forEach(v => {
    v.size = {
        width: v.width * 50,
        height: 50 + (v.height - 1) * 10
    }
})

// 存dom
const $frame = $('.frame')
const $goods = $('.goods')
const $layer = $('.layer')

// 拖拽
// const dragInfo = {
window.dragInfo = {
    type: '', // 'goods': 从列表拖拽的; 'frame': 从货架拖拽的
    index: 0, // 拖拽的是第几个货物
    isDragging: false, // 是否正在拖拽
    insertRow: -1, // 插入到第几行
    insertColumn: 0, // 插入到第几列
    insertAble: false, // 是否能插入 [验证宽高]
}

// 初始化货架
$frame.html(SHELF_INFO.height.map(v => `<li style="height: ${50 + (v - 1) * 10}px;"></li>`)).width(2 + SHELF_INFO.width * 50)

// 初始化货物列表
$goods.find('thead').html(`<tr>${FIELD_LIST.map(v => '<th>' + v.text + '</th>')}</tr>`)
$goods.find('tbody').html(SHELF_LIST.map((v, i) => '<tr class="item">' + FIELD_LIST.map((v2, i2) => '<td style="background-color: ' + (i2 === 0 ? colors[i] : '#fff') + ';">' + v[v2.field] + '</td>') + '</tr>'))

// 渲染拖拽浮层
const render_layer = (e) => {
    const item = SHELF_LIST[dragInfo.index]
    $layer
    .html(`${item.id}\n${item.name}`)
    .css({
        ...item.size,
        backgroundColor: colors[dragInfo.index]
    })
    centerInMouse($layer, item.size, e)
}
// 重置货架状态
const render_reset_frame = () => {
    $frame.find('li').removeClass('active error')
}
// 渲染货架的行
const render_frame_column = () => {
    const {index, insertRow} = dragInfo
    let left = 0
    const str = SHELF_INFO.row[insertRow].map((v, i) => {
        const item = SHELF_LIST.find(v2 => v2.id == v)
        const itemIndex = SHELF_LIST.findIndex(v2 => v2.id == v)
        const {width, height} = item.size
        const html = `<div data-id="${item.id}" class="item" style="width: ${width}px; height: ${height}px; left: ${left}px; background-color: ${colors[itemIndex]};">${item.id}\n${item.name}</div>`
        left += width
        return html
    })
    $frame.find('li').eq(insertRow).html(str)
}

// 获取货架当前行的宽度
const getWidthOfColumn = () => {
    return SHELF_INFO.row[dragInfo.insertRow].reduce((prev, cur) => {
        const {width} = SHELF_LIST.find(v => v.id === cur)
        return prev + width
    }, 0)
}

// 拖拽 列表货物
$goods.on('mousedown', '.item', function(e) {
    dragInfo.type = 'goods'

    dragInfo.index = $(this).index()
    dragInfo.isDragging = true
    dragInfo.insertRow = -1
    dragInfo.insertAble = true

    render_layer(e)
})

// 拖拽 货架货物
$frame.on('mousedown', '.item', function(e) {
    dragInfo.type = 'frame'

    const id = $(this).data('id')
    const row = $(this).closest('li').index()
    const column = $(this).index()



    dragInfo.index = SHELF_LIST.findIndex(v => v.id == id)
    dragInfo.isDragging = true


    dragInfo.insertRow = row

    SHELF_INFO.row[row].splice(column, 1)
    render_frame_column()

    render_layer(e)
})

$(document.body)
.mousemove(e => {
    render_reset_frame()
    if(!dragInfo.isDragging) {
        return
    }

    const item = SHELF_LIST[dragInfo.index]
    centerInMouse($layer, item.size, e)

    if(!isMouseInDomElement($frame, e)) {
        return
    }

    $frame.find('li').each(function(i, v) {
        if(isMouseInDomElement($(this), e)) {
            dragInfo.insertRow = i
            return
        }
    })
    if(dragInfo.insertRow === -1) {
        return
    }


    dragInfo.insertAble = item.width + getWidthOfColumn() <= SHELF_INFO.width && item.height <= SHELF_INFO.height[dragInfo.insertRow]
    $frame.find('li').eq(dragInfo.insertRow).addClass(dragInfo.insertAble ? 'active' : 'error')



    // const disX = e.pageX - $frame.find('li').offset().left

    // console.log(range(disX, SHELF_INFO.row[dragInfo.insertRow]))
    // console.log(SHELF_INFO.row[dragInfo.insertRow].map(v => SHELF_LIST.find(v2 => v2.id === v).size.width))

})
.mouseup(e => {
    if(!dragInfo.isDragging) {
        return
    }
    $layer.hide()
    render_reset_frame()
    dragInfo.isDragging = false

    if(!isMouseInDomElement($frame, e)) {
        return
    }
    if(dragInfo.insertRow == -1) {
        return
    }
    if(!dragInfo.insertAble) {
        return
    }

    const {index, insertRow} = dragInfo
    const {id} = SHELF_LIST[index]

    const disX = e.pageX - $frame.find('li').offset().left
    const disArr = SHELF_INFO.row[insertRow].map(v => SHELF_LIST.find(v2 => v2.id === v).size.width)

    dragInfo.insertColumn = range(disX, disArr)

    if(dragInfo.insertColumn === -1) {
        SHELF_INFO.row[insertRow].push(id)
    }else {
        SHELF_INFO.row[insertRow].splice(dragInfo.insertColumn, 0, id)
    }


    render_frame_column()


    dragInfo.insertRow = -1
    dragInfo.insertAble = true
    dragInfo.index = 0
})


