"use client";
import React, { useState, useMemo, useEffect, Fragment } from "react";
import {
    fetchPackages,
    createPackageApi,
    updatePackageApi,
    setPackageStatusApi,
} from "@/lib/packages-api";

// 智汇云产品数据
const zhihuiProductsData = [
    {
        id: 1,
        name: "离线数仓 Hive",
        category: "大数据/数据仓库",
        identifier: "hive",
        visibility: "指定企业可见",
        status: "online",
        onlineTime: "2026-03-25 11:03:51",
        icon: "database",
    },
    {
        id: 2,
        name: "对象存储 OSS",
        category: "存储/对象存储",
        identifier: "oss",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-20 09:15:32",
        icon: "storage",
    },
    {
        id: 3,
        name: "云数据库 MySQL",
        category: "数据库/关系型数据库",
        identifier: "mysql",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-18 14:22:08",
        icon: "db",
    },
    {
        id: 4,
        name: "容器服务 K8s",
        category: "容器/容器编排",
        identifier: "k8s",
        visibility: "指定企业可见",
        status: "offline",
        onlineTime: "2026-03-10 16:45:20",
        icon: "container",
    },
    {
        id: 5,
        name: "实时计算 Flink",
        category: "大数据/流计算",
        identifier: "flink",
        visibility: "所有企业可见",
        status: "offline",
        onlineTime: "2026-03-08 10:30:45",
        icon: "compute",
    },
    {
        id: 6,
        name: "消息队列 Kafka",
        category: "中间件/消息队列",
        identifier: "kafka",
        visibility: "所有企业可见",
        status: "online",
        onlineTime: "2026-03-05 08:12:33",
        icon: "queue",
    },
];

// 产品计费项数据
const billingItemsData = [
    { id: 1, name: "chat_360-mirothinker-1.7_输出", tagName: "__", identifier: "api_t_s_2036746716615655424", product: "API市场 APIMKT (apimarket)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-25 18:07:13", remark: "" },
    { id: 2, name: "chat_360-mirothinker-1.7_输入", tagName: "__", identifier: "api_t_s_2036746716615340032", product: "API市场 APIMKT (apimarket)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-25 18:07:13", remark: "" },
    { id: 3, name: "chat_360-mirothinker-v1.7_输出", tagName: "__", identifier: "api_t_s_2036740809824219136", product: "API市场 APIMKT (apimarket)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-25 17:43:45", remark: "" },
    { id: 4, name: "chat_360-mirothinker-v1.7_输入", tagName: "__", identifier: "api_t_s_2036740809826058240", product: "API市场 APIMKT (apimarket)", unit: "1百万tokens", rule: "用量求和", createTime: "2026-03-25 17:43:45", remark: "" },
    { id: 5, name: "Tavily Search_tavily_search_advanced", tagName: "__", identifier: "api_n_s_2036641175188381696", product: "API市场 APIMKT (apimarket)", unit: "1次", rule: "用量求和", createTime: "2026-03-25 11:07:50", remark: "" },
    { id: 6, name: "Tavily Extract _tavily_extract_basic", tagName: "__", identifier: "api_n_s_2036639435502751744", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 11:00:55", remark: "" },
    { id: 7, name: "Tavily Extract _tavily_extract_advanced", tagName: "__", identifier: "api_n_s_2036639189061566464", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 10:59:56", remark: "" },
    { id: 8, name: "Tavily Crawl_tavily_claw_basic", tagName: "__", identifier: "api_n_s_2036638157819600896", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 10:55:51", remark: "" },
    { id: 9, name: "Tavily Crawl_tavily_claw_advanced", tagName: "__", identifier: "api_n_s_2036637984355844096", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 10:55:09", remark: "" },
    { id: 10, name: "Tavily Map_tavily_map_without_instruction", tagName: "__", identifier: "api_n_s_2036637741223469056", product: "API市场 APIMKT (apimarket)", unit: "1个", rule: "用量求和", createTime: "2026-03-25 10:54:11", remark: "" },
];

// 产品套餐数据
const resourcePackagesData = [
    { id: 1, name: "旗舰版", identifier: "test0320", product: "测试产品22 (ces_sign)", type: "总价包", createTime: "2026-03-19 13:08:01", updateTime: "2026-03-19 15:19:36", status: "online" },
    { id: 2, name: "A100-80G-标准版-8卡", identifier: "13_109_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-13 11:27:52", updateTime: "2026-03-23 17:04:10", status: "online" },
    { id: 3, name: "总量包1", identifier: "zlb1", product: "test (test_x)", type: "总价包", createTime: "2026-03-10 17:06:25", updateTime: "2026-03-10 17:07:22", status: "offline" },
    { id: 4, name: "自动续费套餐2", identifier: "zdxfzyb2", product: "test (test_x)", type: "总价节省", createTime: "2026-03-10 11:57:00", updateTime: "2026-03-10 15:40:35", status: "online" },
    { id: 5, name: "自动续费套餐1", identifier: "zdxfzyb1", product: "test (test_x)", type: "总量节省", createTime: "2026-03-10 11:56:12", updateTime: "2026-03-10 15:40:35", status: "online" },
    { id: 6, name: "L20-48G-基础版-8卡", identifier: "test0309", product: "测试产品22 (ces_sign)", type: "总量节省", createTime: "2026-03-09 17:21:16", updateTime: "2026-03-11 17:25:17", status: "online" },
    { id: 7, name: "L20-48G-基础版-8卡", identifier: "2_9_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-02 18:45:12", updateTime: "2026-03-23 10:58:56", status: "online" },
    { id: 8, name: "L20-48G-标准版-8卡", identifier: "3_17_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-02 18:44:33", updateTime: "2026-03-13 10:49:00", status: "online" },
    { id: 9, name: "4090-24G-基础版-8卡", identifier: "7_57_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-02 18:43:44", updateTime: "2026-03-16 19:01:37", status: "online" },
    { id: 10, name: "4090D-48G-基础版-8卡", identifier: "6_49_8", product: "AI开发平台TAI (tai)", type: "总量节省", createTime: "2026-03-02 18:42:50", updateTime: "2026-03-13 17:58:20", status: "online" },
];

// ===== 经营分析 - 产品分析 =====
interface ProductAnalysisRow {
    id: number;
    period: string;                 // 账期
    productLine: string;            // 所属产线
    settlementUnit: string;         // 归属结算单元(ops)
    productName: string;            // 产品名称
    totalRevenue: number;           // 总收入(元)
    innerRevenue: number;           // 公司内收入(元)
    innerNonMidRevenue: number;     // 公司内非中台收入(元)
    midNonZyunRevenue: number;      // 中台内非智汇云收入(元)
    zyunNonUnitRevenue: number;     // 智汇云内非本结算单元收入(元)
    unitRevenue: number;            // 本结算单元收入(元)
    outerRevenue: number;           // 公司外收入(元) = 集团内外部事业部 + 外部(360.cn)
    outerGroupRevenue: number;      // 公司外收入 - 集团内外部事业部(元)：内部portal下标记为「外部」的客户收入
    outerPortalRevenue: number;     // 公司外收入 - 外部(360.cn)(元)：非内部portal（外部portal）的收入
    hasOuterPortal: boolean;        // 该产品是否关联了外部portal（内外部portal产品合并展示）
    outerInnerPriceRevenue: number; // 外部收入对应的内结算价收入(元)
    innerTotalRevenue: number;      // 内结算总收入(元)
    productCost: number;            // 产品成本(元)
    innerProfit: number;            // 内结算价利润(元)
    outerProfit: number;            // 外部利润(元)
    innerMargin: number;            // 内结算毛利率
    outerMargin: number;            // 外部毛利率
    balance: number;                // 收支差额(元)
}

const productAnalysisData: ProductAnalysisRow[] = [
    {
        id: 1, period: "202608", productLine: "弹性计算", settlementUnit: "智汇云-云平台部",
        productName: "云服务器 ECS_裸金属CPU(计量)(cloud_server)",
        totalRevenue: 42139500, innerRevenue: 38257000, innerNonMidRevenue: 12768600,
        midNonZyunRevenue: 114800, zyunNonUnitRevenue: 12430583.01, unitRevenue: 12943000,
        outerRevenue: 3882500, outerGroupRevenue: 2482500, outerPortalRevenue: 1400000, hasOuterPortal: true,
        outerInnerPriceRevenue: 2968000, innerTotalRevenue: 41225000,
        productCost: 34417000, innerProfit: 6808000, outerProfit: 914500,
        innerMargin: 16.51, outerMargin: 23.55, balance: 7722500,
    },
    {
        id: 2, period: "202608", productLine: "弹性计算", settlementUnit: "智汇云-云平台部",
        productName: "托管集群服务 MCS_容器服务(cluster)",
        totalRevenue: 25950500, innerRevenue: 25721900, innerNonMidRevenue: 60100,
        midNonZyunRevenue: 0, zyunNonUnitRevenue: 25661800, unitRevenue: 0,
        outerRevenue: 228600, outerGroupRevenue: 148600, outerPortalRevenue: 80000, hasOuterPortal: true,
        outerInnerPriceRevenue: 165700, innerTotalRevenue: 25887500,
        productCost: 26003000, innerProfit: -115500, outerProfit: 62900,
        innerMargin: -0.45, outerMargin: 27.54, balance: -52600,
    },
    {
        id: 3, period: "202608", productLine: "弹性计算", settlementUnit: "智汇云-云平台部",
        productName: "云服务器 ECS_裸金属GPU(计量)(cloud_server)",
        totalRevenue: 14374000, innerRevenue: 14374000, innerNonMidRevenue: 530900,
        midNonZyunRevenue: 150500, zyunNonUnitRevenue: 10400, unitRevenue: 13682200,
        outerRevenue: 0, outerGroupRevenue: 0, outerPortalRevenue: 0, hasOuterPortal: false,
        outerInnerPriceRevenue: 0, innerTotalRevenue: 14374000,
        productCost: 14399600, innerProfit: -25600, outerProfit: 0,
        innerMargin: -0.18, outerMargin: 0, balance: -25600,
    },
    {
        id: 4, period: "202608", productLine: "弹性计算", settlementUnit: "智汇云-智能工程部",
        productName: "托管集群服务 MCS_A机器(cluster)",
        totalRevenue: 13662800, innerRevenue: 13545000, innerNonMidRevenue: 11921900,
        midNonZyunRevenue: 1623300, zyunNonUnitRevenue: 6977500, unitRevenue: 0,
        outerRevenue: 117800, outerGroupRevenue: 77800, outerPortalRevenue: 40000, hasOuterPortal: true,
        outerInnerPriceRevenue: 110200, innerTotalRevenue: 13655200,
        productCost: 13648100, innerProfit: 70823.90, outerProfit: 75783.25,
        innerMargin: 0.05, outerMargin: 6.43, balance: 147000,
    },
    {
        id: 5, period: "202608", productLine: "存储服务", settlementUnit: "智汇云-云平台部",
        productName: "对象存储 OSS_标准存储(计量)(oss_storage)",
        totalRevenue: 9834600, innerRevenue: 8912300, innerNonMidRevenue: 3421000,
        midNonZyunRevenue: 88900, zyunNonUnitRevenue: 2903400, unitRevenue: 2499000,
        outerRevenue: 922300, outerGroupRevenue: 602300, outerPortalRevenue: 320000, hasOuterPortal: true,
        outerInnerPriceRevenue: 704500, innerTotalRevenue: 9616800,
        productCost: 7845200, innerProfit: 1771600, outerProfit: 217800,
        innerMargin: 18.42, outerMargin: 23.62, balance: 1989400,
    },
    {
        id: 6, period: "202608", productLine: "存储服务", settlementUnit: "智汇云-系统部",
        productName: "块存储 EBS_高效云盘(计量)(ebs_disk)",
        totalRevenue: 7218900, innerRevenue: 7010400, innerNonMidRevenue: 2145700,
        midNonZyunRevenue: 62300, zyunNonUnitRevenue: 2312800, unitRevenue: 2489600,
        outerRevenue: 208500, outerGroupRevenue: 148500, outerPortalRevenue: 60000, hasOuterPortal: true,
        outerInnerPriceRevenue: 158900, innerTotalRevenue: 7169300,
        productCost: 6534100, innerProfit: 635200, outerProfit: 49600,
        innerMargin: 8.86, outerMargin: 23.79, balance: 684800,
    },
    {
        id: 7, period: "202608", productLine: "网络服务", settlementUnit: "智汇云-云平台部",
        productName: "内容分发 CDN_流量(计量)(cdn_flow)",
        totalRevenue: 6543200, innerRevenue: 4321800, innerNonMidRevenue: 1876500,
        midNonZyunRevenue: 145200, zyunNonUnitRevenue: 1200100, unitRevenue: 1100000,
        outerRevenue: 2221400, outerGroupRevenue: 1321400, outerPortalRevenue: 900000, hasOuterPortal: true,
        outerInnerPriceRevenue: 1698300, innerTotalRevenue: 6020100,
        productCost: 5612700, innerProfit: 407400, outerProfit: 523100,
        innerMargin: 6.77, outerMargin: 23.55, balance: 930500,
    },
    {
        id: 8, period: "202608", productLine: "数据库", settlementUnit: "智汇云-智能工程部",
        productName: "云数据库 PGSQL_基础版(计量)(pgsql)",
        totalRevenue: 5127400, innerRevenue: 5127400, innerNonMidRevenue: 1023400,
        midNonZyunRevenue: 34500, zyunNonUnitRevenue: 2145600, unitRevenue: 1923900,
        outerRevenue: 0, outerGroupRevenue: 0, outerPortalRevenue: 0, hasOuterPortal: false,
        outerInnerPriceRevenue: 0, innerTotalRevenue: 5127400,
        productCost: 4890200, innerProfit: 237200, outerProfit: 0,
        innerMargin: 4.63, outerMargin: 0, balance: 237200,
    },
    {
        id: 9, period: "202608", productLine: "大模型", settlementUnit: "360人工智能研究院",
        productName: "大模型服务 LLM_推理(计量)(llm_infer)",
        totalRevenue: 4312800, innerRevenue: 3105600, innerNonMidRevenue: 1502300,
        midNonZyunRevenue: 210400, zyunNonUnitRevenue: 892900, unitRevenue: 500000,
        outerRevenue: 1207200, outerGroupRevenue: 757200, outerPortalRevenue: 450000, hasOuterPortal: true,
        outerInnerPriceRevenue: 923100, innerTotalRevenue: 4028700,
        productCost: 3921500, innerProfit: 107200, outerProfit: 284100,
        innerMargin: 2.66, outerMargin: 23.53, balance: 391300,
    },
    {
        id: 10, period: "202608", productLine: "安全服务", settlementUnit: "安全技术中台",
        productName: "Web应用防火墙 WAF_标准版(waf)",
        totalRevenue: 2876500, innerRevenue: 2210300, innerNonMidRevenue: 780200,
        midNonZyunRevenue: 45600, zyunNonUnitRevenue: 684500, unitRevenue: 700000,
        outerRevenue: 666200, outerGroupRevenue: 416200, outerPortalRevenue: 250000, hasOuterPortal: true,
        outerInnerPriceRevenue: 509600, innerTotalRevenue: 2719900,
        productCost: 2401300, innerProfit: 318600, outerProfit: 156600,
        innerMargin: 11.71, outerMargin: 23.51, balance: 475200,
    },
];

// 产品分析 - 内外Portal关联的子行（外层产品行 = 各Portal对应列相加，毛利率两列除外）
interface ProductAnalysisPortalRow {
    portalName: string;             // Portal 名称
    internal: boolean;              // 是否为内部Portal
    productIdentifier: string;      // 该Portal下的产品标识（内、外Portal标识不同）
    totalRevenue: number;
    innerRevenue: number;
    innerNonMidRevenue: number;
    midNonZyunRevenue: number;
    zyunNonUnitRevenue: number;
    unitRevenue: number;
    outerGroupRevenue: number;
    outerPortalRevenue: number;
    outerInnerPriceRevenue: number;
    innerTotalRevenue: number;
    productCost: number;
    innerProfit: number;
    outerProfit: number;
    innerMargin: number;            // 各Portal单独计算，不参与外层求和
    outerMargin: number;            // 各Portal单独计算，不参与外层求和
    balance: number;
}

// 产品分析 - 取产品名称末尾的英文产品标识，如 "云服务器 ECS(cloud_server)" -> "cloud_server"
const getAnalysisIdentifier = (name: string) => {
    const m = name.match(/\(([a-z0-9_]+)\)\s*$/i);
    return m ? m[1] : "";
};

// 产品分析 - 按内外Portal拆分产品行；未关联外部Portal时返回空数组（不可展开）
// 拆分规则：内部Portal承载「公司内收入 + 集团内的外部事业部收入」，外部Portal承载「外部(360.cn)收入」；
// 外部Portal各列由「外层产品行 - 内部Portal」倒推，保证除毛利率外每列相加严格等于外层产品行。
const getAnalysisPortalRows = (row: ProductAnalysisRow): ProductAnalysisPortalRow[] => {
    if (!row.hasOuterPortal) return [];
    const base = getAnalysisIdentifier(row.productName);

    // 外部收入对应的内结算价收入：按「集团内的外部事业部 / 外部(360.cn)」收入占比拆分
    const outerTotal = row.outerGroupRevenue + row.outerPortalRevenue;
    const groupRatio = outerTotal > 0 ? row.outerGroupRevenue / outerTotal : 0;
    const innerOuterInnerPrice = row.outerInnerPriceRevenue * groupRatio;

    // 内部Portal
    const innerInnerTotal = row.innerRevenue + innerOuterInnerPrice;
    const innerCost = row.innerTotalRevenue > 0 ? row.productCost * (innerInnerTotal / row.innerTotalRevenue) : row.productCost;
    const innerProfit = innerInnerTotal - innerCost;
    const innerOuterProfit = row.outerGroupRevenue - innerOuterInnerPrice;
    const inner: ProductAnalysisPortalRow = {
        portalName: "智汇云内网门户",
        internal: true,
        productIdentifier: base ? `${base}_in` : "-",
        totalRevenue: row.innerRevenue + row.outerGroupRevenue,
        innerRevenue: row.innerRevenue,
        innerNonMidRevenue: row.innerNonMidRevenue,
        midNonZyunRevenue: row.midNonZyunRevenue,
        zyunNonUnitRevenue: row.zyunNonUnitRevenue,
        unitRevenue: row.unitRevenue,
        outerGroupRevenue: row.outerGroupRevenue,
        outerPortalRevenue: 0,
        outerInnerPriceRevenue: innerOuterInnerPrice,
        innerTotalRevenue: innerInnerTotal,
        productCost: innerCost,
        innerProfit,
        outerProfit: innerOuterProfit,
        innerMargin: innerInnerTotal > 0 ? (innerProfit / innerInnerTotal) * 100 : 0,
        outerMargin: row.outerGroupRevenue > 0 ? (innerOuterProfit / row.outerGroupRevenue) * 100 : 0,
        balance: innerProfit + innerOuterProfit,
    };

    // 外部Portal（由外层产品行倒推）
    const outerInnerTotal = row.innerTotalRevenue - inner.innerTotalRevenue;
    const outerProfitVal = row.outerProfit - inner.outerProfit;
    const outerInnerProfit = row.innerProfit - inner.innerProfit;
    const outer: ProductAnalysisPortalRow = {
        portalName: "智汇云官网(360.cn)",
        internal: false,
        productIdentifier: base ? `${base}_out` : "-",
        totalRevenue: row.totalRevenue - inner.totalRevenue,
        innerRevenue: 0,
        innerNonMidRevenue: 0,
        midNonZyunRevenue: 0,
        zyunNonUnitRevenue: 0,
        unitRevenue: 0,
        outerGroupRevenue: 0,
        outerPortalRevenue: row.outerPortalRevenue,
        outerInnerPriceRevenue: row.outerInnerPriceRevenue - inner.outerInnerPriceRevenue,
        innerTotalRevenue: outerInnerTotal,
        productCost: row.productCost - inner.productCost,
        innerProfit: outerInnerProfit,
        outerProfit: outerProfitVal,
        innerMargin: outerInnerTotal > 0 ? (outerInnerProfit / outerInnerTotal) * 100 : 0,
        outerMargin: row.outerPortalRevenue > 0 ? (outerProfitVal / row.outerPortalRevenue) * 100 : 0,
        balance: row.balance - inner.balance,
    };

    return [inner, outer];
};

// 产品分析 - 账单类型选项
const analysisBillTypes = [
    { value: "month", label: "月账单" },
    { value: "day", label: "天账单" },
    { value: "hour", label: "小时账单" },
];

// 产品分析 - 所属产线选项
const analysisProductLines = ["弹性计算", "存储服务", "网络服务", "数据库", "大模型", "安全服务"];

// 产品分析 - 结算单元选项
const analysisSettlementUnits = [
    "智汇云-云平台部",
    "智汇云-智能工程部",
    "智汇云-系统部",
    "360人工智能研究院",
    "安全技术中台",
];

// 产品分析 - 金额格式化（以「万」为单位展示）
const formatWan = (v: number) => {
    if (v === 0) return "0.00";
    return `${(v / 10000).toFixed(2)} 万`;
};

// 产品分析 - 金额精确值（tooltip 展示）
const formatExactAmount = (v: number) =>
    v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// 产品分析 - 净化产品名称展示（去除内外标识与末尾英文标识后缀，如 "(cloud_server)"）
const cleanProductName = (name: string) => name.replace(/\([a-z0-9_]+\)\s*$/i, "").trim();

// 产品分析 - 表头单元格（支持问号提示 / 重点列高亮 / 合并单元格）
const AnalysisTh = ({
    label,
    tip,
    align = "right",
    width,
    highlight = false,
    colSpan,
    rowSpan,
}: {
    label: string;
    tip?: string;
    align?: "left" | "right" | "center";
    width?: string;
    highlight?: boolean;   // 需重点说明的列：深橙底、白字
    colSpan?: number;
    rowSpan?: number;
}) => (
    <th
        style={width ? { minWidth: width } : undefined}
        colSpan={colSpan}
        rowSpan={rowSpan}
        className={`px-3 py-3 ${
            align === "left" ? "text-left" : align === "center" ? "text-center" : "text-right"
        } text-xs font-medium align-bottom ${
            highlight ? "bg-orange-500 text-white" : "text-gray-600"
        }`}
    >
        <span className={`inline-flex items-start gap-1 ${align === "left" ? "" : align === "center" ? "justify-center" : "justify-end"}`}>
            <span className="leading-[1.5]">{label}</span>
            {tip && (
                <span className="group/tip relative inline-flex flex-shrink-0 mt-[2px]">
                    <svg className={`w-3.5 h-3.5 ${highlight ? "text-white/80 hover:text-white" : "text-gray-400 hover:text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="pointer-events-none absolute top-full left-1/2 z-30 mt-1.5 hidden w-[240px] -translate-x-1/2 rounded bg-gray-700 px-2.5 py-1.5 text-left text-[12px] font-normal leading-[1.6] text-white shadow-lg group-hover/tip:block">
                        {tip}
                        <span className="absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-gray-700" />
                    </span>
                </span>
            )}
        </span>
    </th>
);

// 产品分析 - 金额单元格（悬停展示精确值，highlight 为重点列浅橙底）
const AnalysisAmountCell = ({
    value,
    link = false,
    highlight = false,
    onClick,
}: {
    value: number;
    link?: boolean;
    highlight?: boolean;
    onClick?: () => void;
}) => (
    <td className={`px-3 py-3 text-right text-sm whitespace-nowrap ${highlight ? "bg-orange-50/70" : ""}`}>
        <span
            onClick={onClick}
            className={`group/amt relative inline-block ${link ? "text-blue-600 hover:text-blue-700 cursor-pointer" : "text-gray-900"}`}
        >
            {formatWan(value)}
            <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-700 px-2.5 py-1 text-[12px] text-white shadow-lg group-hover/amt:block">
                {formatExactAmount(value)}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
            </span>
        </span>
    </td>
);

// ===== 经营分析 - 部门分析 =====
interface DepartmentAnalysisRow {
    id: number;
    opsUnit: string;        // ops结算单元名称
    bizTree: string;        // 业务树名称
    totalRevenue: number;   // 总收入(元)
    totalCost: number;      // 总成本(元)
}

const departmentAnalysisData: DepartmentAnalysisRow[] = [
    { id: 1, opsUnit: "智汇云-基础架构部", bizTree: "技术中台", totalRevenue: 0, totalCost: 105200 },
    { id: 2, opsUnit: "智汇云-系统部", bizTree: "技术中台", totalRevenue: 0, totalCost: 1584.62 },
    { id: 3, opsUnit: "智汇云-应用平台部", bizTree: "技术中台", totalRevenue: 0, totalCost: 37400 },
    { id: 4, opsUnit: "智汇云-云平台部", bizTree: "技术中台", totalRevenue: 0, totalCost: 1657600 },
    { id: 5, opsUnit: "智汇云-智能工程部", bizTree: "技术中台", totalRevenue: -76300, totalCost: 0 },
    { id: 6, opsUnit: "智汇云-系统运维部", bizTree: "技术中台", totalRevenue: 0, totalCost: 892400 },
    { id: 7, opsUnit: "智汇云-数据平台部", bizTree: "技术中台", totalRevenue: 2431.08, totalCost: 45900 },
    { id: 8, opsUnit: "智汇云-安全技术部", bizTree: "安全中台", totalRevenue: 0, totalCost: 268300 },
    { id: 9, opsUnit: "360人工智能研究院", bizTree: "人工智能研究院", totalRevenue: 431280, totalCost: 392150 },
    { id: 10, opsUnit: "智汇云-商业化产品部", bizTree: "商业化", totalRevenue: 1207200, totalCost: 923100 },
    { id: 11, opsUnit: "智汇云-交付服务部", bizTree: "商业化", totalRevenue: 0, totalCost: 78650.35 },
    { id: 12, opsUnit: "智汇云-研发效能部", bizTree: "技术中台", totalRevenue: 0, totalCost: 5420.77 },
];

// 部门分析 - 业务树选项
const departmentBizTrees = ["技术中台", "安全中台", "人工智能研究院", "商业化"];

// 部门分析 - 金额格式化（万元/元自适应）
const formatDeptAmount = (v: number) => {
    if (v === 0) return "0.00";
    if (Math.abs(v) < 10000) {
        return v.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return `${(v / 10000).toFixed(2)} 万`;
};

// 部门分析 - 金额单元格（左对齐，悬停展示精确值；link 为真时可点击查看收支明细）
const DeptAmountCell = ({ value, link = false, onClick }: { value: number; link?: boolean; onClick?: () => void }) => (
    <td className="px-4 py-4 text-left text-sm whitespace-nowrap">
        <span
            onClick={link ? onClick : undefined}
            className={`group/amt relative inline-block ${link ? "text-blue-600 hover:text-blue-700 cursor-pointer" : "text-gray-900"}`}
        >
            {formatDeptAmount(value)}
            <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded bg-gray-700 px-2.5 py-1 text-[12px] text-white shadow-lg group-hover/amt:block">
                {formatExactAmount(value)}
                <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
            </span>
        </span>
    </td>
);

// 部门分析 - 结算单元收支明细弹窗数据（按收入/成本类型拆分为若干条明细，金额之和等于汇总值）
const deptRevenueTypesByUnit: Record<string, string[]> = {
    default: ["对内结算收入", "对外销售收入", "服务分成收入"],
};
const deptCostTypesByUnit: Record<string, string[]> = {
    default: ["计算资源成本", "存储资源成本", "带宽资源成本", "人力分摊成本"],
};

const getDeptDetailRows = (
    unit: DepartmentAnalysisRow,
    tab: "revenue" | "cost",
    period: string
) => {
    const total = tab === "revenue" ? unit.totalRevenue : unit.totalCost;
    const types = tab === "revenue" ? deptRevenueTypesByUnit.default : deptCostTypesByUnit.default;
    if (total === 0) return [];

    // 按类型权重拆分总额，确保各条之和等于汇总值
    const weights = types.map((_, i) => types.length - i);
    const weightSum = weights.reduce((s, w) => s + w, 0);
    let allocated = 0;
    return types.map((type, i) => {
        const amount = i === types.length - 1
            ? total - allocated
            : Math.round((total * weights[i]) / weightSum * 100) / 100;
        allocated += amount;
        return {
            period: period.replace("-", ""),
            type,
            source: unit.opsUnit,
            amount,
        };
    });
};

// 产品分析 - 总收入明细（收入明细 Tab）数据：按「收入类型/收入来源」拆分，金额之和等于总收入
const productRevenueDetailTypes: { type: string; source: string }[] = [
    { type: "自身账单", source: "账单" },
];

const getProductRevenueDetailRows = (row: ProductAnalysisRow) => {
    const total = row.totalRevenue;
    if (total === 0) return [];
    const types = productRevenueDetailTypes;
    const weights = types.map((_, i) => types.length - i);
    const weightSum = weights.reduce((s, w) => s + w, 0);
    let allocated = 0;
    return types.map((t, i) => {
        const amount = i === types.length - 1
            ? total - allocated
            : Math.round((total * weights[i]) / weightSum * 100) / 100;
        allocated += amount;
        return { period: row.period, type: t.type, source: t.source, amount };
    });
};

// 产品分析 - 「集团内外部事业部」收入明细：按结算单元名称拆分账单
const outerGroupSettlementUnits = ["智汇云-云平台部", "智汇云-智能工程部", "智汇云-系统部"];

// 内外属性 - 枚举选项
const innerOuterAttributeOptions = ["集团内", "集团内非中台", "中台内非智汇云", "智汇云内", "集团外"];

// 「集团内的外部事业部」明细 - 各结算单元对应的内外属性
const outerGroupUnitAttributeMap: Record<string, string> = {
    "智汇云-云平台部": "智汇云内",
    "智汇云-智能工程部": "中台内非智汇云",
    "智汇云-系统部": "集团内非中台",
};

const getOuterGroupDetailRows = (row: ProductAnalysisRow) => {
    const total = row.outerGroupRevenue;
    if (total === 0) return [];
    const units = outerGroupSettlementUnits;
    const weights = units.map((_, i) => units.length - i);
    const weightSum = weights.reduce((s, w) => s + w, 0);
    let allocated = 0;
    return units.map((unitName, i) => {
        const amount = i === units.length - 1
            ? total - allocated
            : Math.round((total * weights[i]) / weightSum * 100) / 100;
        allocated += amount;
        return {
            period: row.period,
            unitName,
            attribute: outerGroupUnitAttributeMap[unitName] || innerOuterAttributeOptions[0],
            amount,
        };
    });
};

// 产品分析 - 通用结算单元账单金额明细：按结算单元名称拆分账单金额（用于各可点击收入列）
const getUnitBillDetailRows = (row: ProductAnalysisRow, amount: number) => {
    if (amount === 0) return [];
    const units = outerGroupSettlementUnits;
    const weights = units.map((_, i) => units.length - i);
    const weightSum = weights.reduce((s, w) => s + w, 0);
    let allocated = 0;
    return units.map((unitName, i) => {
        const amt = i === units.length - 1
            ? amount - allocated
            : Math.round((amount * weights[i]) / weightSum * 100) / 100;
        allocated += amt;
        return { period: row.period, unitName, amount: amt };
    });
};



// 产品分析 - 「外部(360.cn)」收入明细：按租户名称拆分账单
const outerPortalTenantNames = ["360安全云-租户A", "360政企云-租户B", "360营销云-租户C"];

const getOuterPortalDetailRows = (row: ProductAnalysisRow) => {
    const total = row.outerPortalRevenue;
    if (total === 0) return [];
    const tenants = outerPortalTenantNames;
    const weights = tenants.map((_, i) => tenants.length - i);
    const weightSum = weights.reduce((s, w) => s + w, 0);
    let allocated = 0;
    return tenants.map((tenantName, i) => {
        const amount = i === tenants.length - 1
            ? total - allocated
            : Math.round((total * weights[i]) / weightSum * 100) / 100;
        allocated += amount;
        return { period: row.period, tenantName, amount };
    });
};

// 产品分析 - 「公司内收入」明细：来源一为集团内部结算单元账单，来源二为内部结算单元账号在外部portal上
// 使用产生的费用（该费用关联回内部结算单元，计入内部收入）。仅当 hasOuterPortal 为 true 时才存在来源二。
const innerRevenuePortalUsageAccounts = ["智汇云-云平台部@外部portal账号A", "智汇云-智能工程部@外部portal账号B"];

// 来源一：集团内部结算单元账单明细
const getInnerRevenueUnitBillRows = (row: ProductAnalysisRow) => {
    const total = row.hasOuterPortal ? Math.round(row.innerRevenue * 0.8 * 100) / 100 : row.innerRevenue;
    if (total === 0) return [];
    const units = outerGroupSettlementUnits;
    const weights = units.map((_, i) => units.length - i);
    const weightSum = weights.reduce((s, w) => s + w, 0);
    let allocated = 0;
    return units.map((unitName, i) => {
        const amount = i === units.length - 1
            ? total - allocated
            : Math.round((total * weights[i]) / weightSum * 100) / 100;
        allocated += amount;
        return { period: row.period, unitName, amount };
    });
};

// 来源二：内部结算单元账号在外部portal上使用产生的费用明细（关联回内部结算单元，计入内部收入）
const getInnerRevenuePortalUsageRows = (row: ProductAnalysisRow) => {
    if (!row.hasOuterPortal) return [];
    const total = Math.round(row.innerRevenue * 0.2 * 100) / 100;
    if (total === 0) return [];
    const accounts = innerRevenuePortalUsageAccounts;
    const weights = accounts.map((_, i) => accounts.length - i);
    const weightSum = weights.reduce((s, w) => s + w, 0);
    let allocated = 0;
    return accounts.map((account, i) => {
        const amount = i === accounts.length - 1
            ? total - allocated
            : Math.round((total * weights[i]) / weightSum * 100) / 100;
        allocated += amount;
        const [unitName, portalAccount] = account.split("@");
        return { period: row.period, unitName, portalAccount, amount };
    });
};

// ===== 经营分析 - 整体分析 =====
// 整体分析行：字段与「产品分析」保持一致，数值为平台侧全部产品的合计值
interface OverallAnalysisRow {
    id: number;
    period: string;                 // 账期（按月/天/小时）
    totalRevenue: number;           // 总收入(元)
    innerRevenue: number;           // 公司内收入(元)
    innerNonMidRevenue: number;     // 公司内非中台收入(元)
    midNonZyunRevenue: number;      // 中台内非智汇云收入(元)
    zyunNonUnitRevenue: number;     // 智汇云内非本结算单元收入(元)
    unitRevenue: number;            // 本结算单元收入(元)
    outerRevenue: number;           // 公司外收入(元)
    outerInnerPriceRevenue: number; // 外部收入对应的内结算价收入(元)
    innerTotalRevenue: number;      // 内结算总收入(元)
    productCost: number;            // 产品成本(元)
    innerProfit: number;            // 内结算价利润(元)
    outerProfit: number;            // 外部利润(元)
    innerMargin: number;            // 内结算毛利率
    outerMargin: number;            // 外部毛利率
    balance: number;                // 收支差额(元)
}

// 整体分析 - 产品分析各列求和（作为单账期的基准值）
const overallBaseTotals = productAnalysisData.reduce(
    (acc, row) => ({
        totalRevenue: acc.totalRevenue + row.totalRevenue,
        innerRevenue: acc.innerRevenue + row.innerRevenue,
        innerNonMidRevenue: acc.innerNonMidRevenue + row.innerNonMidRevenue,
        midNonZyunRevenue: acc.midNonZyunRevenue + row.midNonZyunRevenue,
        zyunNonUnitRevenue: acc.zyunNonUnitRevenue + row.zyunNonUnitRevenue,
        unitRevenue: acc.unitRevenue + row.unitRevenue,
        outerRevenue: acc.outerRevenue + row.outerRevenue,
        outerInnerPriceRevenue: acc.outerInnerPriceRevenue + row.outerInnerPriceRevenue,
        innerTotalRevenue: acc.innerTotalRevenue + row.innerTotalRevenue,
        productCost: acc.productCost + row.productCost,
        innerProfit: acc.innerProfit + row.innerProfit,
        outerProfit: acc.outerProfit + row.outerProfit,
        balance: acc.balance + row.balance,
    }),
    {
        totalRevenue: 0, innerRevenue: 0, innerNonMidRevenue: 0, midNonZyunRevenue: 0,
        zyunNonUnitRevenue: 0, unitRevenue: 0, outerRevenue: 0, outerInnerPriceRevenue: 0,
        innerTotalRevenue: 0, productCost: 0, innerProfit: 0, outerProfit: 0, balance: 0,
    }
);

// 整体分析 - 稳定的伪随机波动系数（保证每次渲染结果一致）
const overallWave = (seed: number) => {
    const s = Math.sin(seed * 12.9898) * 43758.5453;
    return s - Math.floor(s); // 0 ~ 1
};

// 整体分析 - 按账期与缩放比例构造一行合计数据
const buildOverallRow = (id: number, period: string, scale: number, seed: number): OverallAnalysisRow => {
    const revFactor = scale * (0.88 + overallWave(seed) * 0.26);       // 收入波动
    const costFactor = scale * (0.9 + overallWave(seed + 77) * 0.22);  // 成本波动
    const b = overallBaseTotals;

    const totalRevenue = b.totalRevenue * revFactor;
    const innerRevenue = b.innerRevenue * revFactor;
    const outerRevenue = b.outerRevenue * revFactor;
    const outerInnerPriceRevenue = b.outerInnerPriceRevenue * revFactor;
    const innerTotalRevenue = b.innerTotalRevenue * revFactor;
    const productCost = b.productCost * costFactor;
    const innerProfit = innerTotalRevenue - productCost;
    const outerProfit = outerRevenue - outerInnerPriceRevenue;

    return {
        id,
        period,
        totalRevenue,
        innerRevenue,
        innerNonMidRevenue: b.innerNonMidRevenue * revFactor,
        midNonZyunRevenue: b.midNonZyunRevenue * revFactor,
        zyunNonUnitRevenue: b.zyunNonUnitRevenue * revFactor,
        unitRevenue: b.unitRevenue * revFactor,
        outerRevenue,
        outerInnerPriceRevenue,
        innerTotalRevenue,
        productCost,
        innerProfit,
        outerProfit,
        innerMargin: innerTotalRevenue === 0 ? 0 : (innerProfit / innerTotalRevenue) * 100,
        outerMargin: outerRevenue === 0 ? 0 : (outerProfit / outerRevenue) * 100,
        balance: innerProfit + outerProfit,
    };
};

// 整体分析 - 两位数补零
const pad2 = (n: number) => String(n).padStart(2, "0");

// 整体分析 - 月账单序列：选中月及其前 5 个月（共 6 个月，按时间正序）
const buildOverallMonthlySeries = (anchorMonth: string): OverallAnalysisRow[] => {
    const [y, m] = anchorMonth.split("-").map(Number);
    if (!y || !m) return [];
    return Array.from({ length: 6 }, (_, idx) => {
        const d = new Date(y, m - 1 - (5 - idx), 1);
        const yy = d.getFullYear();
        const mm = d.getMonth() + 1;
        return buildOverallRow(idx + 1, `${yy}${pad2(mm)}`, 1, yy * 12 + mm);
    });
};

// 整体分析 - 天账单序列：选中天及其前 29 天（共 30 天，按时间正序）
const buildOverallDailySeries = (anchorDate: string): OverallAnalysisRow[] => {
    const [y, m, d] = anchorDate.split("-").map(Number);
    if (!y || !m || !d) return [];
    return Array.from({ length: 30 }, (_, idx) => {
        const cur = new Date(y, m - 1, d - (29 - idx));
        const yy = cur.getFullYear();
        const mm = cur.getMonth() + 1;
        const dd = cur.getDate();
        return buildOverallRow(idx + 1, `${yy}${pad2(mm)}${pad2(dd)}`, 1 / 31, yy * 372 + mm * 31 + dd);
    });
};

// 整体分析 - 小时账单序列：选中天及其前 6 天的每个小时（共 7×24 = 168 个点，按时间正序）
const buildOverallHourlySeries = (anchorDate: string): OverallAnalysisRow[] => {
    const [y, m, d] = anchorDate.split("-").map(Number);
    if (!y || !m || !d) return [];
    const rows: OverallAnalysisRow[] = [];
    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        const cur = new Date(y, m - 1, d - dayOffset);
        const yy = cur.getFullYear();
        const mm = cur.getMonth() + 1;
        const dd = cur.getDate();
        for (let h = 0; h < 24; h++) {
            rows.push(
                buildOverallRow(
                    rows.length + 1,
                    `${yy}${pad2(mm)}${pad2(dd)} ${pad2(h)}:00`,
                    1 / (31 * 24),
                    yy * 8928 + mm * 744 + dd * 24 + h
                )
            );
        }
    }
    return rows;
};

// 整体分析 - 根据账单类型与账期取数据源（图表/列表共用，按时间正序）
const getOverallDataset = (billType: string, period: string) => {
    if (billType === "day") return buildOverallDailySeries(period);
    if (billType === "hour") return buildOverallHourlySeries(period);
    return buildOverallMonthlySeries(period);
};

// 整体分析 - 账期短标签（图表 X 轴展示）
const overallShortLabel = (period: string, billType: string) => {
    if (billType === "hour") {
        const [datePart, timePart] = period.split(" ");
        return `${Number(datePart.slice(6, 8))}日${(timePart ?? "").slice(0, 2)}时`;
    }
    if (billType === "day") return `${Number(period.slice(4, 6))}/${Number(period.slice(6, 8))}`;
    return `${Number(period.slice(0, 4))}/${Number(period.slice(4, 6))}`;
};

// 整体分析 - 曲线图例项 key
type OverallSeriesKey = "revenue" | "cost" | "innerMargin" | "outerMargin";

// 整体分析 - 收入/成本 + 毛利率双坐标曲线图（纯 SVG 实现，无第三方依赖）
// 主坐标（左）：总收入、总成本(元)；次坐标（右）：内结算毛利率、外部毛利率(%)
// 图例支持点击显隐对应曲线，默认仅展示「总收入」「总成本」两条曲线
const OverallTrendChart = ({
    rows,
    billType,
}: {
    rows: OverallAnalysisRow[];
    billType: string;
}) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    // 曲线显隐状态：默认仅展示总收入、总成本
    const [visible, setVisible] = useState<Record<OverallSeriesKey, boolean>>({
        revenue: true,
        cost: true,
        innerMargin: false,
        outerMargin: false,
    });
    const toggleSeries = (key: OverallSeriesKey) =>
        setVisible((prev) => ({ ...prev, [key]: !prev[key] }));

    // 画布尺寸与内边距（右侧留出次坐标轴刻度空间）
    const W = 960;
    const H = 320;
    const padL = 74;
    const padR = 62;
    const padT = 20;
    const padB = 44;
    const innerW = W - padL - padR;
    const innerH = H - padT - padB;

    if (rows.length === 0) {
        return <div className="flex h-[320px] items-center justify-center text-sm text-gray-400">暂无数据</div>;
    }

    const revenues = rows.map((r) => r.totalRevenue);
    const costs = rows.map((r) => r.productCost);
    const innerMargins = rows.map((r) => r.innerMargin);
    const outerMargins = rows.map((r) => r.outerMargin);

    // 主坐标（金额）上限，向上取整到「整齐」刻度
    const maxVal = Math.max(...revenues, ...costs, 1);
    const step = Math.pow(10, Math.floor(Math.log10(maxVal))) / 2;
    const yMax = Math.ceil(maxVal / step) * step;

    // 次坐标（毛利率）范围，按 10% 为一档向外取整
    const marginValues = [...innerMargins, ...outerMargins];
    const rawMin = Math.min(...marginValues, 0);
    const rawMax = Math.max(...marginValues, 0);
    const pMin = Math.floor(rawMin / 10) * 10;
    const pMax = Math.max(Math.ceil(rawMax / 10) * 10, pMin + 10);

    const xAt = (i: number) => (rows.length === 1 ? padL + innerW / 2 : padL + (innerW * i) / (rows.length - 1));
    const yAt = (v: number) => padT + innerH - (v / yMax) * innerH;                       // 主坐标
    const yPct = (v: number) => padT + innerH - ((v - pMin) / (pMax - pMin)) * innerH;    // 次坐标

    const toPolyline = (values: number[], mapper: (v: number) => number) =>
        values.map((v, i) => `${xAt(i)},${mapper(v)}`).join(" ");
    const toAreaPath = (values: number[]) =>
        `M ${xAt(0)},${padT + innerH} ` +
        values.map((v, i) => `L ${xAt(i)},${yAt(v)}`).join(" ") +
        ` L ${xAt(values.length - 1)},${padT + innerH} Z`;

    // 5 等分网格线（主/次坐标共用同一批横线）
    const tickCount = 5;
    const ticks = Array.from({ length: tickCount + 1 }, (_, i) => i);
    // X 轴标签抽稀，避免拥挤
    const labelStride = Math.max(1, Math.ceil(rows.length / 12));
    // 数据点较多时不再绘制圆点，避免视觉噪音
    const showDots = rows.length <= 40;

    return (
        <div className="relative">
            {/* 图例：点击可显示/隐藏对应曲线，默认仅展示总收入、总成本 */}
            <div className="mb-2 flex flex-wrap items-center gap-5 px-1">
                <button
                    type="button"
                    onClick={() => toggleSeries("revenue")}
                    className={`inline-flex items-center gap-1.5 text-[12px] transition-opacity ${visible.revenue ? "text-gray-600" : "text-gray-300"}`}
                >
                    <span className={`inline-block h-[3px] w-4 rounded-full bg-[#0f73f6] ${visible.revenue ? "" : "opacity-30"}`} />
                    总收入
                </button>
                <button
                    type="button"
                    onClick={() => toggleSeries("cost")}
                    className={`inline-flex items-center gap-1.5 text-[12px] transition-opacity ${visible.cost ? "text-gray-600" : "text-gray-300"}`}
                >
                    <span className={`inline-block h-[3px] w-4 rounded-full bg-[#f5a623] ${visible.cost ? "" : "opacity-30"}`} />
                    总成本
                </button>
                <button
                    type="button"
                    onClick={() => toggleSeries("innerMargin")}
                    className={`inline-flex items-center gap-1.5 text-[12px] transition-opacity ${visible.innerMargin ? "text-gray-600" : "text-gray-300"}`}
                >
                    <span className={`inline-block h-0 w-4 border-t-2 border-dashed border-[#22b07d] ${visible.innerMargin ? "" : "opacity-30"}`} />
                    内结算毛利率
                </button>
                <button
                    type="button"
                    onClick={() => toggleSeries("outerMargin")}
                    className={`inline-flex items-center gap-1.5 text-[12px] transition-opacity ${visible.outerMargin ? "text-gray-600" : "text-gray-300"}`}
                >
                    <span className={`inline-block h-0 w-4 border-t-2 border-dashed border-[#9254de] ${visible.outerMargin ? "" : "opacity-30"}`} />
                    外部毛利率
                </button>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 320 }} preserveAspectRatio="none">
                <defs>
                    <linearGradient id="overallRevFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0f73f6" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#0f73f6" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="overallCostFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f5a623" stopOpacity="0.16" />
                        <stop offset="100%" stopColor="#f5a623" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* 横向网格线 + 左侧金额刻度 + 右侧毛利率刻度 */}
                {ticks.map((t) => {
                    const y = padT + innerH - (innerH * t) / tickCount;
                    return (
                        <g key={`tick-${t}`}>
                            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#eef0f3" strokeWidth={1} />
                            <text x={padL - 10} y={y + 4} textAnchor="end" className="fill-gray-400" style={{ fontSize: 11 }}>
                                {((yMax / tickCount) * t / 10000).toFixed(0)} 万
                            </text>
                            <text x={W - padR + 10} y={y + 4} textAnchor="start" className="fill-gray-400" style={{ fontSize: 11 }}>
                                {(pMin + ((pMax - pMin) / tickCount) * t).toFixed(0)}%
                            </text>
                        </g>
                    );
                })}

                {/* 主坐标：面积 + 折线（按图例显隐控制渲染） */}
                {visible.revenue && <path d={toAreaPath(revenues)} fill="url(#overallRevFill)" />}
                {visible.cost && <path d={toAreaPath(costs)} fill="url(#overallCostFill)" />}
                {visible.revenue && (
                    <polyline points={toPolyline(revenues, yAt)} fill="none" stroke="#0f73f6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                )}
                {visible.cost && (
                    <polyline points={toPolyline(costs, yAt)} fill="none" stroke="#f5a623" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
                )}

                {/* 次坐标：毛利率折线（虚线区分，按图例显隐控制渲染） */}
                {visible.innerMargin && (
                    <polyline points={toPolyline(innerMargins, yPct)} fill="none" stroke="#22b07d" strokeWidth={2} strokeDasharray="5 4" strokeLinejoin="round" strokeLinecap="round" />
                )}
                {visible.outerMargin && (
                    <polyline points={toPolyline(outerMargins, yPct)} fill="none" stroke="#9254de" strokeWidth={2} strokeDasharray="5 4" strokeLinejoin="round" strokeLinecap="round" />
                )}

                {/* 数据点 */}
                {rows.map((r, i) =>
                    showDots || activeIndex === i ? (
                        <g key={`pt-${i}`}>
                            {visible.revenue && <circle cx={xAt(i)} cy={yAt(r.totalRevenue)} r={activeIndex === i ? 4.5 : 2.5} fill="#fff" stroke="#0f73f6" strokeWidth={2} />}
                            {visible.cost && <circle cx={xAt(i)} cy={yAt(r.productCost)} r={activeIndex === i ? 4.5 : 2.5} fill="#fff" stroke="#f5a623" strokeWidth={2} />}
                            {visible.innerMargin && <circle cx={xAt(i)} cy={yPct(r.innerMargin)} r={activeIndex === i ? 4.5 : 2.5} fill="#fff" stroke="#22b07d" strokeWidth={2} />}
                            {visible.outerMargin && <circle cx={xAt(i)} cy={yPct(r.outerMargin)} r={activeIndex === i ? 4.5 : 2.5} fill="#fff" stroke="#9254de" strokeWidth={2} />}
                        </g>
                    ) : null
                )}

                {/* X 轴标签 */}
                {rows.map((r, i) =>
                    i % labelStride === 0 ? (
                        <text key={`lb-${i}`} x={xAt(i)} y={H - padB + 20} textAnchor="middle" className="fill-gray-400" style={{ fontSize: 11 }}>
                            {overallShortLabel(r.period, billType)}
                        </text>
                    ) : null
                )}

                {/* 悬停高亮竖线 */}
                {activeIndex !== null && (
                    <line x1={xAt(activeIndex)} y1={padT} x2={xAt(activeIndex)} y2={padT + innerH} stroke="#c9d3e0" strokeWidth={1} strokeDasharray="4 3" />
                )}

                {/* 悬停热区 */}
                {rows.map((_, i) => {
                    const bandW = innerW / Math.max(rows.length - 1, 1);
                    return (
                        <rect
                            key={`hit-${i}`}
                            x={xAt(i) - bandW / 2}
                            y={padT}
                            width={bandW}
                            height={innerH}
                            fill="transparent"
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseLeave={() => setActiveIndex(null)}
                        />
                    );
                })}
            </svg>

            {/* 悬停浮层 */}
            {activeIndex !== null && (
                <div
                    className={`pointer-events-none absolute top-10 z-20 min-w-[210px] rounded-md bg-gray-700/95 px-3 py-2 text-[12px] leading-[1.8] text-white shadow-lg ${
                        xAt(activeIndex) / W > 0.6 ? "-translate-x-full" : ""
                    }`}
                    style={{
                        left: `calc(${(xAt(activeIndex) / W) * 100}% ${xAt(activeIndex) / W > 0.6 ? "-" : "+"} 12px)`,
                    }}
                >
                    <div className="mb-0.5 font-medium">{rows[activeIndex].period}</div>
                    {visible.revenue && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-white/70">总收入</span>
                            <span>{formatExactAmount(rows[activeIndex].totalRevenue)}</span>
                        </div>
                    )}
                    {visible.cost && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-white/70">总成本</span>
                            <span>{formatExactAmount(rows[activeIndex].productCost)}</span>
                        </div>
                    )}
                    {visible.innerMargin && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-white/70">内结算毛利率</span>
                            <span>{rows[activeIndex].innerMargin.toFixed(2)}%</span>
                        </div>
                    )}
                    {visible.outerMargin && (
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-white/70">外部毛利率</span>
                            <span>{rows[activeIndex].outerMargin.toFixed(2)}%</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 兼容旧代码的别名
const productsData = zhihuiProductsData;

// 产品分类选项
const productCategories = [
    { value: "all", label: "全部产品分类" },
    { value: "大数据", label: "大数据" },
    { value: "存储", label: "存储" },
    { value: "数据库", label: "数据库" },
    { value: "容器", label: "容器" },
    { value: "中间件", label: "中间件" },
];

// 产品状态选项
const productStatuses = [
    { value: "all", label: "全部上线状态" },
    { value: "online", label: "已上线" },
    { value: "offline", label: "已下线" },
];

// 所有可用模型列表
const ALL_MODELS = [
    { id: 'doubao-pro', name: '豆包Pro', description: '高性能通用大模型' },
    { id: 'doubao-lite', name: '豆包Lite', description: '轻量级快速响应模型' },
    { id: 'deepseek-chat', name: 'DeepSeek', description: '深度求索对话模型' },
    { id: 'kimi', name: 'Kimi', description: '月之暗面长文本模型' },
];

// Tab配置
const adminTabs = [
    { id: "packages", name: "套餐管理", icon: "package" },
    { id: "models", name: "AI计划管理", icon: "cpu" },
];

// 密钥管理 - 对接类型
type AccessKeyType = "internal" | "thirdparty";

// 密钥管理 - 授权范围：全部接口 / 指定接口
type AccessKeyScope = "all" | "specified";

// 密钥管理 - 指定接口项（记录接口所属系统，支持跨系统选择）
interface SpecifiedApiItem {
    apiId: string; // 接口ID
    systemId: string; // 所属系统/产品ID
}

// 密钥管理 - 密钥数据结构
interface AccessKey {
    id: number;
    name: string; // 密钥名称
    subject: string; // 对接方名称(谁接)
    type: AccessKeyType; // 对接系统(接谁)：智汇云平台/智汇云产品
    scope: AccessKeyScope; // 授权范围：全部接口 / 指定接口
    productId?: string; // 当对接系统为「智汇云产品」时，记录所选产品ID
    products?: KeyProduct[]; // 支持多个产品
    ipWhitelist: string[]; // 绑定IP白名单
    apiPath: string; // 对接接口（路径文本，展示用）
    apiIds?: string[]; // 对接接口ID列表（与系统间对接API接口列表联动）
    permission?: "read" | "readwrite" | "manage"; // 权限类型：只读 / 读写 / 管理(含删除、超管)
    remark: string; // 备注
    ak: string; // Access Key
    sk: string; // Secret Key（脱敏展示）
    status: "active" | "inactive"; // 启用/停用
    createTime: string; // 创建时间
    updateTime: string; // 最近一次更新时间
}

// 密钥管理 - 所属系统（智汇云平台 / 智汇云产品，用于对接服务选择）
interface KeyProduct {
    id: string;
    name: string; // 系统/产品名称
    identifier: string; // 系统/产品标识
    category: string; // 分类
    systemType: "platform" | "product"; // 所属系统大类：智汇云平台 / 智汇云产品
}

// 密钥管理 - 所属系统列表mock数据（智汇云平台 + 智汇云产品）
const keyProductsData: KeyProduct[] = [
    // 智汇云平台
    { id: "plat-billing", name: "计费平台", identifier: "billing", category: "平台", systemType: "platform" },
    { id: "plat-zyunuc", name: "统一账号 zyunuc", identifier: "zyunuc", category: "平台", systemType: "platform" },
    { id: "plat-bazhuayu", name: "八爪鱼调度平台", identifier: "bazhuayu", category: "平台", systemType: "platform" },
    { id: "plat-monitor", name: "统一监控平台", identifier: "monitor", category: "平台", systemType: "platform" },
    { id: "plat-console", name: "云控制台", identifier: "console", category: "平台", systemType: "platform" },
    // 智汇云产品
    { id: "prod-ecs", name: "云服务器 ECS", identifier: "ecs", category: "计算", systemType: "product" },
    { id: "prod-oss", name: "对象存储 OSS", identifier: "oss", category: "存储", systemType: "product" },
    { id: "prod-rds", name: "云数据库 RDS", identifier: "rds", category: "数据库", systemType: "product" },
    { id: "prod-slb", name: "负载均衡 SLB", identifier: "slb", category: "网络", systemType: "product" },
    { id: "prod-vpc", name: "专有网络 VPC", identifier: "vpc", category: "网络", systemType: "product" },
    { id: "prod-cdn", name: "内容分发 CDN", identifier: "cdn", category: "网络", systemType: "product" },
    { id: "prod-k8s", name: "容器服务 K8s", identifier: "k8s", category: "容器", systemType: "product" },
    { id: "prod-redis", name: "云缓存 Redis", identifier: "redis", category: "数据库", systemType: "product" },
];

// 密钥管理 - 智汇云平台系统列表（计费 / zyunuc / 八爪鱼）
interface PlatformSystem {
    id: string;
    name: string; // 系统名称
    identifier: string; // 系统标识
}
const platformSystemsData: PlatformSystem[] = [
    { id: "sys-billing", name: "计费", identifier: "billing" },
    { id: "sys-zyunuc", name: "zyunuc", identifier: "zyunuc" },
    { id: "sys-bazhuayu", name: "八爪鱼", identifier: "bazhuayu" },
];

// 密钥管理 - 可选择的接口数据结构
interface ApiInterface {
    id: string;
    productId: string; // 所属产品ID
    name: string; // 接口名称
    path: string; // 接口路径
    method: "GET" | "POST" | "PUT" | "DELETE";
    group: string; // 所属分组/服务
    description: string; // 接口描述
    permission?: "read" | "readwrite" | "manage"; // 权限类型：只读 / 读写 / 管理(含删除、超管)
    createdAt?: string; // 创建时间
    updatedAt?: string; // 编辑时间
}

// 根据接口ID生成稳定的mock时间（创建时间/编辑时间），保证同一接口每次渲染时间一致
const getApiMockTimes = (id: string): { createdAt: string; updatedAt: string } => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = (hash * 31 + id.charCodeAt(i)) & 0x7fffffff;
    }
    const base = new Date(2024, 0, 1).getTime();
    const createdOffset = (hash % 300) * 24 * 60 * 60 * 1000; // 0~300天
    const createdTime = base + createdOffset;
    const updatedTime = createdTime + ((hash % 60) + 1) * 24 * 60 * 60 * 1000; // 创建后1~60天
    const fmt = (t: number) => {
        const d = new Date(t);
        const p = (n: number) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
    };
    return { createdAt: fmt(createdTime), updatedAt: fmt(updatedTime) };
};

// 密钥管理 - 可选择接口mock数据（按产品归属）
const apiInterfacesData: ApiInterface[] = [
    // 云服务器 ECS
    { id: "ecs-1", productId: "prod-ecs", name: "查询实例列表", path: "/api/v1/ecs/instances", method: "GET", group: "实例管理", description: "分页查询ECS实例列表" },
    { id: "ecs-2", productId: "prod-ecs", name: "创建实例", path: "/api/v1/ecs/instances", method: "POST", group: "实例管理", description: "创建一台新的ECS实例" },
    { id: "ecs-3", productId: "prod-ecs", name: "启动实例", path: "/api/v1/ecs/instances/{id}/start", method: "POST", group: "实例操作", description: "启动指定的ECS实例" },
    { id: "ecs-4", productId: "prod-ecs", name: "停止实例", path: "/api/v1/ecs/instances/{id}/stop", method: "POST", group: "实例操作", description: "停止指定的ECS实例" },
    { id: "ecs-5", productId: "prod-ecs", name: "删除实例", path: "/api/v1/ecs/instances/{id}", method: "DELETE", group: "实例管理", description: "释放指定的ECS实例" },
    // 对象存储 OSS
    { id: "oss-1", productId: "prod-oss", name: "查询存储桶列表", path: "/api/v1/oss/buckets", method: "GET", group: "存储桶管理", description: "查询所有存储桶" },
    { id: "oss-2", productId: "prod-oss", name: "创建存储桶", path: "/api/v1/oss/buckets", method: "POST", group: "存储桶管理", description: "创建一个新的存储桶" },
    { id: "oss-3", productId: "prod-oss", name: "上传文件", path: "/api/v1/oss/objects/upload", method: "POST", group: "文件操作", description: "上传文件到对象存储" },
    { id: "oss-4", productId: "prod-oss", name: "下载文件", path: "/api/v1/oss/objects/{id}", method: "GET", group: "文件操作", description: "根据ID下载文件" },
    // 云数据库 RDS
    { id: "rds-1", productId: "prod-rds", name: "查询数据库实例", path: "/api/v1/rds/instances", method: "GET", group: "实例管理", description: "查询RDS实例列表" },
    { id: "rds-2", productId: "prod-rds", name: "创建数据库实例", path: "/api/v1/rds/instances", method: "POST", group: "实例管理", description: "创建一个RDS实例" },
    { id: "rds-3", productId: "prod-rds", name: "查询备份列表", path: "/api/v1/rds/backups", method: "GET", group: "备份管理", description: "查询数据库备份记录" },
    { id: "rds-4", productId: "prod-rds", name: "创建备份", path: "/api/v1/rds/backups", method: "POST", group: "备份管理", description: "手动创建数据库备份" },
    // 负载均衡 SLB
    { id: "slb-1", productId: "prod-slb", name: "查询负载均衡列表", path: "/api/v1/slb/instances", method: "GET", group: "实例管理", description: "查询SLB实例列表" },
    { id: "slb-2", productId: "prod-slb", name: "创建负载均衡", path: "/api/v1/slb/instances", method: "POST", group: "实例管理", description: "创建一个SLB实例" },
    { id: "slb-3", productId: "prod-slb", name: "配置监听规则", path: "/api/v1/slb/listeners", method: "POST", group: "监听配置", description: "为SLB配置监听规则" },
    // 专有网络 VPC
    { id: "vpc-1", productId: "prod-vpc", name: "查询VPC列表", path: "/api/v1/vpc/networks", method: "GET", group: "网络管理", description: "查询专有网络列表" },
    { id: "vpc-2", productId: "prod-vpc", name: "创建VPC", path: "/api/v1/vpc/networks", method: "POST", group: "网络管理", description: "创建一个专有网络" },
    { id: "vpc-3", productId: "prod-vpc", name: "查询交换机", path: "/api/v1/vpc/switches", method: "GET", group: "子网管理", description: "查询VPC下的交换机" },
    // 内容分发 CDN
    { id: "cdn-1", productId: "prod-cdn", name: "查询加速域名", path: "/api/v1/cdn/domains", method: "GET", group: "域名管理", description: "查询CDN加速域名列表" },
    { id: "cdn-2", productId: "prod-cdn", name: "添加加速域名", path: "/api/v1/cdn/domains", method: "POST", group: "域名管理", description: "添加一个加速域名" },
    { id: "cdn-3", productId: "prod-cdn", name: "刷新缓存", path: "/api/v1/cdn/refresh", method: "POST", group: "缓存管理", description: "刷新CDN缓存" },
    // 容器服务 K8s
    { id: "k8s-1", productId: "prod-k8s", name: "查询集群列表", path: "/api/v1/k8s/clusters", method: "GET", group: "集群管理", description: "查询K8s集群列表" },
    { id: "k8s-2", productId: "prod-k8s", name: "创建集群", path: "/api/v1/k8s/clusters", method: "POST", group: "集群管理", description: "创建一个K8s集群" },
    { id: "k8s-3", productId: "prod-k8s", name: "查询节点列表", path: "/api/v1/k8s/nodes", method: "GET", group: "节点管理", description: "查询集群节点列表" },
    // 云缓存 Redis
    { id: "redis-1", productId: "prod-redis", name: "查询缓存实例", path: "/api/v1/redis/instances", method: "GET", group: "实例管理", description: "查询Redis实例列表" },
    { id: "redis-2", productId: "prod-redis", name: "创建缓存实例", path: "/api/v1/redis/instances", method: "POST", group: "实例管理", description: "创建一个Redis实例" },
    { id: "redis-3", productId: "prod-redis", name: "清空缓存", path: "/api/v1/redis/flush", method: "POST", group: "缓存操作", description: "清空指定实例的缓存" },
    // 计费平台
    { id: "billing-1", productId: "plat-billing", name: "查询账单列表", path: "/api/v1/billing/bills", method: "GET", group: "账单管理", description: "分页查询账单列表" },
    { id: "billing-2", productId: "plat-billing", name: "查询计费项", path: "/api/v1/billing/items", method: "GET", group: "计费配置", description: "查询产品计费项" },
    { id: "billing-3", productId: "plat-billing", name: "发起扣费", path: "/api/v1/billing/charge", method: "POST", group: "扣费管理", description: "对指定账户发起扣费" },
    { id: "billing-4", productId: "plat-billing", name: "查询余额", path: "/api/v1/billing/balance", method: "GET", group: "账户管理", description: "查询账户余额" },
    // 统一账号 zyunuc
    { id: "zyunuc-1", productId: "plat-zyunuc", name: "查询用户信息", path: "/api/v1/uc/users/{id}", method: "GET", group: "用户管理", description: "根据ID查询用户信息" },
    { id: "zyunuc-2", productId: "plat-zyunuc", name: "查询组织架构", path: "/api/v1/uc/orgs", method: "GET", group: "组织管理", description: "查询企业组织架构" },
    { id: "zyunuc-3", productId: "plat-zyunuc", name: "校验登录态", path: "/api/v1/uc/session/verify", method: "POST", group: "认证管理", description: "校验用户登录态" },
    // 八爪鱼调度平台
    { id: "bazhuayu-1", productId: "plat-bazhuayu", name: "查询任务列表", path: "/api/v1/octopus/tasks", method: "GET", group: "任务管理", description: "查询调度任务列表" },
    { id: "bazhuayu-2", productId: "plat-bazhuayu", name: "创建调度任务", path: "/api/v1/octopus/tasks", method: "POST", group: "任务管理", description: "创建一个调度任务" },
    { id: "bazhuayu-3", productId: "plat-bazhuayu", name: "触发任务执行", path: "/api/v1/octopus/tasks/{id}/run", method: "POST", group: "任务操作", description: "手动触发任务执行" },
    // 统一监控平台
    { id: "monitor-1", productId: "plat-monitor", name: "查询监控指标", path: "/api/v1/monitor/metrics", method: "GET", group: "指标管理", description: "查询监控指标数据" },
    { id: "monitor-2", productId: "plat-monitor", name: "查询告警列表", path: "/api/v1/monitor/alerts", method: "GET", group: "告警管理", description: "查询告警记录列表" },
    { id: "monitor-3", productId: "plat-monitor", name: "创建告警规则", path: "/api/v1/monitor/rules", method: "POST", group: "告警管理", description: "创建一条告警规则" },
    // 云控制台
    { id: "console-1", productId: "plat-console", name: "查询菜单权限", path: "/api/v1/console/menus", method: "GET", group: "权限管理", description: "查询控制台菜单权限" },
    { id: "console-2", productId: "plat-console", name: "查询操作日志", path: "/api/v1/console/logs", method: "GET", group: "日志管理", description: "查询控制台操作日志" },
];

// 密钥管理 - mock数据
const accessKeysData: AccessKey[] = [
    {
        id: 1,
        name: "内部风控服务密钥",
        subject: "风控中心",
        type: "internal",
        scope: "all",
        ipWhitelist: ["10.12.34.56", "10.12.34.57"],
        apiPath: "/api/v1/risk/check",
        permission: "readwrite",
        remark: "风控系统对接，仅限内网调用",
        ak: "MOCK_AK_8f2a9d3c7b1e6054",
        sk: "MOCK_SK_3b7e1f9a2c8d4065e1a9b3c7d2f8e4a6",
        status: "active",
        createTime: "2026-06-15 10:23:45",
        updateTime: "2026-07-28 09:15:02",
    },
    {
        id: 2,
        name: "OSS-对象存储对接",
        subject: "腾讯云计算（北京）有限责任公司",
        type: "thirdparty",
        productId: "prod-oss",
        scope: "specified",
        ipWhitelist: ["119.28.45.123"],
        apiPath: "/api/v1/partner/sync",
        permission: "read",
        remark: "对象存储 OSS 数据同步对接，按月结算",
        ak: "MOCK_AK_2c4e6b8a0d1f3579",
        sk: "MOCK_SK_9a1c3e5b7d2f4068e3a1b5c9d7f2e4a8",
        status: "active",
        createTime: "2026-06-20 14:08:32",
        updateTime: "2026-07-15 11:42:18",
    },
    {
        id: 3,
        name: "内部计费网关密钥",
        subject: "计费平台",
        type: "internal",
        scope: "all",
        ipWhitelist: ["10.0.0.0/24"],
        apiPath: "/api/v1/billing/charge",
        permission: "manage",
        remark: "",
        ak: "MOCK_AK_5d7f9b1c3e2a4068",
        sk: "MOCK_SK_6b8d0f2a4c1e3079b5d7f9a1c3e2b4d6",
        status: "inactive",
        createTime: "2026-05-10 09:56:18",
        updateTime: "2026-07-30 17:20:43",
    },
    {
        id: 4,
        name: "ECS-云服务器对接",
        subject: "北京字节跳动科技有限公司",
        type: "thirdparty",
        productId: "prod-ecs",
        scope: "specified",
        ipWhitelist: ["180.97.23.12", "180.97.23.13"],
        apiPath: "/api/v1/ecs/instances, /api/v1/ecs/instances/{id}/start, /api/v1/ecs/instances/{id}/stop",
        apiIds: ["ecs-1", "ecs-3", "ecs-4"],
        permission: "readwrite",
        remark: "云服务器 ECS 接口对接",
        ak: "MOCK_AK_7e9c1b3a5d8f2046",
        sk: "MOCK_SK_4c6e8a0b2d1f3057a9c7e1b3d5f8a2c4",
        status: "active",
        createTime: "2026-07-02 16:45:21",
        updateTime: "2026-07-25 14:08:55",
    },
];

// 获取菜单图标
const getTabIcon = (icon: string, className: string = "w-5 h-5") => {
    switch (icon) {
        case "chart":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            );
        case "users":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            );
        case "package":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            );
        case "cpu":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            );
        case "bot":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            );
        case "key":
            return (
                <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 7v10m0 0l-3 3m3-3l3 3" />
                </svg>
            );
        default:
            return null;
    }
};

// ===== 平台配置 - 企业配置：可选租户（输入租户ID检索） =====
type EnterpriseTenantOption = { id: string; name: string };
const enterpriseTenantOptions: EnterpriseTenantOption[] = [
    { id: '100000001', name: '奇虎360' },
    { id: '100000002', name: '360智汇云' },
    { id: '100000003', name: '360人工智能部' },
    { id: '100000004', name: '360政企安全' },
    { id: '100000005', name: '360数科' },
    { id: '100000006', name: '360企业安全集团' },
];

// 企业配置 - 租户下的组织架构（部门树）
// units：该部门在 ops 侧已关联的结算单元（一个部门可关联 N 个结算单元），有值即代表「已关联结算单元」
type OrgDeptNode = { id: string; name: string; units?: string[]; children?: OrgDeptNode[] };
const tenantOrgTrees: Record<string, OrgDeptNode[]> = {
    '100000001': [
        {
            id: 'd-1', name: '技术中台', children: [
                { id: 'd-1-1', name: '智汇云事业部', units: ['智汇云-应用平台部', '智汇云-商业化产品部'], children: [
                    { id: 'd-1-1-1', name: '云平台部', units: ['智汇云-云平台部', '智汇云-系统运维部'] },
                    { id: 'd-1-1-2', name: '基础架构部', units: ['智汇云-基础架构部'] },
                    { id: 'd-1-1-3', name: '产品运营部' },
                ] },
                { id: 'd-1-2', name: '系统部', units: ['智汇云-系统部'] },
                { id: 'd-1-3', name: '效能平台部' },
            ]
        },
        {
            id: 'd-2', name: '安全中台', children: [
                { id: 'd-2-1', name: '安全大脑研发部', units: ['智汇云-安全技术部'] },
                { id: 'd-2-2', name: '威胁情报部' },
            ]
        },
        { id: 'd-3', name: '人工智能研究院', units: ['360人工智能研究院'] },
    ],
    '100000002': [
        {
            id: 'z-1', name: '智汇云', children: [
                { id: 'z-1-1', name: '云平台部', units: ['智汇云-云平台部'] },
                { id: 'z-1-2', name: '智能工程部', units: ['智汇云-智能工程部', '智汇云-数据平台部'] },
                { id: 'z-1-3', name: '系统运维部', units: ['智汇云-系统运维部', '智汇云-研发效能部'] },
                { id: 'z-1-4', name: '市场部' },
            ]
        },
    ],
    '100000003': [
        {
            id: 'a-1', name: '人工智能研究院', children: [
                { id: 'a-1-1', name: '大模型算法部', units: ['360人工智能研究院'] },
                { id: 'a-1-2', name: 'AI工程部', units: ['智汇云-智能工程部'] },
                { id: 'a-1-3', name: '数据标注部' },
            ]
        },
    ],
    '100000004': [
        {
            id: 's-1', name: '政企安全集团', children: [
                { id: 's-1-1', name: '解决方案部', units: ['智汇云-安全技术部', '智汇云-交付服务部'] },
                { id: 's-1-2', name: '交付服务部' },
            ]
        },
    ],
};
// 未配置组织架构的租户使用的默认部门树
const defaultTenantOrgTree: OrgDeptNode[] = [
    {
        id: 'def-1', name: '总部', children: [
            { id: 'def-1-1', name: '技术部', units: ['智汇云-基础架构部'] },
            { id: 'def-1-2', name: 'business部' },
        ]
    },
];
const getTenantOrgTree = (tenantId: string): OrgDeptNode[] =>
    tenantOrgTrees[tenantId] || defaultTenantOrgTree;

// 在部门树中按 id 定位节点
const findOrgNode = (nodes: OrgDeptNode[], id: string): OrgDeptNode | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        const hit = node.children ? findOrgNode(node.children, id) : null;
        if (hit) return hit;
    }
    return null;
};

// 收集某个经营部门（含自身）下所有「已关联结算单元」的部门；path 为从经营部门起的层级路径
type LinkedDept = { id: string; name: string; path: string; units: string[] };
const collectLinkedDepts = (root: OrgDeptNode): LinkedDept[] => {
    const result: LinkedDept[] = [];
    const walk = (node: OrgDeptNode, ancestors: string[]) => {
        if (node.units?.length) {
            result.push({
                id: node.id,
                name: node.name,
                path: [...ancestors, node.name].join(' / '),
                units: node.units,
            });
        }
        node.children?.forEach((child) => walk(child, [...ancestors, node.name]));
    };
    walk(root, []);
    return result;
};

// 租户数据
const tenantsData = [
    {
        id: 1,
        name: "腾讯科技",
        totalPaid: 2567890,
        monthlyPackageName: "企业版月包",
        payStatus: "paid",
        memberUsed: 118,
        memberTotal: 128,
        amountUsed: 1890456,
        amountTotal: 2000000,
        lobsterCount: { normal: 23, total: 25 },
        createTime: "2024-01-15 10:23:45",
        lastAccessTime: "2025-01-10 14:32:18",
        members: [
            { id: 1, name: "张三", accountId: "zhangsan", role: "管理员", quota: 100000, usedQuota: 45678, status: "active" },
            { id: 2, name: "李四", accountId: "lisi", role: "成员", quota: 50000, usedQuota: 12345, status: "active" },
            { id: 3, name: "王五", accountId: "wangwu", role: "成员", quota: 50000, usedQuota: 8765, status: "active" },
            { id: 4, name: "赵六", accountId: "zhaoliu", role: "成员", quota: 30000, usedQuota: 5678, status: "inactive" },
        ]
    },
    {
        id: 2,
        name: "阿里巴巴",
        totalPaid: 1987654,
        monthlyPackageName: "专业版月包",
        payStatus: "paid",
        memberUsed: 76,
        memberTotal: 86,
        amountUsed: 1456234,
        amountTotal: 1500000,
        lobsterCount: { normal: 18, total: 18 },
        createTime: "2024-02-20 14:08:32",
        lastAccessTime: "2025-01-10 09:15:42",
        members: [
            { id: 1, name: "马云飞", accountId: "mayunfei", role: "管理员", quota: 80000, usedQuota: 34567, status: "active" },
            { id: 2, name: "刘强", accountId: "liuqiang", role: "成员", quota: 40000, usedQuota: 9876, status: "active" },
            { id: 3, name: "陈明", accountId: "chenming", role: "成员", quota: 40000, usedQuota: 7654, status: "active" },
        ]
    },
    {
        id: 3,
        name: "字节跳动",
        totalPaid: 1654321,
        monthlyPackageName: "专业版月包",
        payStatus: "paid",
        memberUsed: 58,
        memberTotal: 65,
        amountUsed: 1198765,
        amountTotal: 1200000,
        lobsterCount: { normal: 14, total: 15 },
        createTime: "2024-03-10 09:56:18",
        lastAccessTime: "2025-01-09 18:45:30",
        members: [
            { id: 1, name: "张一鸣", accountId: "zhangyiming", role: "管理员", quota: 90000, usedQuota: 56789, status: "active" },
            { id: 2, name: "梁汝波", accountId: "liangrubo", role: "成员", quota: 45000, usedQuota: 12345, status: "active" },
        ]
    },
    {
        id: 4,
        name: "百度在线",
        totalPaid: 1234567,
        monthlyPackageName: "基础版月包",
        payStatus: "expired",
        memberUsed: 42,
        memberTotal: 50,
        amountUsed: 987654,
        amountTotal: 1000000,
        lobsterCount: { normal: 10, total: 12 },
        createTime: "2024-04-05 16:42:07",
        lastAccessTime: "2024-12-28 11:20:15",
        members: [
            { id: 1, name: "李彦宏", accountId: "liyanhong", role: "管理员", quota: 60000, usedQuota: 23456, status: "active" },
            { id: 2, name: "沈抖", accountId: "shendou", role: "成员", quota: 30000, usedQuota: 8765, status: "active" },
        ]
    },
    {
        id: 5,
        name: "京东集团",
        totalPaid: 987654,
        monthlyPackageName: "基础版月包",
        payStatus: "paid",
        memberUsed: 28,
        memberTotal: 40,
        amountUsed: 678456,
        amountTotal: 800000,
        lobsterCount: { normal: 10, total: 10 },
        createTime: "2024-05-12 11:18:53",
        lastAccessTime: "2025-01-10 16:08:55",
        members: [
            { id: 1, name: "刘强东", accountId: "liuqiangdong", role: "管理员", quota: 50000, usedQuota: 19876, status: "active" },
        ]
    },
    {
        id: 6,
        name: "美团点评",
        totalPaid: 876543,
        monthlyPackageName: "基础版月包",
        payStatus: "expired",
        memberUsed: 28,
        memberTotal: 30,
        amountUsed: 567890,
        amountTotal: 600000,
        lobsterCount: { normal: 6, total: 8 },
        createTime: "2024-06-20 08:35:29",
        lastAccessTime: "2024-11-15 09:30:00",
        members: [
            { id: 1, name: "王兴", accountId: "wangxing", role: "管理员", quota: 40000, usedQuota: 15678, status: "active" },
        ]
    },
    {
        id: 7,
        name: "小米科技",
        totalPaid: 765432,
        monthlyPackageName: "基础版月包",
        payStatus: "paid",
        memberUsed: 18,
        memberTotal: 25,
        amountUsed: 456789,
        amountTotal: 500000,
        lobsterCount: { normal: 6, total: 6 },
        createTime: "2024-07-08 15:27:44",
        lastAccessTime: "2025-01-08 10:45:22",
        members: [
            { id: 1, name: "雷军", accountId: "leijun", role: "管理员", quota: 45000, usedQuota: 12345, status: "active" },
        ]
    },
    {
        id: 8,
        name: "华为技术",
        totalPaid: 2345678,
        monthlyPackageName: "企业版月包",
        payStatus: "paid",
        memberUsed: 142,
        memberTotal: 200,
        amountUsed: 1789456,
        amountTotal: 2500000,
        lobsterCount: { normal: 28, total: 30 },
        createTime: "2024-01-05 09:12:36",
        lastAccessTime: "2025-01-10 17:22:38",
        members: [
            { id: 1, name: "任正非", accountId: "renzhengfei", role: "管理员", quota: 120000, usedQuota: 67890, status: "active" },
            { id: 2, name: "余承东", accountId: "yuchengdong", role: "成员", quota: 60000, usedQuota: 23456, status: "active" },
        ]
    },
];

import { type Package } from '@/lib/packages-data';

// 导出类型供其他页面使用
export type { Package };

// 根据日期范围生成不同的测试数据
const generateDataByDateRange = (dateRange: string | number, isCumulative: boolean, isCustomDays: boolean = false) => {
    // 基础乘数：根据日期范围调整
    let baseMultiplier: number;
    
    if (isCustomDays && typeof dateRange === 'number') {
        // 自定义日期范围，直接使用天数
        baseMultiplier = isCumulative ? 365 : dateRange;
    } else {
        // 预设日期范围
        const multipliers: Record<string, number> = {
            today: 1,
            "7days": 7,
            "30days": 30,
            month: 30,
        };
        baseMultiplier = isCumulative ? 365 : (multipliers[dateRange as string] || 1);
    }
    
    // 添加随机波动
    const randomFactor = () => 0.8 + Math.random() * 0.4; // 0.8-1.2之间
    
    return {
        // 核心统计数据
        activeUsers: Math.floor(1234 * baseMultiplier * randomFactor() * 0.3 + 500),
        paidTenants: Math.floor(56 + baseMultiplier * 2 * randomFactor()),
        modelCalls: Math.floor(9876543 * baseMultiplier * randomFactor() * 0.1),
        tokenConsumption: Math.floor(123456789 * baseMultiplier * randomFactor() * 0.1), // Token消耗
        expiringTenants: Math.floor(5 + Math.random() * 10), // 3日内到期租户数
        exhaustedQuotaTenants: Math.floor(3 + Math.random() * 8), // 套餐配额已用尽租户数
        lobsterCount: { 
            normal: Math.floor(89 * (1 + baseMultiplier * 0.05) * randomFactor()), 
            total: Math.floor(102 * (1 + baseMultiplier * 0.05) * randomFactor()) 
        },
        income: Math.floor(1234567 * baseMultiplier * randomFactor() * 0.15),
        cost: Math.floor(876543 * baseMultiplier * randomFactor() * 0.15),
        profit: Math.floor(358024 * baseMultiplier * randomFactor() * 0.15),
        packages: [
            { name: "基础版", income: Math.floor(456789 * baseMultiplier * randomFactor() * 0.2), sold: Math.floor(234 + baseMultiplier * 3 * randomFactor()) },
            { name: "专业版", income: Math.floor(567890 * baseMultiplier * randomFactor() * 0.2), sold: Math.floor(156 + baseMultiplier * 2 * randomFactor()) },
            { name: "企业版", income: Math.floor(209888 * baseMultiplier * randomFactor() * 0.2), sold: Math.floor(45 + baseMultiplier * randomFactor()) },
        ],
        
        // TOP数据
        paidCustomersTop: [
            { name: "腾讯科技", amount: Math.floor(123456 * baseMultiplier * randomFactor()) },
            { name: "阿里巴巴", amount: Math.floor(98765 * baseMultiplier * randomFactor()) },
            { name: "字节跳动", amount: Math.floor(87654 * baseMultiplier * randomFactor()) },
            { name: "百度在线", amount: Math.floor(76543 * baseMultiplier * randomFactor()) },
            { name: "京东集团", amount: Math.floor(65432 * baseMultiplier * randomFactor()) },
        ],
        packagesTop: [
            { name: "专业版", sold: Math.floor(156 + baseMultiplier * 2 * randomFactor()), amount: Math.floor(567890 * baseMultiplier * randomFactor() * 0.2) },
            { name: "基础版", sold: Math.floor(234 + baseMultiplier * 3 * randomFactor()), amount: Math.floor(456789 * baseMultiplier * randomFactor() * 0.2) },
            { name: "企业版", sold: Math.floor(45 + baseMultiplier * randomFactor()), amount: Math.floor(209888 * baseMultiplier * randomFactor() * 0.2) },
        ],
        modelCallsTop: [
            { name: "GPT-4", calls: Math.floor(3456789 * baseMultiplier * randomFactor() * 0.1) },
            { name: "Claude-3", calls: Math.floor(2345678 * baseMultiplier * randomFactor() * 0.1) },
            { name: "文心一言", calls: Math.floor(1234567 * baseMultiplier * randomFactor() * 0.1) },
            { name: "通义千问", calls: Math.floor(987654 * baseMultiplier * randomFactor() * 0.1) },
            { name: "智谱AI", calls: Math.floor(876543 * baseMultiplier * randomFactor() * 0.1) },
        ],
        lobsterCountTop: [
            { name: "腾讯科技", count: Math.floor(25 + baseMultiplier * 0.5 * randomFactor()) },
            { name: "阿里巴巴", count: Math.floor(18 + baseMultiplier * 0.3 * randomFactor()) },
            { name: "字节跳动", count: Math.floor(15 + baseMultiplier * 0.2 * randomFactor()) },
            { name: "百度在线", count: Math.floor(12 + baseMultiplier * 0.2 * randomFactor()) },
            { name: "京东集团", count: Math.floor(10 + baseMultiplier * 0.1 * randomFactor()) },
        ],
        lobsterActiveTop: [
            { name: "龙虾-生产环境", calls: Math.floor(1234567 * baseMultiplier * randomFactor() * 0.1) },
            { name: "龙虾-测试环境", calls: Math.floor(987654 * baseMultiplier * randomFactor() * 0.1) },
            { name: "龙虾-开发环境", calls: Math.floor(765432 * baseMultiplier * randomFactor() * 0.1) },
            { name: "龙虾-预发布", calls: Math.floor(543210 * baseMultiplier * randomFactor() * 0.1) },
            { name: "龙虾-灰度", calls: Math.floor(321098 * baseMultiplier * randomFactor() * 0.1) },
        ],
    };
};

// 格式化金额
const formatMoney = (amount: number) => {
    if (amount >= 100000000) {
        return `¥${(amount / 100000000).toFixed(2)}亿`;
    } else if (amount >= 10000) {
        return `¥${(amount / 10000).toFixed(2)}万`;
    }
    return `¥${amount.toLocaleString()}`;
};

// 格式化Token数量
const formatTokens = (tokens: number) => {
    if (tokens >= 100000000) {
        return `${(tokens / 100000000).toFixed(2)}亿`;
    } else if (tokens >= 10000) {
        return `${(tokens / 10000).toFixed(2)}万`;
    }
    return tokens.toLocaleString();
};

// 格式化数字
const formatNumber = (num: number) => {
    if (num >= 1000000000) {
        return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
        return `${(num / 1000000).toFixed(2)}M`;
    }
    return num.toLocaleString();
};

// ===== 账单管理 - 产品账单 =====
// 单个 Portal 下的产品账单数据；当同一产品的内部Portal与外部Portal已关联时，portals 长度为2，
// 列表按各列相加合并展示为一行，支持展开查看内部/外部Portal各自的数据
interface ProductBillPortalRow {
    portalName: string;          // Portal 名称
    internal: boolean;           // 是否为内部Portal
    productIdentifier: string;   // 该Portal对应的产品标识（内、外Portal产品标识不同）
    standardAmount: number;      // 官方标准价金额(元)
    payableAmount: number;       // 客户应付总金额(元)
    payableLastPeriod: number;   // 上一账期客户应付总金额(元)，用于计算环比
    arrearsAmount: number;       // 客户欠费总金额(元)
    settling: boolean;           // 本账期是否处于"结算中"（尚未出准确欠费数据）
}

interface ProductBillRow {
    id: string;
    productName: string;
    productIdentifier: string;
    period: string;                      // 账期年月
    portals: ProductBillPortalRow[];     // 长度为1：未关联Portal；长度>=2：内外Portal已关联合并
}

const productBillData: ProductBillRow[] = [
    {
        id: "llm-202603", productName: "大模型", productIdentifier: "llm", period: "202603",
        portals: [
            { portalName: "智汇云内网门户", internal: true, productIdentifier: "llm_in", standardAmount: 28456789.12, payableAmount: 17234567.89, payableLastPeriod: 16789234.56, arrearsAmount: 0, settling: true },
            { portalName: "智汇云官网", internal: false, productIdentifier: "llm_out", standardAmount: 17221445.44, payableAmount: 11221555.89, payableLastPeriod: 14253333.33, arrearsAmount: 0, settling: true },
        ],
    },
    {
        id: "lobster-202603", productName: "龙虾", productIdentifier: "lobster", period: "202603",
        portals: [
            { portalName: "智汇云内网门户", internal: true, productIdentifier: "lobster_in", standardAmount: 19234567.89, payableAmount: 11234567.45, payableLastPeriod: 10089234.56, arrearsAmount: 0, settling: true },
            { portalName: "智汇云官网", internal: false, productIdentifier: "lobster_out", standardAmount: 12955000.00, payableAmount: 8000000.00, payableLastPeriod: 7000000.00, arrearsAmount: 0, settling: true },
        ],
    },
    {
        id: "apicloud-202603", productName: "APICloud", productIdentifier: "apicloud", period: "202603",
        portals: [
            { portalName: "API市场门户", internal: false, productIdentifier: "apicloud", standardAmount: 18456789.23, payableAmount: 11567890.34, payableLastPeriod: 12263456.78, arrearsAmount: 0, settling: true },
        ],
    },
    {
        id: "llm-202602", productName: "大模型", productIdentifier: "llm", period: "202602",
        portals: [
            { portalName: "智汇云内网门户", internal: true, productIdentifier: "llm_in", standardAmount: 32345678.90, payableAmount: 19042567.89, payableLastPeriod: 18075234.56, arrearsAmount: 0, settling: false },
            { portalName: "智汇云官网", internal: false, productIdentifier: "llm_out", standardAmount: 20000000.00, payableAmount: 12000000.00, payableLastPeriod: 11000000.00, arrearsAmount: 0, settling: false },
        ],
    },
    {
        id: "lobster-202602", productName: "龙虾", productIdentifier: "lobster", period: "202602",
        portals: [
            { portalName: "智汇云内网门户", internal: true, productIdentifier: "lobster_in", standardAmount: 17567890.12, payableAmount: 10089234.56, payableLastPeriod: 10698567.89, arrearsAmount: 0, settling: false },
            { portalName: "智汇云官网", internal: false, productIdentifier: "lobster_out", standardAmount: 11000000.00, payableAmount: 7000000.00, payableLastPeriod: 7000000.00, arrearsAmount: 0, settling: false },
        ],
    },
    {
        id: "apicloud-202602", productName: "APICloud", productIdentifier: "apicloud", period: "202602",
        portals: [
            { portalName: "API市场门户", internal: false, productIdentifier: "apicloud", standardAmount: 21234567.89, payableAmount: 12263456.78, payableLastPeriod: 11228567.90, arrearsAmount: 0, settling: false },
        ],
    },
    {
        id: "llm-202601", productName: "大模型", productIdentifier: "llm", period: "202601",
        portals: [
            { portalName: "智汇云内网门户", internal: true, productIdentifier: "llm_in", standardAmount: 30901234.56, payableAmount: 18075234.56, payableLastPeriod: 18714567.89, arrearsAmount: 0, settling: false },
            { portalName: "智汇云官网", internal: false, productIdentifier: "llm_out", standardAmount: 18000000.00, payableAmount: 11000000.00, payableLastPeriod: 11000000.00, arrearsAmount: 0, settling: false },
        ],
    },
    {
        id: "lobster-202601", productName: "龙虾", productIdentifier: "lobster", period: "202601",
        portals: [
            { portalName: "智汇云内网门户", internal: true, productIdentifier: "lobster_in", standardAmount: 16789012.34, payableAmount: 10698567.89, payableLastPeriod: 9926234.56, arrearsAmount: 0, settling: false },
            { portalName: "智汇云官网", internal: false, productIdentifier: "lobster_out", standardAmount: 10000000.00, payableAmount: 7000000.00, payableLastPeriod: 7000000.00, arrearsAmount: 0, settling: false },
        ],
    },
    {
        id: "apicloud-202601", productName: "APICloud", productIdentifier: "apicloud", period: "202601",
        portals: [
            { portalName: "API市场门户", internal: false, productIdentifier: "apicloud", standardAmount: 19567890.12, payableAmount: 11228567.90, payableLastPeriod: 11445234.56, arrearsAmount: 0, settling: false },
        ],
    },
];

// 产品账单 - 汇总某产品行下所有Portal的数据（内外Portal已关联时为二者之和）
const aggregateProductBillRow = (row: ProductBillRow) => {
    const standardAmount = row.portals.reduce((s, p) => s + p.standardAmount, 0);
    const payableAmount = row.portals.reduce((s, p) => s + p.payableAmount, 0);
    const payableLastPeriod = row.portals.reduce((s, p) => s + p.payableLastPeriod, 0);
    const arrearsAmount = row.portals.reduce((s, p) => s + p.arrearsAmount, 0);
    const settling = row.portals.some((p) => p.settling);
    return { standardAmount, payableAmount, payableLastPeriod, arrearsAmount, settling };
};

// 产品账单 - 计算环比变化（对比上一账期客户应付总金额）
const getBillMomChange = (current: number, last: number) => {
    if (last === 0) return { pct: 0, up: false };
    const diff = current - last;
    return { pct: Math.abs((diff / last) * 100), up: diff > 0 };
};

export default function AdminPage() {
    const [adminMenuExpanded, setAdminMenuExpanded] = useState(false); // 管理后台菜单展开状态
    const [productMenuExpanded, setProductMenuExpanded] = useState(true); // 产品管理菜单展开状态
    const [zhiqiBillMenuExpanded, setZhiqiBillMenuExpanded] = useState(true); // 账单管理菜单展开状态
    const [bizAnalysisMenuExpanded, setBizAnalysisMenuExpanded] = useState(true); // 经营分析菜单展开状态
    const [platformConfigMenuExpanded, setPlatformConfigMenuExpanded] = useState(false); // 密钥管理菜单展开状态
    const [platformSettingMenuExpanded, setPlatformSettingMenuExpanded] = useState(true); // 平台配置菜单展开状态
    const [currentMenu, setCurrentMenu] = useState("product-define"); // 当前选中的菜单: product-define, product-addon, product-billing, product-package, zhiqi-bill-customer, zhiqi-bill-product, zhiqi-bill-intranet, analysis-product, analysis-department, platform-key, platform-api, platform-portal, platform-region, zhiqi-admin

    // ===== 经营分析 - 整体分析 =====
    const [overallBillType, setOverallBillType] = useState("month");     // 账单类型：month / day / hour
    const [overallMonth, setOverallMonth] = useState("2026-08");         // 选中月（月账单）
    const [overallDate, setOverallDate] = useState("2026-08-31");        // 选中天（天账单 / 小时账单）
    const [overallPage, setOverallPage] = useState(1);                   // 当前页
    const [overallPageSize, setOverallPageSize] = useState(10);          // 每页条数

    // 整体分析 - 当前账期（月账单取选中月，天/小时账单取选中天）
    const overallPeriodValue = overallBillType === "month" ? overallMonth : overallDate;

    // 整体分析 - 当前账单类型与账期对应的数据源（图表按时间正序）
    const overallChartRows = useMemo(
        () => getOverallDataset(overallBillType, overallPeriodValue),
        [overallBillType, overallPeriodValue]
    );

    // 整体分析 - 图表统计区间说明
    const overallChartRangeTip = useMemo(() => {
        if (overallBillType === "month") return `${overallMonth} 及其前 5 个月，共 6 个月`;
        if (overallBillType === "day") return `${overallDate} 及其前 29 天，共 30 天`;
        return `${overallDate} 及其前 6 天，按小时统计，共 168 个点`;
    }, [overallBillType, overallMonth, overallDate]);

    // 整体分析 - 列表数据（最新账期在前）
    const overallListRows = useMemo(() => [...overallChartRows].reverse(), [overallChartRows]);

    // 整体分析 - 汇总卡片（全部账期合计）
    const overallSummary = useMemo(() => {
        const totalRevenue = overallChartRows.reduce((s, r) => s + r.totalRevenue, 0);
        const productCost = overallChartRows.reduce((s, r) => s + r.productCost, 0);
        const balance = overallChartRows.reduce((s, r) => s + r.balance, 0);
        const innerTotalRevenue = overallChartRows.reduce((s, r) => s + r.innerTotalRevenue, 0);
        return {
            totalRevenue,
            productCost,
            balance,
            margin: innerTotalRevenue === 0 ? 0 : ((innerTotalRevenue - productCost) / innerTotalRevenue) * 100,
        };
    }, [overallChartRows]);

    // 整体分析 - 当前页数据
    const overallTotalPages = Math.max(1, Math.ceil(overallListRows.length / overallPageSize));
    const pagedOverallRows = useMemo(() => {
        const start = (overallPage - 1) * overallPageSize;
        return overallListRows.slice(start, start + overallPageSize);
    }, [overallListRows, overallPage, overallPageSize]);

    // ===== 经营分析 - 产品分析 =====
    const [analysisBillType, setAnalysisBillType] = useState("month");        // 账单类型
    const [analysisPeriod, setAnalysisPeriod] = useState("2026-08");          // 账期
    const [analysisProductLine, setAnalysisProductLine] = useState("");       // 所属产线
    const [analysisSettlementUnit, setAnalysisSettlementUnit] = useState(""); // 结算单元
    const [analysisProductTags, setAnalysisProductTags] = useState<string[]>(["云数据库 PGSQL (p..."]); // 产品名称多选标签
    const [analysisProductPickerOpen, setAnalysisProductPickerOpen] = useState(false); // 产品下拉是否展开
    const [analysisPage, setAnalysisPage] = useState(1);                     // 当前页
    const [analysisPageSize, setAnalysisPageSize] = useState(10);            // 每页条数
    const [expandedAnalysisRowIds, setExpandedAnalysisRowIds] = useState<number[]>([]); // 产品分析-已展开查看内外Portal明细的行ID

    // 产品分析 - 总收入明细抽屉（趋势 / 收入明细 / 成本明细）
    const [revenueDetailRow, setRevenueDetailRow] = useState<ProductAnalysisRow | null>(null);
    const [revenueDetailTab, setRevenueDetailTab] = useState<"trend" | "revenue" | "cost">("revenue");
    // 产品分析 - 「公司内收入」明细抽屉（结算单元账单 / 外部portal使用费用 两部分来源）
    const [innerRevenueDetailRow, setInnerRevenueDetailRow] = useState<ProductAnalysisRow | null>(null);
    // 产品分析 - 「集团内的外部事业部」收入明细抽屉
    const [outerGroupDetailRow, setOuterGroupDetailRow] = useState<ProductAnalysisRow | null>(null);
    // 产品分析 - 「外部(360.cn)」收入明细抽屉
    const [outerPortalDetailRow, setOuterPortalDetailRow] = useState<ProductAnalysisRow | null>(null);
    // 产品分析 - 结算单元账单金额明细抽屉（公司内非中台收入 / 中台内非智汇云收入 / 智汇云内非本结算单元收入 / 本结算单元收入 通用）
    const [unitBillDetail, setUnitBillDetail] = useState<{ row: ProductAnalysisRow; title: string; amount: number } | null>(null);

    // 产品分析 - 按筛选条件过滤
    const filteredAnalysisRows = useMemo(() => {
        return productAnalysisData.filter((row) => {
            if (analysisProductLine && row.productLine !== analysisProductLine) return false;
            if (analysisSettlementUnit && row.settlementUnit !== analysisSettlementUnit) return false;
            return true;
        });
    }, [analysisProductLine, analysisSettlementUnit]);

    // 产品分析 - 当前页数据
    const analysisTotalPages = Math.max(1, Math.ceil(filteredAnalysisRows.length / analysisPageSize));
    const pagedAnalysisRows = useMemo(() => {
        const start = (analysisPage - 1) * analysisPageSize;
        return filteredAnalysisRows.slice(start, start + analysisPageSize);
    }, [filteredAnalysisRows, analysisPage, analysisPageSize]);

    // 产品分析 - 合计（公司外收入按「集团内外部事业部」「外部(360.cn)」分开统计）
    const analysisTotals = useMemo(() => {
        return filteredAnalysisRows.reduce(
            (acc, row) => ({
                totalRevenue: acc.totalRevenue + row.totalRevenue,
                innerRevenue: acc.innerRevenue + row.innerRevenue,
                innerNonMidRevenue: acc.innerNonMidRevenue + row.innerNonMidRevenue,
                midNonZyunRevenue: acc.midNonZyunRevenue + row.midNonZyunRevenue,
                zyunNonUnitRevenue: acc.zyunNonUnitRevenue + row.zyunNonUnitRevenue,
                unitRevenue: acc.unitRevenue + row.unitRevenue,
                outerGroupRevenue: acc.outerGroupRevenue + row.outerGroupRevenue,
                outerPortalRevenue: acc.outerPortalRevenue + row.outerPortalRevenue,
                outerInnerPriceRevenue: acc.outerInnerPriceRevenue + row.outerInnerPriceRevenue,
                innerTotalRevenue: acc.innerTotalRevenue + row.innerTotalRevenue,
                productCost: acc.productCost + row.productCost,
                innerProfit: acc.innerProfit + row.innerProfit,
                outerProfit: acc.outerProfit + row.outerProfit,
                balance: acc.balance + row.balance,
            }),
            {
                totalRevenue: 0, innerRevenue: 0, innerNonMidRevenue: 0, midNonZyunRevenue: 0,
                zyunNonUnitRevenue: 0, unitRevenue: 0, outerGroupRevenue: 0, outerPortalRevenue: 0,
                outerInnerPriceRevenue: 0, innerTotalRevenue: 0, productCost: 0,
                innerProfit: 0, outerProfit: 0, balance: 0,
            }
        );
    }, [filteredAnalysisRows]);

    // ===== 经营分析 - 部门分析 =====
    // 数据来源：企业配置中所选「经营部门」（组织架构部门）下，已关联结算单元的部门
    // 一个部门可关联 N 个结算单元，部门的收入/成本 = 其关联结算单元对应值之和
    const [deptScopeEntId, setDeptScopeEntId] = useState<number | null>(null); // 选中的经营部门（对应企业配置项）
    const [deptBillType, setDeptBillType] = useState("month");               // 账单类型
    const [deptPeriod, setDeptPeriod] = useState("2026-09");                 // 账期
    const [deptUnitTags, setDeptUnitTags] = useState<string[]>([]);          // 结算单元多选标签
    const [deptPickerOpen, setDeptPickerOpen] = useState(false);             // 结算单元下拉是否展开
    const [deptPage, setDeptPage] = useState(1);                             // 当前页
    const [deptPageSize, setDeptPageSize] = useState(10);                    // 每页条数

    // 部门分析 - 展开/收起结算单元明细
    const [expandedDeptRows, setExpandedDeptRows] = useState<string[]>([]);
    const toggleDeptRowExpand = (key: string) =>
        setExpandedDeptRows((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

    // 部门分析 - 结算单元收支明细弹窗
    const [deptDetailUnit, setDeptDetailUnit] = useState<DepartmentAnalysisRow | null>(null);
    const [deptDetailTab, setDeptDetailTab] = useState<"revenue" | "cost">("cost");
    const openDeptDetail = (unit: DepartmentAnalysisRow, tab: "revenue" | "cost") => {
        setDeptDetailUnit(unit);
        setDeptDetailTab(tab);
    };
    // 说明：部门分析的数据聚合依赖「企业配置」中的经营部门，见下方 enterpriseConfigs 之后的 deptAggregatedRows


    // ===== 平台配置 - 地域可用区 =====
    type RegionZone = {
        id: number;
        innerName: string;      // 内网(qihoo.net)可用区名称
        innerCode: string;      // 内网(qihoo.net)可用区标识
        outerName: string;      // 外网(360.cn)可用区名称
        outerCode: string;      // 外网(360.cn)可用区标识
        region: string;         // 地域
        publicNet: boolean;     // 公网是否启用
        cloudServer: string;    // 云服务器名称
        createTime: string;
        updateTime: string;
    };
    const [regionZones, setRegionZones] = useState<RegionZone[]>([
        { id: 1, innerName: '北京电信', innerCode: 'bjwdt', outerName: '北京1区', outerCode: 'beijing1', region: '北京', publicNet: true, cloudServer: '奇虎360', createTime: '2024-08-10 13:07:01', updateTime: '2024-08-10 13:07:01' },
        { id: 2, innerName: '北京电信', innerCode: 'bjzdt', outerName: '北京2区', outerCode: 'beijing2', region: '北京', publicNet: false, cloudServer: '奇虎360', createTime: '2025-12-22 18:32:11', updateTime: '2025-12-22 18:32:11' },
        { id: 3, innerName: '北京联通', innerCode: 'bjpdc', outerName: '北京3区', outerCode: 'beijing3', region: '北京', publicNet: true, cloudServer: '奇虎360', createTime: '2024-08-10 13:07:03', updateTime: '2024-08-10 13:07:03' },
        { id: 4, innerName: '北京移动', innerCode: 'bjcm', outerName: '北京4区', outerCode: 'beijing4', region: '北京', publicNet: false, cloudServer: '奇虎360', createTime: '2025-12-22 18:32:29', updateTime: '2025-12-22 18:32:29' },
        { id: 5, innerName: '北京联通', innerCode: 'bjmd', outerName: '北京5区', outerCode: 'beijing5', region: '北京', publicNet: false, cloudServer: '奇虎360', createTime: '2025-12-22 18:32:33', updateTime: '2025-12-22 18:32:33' },
        { id: 6, innerName: '阿里1区', innerCode: 'alibj1', outerName: '阿里1区', outerCode: 'alibj1', region: '北京', publicNet: false, cloudServer: '阿里云', createTime: '2026-07-08 17:40:25', updateTime: '2026-07-08 17:40:25' },
        { id: 7, innerName: '上海电信', innerCode: 'shbt', outerName: '上海1区', outerCode: 'shanghai1', region: '上海', publicNet: true, cloudServer: '奇虎360', createTime: '2024-08-10 13:07:06', updateTime: '2024-08-10 13:07:06' },
        { id: 8, innerName: '上海联通', innerCode: 'shyc2', outerName: '上海2区', outerCode: 'shanghai2', region: '上海', publicNet: true, cloudServer: '奇虎360', createTime: '2024-08-10 13:07:06', updateTime: '2024-08-10 13:07:06' },
        { id: 9, innerName: '郑州电信', innerCode: 'zzdt', outerName: '郑州1区', outerCode: 'zhengzhou1', region: '郑州', publicNet: false, cloudServer: '奇虎360', createTime: '2025-12-22 18:33:15', updateTime: '2025-12-22 18:33:15' },
        { id: 10, innerName: '郑州联通', innerCode: 'zzzc', outerName: '郑州2区', outerCode: 'zhengzhou2', region: '郑州', publicNet: false, cloudServer: '奇虎360', createTime: '2025-12-22 18:33:20', updateTime: '2025-12-22 18:33:20' },
        { id: 11, innerName: '广州电信', innerCode: 'gzdt', outerName: '广州1区', outerCode: 'guangzhou1', region: '广州', publicNet: true, cloudServer: '奇虎360', createTime: '2025-12-22 18:33:41', updateTime: '2025-12-22 18:33:41' },
        { id: 12, innerName: '香港', innerCode: 'hk', outerName: '香港1区', outerCode: 'hongkong1', region: '香港', publicNet: true, cloudServer: '奇虎360', createTime: '2025-12-22 18:34:02', updateTime: '2025-12-22 18:34:02' },
    ]);
    const [regionZoneSearch, setRegionZoneSearch] = useState('');
    const [regionZoneDialogOpen, setRegionZoneDialogOpen] = useState(false);
    const [editingRegionZoneId, setEditingRegionZoneId] = useState<number | null>(null);
    const emptyRegionZoneForm = {
        innerName: '', innerCode: '', outerName: '', outerCode: '',
        region: '', publicNet: true, cloudServer: '',
    };
    const [regionZoneForm, setRegionZoneForm] = useState(emptyRegionZoneForm);

    // 云服务器 / 地域 下拉选项
    const cloudServerOptions = ['奇虎360', '阿里云', '腾讯云', '华为云', 'AWS'];
    const regionOptions = ['北京', '上海', '广州', '郑州', '香港'];

    const filteredRegionZones = regionZones.filter(z => {
        const kw = regionZoneSearch.trim().toLowerCase();
        if (!kw) return true;
        return [z.innerName, z.innerCode, z.outerName, z.outerCode, z.region, z.cloudServer]
            .some(v => v.toLowerCase().includes(kw));
    });

    const formatNow = () => {
        const d = new Date();
        const p = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    };

    const handleOpenCreateRegionZone = () => {
        setEditingRegionZoneId(null);
        setRegionZoneForm(emptyRegionZoneForm);
        setRegionZoneDialogOpen(true);
    };

    const handleOpenEditRegionZone = (zone: RegionZone) => {
        setEditingRegionZoneId(zone.id);
        setRegionZoneForm({
            innerName: zone.innerName,
            innerCode: zone.innerCode,
            outerName: zone.outerName,
            outerCode: zone.outerCode,
            region: zone.region,
            publicNet: zone.publicNet,
            cloudServer: zone.cloudServer,
        });
        setRegionZoneDialogOpen(true);
    };

    const handleSaveRegionZone = () => {
        if (!regionZoneForm.cloudServer.trim() || !regionZoneForm.region.trim()
            || !regionZoneForm.innerName.trim() || !regionZoneForm.innerCode.trim()) {
            return;
        }
        if (regionZoneForm.publicNet && (!regionZoneForm.outerName.trim() || !regionZoneForm.outerCode.trim())) {
            return;
        }
        const now = formatNow();
        if (editingRegionZoneId != null) {
            setRegionZones(prev => prev.map(z => z.id === editingRegionZoneId
                ? { ...z, ...regionZoneForm, updateTime: now }
                : z));
        } else {
            const nextId = regionZones.length ? Math.max(...regionZones.map(z => z.id)) + 1 : 1;
            setRegionZones(prev => [...prev, { id: nextId, ...regionZoneForm, createTime: now, updateTime: now }]);
        }
        setRegionZoneDialogOpen(false);
    };

    // ===== 平台配置 - 企业配置 =====
    type EnterpriseConfig = {
        id: number;
        name: string;          // 企业名称
        internal: boolean;     // 是否是内部企业
        enablePortal: boolean; // 是否开启独立Portal
        tenantId: string;      // 所属租户ID（内部企业必填）
        tenantName: string;    // 所属租户名称
        bizDeptId: string;     // 经营部门ID（非必填）
        bizDeptName: string;   // 经营部门名称
        portalName: string;    // Portal名称（开启独立Portal时必填）
        portalDomain: string;  // Portal域名（开启独立Portal时必填）
        remark: string;        // 备注说明
        createTime: string;
        updateTime: string;
    };
    const [enterpriseConfigs, setEnterpriseConfigs] = useState<EnterpriseConfig[]>([
        { id: 1, name: '奇虎360', internal: true, enablePortal: true, tenantId: '100000001', tenantName: '奇虎360', bizDeptId: 'd-1', bizDeptName: '技术中台', portalName: '智汇云内网门户', portalDomain: 'zyun.qihoo.net', remark: '公司内部员工访问入口', createTime: '2024-08-10 13:09:22', updateTime: '2025-12-18 16:40:12' },
        { id: 2, name: '360智汇云', internal: false, enablePortal: true, tenantId: '100000002', tenantName: '360智汇云', bizDeptId: 'z-1', bizDeptName: '智汇云', portalName: '智汇云官网', portalDomain: 'zyun.360.cn', remark: '对外公有云门户', createTime: '2024-08-10 13:07:01', updateTime: '2025-11-02 10:21:36' },
        { id: 3, name: '360人工智能部', internal: false, enablePortal: true, tenantId: '100000003', tenantName: '360人工智能部', bizDeptId: 'a-1', bizDeptName: '人工智能研究院', portalName: 'AI开发平台门户', portalDomain: 'tai.360.cn', remark: 'TAI 独立门户', createTime: '2025-03-12 14:22:08', updateTime: '2026-02-11 09:33:27' },
        { id: 4, name: '360政企安全', internal: false, enablePortal: true, tenantId: '100000004', tenantName: '360政企安全', bizDeptId: '', bizDeptName: '', portalName: '安全大脑专属门户', portalDomain: 'sec.360.cn', remark: '专属租户定制门户', createTime: '2025-09-08 10:30:45', updateTime: '2026-03-02 15:12:09' },
        { id: 5, name: '360数科', internal: false, enablePortal: false, tenantId: '', tenantName: '', bizDeptId: '', bizDeptName: '', portalName: '', portalDomain: '', remark: '暂未开启独立门户', createTime: '2025-06-20 17:45:20', updateTime: '2026-03-25 18:07:13' },
    ]);
    const [enterpriseSearch, setEnterpriseSearch] = useState('');
    const [enterpriseDialogOpen, setEnterpriseDialogOpen] = useState(false);
    const [editingEnterpriseId, setEditingEnterpriseId] = useState<number | null>(null);
    const emptyEnterpriseForm = {
        name: '', internal: false, enablePortal: false,
        tenantId: '', tenantName: '',
        bizDeptId: '', bizDeptName: '',
        portalName: '', portalDomain: '', remark: '',
    };
    const [enterpriseForm, setEnterpriseForm] = useState(emptyEnterpriseForm);
    const [enterpriseFormError, setEnterpriseFormError] = useState('');
    // 所属租户：输入租户ID后展示下拉候选
    const [tenantKeyword, setTenantKeyword] = useState('');
    const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
    // 经营部门：部门树选择器
    const [bizDeptPickerOpen, setBizDeptPickerOpen] = useState(false);
    const [expandedOrgNodes, setExpandedOrgNodes] = useState<string[]>([]);
    // 删除确认
    const [enterpriseDeleteTarget, setEnterpriseDeleteTarget] = useState<EnterpriseConfig | null>(null);

    // ===== 部门分析 - 基于经营部门的数据聚合 =====
    // 经营部门候选：企业配置中已选择了经营部门（组织架构部门）的企业
    const bizDeptOptions = useMemo(
        () => enterpriseConfigs.filter((e) => e.bizDeptId && e.tenantId),
        [enterpriseConfigs]
    );

    // 当前选中的经营部门（默认取第一个可用项）
    const currentBizDeptEnt = useMemo(() => {
        if (bizDeptOptions.length === 0) return null;
        return bizDeptOptions.find((e) => e.id === deptScopeEntId) || bizDeptOptions[0];
    }, [bizDeptOptions, deptScopeEntId]);

    // 经营部门下「已关联结算单元」的部门列表（不再需要单独创建部门/关联结算单元）
    const deptAggregatedRows = useMemo(() => {
        if (!currentBizDeptEnt) return [];
        const root = findOrgNode(getTenantOrgTree(currentBizDeptEnt.tenantId), currentBizDeptEnt.bizDeptId);
        if (!root) return [];
        const unitMap = new Map(departmentAnalysisData.map((r) => [r.opsUnit, r]));
        return collectLinkedDepts(root).map((d) => {
            const members = d.units
                .map((u) => unitMap.get(u))
                .filter((r): r is DepartmentAnalysisRow => Boolean(r));
            return {
                key: d.id,
                name: d.name,
                path: d.path,
                members,
                totalRevenue: members.reduce((s, m) => s + m.totalRevenue, 0),
                totalCost: members.reduce((s, m) => s + m.totalCost, 0),
            };
        });
    }, [currentBizDeptEnt]);

    // 该经营部门下涉及的全部结算单元（用于筛选下拉）
    const deptScopeUnits = useMemo(() => {
        const set = new Set<string>();
        deptAggregatedRows.forEach((row) => row.members.forEach((m) => set.add(m.opsUnit)));
        return departmentAnalysisData.filter((r) => set.has(r.opsUnit));
    }, [deptAggregatedRows]);

    // 部门分析 - 结算单元筛选：命中任一关联结算单元的部门才展示（未选则展示全部）
    const filteredDeptRows = useMemo(() => {
        if (deptUnitTags.length === 0) return deptAggregatedRows;
        return deptAggregatedRows.filter((row) => row.members.some((m) => deptUnitTags.includes(m.opsUnit)));
    }, [deptAggregatedRows, deptUnitTags]);

    // 部门分析 - 当前页数据
    const deptTotalPages = Math.max(1, Math.ceil(filteredDeptRows.length / deptPageSize));
    const pagedDeptRows = useMemo(() => {
        const start = (deptPage - 1) * deptPageSize;
        return filteredDeptRows.slice(start, start + deptPageSize);
    }, [filteredDeptRows, deptPage, deptPageSize]);

    const tenantSuggestions = enterpriseTenantOptions.filter(t => {
        const kw = tenantKeyword.trim().toLowerCase();
        if (!kw) return true;
        return t.id.includes(kw) || t.name.toLowerCase().includes(kw);
    });

    const filteredEnterpriseConfigs = enterpriseConfigs.filter(e => {
        const kw = enterpriseSearch.trim().toLowerCase();
        if (!kw) return true;
        return [e.name, e.tenantId, e.tenantName, e.bizDeptName, e.portalName, e.portalDomain, e.remark]
            .some(v => (v || '').toLowerCase().includes(kw));
    });

    // 内部企业全局唯一：除当前编辑项外，已存在的内部企业（存在时禁止再将企业设置为内部企业）
    const existedInternalEnterprise = enterpriseConfigs.find(
        e => e.internal && e.id !== editingEnterpriseId
    ) || null;

    const handleOpenCreateEnterprise = () => {
        setEditingEnterpriseId(null);
        setEnterpriseForm(emptyEnterpriseForm);
        setEnterpriseFormError('');
        setTenantKeyword('');
        setTenantDropdownOpen(false);
        setBizDeptPickerOpen(false);
        setEnterpriseDialogOpen(true);
    };

    const handleOpenEditEnterprise = (enterprise: EnterpriseConfig) => {
        setEditingEnterpriseId(enterprise.id);
        setEnterpriseForm({
            name: enterprise.name,
            internal: enterprise.internal,
            enablePortal: enterprise.enablePortal,
            tenantId: enterprise.tenantId,
            tenantName: enterprise.tenantName,
            bizDeptId: enterprise.bizDeptId,
            bizDeptName: enterprise.bizDeptName,
            portalName: enterprise.portalName,
            portalDomain: enterprise.portalDomain,
            remark: enterprise.remark,
        });
        setEnterpriseFormError('');
        setTenantKeyword(enterprise.tenantId ? `${enterprise.tenantId}（${enterprise.tenantName}）` : '');
        setTenantDropdownOpen(false);
        setBizDeptPickerOpen(false);
        setEnterpriseDialogOpen(true);
    };

    // 选择租户：切换租户时清空已选经营部门
    const handleSelectEnterpriseTenant = (t: EnterpriseTenantOption) => {
        setEnterpriseForm(prev => ({
            ...prev,
            tenantId: t.id,
            tenantName: t.name,
            bizDeptId: prev.tenantId === t.id ? prev.bizDeptId : '',
            bizDeptName: prev.tenantId === t.id ? prev.bizDeptName : '',
        }));
        setTenantKeyword(`${t.id}（${t.name}）`);
        setTenantDropdownOpen(false);
    };

    const handleSaveEnterprise = () => {
        if (!enterpriseForm.name.trim()) {
            setEnterpriseFormError('请输入企业名称');
            return;
        }
        // 内部企业全局唯一：已存在内部企业时不可再创建/设置第二个
        if (enterpriseForm.internal && existedInternalEnterprise) {
            setEnterpriseFormError(`已存在内部企业「${existedInternalEnterprise.name}」，内部企业只能有一个`);
            return;
        }
        // 内部企业时，所属租户必填
        if (enterpriseForm.internal && !enterpriseForm.tenantId) {
            setEnterpriseFormError('内部企业必须选择所属租户');
            return;
        }
        // 开启独立Portal时，Portal名称与域名必填
        if (enterpriseForm.enablePortal && (!enterpriseForm.portalName.trim() || !enterpriseForm.portalDomain.trim())) {
            setEnterpriseFormError('开启独立Portal时，Portal名称与Portal域名必填');
            return;
        }
        setEnterpriseFormError('');
        const now = formatNow();
        if (editingEnterpriseId != null) {
            setEnterpriseConfigs(prev => prev.map(e => e.id === editingEnterpriseId
                ? { ...e, ...enterpriseForm, updateTime: now }
                : e));
        } else {
            const nextId = enterpriseConfigs.length ? Math.max(...enterpriseConfigs.map(e => e.id)) + 1 : 1;
            setEnterpriseConfigs(prev => [...prev, { id: nextId, ...enterpriseForm, createTime: now, updateTime: now }]);
        }
        setEnterpriseDialogOpen(false);
    };

    // 删除企业：内部企业不可删除
    const handleDeleteEnterprise = () => {
        if (!enterpriseDeleteTarget || enterpriseDeleteTarget.internal) return;
        setEnterpriseConfigs(prev => prev.filter(e => e.id !== enterpriseDeleteTarget.id));
        setEnterpriseDeleteTarget(null);
    };

    const [activeTab, setActiveTab] = useState("packages");
    
    // 内网账单二级tab状态：部门账单/产品账单
    const [intranetBillTypeTab, setIntranetBillTypeTab] = useState<"department" | "product">("department");
    
    // 产品定义相关状态
    const [productSearchKeyword, setProductSearchKeyword] = useState("");
    const [productCategoryFilter, setProductCategoryFilter] = useState("all");
    const [productStatusFilter, setProductStatusFilter] = useState("all");
    const [createProductDialogOpen, setCreateProductDialogOpen] = useState(false);
    
    // 产品计费项相关状态
    const [billingItemSearch, setBillingItemSearch] = useState("");
    const [billingProductFilter, setBillingProductFilter] = useState("");
    const [billingStartDate, setBillingStartDate] = useState("");
    const [billingEndDate, setBillingEndDate] = useState("");
    const [billingCurrentPage, setBillingCurrentPage] = useState(1);
    const [billingPageSize, setBillingPageSize] = useState(10);
    const billingTotalCount = 2160; // 总数据量
    
    // 产品套餐相关状态
    const [resourcePackageTab, setResourcePackageTab] = useState<"packages" | "tasks">("packages"); // 套餐/发放任务tab
    const [resourcePackageSearch, setResourcePackageSearch] = useState("");
    const [resourcePackageProductFilter, setResourcePackageProductFilter] = useState("");
    const [resourcePackageTypeFilter, setResourcePackageTypeFilter] = useState("");
    const [resourcePackageStatusFilter, setResourcePackageStatusFilter] = useState("");
    const [resourcePackageStartDate, setResourcePackageStartDate] = useState("");
    const [resourcePackageEndDate, setResourcePackageEndDate] = useState("");
    const [resourcePackageCurrentPage, setResourcePackageCurrentPage] = useState(1);
    const [resourcePackagePageSize, setResourcePackagePageSize] = useState(10);
    const resourcePackageTotalCount = 63; // 总数据量
    
    // 产品抽屉模式：create-创建产品 / edit-编辑产品
    const [productDrawerMode, setProductDrawerMode] = useState<'create' | 'edit'>('create');
    const [callbackDialogOpen, setCallbackDialogOpen] = useState(false); // 回调设置弹窗

    // 产品表单默认值（创建/编辑共用）
    const emptyProductForm = {
        name: '',           // 产品名称
        shortName: '',      // 产品简介
        // 加入推荐
        hotOfficial: false, // 官网热门产品
        hotConsole: false,  // 控制台热门产品
        promoTag: 'none',   // 推广标签：hot / new / none
        categories: [] as string[], // 产品分类（可多选，形如 计算 / 奇云计算）
        categoryInput: '',  // 分类选择器临时值
        productLine: '其他', // 所属产线
        identifier: '',     // 产品标识符
        description: '',    // 产品描述
        tags: [] as string[], // 产品标签
        tagInput: '',       // 标签输入
        icon: null as File | null, // 产品图标
        url: '',            // URL地址
        introUrl: '',       // 介绍页地址
        networkType: 'external', // 展示Portal：external-外部(360.cn), qihoo-360集团/内部(qihoo.net), both-所有Portal(一个产品)
        linkedInternalProduct: '', // 关联的内部(qihoo.net)产品标识符，仅"外部(360.cn)"时可配置
        visibility: 'all',  // 展示范围：all / specified / excluded
        visibilityEnterprises: [{ id: '', name: '' }] as { id: string; name: string }[], // 指定企业列表
        auditType: 'default',     // 产品审核开通：default / manual / auto / none
        workOrderSchedule: false, // 工单排班表管理
        billingEnabled: true,     // 计费开通
        docEnabled: false,        // 产品文档
        docType: 'apicloud',      // 产品文档类型
        docUrl: '',               // 产品文档链接
        apiDocEnabled: false,     // API文档
        showInConsole: true,      // 是否在控制台展示
        showInWebsite: true,      // 是否在官网展示
        resourceGroupAuth: false, // 资源组授权
        resourceReport: false,    // 资源上报
        onlyInWorkOrder: false,   // 仅在工单展示
        reserveAmount: 0,         // 预留金额
        callbackUrl: '',          // 回调设置-回调地址
        callbackSecret: '',       // 回调设置-回调密钥
        adminBackend: 'none',     // 管理后台：none-无 / has-有
        adminBackendUrl: '',      // 管理后台地址
        regionEnabled: false,     // 地域可用区
    };

    // 创建/编辑产品表单状态
    const [newProduct, setNewProduct] = useState(emptyProductForm);
    // 产品简介说明气泡
    const [descTipOpen, setDescTipOpen] = useState(false);

    // 打开创建产品抽屉
    const openCreateProduct = () => {
        setProductDrawerMode('create');
        setNewProduct(emptyProductForm);
        setCreateProductDialogOpen(true);
    };

    // 打开编辑产品抽屉（用已有产品数据回填）
    const openEditProduct = (product: typeof zhihuiProductsData[0]) => {
        setProductDrawerMode('edit');
        setNewProduct({
            ...emptyProductForm,
            name: product.name,
            shortName: product.identifier,
            categories: [product.category.replace('/', ' / ')],
            identifier: product.identifier,
            description: `${product.name}相关能力，提供稳定可靠的云服务`,
            tags: ['标签', 'New'],
            url: `/${product.identifier}`,
            hotConsole: true,
            visibility: product.visibility === '所有企业可见' ? 'all' : 'specified',
            auditType: 'auto',
            networkType: 'external',
            linkedInternalProduct: zhihuiProductsData.find(p => p.identifier !== product.identifier)?.identifier ?? '',
            docEnabled: true,
            docUrl: 'https://apicloud.360.cn/user/apistore',
        });
        setCreateProductDialogOpen(true);
    };
    
    const [dateRange, setDateRange] = useState("today");
    const [isCumulative, setIsCumulative] = useState(false);
    const [isCustomDate, setIsCustomDate] = useState(false);
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");
    
    // 租户管理相关状态
    const [tenantSearchKeyword, setTenantSearchKeyword] = useState("");
    const [tenantPackageFilter, setTenantPackageFilter] = useState("all");
    const [selectedTenant, setSelectedTenant] = useState<typeof tenantsData[0] | null>(null);
    const [memberDialogOpen, setMemberDialogOpen] = useState(false);
    const [memberSearchKeyword, setMemberSearchKeyword] = useState(""); // 成员账号搜索
    const [importMemberDialogOpen, setImportMemberDialogOpen] = useState(false); // 导入成员弹框
    const [importMemberQuota, setImportMemberQuota] = useState(""); // 导入成员配额
    const [selectedMember, setSelectedMember] = useState<{ tenant: typeof tenantsData[0]; member: typeof tenantsData[0]['members'][0] } | null>(null);
    const [quotaDialogOpen, setQuotaDialogOpen] = useState(false);
    const [newQuota, setNewQuota] = useState("");
    
    // 套餐管理相关状态
    const [packagesData, setPackagesData] = useState<Package[]>([]); // 从 API 加载的套餐数据
    const [packagesLoading, setPackagesLoading] = useState(true); // 套餐加载状态

    // 从后端 API 重新拉取套餐列表
    const reloadPackages = React.useCallback(async () => {
        try {
            const data = await fetchPackages();
            setPackagesData(data);
        } catch (e) {
            console.error("加载套餐失败", e);
        } finally {
            setPackagesLoading(false);
        }
    }, []);

    // 页面挂载时加载套餐
    useEffect(() => {
        reloadPackages();
    }, [reloadPackages]);

    const [packageStatusFilter, setPackageStatusFilter] = useState("all");
    const [packageNameSearch, setPackageNameSearch] = useState(""); // 套餐名称搜索
    const [packageTypeFilter, setPackageTypeFilter] = useState("all"); // 所属产品筛选
    const [expandedPackageIds, setExpandedPackageIds] = useState<number[]>([]); // 展开的套餐ID列表
    const [expandedBillRowIds, setExpandedBillRowIds] = useState<string[]>([]); // 产品账单-已展开的内外Portal合并行ID列表
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // 二级菜单收起状态
    const [packageSubTab, setPackageSubTab] = useState("packages"); // 套餐页面二级tab: packages | analysis
    const [modelSubTab, setModelSubTab] = useState("config"); // AI计划管理页面二级tab: config | stats
    const [createPackageDialogOpen, setCreatePackageDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<Package | null>(null); // 正在编辑的套餐
    const [togglePackageConfirm, setTogglePackageConfirm] = useState<{ id: number; name: string; action: "上架" | "下架"; newStatus: string } | null>(null);
    const [newPackage, setNewPackage] = useState<{
        name: string;
        identifier: string; // 套餐标识
        product: "ai-plan" | "lobster"; // 选择产品
        description: string;
        type: "monthly" | "addon"; // monthly: 月包, addon: 加油包
        price: number;
        costPrice: number; // 成本价
        priceHint: string; // 金额提示语
        hourLimit5: number | null; // 5小时限额
        weekLimit: number | null; // 周限额
        monthLimit: number | null; // 月限额
        capabilityDesc: string; // 套餐能力说明
        lobsterCount: number; // 龙虾数量
        memberCount: number; // 成员数
        availableModels: string[]; // 可用模型列表
        purchaseLimit: number | null;
        stock: number | null;
        officialDiscount: number;
        internalDiscount: number;
        svipDiscount: number;
        vipDiscount: number;
    }>({
        name: "",
        identifier: "",
        product: "ai-plan",
        description: "",
        type: "monthly", // 默认月包
        price: 0,
        costPrice: 0,
        priceHint: "",
        hourLimit5: null,
        weekLimit: null,
        monthLimit: null,
        capabilityDesc: "",
        lobsterCount: 1,
        memberCount: 10, // 默认成员数
        availableModels: ALL_MODELS.map(m => m.id), // 默认选中所有模型
        purchaseLimit: null as number | null,
        stock: null as number | null,
        officialDiscount: 10, // 官方折扣（折），默认10折=不打折
        internalDiscount: 10, // 内部折扣（折），默认10折=不打折
        svipDiscount: 10, // SVIP折扣（折），默认10折=不打折
        vipDiscount: 10, // VIP折扣（折），默认10折=不打折
    });
    
    // 模型选择弹框状态
    const [modelSelectDialogOpen, setModelSelectDialogOpen] = useState(false);
    const [tempSelectedModels, setTempSelectedModels] = useState<string[]>([]);

    // 使用 useMemo 根据日期范围和累计状态动态生成数据
    const mockData = useMemo(() => {
        if (isCustomDate && customStartDate && customEndDate) {
            // 自定义日期范围：计算天数差异
            const start = new Date(customStartDate);
            const end = new Date(customEndDate);
            const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            return generateDataByDateRange(daysDiff > 0 ? daysDiff : 1, isCumulative, true);
        }
        return generateDataByDateRange(dateRange, isCumulative);
    }, [dateRange, isCumulative, isCustomDate, customStartDate, customEndDate]);
    
    // 过滤租户列表
    const filteredTenants = useMemo(() => {
        return tenantsData.filter(tenant => {
            const matchKeyword = tenant.name.toLowerCase().includes(tenantSearchKeyword.toLowerCase());
            const matchPackage = tenantPackageFilter === "all" || tenant.monthlyPackageName.includes(tenantPackageFilter);
            return matchKeyword && matchPackage;
        });
    }, [tenantSearchKeyword, tenantPackageFilter]);
    
    // 过滤套餐列表
    const filteredPackages = useMemo(() => {
        return packagesData.filter(pkg => {
            const matchStatus = packageStatusFilter === "all" || pkg.status === packageStatusFilter;
            const matchName = packageNameSearch === "" || pkg.name.toLowerCase().includes(packageNameSearch.toLowerCase());
            const matchType = packageTypeFilter === "all" || pkg.product === packageTypeFilter;
            return matchStatus && matchName && matchType;
        });
    }, [packagesData, packageStatusFilter, packageNameSearch, packageTypeFilter]);

    // 密钥管理相关状态
    const [accessKeys, setAccessKeys] = useState<AccessKey[]>(accessKeysData);
    const [accessKeySearch, setAccessKeySearch] = useState(""); // 密钥名称/主体搜索
    const [accessKeyTypeFilter, setAccessKeyTypeFilter] = useState<"all" | AccessKeyType>("all"); // 对接类型筛选
    const [accessKeyStatusFilter, setAccessKeyStatusFilter] = useState<"all" | "active" | "inactive">("all"); // 状态筛选
    const [createAccessKeyDialogOpen, setCreateAccessKeyDialogOpen] = useState(false); // 创建/编辑密钥表单
    const [editingAccessKeyId, setEditingAccessKeyId] = useState<number | null>(null); // 正在编辑的密钥ID，null表示新建
    const [accessKeyResult, setAccessKeyResult] = useState<{ ak: string; sk: string; name: string } | null>(null); // 创建成功结果弹窗
    const [accessKeyToggleConfirm, setAccessKeyToggleConfirm] = useState<{ id: number; name: string; action: "启用" | "停用"; newStatus: "active" | "inactive" } | null>(null);
    const [accessKeyDeleteConfirm, setAccessKeyDeleteConfirm] = useState<{ id: number; name: string } | null>(null);
    const [revealedSkIds, setRevealedSkIds] = useState<number[]>([]); // 已展示明文SK的密钥ID
    const [copiedField, setCopiedField] = useState<string>(""); // 复制提示字段
    const [newAccessKey, setNewAccessKey] = useState<{
        name: string;
        subject: string;
        type: AccessKeyType;
        scope: AccessKeyScope;
        ipWhitelist: string;
        apiPath: string;
        permission: "read" | "readwrite" | "manage";
        remark: string;
    }>({
        name: "",
        subject: "",
        type: "internal", // 默认内部服务
        scope: "all", // 默认全部接口
        ipWhitelist: "",
        apiPath: "",
        permission: "read", // 默认只读
        remark: "",
    });
    const [selectedProductId, setSelectedProductId] = useState<string>(""); // 已选智汇云产品ID
    // 密钥管理 - 对接接口多选（与系统间对接API接口列表联动）
    const [selectedApiIds, setSelectedApiIds] = useState<string[]>([]); // 已选接口ID列表
    const [apiSelectDialogOpen, setApiSelectDialogOpen] = useState(false); // 添加接口弹框
    const [apiSelectSearch, setApiSelectSearch] = useState(""); // 接口搜索关键字
    const [apiSelectTempIds, setApiSelectTempIds] = useState<string[]>([]); // 弹框内暂存的勾选结果
    // 密钥管理 - 已选接口按系统分组的折叠状态（存放已折叠的系统ID）
    const [collapsedApiGroups, setCollapsedApiGroups] = useState<string[]>([]);
    // 密钥管理 - 添加接口弹框内：左侧选中的系统ID（先选系统，再选该系统下的接口）
    const [apiSelectSystemId, setApiSelectSystemId] = useState<string>("");
    // 密钥管理 - 添加接口弹框内：系统搜索关键字
    const [apiSelectSystemSearch, setApiSelectSystemSearch] = useState("");
    // 接口管理Tab - 当前选中的产品ID（左侧产品列表选中项）
    const [apiManagerSelectedProductId, setApiManagerSelectedProductId] = useState<string>("prod-ecs");
    // 接口管理Tab - 左侧产品搜索
    const [apiManagerProductSearch, setApiManagerProductSearch] = useState("");
    // 接口管理Tab - 所属系统筛选（全部 / 智汇云平台 / 智汇云产品）
    const [apiManagerSystemTypeFilter, setApiManagerSystemTypeFilter] = useState<"all" | "platform" | "product">("all");
    // 接口管理Tab - 接口名称搜索
    const [apiManagerApiNameSearch, setApiManagerApiNameSearch] = useState("");
    // 接口管理Tab - 产线筛选（仅对智汇云产品生效，按产品分类/产线过滤）
    const [apiManagerProductLineFilter, setApiManagerProductLineFilter] = useState<string>("all");
    // 接口管理Tab - 动态新增的接口列表（叠加在mock数据之上）
    const [customApiInterfaces, setCustomApiInterfaces] = useState<ApiInterface[]>([]);
    // 接口管理Tab - 添加接口抽屉开关
    const [addApiDrawerOpen, setAddApiDrawerOpen] = useState(false);
    // 接口管理Tab - 正在编辑的接口ID（null 表示新建模式，非 null 表示逐条编辑模式）
    const [editingApiId, setEditingApiId] = useState<string | null>(null);
    // 接口管理Tab - 删除单个接口的二次确认（null 表示无待确认项）
    const [apiDeleteConfirm, setApiDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    // 接口管理Tab - 删除系统的二次确认（连同其下所有接口）
    const [systemDeleteConfirm, setSystemDeleteConfirm] = useState<{ id: string; name: string; apiCount: number } | null>(null);
    // 接口管理Tab - 被删除的系统ID集合（隐藏这些系统及其接口）
    const [deletedSystemIds, setDeletedSystemIds] = useState<string[]>([]);
    // 接口管理Tab - 被删除的接口ID集合（隐藏这些接口）
    const [deletedApiIds, setDeletedApiIds] = useState<string[]>([]);
    // 接口管理Tab - 新增接口 单行数据类型
    type NewApiRow = {
        name: string;
        path: string;
        method: "GET" | "POST" | "PUT" | "DELETE";
        group: string;
        description: string;
    };
    const createEmptyApiRow = (): NewApiRow => ({
        name: "",
        path: "",
        method: "GET",
        group: "",
        description: "",
    });
    // 接口管理Tab - 新增接口表单数据（支持批量添加）
    const [newApiForm, setNewApiForm] = useState<{
        systemType: "platform" | "product"; // 所属系统大类：智汇云平台 / 智汇云产品
        ownerId: string; // 平台系统ID 或 产品ID
        permission: "read" | "readwrite" | "manage"; // 权限类型：只读 / 读写 / 管理
        rows: NewApiRow[]; // 批量接口列表
    }>({
        systemType: "product",
        ownerId: "prod-ecs",
        permission: "read",
        rows: [createEmptyApiRow()],
    });
    // 接口管理Tab - 表单校验错误（系统级 + 每行级）
    const [newApiFormErrors, setNewApiFormErrors] = useState<{
        ownerId?: string;
        rows?: { [k: string]: string }[];
    }>({});

    // 合并mock接口与动态新增接口（过滤掉已删除的接口及已删除系统下的接口）
    const allApiInterfaces = useMemo(
        () =>
            [...apiInterfacesData, ...customApiInterfaces].filter(
                (a) => !deletedApiIds.includes(a.id) && !deletedSystemIds.includes(a.productId)
            ),
        [customApiInterfaces, deletedApiIds, deletedSystemIds]
    );

    // 接口管理Tab - 可见的系统/产品列表（过滤掉已删除的系统）
    const visibleKeyProducts = useMemo(
        () => keyProductsData.filter((p) => !deletedSystemIds.includes(p.id)),
        [deletedSystemIds]
    );

    // 密钥管理 - 添加接口弹框：可选择的系统列表（全部平台系统 + 全部产品，均可选）
    const apiDialogSystems = useMemo(
        () =>
            visibleKeyProducts.filter(
                (p) => allApiInterfaces.some((a) => a.productId === p.id),
            ),
        [visibleKeyProducts, allApiInterfaces],
    );

    // 密钥管理 - 添加接口弹框：左侧选中系统下的接口列表
    const apiDialogApis = useMemo(() => {
        if (!apiSelectSystemId) return [];
        return allApiInterfaces.filter((a) => a.productId === apiSelectSystemId);
    }, [apiSelectSystemId, allApiInterfaces]);

    // 密钥管理 - 已选接口对象列表
    const selectedApiObjects = useMemo(
        () => allApiInterfaces.filter((a) => selectedApiIds.includes(a.id)),
        [allApiInterfaces, selectedApiIds]
    );

    // 密钥管理 - 已选接口路径文本（用于列表展示与数据存储）
    const selectedApiPathText = useMemo(
        () => selectedApiObjects.map((a) => a.path).join(", "),
        [selectedApiObjects]
    );

    // 打开添加接口抽屉（新建模式）
    const openAddApiDrawer = () => {
        setEditingApiId(null);
        const selected = keyProductsData.find((p) => p.id === apiManagerSelectedProductId);
        setNewApiForm({
            systemType: selected?.systemType || "product",
            ownerId: selected?.id || "prod-ecs",
            permission: "read",
            rows: [createEmptyApiRow()],
        });
        setNewApiFormErrors({});
        setAddApiDrawerOpen(true);
    };

    // 打开编辑接口抽屉（逐条编辑模式，回填单条接口内容）
    const openEditApiDrawer = (api: ApiInterface) => {
        const owner = keyProductsData.find((p) => p.id === api.productId);
        setEditingApiId(api.id);
        setNewApiForm({
            systemType: owner?.systemType === "platform" ? "platform" : "product",
            ownerId: api.productId,
            permission: api.permission || "read",
            rows: [
                {
                    name: api.name,
                    path: api.path,
                    method: api.method,
                    group: api.group,
                    description: api.description,
                },
            ],
        });
        setNewApiFormErrors({});
        setAddApiDrawerOpen(true);
    };

    // 确认删除单个接口
    const handleConfirmDeleteApi = () => {
        if (!apiDeleteConfirm) return;
        const id = apiDeleteConfirm.id;
        // 自定义接口直接从列表移除；mock接口加入删除集合以隐藏
        setCustomApiInterfaces((prev) => prev.filter((a) => a.id !== id));
        setDeletedApiIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        setApiDeleteConfirm(null);
    };

    // 确认删除系统（连同其下所有接口）
    const handleConfirmDeleteSystem = () => {
        if (!systemDeleteConfirm) return;
        const sysId = systemDeleteConfirm.id;
        setCustomApiInterfaces((prev) => prev.filter((a) => a.productId !== sysId));
        setDeletedSystemIds((prev) => (prev.includes(sysId) ? prev : [...prev, sysId]));
        // 若当前选中的正是被删除的系统，则清空选中
        if (apiManagerSelectedProductId === sysId) {
            setApiManagerSelectedProductId("");
        }
        setSystemDeleteConfirm(null);
    };

    // 批量表单 - 新增一行接口
    const addNewApiRow = () => {
        setNewApiForm((f) => ({ ...f, rows: [...f.rows, createEmptyApiRow()] }));
    };

    // 批量表单 - 删除指定行接口
    const removeNewApiRow = (index: number) => {
        setNewApiForm((f) => ({
            ...f,
            rows: f.rows.length > 1 ? f.rows.filter((_, i) => i !== index) : f.rows,
        }));
        setNewApiFormErrors((er) => ({
            ...er,
            rows: er.rows ? er.rows.filter((_, i) => i !== index) : er.rows,
        }));
    };

    // 批量表单 - 更新某一行的字段
    const updateNewApiRow = (index: number, patch: Partial<NewApiRow>) => {
        setNewApiForm((f) => ({
            ...f,
            rows: f.rows.map((r, i) => (i === index ? { ...r, ...patch } : r)),
        }));
        setNewApiFormErrors((er) => {
            if (!er.rows) return er;
            const rows = er.rows.map((r, i) =>
                i === index
                    ? Object.keys(patch).reduce((acc, k) => ({ ...acc, [k]: "" }), { ...r })
                    : r
            );
            return { ...er, rows };
        });
    };

    // 提交添加接口（批量）
    const handleSubmitNewApi = () => {
        const errors: { ownerId?: string; rows?: { [k: string]: string }[] } = {};
        if (!newApiForm.ownerId) {
            errors.ownerId = newApiForm.systemType === "platform" ? "请选择所属系统" : "请选择所属产品";
        }
        const rowErrors: { [k: string]: string }[] = newApiForm.rows.map((row) => {
            const e: { [k: string]: string } = {};
            if (!row.name.trim()) e.name = "请输入接口名称";
            if (!row.path.trim()) e.path = "请输入接口路径";
            else if (!row.path.trim().startsWith("/")) e.path = "接口路径需以 / 开头";
            return e;
        });
        const hasRowError = rowErrors.some((e) => Object.keys(e).length > 0);
        if (errors.ownerId || hasRowError) {
            setNewApiFormErrors({ ...errors, rows: rowErrors });
            return;
        }
        const nowStr = (() => {
            const d = new Date();
            const p = (n: number) => String(n).padStart(2, "0");
            return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
        })();

        // 编辑模式：仅编辑单条接口
        if (editingApiId) {
            const row = newApiForm.rows[0];
            const existingTimes = getApiMockTimes(editingApiId);
            const updated: ApiInterface = {
                id: editingApiId,
                productId: newApiForm.ownerId,
                name: row.name.trim(),
                path: row.path.trim(),
                method: row.method,
                group: row.group.trim(),
                description: row.description.trim(),
                permission: newApiForm.permission,
                createdAt: existingTimes.createdAt,
                updatedAt: nowStr,
            };
            setCustomApiInterfaces((prev) => {
                const isCustom = prev.some((a) => a.id === editingApiId);
                if (isCustom) {
                    return prev.map((a) => (a.id === editingApiId ? updated : a));
                }
                // mock接口：隐藏原始项，追加编辑后的自定义副本（保留同一ID便于时间稳定）
                return [...prev, updated];
            });
            setDeletedApiIds((prev) => (prev.includes(editingApiId) ? prev : [...prev, editingApiId]));
            if (newApiForm.systemType === "product") {
                setApiManagerSelectedProductId(newApiForm.ownerId);
            }
            setEditingApiId(null);
            setAddApiDrawerOpen(false);
            return;
        }

        const base = Date.now();
        const newItems: ApiInterface[] = newApiForm.rows.map((row, i) => ({
            id: `custom-${base}-${i}`,
            productId: newApiForm.ownerId,
            name: row.name.trim(),
            path: row.path.trim(),
            method: row.method,
            group: row.group.trim(),
            description: row.description.trim(),
            permission: newApiForm.permission,
            createdAt: nowStr,
            updatedAt: nowStr,
        }));
        setCustomApiInterfaces((prev) => [...prev, ...newItems]);
        // 若归属为智汇云产品，切换到该产品便于用户立即看到结果
        if (newApiForm.systemType === "product") {
            setApiManagerSelectedProductId(newApiForm.ownerId);
        }
        setAddApiDrawerOpen(false);
    };

    // 生成随机AK/SK
    const generateAkSk = () => {
        const chars = "0123456789abcdef";
        const gen = (prefix: string, len: number) => {
            let s = prefix;
            for (let i = 0; i < len; i++) {
                s += chars[Math.floor(Math.random() * chars.length)];
            }
            return s;
        };
        return { ak: gen("AK", 16), sk: gen("SK", 32) };
    };

    // 过滤密钥列表
    const filteredAccessKeys = useMemo(() => {
        return accessKeys.filter(key => {
            const matchKeyword =
                accessKeySearch === "" ||
                key.name.toLowerCase().includes(accessKeySearch.toLowerCase()) ||
                key.subject.toLowerCase().includes(accessKeySearch.toLowerCase()) ||
                key.ak.toLowerCase().includes(accessKeySearch.toLowerCase());
            const matchType = accessKeyTypeFilter === "all" || key.type === accessKeyTypeFilter;
            const matchStatus = accessKeyStatusFilter === "all" || key.status === accessKeyStatusFilter;
            return matchKeyword && matchType && matchStatus;
        });
    }, [accessKeys, accessKeySearch, accessKeyTypeFilter, accessKeyStatusFilter]);

    // 脱敏展示SK
    const maskSk = (sk: string) => {
        if (sk.length <= 8) return "****";
        return sk.slice(0, 4) + "****" + sk.slice(-4);
    };

    // 复制到剪贴板
    const handleCopy = (text: string, field: string) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 2000);
    };

    // 创建密钥
    const handleCreateAccessKey = () => {
        const { ak, sk } = generateAkSk();
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formatTime = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        const createTime = formatTime(now);
        const newKey: AccessKey = {
            id: Date.now(),
            name: newAccessKey.name || "未命名密钥",
            subject: newAccessKey.subject,
            type: newAccessKey.type,
            scope: newAccessKey.scope,
            productId: newAccessKey.type === "thirdparty" ? selectedProductId : undefined,
            ipWhitelist: newAccessKey.ipWhitelist.split(/[,，\n]/).map(s => s.trim()).filter(Boolean),
            apiPath: newAccessKey.scope === "all" ? "" : selectedApiPathText,
            apiIds: newAccessKey.scope === "all" ? [] : selectedApiIds,
            permission: newAccessKey.permission,
            remark: newAccessKey.remark,
            ak,
            sk,
            status: "active",
            createTime,
            updateTime: createTime,
        };
        setAccessKeys(prev => [newKey, ...prev]);
        setCreateAccessKeyDialogOpen(false);
        setAccessKeyResult({ ak, sk, name: newKey.name });
        // 重置表单
        setNewAccessKey({
            name: "",
            subject: "",
            type: "internal",
            scope: "all",
            ipWhitelist: "",
            apiPath: "",
            permission: "read",
            remark: "",
        });
        setSelectedProductId("");
        setSelectedApiIds([]);
        setEditingAccessKeyId(null);
    };

    // 打开编辑弹框并回填数据
    const handleOpenEditAccessKey = (key: AccessKey) => {
        setEditingAccessKeyId(key.id);
        setNewAccessKey({
            name: key.name,
            subject: key.subject,
            type: key.type,
            scope: key.scope || "all",
            ipWhitelist: key.ipWhitelist.join(", "),
            apiPath: key.apiPath,
            permission: key.permission || "read",
            remark: key.remark,
        });
        setSelectedProductId(key.type === "thirdparty" ? (key.productId || "") : "");
        // 回填已选接口：优先使用 apiIds，其次按接口路径反查匹配
        if (key.apiIds && key.apiIds.length > 0) {
            setSelectedApiIds(key.apiIds);
        } else {
            const paths = key.apiPath.split(/[,，\n]/).map(s => s.trim()).filter(Boolean);
            setSelectedApiIds(allApiInterfaces.filter(a => paths.includes(a.path)).map(a => a.id));
        }
        setCreateAccessKeyDialogOpen(true);
    };

    // 保存编辑
    const handleUpdateAccessKey = () => {
        if (editingAccessKeyId == null) return;
        const now = new Date();
        const pad = (n: number) => n.toString().padStart(2, "0");
        const updateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        setAccessKeys(prev =>
            prev.map(k =>
                k.id === editingAccessKeyId
                    ? {
                        ...k,
                        name: newAccessKey.name || "未命名密钥",
                        subject: newAccessKey.subject,
                        type: newAccessKey.type,
                        scope: newAccessKey.scope,
                        productId: newAccessKey.type === "thirdparty" ? selectedProductId : undefined,
                        ipWhitelist: newAccessKey.ipWhitelist.split(/[,，\n]/).map(s => s.trim()).filter(Boolean),
                        apiPath: newAccessKey.scope === "all" ? "" : selectedApiPathText,
                        apiIds: newAccessKey.scope === "all" ? [] : selectedApiIds,
                        permission: newAccessKey.permission,
                        remark: newAccessKey.remark,
                        updateTime,
                    }
                    : k,
            ),
        );
        setCreateAccessKeyDialogOpen(false);
        setEditingAccessKeyId(null);
        setNewAccessKey({
            name: "",
            subject: "",
            type: "internal",
            scope: "all",
            ipWhitelist: "",
            apiPath: "",
            permission: "read",
            remark: "",
        });
        setSelectedProductId("");
        setSelectedApiIds([]);
    };

    // 关闭创建/编辑表单并重置
    const handleCloseAccessKeyForm = () => {
        setCreateAccessKeyDialogOpen(false);
        setEditingAccessKeyId(null);
        setNewAccessKey({
            name: "",
            subject: "",
            type: "internal",
            scope: "all",
            ipWhitelist: "",
            apiPath: "",
            permission: "read",
            remark: "",
        });
        setSelectedProductId("");
        setSelectedApiIds([]);
    };

    // 切换密钥启用/停用
    const handleToggleAccessKeyStatus = (id: number, name: string, newStatus: "active" | "inactive") => {
        const action = newStatus === "active" ? "启用" : "停用";
        setAccessKeyToggleConfirm({ id, name, action, newStatus });
    };

    const handleConfirmToggleAccessKey = () => {
        if (accessKeyToggleConfirm) {
            const now = new Date();
            const pad = (n: number) => n.toString().padStart(2, "0");
            const updateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            setAccessKeys(prev =>
                prev.map(k =>
                    k.id === accessKeyToggleConfirm.id
                        ? { ...k, status: accessKeyToggleConfirm.newStatus, updateTime }
                        : k,
                ),
            );
            setAccessKeyToggleConfirm(null);
        }
    };

    // 删除密钥
    const handleConfirmDeleteAccessKey = () => {
        if (accessKeyDeleteConfirm) {
            setAccessKeys(prev => prev.filter(k => k.id !== accessKeyDeleteConfirm.id));
            setAccessKeyDeleteConfirm(null);
        }
    };

    // 打开成员管理弹窗
    const handleManageMembers = (tenant: typeof tenantsData[0]) => {
        setSelectedTenant(tenant);
        setMemberDialogOpen(true);
    };

    // 打开配额设置弹窗
    const handleSetQuota = (tenant: typeof tenantsData[0], member: typeof tenantsData[0]['members'][0]) => {
        setSelectedMember({ tenant, member });
        setNewQuota(member.quota.toString());
        setQuotaDialogOpen(true);
    };

    // 保存配额
    const handleSaveQuota = () => {
        if (selectedMember && newQuota) {
            console.log(`设置 ${selectedMember.member.name} 的配额为 ${newQuota}`);
            setQuotaDialogOpen(false);
            setSelectedMember(null);
        }
    };
    
    // 打开上/下架确认弹窗
    const handleTogglePackageStatus = (packageId: number, packageName: string, newStatus: string) => {
        const action = newStatus === "active" ? "上架" : "下架";
        setTogglePackageConfirm({ id: packageId, name: packageName, action, newStatus });
    };
    
    // 确认执行上/下架（调用后端 API 持久化）
    const handleConfirmToggleStatus = async () => {
        if (togglePackageConfirm) {
            try {
                const updated = await setPackageStatusApi(
                    togglePackageConfirm.id,
                    togglePackageConfirm.newStatus as "active" | "inactive",
                );
                // 用后端返回的最新数据更新本地状态
                setPackagesData(prev =>
                    prev.map(pkg => (pkg.id === updated.id ? updated : pkg)),
                );
            } catch (e) {
                console.error("更新套餐状态失败", e);
            } finally {
                setTogglePackageConfirm(null);
            }
        }
    };
    
    // 取消上/下架操作
    const handleCancelToggleStatus = () => {
        setTogglePackageConfirm(null);
    };
    
    // 创建/编辑套餐（调用后端 API 持久化）
    const handleCreatePackage = async (shouldPublish: boolean = false) => {
        const payload = {
            name: newPackage.name,
            identifier: newPackage.identifier,
            product: newPackage.product,
            description: newPackage.description,
            type: newPackage.type,
            price: newPackage.price,
            costPrice: newPackage.costPrice,
            priceHint: newPackage.priceHint,
            hourLimit5: newPackage.hourLimit5,
            weekLimit: newPackage.weekLimit,
            monthLimit: newPackage.monthLimit,
            capabilityDesc: newPackage.capabilityDesc,
            lobsterCount: newPackage.lobsterCount,
            memberCount: newPackage.memberCount,
            availableModels: newPackage.availableModels,
            purchaseLimit: newPackage.purchaseLimit,
            stock: newPackage.stock,
            officialDiscount: newPackage.officialDiscount,
            internalDiscount: newPackage.internalDiscount,
            svipDiscount: newPackage.svipDiscount,
            vipDiscount: newPackage.vipDiscount,
            features: [
                `${newPackage.lobsterCount}个龙虾`,
                newPackage.availableModels.length > 0 ? '全部模型支持' : '基础模型支持',
            ],
        };

        try {
            if (editingPackage) {
                // 编辑模式：更新套餐
                const updates: Record<string, unknown> = { ...payload };
                // 编辑时若选择"保存并上架"，同时更新状态
                if (shouldPublish) updates.status = "active";
                await updatePackageApi(editingPackage.id, updates);
            } else {
                // 创建模式：可选立即上架
                await createPackageApi(payload, shouldPublish);
            }
            // 重新拉取最新列表，保证与后端一致
            await reloadPackages();
        } catch (e) {
            console.error("保存套餐失败", e);
        } finally {
            handleClosePackageDialog();
        }
    };
    
    // 编辑套餐
    const handleEditPackage = (pkg: Package) => {
        setEditingPackage(pkg);
        setNewPackage({
            name: pkg.name,
            identifier: pkg.identifier || "",
            product: pkg.product || "ai-plan",
            description: pkg.description,
            type: pkg.type,
            price: pkg.price,
            costPrice: pkg.costPrice || 0,
            priceHint: pkg.priceHint || "",
            hourLimit5: pkg.hourLimit5 ?? null,
            weekLimit: pkg.weekLimit ?? null,
            monthLimit: pkg.monthLimit ?? null,
            capabilityDesc: pkg.capabilityDesc || "",
            lobsterCount: pkg.lobsterCount,
            memberCount: pkg.memberCount,
            availableModels: pkg.availableModels || [],
            purchaseLimit: pkg.purchaseLimit,
            stock: pkg.stock,
            officialDiscount: pkg.officialDiscount,
            internalDiscount: pkg.internalDiscount,
            svipDiscount: pkg.svipDiscount,
            vipDiscount: pkg.vipDiscount,
        });
        setCreatePackageDialogOpen(true);
    };
    
    // 关闭套餐弹窗
    const handleClosePackageDialog = () => {
        setCreatePackageDialogOpen(false);
        setEditingPackage(null);
        setNewPackage({
            name: "",
            identifier: "",
            product: "ai-plan",
            description: "",
            type: "monthly",
            price: 0,
            costPrice: 0,
            priceHint: "",
            hourLimit5: null,
            weekLimit: null,
            monthLimit: null,
            capabilityDesc: "",
            lobsterCount: 1,
            memberCount: 10,
            availableModels: ALL_MODELS.map(m => m.id), // 默认选中所有模型
            purchaseLimit: null,
            stock: null,
            officialDiscount: 10,
            internalDiscount: 10,
            svipDiscount: 10,
            vipDiscount: 10,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 左侧导航栏 —— 智汇云全局侧边栏规范 */}
            <aside className="fixed top-0 left-0 w-[198px] h-screen bg-[#242424] overflow-y-auto flex flex-col">
                {/* LOGO 区 */}
                <div className="h-14 flex items-center px-4 border-b border-[#3a3a3a] flex-shrink-0">
                    <svg width="150" height="25" viewBox="0 0 166 28" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="智汇云管理端">
                        <g transform="translate(-18, -14)" fillRule="evenodd">
                            <g transform="translate(18, 14)">
                                <g fillRule="nonzero">
                                    <path d="M19.0983426,21.7777778 L23.2944538,21.7777778 C23.2944538,23.4966667 21.9022315,24.8888889 20.1833426,24.8888889 L10.9550093,24.8888889 C6.66945376,24.8888889 3.10334265,21.3811111 3.11112042,17.0955556 C3.1188982,12.8061111 6.59945376,9.33333333 10.8888982,9.33333333 C13.4322315,9.33333333 15.691676,10.5544444 17.1111204,12.4444444 L20.7277871,12.4444444 C18.9738982,8.75 15.201676,6.20277778 10.8344538,6.22211167 C4.85723154,6.24944444 -0.00776846488,11.1416667 0,17.1227778 C0.00778709068,23.1311111 4.88056487,28 10.8888982,28 L20.1833426,28 C23.6211204,28 26.4055649,25.2155556 26.4055649,21.7777778 L26.4055649,14.9372222 C26.4055649,14.5911111 25.9855649,14.4161111 25.7405649,14.6611111 L18.9583426,21.4433333 C18.8377871,21.5677778 18.9233426,21.7777778 19.0983426,21.7777778" />
                                    <path d="M18.666676,0 C14.9411204,0 11.6550093,1.87055556 9.69112042,4.72111111 C10.0722315,4.68611111 10.4572315,4.66666667 10.8500093,4.66666667 C11.7988982,4.66666667 12.7244538,4.77555556 13.6150093,4.97388889 C14.9722315,3.81111111 16.7377871,3.11111111 18.666676,3.11111111 C22.9638982,3.11111111 26.4444538,6.59166667 26.4444538,10.8888889 C26.4444538,11.4216667 26.3900093,11.9427778 26.2888982,12.4444444 L29.446676,12.4444444 C29.5205649,11.935 29.5555649,11.4177778 29.5555649,10.8888889 C29.5555649,4.87277778 24.6788982,0 18.666676,0" />
                                    <path d="M28.7000093,10.8888889 L25.0055649,10.8888889 L17.0722315,10.8888889 C13.6344538,10.8888889 10.8500093,13.6733333 10.8500093,17.1111111 L10.8500093,23.9516667 C10.8500093,24.2977778 11.2700093,24.4727778 11.5150093,24.2277778 L18.2972315,17.4416667 C18.421676,17.3211111 18.3322315,17.1111111 18.1611204,17.1111111 L13.9611204,17.1111111 C13.9572315,15.3922222 15.3494538,14 17.0683426,14 L25.0055649,14 L28.6494538,14 C31.6633426,14 34.1444538,16.4266667 34.1444538,19.4405556 C34.1444538,22.4505556 31.7061204,24.8888889 28.7000093,24.8888889 L27.2844538,24.8888889 C26.7400093,26.1294444 25.876676,27.1988889 24.8033426,28 L28.6261204,28 C33.3394538,28 37.2633426,24.1422222 37.2555764,19.4288889 C37.2477871,14.7077778 33.4211204,10.8888889 28.7000093,10.8888889" />
                                </g>
                                <g transform="translate(43, 5)">
                                    <path d="M0.813697211,0.244109163 L0,3.45747015 L2.25016323,3.45747015 L2.3721953,2.77391045 L4.07388969,2.77391045 L4.07388969,4.20362194 L0.3660962,4.20362194 L0.3660962,5.89225754 L4.06578424,5.89225754 L0.203536879,7.71283188 L0.203536879,9.51854622 L5.16587405,7.22605452 L9.9661022,9.47801897 L9.9661022,7.67185432 L6.22633721,5.89225754 L9.64098356,5.89225754 L9.64098356,4.20362194 L6.1772542,4.20362194 L6.1772542,2.77391045 L9.31496431,2.77391045 L9.31496431,1.10373726 L2.72478242,1.10373726 L2.84681448,0.244109163 L0.813697211,0.244109163 Z M10.373176,9.11147247 L18.1827779,9.11147247 L18.1827779,0.786273769 L10.373176,0.786273769 L10.373176,9.11147247 Z M12.2401315,7.48858107 L16.3153721,7.48858107 L16.3153721,2.41006577 L12.2401315,2.41006577 L12.2401315,7.48858107 Z M0.447150709,18 L18.0202186,18 L18.0202186,9.76306066 L0.447150709,9.76306066 L0.447150709,18 Z M2.76801149,13.2448021 L15.6998081,13.2448021 L15.6998081,11.6493792 L2.76801149,11.6493792 L2.76801149,13.2448021 Z M2.76801149,16.1334948 L15.6998081,16.1334948 L15.6998081,14.7740305 L2.76801149,14.7740305 L2.76801149,16.1334948 Z M21.0712454,3.08588025 L25.8710233,5.60757609 L25.8710233,2.64368288 L21.0712454,0.121987036 L21.0712454,3.08588025 Z M26.8882574,0.569137745 L26.8882574,17.9999099 L39.3350778,17.9999099 L39.3350778,15.5119868 L29.4455271,15.5119868 L29.4455271,3.11830206 L39.1729688,3.11830206 L39.1729688,0.569137745 L26.8882574,0.569137745 Z M20.6236444,7.57900188 L25.4234223,9.9385887 L25.4234223,7.19219175 L20.6236444,4.83260493 L20.6236444,7.57900188 Z M22.9422537,10.9013361 L20.6641717,17.9999099 L23.6420243,17.9999099 L25.8791287,10.9013361 L22.9422537,10.9013361 Z M42.4269922,3.0449027 L59.3489222,3.0449027 L59.3489222,0.732147369 L42.4269922,0.732147369 L42.4269922,3.0449027 Z M41.8578094,7.27324626 L41.8578094,9.58600159 L46.0068996,9.58600159 L41.5317901,17.8778779 L60.1216418,17.8778779 L57.2338498,11.8370654 L54.3924389,11.8370654 L56.1742872,15.6263637 L45.8056143,15.6263637 L49.0113201,9.58600159 L60.1626194,9.58600159 L60.1626194,7.27324626 L41.8578094,7.27324626 Z M66.1372373,16.050549 L76.6054271,16.050549 L76.6054271,15.1274282 L66.1372373,15.1274282 L66.1372373,16.050549 Z M66.1372373,10.765795 L75.3283683,10.765795 L75.3283683,9.90121357 L66.1372373,9.90121357 L66.1372373,10.765795 Z M64.5404635,8.03515864 L77.4754122,8.03515864 L77.4754122,6.74008771 L64.5404635,6.74008771 L64.5404635,8.03515864 Z M62.1669173,5.06856361 L70.1611434,5.06856361 L70.1611434,4.04682649 L70.6344116,4.04682649 L70.6344116,2.67160165 L70.673588,2.47121689 L68.3572302,2.47121689 L69.064656,4.47911721 L66.8622248,4.47911721 L66.1552494,2.49103022 C65.6572145,3.08047662 65.0682184,3.58481579 64.3869102,4.00404772 C63.7060523,4.42327966 62.9657545,4.71102316 62.1669173,4.86862915 L62.1669173,2.67160165 C63.4106537,2.1217819 64.3148617,1.32924892 64.8777403,0.29445302 L70.948723,0.29445302 L70.948723,2.51444596 C72.0362043,1.97768499 72.8345913,1.23738714 73.345685,0.29445302 L79.8485081,0.29445302 L79.8485081,2.47121689 L77.113819,2.47121689 L77.8212448,4.47911721 L75.3495326,4.47911721 L74.6425571,2.2014855 C73.9873665,2.97465546 73.2078923,3.58391518 72.3045848,4.02881438 L72.3045848,5.06856361 L79.8485081,5.06856361 L79.8485081,9.29240414 L77.4321831,9.29240414 L77.4321831,12.6124869 L66.1372373,12.6124869 L66.1372373,13.3000993 L78.7087917,13.3000993 L78.7087917,17.8778779 L64.0329722,17.8778779 L64.0329722,9.29240414 L62.1669173,9.29240414 L62.1669173,5.06856361 Z M94.8553002,8.4264718 L96.782146,8.4264718 L96.782146,6.48296479 L94.8553002,6.48296479 L94.8553002,8.4264718 Z M94.8553002,4.30214819 L96.782146,4.30214819 L96.782146,2.35864119 L94.8553002,2.35864119 L94.8553002,4.30214819 Z M91.0286268,8.4264718 L92.7956151,8.4264718 L92.7956151,6.48296479 L91.0286268,6.48296479 L91.0286268,8.4264718 Z M91.0286268,4.30214819 L92.7956151,4.30214819 L92.7956151,2.35864119 L91.0286268,2.35864119 L91.0286268,4.30214819 Z M94.7616372,10.2943279 L94.7616372,11.7911345 L99.0822928,11.7911345 L99.0822928,13.909359 L94.7616372,13.909359 L94.7616372,15.5043317 L99.6325629,15.5043317 L99.6325629,17.6617325 L88.1980232,17.6617325 L88.1980232,15.9132066 L81.7154636,16.9939334 L81.7154636,14.6595636 L83.7584876,14.3254389 L83.7584876,9.24962537 L82.0883144,9.24962537 L82.0883144,6.95443186 L83.7584876,6.95443186 L83.7584876,2.9823106 L81.8131794,2.9823106 L81.8131794,0.64794074 L87.9233384,0.64794074 L87.9233384,2.9823106 L85.8226757,2.9823106 L85.8226757,6.95443186 L87.7661828,6.95443186 L87.7661828,9.24962537 L85.8226757,9.24962537 L85.8226757,13.8931481 L88.1980232,13.5788368 L88.1980232,15.5043317 L92.618646,15.5043317 L92.618646,13.909359 L88.7289302,13.909359 L88.7289302,11.7911345 L92.618646,11.7911345 L92.618646,10.2943279 L89.0427913,10.2943279 L89.0427913,0.510598377 L98.7679815,0.510598377 L98.7679815,10.2943279 L94.7616372,10.2943279 Z M108.472683,0.451653737 L110.689524,0.451653737 L110.689524,3.10213619 L112.421839,3.10213619 L112.421839,0 L114.447301,0 L114.447301,3.10213619 L116.433587,3.10213619 L116.433587,0.451653737 L118.649977,0.451653737 L118.649977,5.04879531 L108.472683,5.04879531 L108.472683,0.451653737 Z M108.080019,9.92107192 L112.402025,9.92107192 L112.402025,8.17434725 L107.922863,8.17434725 L107.922863,6.14888513 L119.21916,6.14888513 L119.21916,8.17434725 L114.50584,8.17434725 L114.50584,9.92107192 L119.043091,9.92107192 L119.043091,17.8779229 L116.983406,17.8779229 L116.983406,12.1766388 L115.899527,12.1766388 L115.899527,17.8779229 L114.033022,17.8779229 L114.033022,12.1766388 L113.109901,12.1766388 L113.109901,17.8779229 L111.242946,17.8779229 L111.242946,12.1766388 L110.158617,12.1766388 L110.158617,17.8779229 L108.080019,17.8779229 L108.080019,9.92107192 Z M105.490327,5.91337675 L107.451396,5.91337675 L106.920939,13.3789473 L104.959871,13.3789473 L105.490327,5.91337675 Z M103.459461,5.91337675 L103.989918,13.3789473 L102.028849,13.3789473 L101.498843,5.91337675 L103.459461,5.91337675 Z M101.439853,2.90580415 L103.716584,2.90580415 L103.716584,0.196332033 L105.620465,0.196332033 L105.620465,2.90580415 L107.608552,2.90580415 L107.608552,5.00961897 L101.439853,5.00961897 L101.439853,2.90580415 Z M101.262884,14.5916129 L107.785521,14.1984985 L107.785521,16.5026981 L101.262884,16.8958124 L101.262884,14.5916129 Z" />
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>

                {/* 菜单 */}
                <nav className="py-2 px-2 flex-1">
                    {/* 一级菜单：产品管理 */}
                    <div>
                        <div
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-[160ms] ${
                                ['product-define', 'product-addon', 'product-billing', 'product-package'].includes(currentMenu)
                                    ? 'bg-[#0f73f6] text-white'
                                    : 'text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                            onClick={() => {
                                setProductMenuExpanded(!productMenuExpanded);
                                if (!productMenuExpanded) {
                                    setCurrentMenu('product-define');
                                }
                            }}
                        >
                            <span className="text-[13px]">产品管理</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-[160ms] ${productMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单 */}
                        {productMenuExpanded && (
                            <div className="mt-0.5 space-y-0.5">
                                <div
                                    onClick={() => setCurrentMenu('product-define')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] flex items-center justify-between ${
                                        currentMenu === 'product-define'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    <span>产品定义</span>
                                    <span className="ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded bg-orange-500 text-white flex-shrink-0">本期改动</span>
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('product-addon')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] ${
                                        currentMenu === 'product-addon'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    产品计费项
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('product-billing')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] ${
                                        currentMenu === 'product-billing'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    产品计费策略
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('product-package')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] ${
                                        currentMenu === 'product-package'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    产品套餐
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 一级菜单：账单管理 */}
                    <div className="mt-0.5">
                        <div
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-[160ms] ${
                                ['zhiqi-bill-customer', 'zhiqi-bill-product', 'zhiqi-bill-intranet'].includes(currentMenu)
                                    ? 'bg-[#0f73f6] text-white'
                                    : 'text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                            onClick={() => {
                                setZhiqiBillMenuExpanded(!zhiqiBillMenuExpanded);
                                if (!zhiqiBillMenuExpanded) {
                                    setCurrentMenu('zhiqi-bill-customer');
                                }
                            }}
                        >
                            <span className="text-[13px]">账单管理</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-[160ms] ${zhiqiBillMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单 */}
                        {zhiqiBillMenuExpanded && (
                            <div className="mt-0.5 space-y-0.5">
                                <div
                                    onClick={() => setCurrentMenu('zhiqi-bill-customer')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] ${
                                        currentMenu === 'zhiqi-bill-customer'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    客户账单
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('zhiqi-bill-product')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] flex items-center justify-between ${
                                        currentMenu === 'zhiqi-bill-product'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    <span>产品账单</span>
                                    <span className="ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded bg-orange-500 text-white flex-shrink-0">本期改动</span>
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('zhiqi-bill-intranet')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] ${
                                        currentMenu === 'zhiqi-bill-intranet'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    内网账单
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 一级菜单：经营分析 */}
                    <div className="mt-0.5">
                        <div
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-[160ms] ${
                                ['analysis-overall', 'analysis-product', 'analysis-department'].includes(currentMenu)
                                    ? 'bg-[#0f73f6] text-white'
                                    : 'text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                            onClick={() => {
                                setBizAnalysisMenuExpanded(!bizAnalysisMenuExpanded);
                                if (!bizAnalysisMenuExpanded) {
                                    setCurrentMenu('analysis-overall');
                                }
                            }}
                        >
                            <span className="text-[13px]">经营分析</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-[160ms] ${bizAnalysisMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单 */}
                        {bizAnalysisMenuExpanded && (
                            <div className="mt-0.5 space-y-0.5">
                                <div
                                    onClick={() => setCurrentMenu('analysis-overall')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] flex items-center justify-between ${
                                        currentMenu === 'analysis-overall'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    <span>整体分析</span>
                                    <span className="ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded bg-orange-500 text-white flex-shrink-0">本期改动</span>
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('analysis-product')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] flex items-center justify-between ${
                                        currentMenu === 'analysis-product'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    <span>产品分析</span>
                                    <span className="ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded bg-orange-500 text-white flex-shrink-0">本期改动</span>
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('analysis-department')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] flex items-center justify-between ${
                                        currentMenu === 'analysis-department'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    <span>部门分析</span>
                                    <span className="ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded bg-orange-500 text-white flex-shrink-0">本期改动</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 一级菜单：密钥管理 */}
                    <div className="mt-0.5">
                        <div
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-[160ms] ${
                                ['platform-key', 'platform-api'].includes(currentMenu)
                                    ? 'bg-[#0f73f6] text-white'
                                    : 'text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                            onClick={() => {
                                setPlatformConfigMenuExpanded(!platformConfigMenuExpanded);
                                if (!platformConfigMenuExpanded) {
                                    setCurrentMenu('platform-key');
                                }
                            }}
                        >
                            <span className="text-[13px]">密钥管理</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-[160ms] ${platformConfigMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单 */}
                        {platformConfigMenuExpanded && (
                            <div className="mt-0.5 space-y-0.5">
                                <div
                                    onClick={() => setCurrentMenu('platform-key')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] ${
                                        currentMenu === 'platform-key'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    密钥管理
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('platform-api')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] ${
                                        currentMenu === 'platform-api'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    系统间对接API接口
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 一级菜单：平台配置 */}
                    <div className="mt-0.5">
                        <div
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-[160ms] ${
                                ['platform-portal', 'platform-region'].includes(currentMenu)
                                    ? 'bg-[#0f73f6] text-white'
                                    : 'text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                            onClick={() => {
                                setPlatformSettingMenuExpanded(!platformSettingMenuExpanded);
                                if (!platformSettingMenuExpanded) {
                                    setCurrentMenu('platform-portal');
                                }
                            }}
                        >
                            <span className="text-[13px]">平台配置</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-[160ms] ${platformSettingMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单 */}
                        {platformSettingMenuExpanded && (
                            <div className="mt-0.5 space-y-0.5">
                                <div
                                    onClick={() => setCurrentMenu('platform-portal')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] flex items-center justify-between ${
                                        currentMenu === 'platform-portal'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    <span>企业配置</span>
                                    <span className="ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded bg-orange-500 text-white flex-shrink-0">本期改动</span>
                                </div>
                                <div
                                    onClick={() => setCurrentMenu('platform-region')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] flex items-center justify-between ${
                                        currentMenu === 'platform-region'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    <span>地域可用区</span>
                                    <span className="ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded bg-orange-500 text-white flex-shrink-0">本期改动</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 一级菜单：管理后台 */}
                    <div className="mt-0.5">
                        <div
                            className={`flex items-center justify-between px-3 py-2.5 rounded-md cursor-pointer transition-colors duration-[160ms] ${
                                currentMenu === 'zhiqi-admin'
                                    ? 'bg-[#0f73f6] text-white'
                                    : 'text-[#d0d0d0] hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                            onClick={() => {
                                setAdminMenuExpanded(!adminMenuExpanded);
                                if (!adminMenuExpanded) {
                                    setCurrentMenu('zhiqi-admin');
                                }
                            }}
                        >
                            <span className="text-[13px]">管理后台</span>
                            <svg className={`w-3.5 h-3.5 transition-transform duration-[160ms] ${adminMenuExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        {/* 二级菜单：智企管理后台 */}
                        {adminMenuExpanded && (
                            <div className="mt-0.5 space-y-0.5">
                                <div
                                    onClick={() => setCurrentMenu('zhiqi-admin')}
                                    className={`pl-[30px] pr-3 py-2 rounded-md cursor-pointer transition-colors duration-[140ms] text-[13px] ${
                                        currentMenu === 'zhiqi-admin'
                                            ? 'bg-[#3d3d3d] text-white'
                                            : 'text-[#cecece] hover:text-white hover:bg-[#3a3a3a]'
                                    }`}
                                >
                                    智企管理后台
                                </div>
                            </div>
                        )}
                    </div>
                </nav>

                {/* 底部智能助手按钮 */}
                <div className="flex-shrink-0 flex justify-center pb-4">
                    <button className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-white font-bold text-sm hover:bg-[#333] transition-colors shadow-lg cursor-pointer">
                        N
                    </button>
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="pl-[198px]">
                <div className="min-h-screen flex">
                    {/* 产品定义页面 */}
                    {currentMenu === 'product-define' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 搜索筛选区域 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* 搜索框 */}
                                    <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="支持产品名称、产品标识搜索"
                                            value={productSearchKeyword}
                                            onChange={(e) => setProductSearchKeyword(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    {/* 产品分类筛选 */}
                                    <select
                                        value={productCategoryFilter}
                                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                                        className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    >
                                        {productCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                    
                                    {/* 上线状态筛选 */}
                                    <select
                                        value={productStatusFilter}
                                        onChange={(e) => setProductStatusFilter(e.target.value)}
                                        className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    >
                                        {productStatuses.map(status => (
                                            <option key={status.value} value={status.value}>{status.label}</option>
                                        ))}
                                    </select>
                                    
                                    {/* 右侧按钮 */}
                                    <div className="flex items-center gap-2 ml-auto">
                                        <button className="text-sm text-blue-600 hover:text-blue-700">
                                            导出数据
                                        </button>
                                        <button
                                            onClick={openCreateProduct}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            创建产品
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 产品卡片网格 */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {zhihuiProductsData
                                    .filter(product => {
                                        const matchSearch = product.name.toLowerCase().includes(productSearchKeyword.toLowerCase()) ||
                                            product.identifier.toLowerCase().includes(productSearchKeyword.toLowerCase());
                                        const matchCategory = productCategoryFilter === 'all' || product.category.startsWith(productCategoryFilter);
                                        const matchStatus = productStatusFilter === 'all' || product.status === productStatusFilter;
                                        return matchSearch && matchCategory && matchStatus;
                                    })
                                    .map(product => (
                                    <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-3 relative hover:shadow-md transition-shadow">
                                        {/* 状态标签 */}
                                        <div className={`absolute top-3 right-3 px-1.5 py-0.5 text-xs rounded ${
                                            product.status === 'online' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {product.status === 'online' ? '已上线' : '已下线'}
                                        </div>
                                        
                                        {/* 产品图标 */}
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                            </svg>
                                        </div>
                                        
                                        {/* 产品信息 */}
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1.5 truncate pr-16">{product.name}</h3>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <div className="flex">
                                                <span className="w-14 text-gray-400 flex-shrink-0">分类</span>
                                                <span className="truncate">{product.category}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-14 text-gray-400 flex-shrink-0">标识</span>
                                                <span className="font-mono truncate">{product.identifier}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-14 text-gray-400 flex-shrink-0">可见</span>
                                                <span className="truncate">{product.visibility}</span>
                                            </div>
                                            <div className="flex">
                                                <span className="w-14 text-gray-400 flex-shrink-0">时间</span>
                                                <span className="truncate">{product.onlineTime}</span>
                                            </div>
                                        </div>
                                        
                                        {/* 操作按钮 */}
                                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                                            <button className={`px-3 py-1 text-xs rounded transition-colors ${
                                                product.status === 'online'
                                                    ? 'border border-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}>
                                                {product.status === 'online' ? '下线' : '上线'}
                                            </button>
                                            <button
                                                onClick={() => openEditProduct(product)}
                                                title="编辑产品"
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* 产品计费项页面 */}
                    {currentMenu === 'product-addon' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 搜索筛选区域 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                <div className="flex flex-wrap items-center gap-4">
                                    {/* 计费项名称搜索 */}
                                    <div className="relative w-64">
                                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="计费项名称搜索"
                                            value={billingItemSearch}
                                            onChange={(e) => setBillingItemSearch(e.target.value)}
                                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    {/* 所属产品筛选 */}
                                    <select
                                        value={billingProductFilter}
                                        onChange={(e) => setBillingProductFilter(e.target.value)}
                                        className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">所属产品</option>
                                        <option value="apimarket">API市场 APIMKT</option>
                                        <option value="oss">对象存储 OSS</option>
                                        <option value="mysql">云数据库 MySQL</option>
                                    </select>
                                    
                                    {/* 创建日期筛选 */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={billingStartDate}
                                            onChange={(e) => setBillingStartDate(e.target.value)}
                                            className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                        <span className="text-gray-500 text-sm">至</span>
                                        <input
                                            type="date"
                                            value={billingEndDate}
                                            onChange={(e) => setBillingEndDate(e.target.value)}
                                            className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    
                                    {/* 新建按钮 */}
                                    <button className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        新建计量项
                                    </button>
                                </div>
                            </div>
                            
                            {/* 计费项表格 */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12">序号</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">计费项名称</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">标签名称</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">计费项标识</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">所属产品</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">计费单位</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">用量计费规则</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">创建时间</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">备注</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billingItemsData
                                            .filter(item => {
                                                const matchSearch = billingItemSearch === "" || item.name.toLowerCase().includes(billingItemSearch.toLowerCase());
                                                const matchProduct = billingProductFilter === "" || item.product.toLowerCase().includes(billingProductFilter.toLowerCase());
                                                return matchSearch && matchProduct;
                                            })
                                            .map((item, index) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4 text-sm text-gray-500">{(billingCurrentPage - 1) * billingPageSize + index + 1}</td>
                                                <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.name}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500">{item.tagName}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500 font-mono text-xs">{item.identifier}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{item.product}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{item.unit}</td>
                                                <td className="py-3 px-4 text-sm text-gray-600">{item.rule}</td>
                                                <td className="py-3 px-4 text-sm text-gray-500">{item.createTime}</td>
                                                <td className="py-3 px-4 text-sm text-gray-400">{item.remark || '-'}</td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <button className="text-blue-600 hover:text-blue-700 text-sm">编辑</button>
                                                        <button className="text-blue-600 hover:text-blue-700 text-sm">删除</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {/* 分页 */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                    <div className="text-sm text-gray-500">
                                        共 {billingTotalCount} 条
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={billingPageSize}
                                            onChange={(e) => {
                                                setBillingPageSize(Number(e.target.value));
                                                setBillingCurrentPage(1);
                                            }}
                                            className="h-8 px-2 text-sm border border-gray-300 rounded"
                                        >
                                            <option value={10}>10条/页</option>
                                            <option value={20}>20条/页</option>
                                            <option value={50}>50条/页</option>
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <button 
                                                onClick={() => setBillingCurrentPage(Math.max(1, billingCurrentPage - 1))}
                                                disabled={billingCurrentPage === 1}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                &lt;
                                            </button>
                                            {[1, 2, 3, 4, 5, 6].map(page => (
                                                <button
                                                    key={page}
                                                    onClick={() => setBillingCurrentPage(page)}
                                                    className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                                                        billingCurrentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <span className="text-gray-400">...</span>
                                            <button
                                                onClick={() => setBillingCurrentPage(216)}
                                                className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                                                    billingCurrentPage === 216
                                                        ? 'bg-blue-600 text-white'
                                                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                }`}
                                            >
                                                216
                                            </button>
                                            <button 
                                                onClick={() => setBillingCurrentPage(Math.min(216, billingCurrentPage + 1))}
                                                disabled={billingCurrentPage === 216}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <span>前往</span>
                                            <input
                                                type="number"
                                                min={1}
                                                max={216}
                                                value={billingCurrentPage}
                                                onChange={(e) => setBillingCurrentPage(Math.min(216, Math.max(1, Number(e.target.value))))}
                                                className="w-12 h-8 text-center border border-gray-300 rounded"
                                            />
                                            <span>页</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 产品套餐页面 */}
                    {currentMenu === 'product-package' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 二级Tab切换 */}
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setResourcePackageTab("packages")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        resourcePackageTab === "packages"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    产品套餐
                                    {resourcePackageTab === "packages" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setResourcePackageTab("tasks")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        resourcePackageTab === "tasks"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    套餐发放任务
                                    {resourcePackageTab === "tasks" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>
                            
                            {/* 产品套餐 Tab 内容 */}
                            {resourcePackageTab === "packages" && (
                                <>
                                    {/* 搜索筛选区域 */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* 套餐名称搜索 */}
                                            <div className="relative w-64">
                                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    placeholder="套餐名称搜索"
                                                    value={resourcePackageSearch}
                                                    onChange={(e) => setResourcePackageSearch(e.target.value)}
                                                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            
                                            {/* 所属产品筛选 */}
                                            <select
                                                value={resourcePackageProductFilter}
                                                onChange={(e) => setResourcePackageProductFilter(e.target.value)}
                                                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">所属产品</option>
                                                <option value="tai">AI开发平台TAI</option>
                                                <option value="ces_sign">测试产品22</option>
                                                <option value="test_x">test</option>
                                            </select>
                                            
                                            {/* 类型筛选 */}
                                            <select
                                                value={resourcePackageTypeFilter}
                                                onChange={(e) => setResourcePackageTypeFilter(e.target.value)}
                                                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">全部类型</option>
                                                <option value="总价包">总价包</option>
                                                <option value="总量节省">总量节省</option>
                                                <option value="总价节省">总价节省</option>
                                            </select>
                                            
                                            {/* 状态筛选 */}
                                            <select
                                                value={resourcePackageStatusFilter}
                                                onChange={(e) => setResourcePackageStatusFilter(e.target.value)}
                                                className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">全部状态</option>
                                                <option value="online">已上架</option>
                                                <option value="offline">已下架</option>
                                            </select>
                                            
                                            {/* 创建日期筛选 */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="date"
                                                    value={resourcePackageStartDate}
                                                    onChange={(e) => setResourcePackageStartDate(e.target.value)}
                                                    className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                                <span className="text-gray-500 text-sm">至</span>
                                                <input
                                                    type="date"
                                                    value={resourcePackageEndDate}
                                                    onChange={(e) => setResourcePackageEndDate(e.target.value)}
                                                    className="h-9 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            
                                            {/* 新建按钮 */}
                                            <button className="ml-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                新建套餐
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* 套餐表格 */}
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-12">序号</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐标识</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">所属产品</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐类型</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">创建时间</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">更新时间</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">状态</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {resourcePackagesData
                                                    .filter(item => {
                                                        const matchSearch = resourcePackageSearch === "" || item.name.toLowerCase().includes(resourcePackageSearch.toLowerCase());
                                                        const matchProduct = resourcePackageProductFilter === "" || item.product.toLowerCase().includes(resourcePackageProductFilter.toLowerCase());
                                                        const matchType = resourcePackageTypeFilter === "" || item.type === resourcePackageTypeFilter;
                                                        const matchStatus = resourcePackageStatusFilter === "" || item.status === resourcePackageStatusFilter;
                                                        return matchSearch && matchProduct && matchType && matchStatus;
                                                    })
                                                    .map((item, index) => (
                                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-3 px-4 text-sm text-gray-500">{(resourcePackageCurrentPage - 1) * resourcePackagePageSize + index + 1}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.name}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-500 font-mono">{item.identifier}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{item.product}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-600">{item.type}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-500">{item.createTime}</td>
                                                        <td className="py-3 px-4 text-sm text-gray-500">{item.updateTime}</td>
                                                        <td className="py-3 px-4">
                                                            <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                                item.status === 'online' 
                                                                    ? 'bg-green-100 text-green-700' 
                                                                    : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                                {item.status === 'online' ? '已上架' : '已下架'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <button className="text-blue-600 hover:text-blue-700 text-sm">详情</button>
                                                                <button className="text-blue-600 hover:text-blue-700 text-sm">管理</button>
                                                                <button className="text-blue-600 hover:text-blue-700 text-sm">
                                                                    {item.status === 'online' ? '下架' : '上架'}
                                                                </button>
                                                                <button className="text-blue-600 hover:text-blue-700 text-sm">删除</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        
                                        {/* 分页 */}
                                        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                                            <div className="text-sm text-gray-500">
                                                共 {resourcePackageTotalCount} 条
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={resourcePackagePageSize}
                                                    onChange={(e) => {
                                                        setResourcePackagePageSize(Number(e.target.value));
                                                        setResourcePackageCurrentPage(1);
                                                    }}
                                                    className="h-8 px-2 text-sm border border-gray-300 rounded"
                                                >
                                                    <option value={10}>10条/页</option>
                                                    <option value={20}>20条/页</option>
                                                    <option value={50}>50条/页</option>
                                                </select>
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={() => setResourcePackageCurrentPage(Math.max(1, resourcePackageCurrentPage - 1))}
                                                        disabled={resourcePackageCurrentPage === 1}
                                                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        &lt;
                                                    </button>
                                                    {[1, 2, 3, 4, 5, 6, 7].map(page => (
                                                        <button
                                                            key={page}
                                                            onClick={() => setResourcePackageCurrentPage(page)}
                                                            className={`w-8 h-8 flex items-center justify-center rounded text-sm ${
                                                                resourcePackageCurrentPage === page
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    ))}
                                                    <button 
                                                        onClick={() => setResourcePackageCurrentPage(Math.min(7, resourcePackageCurrentPage + 1))}
                                                        disabled={resourcePackageCurrentPage === 7}
                                                        className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        &gt;
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                                    <span>前往</span>
                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={7}
                                                        value={resourcePackageCurrentPage}
                                                        onChange={(e) => setResourcePackageCurrentPage(Math.min(7, Math.max(1, Number(e.target.value))))}
                                                        className="w-12 h-8 text-center border border-gray-300 rounded"
                                                    />
                                                    <span>页</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {/* 套餐发放任务 Tab 内容 */}
                            {resourcePackageTab === "tasks" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-12">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">套餐发放任务</h3>
                                        <p className="text-gray-500">功能开发中...</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* 产品计费策略页面 */}
                    {currentMenu === 'product-billing' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 功能开发中提示 */}
                            <div className="bg-white rounded-lg border border-gray-200 p-12">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                                        智汇云产品计费策略
                                    </h3>
                                    <p className="text-gray-500">功能开发中...</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 客户账单页面 */}
                    {currentMenu === 'zhiqi-bill-customer' && (
                        <div className="flex-1 bg-gray-50 overflow-auto flex flex-col">
                            <div className="p-6 overflow-auto flex-1">
                            {/* 顶部筛选栏 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {/* 账单类型选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="monthly">月账单</option>
                                        <option value="daily">日账单</option>
                                        <option value="hourly">小时账单</option>
                                    </select>
                                    {/* 账期选择 */}
                                    <input
                                        type="month"
                                        defaultValue="2026-03"
                                        className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    {/* 所属产品 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">所属产品</option>
                                        <option value="llm">大模型</option>
                                        <option value="lobster">龙虾</option>
                                        <option value="apicloud">APICloud</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 text-blue-600 border border-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors">
                                        导出详情
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                        导出数据
                                    </button>
                                </div>
                            </div>

                            {/* 客户账单表格 */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">租户名称</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">租户标识</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账期年月</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">官方标准价金额（¥）</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">客户应付总金额（¥）/环比上月</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">客户欠费总金额（¥）</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">腾讯科技</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">tencent_tech</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">28,456,230.15</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">18,234,567.89</span>
                                                <span className="ml-2 text-green-600">↓ 5.32%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(19,258,432.10)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">阿里巴巴</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">alibaba_group</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">22,189,456.78</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">15,678,234.56</span>
                                                <span className="ml-2 text-red-600">↑ 8.45%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(14,455,678.90)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">字节跳动</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">bytedance</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,567,890.23</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">12,345,678.90</span>
                                                <span className="ml-2 text-green-600">↓ 12.56%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(14,123,456.78)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">华为技术</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">huawei_tech</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">15,890,123.45</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">9,876,543.21</span>
                                                <span className="ml-2 text-red-600">↑ 3.28%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(9,562,345.67)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">百度在线</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">baidu_online</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">12,345,678.90</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">7,654,321.09</span>
                                                <span className="ml-2 text-green-600">↓ 2.15%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(7,822,456.78)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">京东集团</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">jd_group</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">9,876,543.21</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">5,432,109.87</span>
                                                <span className="ml-2 text-red-600">↑ 15.67%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(4,695,876.54)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">美团点评</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">meituan</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">7,654,321.09</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">4,321,098.76</span>
                                                <span className="ml-2 text-green-600">↓ 8.92%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(4,743,210.98)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">小米科技</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">xiaomi_tech</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">5,432,109.87</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">3,210,987.65</span>
                                                <span className="ml-2 text-red-600">↑ 6.34%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(3,019,234.56)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">网易公司</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">netease</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">4,321,098.76</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">2,567,890.12</span>
                                                <span className="ml-2 text-green-600">↓ 4.21%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(2,680,765.43)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900 font-medium">滴滴出行</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 font-mono">didi_chuxing</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">202603</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">3,210,987.65</td>
                                            <td className="px-4 py-3 text-sm text-right">
                                                <span className="font-mono">1,987,654.32</span>
                                                <span className="ml-2 text-red-600">↑ 2.89%</span>
                                                <span className="ml-1 text-gray-400 text-xs">(1,931,876.54)</span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">结算中</td>
                                            <td className="px-4 py-3 text-center">
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">产品账单</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 分页 */}
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-4 rounded-b-lg">
                                <div className="text-sm text-gray-500">
                                    共 <span className="font-medium">36</span> 条
                                </div>
                                <div className="flex items-center gap-2">
                                    <select className="h-8 px-2 border border-gray-300 rounded text-sm">
                                        <option value="10">10条/页</option>
                                        <option value="20">20条/页</option>
                                        <option value="50">50条/页</option>
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                        <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">2</button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">3</button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">4</button>
                                        <span className="px-2 text-gray-400">...</span>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                    </div>
                                    <div className="flex items-center gap-1 ml-2">
                                        <span className="text-sm text-gray-600">前往</span>
                                        <input type="number" className="w-12 h-8 px-2 border border-gray-300 rounded text-sm text-center" defaultValue="1" />
                                        <span className="text-sm text-gray-600">页</span>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    )}
                    
                    {/* 智汇云产品账单页面 */}
                    {currentMenu === 'zhiqi-bill-product' && (
                        <div className="flex-1 bg-gray-50 overflow-auto flex flex-col">
                            <div className="p-6 overflow-auto flex-1">
                            {/* 顶部筛选栏 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {/* 账单类型选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="monthly">月账单</option>
                                        <option value="daily">日账单</option>
                                        <option value="hourly">小时账单</option>
                                    </select>
                                    {/* 账期选择 */}
                                    <input
                                        type="month"
                                        defaultValue="2026-03"
                                        className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    {/* 所属产品 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">所属产品</option>
                                        <option value="llm">大模型</option>
                                        <option value="lobster">龙虾</option>
                                        <option value="apicloud">APICloud</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 text-blue-600 border border-blue-600 text-sm rounded-lg hover:bg-blue-50 transition-colors">
                                        导出详情
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                        导出数据
                                    </button>
                                </div>
                            </div>

                            {/* 产品账单表格 */}
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">产品名称</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">账期年月</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">官方标准价金额（¥）</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">客户应付总金额（¥）/环比上月</th>
                                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">客户欠费总金额（¥）</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {productBillData.map((row) => {
                                            const agg = aggregateProductBillRow(row);
                                            const isMerged = row.portals.length > 1;
                                            const isExpanded = expandedBillRowIds.includes(row.id);
                                            const mom = getBillMomChange(agg.payableAmount, agg.payableLastPeriod);
                                            return (
                                                <React.Fragment key={row.id}>
                                                    <tr className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                                            <div className="flex items-center">
                                                                {isMerged ? (
                                                                    <button
                                                                        onClick={() => setExpandedBillRowIds((prev) => prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id])}
                                                                        className="mr-1.5 p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                                        title={isExpanded ? "收起" : "展开查看各Portal数据"}
                                                                    >
                                                                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </button>
                                                                ) : (
                                                                    <span className="w-6 flex-shrink-0"></span>
                                                                )}
                                                                <span>{row.productName}</span>
                                                                {/* 内外Portal已关联的合并行：外层仅展示产品名称，产品标识在展开的各Portal子行中查看 */}
                                                                {!isMerged && (
                                                                    <span className="ml-2 text-xs text-gray-500 font-mono">
                                                                        {row.portals[0].productIdentifier}
                                                                    </span>
                                                                )}
                                                                {isMerged && (
                                                                    <span className="ml-2 px-1.5 py-0.5 text-[10px] leading-none rounded bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0">内外Portal关联</span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{row.period}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">{agg.standardAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
                                                        <td className="px-4 py-3 text-sm text-right">
                                                            <span className="font-mono">{agg.payableAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                                                            <span className={`ml-2 ${mom.up ? 'text-red-600' : 'text-green-600'}`}>{mom.up ? '↑' : '↓'} {mom.pct.toFixed(2)}%</span>
                                                            <span className="ml-1 text-gray-400 text-xs">({agg.payableLastPeriod.toLocaleString('zh-CN', { minimumFractionDigits: 2 })})</span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-right font-mono text-orange-600">
                                                            {agg.settling ? '结算中' : agg.arrearsAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">客户账单</button>
                                                            <button className="text-blue-600 hover:text-blue-700 text-sm mr-3">计费明细</button>
                                                            <button className="text-blue-600 hover:text-blue-700 text-sm">变化趋势</button>
                                                        </td>
                                                    </tr>
                                                    {isExpanded && (
                                                        <>
                                                            <tr className="bg-blue-50/40 border-b border-blue-50">
                                                                <td colSpan={6} className="px-6 py-2">
                                                                    <div className="text-xs text-gray-500">
                                                                        该产品在 <span className="font-medium text-gray-700">{row.portals.length}</span> 个Portal下关联，下列为各Portal独立数据（合计行 = 各Portal对应列相加）：
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            {row.portals.map((portal, idx) => {
                                                                const pMom = getBillMomChange(portal.payableAmount, portal.payableLastPeriod);
                                                                return (
                                                                    <tr key={idx} className="bg-gray-50/70 hover:bg-gray-100">
                                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                                            <div className="flex items-center pl-6">
                                                                                <svg className="w-4 h-4 text-gray-400 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                                                </svg>
                                                                                <span>{portal.portalName}</span>
                                                                                <span className="ml-1.5 text-xs text-gray-400 font-mono">{portal.productIdentifier}</span>
                                                                                <span className={`ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded flex-shrink-0 ${portal.internal ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-teal-50 text-teal-600 border border-teal-100'}`}>
                                                                                    {portal.internal ? '内部Portal' : '外部Portal'}
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm text-gray-500">{row.period}</td>
                                                                        <td className="px-4 py-3 text-sm text-gray-600 text-right font-mono">{portal.standardAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</td>
                                                                        <td className="px-4 py-3 text-sm text-right">
                                                                            <span className="font-mono text-gray-600">{portal.payableAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
                                                                            <span className={`ml-2 ${pMom.up ? 'text-red-600' : 'text-green-600'}`}>{pMom.up ? '↑' : '↓'} {pMom.pct.toFixed(2)}%</span>
                                                                            <span className="ml-1 text-gray-400 text-xs">({portal.payableLastPeriod.toLocaleString('zh-CN', { minimumFractionDigits: 2 })})</span>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-sm text-right font-mono text-gray-500">
                                                                            {portal.settling ? '结算中' : portal.arrearsAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-center">
                                                                            <button className="text-blue-500 hover:text-blue-600 text-sm mr-3">客户账单</button>
                                                                            <button className="text-blue-500 hover:text-blue-600 text-sm mr-3">计费明细</button>
                                                                            <button className="text-blue-500 hover:text-blue-600 text-sm">变化趋势</button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* 分页 */}
                            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-4 rounded-b-lg">
                                <div className="text-sm text-gray-500">
                                    共 <span className="font-medium">9</span> 条
                                </div>
                                <div className="flex items-center gap-2">
                                    <select className="h-8 px-2 border border-gray-300 rounded text-sm">
                                        <option value="10">10条/页</option>
                                        <option value="20">20条/页</option>
                                        <option value="50">50条/页</option>
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                        <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                                        <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    )}

                    {/* 内网账单页面 */}
                    {currentMenu === 'zhiqi-bill-intranet' && (
                        <div className="flex-1 bg-white overflow-auto flex flex-col">
                            <div className="p-6 overflow-auto flex-1">
                            {/* 二级Tab：部门账单/产品账单 */}
                            <div className="flex items-center gap-6 mb-4 border-b border-gray-200">
                                <button
                                    onClick={() => setIntranetBillTypeTab("department")}
                                    className={`px-1 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                        intranetBillTypeTab === "department"
                                            ? "text-blue-600 border-blue-600"
                                            : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    部门账单
                                </button>
                                <button
                                    onClick={() => setIntranetBillTypeTab("product")}
                                    className={`px-1 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                                        intranetBillTypeTab === "product"
                                            ? "text-blue-600 border-blue-600"
                                            : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                                    }`}
                                >
                                    产品账单
                                </button>
                            </div>

                            {/* 顶部筛选栏 */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    {/* 账单类型选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="monthly">月账单</option>
                                        <option value="daily">日账单</option>
                                        <option value="hourly">小时账单</option>
                                    </select>
                                    {/* 账期选择 */}
                                    <input
                                        type="month"
                                        defaultValue="2026-03"
                                        className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    {/* 部门选择 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-gray-500">
                                        <option value="">请选择部门</option>
                                        <option value="dev">智汇云-智能工程部</option>
                                        <option value="sys">智汇云-系统部</option>
                                        <option value="biz">商业化业务线</option>
                                        <option value="cloud">智汇云-云平台部</option>
                                        <option value="search">搜索事业部</option>
                                    </select>
                                    {/* 账单状态 */}
                                    <select className="h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">全部账单状态</option>
                                        <option value="unsettled">未结算</option>
                                        <option value="settled">已结算</option>
                                        <option value="overdue">已逾期</option>
                                    </select>
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                    导出数据
                                </button>
                            </div>

                            {/* 部门账单表格 */}
                            {intranetBillTypeTab === "department" && (
                                <>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部门名称</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账期年月</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">官方标准价金额（¥）</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">优惠金额（¥）</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">应付金额（¥）/环比上月</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">欠费金额（¥）</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">账单状态</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">智汇云-智能工程部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">22,861,031.55</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">10,808,145.66</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">12,052,885.89</span>
                                                    <span className="ml-2 text-green-600">↓ 0.56%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(15,408,102.19)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">智汇云-系统部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,208,783.96</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">7,559,654.43</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">10,649,129.53</span>
                                                    <span className="ml-2 text-green-600">↓ 0.10%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(1,121,300.15)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">商业化业务线</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,628,122.82</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">8,386,334.47</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">10,241,788.35</span>
                                                    <span className="ml-2 text-green-600">↓ 0.23%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(3,069,008.13)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">智汇云-云平台部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">15,186,107.25</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">6,427,453.66</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">8,758,653.59</span>
                                                    <span className="ml-2 text-green-600">↓ 0.09%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(887,269.31)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">搜索事业部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">12,396,321.83</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">5,936,599.01</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">6,459,722.82</span>
                                                    <span className="ml-2 text-green-600">↓ 0.60%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(9,568,335.01)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">360借条</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">7,800,044.02</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">1,778,658.88</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">6,021,385.14</span>
                                                    <span className="ml-2 text-green-600">↓ 0.04%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(225,636.12)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">360人工智能研究院(AI大模型)</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">10,395,873.38</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">5,069,833.75</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">5,326,039.63</span>
                                                    <span className="ml-2 text-red-600">↑ 0.00%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(13,556.45)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">安全技术中台</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">7,469,854.56</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">3,598,878.47</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">3,870,976.09</span>
                                                    <span className="ml-2 text-green-600">↓ 0.35%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(2,063,958.64)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">360人工智能研究院</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">3,405,592.19</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">1,699,960.68</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">1,705,631.51</span>
                                                    <span className="ml-2 text-red-600">↑ 1.12%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(900,955.49)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">智汇云-应用平台部</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">2,749,370.08</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">1,200,456.35</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">1,548,913.73</span>
                                                    <span className="ml-2 text-red-600">↑ 0.07%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(98,340.49)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* 分页 */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-4 rounded-b-lg">
                                    <div className="text-sm text-gray-500">
                                        共 <span className="font-medium">10</span> 条
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select className="h-8 px-2 border border-gray-300 rounded text-sm">
                                            <option value="10">10条/页</option>
                                            <option value="20">20条/页</option>
                                            <option value="50">50条/页</option>
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                        </div>
                                    </div>
                                </div>
                                </>
                            )}

                            {/* 产品账单表格 */}
                            {intranetBillTypeTab === "product" && (
                                <>
                                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-200">
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">产品名称</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账期年月</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">官方标准价金额（¥）</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">优惠金额（¥）</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">应付金额（¥）/环比上月</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">欠费金额（¥）</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">账单状态</th>
                                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">大模型</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">35,256,789.12</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">12,345,678.90</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">22,911,110.22</span>
                                                    <span className="ml-2 text-red-600">↑ 5.67%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(21,678,234.56)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">APICloud</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">18,456,789.23</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">6,567,890.34</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">11,888,898.89</span>
                                                    <span className="ml-2 text-green-600">↓ 3.21%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(12,283,456.78)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">龙虾</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">12,345,678.90</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">4,567,890.12</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">7,777,788.78</span>
                                                    <span className="ml-2 text-red-600">↑ 2.34%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(7,600,123.45)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">短信服务</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">5,678,901.23</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">1,234,567.89</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">4,444,333.34</span>
                                                    <span className="ml-2 text-green-600">↓ 1.56%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(4,514,789.01)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">存储服务</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">202603</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">3,456,789.01</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">890,123.45</td>
                                                <td className="px-4 py-3 text-sm text-right">
                                                    <span className="font-mono">2,566,665.56</span>
                                                    <span className="ml-2 text-red-600">↑ 0.89%</span>
                                                    <span className="ml-1 text-gray-400 text-xs">(2,544,012.34)</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">0.00</td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-orange-600 text-sm">未结算</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button className="text-blue-600 hover:text-blue-700 text-sm">账单详情</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* 分页 */}
                                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white mt-4 rounded-b-lg">
                                    <div className="text-sm text-gray-500">
                                        共 <span className="font-medium">5</span> 条
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select className="h-8 px-2 border border-gray-300 rounded text-sm">
                                            <option value="10">10条/页</option>
                                            <option value="20">20条/页</option>
                                            <option value="50">50条/页</option>
                                        </select>
                                        <div className="flex items-center gap-1">
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">‹</button>
                                            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded text-sm">1</button>
                                            <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded text-sm hover:bg-gray-50">›</button>
                                        </div>
                                    </div>
                                </div>
                                </>
                            )}
                            </div>
                        </div>
                    )}
                    
                    {/* 经营分析 - 整体分析页面 */}
                    {currentMenu === 'analysis-overall' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 顶部说明提示 */}
                            <div className="mb-4 rounded-lg border border-red-100 bg-red-50/60 px-4 py-3">
                                <p className="text-[13px] leading-[1.9] text-red-500">
                                    1、月账单：次月第3个工作日8点后为准确数据；2、天账单：次日14点后为准确数据；3、小时账单：今天12点后，昨天的小时帐为准确数据。整体分析展示平台侧全部产品的收入与成本合计，各列取值为「产品分析」对应列的求和。
                                </p>
                            </div>

                            {/* 筛选工具栏 */}
                            <div className="mb-4 flex flex-wrap items-center gap-3">
                                {/* 账单类型（按月/天/小时切换） */}
                                <div className="inline-flex h-9 items-center rounded-lg border border-gray-300 bg-white p-0.5">
                                    {analysisBillTypes.map((t) => (
                                        <button
                                            key={t.value}
                                            onClick={() => { setOverallBillType(t.value); setOverallPage(1); }}
                                            className={`h-8 rounded-md px-4 text-sm transition-colors ${
                                                overallBillType === t.value
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                {/* 账期选择：月 / 天 */}
                                {overallBillType === "month" ? (
                                    <input
                                        type="month"
                                        value={overallMonth}
                                        onChange={(e) => { setOverallMonth(e.target.value); setOverallPage(1); }}
                                        className="h-9 w-[200px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                                    />
                                ) : (
                                    <input
                                        type="date"
                                        value={overallDate}
                                        onChange={(e) => { setOverallDate(e.target.value); setOverallPage(1); }}
                                        className="h-9 w-[200px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                                    />
                                )}

                                {/* 导出数据 */}
                                <button className="ml-auto h-9 rounded-lg bg-blue-600 px-4 text-sm text-white transition-colors hover:bg-blue-700">
                                    导出数据
                                </button>
                            </div>

                            {/* 汇总卡片：hover 展示精确金额，交互与列表金额单元格一致 */}
                            <div className="mb-4 grid grid-cols-3 gap-4">
                                <div className="rounded-lg border border-gray-200 bg-white p-5">
                                    <div className="mb-2 text-sm text-gray-500">总收入</div>
                                    <span className="group/amt relative inline-block text-2xl font-bold text-blue-600">
                                        {formatWan(overallSummary.totalRevenue)}
                                        <span className="pointer-events-none absolute bottom-full left-0 z-30 mb-1.5 hidden whitespace-nowrap rounded bg-gray-700 px-2.5 py-1 text-[12px] font-normal text-white shadow-lg group-hover/amt:block">
                                            {formatExactAmount(overallSummary.totalRevenue)}
                                            <span className="absolute left-4 top-full border-4 border-transparent border-t-gray-700" />
                                        </span>
                                    </span>
                                </div>
                                <div className="rounded-lg border border-gray-200 bg-white p-5">
                                    <div className="mb-2 text-sm text-gray-500">总成本</div>
                                    <span className="group/amt relative inline-block text-2xl font-bold text-orange-500">
                                        {formatWan(overallSummary.productCost)}
                                        <span className="pointer-events-none absolute bottom-full left-0 z-30 mb-1.5 hidden whitespace-nowrap rounded bg-gray-700 px-2.5 py-1 text-[12px] font-normal text-white shadow-lg group-hover/amt:block">
                                            {formatExactAmount(overallSummary.productCost)}
                                            <span className="absolute left-4 top-full border-4 border-transparent border-t-gray-700" />
                                        </span>
                                    </span>
                                </div>
                                <div className="rounded-lg border border-gray-200 bg-white p-5">
                                    <div className="mb-2 text-sm text-gray-500">收支差额</div>
                                    <span className={`group/amt relative inline-block text-2xl font-bold ${overallSummary.balance >= 0 ? "text-green-600" : "text-red-500"}`}>
                                        {formatWan(overallSummary.balance)}
                                        <span className="pointer-events-none absolute bottom-full left-0 z-30 mb-1.5 hidden whitespace-nowrap rounded bg-gray-700 px-2.5 py-1 text-[12px] font-normal text-white shadow-lg group-hover/amt:block">
                                            {formatExactAmount(overallSummary.balance)}
                                            <span className="absolute left-4 top-full border-4 border-transparent border-t-gray-700" />
                                        </span>
                                    </span>
                                </div>
                            </div>

                            {/* 第一部分：变化曲线图（双坐标：金额 + 毛利率） */}
                            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-5">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="text-sm font-medium text-gray-900">收入 / 成本变化趋势</div>
                                    <div className="text-[12px] text-gray-400">{overallChartRangeTip}</div>
                                </div>
                                <OverallTrendChart rows={overallChartRows} billType={overallBillType} />
                            </div>

                            {/* 第二部分：数据列表（字段为产品分析各列之和） */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[1900px]">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <AnalysisTh label="账期" align="left" width="120px" />
                                                <AnalysisTh label="总收入(元)" tip="平台侧全部产品在本账期内的收入合计。" width="110px" />
                                                <AnalysisTh label="公司内收入(元)" tip="来自公司内部各部门与中台的收入合计。" width="110px" />
                                                <AnalysisTh label="公司内非中台收入(元)" width="110px" />
                                                <AnalysisTh label="中台内非智汇云收入(元)" width="110px" />
                                                <AnalysisTh label="智汇云内非本结算单元收入(元)" width="120px" />
                                                <AnalysisTh label="本结算单元收入(元)" width="110px" />
                                                <AnalysisTh label="公司外收入(元)" tip="来自公司外部客户的收入合计。" width="110px" />
                                                <AnalysisTh label="外部收入对应的内结算价收入(元)" width="120px" />
                                                <AnalysisTh label="内结算总收入(元)" width="110px" />
                                                <AnalysisTh label="产品成本(元)" tip="平台侧全部产品在本账期内分摊的资源成本合计。" width="110px" />
                                                <AnalysisTh label="内结算价利润(元)" tip="内结算总收入 - 产品成本。" width="110px" />
                                                <AnalysisTh label="外部利润(元)" tip="公司外收入 - 外部收入对应的内结算价收入。" width="105px" />
                                                <AnalysisTh label="内结算毛利率" tip="内结算价利润 / 内结算总收入 × 100%。特殊说明：此处为整体对应的毛利。" width="100px" highlight />
                                                <AnalysisTh label="外部毛利率" tip="外部利润 / 公司外收入 × 100%。特殊说明：此处为整体对应的毛利。" width="95px" highlight />
                                                <AnalysisTh label="收支差额(元)" width="110px" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {pagedOverallRows.map((row) => (
                                                <tr key={row.id} className="hover:bg-gray-50">
                                                    <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{row.period}</td>
                                                    <AnalysisAmountCell value={row.totalRevenue} link />
                                                    <AnalysisAmountCell value={row.innerRevenue} link />
                                                    <AnalysisAmountCell value={row.innerNonMidRevenue} link />
                                                    <AnalysisAmountCell value={row.midNonZyunRevenue} link />
                                                    <AnalysisAmountCell value={row.zyunNonUnitRevenue} />
                                                    <AnalysisAmountCell value={row.unitRevenue} />
                                                    <AnalysisAmountCell value={row.outerRevenue} link />
                                                    <AnalysisAmountCell value={row.outerInnerPriceRevenue} />
                                                    <AnalysisAmountCell value={row.innerTotalRevenue} />
                                                    <AnalysisAmountCell value={row.productCost} link />
                                                    <AnalysisAmountCell value={row.innerProfit} />
                                                    <AnalysisAmountCell value={row.outerProfit} />
                                                    <td className="bg-orange-50/70 px-3 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                                                        {row.innerMargin.toFixed(2)}%
                                                    </td>
                                                    <td className="bg-orange-50/70 px-3 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                                                        {row.outerMargin.toFixed(2)}%
                                                    </td>
                                                    <AnalysisAmountCell value={row.balance} />
                                                </tr>
                                            ))}
                                            {pagedOverallRows.length === 0 && (
                                                <tr>
                                                    <td colSpan={16} className="px-4 py-12 text-center text-sm text-gray-400">
                                                        暂无符合条件的数据
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 分页 */}
                            <div className="mt-4 flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3">
                                <div className="text-sm text-gray-500">
                                    共 <span className="font-medium">{overallListRows.length}</span> 条
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={overallPageSize}
                                        onChange={(e) => { setOverallPageSize(Number(e.target.value)); setOverallPage(1); }}
                                        className="h-8 rounded border border-gray-300 px-2 text-sm"
                                    >
                                        <option value={10}>10条/页</option>
                                        <option value={20}>20条/页</option>
                                        <option value={50}>50条/页</option>
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setOverallPage(Math.max(1, overallPage - 1))}
                                            disabled={overallPage === 1}
                                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: overallTotalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setOverallPage(p)}
                                                className={`flex h-8 w-8 items-center justify-center rounded text-sm ${
                                                    p === overallPage
                                                        ? "bg-blue-600 text-white"
                                                        : "border border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setOverallPage(Math.min(overallTotalPages, overallPage + 1))}
                                            disabled={overallPage === overallTotalPages}
                                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 经营分析 - 产品分析页面 */}
                    {currentMenu === 'analysis-product' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 顶部说明提示 */}
                            <div className="mb-4 rounded-lg border border-red-100 bg-red-50/60 px-4 py-3">
                                <p className="text-[13px] leading-[1.9] text-red-500">
                                    1、月账单：次月第3个工作日8点后为准确数据；2、天账单：次日14点后为准确数据；3、小时账单：今天12点后，昨天的小时帐为准确数据。特殊说明：短信每个月28号用户中心的账单会拆分到其他部门，裸金属GPU（整机）、裸金属CPU（整机）、CDN、PCDN、音视频通话RTC 每个月第二个工作日12点ops锁账后上报外部成本
                                </p>
                            </div>

                            {/* 筛选工具栏 */}
                            <div className="mb-4 flex flex-wrap items-start gap-3">
                                {/* 账单类型 */}
                                <select
                                    value={analysisBillType}
                                    onChange={(e) => { setAnalysisBillType(e.target.value); setAnalysisPage(1); }}
                                    className="h-9 w-[200px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                                >
                                    {analysisBillTypes.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>

                                {/* 账期 */}
                                <input
                                    type="month"
                                    value={analysisPeriod}
                                    onChange={(e) => { setAnalysisPeriod(e.target.value); setAnalysisPage(1); }}
                                    className="h-9 w-[200px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                                />

                                {/* 所属产线 */}
                                <select
                                    value={analysisProductLine}
                                    onChange={(e) => { setAnalysisProductLine(e.target.value); setAnalysisPage(1); }}
                                    className={`h-9 w-[190px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 ${analysisProductLine ? "text-gray-900" : "text-gray-400"}`}
                                >
                                    <option value="">所属产线</option>
                                    {analysisProductLines.map((l) => (
                                        <option key={l} value={l}>{l}</option>
                                    ))}
                                </select>

                                {/* 产品名称（多选标签） */}
                                <div className="relative w-[200px]">
                                    {/* 点击外部关闭下拉 */}
                                    {analysisProductPickerOpen && (
                                        <div className="fixed inset-0 z-10" onClick={() => setAnalysisProductPickerOpen(false)} />
                                    )}
                                    <div
                                        onClick={() => setAnalysisProductPickerOpen(!analysisProductPickerOpen)}
                                        className="min-h-[36px] w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-2 py-1.5 pr-7 text-sm focus:outline-none"
                                    >
                                        {analysisProductTags.length === 0 ? (
                                            <span className="leading-[24px] text-gray-400">产品名称</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {analysisProductTags.map((tag) => (
                                                    <span key={tag} className="inline-flex max-w-full items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[12px] text-gray-700">
                                                        <span className="truncate">{tag}</span>
                                                        <svg
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setAnalysisProductTags(analysisProductTags.filter((t) => t !== tag));
                                                            }}
                                                            className="h-3 w-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
                                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </span>
                                                ))}
                                                <span className="inline-flex items-center rounded bg-gray-100 px-1.5 py-0.5 text-[12px] text-gray-700">+ 188</span>
                                            </div>
                                        )}
                                    </div>
                                    <svg className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>

                                    {/* 产品下拉选择面板 */}
                                    {analysisProductPickerOpen && (
                                        <div className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-[260px] w-[280px] overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                            {productAnalysisData.map((row) => {
                                                const short = row.productName.length > 22 ? `${row.productName.slice(0, 22)}...` : row.productName;
                                                const checked = analysisProductTags.includes(short);
                                                return (
                                                    <label key={row.id} className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50">
                                                        <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() =>
                                                                setAnalysisProductTags(
                                                                    checked
                                                                        ? analysisProductTags.filter((t) => t !== short)
                                                                        : [...analysisProductTags, short]
                                                                )
                                                            }
                                                            className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-0"
                                                        />
                                                        <span className="truncate">{row.productName}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* 结算单元 */}
                                <select
                                    value={analysisSettlementUnit}
                                    onChange={(e) => { setAnalysisSettlementUnit(e.target.value); setAnalysisPage(1); }}
                                    className={`h-9 w-[190px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 ${analysisSettlementUnit ? "text-gray-900" : "text-gray-400"}`}
                                >
                                    <option value="">结算单元</option>
                                    {analysisSettlementUnits.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>

                                {/* 搜索 */}
                                <button
                                    onClick={() => setAnalysisPage(1)}
                                    className="h-9 rounded-lg bg-blue-600 px-5 text-sm text-white transition-colors hover:bg-blue-700"
                                >
                                    搜索
                                </button>

                                {/* 导出数据 */}
                                <button className="ml-auto h-9 rounded-lg bg-blue-600 px-4 text-sm text-white transition-colors hover:bg-blue-700">
                                    导出数据
                                </button>
                            </div>

                            {/* 数据表格 */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[2260px]">
                                        <thead>
                                            {/* 第一行表头：橙色底，「公司外收入」跨两列 */}
                                            <tr className="border-b border-orange-300 bg-orange-100">
                                                <AnalysisTh label="账期" align="left" width="80px" rowSpan={2} />
                                                <AnalysisTh label="所属产线" align="left" width="90px" rowSpan={2} />
                                                <AnalysisTh label="归属结算单元(ops)" align="left" width="120px" rowSpan={2} />
                                                <AnalysisTh
                                                    label="产品名称"
                                                    align="left"
                                                    width="150px"
                                                    rowSpan={2}
                                                    highlight
                                                    tip="基于产品创建时「内部portal」与「外部portal」的关联关系，同一产品合并为一行展示；点击展开可分别查看内、外Portal产品各列数据，外层产品行为各Portal对应列之和（「内结算毛利率」「外部毛利率」两列除外）。"
                                                />
                                                <AnalysisTh label="总收入(元)" tip="该产品在本账期内的全部收入合计，含公司内收入与公司外收入。" width="110px" rowSpan={2} highlight />
                                                <AnalysisTh label="公司内收入(元)" tip="来自公司内部各部门与中台的收入合计，拆分为「集团内部结算单元账单」与「内部结算单元账号在外部portal使用费用」两部分来源。" width="110px" rowSpan={2} highlight />
                                                <AnalysisTh label="公司内非中台收入(元)" width="110px" rowSpan={2} />
                                                <AnalysisTh label="中台内非智汇云收入(元)" width="110px" rowSpan={2} />
                                                <AnalysisTh label="智汇云内非本结算单元收入(元)" width="120px" rowSpan={2} />
                                                <AnalysisTh label="本结算单元收入(元)" width="110px" rowSpan={2} />
                                                <AnalysisTh
                                                    label="公司外收入(元)"
                                                    align="center"
                                                    colSpan={2}
                                                    highlight
                                                    tip="来自公司外部客户的收入合计，拆分为「集团内的外部事业部」（内部portal下标记为外部的客户）与「外部(360.cn)」（非内部portal的收入）两部分分开统计。"
                                                />
                                                <AnalysisTh label="外部收入对应的内结算价收入(元)" width="120px" rowSpan={2} />
                                                <AnalysisTh label="内结算总收入(元)" width="110px" rowSpan={2} />
                                                <AnalysisTh label="产品成本(元)" tip="该产品在本账期内分摊的资源成本合计。" width="110px" rowSpan={2} />
                                                <AnalysisTh label="内结算价利润(元)" tip="内结算总收入 - 产品成本。" width="110px" rowSpan={2} />
                                                <AnalysisTh label="外部利润(元)" tip="公司外收入 - 外部收入对应的内结算价收入。" width="105px" rowSpan={2} />
                                                <AnalysisTh label="内结算毛利率" tip="内结算价利润 / 内结算总收入 × 100%。特殊说明：此处为整体对应的毛利。" width="100px" rowSpan={2} />
                                                <AnalysisTh label="外部毛利率" tip="外部利润 / 公司外收入 × 100%。特殊说明：此处为整体对应的毛利。" width="95px" rowSpan={2} />
                                                <AnalysisTh label="收支差额(元)" width="110px" rowSpan={2} />
                                            </tr>
                                            {/* 第二行表头：公司外收入的两个子列 */}
                                            <tr className="border-b border-orange-300 bg-orange-100">
                                                <AnalysisTh
                                                    label="集团内的外部事业部"
                                                    width="120px"
                                                    highlight
                                                    tip="内部portal下、客户属性标记为「外部」的客户所产生的收入。"
                                                />
                                                <AnalysisTh
                                                    label="外部(360.cn)"
                                                    width="120px"
                                                    highlight
                                                    tip="非内部portal（即外部portal / 360.cn 官网）产生的收入。"
                                                />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {pagedAnalysisRows.map((row) => {
                                                const portalRows = getAnalysisPortalRows(row);
                                                const isMerged = portalRows.length > 1;
                                                const isExpanded = expandedAnalysisRowIds.includes(row.id);
                                                return (
                                                <React.Fragment key={row.id}>
                                                <tr className="hover:bg-gray-50">
                                                    <td className="px-3 py-3 text-sm text-gray-900">{row.period}</td>
                                                    <td className="px-3 py-3 text-sm text-gray-900">{row.productLine}</td>
                                                    <td className="px-3 py-3 text-sm text-gray-900">{row.settlementUnit}</td>
                                                    <td className="px-3 py-3 text-sm bg-orange-50/70">
                                                        <div className="flex items-center">
                                                            {isMerged ? (
                                                                <button
                                                                    onClick={() => setExpandedAnalysisRowIds((prev) => prev.includes(row.id) ? prev.filter((id) => id !== row.id) : [...prev, row.id])}
                                                                    className="mr-1 p-0.5 hover:bg-orange-100 rounded transition-colors flex-shrink-0"
                                                                    title={isExpanded ? "收起" : "展开查看内外Portal数据"}
                                                                >
                                                                    <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                    </svg>
                                                                </button>
                                                            ) : (
                                                                <span className="w-[22px] flex-shrink-0"></span>
                                                            )}
                                                            <span className="text-blue-600 hover:text-blue-700 cursor-pointer">{cleanProductName(row.productName)}</span>
                                                            {isMerged && (
                                                                <span className="ml-1.5 px-1 py-0.5 text-[10px] leading-none rounded bg-blue-50 text-blue-600 border border-blue-100 flex-shrink-0 whitespace-nowrap">内外Portal关联</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <AnalysisAmountCell value={row.totalRevenue} link highlight onClick={() => { setRevenueDetailRow(row); setRevenueDetailTab("revenue"); }} />
                                                    <AnalysisAmountCell value={row.innerRevenue} link highlight onClick={() => setInnerRevenueDetailRow(row)} />
                                                    <AnalysisAmountCell value={row.innerNonMidRevenue} link onClick={() => setUnitBillDetail({ row, title: "公司内非中台收入", amount: row.innerNonMidRevenue })} />
                                                    <AnalysisAmountCell value={row.midNonZyunRevenue} link onClick={() => setUnitBillDetail({ row, title: "中台内非智汇云收入", amount: row.midNonZyunRevenue })} />
                                                    <AnalysisAmountCell value={row.zyunNonUnitRevenue} link onClick={() => setUnitBillDetail({ row, title: "智汇云内非本结算单元收入", amount: row.zyunNonUnitRevenue })} />
                                                    <AnalysisAmountCell value={row.unitRevenue} link onClick={() => setUnitBillDetail({ row, title: "本结算单元收入", amount: row.unitRevenue })} />
                                                    <AnalysisAmountCell value={row.outerGroupRevenue} link highlight onClick={() => setOuterGroupDetailRow(row)} />
                                                    <AnalysisAmountCell value={row.outerPortalRevenue} link highlight onClick={() => setOuterPortalDetailRow(row)} />
                                                    <AnalysisAmountCell value={row.outerInnerPriceRevenue} />
                                                    <AnalysisAmountCell value={row.innerTotalRevenue} />
                                                    <AnalysisAmountCell value={row.productCost} link />
                                                    <AnalysisAmountCell value={row.innerProfit} />
                                                    <AnalysisAmountCell value={row.outerProfit} />
                                                    <td className="px-3 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                                                        {row.innerMargin.toFixed(2)}%
                                                    </td>
                                                    <td className="px-3 py-3 text-right text-sm text-gray-900 whitespace-nowrap">
                                                        {row.outerMargin.toFixed(2)}%
                                                    </td>
                                                    <AnalysisAmountCell value={row.balance} />
                                                </tr>
                                                {isExpanded && (
                                                    <>
                                                        <tr className="bg-blue-50/40">
                                                            <td colSpan={20} className="px-6 py-2">
                                                                <div className="text-xs text-gray-500">
                                                                    该产品在 <span className="font-medium text-gray-700">{portalRows.length}</span> 个Portal下关联，下列为各Portal独立数据（上方产品行 = 各Portal对应列相加，「内结算毛利率」「外部毛利率」两列除外，按各自口径单独计算）：
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {portalRows.map((portal, idx) => (
                                                            <tr key={idx} className="bg-gray-50/70 hover:bg-gray-100">
                                                                <td className="px-3 py-3 text-sm text-gray-500">{row.period}</td>
                                                                <td className="px-3 py-3 text-sm text-gray-500">{row.productLine}</td>
                                                                <td className="px-3 py-3 text-sm text-gray-500">{row.settlementUnit}</td>
                                                                <td className="px-3 py-3 text-sm bg-orange-50/40">
                                                                    <div className="flex items-center pl-5">
                                                                        <svg className="w-3.5 h-3.5 text-gray-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                                                        </svg>
                                                                        <span className="text-gray-600">{portal.portalName}</span>
                                                                        <span className="ml-1 text-xs text-gray-400 font-mono">{portal.productIdentifier}</span>
                                                                        <span className={`ml-1 px-1 py-0.5 text-[10px] leading-none rounded flex-shrink-0 whitespace-nowrap ${portal.internal ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-teal-50 text-teal-600 border border-teal-100"}`}>
                                                                            {portal.internal ? "内部Portal" : "外部Portal"}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <AnalysisAmountCell value={portal.totalRevenue} highlight />
                                                                <AnalysisAmountCell value={portal.innerRevenue} highlight />
                                                                <AnalysisAmountCell value={portal.innerNonMidRevenue} />
                                                                <AnalysisAmountCell value={portal.midNonZyunRevenue} />
                                                                <AnalysisAmountCell value={portal.zyunNonUnitRevenue} />
                                                                <AnalysisAmountCell value={portal.unitRevenue} />
                                                                <AnalysisAmountCell value={portal.outerGroupRevenue} highlight />
                                                                <AnalysisAmountCell value={portal.outerPortalRevenue} highlight />
                                                                <AnalysisAmountCell value={portal.outerInnerPriceRevenue} />
                                                                <AnalysisAmountCell value={portal.innerTotalRevenue} />
                                                                <AnalysisAmountCell value={portal.productCost} />
                                                                <AnalysisAmountCell value={portal.innerProfit} />
                                                                <AnalysisAmountCell value={portal.outerProfit} />
                                                                <td className="px-3 py-3 text-right text-sm text-gray-500 whitespace-nowrap">
                                                                    {portal.innerMargin.toFixed(2)}%
                                                                </td>
                                                                <td className="px-3 py-3 text-right text-sm text-gray-500 whitespace-nowrap">
                                                                    {portal.outerMargin.toFixed(2)}%
                                                                </td>
                                                                <AnalysisAmountCell value={portal.balance} />
                                                            </tr>
                                                        ))}
                                                    </>
                                                )}
                                                </React.Fragment>
                                                );
                                            })}
                                            {/* 合计行：公司外收入两个子项分开统计 */}
                                            {pagedAnalysisRows.length > 0 && (
                                                <tr className="bg-gray-50 font-medium">
                                                    <td className="px-3 py-3 text-sm text-gray-900" colSpan={4}>合计</td>
                                                    <AnalysisAmountCell value={analysisTotals.totalRevenue} highlight />
                                                    <AnalysisAmountCell value={analysisTotals.innerRevenue} highlight />
                                                    <AnalysisAmountCell value={analysisTotals.innerNonMidRevenue} />
                                                    <AnalysisAmountCell value={analysisTotals.midNonZyunRevenue} />
                                                    <AnalysisAmountCell value={analysisTotals.zyunNonUnitRevenue} />
                                                    <AnalysisAmountCell value={analysisTotals.unitRevenue} />
                                                    <AnalysisAmountCell value={analysisTotals.outerGroupRevenue} highlight />
                                                    <AnalysisAmountCell value={analysisTotals.outerPortalRevenue} highlight />
                                                    <AnalysisAmountCell value={analysisTotals.outerInnerPriceRevenue} />
                                                    <AnalysisAmountCell value={analysisTotals.innerTotalRevenue} />
                                                    <AnalysisAmountCell value={analysisTotals.productCost} />
                                                    <AnalysisAmountCell value={analysisTotals.innerProfit} />
                                                    <AnalysisAmountCell value={analysisTotals.outerProfit} />
                                                    <td className="px-3 py-3 text-right text-sm text-gray-400 whitespace-nowrap">-</td>
                                                    <td className="px-3 py-3 text-right text-sm text-gray-400 whitespace-nowrap">-</td>
                                                    <AnalysisAmountCell value={analysisTotals.balance} />
                                                </tr>
                                            )}
                                            {pagedAnalysisRows.length === 0 && (
                                                <tr>
                                                    <td colSpan={20} className="px-4 py-12 text-center text-sm text-gray-400">
                                                        暂无符合条件的数据
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 分页 */}
                            <div className="mt-4 flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3">
                                <div className="text-sm text-gray-500">
                                    共 <span className="font-medium">{filteredAnalysisRows.length}</span> 条
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={analysisPageSize}
                                        onChange={(e) => { setAnalysisPageSize(Number(e.target.value)); setAnalysisPage(1); }}
                                        className="h-8 rounded border border-gray-300 px-2 text-sm"
                                    >
                                        <option value={10}>10条/页</option>
                                        <option value={20}>20条/页</option>
                                        <option value={50}>50条/页</option>
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setAnalysisPage(Math.max(1, analysisPage - 1))}
                                            disabled={analysisPage === 1}
                                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: analysisTotalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setAnalysisPage(p)}
                                                className={`flex h-8 w-8 items-center justify-center rounded text-sm ${
                                                    p === analysisPage
                                                        ? "bg-blue-600 text-white"
                                                        : "border border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setAnalysisPage(Math.min(analysisTotalPages, analysisPage + 1))}
                                            disabled={analysisPage === analysisTotalPages}
                                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 总收入明细抽屉 */}
                            {revenueDetailRow && (
                                <div className="fixed inset-0 z-[100]">
                                    <div className="absolute inset-0 bg-black/50" onClick={() => setRevenueDetailRow(null)} />
                                    <div className="absolute right-0 top-0 bottom-0 w-[900px] bg-white shadow-xl flex flex-col">
                                        {/* 抽屉头部 */}
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                经营分析 <span className="font-normal text-gray-600">{cleanProductName(revenueDetailRow.productName)}</span>
                                            </h3>
                                            <button onClick={() => setRevenueDetailRow(null)} className="text-gray-400 hover:text-gray-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* 趋势 / 收入明细 / 成本明细 切换 */}
                                        <div className="flex items-center gap-6 border-b border-gray-200 px-6">
                                            {[
                                                { key: "trend" as const, label: "趋势" },
                                                { key: "revenue" as const, label: "收入明细" },
                                                { key: "cost" as const, label: "成本明细" },
                                            ].map((t) => (
                                                <button
                                                    key={t.key}
                                                    onClick={() => setRevenueDetailTab(t.key)}
                                                    className={`-mb-px border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                                                        revenueDetailTab === t.key
                                                            ? "border-blue-600 text-blue-600"
                                                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                    }`}
                                                >
                                                    {t.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex-1 overflow-y-auto p-6">
                                            {revenueDetailTab === "revenue" && (
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账期</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">收入类型</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">收入来源</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">金额(元)</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">说明</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getProductRevenueDetailRows(revenueDetailRow).map((r, i) => (
                                                            <tr key={i} className="border-b border-gray-100">
                                                                <td className="py-3 px-4 text-sm text-gray-900">{r.period}</td>
                                                                <td className="py-3 px-4 text-sm text-gray-700">{r.type}</td>
                                                                <td className="py-3 px-4 text-sm text-gray-700">{r.source}</td>
                                                                <td className="py-3 px-4 text-sm text-gray-900">{formatExactAmount(r.amount)}</td>
                                                                <td className="py-3 px-4">
                                                                    <button className="text-sm text-blue-600 hover:text-blue-700">账单详情</button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            )}
                                            {revenueDetailTab === "cost" && (
                                                <div className="flex h-64 items-center justify-center text-sm text-gray-400">暂无成本明细数据</div>
                                            )}
                                            {revenueDetailTab === "trend" && (
                                                <div className="flex h-64 items-center justify-center text-sm text-gray-400">暂无趋势数据</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 公司内收入明细抽屉（来源一：集团内部结算单元账单 / 来源二：内部结算单元账号在外部portal使用费用） */}
                            {innerRevenueDetailRow && (
                                <div className="fixed inset-0 z-[100]">
                                    <div className="absolute inset-0 bg-black/50" onClick={() => setInnerRevenueDetailRow(null)} />
                                    <div className="absolute right-0 top-0 bottom-0 w-[850px] bg-white shadow-xl flex flex-col">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                公司内收入明细 <span className="font-normal text-gray-600">{cleanProductName(innerRevenueDetailRow.productName)}</span>
                                            </h3>
                                            <button onClick={() => setInnerRevenueDetailRow(null)} className="text-gray-400 hover:text-gray-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6">
                                            {/* 来源一：集团内部结算单元账单 */}
                                            <div className="mb-4">
                                                <div className="mb-2 flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-gray-900">集团内部结算单元账单</span>
                                                    <span className="group/tip relative inline-flex flex-shrink-0">
                                                        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="pointer-events-none absolute top-full left-1/2 z-30 mt-1.5 hidden w-[260px] -translate-x-1/2 rounded bg-gray-700 px-2.5 py-1.5 text-left text-[12px] font-normal leading-[1.6] text-white shadow-lg group-hover/tip:block">
                                                            集团内各结算单元之间通过内网结算产生的账单金额。
                                                            <span className="absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-gray-700" />
                                                        </span>
                                                    </span>
                                                </div>
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账期</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">结算单元名称</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账单金额(元)</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getInnerRevenueUnitBillRows(innerRevenueDetailRow).map((r, i) => (
                                                            <tr key={i} className="border-b border-gray-100">
                                                                <td className="py-3 px-4 text-sm text-gray-900">{r.period}</td>
                                                                <td className="py-3 px-4 text-sm text-gray-700">{r.unitName}</td>
                                                                <td className="py-3 px-4 text-sm text-gray-900">{formatExactAmount(r.amount)}</td>
                                                                <td className="py-3 px-4">
                                                                    <span className="group/tip relative inline-flex">
                                                                        <button className="text-sm text-blue-600 hover:text-blue-700">查看详情</button>
                                                                        <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-[260px] -translate-x-1/2 rounded bg-gray-700 px-2.5 py-1.5 text-left text-[12px] font-normal leading-[1.6] text-white shadow-lg group-hover/tip:block">
                                                                            点击带账期和结算单元，新开页到【内网账单】，定位到 产品账单 &gt; 结算单元概览，并选中对应的结算单元。
                                                                            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
                                                                        </span>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {getInnerRevenueUnitBillRows(innerRevenueDetailRow).length === 0 && (
                                                            <tr>
                                                                <td colSpan={4} className="py-6 text-center text-sm text-gray-400">暂无结算单元账单数据</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* 来源二：内部结算单元账号在外部portal上使用产生的费用 */}
                                            <div>
                                                <div className="mb-2 flex items-center gap-1">
                                                    <span className="text-sm font-semibold text-gray-900">内部结算单元账号在外部portal使用费用</span>
                                                    <span className="group/tip relative inline-flex flex-shrink-0">
                                                        <svg className="w-3.5 h-3.5 text-gray-400 hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span className="pointer-events-none absolute top-full left-1/2 z-30 mt-1.5 hidden w-[280px] -translate-x-1/2 rounded bg-gray-700 px-2.5 py-1.5 text-left text-[12px] font-normal leading-[1.6] text-white shadow-lg group-hover/tip:block">
                                                            集团内结算单元的账号在外部portal上使用产生的费用，关联回对应结算单元，计入公司内收入。
                                                            <span className="absolute left-1/2 bottom-full -translate-x-1/2 border-4 border-transparent border-b-gray-700" />
                                                        </span>
                                                    </span>
                                                </div>
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账期</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">结算单元名称</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">外部portal账号</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">费用金额(元)</th>
                                                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {getInnerRevenuePortalUsageRows(innerRevenueDetailRow).map((r, i) => (
                                                            <tr key={i} className="border-b border-gray-100">
                                                                <td className="py-3 px-4 text-sm text-gray-900">{r.period}</td>
                                                                <td className="py-3 px-4 text-sm text-gray-700">{r.unitName}</td>
                                                                <td className="py-3 px-4 text-sm text-gray-700">{r.portalAccount}</td>
                                                                <td className="py-3 px-4 text-sm text-gray-900">{formatExactAmount(r.amount)}</td>
                                                                <td className="py-3 px-4">
                                                                    <span className="group/tip relative inline-flex">
                                                                        <button className="text-sm text-blue-600 hover:text-blue-700">查看详情</button>
                                                                        <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-[280px] -translate-x-1/2 rounded bg-gray-700 px-2.5 py-1.5 text-left text-[12px] font-normal leading-[1.6] text-white shadow-lg group-hover/tip:block">
                                                                            点击带账期、结算单元和账号，新开页到【产品账单】，定位到 产品账单 &gt; 客户概览，并选中对应的账号。
                                                                            <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
                                                                        </span>
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {getInnerRevenuePortalUsageRows(innerRevenueDetailRow).length === 0 && (
                                                            <tr>
                                                                <td colSpan={5} className="py-6 text-center text-sm text-gray-400">暂未关联外部portal使用费用</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 集团内的外部事业部 收入明细抽屉 */}
                            {outerGroupDetailRow && (
                                <div className="fixed inset-0 z-[100]">
                                    <div className="absolute inset-0 bg-black/50" onClick={() => setOuterGroupDetailRow(null)} />
                                    <div className="absolute right-0 top-0 bottom-0 w-[760px] bg-white shadow-xl flex flex-col">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                集团内的外部事业部收入明细 <span className="font-normal text-gray-600">{cleanProductName(outerGroupDetailRow.productName)}</span>
                                            </h3>
                                            <button onClick={() => setOuterGroupDetailRow(null)} className="text-gray-400 hover:text-gray-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账期</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">结算单元名称</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">内外属性</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账单金额(元)</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getOuterGroupDetailRows(outerGroupDetailRow).map((r, i) => (
                                                        <tr key={i} className="border-b border-gray-100">
                                                            <td className="py-3 px-4 text-sm text-gray-900">{r.period}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{r.unitName}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{r.attribute}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-900">{formatExactAmount(r.amount)}</td>
                                                            <td className="py-3 px-4">
                                                                <span className="group/tip relative inline-flex">
                                                                    <button className="text-sm text-blue-600 hover:text-blue-700">查看详情</button>
                                                                    <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-[260px] -translate-x-1/2 rounded bg-gray-700 px-2.5 py-1.5 text-left text-[12px] font-normal leading-[1.6] text-white shadow-lg group-hover/tip:block">
                                                                        点击带账期和结算单元，新开页到【内网账单】，定位到 产品账单 &gt; 结算单元概览，并选中对应的结算单元。
                                                                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
                                                                    </span>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 结算单元账单金额明细抽屉（公司内非中台收入 / 中台内非智汇云收入 / 智汇云内非本结算单元收入 / 本结算单元收入） */}
                            {unitBillDetail && (
                                <div className="fixed inset-0 z-[100]">
                                    <div className="absolute inset-0 bg-black/50" onClick={() => setUnitBillDetail(null)} />
                                    <div className="absolute right-0 top-0 bottom-0 w-[760px] bg-white shadow-xl flex flex-col">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {unitBillDetail.title}账单金额明细 <span className="font-normal text-gray-600">{cleanProductName(unitBillDetail.row.productName)}</span>
                                            </h3>
                                            <button onClick={() => setUnitBillDetail(null)} className="text-gray-400 hover:text-gray-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账期</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">结算单元名称</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账单金额(元)</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getUnitBillDetailRows(unitBillDetail.row, unitBillDetail.amount).map((r, i) => (
                                                        <tr key={i} className="border-b border-gray-100">
                                                            <td className="py-3 px-4 text-sm text-gray-900">{r.period}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{r.unitName}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-900">{formatExactAmount(r.amount)}</td>
                                                            <td className="py-3 px-4">
                                                                <span className="group/tip relative inline-flex">
                                                                    <button className="text-sm text-blue-600 hover:text-blue-700">查看详情</button>
                                                                    <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-[260px] -translate-x-1/2 rounded bg-gray-700 px-2.5 py-1.5 text-left text-[12px] font-normal leading-[1.6] text-white shadow-lg group-hover/tip:block">
                                                                        点击带账期和结算单元，新开页到【内网账单】，定位到 产品账单 &gt; 结算单元概览，并选中对应的结算单元。
                                                                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
                                                                    </span>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 外部(360.cn) 收入明细抽屉 */}
                            {outerPortalDetailRow && (
                                <div className="fixed inset-0 z-[100]">
                                    <div className="absolute inset-0 bg-black/50" onClick={() => setOuterPortalDetailRow(null)} />
                                    <div className="absolute right-0 top-0 bottom-0 w-[760px] bg-white shadow-xl flex flex-col">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                外部(360.cn)收入明细 <span className="font-normal text-gray-600">{cleanProductName(outerPortalDetailRow.productName)}</span>
                                            </h3>
                                            <button onClick={() => setOuterPortalDetailRow(null)} className="text-gray-400 hover:text-gray-600">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-6">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账期</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">租户名称</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账单金额(元)</th>
                                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getOuterPortalDetailRows(outerPortalDetailRow).map((r, i) => (
                                                        <tr key={i} className="border-b border-gray-100">
                                                            <td className="py-3 px-4 text-sm text-gray-900">{r.period}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{r.tenantName}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-900">{formatExactAmount(r.amount)}</td>
                                                            <td className="py-3 px-4">
                                                                <span className="group/tip relative inline-flex">
                                                                    <button className="text-sm text-blue-600 hover:text-blue-700">查看详情</button>
                                                                    <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1.5 hidden w-[260px] -translate-x-1/2 rounded bg-gray-700 px-2.5 py-1.5 text-left text-[12px] font-normal leading-[1.6] text-white shadow-lg group-hover/tip:block">
                                                                        点击带账期和客户，新开页到【产品账单】，定位到 产品账单 &gt; 客户概览，并选中对应的客户。
                                                                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-700" />
                                                                    </span>
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 经营分析 - 部门分析页面 */}
                    {currentMenu === 'analysis-department' && (
                        <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                            {/* 数据口径说明 */}
                            <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
                                <p className="text-[13px] leading-[1.9] text-blue-600">
                                    部门数据取自「企业配置」中所选<span className="font-medium">经营部门</span>（组织架构部门）下已关联结算单元的部门；一个部门可关联多个 ops 结算单元，部门的总收入、总成本、收支差额为其关联结算单元对应值之和，无需在此创建部门或关联结算单元。
                                </p>
                            </div>

                            {/* 顶部说明提示 */}
                            <div className="mb-4 rounded-lg border border-red-100 bg-red-50/60 px-4 py-3">
                                <p className="text-[13px] leading-[1.9] text-red-500">
                                    1、月账单：次月第3个工作日8点后为准确数据；2、天账单：次日14点后为准确数据；3、小时账单：今天12点后，昨天的小时帐为准确数据。特殊说明：短信每个月28号用户中心的账单会拆分到其他部门，裸金属GPU（整机）、裸金属CPU（整机）、CDN、PCDN、音视频通话RTC 每个月第二个工作日12点ops锁账后上报外部成本
                                </p>
                            </div>

                            {/* 筛选工具栏 */}
                            <div className="mb-4 flex flex-wrap items-start gap-3">
                                {/* 经营部门（来源：企业配置） */}
                                <select
                                    value={currentBizDeptEnt?.id ?? ''}
                                    onChange={(e) => {
                                        setDeptScopeEntId(Number(e.target.value));
                                        setDeptUnitTags([]);
                                        setExpandedDeptRows([]);
                                        setDeptPage(1);
                                    }}
                                    className="h-9 w-[240px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                                >
                                    {bizDeptOptions.length === 0 ? (
                                        <option value="">暂无已配置经营部门的企业</option>
                                    ) : (
                                        bizDeptOptions.map((e) => (
                                            <option key={e.id} value={e.id}>经营部门：{e.bizDeptName}（{e.name}）</option>
                                        ))
                                    )}
                                </select>

                                {/* 账单类型 */}
                                <select
                                    value={deptBillType}
                                    onChange={(e) => { setDeptBillType(e.target.value); setDeptPage(1); }}
                                    className="h-9 w-[200px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                                >
                                    {analysisBillTypes.map((t) => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>

                                {/* 账期 */}
                                <input
                                    type="month"
                                    value={deptPeriod}
                                    onChange={(e) => { setDeptPeriod(e.target.value); setDeptPage(1); }}
                                    className="h-9 w-[200px] px-3 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500"
                                />

                                {/* 结算单元（多选标签） */}
                                <div className="relative w-[200px]">
                                    {/* 点击外部关闭下拉 */}
                                    {deptPickerOpen && (
                                        <div className="fixed inset-0 z-10" onClick={() => setDeptPickerOpen(false)} />
                                    )}
                                    <div
                                        onClick={() => setDeptPickerOpen(!deptPickerOpen)}
                                        className="min-h-[36px] w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-2 py-1.5 pr-7 text-sm focus:outline-none"
                                    >
                                        {deptUnitTags.length === 0 ? (
                                            <span className="leading-[24px] text-gray-400">结算单元</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {deptUnitTags.map((tag) => (
                                                    <span key={tag} className="inline-flex max-w-full items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[12px] text-gray-700">
                                                        <span className="truncate">{tag}</span>
                                                        <svg
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeptUnitTags(deptUnitTags.filter((t) => t !== tag));
                                                            }}
                                                            className="h-3 w-3 flex-shrink-0 text-gray-400 hover:text-gray-600"
                                                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <svg className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>

                                    {/* 结算单元下拉选择面板：仅展示当前经营部门下已关联的结算单元 */}
                                    {deptPickerOpen && (
                                        <div className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-[260px] w-[240px] overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                            {deptScopeUnits.length === 0 ? (
                                                <div className="px-3 py-6 text-center text-[13px] text-gray-400">当前经营部门下暂无已关联结算单元</div>
                                            ) : (
                                                deptScopeUnits.map((row) => {
                                                    const checked = deptUnitTags.includes(row.opsUnit);
                                                    return (
                                                        <label key={row.id} className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50">
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() =>
                                                                    setDeptUnitTags(
                                                                        checked
                                                                            ? deptUnitTags.filter((t) => t !== row.opsUnit)
                                                                            : [...deptUnitTags, row.opsUnit]
                                                                    )
                                                                }
                                                                className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-0"
                                                            />
                                                            <span className="truncate">{row.opsUnit}</span>
                                                        </label>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 搜索 */}
                                <button
                                    onClick={() => setDeptPage(1)}
                                    className="h-9 rounded-lg bg-blue-600 px-5 text-sm text-white transition-colors hover:bg-blue-700"
                                >
                                    搜索
                                </button>
                            </div>

                            {/* 数据表格 */}
                            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[900px]">
                                        <thead>
                                            <tr className="border-b border-gray-200 bg-gray-50">
                                                <AnalysisTh label="部门名称" tip="所选经营部门下已关联结算单元的部门（含经营部门自身）。" align="left" width="300px" />
                                                <AnalysisTh label="关联结算单元" tip="该部门在组织架构中已关联的 ops 结算单元数量，展开可查看明细。" align="left" width="220px" />
                                                <AnalysisTh label="总收入(元)" tip="该部门关联的全部结算单元在本账期内的收入之和。" align="left" width="180px" />
                                                <AnalysisTh label="总成本(元)" tip="该部门关联的全部结算单元在本账期内分摊资源成本之和。" align="left" width="180px" />
                                                <AnalysisTh label="收支差额(元)" tip="总收入 - 总成本。" align="left" width="160px" />
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {pagedDeptRows.map((row) => {
                                                const expanded = expandedDeptRows.includes(row.key);
                                                return (
                                                    <Fragment key={row.key}>
                                                        <tr className="hover:bg-gray-50">
                                                            <td className="px-4 py-4 text-sm text-gray-900">
                                                                <div className="flex items-center gap-1.5">
                                                                    <button
                                                                        onClick={() => toggleDeptRowExpand(row.key)}
                                                                        disabled={row.members.length === 0}
                                                                        className="flex h-4 w-4 flex-shrink-0 items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-0"
                                                                    >
                                                                        <svg className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </button>
                                                                    <span className="text-gray-900">{row.name}</span>
                                                                    <span className="truncate text-[12px] text-gray-400" title={row.path}>{row.path}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-4 text-sm text-gray-600">{row.members.length} 个</td>
                                                            <DeptAmountCell value={row.totalRevenue} />
                                                            <DeptAmountCell value={row.totalCost} />
                                                            <DeptAmountCell value={row.totalRevenue - row.totalCost} />
                                                        </tr>
                                                        {expanded && row.members.map((m) => (
                                                            <tr key={`${row.key}-${m.id}`} className="bg-gray-50/60">
                                                                <td className="px-4 py-3 pl-11 text-[13px] text-gray-400">结算单元</td>
                                                                <td className="px-4 py-3 text-[13px] text-gray-600">{m.opsUnit}</td>
                                                                <DeptAmountCell value={m.totalRevenue} link onClick={() => openDeptDetail(m, "revenue")} />
                                                                <DeptAmountCell value={m.totalCost} link onClick={() => openDeptDetail(m, "cost")} />
                                                                <DeptAmountCell value={m.totalRevenue - m.totalCost} />
                                                            </tr>
                                                        ))}
                                                    </Fragment>
                                                );
                                            })}
                                            {pagedDeptRows.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-gray-400">
                                                        暂无符合条件的数据
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* 分页 */}
                            <div className="mt-4 flex items-center justify-between rounded-b-lg border-t border-gray-200 bg-white px-4 py-3">
                                <div className="text-sm text-gray-500">
                                    共 <span className="font-medium">{filteredDeptRows.length}</span> 条
                                </div>
                                <div className="flex items-center gap-2">
                                    <select
                                        value={deptPageSize}
                                        onChange={(e) => { setDeptPageSize(Number(e.target.value)); setDeptPage(1); }}
                                        className="h-8 rounded border border-gray-300 px-2 text-sm"
                                    >
                                        <option value={10}>10条/页</option>
                                        <option value={20}>20条/页</option>
                                        <option value={50}>50条/页</option>
                                    </select>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setDeptPage(Math.max(1, deptPage - 1))}
                                            disabled={deptPage === 1}
                                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: deptTotalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setDeptPage(p)}
                                                className={`flex h-8 w-8 items-center justify-center rounded text-sm ${
                                                    p === deptPage
                                                        ? "bg-blue-600 text-white"
                                                        : "border border-gray-300 hover:bg-gray-50"
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setDeptPage(Math.min(deptTotalPages, deptPage + 1))}
                                            disabled={deptPage === deptTotalPages}
                                            className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            ›
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 结算单元收支明细抽屉 */}
                            {deptDetailUnit && (
                                <div className="fixed inset-0 z-[100]">
                                    <div className="absolute inset-0 bg-black/50" onClick={() => setDeptDetailUnit(null)} />
                                    <div className="absolute right-0 top-0 bottom-0 w-[860px] bg-white shadow-xl flex flex-col">
                                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {deptDetailTab === "cost" ? "总支出/成本(元)" : "总收入(元)"} {deptDetailUnit.opsUnit}
                                            </h3>
                                            <button onClick={() => setDeptDetailUnit(null)} className="text-gray-400 hover:text-gray-600">
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* 收入明细 / 成本明细 切换 */}
                                        <div className="flex items-center gap-6 border-b border-gray-200 px-6">
                                            <button
                                                onClick={() => setDeptDetailTab("revenue")}
                                                className={`-mb-px border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                                                    deptDetailTab === "revenue"
                                                        ? "border-blue-600 text-blue-600"
                                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                }`}
                                            >
                                                收入明细
                                            </button>
                                            <button
                                                onClick={() => setDeptDetailTab("cost")}
                                                className={`-mb-px border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                                                    deptDetailTab === "cost"
                                                        ? "border-blue-600 text-blue-600"
                                                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                                                }`}
                                            >
                                                成本明细
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-auto px-6 py-4">
                                            <table className="w-full min-w-[760px]">
                                                <thead>
                                                    <tr className="border-b border-gray-200 bg-gray-50">
                                                        <th className="px-3 py-2.5 text-left text-sm font-medium text-gray-700">账期</th>
                                                        <th className="px-3 py-2.5 text-left text-sm font-medium text-gray-700">{deptDetailTab === "cost" ? "成本类型" : "收入类型"}</th>
                                                        <th className="px-3 py-2.5 text-left text-sm font-medium text-gray-700">{deptDetailTab === "cost" ? "成本来源" : "收入来源"}</th>
                                                        <th className="px-3 py-2.5 text-left text-sm font-medium text-gray-700">金额(元)</th>
                                                        <th className="px-3 py-2.5 text-left text-sm font-medium text-gray-700">说明</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {getDeptDetailRows(deptDetailUnit, deptDetailTab, deptPeriod).map((r, i) => (
                                                        <tr key={i} className="hover:bg-gray-50">
                                                            <td className="px-3 py-3 text-sm text-gray-600 whitespace-nowrap">{r.period}</td>
                                                            <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.type}</td>
                                                            <td className="px-3 py-3 text-sm text-gray-700 whitespace-nowrap">{r.source}</td>
                                                            <td className="px-3 py-3 text-sm text-gray-900 whitespace-nowrap">{formatExactAmount(r.amount)}</td>
                                                            <td className="px-3 py-3">
                                                                <button className="text-sm text-blue-600 hover:text-blue-700">账单详情</button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                                            <button
                                                onClick={() => setDeptDetailUnit(null)}
                                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                                            >
                                                关闭
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {currentMenu === 'platform-portal' && (
                        <div className="flex-1 bg-gray-50 overflow-auto">
                            {/* 页面标题 */}
                            <div className="px-6 py-4 bg-white border-b border-gray-200">
                                <h2 className="text-base font-medium text-gray-900">企业配置</h2>
                            </div>

                            <div className="p-6">
                                <div className="bg-white rounded-lg border border-gray-200">
                                    {/* 操作栏 */}
                                    <div className="flex items-center justify-between px-5 py-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={enterpriseSearch}
                                                onChange={(e) => setEnterpriseSearch(e.target.value)}
                                                placeholder="企业名称/租户ID/经营部门/Portal名称"
                                                className="w-72 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            onClick={handleOpenCreateEnterprise}
                                            className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            + 新建企业
                                        </button>
                                    </div>

                                    {/* 列表 */}
                                    <div className="overflow-x-auto">
                                            <table className="w-full min-w-[1300px]">
                                            <thead>
                                                <tr className="bg-gray-50 border-y border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-14">序号</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">企业名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-28">是否是内部企业</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-32">是否开启独立Portal</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">所属租户</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">经营部门</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Portal名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Portal域名</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">备注说明</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">创建时间</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">更新时间</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-28">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredEnterpriseConfigs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={12} className="py-16 text-center text-sm text-gray-400">暂无数据</td>
                                                    </tr>
                                                ) : (
                                                    filteredEnterpriseConfigs.map((ent, idx) => (
                                                        <tr key={ent.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="py-3 px-4 text-sm text-gray-600">{idx + 1}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{ent.name}</td>
                                                            <td className="py-3 px-4">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${ent.internal ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                                    {ent.internal ? '是' : '否'}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${ent.enablePortal ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                                                    {ent.enablePortal ? '是' : '否'}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">
                                                                {ent.tenantId ? (
                                                                    <div className="leading-tight">
                                                                        <div>{ent.tenantName}</div>
                                                                        <div className="text-xs text-gray-400">ID：{ent.tenantId}</div>
                                                                    </div>
                                                                ) : '--'}
                                                            </td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{ent.bizDeptName || '--'}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{ent.enablePortal ? (ent.portalName || '--') : '--'}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{ent.enablePortal ? (ent.portalDomain || '--') : '--'}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-600">{ent.remark || '--'}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-600">{ent.createTime}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-600">{ent.updateTime}</td>
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        onClick={() => handleOpenEditEnterprise(ent)}
                                                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                                                    >
                                                                        编辑
                                                                    </button>
                                                                    {ent.internal ? (
                                                                        <span
                                                                            className="group relative text-sm text-gray-300 cursor-not-allowed"
                                                                            title="内部企业不支持删除"
                                                                        >
                                                                            删除
                                                                        </span>
                                                                    ) : (
                                                                        <button
                                                                            onClick={() => setEnterpriseDeleteTarget(ent)}
                                                                            className="text-red-500 hover:text-red-600 text-sm"
                                                                        >
                                                                            删除
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* 新建/编辑企业抽屉（右侧滑出） */}
                            {enterpriseDialogOpen && (
                                <div className="fixed inset-0 z-50">
                                    <div className="absolute inset-0 bg-black/40" onClick={() => setEnterpriseDialogOpen(false)} />
                                    <div className="absolute right-0 top-0 bottom-0 w-[880px] max-w-[94vw] bg-white shadow-xl flex flex-col">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {editingEnterpriseId != null ? '编辑企业' : '新建企业'}
                                            </h3>
                                            <button
                                                onClick={() => setEnterpriseDialogOpen(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    企业名称 <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={enterpriseForm.name}
                                                    onChange={(e) => setEnterpriseForm({ ...enterpriseForm, name: e.target.value })}
                                                    placeholder="请输入企业名称，如：奇虎360"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                            </div>

                                            {/* 1. 是否是内部企业（全局唯一，只能有一个） */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    是否是内部企业 <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex items-center gap-6">
                                                    {[{ v: true, l: '是' }, { v: false, l: '否' }].map(opt => {
                                                        // 已存在其他内部企业时，「是」不可选
                                                        const disabled = opt.v === true && !!existedInternalEnterprise;
                                                        return (
                                                            <label
                                                                key={String(opt.v)}
                                                                className={`flex items-center gap-1.5 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                                title={disabled ? `已存在内部企业「${existedInternalEnterprise!.name}」，内部企业只能有一个` : undefined}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="enterpriseInternal"
                                                                    disabled={disabled}
                                                                    checked={enterpriseForm.internal === opt.v}
                                                                    onChange={() => {
                                                                        if (disabled) return;
                                                                        setEnterpriseForm({ ...enterpriseForm, internal: opt.v });
                                                                        setEnterpriseFormError('');
                                                                    }}
                                                                    className="w-4 h-4 text-blue-600"
                                                                />
                                                                <span className={`text-sm ${disabled ? 'text-gray-300' : enterpriseForm.internal === opt.v ? 'text-blue-600' : 'text-gray-700'}`}>{opt.l}</span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                                <p className="mt-1.5 text-xs text-gray-400">
                                                    {existedInternalEnterprise
                                                        ? `内部企业全局只能有一个，当前内部企业为「${existedInternalEnterprise.name}」，不可再创建。`
                                                        : '选择「是」时，所属租户为必填项；内部企业创建后不支持删除，且全局只能有一个。'}
                                                </p>
                                            </div>

                                            {/* 2. 所属租户 + 经营部门（同一行） */}
                                            <div className="grid grid-cols-2 gap-4 items-start">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    所属租户 {enterpriseForm.internal && <span className="text-red-500">*</span>}
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={tenantKeyword}
                                                        onChange={(e) => {
                                                            setTenantKeyword(e.target.value);
                                                            setTenantDropdownOpen(true);
                                                            if (!e.target.value.trim()) {
                                                                setEnterpriseForm(prev => ({ ...prev, tenantId: '', tenantName: '', bizDeptId: '', bizDeptName: '' }));
                                                            }
                                                        }}
                                                        onFocus={() => setTenantDropdownOpen(true)}
                                                        placeholder="请输入租户ID搜索，如：100000001"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                    {tenantDropdownOpen && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setTenantDropdownOpen(false)} />
                                                            <div className="absolute z-20 mt-1 w-full max-h-52 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                                                                {tenantSuggestions.length === 0 ? (
                                                                    <div className="px-3 py-3 text-sm text-gray-400">未匹配到租户</div>
                                                                ) : (
                                                                    tenantSuggestions.map(t => (
                                                                        <button
                                                                            key={t.id}
                                                                            type="button"
                                                                            onClick={() => handleSelectEnterpriseTenant(t)}
                                                                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-blue-50 ${enterpriseForm.tenantId === t.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                                                        >
                                                                            <span>{t.name}</span>
                                                                            <span className="text-xs text-gray-400">{t.id}</span>
                                                                        </button>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                {enterpriseForm.tenantId ? (
                                                    <p className="mt-1.5 text-xs text-gray-500">已选择：{enterpriseForm.tenantName}（租户ID：{enterpriseForm.tenantId}）</p>
                                                ) : (
                                                    <p className="mt-1.5 text-xs text-gray-400">
                                                        {enterpriseForm.internal ? '内部企业必须选择所属租户' : '非内部企业可不选择所属租户'}
                                                    </p>
                                                )}
                                            </div>

                                            {/* 经营部门 */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">经营部门</label>
                                                <div className="relative">
                                                    <button
                                                        type="button"
                                                        disabled={!enterpriseForm.tenantId}
                                                        onClick={() => setBizDeptPickerOpen(v => !v)}
                                                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm focus:outline-none ${enterpriseForm.tenantId ? 'border-gray-300 bg-white hover:border-blue-500' : 'border-gray-200 bg-gray-50 cursor-not-allowed'}`}
                                                    >
                                                        <span className={enterpriseForm.bizDeptName ? 'text-gray-700' : 'text-gray-400'}>
                                                            {enterpriseForm.bizDeptName || (enterpriseForm.tenantId ? '请选择经营部门' : '请先选择所属租户')}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            {enterpriseForm.bizDeptName && (
                                                                <span
                                                                    role="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setEnterpriseForm({ ...enterpriseForm, bizDeptId: '', bizDeptName: '' });
                                                                    }}
                                                                    className="text-xs text-gray-400 hover:text-gray-600"
                                                                >
                                                                    清空
                                                                </span>
                                                            )}
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </span>
                                                    </button>
                                                    {bizDeptPickerOpen && enterpriseForm.tenantId && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setBizDeptPickerOpen(false)} />
                                                            <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                                                {(() => {
                                                                    const renderNodes = (nodes: OrgDeptNode[], depth: number): React.ReactNode[] =>
                                                                        nodes.flatMap((node) => {
                                                                            const hasChildren = !!node.children?.length;
                                                                            const expanded = expandedOrgNodes.includes(node.id);
                                                                            const rows: React.ReactNode[] = [
                                                                                <div
                                                                                    key={node.id}
                                                                                    className={`flex items-center gap-1.5 px-2 py-1.5 text-sm hover:bg-blue-50 ${enterpriseForm.bizDeptId === node.id ? 'bg-blue-50' : ''}`}
                                                                                    style={{ paddingLeft: 8 + depth * 16 }}
                                                                                >
                                                                                    {hasChildren ? (
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => setExpandedOrgNodes(prev => prev.includes(node.id) ? prev.filter(i => i !== node.id) : [...prev, node.id])}
                                                                                            className="flex h-4 w-4 items-center justify-center text-gray-400 hover:text-gray-600"
                                                                                        >
                                                                                            <svg className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    ) : (
                                                                                        <span className="h-4 w-4" />
                                                                                    )}
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setEnterpriseForm({ ...enterpriseForm, bizDeptId: node.id, bizDeptName: node.name });
                                                                                            setBizDeptPickerOpen(false);
                                                                                        }}
                                                                                        className={`flex flex-1 items-center gap-2 text-left ${enterpriseForm.bizDeptId === node.id ? 'text-blue-600' : 'text-gray-700'}`}
                                                                                    >
                                                                                        <span>{node.name}</span>
                                                                                        {!!node.units?.length && (
                                                                                            <span className="rounded bg-green-50 px-1 py-0.5 text-[10px] leading-none text-green-600">已关联 {node.units.length} 个结算单元</span>
                                                                                        )}
                                                                                    </button>
                                                                                </div>
                                                                            ];
                                                                            if (hasChildren && expanded) {
                                                                                rows.push(...renderNodes(node.children!, depth + 1));
                                                                            }
                                                                            return rows;
                                                                        });
                                                                    return renderNodes(getTenantOrgTree(enterpriseForm.tenantId), 0);
                                                                })()}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <p className="mt-1.5 text-xs text-gray-400 leading-[1.7]">
                                                    经营部门用于经营分析&gt;部门分析，取的是选中经营部门下已关联结算单元的部门；组织架构部门可关联多个结算单元，无需另行创建部门或关联结算单元。
                                                </p>
                                            </div>
                                            </div>

                                            {/* 3. 是否开启独立Portal */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">是否开启独立Portal</label>
                                                <div className="flex items-center gap-6">
                                                    {[{ v: true, l: '是' }, { v: false, l: '否' }].map(opt => (
                                                        <label key={String(opt.v)} className="flex items-center gap-1.5 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="enterpriseEnablePortal"
                                                                checked={enterpriseForm.enablePortal === opt.v}
                                                                onChange={() => setEnterpriseForm({ ...enterpriseForm, enablePortal: opt.v })}
                                                                className="w-4 h-4 text-blue-600"
                                                            />
                                                            <span className={`text-sm ${enterpriseForm.enablePortal === opt.v ? 'text-blue-600' : 'text-gray-700'}`}>{opt.l}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 4. Portal名称 + Portal域名（同一行） */}
                                            {enterpriseForm.enablePortal && (
                                                <div className="grid grid-cols-2 gap-4 items-start">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                            Portal名称 <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={enterpriseForm.portalName}
                                                            onChange={(e) => setEnterpriseForm({ ...enterpriseForm, portalName: e.target.value })}
                                                            placeholder="如：智汇云官网"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                            Portal域名 <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={enterpriseForm.portalDomain}
                                                            onChange={(e) => setEnterpriseForm({ ...enterpriseForm, portalDomain: e.target.value })}
                                                            placeholder="如：zyun.360.cn"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* 5. 备注说明 */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">备注说明</label>
                                                <textarea
                                                    value={enterpriseForm.remark}
                                                    onChange={(e) => setEnterpriseForm({ ...enterpriseForm, remark: e.target.value })}
                                                    rows={3}
                                                    maxLength={200}
                                                    placeholder="请输入备注说明，200字以内"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-500"
                                                />
                                                <div className="mt-1 text-right text-xs text-gray-400">{enterpriseForm.remark.length}/200</div>
                                            </div>

                                            {enterpriseFormError && (
                                                <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{enterpriseFormError}</div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                            <button
                                                onClick={() => setEnterpriseDialogOpen(false)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button
                                                onClick={handleSaveEnterprise}
                                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                确定
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 删除企业确认弹窗（仅非内部企业可删除） */}
                            {enterpriseDeleteTarget && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-[420px]">
                                        <div className="px-6 py-5">
                                            <h3 className="text-base font-semibold text-gray-900">删除企业</h3>
                                            <p className="mt-2 text-sm text-gray-600 leading-[1.8]">
                                                确认删除企业「{enterpriseDeleteTarget.name}」吗？删除后其独立Portal配置与经营部门配置将一并移除，此操作不可撤销。
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                            <button
                                                onClick={() => setEnterpriseDeleteTarget(null)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button
                                                onClick={handleDeleteEnterprise}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                                            >
                                                确认删除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 平台配置 - 地域可用区页面 */}
                    {currentMenu === 'platform-region' && (
                        <div className="flex-1 bg-gray-50 overflow-auto">
                            {/* 页面标题 */}
                            <div className="px-6 py-4 bg-white border-b border-gray-200">
                                <h2 className="text-base font-medium text-gray-900">地域可用区</h2>
                            </div>

                            <div className="p-6">
                                <div className="bg-white rounded-lg border border-gray-200">
                                    {/* 操作栏 */}
                                    <div className="flex items-center justify-between px-5 py-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={regionZoneSearch}
                                                onChange={(e) => setRegionZoneSearch(e.target.value)}
                                                placeholder="关键词搜索"
                                                className="w-52 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            onClick={handleOpenCreateRegionZone}
                                            className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            + 新建可用区
                                        </button>
                                    </div>

                                    {/* 列表 */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[1280px]">
                                            <thead>
                                                <tr className="bg-gray-50 border-y border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-14">序号</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">云服务器名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">地域</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">内网(qihoo.net)可用区名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">内网(qihoo.net)可用区标识</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">外网(360.cn)可用区名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">外网(360.cn)可用区标识</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">公网是否启用</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">创建时间</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">更新时间</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700 w-20">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredRegionZones.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={11} className="py-16 text-center text-sm text-gray-400">暂无数据</td>
                                                    </tr>
                                                ) : (
                                                    filteredRegionZones.map((zone, idx) => (
                                                        <tr key={zone.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="py-3 px-4 text-sm text-gray-600">{idx + 1}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{zone.cloudServer}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{zone.region}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{zone.innerName}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{zone.innerCode}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{zone.outerName}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{zone.outerCode}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-700">{zone.publicNet ? '是' : '否'}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-600">{zone.createTime}</td>
                                                            <td className="py-3 px-4 text-sm text-gray-600">{zone.updateTime}</td>
                                                            <td className="py-3 px-4">
                                                                <button
                                                                    onClick={() => handleOpenEditRegionZone(zone)}
                                                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                                                >
                                                                    编辑
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* 新建/编辑可用区弹窗 */}
                            {regionZoneDialogOpen && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-[640px] max-h-[85vh] flex flex-col">
                                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-[#f7f9fc] rounded-t-lg">
                                            <h3 className="text-base font-semibold text-gray-900">
                                                {editingRegionZoneId != null ? '编辑可用区' : '新建可用区'}
                                            </h3>
                                            <button
                                                onClick={() => setRegionZoneDialogOpen(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex-1 overflow-auto px-6 py-6 space-y-5">
                                            {/* 云服务器 */}
                                            <div className="flex items-center gap-3">
                                                <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">
                                                    <span className="text-red-500 mr-0.5">*</span>云服务器:
                                                </label>
                                                <select
                                                    value={regionZoneForm.cloudServer}
                                                    onChange={(e) => setRegionZoneForm({ ...regionZoneForm, cloudServer: e.target.value })}
                                                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 ${regionZoneForm.cloudServer ? 'text-gray-700' : 'text-gray-400'}`}
                                                >
                                                    <option value="">请选择云服务器</option>
                                                    {cloudServerOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* 地域 */}
                                            <div className="flex items-center gap-3">
                                                <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">
                                                    <span className="text-red-500 mr-0.5">*</span>地域:
                                                </label>
                                                <select
                                                    value={regionZoneForm.region}
                                                    onChange={(e) => setRegionZoneForm({ ...regionZoneForm, region: e.target.value })}
                                                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-500 ${regionZoneForm.region ? 'text-gray-700' : 'text-gray-400'}`}
                                                >
                                                    <option value="">请选择地域</option>
                                                    {regionOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* 内网（qihoo.net） */}
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                                <div className="text-sm font-medium text-[#006bff]">内网（qihoo.net）</div>
                                                <div className="flex items-center gap-3">
                                                    <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">
                                                        <span className="text-red-500 mr-0.5">*</span>可用区名称:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={regionZoneForm.innerName}
                                                        onChange={(e) => setRegionZoneForm({ ...regionZoneForm, innerName: e.target.value })}
                                                        placeholder="支持中英文、数字(20个字符以内)"
                                                        maxLength={20}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">
                                                        <span className="text-red-500 mr-0.5">*</span>可用区标识:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={regionZoneForm.innerCode}
                                                        onChange={(e) => setRegionZoneForm({ ...regionZoneForm, innerCode: e.target.value })}
                                                        placeholder="支持英文、数字、_、-(20个字符以内)"
                                                        maxLength={20}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* 公网（360.cn） */}
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-4">
                                                <div className="text-sm font-medium text-[#006bff]">公网（360.cn）</div>
                                                <div className="flex items-center gap-3">
                                                    <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">是否启用:</label>
                                                    <button
                                                        onClick={() => setRegionZoneForm({ ...regionZoneForm, publicNet: !regionZoneForm.publicNet })}
                                                        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${regionZoneForm.publicNet ? 'bg-[#006bff]' : 'bg-gray-300'}`}
                                                    >
                                                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${regionZoneForm.publicNet ? 'translate-x-5' : ''}`} />
                                                    </button>
                                                </div>
                                                {regionZoneForm.publicNet && (
                                                    <>
                                                        <div className="flex items-center gap-3">
                                                            <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">
                                                                <span className="text-red-500 mr-0.5">*</span>可用区名称:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={regionZoneForm.outerName}
                                                                onChange={(e) => setRegionZoneForm({ ...regionZoneForm, outerName: e.target.value })}
                                                                placeholder="支持中英文、数字(20个字符以内)"
                                                                maxLength={20}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <label className="w-24 text-sm text-gray-700 text-right flex-shrink-0">
                                                                <span className="text-red-500 mr-0.5">*</span>可用区标识:
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={regionZoneForm.outerCode}
                                                                onChange={(e) => setRegionZoneForm({ ...regionZoneForm, outerCode: e.target.value })}
                                                                placeholder="支持英文、数字、_、-(20个字符以内)"
                                                                maxLength={20}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                            <button
                                                onClick={() => setRegionZoneDialogOpen(false)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button
                                                onClick={handleSaveRegionZone}
                                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                确定
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 平台配置 - 密钥管理页面 */}
                    {currentMenu === 'platform-key' && (
                        <div className="flex-1 overflow-auto bg-gray-50">
                            {/* 创建密钥表单 */}
                            {createAccessKeyDialogOpen ? (
                                <div className="flex flex-col h-full">
                                    {/* 顶部导航 */}
                                    <div className="flex items-center gap-3 px-6 pt-5 pb-4 bg-white border-b border-gray-200">
                                        <button
                                            onClick={handleCloseAccessKeyForm}
                                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            返回列表
                                        </button>
                                        <span className="text-gray-300">/</span>
                                        <span className="text-sm font-medium text-gray-900">{editingAccessKeyId != null ? "编辑密钥" : "创建密钥"}</span>
                                    </div>

                                    {/* 表单卡片 */}
                                    <div className="flex-1 overflow-auto p-6">
                                        <div className="bg-white rounded-lg border border-gray-200 max-w-3xl mx-auto">
                                            <div className="px-6 py-4 border-b border-gray-200">
                                                <h3 className="text-lg font-semibold text-gray-900">{editingAccessKeyId != null ? "编辑密钥" : "创建密钥"}</h3>
                                                <p className="text-sm text-gray-500 mt-1">{editingAccessKeyId != null ? "修改密钥的对接信息与配置，AK/SK 保持不变。" : "通过 AK/SK 和 IP 鉴权，管理服务端对接的鉴权密钥。创建成功后将自动生成 SK。"}</p>
                                            </div>

                                            <div className="p-6">
                                                <div className="space-y-5">
                                                    {/* 密钥名称 */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">密钥名称</label>
                                                        <input
                                                            type="text"
                                                            value={newAccessKey.name}
                                                            onChange={(e) => setNewAccessKey({ ...newAccessKey, name: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="请输入密钥名称，便于识别"
                                                        />
                                                    </div>

                                                    {/* 对接方名称(谁接) */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">对接方名称(谁接) <span className="text-red-500">*</span></label>
                                                        <input
                                                            type="text"
                                                            value={newAccessKey.subject}
                                                            onChange={(e) => setNewAccessKey({ ...newAccessKey, subject: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="请输入对接方名称，如公司/部门/系统名称"
                                                        />
                                                    </div>

                                                    {/* 对接系统(接谁) —— 分段卡片选择：「全部接口」/「指定接口」 */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">对接系统(接谁) <span className="text-red-500">*</span></label>

                                                        {/* 授权范围：上下两行（「全部接口」在上，其权限级别同行内联；「指定接口」在下） */}
                                                        <div className="space-y-2">
                                                            {/* 权限范围：4个按钮平铺（只读 / 读写 / 管理 / 指定接口） */}
                                                            <div className="grid grid-cols-4 gap-2">
                                                                {([
                                                                    {
                                                                        key: "read",
                                                                        label: "只读",
                                                                        suffix: "(全部只读接口)",
                                                                        desc: "仅可查询数据",
                                                                        scope: "all",
                                                                        permission: "read",
                                                                        icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
                                                                    },
                                                                    {
                                                                        key: "readwrite",
                                                                        label: "读写",
                                                                        suffix: "(全部读写接口)",
                                                                        desc: "可查询与修改",
                                                                        scope: "all",
                                                                        permission: "readwrite",
                                                                        icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
                                                                    },
                                                                    {
                                                                        key: "manage",
                                                                        label: "管理",
                                                                        suffix: "(全部接口)",
                                                                        desc: "含高危操作",
                                                                        scope: "all",
                                                                        permission: "manage",
                                                                        icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
                                                                    },
                                                                    {
                                                                        key: "specified",
                                                                        label: "指定接口",
                                                                        suffix: "(跨系统精细选择)",
                                                                        desc: "仅授权勾选的接口",
                                                                        scope: "specified",
                                                                        permission: null,
                                                                        icon: "M4 6h16M4 12h8m-8 6h5",
                                                                    },
                                                                ] as const).map((opt) => {
                                                                    const active = opt.scope === "all"
                                                                        ? newAccessKey.scope === "all" && newAccessKey.permission === opt.permission
                                                                        : newAccessKey.scope === "specified";
                                                                    return (
                                                                        <button
                                                                            key={opt.key}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (opt.permission) {
                                                                                    setNewAccessKey({ ...newAccessKey, scope: "all", permission: opt.permission });
                                                                                } else {
                                                                                    setNewAccessKey({ ...newAccessKey, scope: "specified" });
                                                                                }
                                                                            }}
                                                                            title={opt.desc}
                                                                            className={`group relative flex flex-col items-start gap-1 rounded-md border px-2.5 py-2 text-left transition-all duration-200 ${active
                                                                                ? "border-[#006bff] bg-[#006bff]/[0.03]"
                                                                                : "border-gray-200 bg-white hover:border-gray-300"}`}
                                                                        >
                                                                            <span className="flex w-full items-center gap-1.5">
                                                                                <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-colors duration-200 ${active ? "text-[#006bff]" : "text-gray-400 group-hover:text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={opt.icon} />
                                                                                </svg>
                                                                                <span className={`text-[13px] font-medium whitespace-nowrap transition-colors ${active ? "text-[#006bff]" : "text-gray-800"}`}>{opt.label}</span>
                                                                                <span className={`ml-auto flex items-center justify-center w-3.5 h-3.5 rounded-full border flex-shrink-0 transition-all duration-200 ${active ? "border-[#006bff] bg-[#006bff]" : "border-gray-300 bg-white group-hover:border-gray-400"}`}>
                                                                                    <svg className={`w-2 h-2 text-white transition-opacity duration-200 ${active ? "opacity-100" : "opacity-0"}`} fill="none" stroke="currentColor" strokeWidth={4} viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                                    </svg>
                                                                                </span>
                                                                            </span>
                                                                            <span className={`text-[11px] truncate w-full transition-colors ${active ? "text-[#006bff]/70" : "text-gray-350"}`}>{opt.suffix}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>

                                                            {/* 管理权限风险提示 */}
                                                            {newAccessKey.scope === "all" && newAccessKey.permission === "manage" && (
                                                                <div className="flex items-start gap-1.5 rounded bg-amber-50/70 border border-amber-100 px-2 py-1.5">
                                                                    <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                    </svg>
                                                                    <span className="text-[11px] text-amber-700 leading-[1.6]">管理权限包含删除、超管等高危操作，请谨慎授予</span>
                                                                </div>
                                                            )}


                                                        </div>

                                                        {/* 指定接口 - 已选接口配置面板（按系统分组） */}
                                                        {newAccessKey.scope === "specified" && (
                                                            <div className="mt-2 rounded-md border border-gray-150 bg-gray-50/50 px-3 py-2.5">
                                                                <div className="flex items-center justify-between gap-3 mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-[11px] font-medium text-gray-500 tracking-wide">已选接口</span>
                                                                        <span className={`px-1.5 py-px rounded text-[11px] font-medium tabular-nums transition-colors ${selectedApiObjects.length > 0 ? "bg-[#006bff]/10 text-[#006bff]" : "bg-gray-150 text-gray-400"}`}>
                                                                            {selectedApiObjects.length}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2.5">
                                                                        {selectedApiObjects.length > 0 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => setSelectedApiIds([])}
                                                                                className="text-[11px] text-gray-400 hover:text-red-500 transition-colors"
                                                                            >
                                                                                清空
                                                                            </button>
                                                                        )}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setApiSelectTempIds(selectedApiIds);
                                                                                setApiSelectSearch("");
                                                                                setApiSelectSystemSearch("");
                                                                                setApiSelectSystemId(apiDialogSystems[0]?.id || "");
                                                                                setApiSelectDialogOpen(true);
                                                                            }}
                                                                            className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#006bff]/30 text-[#006bff] rounded-md text-[11px] font-medium hover:bg-[#006bff]/[0.04] hover:border-[#006bff] transition-all whitespace-nowrap"
                                                                        >
                                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
                                                                            </svg>
                                                                            添加接口
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {selectedApiObjects.length === 0 ? (
                                                                    <div className="rounded border border-dashed border-gray-250 bg-white py-5 text-center">
                                                                        <svg className="w-6 h-6 mx-auto text-gray-250" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.3} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7m4-5v6m3-3h-6" />
                                                                        </svg>
                                                                        <p className="text-[13px] text-gray-500 mt-1.5">暂未选择接口</p>
                                                                        <p className="text-[11px] text-gray-350 mt-0.5">点击右上角「添加接口」按系统勾选</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="space-y-1.5">
                                                                        {(() => {
                                                                            // 按所属系统分组
                                                                            const groups = new Map<string, typeof selectedApiObjects>();
                                                                            selectedApiObjects.forEach((api) => {
                                                                                const arr = groups.get(api.productId) || [];
                                                                                arr.push(api);
                                                                                groups.set(api.productId, arr);
                                                                            });
                                                                            const methodColor: Record<string, string> = {
                                                                                GET: "bg-emerald-50 text-emerald-600",
                                                                                POST: "bg-blue-50 text-blue-600",
                                                                                PUT: "bg-orange-50 text-orange-600",
                                                                                DELETE: "bg-red-50 text-red-600",
                                                                            };
                                                                            return Array.from(groups.entries()).map(([sysId, apis]) => {
                                                                                const sys = keyProductsData.find((p) => p.id === sysId);
                                                                                const collapsed = collapsedApiGroups.includes(sysId);
                                                                                return (
                                                                                    <div key={sysId} className="rounded-md border border-gray-150 bg-white overflow-hidden">
                                                                                        <div className="group/hd flex items-center justify-between gap-2 pl-2 pr-2.5 py-1.5 bg-gray-50/60 border-b border-gray-100">
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    setCollapsedApiGroups((prev) =>
                                                                                                        collapsed ? prev.filter((id) => id !== sysId) : [...prev, sysId],
                                                                                                    )
                                                                                                }
                                                                                                className="flex items-center gap-1.5 min-w-0 flex-1 text-left"
                                                                                            >
                                                                                                <svg
                                                                                                    className={`w-3 h-3 text-gray-350 flex-shrink-0 transition-transform duration-200 ${collapsed ? "" : "rotate-90"}`}
                                                                                                    fill="none"
                                                                                                    stroke="currentColor"
                                                                                                    viewBox="0 0 24 24"
                                                                                                >
                                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5l7 7-7 7" />
                                                                                                </svg>
                                                                                                <span className={`px-1 py-px rounded text-[10px] font-medium flex-shrink-0 ${sys?.systemType === "platform" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-700"}`}>
                                                                                                    {sys?.systemType === "platform" ? "平台" : "产品"}
                                                                                                </span>
                                                                                                <span className="text-[13px] font-medium text-gray-800 truncate">{sys?.name || sysId}</span>
                                                                                                <span className="text-[11px] text-gray-350 flex-shrink-0 tabular-nums">· {apis.length}</span>
                                                                                            </button>
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() => {
                                                                                                    const ids = apis.map((a) => a.id);
                                                                                                    setSelectedApiIds((prev) => prev.filter((id) => !ids.includes(id)));
                                                                                                }}
                                                                                                className="text-[11px] text-gray-350 hover:text-red-500 transition-all flex-shrink-0 opacity-0 group-hover/hd:opacity-100"
                                                                                            >
                                                                                                移除
                                                                                            </button>
                                                                                        </div>
                                                                                        {!collapsed && (
                                                                                            <div className="divide-y divide-gray-50">
                                                                                                {apis.map((api) => (
                                                                                                    <div
                                                                                                        key={api.id}
                                                                                                        className="group flex items-center gap-2 px-2.5 py-1.5 hover:bg-gray-50/70 transition-colors"
                                                                                                    >
                                                                                                        <span className={`px-1 py-px rounded text-[9px] font-semibold flex-shrink-0 w-11 text-center tracking-wide ${methodColor[api.method] || "bg-gray-100 text-gray-600"}`}>
                                                                                                            {api.method}
                                                                                                        </span>
                                                                                                        <span className="text-[13px] text-gray-700 truncate flex-shrink-0 max-w-[150px]">{api.name}</span>
                                                                                                        <span className="text-[11px] text-gray-400 font-mono truncate flex-1 min-w-0">{api.path}</span>
                                                                                                        <button
                                                                                                            type="button"
                                                                                                            onClick={() => setSelectedApiIds((ids) => ids.filter((id) => id !== api.id))}
                                                                                                            className="flex-shrink-0 p-0.5 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                                                                            title="移除该接口"
                                                                                                        >
                                                                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
                                                                                                            </svg>
                                                                                                        </button>
                                                                                                    </div>
                                                                                                ))}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                );
                                                                            });
                                                                        })()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* 绑定IP白名单 */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">绑定IP白名单 <span className="text-red-500">*</span></label>
                                                        <textarea
                                                            value={newAccessKey.ipWhitelist}
                                                            onChange={(e) => setNewAccessKey({ ...newAccessKey, ipWhitelist: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="支持输入多个IP，用逗号或换行分隔；支持单IP（如 10.0.0.1）或网段（如 10.0.0.0/24）"
                                                            rows={3}
                                                        />
                                                        <p className="text-xs text-gray-400 mt-1.5">多个IP请用逗号或换行分隔，支持单IP和网段格式</p>
                                                    </div>

                                                    {/* 备注 */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                                                        <textarea
                                                            value={newAccessKey.remark}
                                                            onChange={(e) => setNewAccessKey({ ...newAccessKey, remark: e.target.value })}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="请输入备注信息（选填）"
                                                            rows={3}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 底部操作栏 */}
                                            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                                <button
                                                    onClick={handleCloseAccessKeyForm}
                                                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    取消
                                                </button>
                                                <button
                                                    onClick={editingAccessKeyId != null ? handleUpdateAccessKey : handleCreateAccessKey}
                                                    disabled={!newAccessKey.subject || !newAccessKey.ipWhitelist || (newAccessKey.scope === "specified" && selectedApiIds.length === 0)}
                                                    className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                >
                                                     {editingAccessKeyId != null ? "保存" : "创建"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 添加对接接口 - 弹框（左侧选择系统，右侧选择该系统下的接口，支持跨系统累加） */}
                                    {apiSelectDialogOpen && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                                            {/* 遮罩 */}
                                            <div
                                                className="absolute inset-0 bg-black/30"
                                                onClick={() => setApiSelectDialogOpen(false)}
                                            />
                                            {/* 弹框主体 */}
                                            <div className="relative w-[880px] max-w-full bg-white rounded-lg shadow-xl flex flex-col max-h-[80vh]">
                                                {/* 头部 */}
                                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900">添加接口</h3>
                                                        <p className="text-sm text-gray-500 mt-0.5">先在左侧选择系统，再在右侧勾选该系统下的接口，支持跨系统多选</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setApiSelectDialogOpen(false)}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* 主体：左右两栏 */}
                                                <div className="flex-1 flex min-h-0">
                                                    {/* 左侧：选择系统 */}
                                                    <div className="w-[260px] flex-shrink-0 border-r border-gray-200 flex flex-col min-h-0">
                                                        <div className="px-4 py-3 border-b border-gray-100">
                                                            <div className="text-xs font-medium text-gray-500 mb-2">选择系统</div>
                                                            <div className="relative">
                                                                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                </svg>
                                                                <input
                                                                    type="text"
                                                                    value={apiSelectSystemSearch}
                                                                    onChange={(e) => setApiSelectSystemSearch(e.target.value)}
                                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="搜索系统名称"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 overflow-auto p-2">
                                                            {(() => {
                                                                const kw = apiSelectSystemSearch.trim().toLowerCase();
                                                                const list = kw
                                                                    ? apiDialogSystems.filter(
                                                                        (p) =>
                                                                            p.name.toLowerCase().includes(kw) ||
                                                                            p.identifier.toLowerCase().includes(kw),
                                                                    )
                                                                    : apiDialogSystems;
                                                                if (list.length === 0) {
                                                                    return <div className="text-center text-sm text-gray-400 py-10">未找到匹配的系统</div>;
                                                                }
                                                                // 按平台/产品分组展示
                                                                const platforms = list.filter((p) => p.systemType === "platform");
                                                                const products = list.filter((p) => p.systemType === "product");
                                                                const renderGroup = (title: string, items: typeof list) =>
                                                                    items.length === 0 ? null : (
                                                                        <div className="mb-2">
                                                                            <div className="px-2 py-1 text-[11px] text-gray-400">{title}</div>
                                                                            {items.map((sys) => {
                                                                                const active = apiSelectSystemId === sys.id;
                                                                                const total = allApiInterfaces.filter((a) => a.productId === sys.id).length;
                                                                                const chosen = apiSelectTempIds.filter((id) =>
                                                                                    allApiInterfaces.some((a) => a.id === id && a.productId === sys.id),
                                                                                ).length;
                                                                                return (
                                                                                    <button
                                                                                        key={sys.id}
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            setApiSelectSystemId(sys.id);
                                                                                            setApiSelectSearch("");
                                                                                        }}
                                                                                        className={`w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg text-left transition-colors ${active ? "bg-blue-50 text-[#006bff]" : "text-gray-700 hover:bg-gray-50"}`}
                                                                                    >
                                                                                        <span className="text-sm truncate">{sys.name}</span>
                                                                                        {chosen > 0 ? (
                                                                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#006bff] text-white flex-shrink-0">{chosen}</span>
                                                                                        ) : (
                                                                                            <span className="text-[11px] text-gray-400 flex-shrink-0">{total}</span>
                                                                                        )}
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    );
                                                                return (
                                                                    <>
                                                                        {renderGroup("智汇云平台", platforms)}
                                                                        {renderGroup("智汇云产品", products)}
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>

                                                    {/* 右侧：选择接口 */}
                                                    <div className="flex-1 flex flex-col min-w-0 min-h-0">
                                                        <div className="px-6 py-3 border-b border-gray-100">
                                                            <div className="relative">
                                                                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                                </svg>
                                                                <input
                                                                    type="text"
                                                                    value={apiSelectSearch}
                                                                    onChange={(e) => setApiSelectSearch(e.target.value)}
                                                                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="搜索接口名称或接口路径"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 overflow-auto px-6 py-3">
                                                            {(() => {
                                                                if (!apiSelectSystemId) {
                                                                    return <div className="text-center text-[13px] text-gray-400 py-10">请先在左侧选择一个系统</div>;
                                                                }
                                                                const kw = apiSelectSearch.trim().toLowerCase();
                                                                const list = kw
                                                                    ? apiDialogApis.filter(
                                                                        (a) =>
                                                                            a.name.toLowerCase().includes(kw) ||
                                                                            a.path.toLowerCase().includes(kw) ||
                                                                            a.group.toLowerCase().includes(kw),
                                                                    )
                                                                    : apiDialogApis;
                                                                if (list.length === 0) {
                                                                    return <div className="text-center text-[13px] text-gray-400 py-10">暂无可选择的接口</div>;
                                                                }
                                                                const methodColor: Record<string, string> = {
                                                                    GET: "bg-emerald-50 text-emerald-600",
                                                                    POST: "bg-blue-50 text-blue-600",
                                                                    PUT: "bg-orange-50 text-orange-600",
                                                                    DELETE: "bg-red-50 text-red-600",
                                                                };
                                                                const allChecked = list.every((a) => apiSelectTempIds.includes(a.id));
                                                                return (
                                                                    <div>
                                                                        {/* 全选 */}
                                                                        <div className="flex items-center justify-between gap-3 px-0.5 pb-2 mb-2 border-b border-gray-100">
                                                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={allChecked}
                                                                                    onChange={() => {
                                                                                        const ids = list.map((a) => a.id);
                                                                                        setApiSelectTempIds((prev) =>
                                                                                            allChecked
                                                                                                ? prev.filter((id) => !ids.includes(id))
                                                                                                : Array.from(new Set([...prev, ...ids])),
                                                                                        );
                                                                                    }}
                                                                                    className="w-3.5 h-3.5 rounded-[3px] text-[#006bff] border-gray-300 focus:ring-1 focus:ring-[#006bff]/30 focus:ring-offset-0"
                                                                                />
                                                                                <span className="text-[13px] text-gray-600">全选当前列表</span>
                                                                            </label>
                                                                            <span className="text-[11px] text-gray-350 tabular-nums">共 {list.length} 个接口</span>
                                                                        </div>
                                                                        <div className="rounded-md border border-gray-150 divide-y divide-gray-50 overflow-hidden">
                                                                            {list.map((api) => {
                                                                                const checked = apiSelectTempIds.includes(api.id);
                                                                                return (
                                                                                    <label
                                                                                        key={api.id}
                                                                                        className={`flex items-center gap-2.5 px-2.5 py-2 cursor-pointer transition-colors ${checked ? "bg-[#006bff]/[0.035]" : "bg-white hover:bg-gray-50/70"}`}
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={checked}
                                                                                            onChange={() =>
                                                                                                setApiSelectTempIds((prev) =>
                                                                                                    checked ? prev.filter((id) => id !== api.id) : [...prev, api.id],
                                                                                                )
                                                                                            }
                                                                                            className="w-3.5 h-3.5 rounded-[3px] text-[#006bff] border-gray-300 focus:ring-1 focus:ring-[#006bff]/30 focus:ring-offset-0 flex-shrink-0"
                                                                                        />
                                                                                        <span className={`px-1 py-px rounded text-[9px] font-semibold flex-shrink-0 w-11 text-center tracking-wide ${methodColor[api.method] || "bg-gray-100 text-gray-600"}`}>{api.method}</span>
                                                                                        <span className={`text-[13px] flex-shrink-0 truncate max-w-[170px] transition-colors ${checked ? "text-[#006bff] font-medium" : "text-gray-800"}`}>{api.name}</span>
                                                                                        <span className="text-[11px] text-gray-400 font-mono truncate flex-1 min-w-0">{api.path}</span>
                                                                                        <span className="px-1 py-px rounded text-[10px] bg-gray-100 text-gray-500 flex-shrink-0">{api.group}</span>
                                                                                    </label>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* 底部操作栏 */}
                                                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                                                    <span className="text-sm text-gray-500">已选 {apiSelectTempIds.length} 个接口</span>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setApiSelectDialogOpen(false)}
                                                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                                        >
                                                            取消
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedApiIds(apiSelectTempIds);
                                                                setApiSelectDialogOpen(false);
                                                            }}
                                                            className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                                        >
                                                            确定
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6">
                                    {/* 页面标题 */}
                                    <div className="mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 mb-1">密钥管理</h2>
                                        <p className="text-sm text-gray-500">管理服务端对接的鉴权密钥列表，通过 AK/SK 和 IP 鉴权保障接口安全</p>
                                    </div>

                                    {/* 操作栏 */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        placeholder="搜索密钥名称/主体/AK"
                                                        value={accessKeySearch}
                                                        onChange={(e) => setAccessKeySearch(e.target.value)}
                                                        className="border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 w-64"
                                                    />
                                                </div>
                                                <select
                                                    value={accessKeyTypeFilter}
                                                    onChange={(e) => setAccessKeyTypeFilter(e.target.value as "all" | AccessKeyType)}
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="all">全部对接系统</option>
                                                    <option value="internal">智汇云平台</option>
                                                    <option value="thirdparty">智汇云产品</option>
                                                </select>
                                                <select
                                                    value={accessKeyStatusFilter}
                                                    onChange={(e) => setAccessKeyStatusFilter(e.target.value as "all" | "active" | "inactive")}
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="all">全部状态</option>
                                                    <option value="active">已启用</option>
                                                    <option value="inactive">已停用</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingAccessKeyId(null);
                                                        setSelectedProductId("");
                                                        setSelectedApiIds([]);
                                                        setNewAccessKey({
                                                            name: "",
                                                            subject: "",
                                                            type: "internal",
                                                            scope: "all",
                                                            ipWhitelist: "",
                                                            apiPath: "",
                                                            permission: "read",
                                                            remark: "",
                                                        });
                                                        setCreateAccessKeyDialogOpen(true);
                                                    }}
                                                    className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    创建密钥
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 密钥列表 */}
                                    <div className="bg-white rounded-lg border border-gray-200">
                                        <table className="w-full table-fixed">
                                            <colgroup>
                                                <col className="w-[12%]" />
                                                <col className="w-[16%]" />
                                                <col className="w-[8%]" />
                                                <col className="w-[10%]" />
                                                <col className="w-[14%]" />
                                                <col className="w-[9%]" />
                                                <col className="w-[6%]" />
                                                <col className="w-[8%]" />
                                                <col className="w-[8%]" />
                                                <col className="w-[9%]" />
                                            </colgroup>
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">密钥名称</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">AK / SK</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">对接方名称(谁接)</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">对接系统(接谁)</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">对接接口</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">绑定IP白名单</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">状态</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">创建时间</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">更新时间</th>
                                                    <th className="text-left py-3 px-3 text-sm font-medium text-gray-700">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredAccessKeys.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={10} className="py-16 text-center">
                                                            <div className="flex flex-col items-center text-gray-400">
                                                                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a4 4 0 11-8 0 4 4 0 018 0zM12 7v10m0 0l-3 3m3-3l3 3" />
                                                                </svg>
                                                                <p className="text-sm">暂无密钥数据</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredAccessKeys.map((key) => {
                                                        const isSkRevealed = revealedSkIds.includes(key.id);
                                                        return (
                                                            <tr key={key.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                                <td className="py-3 px-3">
                                                                    <div className="font-medium text-gray-900">{key.name}</div>
                                                                    {key.remark && (
                                                                        <div className="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate" title={key.remark}>{key.remark}</div>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <div className="space-y-1.5">
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-xs text-gray-400 flex-shrink-0">AK</span>
                                                                            <span className="text-xs text-gray-700 font-mono truncate flex-1 min-w-0" title={key.ak}>{key.ak}</span>
                                                                            <button
                                                                                onClick={() => handleCopy(key.ak, `ak-${key.id}`)}
                                                                                className="p-0.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
                                                                                title="复制AK"
                                                                            >
                                                                                {copiedField === `ak-${key.id}` ? (
                                                                                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                    </svg>
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                        <div className="flex items-center gap-1">
                                                                            <span className="text-xs text-gray-400 flex-shrink-0">SK</span>
                                                                            <span className="text-xs text-gray-700 font-mono truncate flex-1 min-w-0" title={key.sk}>{isSkRevealed ? key.sk : maskSk(key.sk)}</span>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setRevealedSkIds(prev =>
                                                                                        prev.includes(key.id)
                                                                                            ? prev.filter(id => id !== key.id)
                                                                                            : [...prev, key.id]
                                                                                    );
                                                                                }}
                                                                                className="p-0.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
                                                                                title={isSkRevealed ? "隐藏SK" : "查看SK"}
                                                                            >
                                                                                {isSkRevealed ? (
                                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                    </svg>
                                                                                )}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleCopy(key.sk, `sk-${key.id}`)}
                                                                                className="p-0.5 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
                                                                                title="复制SK"
                                                                            >
                                                                                {copiedField === `sk-${key.id}` ? (
                                                                                    <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                    </svg>
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <span className="text-sm text-gray-700">{key.subject}</span>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    {key.type === "internal" ? (
                                                                        <span className="inline-block px-2 py-1 text-xs rounded bg-blue-50 text-blue-700">
                                                                            智汇云平台
                                                                        </span>
                                                                    ) : (
                                                                        <div className="flex flex-col gap-1">
                                                                            {key.productId && (() => {
                                                                                const prod = keyProductsData.find(p => p.id === key.productId);
                                                                                return prod ? (
                                                                                    <span className="inline-block px-2 py-1 text-xs rounded bg-amber-50 text-amber-700">
                                                                                        {prod.category} {prod.name} ({prod.identifier})
                                                                                    </span>
                                                                                ) : null;
                                                                            })()}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    {key.scope === "all" ? (() => {
                                                                        // 全部接口场景：按权限级别展示对应的接口范围文案
                                                                        const scopeMap: Record<string, { label: string; cls: string }> = {
                                                                            read: { label: "全部只读接口", cls: "bg-gray-50 text-gray-600" },
                                                                            readwrite: { label: "全部读写接口", cls: "bg-emerald-50 text-emerald-600" },
                                                                            manage: { label: "管理全部接口", cls: "bg-amber-50 text-amber-700" },
                                                                        };
                                                                        const s = scopeMap[key.permission || "read"];
                                                                        return (
                                                                            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded ${s.cls}`}>
                                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                </svg>
                                                                                {s.label}
                                                                            </span>
                                                                        );
                                                                    })() : (
                                                                        (() => {
                                                                            const paths = key.apiPath
                                                                                .split(/[,，\n]/)
                                                                                .map(p => p.trim())
                                                                                .filter(Boolean);
                                                                            if (paths.length === 0) {
                                                                                return <span className="text-xs text-gray-400">—</span>;
                                                                            }
                                                                            return (
                                                                                <div className="max-w-[240px]">
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <span className="px-1.5 py-0.5 text-[11px] bg-[#006bff]/10 text-[#006bff] rounded font-medium flex-shrink-0">
                                                                                            {paths.length} 个接口
                                                                                        </span>
                                                                                        <span className="text-xs text-gray-500 font-mono truncate" title={paths.join("\n")}>
                                                                                            {paths[0]}
                                                                                        </span>
                                                                                    </div>
                                                                                    {paths.length > 1 && (
                                                                                        <div className="text-[11px] text-gray-400 mt-0.5" title={paths.join("\n")}>
                                                                                            等 {paths.length} 个，悬停查看全部
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })()
                                                                    )}
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <div className="text-sm text-gray-600">
                                                                        {key.ipWhitelist.map((ip, idx) => (
                                                                            <span key={idx} className="inline-block px-1.5 py-0.5 mr-1 mb-1 text-xs bg-gray-100 text-gray-600 rounded font-mono">{ip}</span>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                                        key.status === "active"
                                                                            ? "bg-green-50 text-green-700"
                                                                            : "bg-gray-100 text-gray-500"
                                                                    }`}>
                                                                        {key.status === "active" ? "已启用" : "已停用"}
                                                                    </span>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <span className="text-sm text-gray-600">{key.createTime}</span>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <span className="text-sm text-gray-600">{key.updateTime}</span>
                                                                </td>
                                                                <td className="py-3 px-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => handleOpenEditAccessKey(key)}
                                                                            className="text-blue-600 hover:text-blue-700 text-sm"
                                                                        >
                                                                            编辑
                                                                        </button>
                                                                        {key.status === "active" ? (
                                                                            <button
                                                                                onClick={() => handleToggleAccessKeyStatus(key.id, key.name, "inactive")}
                                                                                className="text-orange-600 hover:text-orange-700 text-sm"
                                                                            >
                                                                                停用
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                onClick={() => handleToggleAccessKeyStatus(key.id, key.name, "active")}
                                                                                className="text-green-600 hover:text-green-700 text-sm"
                                                                            >
                                                                                启用
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* 创建成功 - AK/SK 结果弹窗 */}
                            {accessKeyResult && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-[480px] max-w-[90vw]">
                                        <div className="px-6 py-5 border-b border-gray-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">密钥创建成功</h3>
                                                    <p className="text-sm text-gray-500 mt-0.5">密钥「{accessKeyResult.name}」已成功创建，请妥善保管以下凭证</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                                                <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                <p className="text-xs text-amber-700">SecretKey（SK）仅在创建时完整展示一次，请立即复制并妥善保存。关闭后将无法再次查看完整SK。</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">AccessKey (AK)</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={accessKeyResult.ak}
                                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono bg-gray-50"
                                                    />
                                                    <button
                                                        onClick={() => handleCopy(accessKeyResult.ak, "result-ak")}
                                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                                                    >
                                                        {copiedField === "result-ak" ? (
                                                            <>
                                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                已复制
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                                复制
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">SecretKey (SK)</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={accessKeyResult.sk}
                                                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 font-mono bg-gray-50"
                                                    />
                                                    <button
                                                        onClick={() => handleCopy(accessKeyResult.sk, "result-sk")}
                                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1"
                                                    >
                                                        {copiedField === "result-sk" ? (
                                                            <>
                                                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                已复制
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                                复制
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                            <button
                                                onClick={() => setAccessKeyResult(null)}
                                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                我已保存，关闭
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 启用/停用确认弹窗 */}
                            {accessKeyToggleConfirm && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-[90vw]">
                                        <div className="p-6">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-base font-semibold text-gray-900 mb-1">确认{accessKeyToggleConfirm.action}密钥</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {accessKeyToggleConfirm.action === "停用"
                                                            ? `停用后，使用该密钥的请求将被拒绝。确定要停用密钥「${accessKeyToggleConfirm.name}」吗？`
                                                            : `启用后，使用该密钥的请求将恢复正常。确定要启用密钥「${accessKeyToggleConfirm.name}」吗？`}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                            <button
                                                onClick={() => setAccessKeyToggleConfirm(null)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button
                                                onClick={handleConfirmToggleAccessKey}
                                                className={`px-4 py-2 text-white rounded-lg text-sm transition-colors ${
                                                    accessKeyToggleConfirm.action === "停用"
                                                        ? "bg-orange-500 hover:bg-orange-600"
                                                        : "bg-green-500 hover:bg-green-600"
                                                }`}
                                            >
                                                确定{accessKeyToggleConfirm.action}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 删除确认弹窗 */}
                            {accessKeyDeleteConfirm && (
                                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-[90vw]">
                                        <div className="p-6">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-base font-semibold text-gray-900 mb-1">确认删除密钥</h3>
                                                    <p className="text-sm text-gray-500">
                                                        删除后该密钥将永久失效且无法恢复，使用该密钥的请求将立即被拒绝。确定要删除密钥「{accessKeyDeleteConfirm.name}」吗？
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                            <button
                                                onClick={() => setAccessKeyDeleteConfirm(null)}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                取消
                                            </button>
                                            <button
                                                onClick={handleConfirmDeleteAccessKey}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                                            >
                                                确认删除
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 平台配置 - API接口页面 */}
                    {currentMenu === 'platform-api' && (
                        <div className="flex-1 overflow-auto bg-gray-50">
                            <div className="p-6">
                                {/* 页面标题 */}
                                <div className="mb-3 flex items-baseline gap-2">
                                    <h2 className="text-xl font-semibold text-gray-900">系统间对接API接口</h2>
                                    <p className="text-sm text-gray-500">各系统对外提供的接口列表</p>
                                </div>

                                {/* 左右两栏布局：左侧产品列表 + 右侧当前产品接口列表 */}
                                <div className="flex gap-4">
                                    {/* 左侧 - 产品列表 */}
                                    <div className="w-80 flex-shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 180px)", minHeight: 600 }}>
                                        <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white flex-shrink-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-sm font-semibold text-gray-900">所属系统模块</div>
                                                <div className="flex items-center gap-2 text-[11px]">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600">
                                                        系统
                                                        <span className="font-semibold text-gray-900">{keyProductsData.length}</span>
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-gray-600">
                                                        接口
                                                        <span className="font-semibold text-[#006bff]">{allApiInterfaces.length}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="relative mb-2">
                                                <input
                                                    type="text"
                                                    value={apiManagerProductSearch}
                                                    onChange={(e) => setApiManagerProductSearch(e.target.value)}
                                                    placeholder="搜索系统/产品"
                                                    className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                                                />
                                                <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                                                </svg>
                                            </div>
                                            {/* 所属系统筛选：智汇云平台 / 智汇云产品 */}
                                            <div className="flex items-center gap-1 mb-2">
                                                {([
                                                    { key: "all", label: "全部" },
                                                    { key: "platform", label: "智汇云平台" },
                                                    { key: "product", label: "智汇云产品" },
                                                ] as const).map((opt) => (
                                                    <button
                                                        key={opt.key}
                                                        onClick={() => { setApiManagerSystemTypeFilter(opt.key); if (opt.key !== "product") setApiManagerProductLineFilter("all"); }}
                                                        className={`flex-1 px-1.5 py-1 text-[11px] rounded-md border transition-colors ${apiManagerSystemTypeFilter === opt.key ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* 产线筛选：仅对智汇云产品生效 */}
                                            {apiManagerSystemTypeFilter === "product" && (
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[11px] text-gray-500 flex-shrink-0">产线</span>
                                                    <select
                                                        value={apiManagerProductLineFilter}
                                                        onChange={(e) => setApiManagerProductLineFilter(e.target.value)}
                                                        className="flex-1 min-w-0 px-2 py-1 text-[11px] border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                                                    >
                                                        <option value="all">全部产线</option>
                                                        {Array.from(new Set(keyProductsData.filter(p => p.systemType === "product").map(p => p.category))).map(c => (
                                                            <option key={c} value={c}>{c}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 overflow-y-auto py-1">
                                            {(() => {
                                                const kw = apiManagerProductSearch.trim().toLowerCase();
                                                const matchSearch = (p: typeof keyProductsData[number]) => {
                                                    if (!kw) return true;
                                                    return p.name.toLowerCase().includes(kw) || p.identifier.toLowerCase().includes(kw) || p.category.toLowerCase().includes(kw);
                                                };
                                                const withCount = visibleKeyProducts.map((p) => ({ ...p, apiCount: allApiInterfaces.filter(a => a.productId === p.id).length }));

                                                const platformList = withCount.filter(p => p.systemType === "platform" && matchSearch(p));
                                                const productList = withCount.filter(p => {
                                                    if (p.systemType !== "product") return false;
                                                    if (apiManagerProductLineFilter !== "all" && p.category !== apiManagerProductLineFilter) return false;
                                                    return matchSearch(p);
                                                });

                                                const showPlatform = apiManagerSystemTypeFilter !== "product";
                                                const showProduct = apiManagerSystemTypeFilter !== "platform";

                                                const renderItem = (product: typeof withCount[number]) => {
                                                    const checked = apiManagerSelectedProductId === product.id;
                                                    return (
                                                        <div
                                                            key={product.id}
                                                            onClick={() => setApiManagerSelectedProductId(product.id)}
                                                            className={`group mx-2 my-1 px-3 py-2.5 rounded-md cursor-pointer transition-colors flex items-center gap-2.5 ${checked ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"}`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold flex-shrink-0 ${checked ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                                                                {product.name.charAt(0)}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className={`text-sm truncate ${checked ? "text-blue-700 font-semibold" : "text-gray-800"}`}>{product.name}</div>
                                                                <div className="flex items-center gap-1 mt-0.5">
                                                                    <span className={`inline-block px-1 py-px text-[10px] rounded ${product.systemType === "platform" ? "bg-purple-50 text-purple-600" : "bg-emerald-50 text-emerald-600"}`}>
                                                                        {product.systemType === "platform" ? "平台" : product.category}
                                                                    </span>
                                                                    <span className="text-[11px] text-gray-400 font-mono truncate">{product.identifier}</span>
                                                                </div>
                                                            </div>
                                                            <span className={`inline-flex items-center justify-center text-[11px] font-medium min-w-[22px] h-5 px-1.5 rounded ${checked ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                                                                {product.apiCount}
                                                            </span>
                                                            {/* 删除系统按钮：删除该系统及其下所有接口 */}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSystemDeleteConfirm({ id: product.id, name: product.name, apiCount: product.apiCount });
                                                                }}
                                                                title="删除该系统及其下所有接口"
                                                                className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    );
                                                };

                                                if (platformList.length === 0 && productList.length === 0) {
                                                    return <div className="px-4 py-8 text-center text-xs text-gray-400">未找到匹配的系统/产品</div>;
                                                }

                                                return (
                                                    <>
                                                        {showPlatform && platformList.length > 0 && (
                                                            <div className="mb-1">
                                                                <div className="sticky top-0 z-10 px-3 py-1.5 bg-gray-50/95 backdrop-blur-sm flex items-center gap-1.5">
                                                                    <span className="w-1 h-3 rounded-full bg-purple-400" />
                                                                    <span className="text-[11px] font-semibold text-gray-600">智汇云平台</span>
                                                                    <span className="text-[10px] text-gray-400">({platformList.length})</span>
                                                                </div>
                                                                {platformList.map(renderItem)}
                                                            </div>
                                                        )}
                                                        {showProduct && (
                                                            <div>
                                                                <div className="sticky top-0 z-10 px-3 py-1.5 bg-gray-50/95 backdrop-blur-sm flex items-center gap-1.5">
                                                                    <span className="w-1 h-3 rounded-full bg-emerald-400" />
                                                                    <span className="text-[11px] font-semibold text-gray-600">智汇云产品</span>
                                                                    <span className="text-[10px] text-gray-400">({productList.length})</span>
                                                                </div>
                                                                {productList.length > 0 ? productList.map(renderItem) : (
                                                                    <div className="px-4 py-4 text-center text-[11px] text-gray-400">该产线下暂无产品</div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* 右侧 - 当前产品接口列表 */}
                                    <div className="flex-1 min-w-0 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 180px)", minHeight: 600 }}>
                                        {(() => {
                                            const currentProduct = keyProductsData.find(p => p.id === apiManagerSelectedProductId);
                                            if (!currentProduct) {
                                                return (
                                                    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                                                        请在左侧选择产品
                                                    </div>
                                                );
                                            }
                                            const productApis = allApiInterfaces.filter(a => a.productId === currentProduct.id);
                                            return (
                                                <>
                                                    {/* 产品头：系统信息 + 搜索 + 添加接口，单行紧凑布局 */}
                                                    <div className="px-4 py-2.5 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200 flex-shrink-0">
                                                        <div className="flex items-center gap-3">
                                                            {/* 系统信息 */}
                                                            <div className="flex items-center gap-2 min-w-0">
                                                                <div className="w-7 h-7 rounded-md bg-blue-500 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                                                    {currentProduct.name.charAt(0)}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <span className="text-sm font-semibold text-gray-900 truncate">{currentProduct.name}</span>
                                                                        <span className="flex-shrink-0 inline-block px-1.5 py-px text-[10px] rounded bg-blue-50 text-blue-700">
                                                                            {currentProduct.category}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1.5 leading-none">
                                                                        <span className="text-[11px] text-gray-500 font-mono truncate">{currentProduct.identifier}</span>
                                                                        <span className="text-gray-200">|</span>
                                                                        <span className="text-[11px] text-gray-500 flex-shrink-0">接口 <span className="font-semibold text-gray-900">{productApis.length}</span></span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex-1" />

                                                            {/* 搜索 */}
                                                            <div className="relative w-[220px] flex-shrink-0">
                                                                <input
                                                                    type="text"
                                                                    value={apiManagerApiNameSearch}
                                                                    onChange={(e) => setApiManagerApiNameSearch(e.target.value)}
                                                                    placeholder="搜索接口名称"
                                                                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 bg-white"
                                                                />
                                                                <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
                                                                </svg>
                                                            </div>

                                                            {/* 添加接口 */}
                                                            <button
                                                                onClick={openAddApiDrawer}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-[#006bff] text-white rounded-md text-xs hover:bg-blue-600 transition-colors flex-shrink-0"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                                添加接口
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* 接口表格 */}
                                                    <div className="flex-1 overflow-auto">
                                                        {(() => {
                                                            // 按接口名称筛选
                                                            const kw = apiManagerApiNameSearch.trim().toLowerCase();
                                                            const sorted = productApis.filter(api => !kw || api.name.toLowerCase().includes(kw));
                                                            if (sorted.length === 0) {
                                                                return (
                                                                    <div className="px-5 py-16 text-center text-sm text-gray-400">未找到匹配的接口</div>
                                                                );
                                                            }
                                                            return (
                                                            <table className="w-full table-fixed">
                                                                <colgroup>
                                                                    <col style={{ width: "34%" }} />
                                                                    <col style={{ width: "10%" }} />
                                                                    <col style={{ width: "19%" }} />
                                                                    <col style={{ width: "12%" }} />
                                                                    <col style={{ width: "12%" }} />
                                                                    <col style={{ width: "13%" }} />
                                                                </colgroup>
                                                                <thead className="sticky top-0 bg-white z-10">
                                                                    <tr className="bg-gray-50/50 border-b border-gray-200">
                                                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">接口信息</th>
                                                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">权限类型</th>
                                                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">接口描述</th>
                                                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">创建时间</th>
                                                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">编辑时间</th>
                                                                        <th className="text-left py-2.5 px-4 text-xs font-medium text-gray-500">操作</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {sorted.map((api) => {
                                                                        const methodColor: Record<string, string> = {
                                                                            GET: "bg-green-50 text-green-600 border-green-200",
                                                                            POST: "bg-blue-50 text-blue-600 border-blue-200",
                                                                            PUT: "bg-orange-50 text-orange-600 border-orange-200",
                                                                            DELETE: "bg-red-50 text-red-600 border-red-200",
                                                                        };
                                                                        const times = getApiMockTimes(api.id);
                                                                        return (
                                                                            <tr key={api.id} className="group border-b border-gray-100 last:border-b-0 hover:bg-blue-50/30 transition-colors">
                                                                                {/* 接口信息：请求方法 + 接口名称 + 接口路径 合并一行 */}
                                                                                <td className="py-3 px-4">
                                                                                    <div className="flex items-start gap-2">
                                                                                        <span className={`flex-shrink-0 inline-block px-2 py-0.5 mt-0.5 rounded text-[11px] font-medium border ${methodColor[api.method] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                                                                            {api.method}
                                                                                        </span>
                                                                                        <div className="min-w-0 flex-1">
                                                                                            <div className="flex items-center gap-1.5">
                                                                                                <span className="text-sm text-gray-900 font-medium truncate">{api.name}</span>
                                                                                                <button
                                                                                                    onClick={() => openEditApiDrawer(api)}
                                                                                                    className="flex-shrink-0 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-[#006bff] transition-all"
                                                                                                    title="编辑接口"
                                                                                                >
                                                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                                    </svg>
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                                                                <span className="text-xs text-gray-500 font-mono truncate" title={api.path}>{api.path}</span>
                                                                                                <button
                                                                                                    onClick={() => handleCopy(api.path, `api-path-${api.id}`)}
                                                                                                    className="flex-shrink-0 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-[#006bff] transition-all"
                                                                                                    title="复制接口路径"
                                                                                                >
                                                                                                    {copiedField === `api-path-${api.id}` ? (
                                                                                                        <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                                                        </svg>
                                                                                                    ) : (
                                                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                                        </svg>
                                                                                                    )}
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td className="py-3 px-4">
                                                                                    {(() => {
                                                                                        const permMap: Record<string, { label: string; cls: string }> = {
                                                                                            read: { label: "只读", cls: "bg-gray-50 text-gray-600 border-gray-200" },
                                                                                            readwrite: { label: "读写", cls: "bg-blue-50 text-blue-600 border-blue-200" },
                                                                                            manage: { label: "管理", cls: "bg-amber-50 text-amber-600 border-amber-200" },
                                                                                        };
                                                                                        const p = permMap[api.permission || "read"];
                                                                                        return (
                                                                                            <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${p.cls}`}>
                                                                                                {p.label}
                                                                                            </span>
                                                                                        );
                                                                                    })()}
                                                                                </td>
                                                                                <td className="py-3 px-4">
                                                                                    <span className="text-sm text-gray-500 break-words whitespace-normal">{api.description}</span>
                                                                                </td>
                                                                                <td className="py-3 px-4">
                                                                                    <span className="text-xs text-gray-500 break-words">{api.createdAt ?? times.createdAt}</span>
                                                                                </td>
                                                                                <td className="py-3 px-4">
                                                                                    <span className="text-xs text-gray-500 break-words">{api.updatedAt ?? times.updatedAt}</span>
                                                                                </td>
                                                                                <td className="py-3 px-4">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <button
                                                                                            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                                                                            onClick={() => openEditApiDrawer(api)}
                                                                                        >
                                                                                            编辑
                                                                                        </button>
                                                                                        <span className="text-gray-200">|</span>
                                                                                        <button
                                                                                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                                                                                            onClick={() => setApiDeleteConfirm({ id: api.id, name: api.name })}
                                                                                        >
                                                                                            删除
                                                                                        </button>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    })}
                                                                </tbody>
                                                            </table>
                                                            );
                                                        })()}
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 智企管理后台 - 原有内容 */}
                    {currentMenu === 'zhiqi-admin' && (
                        <>
                    {/* 左侧二级菜单 */}
                    <aside className={`bg-white border-r border-gray-200 flex-shrink-0 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "w-12" : "w-48"}`}>
                        {/* 标题区域 */}
                        <div className="p-4 border-b border-gray-200 flex items-center justify-between min-h-[57px]">
                            {!sidebarCollapsed && (
                                <h3 className="text-base font-semibold text-gray-900">智企管理后台</h3>
                            )}
                            <button
                                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                                className={`p-1 hover:bg-gray-100 rounded transition-colors ${sidebarCollapsed ? "mx-auto" : ""}`}
                                title={sidebarCollapsed ? "展开菜单" : "收起菜单"}
                            >
                                <svg className={`w-4 h-4 text-gray-500 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                        <nav className="py-2 flex-1">
                            {adminTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center transition-colors ${
                                        sidebarCollapsed ? "justify-center px-2 py-3" : "gap-3 px-4 py-2.5"
                                    } text-sm font-medium ${
                                        activeTab === tab.id
                                            ? "bg-blue-50 text-[#006bff] border-l-2 border-[#006bff]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                                    title={tab.name}
                                >
                                    <span className={`flex-shrink-0 ${activeTab === tab.id ? "text-[#006bff]" : "text-gray-400"}`}>
                                        {getTabIcon(tab.icon, "w-5 h-5")}
                                    </span>
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="flex-1 text-left">{tab.name}</span>
                                            {activeTab === tab.id && (
                                                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            )}
                                        </>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* 内容区域 */}
                    <div className="flex-1 overflow-auto">
                        {/* 套餐管理 Tab 内容 */}
                        {activeTab === "packages" && (
                        <div className={createPackageDialogOpen && packageSubTab === "packages" ? "flex flex-col h-full" : "p-6"}>
                            {/* 二级菜单 - 创建表单时隐藏 */}
                            {!(createPackageDialogOpen && packageSubTab === "packages") ? (
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setPackageSubTab("packages")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        packageSubTab === "packages"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    套餐管理
                                    {packageSubTab === "packages" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setPackageSubTab("analysis")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        packageSubTab === "analysis"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    数据分析
                                    {packageSubTab === "analysis" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>
                            ) : null}

                            {/* 数据分析 Tab */}
                            {packageSubTab === "analysis" && (
                                <>
                                    {/* 套餐统计卡片 */}
                                    <div className="grid grid-cols-4 gap-6 mb-4">
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="text-sm text-gray-500 mb-2">套餐总数</div>
                                            <div className="text-3xl font-bold text-gray-900">{packagesData.length}</div>
                                        </div>
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="text-sm text-gray-500 mb-2">已上架套餐</div>
                                            <div className="text-3xl font-bold text-green-600">{packagesData.filter(p => p.status === "active").length}</div>
                                        </div>
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="text-sm text-gray-500 mb-2">已售套餐数量</div>
                                            <div className="text-3xl font-bold text-orange-600">{packagesData.reduce((sum, p) => sum + p.soldCount, 0).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                                            <div className="text-sm text-gray-500 mb-2">总收入</div>
                                            <div className="text-3xl font-bold text-blue-600">{formatMoney(packagesData.reduce((sum, p) => sum + p.totalIncome, 0))}</div>
                                        </div>
                                    </div>

                                    {/* 月包统计卡片 */}
                                    <div className="grid grid-cols-4 gap-6 mb-4">
                                        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                            <div className="text-sm text-purple-600 mb-1">月包总数</div>
                                            <div className="text-2xl font-bold text-purple-700">{packagesData.filter(p => p.type === "monthly").length}</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                            <div className="text-sm text-purple-600 mb-1">已上架月包</div>
                                            <div className="text-2xl font-bold text-purple-700">{packagesData.filter(p => p.type === "monthly" && p.status === "active").length}</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                            <div className="text-sm text-purple-600 mb-1">月包已售数量</div>
                                            <div className="text-2xl font-bold text-purple-700">{packagesData.filter(p => p.type === "monthly").reduce((sum, p) => sum + p.soldCount, 0).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
                                            <div className="text-sm text-purple-600 mb-1">月包收入</div>
                                            <div className="text-2xl font-bold text-purple-700">{formatMoney(packagesData.filter(p => p.type === "monthly").reduce((sum, p) => sum + p.totalIncome, 0))}</div>
                                        </div>
                                    </div>

                                    {/* 加油包统计卡片 */}
                                    <div className="grid grid-cols-4 gap-6">
                                        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                            <div className="text-sm text-green-600 mb-1">加油包总数</div>
                                            <div className="text-2xl font-bold text-green-700">{packagesData.filter(p => p.type === "addon").length}</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                            <div className="text-sm text-green-600 mb-1">已上架加油包</div>
                                            <div className="text-2xl font-bold text-green-700">{packagesData.filter(p => p.type === "addon" && p.status === "active").length}</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                            <div className="text-sm text-green-600 mb-1">加油包已售数量</div>
                                            <div className="text-2xl font-bold text-green-700">{packagesData.filter(p => p.type === "addon").reduce((sum, p) => sum + p.soldCount, 0).toLocaleString()}</div>
                                        </div>
                                        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                                            <div className="text-sm text-green-600 mb-1">加油包收入</div>
                                            <div className="text-2xl font-bold text-green-700">{formatMoney(packagesData.filter(p => p.type === "addon").reduce((sum, p) => sum + p.totalIncome, 0))}</div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* 套餐管理 Tab */}
                            {packageSubTab === "packages" && !createPackageDialogOpen && (
                                <>
                                    {/* 操作栏 */}
                                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        placeholder="搜索套餐名称"
                                                        value={packageNameSearch}
                                                        onChange={(e) => setPackageNameSearch(e.target.value)}
                                                        className="border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500 w-48"
                                                    />
                                                </div>
                                                <select
                                                    value={packageTypeFilter}
                                                    onChange={(e) => setPackageTypeFilter(e.target.value)}
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="all">全部产品</option>
                                                    <option value="ai-plan">AI计划</option>
                                                    <option value="lobster">龙虾</option>
                                                </select>
                                                <select
                                                    value={packageStatusFilter}
                                                    onChange={(e) => setPackageStatusFilter(e.target.value)}
                                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="all">全部状态</option>
                                                    <option value="active">已上架</option>
                                                    <option value="inactive">已下架</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button 
                                                    onClick={() => {
                                                        setNewPackage({
                                                            name: "",
                                                            identifier: "",
                                                            product: "ai-plan",
                                                            description: "",
                                                            type: "monthly",
                                                            price: 0,
                                                            costPrice: 0,
                                                            priceHint: "",
                                                            hourLimit5: null,
                                                            weekLimit: null,
                                                            monthLimit: null,
                                                            capabilityDesc: "",
                                                            lobsterCount: 1, // 月包默认1
                                                            memberCount: 1, // 月包默认1
                                                            availableModels: ALL_MODELS.map(m => m.id), // 默认全部模型
                                                            purchaseLimit: null,
                                                            stock: null,
                                                            officialDiscount: 10,
                                                            internalDiscount: 10,
                                                            svipDiscount: 10,
                                                            vipDiscount: 10,
                                                        });
                                                        setCreatePackageDialogOpen(true);
                                                    }}
                                                    className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    创建套餐
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 套餐列表 */}
                                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐名称</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">套餐标识</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">规格</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">所属产品</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">价格</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">已售数量</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">收入金额</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">状态</th>
                                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredPackages.map((pkg) => {
                                                    const isExpanded = expandedPackageIds.includes(pkg.id);
                                                    return (
                                                        <React.Fragment key={pkg.id}>
                                                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-start gap-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setExpandedPackageIds(prev => 
                                                                                prev.includes(pkg.id) 
                                                                                    ? prev.filter(id => id !== pkg.id)
                                                                                    : [...prev, pkg.id]
                                                                            );
                                                                        }}
                                                                        className="mt-1 p-0.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                                                                        title={expandedPackageIds.includes(pkg.id) ? "收起" : "展开"}
                                                                    >
                                                                        <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedPackageIds.includes(pkg.id) ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                                        </svg>
                                                                    </button>
                                                                    <div className="font-medium text-gray-900">{pkg.name}</div>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className="text-sm text-gray-600 font-mono">{pkg.identifier}</span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="text-sm text-gray-600 space-y-0.5">
                                                                    {pkg.priceHint ? (
                                                                        <div>{pkg.priceHint}</div>
                                                                    ) : null}
                                                                    {pkg.hourLimit5 != null ? (
                                                                        <div>5小时限额: {pkg.hourLimit5}</div>
                                                                    ) : null}
                                                                    {pkg.weekLimit != null ? (
                                                                        <div>周限额: {pkg.weekLimit}</div>
                                                                    ) : null}
                                                                    {pkg.monthLimit != null ? (
                                                                        <div>月限额: {pkg.monthLimit}</div>
                                                                    ) : null}
                                                                    {!pkg.priceHint && pkg.hourLimit5 == null && pkg.weekLimit == null && pkg.monthLimit == null && (
                                                                        <span className="text-gray-400">-</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                                    pkg.product === "ai-plan" 
                                                                        ? "bg-blue-50 text-blue-700" 
                                                                        : "bg-orange-50 text-orange-700"
                                                                }`}>
                                                                    {pkg.product === "ai-plan" ? "AI计划" : "龙虾"}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="text-gray-900 font-medium">
                                                                    {pkg.price > 0 ? `¥${pkg.price.toLocaleString()}${pkg.type === 'monthly' ? '/月' : ''}` : "免费"}
                                                                </div>
                                                                {(pkg.officialDiscount || pkg.internalDiscount || pkg.svipDiscount || pkg.vipDiscount) && (
                                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                                        {pkg.officialDiscount && (
                                                                            <span className="inline-block px-1.5 py-0.5 text-xs bg-orange-50 text-orange-600 rounded">官方{pkg.officialDiscount}折</span>
                                                                        )}
                                                                        {pkg.internalDiscount && (
                                                                            <span className="inline-block px-1.5 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">内部{pkg.internalDiscount}折</span>
                                                                        )}
                                                                        {pkg.svipDiscount && (
                                                                            <span className="inline-block px-1.5 py-0.5 text-xs bg-purple-50 text-purple-600 rounded">SVIP{pkg.svipDiscount}折</span>
                                                                        )}
                                                                        {pkg.vipDiscount && (
                                                                            <span className="inline-block px-1.5 py-0.5 text-xs bg-green-50 text-green-600 rounded">VIP{pkg.vipDiscount}折</span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-gray-900 font-medium">{pkg.soldCount}</td>
                                                            <td className="py-3 px-4 text-gray-900 font-medium text-green-600">{formatMoney(pkg.totalIncome)}</td>
                                                            <td className="py-3 px-4">
                                                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                                    pkg.status === "active" 
                                                                        ? "bg-green-50 text-green-700" 
                                                                        : "bg-gray-100 text-gray-500"
                                                                }`}>
                                                                    {pkg.status === "active" ? "已上架" : "已下架"}
                                                                </span>
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <div className="flex items-center gap-2">
                                                                    {pkg.status === "active" ? (
                                                                        <button 
                                                                            onClick={() => handleTogglePackageStatus(pkg.id, pkg.name, "inactive")}
                                                                            className="text-orange-600 hover:text-orange-700 text-sm"
                                                                        >
                                                                            下架
                                                                        </button>
                                                                    ) : (
                                                                        <button 
                                                                            onClick={() => handleTogglePackageStatus(pkg.id, pkg.name, "active")}
                                                                            className="text-green-600 hover:text-green-700 text-sm"
                                                                        >
                                                                            上架
                                                                        </button>
                                                                    )}
                                                                    <button 
                                                                        className="text-blue-600 hover:text-blue-700 text-sm"
                                                                        onClick={() => handleEditPackage(pkg)}
                                                                    >编辑</button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        {expandedPackageIds.includes(pkg.id) && (
                                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                                <td colSpan={11} className="py-3 px-4">
                                                                    <div className="flex items-center gap-8 text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-gray-500">创建时间：</span>
                                                                            <span className="text-gray-700">{pkg.createTime}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-gray-500">更新时间：</span>
                                                                            <span className="text-gray-700">{pkg.onSaleTime}</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* 创建/编辑套餐 - 页面内表单 */}
                            {packageSubTab === "packages" && createPackageDialogOpen && (
                                <div className="flex-1 overflow-auto">
                                    {/* 顶部导航 */}
                                    <div className="flex items-center gap-3 px-6 pt-5 pb-4">
                                        <button
                                            onClick={handleClosePackageDialog}
                                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            返回列表
                                        </button>
                                        <span className="text-gray-300">/</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {editingPackage ? '编辑套餐' : '创建套餐'}
                                        </span>
                                    </div>

                                    {/* 表单卡片 */}
                                    <div className="bg-white rounded-lg border border-gray-200 mx-6 mb-6">
                                        <div className="px-6 py-4 border-b border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {editingPackage ? '编辑套餐' : '创建套餐'}
                                            </h3>
                                        </div>

                                        <div className="p-6">
                                            <div className="space-y-5">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">套餐名称 <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={newPackage.name}
                                                        onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="请输入套餐名称"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">套餐标识 <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        value={newPackage.identifier}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/[^a-z0-9\-_]/g, '');
                                                            setNewPackage({ ...newPackage, identifier: val });
                                                        }}
                                                        disabled={!!editingPackage}
                                                        className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none ${editingPackage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'focus:border-blue-500'}`}
                                                        placeholder="仅支持小写字母、数字、-、_，如 basic-plan-01"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">选择产品 <span className="text-red-500">*</span></label>
                                                    <div className="flex items-center gap-6">
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="productType"
                                                                checked={newPackage.product === "ai-plan"}
                                                                onChange={() => setNewPackage({ ...newPackage, product: "ai-plan" })}
                                                                className="w-4 h-4 text-[#006bff] border-gray-300 focus:ring-[#006bff]"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">AI计划</span>
                                                        </label>
                                                        <label className="flex items-center cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="productType"
                                                                checked={newPackage.product === "lobster"}
                                                                onChange={() => setNewPackage({ ...newPackage, product: "lobster" })}
                                                                className="w-4 h-4 text-[#006bff] border-gray-300 focus:ring-[#006bff]"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">龙虾</span>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">官方标准价（元） <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={newPackage.price}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            setNewPackage({ ...newPackage, price: isNaN(value) ? 0 : Math.max(0, Math.round(value * 100) / 100) });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="0 表示免费"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">成本价（元） <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={newPackage.costPrice}
                                                        onChange={(e) => {
                                                            const value = parseFloat(e.target.value);
                                                            setNewPackage({ ...newPackage, costPrice: isNaN(value) ? 0 : Math.max(0, Math.round(value * 100) / 100) });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="请输入成本价"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-3">折扣设置 <span className="text-red-500">*</span></label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1.5">官方折扣 <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    max="10"
                                                                    value={newPackage.officialDiscount}
                                                                    onChange={(e) => setNewPackage({ ...newPackage, officialDiscount: e.target.value ? Number(e.target.value) : 10 })}
                                                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="如9.75"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">折</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1.5">内部折扣 <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    max="10"
                                                                    value={newPackage.internalDiscount}
                                                                    onChange={(e) => setNewPackage({ ...newPackage, internalDiscount: e.target.value ? Number(e.target.value) : 10 })}
                                                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="如9.75"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">折</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1.5">SVIP折扣 <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    max="10"
                                                                    value={newPackage.svipDiscount}
                                                                    onChange={(e) => setNewPackage({ ...newPackage, svipDiscount: e.target.value ? Number(e.target.value) : 10 })}
                                                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="如9.75"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">折</span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1.5">VIP折扣 <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    min="0.01"
                                                                    max="10"
                                                                    value={newPackage.vipDiscount}
                                                                    onChange={(e) => setNewPackage({ ...newPackage, vipDiscount: e.target.value ? Number(e.target.value) : 10 })}
                                                                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                    placeholder="如9.75"
                                                                />
                                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">折</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-2">输入折扣数值，如9.75表示9.75折，10表示不打折</p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">金额提示语</label>
                                                    <input
                                                        type="text"
                                                        value={newPackage.priceHint}
                                                        onChange={(e) => setNewPackage({ ...newPackage, priceHint: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="如：约等于X元/天"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">5小时限额</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={newPackage.hourLimit5 ?? ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value ? Math.floor(Number(e.target.value)) : null;
                                                                setNewPackage({ ...newPackage, hourLimit5: value && value >= 0 ? value : null });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="不限"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">周限额</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={newPackage.weekLimit ?? ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value ? Math.floor(Number(e.target.value)) : null;
                                                                setNewPackage({ ...newPackage, weekLimit: value && value >= 0 ? value : null });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="不限"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">月限额</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            value={newPackage.monthLimit ?? ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value ? Math.floor(Number(e.target.value)) : null;
                                                                setNewPackage({ ...newPackage, monthLimit: value && value >= 0 ? value : null });
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                            placeholder="不限"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">套餐能力说明</label>
                                                    <textarea
                                                        value={newPackage.capabilityDesc}
                                                        onChange={(e) => setNewPackage({ ...newPackage, capabilityDesc: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                        placeholder="支持GLM、Deepseek、Kimi、Qwen等AI模型；适配Claude Code、Cursor、OpenClaw等编码工具；基础技术支持；小量调用额度"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* 底部操作栏 */}
                                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                                            <button 
                                                onClick={handleClosePackageDialog}
                                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                取消
                                            </button>
                                            {!editingPackage && (
                                                <button 
                                                    onClick={() => handleCreatePackage(true)}
                                                    className="px-4 py-2 border border-[#006bff] text-[#006bff] rounded-lg text-sm hover:bg-blue-50 transition-colors"
                                                >
                                                    创建并上架
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleCreatePackage(false)}
                                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                {editingPackage ? '保存修改' : '创建'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* AI计划管理 Tab 内容 */}
                    {activeTab === "models" && (
                        <div className="p-6">
                            {/* 二级菜单 */}
                            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
                                <button
                                    onClick={() => setModelSubTab("config")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        modelSubTab === "config"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    AI能力配置
                                    {modelSubTab === "config" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                                <button
                                    onClick={() => setModelSubTab("stats")}
                                    className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                                        modelSubTab === "stats"
                                            ? "text-[#006bff]"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    使用统计
                                    {modelSubTab === "stats" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006bff]" />
                                    )}
                                </button>
                            </div>

                            {/* AI能力配置 Tab */}
                            {modelSubTab === "config" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                                        <svg className="w-5 h-5 text-[#006bff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">AI计划管理包含两个页面，AI能力配置和数据统计。逻辑请见：</span>
                                        <a
                                            href="https://hdgzgm4kjt.coze.site/claw/admin"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#006bff] hover:underline inline-flex items-center gap-1"
                                        >
                                            https://hdgzgm4kjt.coze.site/claw/admin
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                        <span className="text-sm text-gray-700">，产品：周长江。开发同学只需关注页面里的内容，左侧菜单、顶部导航等样式风格和智企框架里保持一致。</span>
                                    </div>
                                </div>
                            )}

                            {/* 使用统计 Tab */}
                            {modelSubTab === "stats" && (
                                <div className="bg-white rounded-lg border border-gray-200 p-6">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                                        <svg className="w-5 h-5 text-[#006bff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">AI计划管理包含两个页面，AI能力配置和数据统计。逻辑请见：</span>
                                        <a
                                            href="https://hdgzgm4kjt.coze.site/claw/admin"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#006bff] hover:underline inline-flex items-center gap-1"
                                        >
                                            https://hdgzgm4kjt.coze.site/claw/admin
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                        <span className="text-sm text-gray-700">，产品：周长江。开发同学只需关注页面里的内容，左侧菜单、顶部导航等样式风格和智企框架里保持一致。</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                        </>
                    )}
                </div>
            </main>

            {/* 成员管理抽屉 */}
            {memberDialogOpen && selectedTenant && (
                <div className="fixed inset-0 z-[100]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMemberDialogOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[700px] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">成员管理</h3>
                                <p className="text-sm text-gray-500 mt-1">租户：{selectedTenant.name}</p>
                            </div>
                            <button 
                                onClick={() => setMemberDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 搜索和操作栏 */}
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <div className="flex-1 relative">
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="搜索成员账号"
                                        value={memberSearchKeyword}
                                        onChange={(e) => setMemberSearchKeyword(e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <button 
                                    onClick={() => setImportMemberDialogOpen(true)}
                                    className="px-4 py-2 bg-[#006bff] text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    导入成员
                                </button>
                            </div>
                        </div>

                        {/* 成员列表 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">成员名称</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">账号ID</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">角色</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">配额</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedTenant.members
                                        .filter(member => 
                                            member.accountId.toLowerCase().includes(memberSearchKeyword.toLowerCase()) ||
                                            member.name.toLowerCase().includes(memberSearchKeyword.toLowerCase())
                                        )
                                        .map((member) => {
                                            const isUnlimited = member.quota === 0;
                                            const quotaPercentage = isUnlimited ? 0 : (member.usedQuota / member.quota) * 100;
                                            const isQuotaWarning = !isUnlimited && quotaPercentage > 90;
                                            
                                            return (
                                        <tr key={member.id} className="border-b border-gray-100">
                                            <td className="py-3 px-4 font-medium text-gray-900">{member.name}</td>
                                            <td className="py-3 px-4 text-gray-600 font-mono text-sm">{member.accountId}</td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                                    member.role === "管理员" 
                                                        ? "bg-orange-50 text-orange-700" 
                                                        : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {member.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="w-36">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className={isQuotaWarning ? "text-orange-500" : "text-gray-500"}>已用 {formatNumber(member.usedQuota)}</span>
                                                        <span className="text-gray-900 font-medium">
                                                            {isUnlimited ? '不限制' : formatNumber(member.quota)}
                                                        </span>
                                                    </div>
                                                    {!isUnlimited && (
                                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div className={`h-full ${isQuotaWarning ? 'bg-orange-500' : 'bg-[#006bff]'} rounded-full`} style={{ width: `${quotaPercentage}%` }}></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <button 
                                                    onClick={() => handleSetQuota(selectedTenant, member)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    设置配额
                                                </button>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* 抽屉底部 */}
                        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={() => setMemberDialogOpen(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 导入成员抽屉 */}
            {importMemberDialogOpen && selectedTenant && (
                <div className="fixed inset-0 z-[110]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setImportMemberDialogOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[500px] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">导入成员</h3>
                                <p className="text-sm text-gray-500 mt-1">租户：{selectedTenant.name}</p>
                            </div>
                            <button 
                                onClick={() => setImportMemberDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 抽屉内容 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-6">
                                {/* 选择企业 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">选择企业</label>
                                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500">
                                        <option value="">{selectedTenant.name}</option>
                                    </select>
                                </div>

                                {/* 成员账号 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">成员账号 <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="请输入成员账号"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">多个账号用逗号分隔，如：user1,user2,user3</p>
                                </div>

                                {/* 配额设置 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">配额设置 <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={importMemberQuota}
                                        onChange={(e) => setImportMemberQuota(e.target.value)}
                                        placeholder="请输入配额数量"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">所有导入的成员将使用相同配额</p>
                                </div>

                            </div>
                        </div>

                        {/* 抽屉底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={() => {
                                    setImportMemberDialogOpen(false);
                                    setImportMemberQuota("");
                                }}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={() => {
                                    // TODO: 实现导入成员逻辑
                                    setImportMemberDialogOpen(false);
                                    setImportMemberQuota("");
                                }}
                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            >
                                确认导入
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 添加接口抽屉 */}
            {addApiDrawerOpen && (
                <div className="fixed inset-0 z-[130]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => { setAddApiDrawerOpen(false); setEditingApiId(null); }} />
                    <div className="absolute right-0 top-0 bottom-0 w-[1100px] max-w-[94vw] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{editingApiId ? "编辑接口" : "添加接口"}</h3>
                                <p className="text-sm text-gray-500 mt-1">{editingApiId ? "修改该接口的对接信息" : "系统间调用接口"}</p>
                            </div>
                            <button
                                onClick={() => { setAddApiDrawerOpen(false); setEditingApiId(null); }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 抽屉内容 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-5">
                                {/* 所属系统 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">所属系统 <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-6 mb-3">
                                        {([
                                            { key: "platform", label: "智汇云平台" },
                                            { key: "product", label: "智汇云产品" },
                                        ] as const).map((opt) => {
                                            const active = newApiForm.systemType === opt.key;
                                            return (
                                                <label
                                                    key={opt.key}
                                                    className="flex items-center gap-2 cursor-pointer select-none"
                                                    onClick={() => {
                                                        const list = keyProductsData.filter((p) => p.systemType === opt.key);
                                                        const defaultId = list[0]?.id || "";
                                                        setNewApiForm((f) => ({ ...f, systemType: opt.key, ownerId: defaultId }));
                                                        setNewApiFormErrors((er) => ({ ...er, ownerId: "" }));
                                                    }}
                                                >
                                                    <span className={`relative flex items-center justify-center w-4 h-4 rounded-full border transition-colors ${active ? "border-[#006bff]" : "border-gray-300"}`}>
                                                        {active && <span className="w-2 h-2 rounded-full bg-[#006bff]" />}
                                                    </span>
                                                    <span className={`text-sm ${active ? "text-gray-900 font-medium" : "text-gray-600"}`}>{opt.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <select
                                        value={newApiForm.ownerId}
                                        onChange={(e) => {
                                            setNewApiForm((f) => ({ ...f, ownerId: e.target.value }));
                                            setNewApiFormErrors((er) => ({ ...er, ownerId: "" }));
                                        }}
                                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${newApiFormErrors.ownerId ? "border-red-400" : "border-gray-200"}`}
                                    >
                                        {newApiForm.systemType === "platform"
                                            ? keyProductsData.filter((p) => p.systemType === "platform").map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}（{p.identifier}）</option>
                                            ))
                                            : keyProductsData.filter((p) => p.systemType === "product").map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}（{p.identifier}）</option>
                                            ))}
                                    </select>
                                    {newApiFormErrors.ownerId && <p className="text-xs text-red-500 mt-1">{newApiFormErrors.ownerId}</p>}
                                </div>

                                {/* 权限类型 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">权限类型 <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-6">
                                        {([
                                            { key: "read", label: "只读" },
                                            { key: "readwrite", label: "读写" },
                                            { key: "manage", label: "管理", hint: "包含删除、超管等权限" },
                                        ] as const).map((opt) => {
                                            const active = newApiForm.permission === opt.key;
                                            return (
                                                <label
                                                    key={opt.key}
                                                    className="flex items-center gap-2 cursor-pointer select-none"
                                                    onClick={() => setNewApiForm((f) => ({ ...f, permission: opt.key }))}
                                                >
                                                    <span className={`relative flex items-center justify-center w-4 h-4 rounded-full border transition-colors ${active ? "border-[#006bff]" : "border-gray-300"}`}>
                                                        {active && <span className="w-2 h-2 rounded-full bg-[#006bff]" />}
                                                    </span>
                                                    <span className={`text-sm ${active ? "text-gray-900 font-medium" : "text-gray-600"}`}>{opt.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {newApiForm.permission === "manage" && (
                                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            管理权限包含删除、超管等高危操作，请谨慎授予
                                        </p>
                                    )}
                                </div>

                                {/* 接口列表（批量） */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">接口信息 <span className="text-red-500">*</span></label>
                                        {!editingApiId && <span className="text-xs text-gray-400">共 {newApiForm.rows.length} 条</span>}
                                    </div>
                                    <div className="space-y-3">
                                        {newApiForm.rows.map((row, index) => {
                                            const rowErr = newApiFormErrors.rows?.[index] || {};
                                            const textColorMap: Record<string, string> = {
                                                GET: "bg-green-500",
                                                POST: "bg-blue-500",
                                                PUT: "bg-orange-500",
                                                DELETE: "bg-red-500",
                                            };
                                            return (
                                                <div key={index} className="group border border-gray-200 rounded-lg p-4 relative transition-colors hover:border-[#006bff]/40 hover:bg-blue-50/20">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="inline-flex items-center gap-2 text-xs font-medium text-gray-500">
                                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 text-[11px] text-gray-600 group-hover:bg-[#006bff]/10 group-hover:text-[#006bff]">
                                                                {editingApiId ? "·" : index + 1}
                                                            </span>
                                                            {editingApiId ? "接口信息" : `接口 ${index + 1}`}
                                                        </span>
                                                        {newApiForm.rows.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeNewApiRow(index)}
                                                                className="flex items-center gap-1 text-xs text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                                                                title="删除此接口"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                删除
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="space-y-3">
                                                        {/* 第一行：请求方法 + 接口名称 + 接口路径 */}
                                                        <div className="grid grid-cols-12 gap-3">
                                                            {/* 请求方法 —— 下拉选择（带方法色标） */}
                                                            <div className="col-span-2">
                                                                <label className="block text-xs text-gray-500 mb-1">请求方法 <span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${textColorMap[row.method]}`} />
                                                                    <select
                                                                        value={row.method}
                                                                        onChange={(e) => updateNewApiRow(index, { method: e.target.value as ApiInterface["method"] })}
                                                                        className="w-full h-9 pl-6 pr-7 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500"
                                                                    >
                                                                        {(["GET", "POST", "PUT", "DELETE"] as const).map((m) => (
                                                                            <option key={m} value={m}>{m}</option>
                                                                        ))}
                                                                    </select>
                                                                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            {/* 接口名称 */}
                                                            <div className="col-span-3">
                                                                <label className="block text-xs text-gray-500 mb-1">接口名称 <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    value={row.name}
                                                                    onChange={(e) => updateNewApiRow(index, { name: e.target.value })}
                                                                    placeholder="如：查询实例列表"
                                                                    className={`w-full h-9 px-3 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${rowErr.name ? "border-red-400" : "border-gray-200"}`}
                                                                />
                                                                {rowErr.name && <p className="text-xs text-red-500 mt-1">{rowErr.name}</p>}
                                                            </div>
                                                            {/* 接口路径 */}
                                                            <div className="col-span-7">
                                                                <label className="block text-xs text-gray-500 mb-1">接口路径 <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    value={row.path}
                                                                    onChange={(e) => updateNewApiRow(index, { path: e.target.value })}
                                                                    placeholder="如：/api/v1/ecs/instances"
                                                                    className={`w-full h-9 px-3 border rounded-lg text-sm font-mono focus:outline-none focus:border-blue-500 ${rowErr.path ? "border-red-400" : "border-gray-200"}`}
                                                                />
                                                                {rowErr.path && <p className="text-xs text-red-500 mt-1">{rowErr.path}</p>}
                                                            </div>
                                                        </div>
                                                        {/* 第二行：接口描述 */}
                                                        <div className="grid grid-cols-12 gap-3">
                                                            {/* 接口描述 */}
                                                            <div className="col-span-12">
                                                                <label className="block text-xs text-gray-500 mb-1">接口描述</label>
                                                                <input
                                                                    type="text"
                                                                    value={row.description}
                                                                    onChange={(e) => updateNewApiRow(index, { description: e.target.value })}
                                                                    placeholder="请输入接口描述（选填）"
                                                                    className="w-full h-9 px-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {!editingApiId && (
                                        <button
                                            type="button"
                                            onClick={addNewApiRow}
                                            className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-[#006bff] hover:text-[#006bff] transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            添加一行接口
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 抽屉底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => { setAddApiDrawerOpen(false); setEditingApiId(null); }}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleSubmitNewApi}
                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            >
                                {editingApiId ? "保存修改" : "确认添加"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 删除接口二次确认弹窗 */}
            {apiDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[140]">
                    <div className="bg-white rounded-lg shadow-xl w-[400px] max-w-[90vw]">
                        <div className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-gray-900 mb-1">确认删除接口</h3>
                                    <p className="text-sm text-gray-500">
                                        删除后该接口的对接配置将被移除且无法恢复。确定要删除接口「{apiDeleteConfirm.name}」吗？
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => setApiDeleteConfirm(null)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirmDeleteApi}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 删除系统二次确认弹窗 */}
            {systemDeleteConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[140]">
                    <div className="bg-white rounded-lg shadow-xl w-[420px] max-w-[90vw]">
                        <div className="p-6">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-gray-900 mb-1">确认删除系统</h3>
                                    <p className="text-sm text-gray-500">
                                        删除系统「{systemDeleteConfirm.name}」将同时删除其下全部 {systemDeleteConfirm.apiCount} 个接口，操作不可恢复。确定要删除吗？
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                            <button
                                onClick={() => setSystemDeleteConfirm(null)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirmDeleteSystem}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 配额设置抽屉 */}
            {quotaDialogOpen && selectedMember && (
                <div className="fixed inset-0 z-[120]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setQuotaDialogOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[400px] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">设置配额</h3>
                            <button 
                                onClick={() => setQuotaDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 抽屉内容 */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">成员信息</label>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>姓名：{selectedMember.member.name}</p>
                                    <p>账号ID：{selectedMember.member.accountId}</p>
                                    <p>租户：{selectedMember.tenant.name}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">当前配额</label>
                                <div className="text-lg font-semibold text-gray-900">{formatNumber(selectedMember.member.quota)}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">新配额</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={newQuota}
                                    onChange={(e) => setNewQuota(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    placeholder="请输入新配额"
                                />
                            </div>
                        </div>

                        {/* 抽屉底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={() => setQuotaDialogOpen(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleSaveQuota}
                                className="px-4 py-2 bg-[#006bff] text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 上/下架确认弹窗 */}
            {togglePackageConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={handleCancelToggleStatus} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] overflow-hidden">
                        {/* 弹窗头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {togglePackageConfirm.action}确认
                            </h3>
                            <button 
                                onClick={handleCancelToggleStatus}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 弹窗内容 */}
                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                    togglePackageConfirm.action === "下架" 
                                        ? "bg-orange-100" 
                                        : "bg-green-100"
                                }`}>
                                    {togglePackageConfirm.action === "下架" ? (
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium mb-2">
                                        确定要{togglePackageConfirm.action}套餐「{togglePackageConfirm.name}」吗？
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {togglePackageConfirm.action === "下架" 
                                            ? "下架后该套餐将不再对用户可见，已购买用户不受影响。" 
                                            : "上架后该套餐将对用户可见并开放购买。"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 弹窗底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={handleCancelToggleStatus}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={handleConfirmToggleStatus}
                                className={`px-4 py-2 rounded-lg text-sm text-white transition-colors ${
                                    togglePackageConfirm.action === "下架" 
                                        ? "bg-orange-600 hover:bg-orange-700" 
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                确认{togglePackageConfirm.action}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 模型选择弹框 */}
            {modelSelectDialogOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setModelSelectDialogOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-2xl w-[500px] max-w-[90vw] overflow-hidden">
                        {/* 弹窗头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">选择可用模型</h3>
                            <button 
                                onClick={() => setModelSelectDialogOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* 弹窗内容 */}
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    已选择 {tempSelectedModels.length}/{ALL_MODELS.length} 个模型
                                </span>
                                <button
                                    onClick={() => {
                                        if (tempSelectedModels.length === ALL_MODELS.length) {
                                            // 月包时，取消全选保留第一个模型
                                            if (newPackage.type === 'monthly') {
                                                setTempSelectedModels([ALL_MODELS[0].id]);
                                            } else {
                                                setTempSelectedModels([]);
                                            }
                                        } else {
                                            setTempSelectedModels(ALL_MODELS.map(m => m.id));
                                        }
                                    }}
                                    className="text-sm text-[#006bff] hover:text-blue-600"
                                >
                                    {tempSelectedModels.length === ALL_MODELS.length ? '取消全选' : '全选'}
                                </button>
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {ALL_MODELS.map(model => (
                                    <label
                                        key={model.id}
                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                            tempSelectedModels.includes(model.id)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            checked={tempSelectedModels.includes(model.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setTempSelectedModels([...tempSelectedModels, model.id]);
                                                } else {
                                                    // 月包时，至少保留一个模型
                                                    if (newPackage.type === 'monthly' && tempSelectedModels.length === 1) {
                                                        return; // 不允许取消最后一个模型
                                                    }
                                                    setTempSelectedModels(tempSelectedModels.filter(id => id !== model.id));
                                                }
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{model.name}</div>
                                            <div className="text-xs text-gray-500">{model.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* 弹窗底部 */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <button 
                                onClick={() => setModelSelectDialogOpen(false)}
                                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                取消
                            </button>
                            <button 
                                onClick={() => {
                                    // 月包时，可用模型不能为空
                                    if (newPackage.type === 'monthly' && tempSelectedModels.length === 0) {
                                        alert('月包必须选择至少一个可用模型');
                                        return;
                                    }
                                    setNewPackage({ ...newPackage, availableModels: tempSelectedModels });
                                    setModelSelectDialogOpen(false);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                    newPackage.type === 'monthly' && tempSelectedModels.length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-[#006bff] text-white hover:bg-blue-600'
                                }`}
                            >
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 创建产品抽屉 */}
            {createProductDialogOpen && (
                <div className="fixed inset-0 z-[100]">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setCreateProductDialogOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-[80%] bg-white shadow-xl flex flex-col">
                        {/* 抽屉头部 */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setCreateProductDialogOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h3 className="text-lg font-semibold text-gray-900">{productDrawerMode === 'edit' ? '编辑产品' : '创建产品'}</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCreateProductDialogOpen(false)}
                                    className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-700 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={() => {
                                        // TODO: 保存产品
                                        setCreateProductDialogOpen(false);
                                    }}
                                    disabled={!newProduct.name || !newProduct.shortName || newProduct.categories.length === 0 || !newProduct.identifier || !newProduct.description || newProduct.tags.length === 0 || !newProduct.url}
                                    className={`px-4 py-1.5 text-sm rounded-lg transition-colors ${
                                        !newProduct.name || !newProduct.shortName || newProduct.categories.length === 0 || !newProduct.identifier || !newProduct.description || newProduct.tags.length === 0 || !newProduct.url
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    确定
                                </button>
                            </div>
                        </div>
                        
                        {/* 表单内容 */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {/* 产品名称 & 产品简介 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        产品名称 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        maxLength={20}
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="可包含中文、英文字母、数字、下划线(_)、中划线"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        产品简介 <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newProduct.shortName}
                                            onChange={(e) => setNewProduct({ ...newProduct, shortName: e.target.value })}
                                            placeholder="可包含中文、英文字母、数字、下划线(_)、中划线"
                                            className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                        />
                                        {/* 说明提示 icon */}
                                        <div className="relative flex-shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setDescTipOpen(!descTipOpen)}
                                                onBlur={() => setTimeout(() => setDescTipOpen(false), 150)}
                                                className={`p-1 rounded-full transition-colors ${descTipOpen ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'}`}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </button>
                                            {descTipOpen && (
                                                <div className="absolute right-0 top-7 z-20 w-64 bg-gray-800 text-white text-xs leading-relaxed rounded-lg px-3 py-2 shadow-lg">
                                                    注：收藏产品后，在导航收藏列表里展示产品的简介，建议和产品的英文名称保持一致
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 产品标识符 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品标识符 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.identifier}
                                    onChange={(e) => setNewProduct({ ...newProduct, identifier: e.target.value })}
                                    placeholder="请输入产品标识符"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 font-mono"
                                />
                            </div>

                            {/* 加入推荐 */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                                <div className="text-sm font-medium text-gray-900">加入推荐</div>

                                {/* 官网热门产品 */}
                                <div className="flex items-center gap-3">
                                    <span className="w-28 text-sm text-gray-700 text-right">官网热门产品：</span>
                                    <button
                                        onClick={() => setNewProduct({ ...newProduct, hotOfficial: !newProduct.hotOfficial })}
                                        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.hotOfficial ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.hotOfficial ? 'translate-x-5' : ''}`} />
                                    </button>
                                    <span className="text-xs text-gray-500">开启后，该产品展示在 官网&gt;产品列表&gt;热门产品 模块</span>
                                </div>

                                {/* 控制台热门产品 */}
                                <div className="flex items-center gap-3">
                                    <span className="w-28 text-sm text-gray-700 text-right">控制台热门产品：</span>
                                    <button
                                        onClick={() => setNewProduct({ ...newProduct, hotConsole: !newProduct.hotConsole })}
                                        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.hotConsole ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.hotConsole ? 'translate-x-5' : ''}`} />
                                    </button>
                                    <span className="text-xs text-gray-500">开启后，该产品展示在 控制台&gt;产品管理&gt;热门产品 模块</span>
                                </div>

                                {/* 推广标签 */}
                                <div className="flex items-center gap-3">
                                    <span className="w-28 text-sm text-gray-700 text-right">推广标签：</span>
                                    <div className="flex items-center gap-6">
                                        {[
                                            { value: 'hot', label: 'Hot' },
                                            { value: 'new', label: 'New' },
                                            { value: 'none', label: '不设置' },
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="promoTag"
                                                    value={option.value}
                                                    checked={newProduct.promoTag === option.value}
                                                    onChange={(e) => setNewProduct({ ...newProduct, promoTag: e.target.value })}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className={`text-sm ${newProduct.promoTag === option.value ? 'text-blue-600' : 'text-gray-700'}`}>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* 产品分类 & 所属产线 */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        产品分类 <span className="text-red-500">*</span>
                                    </label>
                                    {/* 已选分类标签 */}
                                    <div className="min-h-[38px] w-full px-2 py-1.5 border border-gray-300 rounded-lg flex flex-wrap items-center gap-1.5">
                                        {newProduct.categories.map((cat, index) => (
                                            <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                                                {cat}
                                                <button
                                                    onClick={() => setNewProduct({ ...newProduct, categories: newProduct.categories.filter((_, i) => i !== index) })}
                                                    className="text-gray-400 hover:text-gray-600"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </span>
                                        ))}
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value && !newProduct.categories.includes(e.target.value)) {
                                                    setNewProduct({ ...newProduct, categories: [...newProduct.categories, e.target.value] });
                                                }
                                            }}
                                            className="flex-1 min-w-[90px] bg-transparent text-sm text-gray-500 focus:outline-none"
                                        >
                                            <option value="">请选择</option>
                                            <option value="计算 / 奇云计算">计算 / 奇云计算</option>
                                            <option value="计算 / 弹性计算">计算 / 弹性计算</option>
                                            <option value="存储 / 对象存储">存储 / 对象存储</option>
                                            <option value="存储 / 文件存储">存储 / 文件存储</option>
                                            <option value="数据库 / 关系型数据库">数据库 / 关系型数据库</option>
                                            <option value="容器 / 容器服务">容器 / 容器服务</option>
                                            <option value="中间件 / 消息队列">中间件 / 消息队列</option>
                                            <option value="大数据 / 数据计算">大数据 / 数据计算</option>
                                            <option value="网络 / 负载均衡">网络 / 负载均衡</option>
                                            <option value="安全 / 主机安全">安全 / 主机安全</option>
                                            <option value="AI / 智能应用">AI / 智能应用</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        所属产线
                                    </label>
                                    <select
                                        value={newProduct.productLine}
                                        onChange={(e) => setNewProduct({ ...newProduct, productLine: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="其他">其他</option>
                                        <option value="云存储">云存储</option>
                                        <option value="云计算">云计算</option>
                                        <option value="云数据库">云数据库</option>
                                        <option value="大数据平台">大数据平台</option>
                                        <option value="AI平台">AI平台</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* 产品描述 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品描述 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={40}
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    placeholder="请输入"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                                <div className="text-xs text-gray-400 mt-1 text-right">{newProduct.description.length}/40</div>
                            </div>
                            
                            {/* 产品标签 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品标签 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap items-center gap-2">
                                    {newProduct.tags.map((tag, index) => (
                                        <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                                            {tag}
                                            <button
                                                onClick={() => setNewProduct({ ...newProduct, tags: newProduct.tags.filter((_, i) => i !== index) })}
                                                className="hover:text-blue-800"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    ))}
                                    {newProduct.tags.length < 3 && (
                                        <div className="flex items-center gap-1">
                                            <input
                                                type="text"
                                                maxLength={5}
                                                value={newProduct.tagInput}
                                                onChange={(e) => setNewProduct({ ...newProduct, tagInput: e.target.value })}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && newProduct.tagInput.trim()) {
                                                        setNewProduct({ 
                                                            ...newProduct, 
                                                            tags: [...newProduct.tags, newProduct.tagInput.trim()],
                                                            tagInput: '' 
                                                        });
                                                    }
                                                }}
                                                placeholder="输入标签"
                                                className="w-20 px-2 py-1 border border-dashed border-gray-300 rounded text-xs focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                onClick={() => {
                                                    if (newProduct.tagInput.trim()) {
                                                        setNewProduct({ 
                                                            ...newProduct, 
                                                            tags: [...newProduct.tags, newProduct.tagInput.trim()],
                                                            tagInput: '' 
                                                        });
                                                    }
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-700"
                                            >
                                                +添加标签
                                            </button>
                                        </div>
                                    )}
                                    {/* 提示与操作同行 */}
                                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        支持中英文、数字。5个字符以内，最多添加3个标签
                                    </span>
                                </div>
                            </div>

                            {/* 产品图标 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    产品图标 <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-3">
                                    <div className="w-16 h-16 border border-gray-300 rounded-lg flex items-center justify-center bg-white flex-shrink-0">
                                        {newProduct.icon ? (
                                            <div className="text-xs text-gray-500">已上传</div>
                                        ) : (
                                            <svg className="w-8 h-8 text-[#626F84]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8a2 2 0 100-4 2 2 0 000 4zM12 20a2 2 0 100-4 2 2 0 000 4zM6 14a2 2 0 100-4 2 2 0 000 4zM18 14a2 2 0 100-4 2 2 0 000 4zM12 8v8M8 12h8" />
                                            </svg>
                                        )}
                                    </div>
                                    <label className="px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer flex-shrink-0">
                                        上传图标
                                        <input
                                            type="file"
                                            accept=".svg"
                                            className="hidden"
                                            onChange={(e) => setNewProduct({ ...newProduct, icon: e.target.files?.[0] ?? null })}
                                        />
                                    </label>
                                    {/* 提示与操作同行 */}
                                    <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        SVG 格式且背景色透明，图标颜色为 #626F84
                                    </span>
                                </div>
                            </div>
                            
                            {/* URL地址 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    URL地址 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.url}
                                    onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
                                    placeholder="请输入"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            
                            {/* 介绍页地址 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    介绍页地址
                                </label>
                                <input
                                    type="text"
                                    value={newProduct.introUrl}
                                    onChange={(e) => setNewProduct({ ...newProduct, introUrl: e.target.value })}
                                    placeholder="请输入"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            
                            {/* 展示Portal */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    展示Portal <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center gap-6">
                                    {[
                                        { value: 'qihoo', label: '360集团/内部(qihoo.net)' },
                                        { value: 'external', label: '外部(360.cn)' },
                                        { value: 'both', label: '所有Portal(一个产品)' },
                                    ].map(option => (
                                        <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="networkType"
                                                value={option.value}
                                                checked={newProduct.networkType === option.value}
                                                onChange={(e) => setNewProduct({ ...newProduct, networkType: e.target.value, linkedInternalProduct: e.target.value === 'external' ? newProduct.linkedInternalProduct : '' })}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className={`text-sm ${newProduct.networkType === option.value ? 'text-blue-600' : 'text-gray-700'}`}>{option.label}</span>
                                        </label>
                                    ))}
                                </div>

                                {/* 外部(360.cn) 时可关联一个内部产品 */}
                                {newProduct.networkType === 'external' && (
                                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-700 flex-shrink-0">关联内部产品：</span>
                                            <select
                                                value={newProduct.linkedInternalProduct}
                                                onChange={(e) => setNewProduct({ ...newProduct, linkedInternalProduct: e.target.value })}
                                                className="w-72 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">请选择内部(qihoo.net)产品</option>
                                                {zhihuiProductsData.map(p => (
                                                    <option key={p.id} value={p.identifier}>{p.name}（{p.identifier}）</option>
                                                ))}
                                            </select>
                                            {newProduct.linkedInternalProduct && (
                                                <button
                                                    onClick={() => setNewProduct({ ...newProduct, linkedInternalProduct: '' })}
                                                    className="text-xs text-gray-400 hover:text-red-500"
                                                >
                                                    清除
                                                </button>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                                            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            选填，最多关联一个内部(qihoo.net)产品，关联后两侧产品的资源与计费数据可打通
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* 展示范围 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    展示范围
                                </label>
                                <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                    {[
                                        { value: 'all', label: '所有企业可见' },
                                        { value: 'specified', label: '指定企业可见' },
                                        { value: 'excluded', label: '指定企业不可见' },
                                    ].map((option, idx) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setNewProduct({ ...newProduct, visibility: option.value })}
                                            className={`px-4 py-1.5 text-sm transition-colors ${idx > 0 ? 'border-l border-gray-300' : ''} ${
                                                newProduct.visibility === option.value
                                                    ? 'bg-blue-50 text-blue-600'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>

                                {/* 指定企业列表 */}
                                {newProduct.visibility !== 'all' && (
                                    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                                        {newProduct.visibilityEnterprises.map((ent, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={ent.id}
                                                    onChange={(e) => {
                                                        const list = [...newProduct.visibilityEnterprises];
                                                        list[index] = { ...list[index], id: e.target.value };
                                                        setNewProduct({ ...newProduct, visibilityEnterprises: list });
                                                    }}
                                                    placeholder="请输入企业ID"
                                                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                                <input
                                                    type="text"
                                                    value={ent.name}
                                                    onChange={(e) => {
                                                        const list = [...newProduct.visibilityEnterprises];
                                                        list[index] = { ...list[index], name: e.target.value };
                                                        setNewProduct({ ...newProduct, visibilityEnterprises: list });
                                                    }}
                                                    placeholder="企业名称"
                                                    className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                                {newProduct.visibilityEnterprises.length > 1 && (
                                                    <button
                                                        onClick={() => setNewProduct({ ...newProduct, visibilityEnterprises: newProduct.visibilityEnterprises.filter((_, i) => i !== index) })}
                                                        className="p-1.5 text-gray-400 hover:text-red-500"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, visibilityEnterprises: [...newProduct.visibilityEnterprises, { id: '', name: '' }] })}
                                            className="w-full py-2 text-sm text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                                        >
                                            添加企业
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {/* 分隔线 */}
                            <div className="border-t border-gray-200 pt-5">
                                {/* 产品审核开通 */}
                                <div className="mb-5">
                                    <div className="flex items-center gap-1 mb-1.5">
                                        <label className="text-sm font-medium text-gray-700">产品审核开通</label>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {[
                                            { value: 'default', label: '默认开通' },
                                            { value: 'manual', label: '人工审核' },
                                            { value: 'auto', label: '自动审核' },
                                            { value: 'none', label: '不需要开通' },
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="auditType"
                                                    value={option.value}
                                                    checked={newProduct.auditType === option.value}
                                                    onChange={(e) => setNewProduct({ ...newProduct, auditType: e.target.value })}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className={`text-sm ${newProduct.auditType === option.value ? 'text-blue-600' : 'text-gray-700'}`}>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* 开关类设置 */}
                                <div className="space-y-4">
                                    {/* 工单排班表管理 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">工单排班表管理：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, workOrderSchedule: !newProduct.workOrderSchedule })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.workOrderSchedule ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.workOrderSchedule ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>
                                    
                                    {/* 计费开通 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">计费开通：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, billingEnabled: !newProduct.billingEnabled })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.billingEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.billingEnabled ? 'translate-x-5' : ''}`} />
                                        </button>
                                        <span className="text-xs text-gray-500">开启后，该产品在计费相关页面的产品列表里展示</span>
                                    </div>
                                    
                                    {/* 产品文档 */}
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">产品文档：</span>
                                            <button
                                                onClick={() => setNewProduct({ ...newProduct, docEnabled: !newProduct.docEnabled })}
                                                className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.docEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            >
                                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.docEnabled ? 'translate-x-5' : ''}`} />
                                            </button>
                                        </div>
                                        {newProduct.docEnabled && (
                                            <div className="ml-[140px] mt-2 bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                <label className="flex items-center gap-1.5 cursor-pointer mb-2">
                                                    <input
                                                        type="radio"
                                                        name="docType"
                                                        value="apicloud"
                                                        checked={newProduct.docType === 'apicloud'}
                                                        onChange={(e) => setNewProduct({ ...newProduct, docType: e.target.value })}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                    <span className="text-sm font-medium text-blue-600">APIcloud文档链接</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newProduct.docUrl}
                                                    onChange={(e) => setNewProduct({ ...newProduct, docUrl: e.target.value })}
                                                    placeholder="https://apicloud.360.cn/user/apistore"
                                                    className="w-72 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* API文档 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">API文档：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, apiDocEnabled: !newProduct.apiDocEnabled })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.apiDocEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.apiDocEnabled ? 'translate-x-5' : ''}`} />
                                        </button>
                                    </div>

                                    {/* 是否在控制台展示 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">是否在控制台展示：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, showInConsole: !newProduct.showInConsole })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.showInConsole ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.showInConsole ? 'translate-x-5' : ''}`} />
                                        </button>
                                        <span className="text-xs text-gray-500">关闭后，该产品不在控制台及导航产品列表里展示</span>
                                    </div>

                                    {/* 是否在官网展示 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">是否在官网展示：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, showInWebsite: !newProduct.showInWebsite })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.showInWebsite ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.showInWebsite ? 'translate-x-5' : ''}`} />
                                        </button>
                                        <span className="text-xs text-gray-500">关闭后，该产品不在官网列表里展示</span>
                                    </div>

                                    {/* 资源组授权 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">资源组授权：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, resourceGroupAuth: !newProduct.resourceGroupAuth })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.resourceGroupAuth ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.resourceGroupAuth ? 'translate-x-5' : ''}`} />
                                        </button>
                                        <span className="text-xs text-gray-500">开启后，该产品在资源组授权的产品列表里展示</span>
                                    </div>

                                    {/* 资源上报 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">资源上报：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, resourceReport: !newProduct.resourceReport })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.resourceReport ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.resourceReport ? 'translate-x-5' : ''}`} />
                                        </button>
                                        <span className="text-xs text-gray-500">开启后，表示该产品已上报资源，控制台首页会展示当前产品已创建资源及具体数量</span>
                                    </div>

                                    {/* 仅在工单展示 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">仅在工单展示：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, onlyInWorkOrder: !newProduct.onlyInWorkOrder })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.onlyInWorkOrder ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.onlyInWorkOrder ? 'translate-x-5' : ''}`} />
                                        </button>
                                        <span className="text-xs text-gray-500">开启后，该产品仅在工单产品列表里展示</span>
                                    </div>
                                    
                                    {/* 预留金额 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">预留金额：</span>
                                        <input
                                            type="number"
                                            min={0}
                                            value={newProduct.reserveAmount}
                                            onChange={(e) => setNewProduct({ ...newProduct, reserveAmount: Number(e.target.value) })}
                                            className="w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                        />
                                        <span className="text-sm text-gray-500">元</span>
                                        <span className="text-xs text-gray-500">设置金额，业务产品在用户使用产品时校验对应企业下的余额</span>
                                    </div>

                                    {/* 回调设置 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">回调设置：</span>
                                        <button
                                            onClick={() => setCallbackDialogOpen(true)}
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            点击设置
                                        </button>
                                        {newProduct.callbackUrl && (
                                            <span className="text-xs text-gray-500 truncate max-w-md">已配置：{newProduct.callbackUrl}</span>
                                        )}
                                    </div>

                                    {/* 管理后台 */}
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">管理后台：</span>
                                            <div className="flex items-center gap-6">
                                                {[
                                                    { value: 'none', label: '无' },
                                                    { value: 'has', label: '有' },
                                                ].map(option => (
                                                    <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="adminBackend"
                                                            value={option.value}
                                                            checked={newProduct.adminBackend === option.value}
                                                            onChange={(e) => setNewProduct({ ...newProduct, adminBackend: e.target.value })}
                                                            className="w-4 h-4 text-blue-600"
                                                        />
                                                        <span className={`text-sm ${newProduct.adminBackend === option.value ? 'text-blue-600' : 'text-gray-700'}`}>{option.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        {newProduct.adminBackend === 'has' && (
                                            <div className="ml-[140px] mt-2">
                                                <input
                                                    type="text"
                                                    value={newProduct.adminBackendUrl}
                                                    onChange={(e) => setNewProduct({ ...newProduct, adminBackendUrl: e.target.value })}
                                                    placeholder="请输入管理后台地址"
                                                    className="w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* 地域可用区 */}
                                    <div className="flex items-center gap-3">
                                        <span className="w-32 text-sm text-gray-700 text-right flex-shrink-0">地域可用区：</span>
                                        <button
                                            onClick={() => setNewProduct({ ...newProduct, regionEnabled: !newProduct.regionEnabled })}
                                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${newProduct.regionEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${newProduct.regionEnabled ? 'translate-x-5' : ''}`} />
                                        </button>
                                        <span className="text-xs text-gray-500">开启后，当前产品需区分可用区信息，智汇云提供查询接口</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 回调设置弹窗 */}
            {callbackDialogOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setCallbackDialogOpen(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-[480px]">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                            <h3 className="text-base font-semibold text-gray-900">回调设置</h3>
                            <button onClick={() => setCallbackDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">回调地址</label>
                                <input
                                    type="text"
                                    value={newProduct.callbackUrl}
                                    onChange={(e) => setNewProduct({ ...newProduct, callbackUrl: e.target.value })}
                                    placeholder="请输入回调地址，如 https://example.com/callback"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">回调密钥</label>
                                <input
                                    type="text"
                                    value={newProduct.callbackSecret}
                                    onChange={(e) => setNewProduct({ ...newProduct, callbackSecret: e.target.value })}
                                    placeholder="请输入回调密钥"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-200">
                            <button
                                onClick={() => setCallbackDialogOpen(false)}
                                className="px-4 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                取消
                            </button>
                            <button
                                onClick={() => setCallbackDialogOpen(false)}
                                className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
