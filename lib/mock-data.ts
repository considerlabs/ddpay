export type ContractType = "월세" | "물류대금" | "경조사비" | "학원비" | "운영/용역비" | "운영비" | "인건비" | "배달비";
export type ApprovalStatus = "승인대기" | "승인완료" | "반려";
export type PaymentMethod = "수동" | "자동";
export type PaymentStatus = "결제완료" | "결제실패" | "송금대기" | "송금완료" | "결제대기";

export interface Contract {
  id: string;
  type: ContractType;
  name: string;
  registeredAt: string;
  approvalStatus: ApprovalStatus;
  paymentMethod: PaymentMethod;
  paymentDay?: number;
  transferAmount: number;
  totalAmount: number;
  senderName: string;
  counterparty: {
    type: "개인" | "사업자";
    name: string;
    idNumber: string;
    bank: string;
    accountNumber: string;
    accountHolder: string;
  };
  documents: string[];
  completedCount: number;
}

export interface Payment {
  id: string;
  contractId: string;
  contractName: string;
  serviceType: ContractType;
  date: string;
  contractNo: string;
  transferAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  cardStatus: "결제완료" | "결제실패" | "결제대기" | null;
  cardFailReason?: string;
  cardName?: string;
  cardCompletedAt?: string;
  transferStatus: "송금완료" | "송금대기" | "송금실패" | null;
  bank?: string;
  accountNumber?: string;
  accountHolder?: string;
  transferCompletedAt?: string;
  approverName?: string;
  idNumber?: string;
  contractRegisteredAt?: string;
  attachments?: string[];
}

export const mockContracts: Contract[] = [
  {
    id: "1",
    type: "월세",
    name: "월세(홍길동월세)",
    registeredAt: "2026-06-17",
    approvalStatus: "승인대기",
    paymentMethod: "수동",
    transferAmount: 100,
    totalAmount: 107,
    senderName: "ㅋㅋㅋ",
    counterparty: {
      type: "개인",
      name: "홍길동",
      idNumber: "800505-1●●●●●●",
      bank: "국민은행",
      accountNumber: "11111111111",
      accountHolder: "홍길동",
    },
    documents: ["신분증/사업자등록증_01", "입금 통장 사본_01", "임대차계약서 등_01"],
    completedCount: 0,
  },
  {
    id: "2",
    type: "배달비",
    name: "배달비(ㄱㄱ)",
    registeredAt: "2025-12-10",
    approvalStatus: "승인완료",
    paymentMethod: "수동",
    transferAmount: 50000,
    totalAmount: 53300,
    senderName: "ㅋㅋㅋa",
    counterparty: {
      type: "사업자",
      name: "ㄱㄱ",
      idNumber: "2678702747",
      bank: "신한은행",
      accountNumber: "110369844940",
      accountHolder: "테스트",
    },
    documents: ["신분증/사업자등록증.png", "입금통장사본.png", "충전계좌 화면 캡처본.png"],
    completedCount: 0,
  },
  {
    id: "3",
    type: "배달비",
    name: "배달비(김승욱)",
    registeredAt: "2025-12-10",
    approvalStatus: "승인완료",
    paymentMethod: "수동",
    transferAmount: 50000,
    totalAmount: 53300,
    senderName: "김승욱",
    counterparty: {
      type: "개인",
      name: "김승욱",
      idNumber: "950120-1●●●●●●",
      bank: "신한은행",
      accountNumber: "110369844940",
      accountHolder: "김승욱",
    },
    documents: ["신분증/사업자등록증.png", "입금통장사본.png"],
    completedCount: 0,
  },
  {
    id: "4",
    type: "배달비",
    name: "배달비(ㄴㄴㅁ)",
    registeredAt: "2025-12-10",
    approvalStatus: "승인완료",
    paymentMethod: "수동",
    transferAmount: 30000,
    totalAmount: 31980,
    senderName: "ㄴㄴㅁ",
    counterparty: {
      type: "사업자",
      name: "ㄴㄴㅁ",
      idNumber: "1234567890",
      bank: "국민은행",
      accountNumber: "123456789012",
      accountHolder: "테스트2",
    },
    documents: ["신분증/사업자등록증.png"],
    completedCount: 0,
  },
  {
    id: "5",
    type: "운영/용역비",
    name: "운영/용역비(김승욱)",
    registeredAt: "2026-01-02",
    approvalStatus: "승인완료",
    paymentMethod: "수동",
    transferAmount: 5000,
    totalAmount: 5165,
    senderName: "김승욱",
    counterparty: {
      type: "개인",
      name: "김승욱",
      idNumber: "950120-1●●●●●●",
      bank: "신한은행",
      accountNumber: "110369844940",
      accountHolder: "김승욱",
    },
    documents: ["신분증/사업자등록증.png", "입금통장사본.png", "지급명세서 또는 근로계약서.png"],
    completedCount: 1,
  },
  {
    id: "6",
    type: "월세",
    name: "월세(김스웅ㄱ)",
    registeredAt: "2026-01-02",
    approvalStatus: "승인완료",
    paymentMethod: "수동",
    transferAmount: 50000,
    totalAmount: 51650,
    senderName: "김스웅ㄱ",
    counterparty: {
      type: "개인",
      name: "김스웅ㄱ",
      idNumber: "800101-1●●●●●●",
      bank: "신한은행",
      accountNumber: "110369844940",
      accountHolder: "김스웅",
    },
    documents: ["신분증/사업자등록증.png", "입금통장사본.png", "임대차계약서.png"],
    completedCount: 1,
  },
];

