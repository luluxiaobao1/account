// 套餐 API 的 mock 实现（使用 localStorage 持久化，用于本地原型预览）
import { type Package, initialPackages } from "./packages-data";

const STORAGE_KEY = "accountadmin_packages";

// 模拟网络延迟
const delay = (ms: number = 200) => new Promise((resolve) => setTimeout(resolve, ms));

// 从 localStorage 读取套餐列表（首次使用初始数据）
function loadPackages(): Package[] {
    if (typeof window === "undefined") return [...initialPackages];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
            return JSON.parse(raw) as Package[];
        }
    } catch (e) {
        console.warn("读取本地套餐数据失败，使用初始数据", e);
    }
    savePackages(initialPackages);
    return [...initialPackages];
}

// 保存套餐列表到 localStorage
function savePackages(packages: Package[]) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(packages));
    } catch (e) {
        console.warn("保存本地套餐数据失败", e);
    }
}

// 格式化当前时间为 "YYYY-MM-DD HH:mm:ss"
function nowString(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// 获取套餐列表
export async function fetchPackages(): Promise<Package[]> {
    await delay();
    return loadPackages();
}

// 创建套餐
export async function createPackageApi(
    payload: Partial<Package>,
    shouldPublish: boolean = false,
): Promise<Package> {
    await delay();
    const packages = loadPackages();
    const maxId = packages.reduce((max, p) => Math.max(max, p.id), 0);
    const now = nowString();
    const newPkg: Package = {
        id: maxId + 1,
        name: payload.name || "未命名套餐",
        identifier: payload.identifier || `pkg-${maxId + 1}`,
        product: payload.product || "ai-plan",
        description: payload.description || "",
        type: payload.type || "monthly",
        price: payload.price ?? 0,
        costPrice: payload.costPrice ?? 0,
        priceHint: payload.priceHint || "",
        hourLimit5: payload.hourLimit5 ?? null,
        weekLimit: payload.weekLimit ?? null,
        monthLimit: payload.monthLimit ?? null,
        capabilityDesc: payload.capabilityDesc || "",
        lobsterCount: payload.lobsterCount ?? 0,
        memberCount: payload.memberCount ?? 0,
        availableModels: payload.availableModels || [],
        purchaseLimit: payload.purchaseLimit ?? null,
        stock: payload.stock ?? null,
        officialDiscount: payload.officialDiscount ?? 10,
        internalDiscount: payload.internalDiscount ?? 10,
        svipDiscount: payload.svipDiscount ?? 10,
        vipDiscount: payload.vipDiscount ?? 10,
        features: payload.features || [],
        status: shouldPublish ? "active" : "inactive",
        soldCount: 0,
        totalIncome: 0,
        createTime: now,
        onSaleTime: now,
    };
    packages.unshift(newPkg);
    savePackages(packages);
    return newPkg;
}

// 更新套餐
export async function updatePackageApi(
    id: number,
    updates: Record<string, unknown>,
): Promise<Package> {
    await delay();
    const packages = loadPackages();
    const index = packages.findIndex((p) => p.id === id);
    if (index === -1) {
        throw new Error(`套餐不存在: id=${id}`);
    }
    const updated: Package = {
        ...packages[index],
        ...(updates as Partial<Package>),
        onSaleTime: nowString(),
    };
    packages[index] = updated;
    savePackages(packages);
    return updated;
}

// 上架/下架套餐
export async function setPackageStatusApi(
    id: number,
    status: "active" | "inactive",
): Promise<Package> {
    await delay();
    const packages = loadPackages();
    const index = packages.findIndex((p) => p.id === id);
    if (index === -1) {
        throw new Error(`套餐不存在: id=${id}`);
    }
    const updated: Package = {
        ...packages[index],
        status,
        onSaleTime: nowString(),
    };
    packages[index] = updated;
    savePackages(packages);
    return updated;
}
