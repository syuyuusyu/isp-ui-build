'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addEvent = function () {
    var _eventCompat = function _eventCompat(event) {
        var type = event.type;
        if (type === 'DOMMouseScroll' || type === 'mousewheel') {
            event.delta = event.wheelDelta ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
        }

        if (event.srcElement && !event.target) {
            event.target = event.srcElement;
        }
        if (!event.preventDefault && event.returnValue !== undefined) {
            event.preventDefault = function () {
                event.returnValue = false;
            };
        }

        return event;
    };
    if (window.addEventListener) {
        return function (el, type, fn, capture) {
            if (type === "mousewheel" && document.mozFullScreen !== undefined) {
                type = "DOMMouseScroll";
            }
            el.addEventListener(type, function (event) {
                fn.call(this, _eventCompat(event));
            }, capture || false);
        };
    } else if (window.attachEvent) {
        return function (el, type, fn, capture) {
            el.attachEvent("on" + type, function (event) {
                event = event || window.event;
                fn.call(el, _eventCompat(event));
            });
        };
    }
    return function () {};
}();

var Topology = function () {
    function Topology(params) {
        _classCallCheck(this, Topology);

        this.init(params);
    }

    _createClass(Topology, [{
        key: 'init',
        value: function init(params) {
            var canvas = params.canvas,
                topologyData = params.topologyData,
                imgSources = params.imgSources,
                nodeStyle = params.nodeStyle,
                lineStyle = params.lineStyle,
                event = params.event;
            // 拓扑图容器

            var container = canvas.parentNode;

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

            var _getNodes = this.getNodes(),
                nodes = _getNodes.nodes,
                xMax = _getNodes.xMax,
                yMax = _getNodes.yMax;
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
            var autoScale = Math.min(this.viewWidth / this.contentWidth, this.viewHeight / this.contentHeight);

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
    }, {
        key: 'getNodesAndLinks',
        value: function getNodesAndLinks(tree) {
            if (tree === undefined) {
                tree = this.topologyData;
            }
            var nodes = [];
            var links = [];

            var fn = function fn(arr, deep, parentId) {
                if (arr.length === 0) {
                    return;
                }
                if (deep === undefined) {
                    deep = 0;
                }
                arr.forEach(function (_ref) {
                    var id = _ref.id,
                        name = _ref.name,
                        icon = _ref.icon,
                        children = _ref.children;

                    nodes.push({ id: id, name: name, icon: icon, deep: deep });
                    if (deep > 0) {
                        links.push({
                            source: parentId,
                            target: id,
                            deep: deep - 1
                        });
                    }
                    fn(children, deep + 1, id);
                });
            };

            fn(tree);

            return { nodes: nodes, links: links };
        }
    }, {
        key: 'getNodes',
        value: function getNodes(tree) {
            if (tree === undefined) {
                tree = this.topologyData;
            }

            var widthNode = this.nodeStyle.width;
            var heightNode = this.nodeStyle.height;
            var _nodeStyle = this.nodeStyle,
                horizontalMargin = _nodeStyle.horizontalMargin,
                verticalMargin = _nodeStyle.verticalMargin;

            var nodes = [];
            var xMax = 0;
            var yMax = 0;

            var fn = function fn(arr, deep, startX) {
                var selfWidth = 0;
                var arrLength = arr.length;
                if (arr === undefined || arrLength === 0) {
                    return widthNode;
                }
                if (deep === undefined) {
                    deep = 0;
                    startX = 0;
                }

                arr.forEach(function (_ref2, index) {
                    var id = _ref2.id,
                        name = _ref2.name,
                        icon = _ref2.icon,
                        children = _ref2.children;

                    var widthChildren = fn(children, deep + 1, startX + selfWidth);
                    var x = startX + selfWidth + widthChildren / 2;
                    var y = deep * (verticalMargin + heightNode);
                    xMax = x > xMax ? x + widthNode / 2 : xMax;
                    yMax = y > yMax ? y + heightNode : yMax;
                    nodes.push({
                        id: id,
                        name: name,
                        icon: icon,
                        x: x,
                        y: y
                    });
                    if (arrLength - 1 === index) {
                        selfWidth += widthChildren;
                    } else {
                        selfWidth += widthChildren + horizontalMargin;
                    }
                });
                return selfWidth;
            };

            fn(tree);

            return { nodes: nodes, xMax: xMax, yMax: yMax };
        }
    }, {
        key: 'getLinks',
        value: function getLinks(tree) {
            var nodes = void 0;
            var nodesIndex = {};
            var links = [];
            var nodeWidth = this.nodeStyle.width;
            var nodeHeight = this.nodeStyle.height;
            if (tree !== undefined) {
                nodes = this.getNodes(tree);
            } else {
                tree = this.topologyData;
                nodes = this.nodes;
            }

            // 以节点id建立节点索引
            nodes.forEach(function (node) {
                nodesIndex[node.id] = node;
            });

            // 遍历拓扑树，计算出所有连线
            var fn = function fn(arr, parentId, sX, sY) {
                arr.forEach(function (_ref3) {
                    var id = _ref3.id,
                        children = _ref3.children;

                    if (parentId !== undefined) {
                        links.push({
                            sId: parentId,
                            tId: id,
                            sX: sX,
                            sY: sY,
                            eX: nodesIndex[id].x,
                            eY: nodesIndex[id].y
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
    }, {
        key: 'onMouseWheel',
        value: function onMouseWheel(e) {
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
    }, {
        key: 'onMouseDown',
        value: function onMouseDown(e) {
            // 启用拖拽
            this.isDragging = true;
            // 启用点击
            this.isClick = true;
            this.dragSX = e.clientX;
            this.dragSY = e.clientY;
            this.translateXOld = this.translateX;
            this.translateYOld = this.translateY;
        }
    }, {
        key: 'onMouseMove',
        value: function onMouseMove(e) {
            var needRender = false;
            if (this.isDragging) {
                // 响应拖拽事件
                var xMoved = e.clientX - this.dragSX;
                var yMoved = e.clientY - this.dragSY;
                this.translateX = this.translateXOld + xMoved;
                this.translateY = this.translateYOld + yMoved;
                // 根据移动距离判断是否拖动
                if (xMoved >= 1 || yMoved >= 1) {
                    this.isClick = false;
                    needRender = true;
                }
            } else {
                // 响应hover事件
                var targetNode = void 0;
                if (this.nodeInHover) {
                    var _transformRPToTP = this.transformRPToTP(e.offsetX, e.offsetY),
                        x = _transformRPToTP.x,
                        y = _transformRPToTP.y;
                    // 判断是否滑出


                    if (!this.pointIsInNode({ x: x, y: y }, this.nodeInHover)) {
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
                this.render();
            }
        }
    }, {
        key: 'onMouseUp',
        value: function onMouseUp(e) {
            // 拖拽停止
            this.isDragging = false;
            if (this.isClick && this.handleNodeClick) {
                var targetNode = this.getEventNode(e);
                if (targetNode) {
                    this.handleNodeClick(targetNode, e);
                }
            }
        }
    }, {
        key: 'onMouseOut',
        value: function onMouseOut(e) {
            this.isDragging = false;
        }
    }, {
        key: 'getEventNode',
        value: function getEventNode(e) {
            var nodes = this.nodes;

            var _transformRPToTP2 = this.transformRPToTP(e.offsetX, e.offsetY),
                x = _transformRPToTP2.x,
                y = _transformRPToTP2.y;

            for (var i = 0, l = nodes.length; i < l; i++) {
                if (this.pointIsInNode({ x: x, y: y }, nodes[i])) {
                    return nodes[i];
                }
            }
            return null;
        }
        // 转化视图层坐标到拓扑图层坐标

    }, {
        key: 'transformRPToTP',
        value: function transformRPToTP(x, y) {
            return {
                x: (x - this.translateX) / this.scale,
                y: (y - this.translateY) / this.scale
            };
        }
    }, {
        key: 'pointIsInNode',
        value: function pointIsInNode(point, node) {
            var nodeStyle = this.nodeStyle;

            var halfNodeWidth = nodeStyle.width / 2;
            var nodeHeight = nodeStyle.height;
            if (point.x >= node.x - halfNodeWidth && point.x <= node.x + halfNodeWidth) {
                if (point.y >= node.y && point.y <= node.y + nodeHeight) {
                    return true;
                }
            }
            return false;
        }
    }, {
        key: 'drawNodes',
        value: function drawNodes(nodes) {
            var _this = this;

            if (nodes === undefined) {
                nodes = this.nodes;
            }
            var ctx = this.offScreenCtx;
            var nodeWidth = this.nodeStyle.width;
            var nodeHeight = this.nodeStyle.height;
            ctx.save();
            ctx.fillStyle = this.nodeStyle.backgroundColor;
            ctx.strokeStyle = this.nodeStyle.borderColor;
            ctx.lineWidth = this.nodeStyle.borderWidth;
            nodes.forEach(function (_ref4) {
                var x = _ref4.x,
                    y = _ref4.y,
                    icon = _ref4.icon;

                ctx.save();
                ctx.beginPath();
                ctx.translate(x, y);
                ctx.moveTo(-nodeWidth / 2, 0);
                ctx.lineTo(nodeWidth / 2, 0);
                ctx.lineTo(nodeWidth / 2, nodeHeight);
                ctx.lineTo(-nodeWidth / 2, nodeHeight);
                ctx.lineTo(-nodeWidth / 2, 0);
                if (_this.nodeStyle.backgroundColor) {
                    ctx.fill();
                }
                if (_this.nodeStyle.border) {
                    ctx.stroke();
                }
                if (icon) {
                    ctx.drawImage(_this.imgSources[icon], -nodeWidth / 2, 0, nodeWidth, nodeHeight);
                }
                ctx.restore();
            });
            ctx.restore();
        }
    }, {
        key: 'drawLinks',
        value: function drawLinks(links) {
            if (links === undefined) {
                links = this.links;
            }
            var ctx = this.offScreenCtx;

            ctx.save();
            ctx.strokeStyle = this.lineStyle.color;
            ctx.lineWidth = this.lineStyle.width;
            ctx.beginPath();
            links.forEach(function (_ref5) {
                var sX = _ref5.sX,
                    eX = _ref5.eX,
                    sY = _ref5.sY,
                    eY = _ref5.eY;

                ctx.moveTo(sX, sY);
                ctx.lineTo(sX, sY + (eY - sY) / 2);
                ctx.lineTo(eX, sY + (eY - sY) / 2);
                ctx.lineTo(eX, eY);
            });
            ctx.stroke();
        }
    }, {
        key: 'render',
        value: function render() {
            var ctx = this.canvasCtx;
            ctx.save();
            ctx.fillStyle = '#fff';
            ctx.rect(0, 0, this.viewWidth, this.viewHeight);
            ctx.fill();
            ctx.drawImage(this.offScreenCanvas, this.translateX, this.translateY, this.contentWidth * this.scale, this.contentHeight * this.scale);
            ctx.restore();
        }
    }]);

    return Topology;
}();

export default Topology;