export const mockPayments: Payment[] = [
  {
    id: "p1",
    contractId: "5",
    contractName: "운영/용역비(김승욱)",
    serviceType: "운영/용역비",
    date: "2026-01-02",
    contractNo: "26010200000005",
    transferAmount: 5000,
    totalAmount: 5165,
    paymentMethod: "수동",
    cardStatus: "결제실패",
    cardFailReason: "실패 [가맹점에 빌키아이디가 존재하지않습니다.] 카드사 확인 등록카드 확인",
    cardName: "신한카드(94001)",
    cardCompletedAt: "2026-01-02",
    transferStatus: "송금대기",
    bank: "신한은행",
    accountNumber: "110369844940",
    approverName: "김승욱",
    idNumber: "950120-1●●●●●●",
    contractRegisteredAt: "2026-01-02",
    attachments: ["신분증/사업자등록증", "입금통장사본", "지급명세서 또는 근로계약서"],
  },
  {
    id: "p2",
    contractId: "6",
    contractName: "월세(김스웅ㄱ)",
    serviceType: "월세",
    date: "2026-01-02",
    contractNo: "26010200000006",
    transferAmount: 50000,
    totalAmount: 51650,
    paymentMethod: "수동",
    cardStatus: "결제대기",
    cardName: "신한카드(94001)",
    transferStatus: "송금대기",
    bank: "신한은행",
    accountNumber: "110369844940",
    approverName: "김스웅ㄱ",
    idNumber: "800101-1●●●●●●",
    contractRegisteredAt: "2026-01-02",
    attachments: ["신분증/사업자등록증", "입금통장사본", "임대차계약서"],
  },
];

export const mockUser = {
  id: "ST001",
  storeName: "D [불광]짬뽕의달인(도착5분전 메세지)",
  storeCode: "S285489",
  version: "1.1.0",
  phone: "01091812230",
  senderName: "ㅋㅋㅋ",
  dailyLimit: 110000,
  monthlyLimit: 10000000,
  cards: [
    { id: "c1", name: "신한카드", last4: "0153", status: "정상" },
  ],
};

export function formatAmount(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

export function getMonthlyStats(contracts: Contract[]) {
  const pending = contracts.filter((c) => c.approvalStatus === "승인대기").length;
  const rejected = contracts.filter((c) => c.approvalStatus === "반려").length;
  const approved = contracts.filter((c) => c.approvalStatus === "승인완료").length;
  return { pending, rejected, approved, total: contracts.length };
}

// 신규 계약등록 화면에서 등록한 계약을 브라우저에 보관해 등록현황 목록에도 노출한다.
const USER_CONTRACTS_KEY = "ddpay:userContracts";

export function loadUserContracts(): Contract[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USER_CONTRACTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addUserContract(contract: Contract) {
  const next = [contract, ...loadUserContracts()];
  localStorage.setItem(USER_CONTRACTS_KEY, JSON.stringify(next));
}

export function getAllContracts(): Contract[] {
  return [...loadUserContracts(), ...mockContracts];
}
