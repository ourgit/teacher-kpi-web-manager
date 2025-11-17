/* eslint-disable */
import { hiprint } from 'vue-plugin-hiprint'

export const aProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes('aProviderModule')
    context.addPrintElementTypes('aProviderModule', [
      new hiprint.PrintElementTypeGroup('平台', [
        {
          tid: 'aProviderModule.header',
          title: '单据表头',
          data: '单据表头',
          type: 'text',
          options: {
            testData: '单据表头',
            height: 17,
            fontSize: 16.5,
            fontWeight: '',
            textAlign: 'center',
            hideTitle: true,
          },
        },
        {
          tid: 'aProviderModule.order',
          title: '单号',
          data: 'XS888888888',
          type: 'text',
          options: {
            field: 'orderNo',
            testData: 'XS888888888',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.userName',
          title: '客户名称',
          data: '并行网络',
          type: 'text',
          options: {
            field: 'userName',
            testData: '并行网络',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.contact',
          title: '联系方式',
          data: '13212478632',
          type: 'text',
          options: {
            field: 'contact',
            testData: '13212478632',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.salesman',
          title: '业务员',
          data: '王小二',
          type: 'text',
          options: {
            field: 'salesman',
            testData: '王小二',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.address',
          title: '收货地址',
          data: '福清市互联网产业园',
          type: 'text',
          options: {
            field: 'address',
            testData: '福清市互联网产业园',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.date',
          title: '日期',
          data: '2023-01-01',
          type: 'text',
          options: {
            field: 'date',
            testData: '2023-01-01',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.scheduleTime',
          title: '配送时间',
          data: '2023-01-01',
          type: 'text',
          options: {
            field: 'scheduleTime',
            testData: '2023-01-01',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('库管', [
        {
          tid: 'aProviderModule.creater',
          title: '制单人',
          data: '李四',
          type: 'text',
          options: {
            field: 'creater',
            testData: '李四',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.check',
          title: '核单人',
          data: '',
          type: 'text',
          options: {
            title: '核单人：',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.payMenthod',
          title: '付款方式',
          data: '',
          type: 'text',
          options: {
            title: '付款方式：',
            field: 'payMethod',
            testData: '',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.consignee',
          title: '收货单位(盖章)',
          data: '',
          type: 'text',
          options: {
            title: '收货单位(盖章)：',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.printDate',
          title: '打印时间',
          data: '2022-01-01 09:00',
          type: 'text',
          options: {
            field: 'printDate',
            testData: '2022-01-01 09:00',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.driver',
          title: '司机签字',
          data: '',
          type: 'text',
          options: {
            title: '司机签字：',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.numberplate',
          title: '车号',
          data: '',
          type: 'text',
          options: {
            title: '车号：',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
        {
          tid: 'aProviderModule.handle',
          title: '经手人',
          data: '',
          type: 'text',
          options: {
            title: '经手人：',
            height: 16,
            fontSize: 6.75,
            fontWeight: '',
            textAlign: 'left',
            textContentVerticalAlign: 'middle',
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('表格/其他', [
        {
          tid: 'aProviderModule.table',
          title: '订单数据',
          type: 'table',
          options: {
            field: 'table',
            tableHeaderRepeat: 'first',
            tableFooterRepeat: 'last',
            fields: [
              { text: '送货仓库', field: 'shopName' },
              { text: '产品条码', field: 'barcode' },
              { text: '品名及规格', field: 'product' },
              { text: '商品名称', field: 'productName' },
              { text: '规格', field: 'skuName' },
              { text: '数量', field: 'number' },
              { text: '单位', field: 'unit' },
              { text: '单价', field: 'productPrice' },
              { text: '生产日期', field: 'productionDate' },
              { text: '销售金额', field: 'subTotal' },
              { text: '备注', field: '' },
            ],
          },
          editable: true,
          columnDisplayEditable: true, //列显示是否能编辑
          columnDisplayIndexEditable: true, //列顺序显示是否能编辑
          columnTitleEditable: true, //列标题是否能编辑
          columnResizable: true, //列宽是否能调整
          columnAlignEditable: true, //列对齐是否调整
          isEnableEditField: true, //编辑字段
          isEnableContextMenu: true, //开启右键菜单 默认true
          isEnableInsertRow: true, //插入行
          isEnableDeleteRow: true, //删除行
          isEnableInsertColumn: true, //插入列
          isEnableDeleteColumn: true, //删除列
          isEnableMergeCell: true, //合并单元格
          columns: [
            [
              {
                title: '送货仓库',
                align: 'center',
                field: 'shopName',
                width: 100,
              },
              {
                title: '产品条码',
                align: 'center',
                field: 'barcode',
                width: 100,
              },
              {
                title: '品名及规格',
                align: 'center',
                field: 'product',
                width: 150,
              },
              {
                title: '商品名称',
                align: 'center',
                field: 'productName',
                width: 150,
              },
              {
                title: '规格',
                align: 'center',
                field: 'skuName',
                width: 100,
              },
              { title: '数量', align: 'center', field: 'number', width: 60 },
              { title: '单位', align: 'center', field: 'unit', width: 60 },
              {
                title: '单价',
                align: 'center',
                field: 'productPrice',
                width: 60,
              },
              {
                title: '生产日期',
                align: 'center',
                field: 'productionDate',
                width: 80,
              },
              {
                title: '销售金额',
                align: 'center',
                field: 'subTotal',
                width: 80,
              },
              { title: '备注', align: 'center', field: '', width: 100 },
            ],
          ],
          footerFormatter: function (
            options,
            rows,
            data,
            currentPageGridRowsData
          ) {
            if (data && data['totalCap']) {
              return `<td style="padding:0 10px" colspan="6">${
                '应收金额大写: ' + data['totalCap']
              }</td><td colspan="2">${'合计金额: ' + data['totalMoney']}</td>`
            }
            return '<td style="padding:0 10px" colspan="6">应收金额大写: </td><td colspan="2">合计金额：</td>'
          },
        },
        {
          tid: 'aProviderModule.customText',
          title: '文本',
          customText: '自定义文本',
          custom: true,
          type: 'text',
        },
        {
          tid: 'aProviderModule.longText',
          title: '长文本',
          type: 'longText',
          options: {
            field: 'test.longText',
            width: 200,
            testData: '长文本分页/不分页测试',
          },
        },
      ]),
      new hiprint.PrintElementTypeGroup('辅助', [
        {
          tid: 'aProviderModule.hline',
          title: '横线',
          type: 'hline',
        },
        {
          tid: 'aProviderModule.vline',
          title: '竖线',
          type: 'vline',
        },
        {
          tid: 'aProviderModule.rect',
          title: '矩形',
          type: 'rect',
        },
        {
          tid: 'aProviderModule.oval',
          title: '椭圆',
          type: 'oval',
        },
      ]),
    ])
  }
  return {
    addElementTypes: addElementTypes,
  }
}

// type: 1供货商 2经销商
export default [
  {
    name: 'A设计',
    value: 'aProviderModule',
    type: 1,
    f: aProvider(),
  },
]
