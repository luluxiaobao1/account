// 套餐数据类型定义与初始 mock 数据

export interface Package {
    id: number;
    name: string;
    identifier: string;
    product: "ai-plan" | "lobster";
    description: string;
    type: "monthly" | "addon"; // monthly: 月包, addon: 加油包
    price: number;
    costPrice?: number;
    priceHint?: string;
    hourLimit5?: number | null;
    weekLimit?: number | null;
    monthLimit?: number | null;
    capabilityDesc?: string;
    lobsterCount: number;
    memberCount: number;
    availableModels?: string[];
    purchaseLimit: number | null;
    stock: number | null;
    officialDiscount: number;
    internalDiscount: number;
    svipDiscount: number;
    vipDiscount: number;
    features: string[];
    status: "active" | "inactive";
    soldCount: number;
    totalIncome: number;
    createTime: string;
    onSaleTime: string;
}

// 初始套餐 mock 数据
export const initialPackages: Package[] = [
    {
        id: 1,
        name: "基础版月包",
        identifier: "basic-monthly-01",
        product: "ai-plan",
        description: "适合小型团队的入门套餐",
        type: "monthly",
        price: 299,
        costPrice: 150,
        priceHint: "每月299元起",
        hourLimit5: 100,
        weekLimit: 2000,
        monthLimit: 8000,
        capabilityDesc: "包含基础模型调用能力，适合轻量使用场景",
        lobsterCount: 2,
        memberCount: 10,
        availableModels: ["doubao-lite", "deepseek-chat"],
        purchaseLimit: null,
        stock: null,
        officialDiscount: 10,
        internalDiscount: 8,
        svipDiscount: 9,
        vipDiscount: 9.5,
        features: ["2个龙虾", "基础模型支持"],
        status: "active",
        soldCount: 234,
        totalIncome: 69966,
        createTime: "2026-03-01 10:00:00",
        onSaleTime: "2026-03-02 09:00:00",
    },
    {
        id: 2,
        name: "专业版月包",
        identifier: "pro-monthly-01",
        product: "ai-plan",
        description: "适合中型团队的专业套餐",
        type: "monthly",
        price: 999,
        costPrice: 500,
        priceHint: "每月999元起",
        hourLimit5: 500,
        weekLimit: 10000,
        monthLimit: 40000,
        capabilityDesc: "包含全部模型调用能力，支持高并发场景",
        lobsterCount: 5,
        memberCount: 50,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: null,
        stock: null,
        officialDiscount: 10,
        internalDiscount: 7,
        svipDiscount: 8,
        vipDiscount: 9,
        features: ["5个龙虾", "全部模型支持"],
        status: "active",
        soldCount: 156,
        totalIncome: 155844,
        createTime: "2026-03-01 10:30:00",
        onSaleTime: "2026-03-02 09:00:00",
    },
    {
        id: 3,
        name: "企业版月包",
        identifier: "enterprise-monthly-01",
        product: "ai-plan",
        description: "适合大型企业的旗舰套餐",
        type: "monthly",
        price: 4999,
        costPrice: 2500,
        priceHint: "每月4999元起",
        hourLimit5: null,
        weekLimit: null,
        monthLimit: 200000,
        capabilityDesc: "不限速全模型调用，专属技术支持",
        lobsterCount: 30,
        memberCount: 200,
        availableModels: ["doubao-pro", "doubao-lite", "deepseek-chat", "kimi"],
        purchaseLimit: null,
        stock: null,
        officialDiscount: 10,
        internalDiscount: 6,
        svipDiscount: 7,
        vipDiscount: 8,
        features: ["30个龙虾", "全部模型支持"],
        status: "active",
        soldCount: 45,
        totalIncome: 224955,
        createTime: "2026-03-01 11:00:00",
        onSaleTime: "2026-03-02 09:00:00",
    },
    {
        id: 4,
        name: "Token加油包",
        identifier: "token-addon-01",
        product: "ai-plan",
        description: "临时补充Token额度",
        type: "addon",
        price: 99,
        costPrice: 40,
        priceHint: "100万Token",
        hourLimit5: null,
        weekLimit: null,
        monthLimit: null,
        capabilityDesc: "为已有月包用户补充Token额度",
        lobsterCount: 0,
        memberCount: 0,
        availableModels: [],
        purchaseLimit: 10,
        stock: 1000,
        officialDiscount: 10,
        internalDiscount: 10,
        svipDiscount: 10,
        vipDiscount: 10,
        features: ["0个龙虾", "基础模型支持"],
        status: "active",
        soldCount: 512,
        totalIncome: 50688,
        createTime: "2026-03-05 14:00:00",
        onSaleTime: "2026-03-05 15:00:00",
    },
    {
        id: 5,
        name: "龙虾体验包",
        identifier: "lobster-trial-01",
        product: "lobster",
        description: "龙虾智能助手体验套餐",
        type: "monthly",
        price: 0,
        costPrice: 0,
        priceHint: "免费体验",
        hourLimit5: 20,
        weekLimit: 200,
        monthLimit: 500,
        capabilityDesc: "限量免费体验龙虾智能助手",
        lobsterCount: 1,
        memberCount: 3,
        availableModels: ["doubao-lite"],
        purchaseLimit: 1,
        stock: 500,
        officialDiscount: 10,
        internalDiscount: 10,
        svipDiscount: 10,
        vipDiscount: 10,
        features: ["1个龙虾", "基础模型支持"],
        status: "inactive",
        soldCount: 328,
        totalIncome: 0,
        createTime: "2026-03-10 09:00:00",
        onSaleTime: "2026-03-20 18:00:00",
    },
];
