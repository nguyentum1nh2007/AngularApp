export type TransactionType = 'IN' | 'OUT'; // IN: Nhập, OUT: Xuất

export interface TransactionDetail {
    productId: string;
    quantity: number;
    price: number;
}

export interface StockTransaction {
    id: string;
    type: TransactionType;
    createdAt: string;
    note: string;
    details: TransactionDetail[];
}