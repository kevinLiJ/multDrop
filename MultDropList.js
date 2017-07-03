function MultDrop(opt) {
    this.option = $.extend({
        // 传入插件盒子的id
        selectorId: '',
        // 最外层盒子的宽
        width: "auto",
        // 列表的高
        height: "auto",
        // 设置input的name属性，用于表单提交
        name: '',
        // 选项的数据
        // 两种格式 ：['str1','str2'] 或者 [{val1:text1},{val2:text2},{val3:text3}]
        data: "",
        // 默认选中的数据 
        // ['str1', 'str2']['name1', 'name2']
        SelectedData: [],
        // 是否含有全选按钮
        selectAll: 'true',
        // 用于格式化传入的data为正确格式
        dataFormate: function(val) {
            return val;
        },
        // 用于格式化传入的selectedData为正确格式
        selectedDataFormate: function(val) {
            return val;
        },
        afterCheck: function() {}
    }, opt);
    this.dropListBox = $('#' + this.option.selectorId);
    this.dropListInp = this.dropListBox.find('.multDropInp');
    this.dropList = this.dropListBox.find('.multDropList');
    this.dropListUl = this.dropListBox.find('ul');
    // 操作后最终选中的值
    this.VALUE = [];
    this.dataType = 'object';
    this.init();
}
MultDrop.prototype = {
    constructor: MultDrop,
    init: function() {
        this.initDom();
        this.initData();
        this.initEvent();
        this.refreshValue();
    },
    // 初始化Dom结构
    initDom: function() {
        var _this = this;
        // 设置宽高
        this.dropListBox.css({
            "width": this.option.width
        });
        this.dropList.css({
            "height": this.option.height
        });

        // 设置name属性
        // 传入了参数name,标签上的name属性就会被替换
        if (this.option.name) {
            this.dropListInp.attr('name', this.option.name);
        }

        // 加载全选按钮
        if (this.option.selectAll === 'true') {
            this.dropListUl.append('<li><input type="checkbox" class="multDropCheckAll" value="" /><span> All</span></li>')
        }
    },
    // 初始化选项以及选中项
    initData: function() {
        var _this = this;
        this.option.data = this.option.dataFormate(this.option.data);
        this.option.selectedData = this.option.selectedDataFormate(this.option.selectedData);
        if (this.option.data && typeof(this.option.data[0]) === 'string') {
            this.dataType = 'string';
        }
        // 加载数据
        if (this.dataType === 'string') {
            for (var i = 0; i < this.option.data.length; i++) {
                var eachData = this.option.data[i];
                this.dropListUl.append('<li class="multDropItem"><input type="checkbox" value="' + eachData + '" /><span>' + eachData + '</span></li>');
            }
        } else {
            for (var i = 0; i < this.option.data.length; i++) {
                var eachData = this.option.data[i];
                for (var key in eachData) {
                    this.dropListUl.append('<li class="multDropItem"><input type="checkbox" value="' + key + '" /><span>' + eachData[key] + '</span></li>');
                }
            }
        }

        // 初始化默认选中
        if (!_this.option.selectedData.length) {
            $('.multDropItem').each(function(idx, item) {
                if (_this.option.selectedData[idx] === $(item).children('input').val()) {
                    $(item).children('input').prop('checked', true);
                }
            })
        }
    },
    // 刷新选项、清空选中项
    refreshData: function(data) {
        this.option.data = data;
        this.option.selectedData = '';
        this.dropListUl.empty();
        this.initData();
        this.refreshValue();
    },
    initEvent: function() {
        var _this = this;
        // 多选项框显示隐藏事件
        this.dropListInp.click(function(e) {
            _this.dropList.toggle();
            e.stopPropagation();
        });
        // 多选项框隐藏
        $(document).click(function() {
            _this.dropList.hide();
        });
        // 选项选中后更新数据执行回调函数
        this.dropListUl.on('click', this.dropListUl.find('.multDropItem input'), function(e) {
            e.stopPropagation();
            _this.refreshValue();
            _this.option.afterCheck(_this);
        })

        // 全选反选 更新数据并执行回调函数
        this.dropListUl.find(".multDropCheckAll").click(function(e) {
            e.stopPropagation();
            if ($(this).prop("checked")) {
                _this.dropListUl.find("li input").prop("checked", true);
            } else {
                _this.dropListUl.find("li input").prop("checked", false);
            }
            _this.refreshValue();
            _this.option.afterCheck(_this);
        });
    },
    // 每次选则选项后更新结果
    refreshValue: function() {
        var _this = this;
        this.VALUE = [];
        // 更新插件value值
        this.dropListBox.find('.multDropItem').each(function(idx, item) {
            if ($(item).children('input').prop('checked')) {
                _this.VALUE.push($(item).children('input').val());
            }
        })

        // 更新输入框的值，用于表单提交
        this.dropListInp.val(this.VALUE.join(','));
        return this.VALUE;

    }
}