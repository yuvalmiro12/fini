import SwiftUI
import Combine

enum TabID: String, CaseIterable {
    case chat, insights, data
}

enum ScreenID: String {
    case chat, brief, addTx, insights, savings, data, transactions, couples, paywall, txDetail
    case obWelcome, obGoal, obIncome, obPlan
}

enum Plan: String {
    case free, pro, proPlus
}

struct Transaction: Identifiable {
    let id: String
    let cat: String
    let title: String
    let subtitle: String
    let amount: Double
    let date: String
    var flag: String? = nil
    var address: String? = nil
    var paymentMethod: String? = nil
}

struct TransactionGroup: Identifiable {
    let id = UUID()
    let label: String
    let items: [Transaction]
}

struct SavingsGoal {
    let name: String
    let target: Double
    let current: Double
    let monthly: Double
    let eta: String
}

struct ChatMessage: Identifiable {
    let id: String
    let role: String // "fini" | "user"
    let body: String
    let time: String
    var chips: [String] = []
}

class AppState: ObservableObject {
    @Published var currentTab: TabID = .chat
    @Published var currentScreen: ScreenID = .obWelcome
    @Published var onboardingComplete: Bool = false
    @Published var plan: Plan = .proPlus
    @Published var showTxDetail: Bool = false
    @Published var showAddTx: Bool = false
    @Published var showPaywall: Bool = false
    @Published var showSavings: Bool = false
    @Published var showCouples: Bool = false
    @Published var showTransactions: Bool = false
    @Published var selectedTransaction: Transaction? = nil

    static let shared = AppState()

    // Seed transactions
    let transactions: [TransactionGroup] = [
        TransactionGroup(label: "היום · 14 בנובמבר", items: [
            Transaction(id: "t1", cat: "food", title: "לחמים", subtitle: "08:12 · כרטיס אשראי", amount: -68, date: "2024-11-14", address: "רחוב אבן גבירול 139, תל אביב", paymentMethod: "כרטיס אשראי · 4821"),
            Transaction(id: "t2", cat: "salary", title: "משכורת · סטארטאפ", subtitle: "07:30 · העברה", amount: 12400, date: "2024-11-14"),
        ]),
        TransactionGroup(label: "אתמול", items: [
            Transaction(id: "t3", cat: "grocery", title: "שופרסל דיל", subtitle: "מכולת", amount: -214, date: "2024-11-13"),
            Transaction(id: "t4", cat: "transport", title: "Gett", subtitle: "תחבורה · ×3", amount: -82, date: "2024-11-13"),
            Transaction(id: "t5", cat: "fun", title: "סינמה סיטי", subtitle: "בילוי", amount: -96, date: "2024-11-13"),
        ]),
        TransactionGroup(label: "12 בנובמבר", items: [
            Transaction(id: "t6", cat: "rent", title: "שכר דירה · נובמבר", subtitle: "הוראת קבע", amount: -3200, date: "2024-11-12"),
            Transaction(id: "t7", cat: "phone", title: "Bezeq", subtitle: "אינטרנט", amount: -99, date: "2024-11-12", flag: "זוהה כחדש"),
            Transaction(id: "t8", cat: "utility", title: "חברת חשמל", subtitle: "חשבונות", amount: -288, date: "2024-11-12"),
        ]),
    ]

    let savingsGoal = SavingsGoal(name: "טיול ליפן · אוקטובר 2026", target: 15000, current: 8420, monthly: 650, eta: "אוג")

    let chatMessages: [ChatMessage] = [
        ChatMessage(id: "m1", role: "fini", body: "בוקר טוב נועה ☀️ שמחה לראות אותך.", time: "08:00"),
        ChatMessage(id: "m2", role: "fini", body: "הבוקר נכנסה משכורת של ₪12,400. רוצה שנחלק אותה לפי היעדים שלך?", time: "08:00", chips: ["חלקי אוטומטית", "לא תודה", "תזכירי לי בערב"]),
        ChatMessage(id: "m3", role: "user", body: "שילמתי 68 ש״ח על קפה ומאפה ב״לחמים״", time: "08:15"),
        ChatMessage(id: "m4", role: "fini", body: "סידרתי\! הוספתי למסעדות:", time: "08:15", chips: ["קבעי תקציב לקטגוריה", "הראי לי פירוט"]),
    ]
}
