<template>
    <div style="height:100%;min-width:1165px;" class="flex-column-inline">
        <porn-head></porn-head>
        <div class="statistic" style="flex:1;display:flex;flex-direction:row;">
            <div style="hegith:100%;width:200px;background:#eee;overflow:auto;" class="flex-column-inline" >
                <span style="color:#808695;font-weight:600;text-align:left;margin:20px;" >存储</span>
                <div style="width:100%;justify-content:space-around" class="flex-column-center" >
                    <Card :bordered="false" style="width:150px;">
                        <p style="font-weight:700" slot="title">{{formatSize(totalSize)}}</p>
                        <p style="color:#808695">使用容量</p>
                    </Card>
                    <Card :bordered="false" style="width:150px;margin-top:20px;">
                        <p style="font-weight:700" slot="title">{{formatSize(maxSize)}}</p>
                        <p style="color:#808695">最大容量</p>
                    </Card>
                    <Card :bordered="false" style="width:150px;margin-top:20px;">
                        <p style="font-weight:700" slot="title">{{fileList.length}}</p>
                        <p style="color:#808695">文件数</p>
                    </Card>
                    <i-circle style="margin-top:20px;" trail-color="lightgray" :percent="percent" :stroke-color="['#19be6b', '#ed4014']">
                        <div style="color:#808695;margin-bottom:5px;">容量占比</div>
                        <span style="font-size:24px;">{{percent}}%</span>
                    </i-circle>
                </div>
            </div>
            <div style="flex:1;height:100%;overflow:auto;display:flex;flex-direction:column;align-items:center;">
                <div style="width:90%;" >
                    <div style="display:flex;align-items:center;justify-content:space-between;width:100%;padding:10px;box-sizing: border-box;">
                        <div>
                            <span style="color:#808695">已选{{selectNumber}}个文件</span>
                            <i-button :loading="deleting" @click="removeAllSelect()"  type="error" :disabled="selectNumber==0" style="margin-left:10px;" size="small">批量删除</i-button>
                        </div>
                        
                        <Page v-if="fileList.length != 0" :page-size="pageSize" style="align-self:flex-end;" :total="fileList.length" :current="currentPage" @on-change="changePage"></Page>
                    </div>
                    <Table @on-selection-change="selectChange" @on-select="select" @on-sort-change="sort" size="small" ref="selection" :data="tableData" :columns="tableColumns" stripe>
                        <template slot-scope="{ row, index }" slot="select">
                            <Checkbox @on-change="selectNumberSetter" v-model="tableData[index]._checked"></Checkbox>
                        </template>
                        <template slot-scope="{ row, index }" slot="action">
                            <i-button type="primary" size="small" @click="view(index)">预览</i-button>
                        </template>
                    </Table>
                     <div style="display:flex;justify-content:space-between;width:100%;">
                        <div></div>
                        <Page v-if="fileList.length != 0" :page-size="pageSize" style="align-self:flex-end;margin:10px;" :total="fileList.length" :current="currentPage" @on-change="changePage"></Page>
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>
<style scoped>
>>>.statistic::-webkit-scrollbar {
    width: 0px;
}
</style>
<script>
import Head from "@/Head.vue"
import {ImagePreview} from 'vant';
import {Circle, Message, Card, Table, Page, Checkbox, Button, Modal} from "view-design"
export default {
    name: "PictureBed",
    components: {
        "porn-head": Head,
        "i-circle": Circle,
        "i-button": Button,
        Card,
        Table,
        Page,
        Checkbox
    },
    data () {
        return {
            maxSize: '',
            totalSize: '',
            fileNumber: '',
            percent: 0,
            tableData: [],
            fileList: [],
            sortList: [],
            currentPage: 1,
            pageSize: 10,
            selectAll: false,
            selectNumber: 0,
            deleting: false,
            tableColumns: [
                    {
                        renderHeader: (h, params) => {
                            return h('Checkbox', {
                                props: {
                                    value: this.selectAll
                                },
                                style: {
                                    width: "16px"
                                },
                                on: {
                                    "on-change": (e) => {
                                        this.fileList.forEach(element => {
                                            element["_checked"] = e;
                                        });
                                        this.selectAll = e;
                                        e ? this.selectNumber = this.fileList.length : this.selectNumber = 0;
                                    }
                                }
                            })
                        },
                        slot: 'select',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '文件名',
                        key: 'fileName',
                        minWidth: 300
                    },
                    {
                        title: '大小',
                        key: 'size',
                        sortable: true,
                        minWidth: 100,
                        maxWidth: 200,
                        render: (h, params) => {
                            return h('span', this.formatSize(params.row.size));
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        sortable: true,
                        minWidth: 100,
                        maxWidth: 200,
                        render: (h, params) => {
                            return h('span', this.formatDate(params.row.createTime))
                        }
                    },
                    {
                        title: '操作',
                        slot: 'action',
                        minWidth: 100,
                        align: 'center'
                    }
            ]
        }
    },
    mounted () {
        
    },
    methods: {
        load () {
            var that = this;
            this.axios.get("/api/picture-bed/get-picture-bed-statistic")
            .then(function (res) {
                that.maxSize = res.data.maxSize;
                that.totalSize = res.data.totalSize;
                that.fileNumber = res.data.fileNumber;
                that.percent = parseInt(res.data.totalSize * 100 / res.data.maxSize);
                for (let i = 0; i < res.data.pictureBedFileList.length; i++) {
                    res.data.pictureBedFileList[i]["_checked"] = false;
                }
                that.fileList = res.data.pictureBedFileList;
                that.sortList = res.data.pictureBedFileList.slice(0, that.fileList.length);
                that.tableData = that.mockTableData();
            })
            .catch(function (err) {
                Message.error(err.response.data.msg);
            })
        },
        mockTableData () {
            if ((this.currentPage - 1) * this.pageSize > this.fileList.length) {
                let page = parseInt(this.fileList.length / this.pageSize);
                this.currentPage = page === 0 ? 1 : page;
            }
            let _start = (this.currentPage - 1) * this.pageSize;
            let _end = this.currentPage * this.pageSize;
            return this.sortList.slice(_start, _end);
        },
        selectNumberSetter (e) {
            e ? this.selectNumber++ : this.selectNumber--;
            this.selectAll = this.selectNumber === this.fileList.length;
        },
        select (selection, row) {
            console.info(row);
        },
        removeAllSelect () {
            Modal.confirm({
                title: '删除图片',
                content: '<p>删除图片后，您将无法找回，且图片将无法被引用，请谨慎操作！</p>',
                onOk: () => {
                    var that = this;
                    var deleteList = [];
                    for (let i = 0; i < this.fileList.length;) {
                        if (this.fileList[i]["_checked"] === true) {
                            deleteList.push((this.fileList.splice(i, 1))[0].fileName);
                            continue;
                        }
                        i++;
                    }
                    for (let i = 0; i < this.sortList.length;) {
                        if (this.sortList[i]["_checked"] === true) {
                            this.sortList.splice(i, 1);
                            continue;
                        }
                        i++;
                    }
                    this.tableData = this.mockTableData();
                    this.deleting = true;
                    this.axios.post("/api/picture-bed/remove-picture-bed", deleteList)
                    .then(function (res) {
                        that.totalSize -= res.data.size;
                        that.selectNumber = 0;
                        that.deleting = false;
                        that.percent = parseInt(that.totalSize * 100 / that.maxSize);
                        Message.success(res.data.msg);
                    }) 
                    .catch(function (err) {
                        that.deleting = false;
                        Message.error(err.response.data.msg);
                    })
                },
                onCancel: () => {
                }
            });
        },
        view (index) {
            var images = [];
            images.push(this.tableData[index].url);
            ImagePreview({
                images: images,
                closeable: true
            })
        },
        selectChange (selection, row) {
            console.info(selection);
        },
        sortBy (attr, rev) {
            if (rev ===  undefined) {
                rev = 1;
            } else {
                rev = (rev) ? 1 : -1;
            }
            return function (a, b) {
                a = a[attr];
                b = b[attr];
                if (a < b) {
                    return rev * -1;
                }
                if (a > b) {
                    return rev * 1;
                }
                return 0;
            }
        },
        sort (sortType) {
            if (sortType.order === "asc") {
                this.sortList = this.fileList.slice(0, this.fileList.length);
                this.sortList.sort(this.sortBy(sortType.key, true));
            } else if (sortType.order === "desc") {
                this.sortList = this.fileList.slice(0, this.fileList.length);
                this.sortList.sort(this.sortBy(sortType.key, false));
            } else if (sortType.order === "normal") {
                this.sortList = this.fileList;
            }
            this.currentPage = 1;
            this.tableData = this.mockTableData();
        },
        changePage (e) {
            this.currentPage = e;
            this.tableData = this.mockTableData();
        },
        formatSize (s) {
            var size = s;
            if (size === 0) {
                return "0";
            } else if (!size) {
                return "NAN";
            } else if (size < 1024) {
                return size + "B";
            } else if (size < 1048576) {
                return parseInt(size / 1024) + "." + parseInt((size % 1024) * 100 / 1024) + "KB";
            } else if (size < 1073741824) {
                return parseInt(size / 1048576) + "." + parseInt((size % 1048576) * 100 / 1048576) + "MB";
            } else if (size < 1099511627776) {
                return parseInt(size / 1073741824) + "." + parseInt((size % 1073741824) * 100 / 1073741824) + "GB";
            } else {
                return "NAN";
            }
        },
        formatDate (timestamp) {
            var date = new Date(timestamp);
            const y = date.getFullYear();
            let m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            let d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            let h = date.getHours();
            h = h < 10 ? '0' + h : h;
            let mi = date.getMinutes();
            mi = mi < 10 ? '0' + mi : mi;
            let s = date.getSeconds();
            s = s < 10 ? '0' + s : s;
            return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + s;
        }
    }
}
</script>