const addEvent = (() => {
    let _eventCompat = function(event) {
        let type = event.type;
        if (type === 'DOMMouseScroll' || type === 'mousewheel') {
            event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
        }

        if (event.srcElement && !event.target) {
            event.target = event.srcElement;
        }
        if (!event.preventDefault && event.returnValue !== undefined) {
            event.preventDefault = function() {
                event.returnValue = false;
            };
        }

        return event;
    };
    if (window.addEventListener) {
        return function(el, type, fn, capture) {
            if (type === "mousewheel" && document.mozFullScreen !== undefined) {
                type = "DOMMouseScroll";
            }
            el.addEventListener(type, function(event) {
                fn.call(this, _eventCompat(event));
            }, capture || false);
        }
    } else if (window.attachEvent) {
        return function(el, type, fn, capture) {
            el.attachEvent("on" + type, function(event) {
                event = event || window.event;
                fn.call(el, _eventCompat(event));
            });
        }
    }
    return function() {};
})();

export default class Topology {
    constructor (params) {
        this.init(params)
    }
    init (params) {
        const { canvas, topologyData, imgSources, nodeStyle, lineStyle, event } = params;
        // 拓扑图容器
        const container = canvas.parentNode;

        // 拓扑图的视图宽高
        this.viewWidth = container.clientWidth;
        this.viewHeight = container.clientHeight;

        // 拓扑图节点样式
        this.nodeStyle = nodeStyle === undefined ? { width: 82, height: 50, verticalMargin: 40, horizontalMargin: 20, borderWidth: 1, borderColor: '#aaa', backgroundColor: '#ccc', borderRadius: 0 } : nodeStyle;

        // 拓扑图连线样式
        this.lineStyle = lineStyle === undefined ? { width: 2, color: '#aaa' } : lineStyle;

        // 拓扑图画布元素
        this.canvas = canvas;
        this.canvas.width = this.viewWidth;
        this.canvas.height = this.viewHeight;

        // 拓扑图绘制上下文
        this.canvasCtx = this.canvas.getContext('2d');

        // 拓扑图树状数据
        this.topologyData = topologyData === undefined ? [] : topologyData;

        // 拓扑图节点事件
        this.handleNodeClick = event && event.nodeClick ? event.nodeClick : false;
        this.handleNodeHoverIn = event && event.nodeHoverIn ? event.nodeHoverIn : false;
        this.handleNodeHoverOut = event && event.nodeHoverOut ? event.nodeHoverOut : false;

        // 图片资源
        this.imgSources = imgSources;

        const { nodes, xMax, yMax } = this.getNodes();
        // 拓扑图节点
        this.nodes = nodes;

        // 拓扑图最大宽高
        this.contentWidth = xMax;
        this.contentHeight = yMax;

        // 离屏画布元素
        this.offScreenCanvas = document.createElement('canvas');
        this.offScreenCanvas.width = this.contentWidth;
        this.offScreenCanvas.height = this.contentHeight;

        // 离屏画布上下文
        this.offScreenCtx = this.offScreenCanvas.getContext('2d');

        // 拓扑图连线
        this.links = this.getLinks();

        // 计算适应宽高的缩放
        let autoScale = Math.min(this.viewWidth / this.contentWidth, this.viewHeight / this.contentHeight);

        // 缩放比例
        this.maxScale = 1;
        this.scale = Math.min(this.maxScale, autoScale);

        // 拖拽位移
        this.translateX = (this.viewWidth - this.contentWidth * this.scale) / 2;
        this.translateY = (this.viewHeight - this.contentHeight * this.scale) / 2;

        // 事件绑定
        this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.addEventListener('mouseout', this.onMouseOut.bind(this));
        addEvent(this.canvas, 'mousewheel', this.onMouseWheel.bind(this));

        // 离屏绘制
        this.drawNodes();
        this.drawLinks();

        // 渲染
        this.render();
    }
    getNodesAndLinks (tree) {
        if (tree === undefined) {
            tree = this.topologyData
        }
        let nodes = [];
        let links = [];

        const fn = (arr, deep, parentId) => {
            if (arr.length === 0 ) {
                return
            }
            if (deep === undefined) {
                deep = 0
            }
            arr.forEach(({ id, name, icon, children }) => {
                nodes.push({ id, name, icon, deep });
                if (deep > 0) {
                    links.push({
                        source: parentId,
                        target: id,
                        deep: deep - 1,
                    })
                }
                fn(children, deep + 1, id)
            })
        };

        fn(tree);

        return { nodes, links }
    }
    getNodes (tree) {
        if (tree === undefined) {
            tree = this.topologyData
        }

        let widthNode = this.nodeStyle.width;
        let heightNode = this.nodeStyle.height;
        const { horizontalMargin, verticalMargin } = this.nodeStyle;
        let nodes = [];
        let xMax = 0;
        let yMax = 0;

        const fn = (arr, deep, startX) => {
            let selfWidth = 0;
            let arrLength = arr.length;
            if (arr === undefined || arrLength === 0 ) {
                return widthNode
            }
            if (deep === undefined) {
                deep = 0;
                startX = 0;
            }

            arr.forEach(({ id, name, icon, children }, index) => {
                let widthChildren = fn(children, deep + 1, startX + selfWidth);
                let x = startX + selfWidth + widthChildren / 2;
                let y = deep * (verticalMargin + heightNode);
                xMax = x > xMax ? x + widthNode / 2 : xMax;
                yMax = y > yMax ? y + heightNode : yMax;
                nodes.push({
                    id,
                    name,
                    icon,
                    x,
                    y,
                });
                if (arrLength - 1 === index) {
                    selfWidth += widthChildren;
                } else {
                    selfWidth += (widthChildren + horizontalMargin);
                }
            });
            return selfWidth
        };

        fn(tree);

        return { nodes, xMax, yMax }
    }
    getLinks (tree) {
        let nodes;
        let nodesIndex = {};
        let links = [];
        const nodeWidth = this.nodeStyle.width;
        const nodeHeight = this.nodeStyle.height;
        if (tree !== undefined) {
            nodes = this.getNodes(tree);
        } else {
            tree = this.topologyData;
            nodes = this.nodes;
        }

        // 以节点id建立节点索引
        nodes.forEach((node) => {
            nodesIndex[node.id] = node;
        });

        // 遍历拓扑树，计算出所有连线
        const fn = (arr, parentId, sX, sY) => {
            arr.forEach(({ id, children }) => {
                if (parentId !== undefined) {
                    links.push({
                        sId: parentId,
                        tId: id,
                        sX,
                        sY,
                        eX: nodesIndex[id].x,
                        eY: nodesIndex[id].y,
                    });
                }
                if (children !== undefined) {
                    fn(children, id, nodesIndex[id].x, nodesIndex[id].y + nodeHeight);
                }
            });
        };
        fn(tree);

        return links;
    }
    onMouseWheel (e) {
        if (e.delta > 0) {
            // 放大拓扑图
            this.scale = this.scale + 0.1 < this.maxScale ? this.scale + 0.1 : this.maxScale;
            this.render();
        } else {
            // 缩小拓扑图
            this.scale = this.scale - 0.1 > 0.3 ? this.scale - 0.1 : 0.3;
            this.render();
        }
    }
    onMouseDown (e) {
        // 启用拖拽
        this.isDragging = true;
        // 启用点击
        this.isClick = true;
        this.dragSX = e.clientX;
        this.dragSY = e.clientY;
        this.translateXOld = this.translateX;
        this.translateYOld = this.translateY;
    }
    onMouseMove (e) {
        let needRender = false;
        if (this.isDragging) {
            // 响应拖拽事件
            const xMoved = e.clientX - this.dragSX;
            const yMoved = e.clientY - this.dragSY;
            this.translateX = this.translateXOld + xMoved;
            this.translateY = this.translateYOld + yMoved;
            // 根据移动距离判断是否拖动
            if (xMoved >= 1 || yMoved >= 1) {
                this.isClick = false;
                needRender = true;
            }
        } else {
            // 响应hover事件
            let targetNode;
            if (this.nodeInHover) {
                const {x, y} = this.transformRPToTP(e.offsetX, e.offsetY);
                // 判断是否滑出
                if (!this.pointIsInNode({ x, y }, this.nodeInHover)) {
                    if (this.handleNodeHoverOut) {
                        this.handleNodeHoverOut(this.nodeInHover, e);
                    }
                    this.nodeInHover = null;
                    targetNode = this.getEventNode(e);
                    needRender = true;
                }
            } else {
                targetNode = this.getEventNode(e);
            }
            if (targetNode) {
                if (this.handleNodeHoverIn) {
                    this.handleNodeHoverIn(targetNode, e);
                }
                this.nodeInHover = targetNode;
                needRender = true;
            }
        }
        if (needRender) {
            this.render()
        }
    }
    onMouseUp (e) {
        // 拖拽停止
        this.isDragging = false;
        if (this.isClick && this.handleNodeClick) {
            let targetNode = this.getEventNode(e);
            if (targetNode) {
                this.handleNodeClick(targetNode, e)
            }
        }
    }
    onMouseOut (e) {
        this.isDragging = false;
    }
    getEventNode (e) {
        const { nodes } = this;
        const {x, y} = this.transformRPToTP(e.offsetX, e.offsetY);
        for (let i = 0, l = nodes.length; i < l; i++) {
            if (this.pointIsInNode({ x, y }, nodes[i])) {
                return nodes[i]
            }
        }
        return null
    }
    // 转化视图层坐标到拓扑图层坐标
    transformRPToTP (x, y) {
        return {
            x: (x - this.translateX) / this.scale,
            y: (y - this.translateY) / this.scale,
        }
    }
    pointIsInNode (point, node) {
        const { nodeStyle } = this;
        const halfNodeWidth = nodeStyle.width / 2;
        const nodeHeight = nodeStyle.height;
        if (point.x >= node.x - halfNodeWidth && point.x <= node.x + halfNodeWidth) {
            if (point.y >= node.y && point.y <= node.y + nodeHeight) {
                return true
            }
        }
        return false
    }
    drawNodes (nodes) {
        if (nodes === undefined) {
            nodes = this.nodes
        }
        const ctx = this.offScreenCtx;
        const nodeWidth = this.nodeStyle.width;
        const nodeHeight = this.nodeStyle.height;
        ctx.save();
        ctx.fillStyle = this.nodeStyle.backgroundColor;
        ctx.strokeStyle = this.nodeStyle.borderColor;
        ctx.lineWidth = this.nodeStyle.borderWidth;
        nodes.forEach(({x, y, icon}) => {
            ctx.save();
            ctx.beginPath();
            ctx.translate(x, y);
            ctx.moveTo(- nodeWidth / 2, 0);
            ctx.lineTo(nodeWidth / 2, 0);
            ctx.lineTo(nodeWidth / 2, nodeHeight);
            ctx.lineTo(- nodeWidth / 2, nodeHeight);
            ctx.lineTo(- nodeWidth / 2, 0);
            if (this.nodeStyle.backgroundColor) {
                ctx.fill();
            }
            if (this.nodeStyle.border) {
                ctx.stroke();
            }
            if (icon) {
                ctx.drawImage(this.imgSources[icon], - nodeWidth / 2, 0, nodeWidth, nodeHeight);
            }
            ctx.restore();
        });
        ctx.restore();
    }
    drawLinks (links) {
        if (links === undefined) {
            links = this.links;
        }
        const ctx = this.offScreenCtx;

        ctx.save();
        ctx.strokeStyle = this.lineStyle.color;
        ctx.lineWidth = this.lineStyle.width;
        ctx.beginPath();
        links.forEach(({sX, eX, sY, eY}) => {
            ctx.moveTo(sX, sY);
            ctx.lineTo(sX, sY + (eY - sY) / 2);
            ctx.lineTo(eX, sY + (eY - sY) / 2);
            ctx.lineTo(eX, eY);
        });
        ctx.stroke();
    }
    render () {
        const ctx = this.canvasCtx;
        ctx.save();
        ctx.fillStyle = '#fff';
        ctx.rect(0, 0, this.viewWidth, this.viewHeight);
        ctx.fill();
        ctx.drawImage(this.offScreenCanvas, this.translateX, this.translateY, this.contentWidth * this.scale, this.contentHeight * this.scale);
        ctx.restore();
    }
    updateData (sourceData) {
        // 拓扑图树状数据
        this.topologyData = sourceData === undefined ? [] : sourceData;

        const { nodes, xMax, yMax } = this.getNodes();
        // 拓扑图节点
        this.nodes = nodes;

        // 拓扑图最大宽高
        this.contentWidth = xMax;
        this.contentHeight = yMax;

        // 离屏画布元素
        this.offScreenCanvas.width = this.contentWidth;
        this.offScreenCanvas.height = this.contentHeight;

        // 拓扑图连线
        this.links = this.getLinks();

        // 计算适应宽高的缩放
        let autoScale = Math.min(this.viewWidth / this.contentWidth, this.viewHeight / this.contentHeight);

        // 缩放比例
        this.maxScale = 1;
        this.scale = Math.min(this.maxScale, autoScale);

        // 拖拽位移
        this.translateX = (this.viewWidth - this.contentWidth * this.scale) / 2;
        this.translateY = (this.viewHeight - this.contentHeight * this.scale) / 2;

        // 清除焦点节点
        this.nodeInHover = null;

        // 清空离屏
        this.offScreenCtx.rect(0, 0, this.contentWidth, this.contentHeight);

        // 离屏绘制
        this.drawNodes();
        this.drawLinks();

        // 渲染
        this.render();
    }
}
